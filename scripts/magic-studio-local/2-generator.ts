import { readQueue, updateTransaction } from './queue/queueManager.js';
import { logInfo, logSuccess, logError, logProgress } from './utils/logger.js';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'studio-outputs');

// Garante que o diretório de outputs existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateImagen3(id: string, prompt: string): Promise<string> {
  const localPath = path.join(OUTPUT_DIR, `${id}.jpg`);
  
  logProgress('2-generator.ts', `[API IMAGEN 4.0] Solicitando geração de elite para ID: ${id}...`);
  
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) throw new Error('Chave GEMINI_API_KEY não encontrada no ambiente.');

  // Usamos o modelo imagen-4.0-generate-001 (ou imagen-3.0-generate-001 caso prefira)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${key}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "3:4" // Formato ideal para roupas e retratos
      }
    })
  });

  const data = await response.json() as any;

  if (!response.ok) {
    // Tratamento de erros, incluindo limite de free tier ou falta de saldo
    throw new Error(`Erro na API do Imagen: ${data.error?.message || JSON.stringify(data)}`);
  }

  // A API do Imagen retorna um array 'predictions' contendo a imagem em base64
  const base64Image = data.predictions?.[0]?.bytesBase64Encoded || data.predictions?.[0]?.image?.imageBytes;
  
  if (!base64Image) {
    throw new Error('Nenhuma imagem foi retornada na resposta da API.');
  }

  // Converte base64 para buffer físico e salva no disco
  const buffer = Buffer.from(base64Image, 'base64');
  fs.writeFileSync(localPath, buffer);
  
  return path.relative(process.cwd(), localPath).replace(/\\/g, '/');
}

async function generateNanoBananaFallback(id: string, prompt: string): Promise<string> {
  const localPath = path.join(OUTPUT_DIR, `${id}.jpg`);
  
  logProgress('2-generator.ts', `[FALLBACK NANO BANANA] Iniciando geração gratuita para ID: ${id}...`);
  
  // Utiliza a API pública e gratuita do Pollinations.ai (Nano Banana)
  const seed = Math.floor(Math.random() * 1000000);
  const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1350&nologo=true&seed=${seed}`;
  
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error('Falha catastrófica no motor Nano Banana.');
  
  const buffer = await response.buffer();
  fs.writeFileSync(localPath, buffer);
  
  return path.relative(process.cwd(), localPath).replace(/\\/g, '/');
}

async function runGenerator() {
  logInfo('2-generator.ts', 'Iniciando varredura de tarefas pendentes na Fila...');
  
  const queue = readQueue();
  const pendingTransactions = queue.transactions.filter(t => t.status === 'pending');
  
  if (pendingTransactions.length === 0) {
    logSuccess('2-generator.ts', 'Nenhuma tarefa pendente na fila.');
    return;
  }
  
  logInfo('2-generator.ts', `Encontradas ${pendingTransactions.length} tarefas pendentes.`);
  
  for (const task of pendingTransactions) {
    try {
      logProgress('2-generator.ts', `Processando CENA: "${task.metadata.angleName}"`);
      logInfo('2-generator.ts', `Prompt enviado: "${task.metadata.scenePrompt}"`);
      
      let savedPath: string;
      try {
        // Gera diretamente via Nano Banana Gratuito (Pollinations AI) conforme solicitado para testes livres de custo
        savedPath = await generateNanoBananaFallback(task.id, task.metadata.scenePrompt);
        
        updateTransaction(
          task.id, 
          { status: 'local_rendered', localFilePath: savedPath }, 
          `[SUCESSO] Imagem gerada gratuitamente via Nano Banana e salva em: ${savedPath}`
        );
      } catch (primaryError: any) {
        logError('2-generator.ts', `Falha no Nano Banana (${primaryError.message}). Usando fallback de contingência...`);
        
        // Em caso de falha crítica do Nano Banana, tenta usar o Imagen
        savedPath = await generateImagen3(task.id, task.metadata.scenePrompt);
        
        updateTransaction(
          task.id, 
          { status: 'local_rendered', localFilePath: savedPath }, 
          `[SUCESSO/IMAGEN] Imagem gerada via Gemini Imagen e salva em: ${savedPath}`
        );
      }
      
      logSuccess('2-generator.ts', `Cena [${task.metadata.angleName}] processada e salva em ${savedPath}`);
      
    } catch (error: any) {
      logError('2-generator.ts', `Falha ao processar cena ${task.id}`, error);
      updateTransaction(task.id, { status: 'failed_retry' }, `Falha ao gerar imagem: ${error.message}`);
    }
  }
  
  logSuccess('2-generator.ts', 'Varredura de geração finalizada.');
}

runGenerator();
