import { GoogleGenerativeAI } from '@google/generative-ai';
import { readQueue, updateTransaction } from './queue/queueManager.js';
import { logInfo, logSuccess, logError, logProgress } from './utils/logger.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!key) {
  logError('3-auditor.ts', 'Chave Gemini não encontrada no ambiente.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);

// Converte o arquivo local para o formato aceito pelo Gemini Vision
function fileToGenerativePart(filePath: string, mimeType: string) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(absolutePath)).toString("base64"),
      mimeType
    },
  };
}

async function runAuditor() {
  logInfo('3-auditor.ts', 'Iniciando auditoria das imagens renderizadas localmente...');
  
  const queue = readQueue();
  const renderedTasks = queue.transactions.filter(t => t.status === 'local_rendered');
  
  if (renderedTasks.length === 0) {
    logSuccess('3-auditor.ts', 'Nenhuma imagem aguardando auditoria na fila.');
    return;
  }
  
  logInfo('3-auditor.ts', `Encontradas ${renderedTasks.length} imagens para auditar.`);
  
  for (const task of renderedTasks) {
    try {
      if (!task.localFilePath) {
        throw new Error('Caminho do arquivo local não informado.');
      }
      
      logProgress('3-auditor.ts', `Auditando imagem da CENA [${task.metadata.angleName}] - Ficheiro: ${task.localFilePath}`);
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const imagePart = fileToGenerativePart(task.localFilePath, 'image/jpeg');

      // O TRIBUNAL ESTÉTICO + COPYWRITER DE LUXO
      const prompt = `
        VOCÊ É O AUDITOR CHEFE E COPYWRITER DE LUXO DA HOOKE STORE.
        Analise a imagem anexada baseando-se estritamente nas regras da nossa marca e gere um objeto JSON.

        REGRAS DE AUDITORIA:
        1. ETIQUETA WOVEN: Deve haver uma etiqueta física tecida costurada (Woven Label) com o logo HOOKE de alta definição visível. Rejeite estampas Silk-Screen baratas.
        2. ESTÉTICA QUIET LUXURY: A foto deve ser minimalista, tons sóbrios, corte perfeito da roupa (Soft Brutalism).
        3. ROSTO DO FERNANDO: O rosto deve ser fiel ao fundador (Fernando, 43 anos, cabelo partido ao meio, porte robusto).

        SE A IMAGEM PASSAR NA SUA AVALIAÇÃO (Score >= 7), GERE METADADOS DE LUXO IMPECÁVEIS:
        - Título: Nomes afiados e minimalistas (ex: T-Shirt Pima Boxy).
        - Copy: Copywriting de luxo, sem clichês ("confortável", "legal"), descreva o caimento da malha pesada, a arquitetura da gola e a etiqueta tecida.
        - Categoria: Identifique se é Oversized, Vintage, Regata, etc.
        - Keywords: 5 tags SEO de cauda longa baseadas na imagem.

        IMPORTANTE: Responda APENAS com o objeto JSON abaixo, sem texto adicional.
        {
          "matchesFernandoFace": true/false,
          "isWovenLabel": true/false,
          "isQuietLuxuryAesthetic": true/false,
          "score": 0-10,
          "reasoning": "Sua explicação técnica da auditoria",
          
          "metadata": {
            "title": "string",
            "luxuryDescription": "string",
            "suggestedPrice": 189.90,
            "category": "string",
            "fabric": "100% Algodão Pima ou similar que pareça na foto",
            "model": "Boxy Fit ou similar",
            "seoKeywords": ["array", "de", "5", "tags"]
          }
        }
      `;

      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("IA não retornou uma estrutura JSON válida na auditoria.");
      }

      const evaluation = JSON.parse(jsonMatch[0]);
      
      logInfo('3-auditor.ts', `Resultado do Tribunal Estético: Nota ${evaluation.score}/10`);
      logInfo('3-auditor.ts', `Justificativa: "${evaluation.reasoning}"`);
      
      if (evaluation.score >= 7) {
        // APROVADO: Sobe de nível na fila e injeta os metadados gerados pela IA
        updateTransaction(
          task.id,
          {
            status: 'queued_upload',
            metadata: {
              ...task.metadata,
              ...evaluation.metadata // Mescla os metadados refinados de SEO
            }
          },
          `[APROVADO] Nota ${evaluation.score}/10. Metadados de luxo gerados: "${evaluation.metadata.title}"`
        );
        logSuccess('3-auditor.ts', `Cena [${task.metadata.angleName}] APROVADA e qualificada para Upload.`);
      } else {
        // REJEITADO: Volta para re-processamento
        updateTransaction(
          task.id,
          { status: 'failed_retry' },
          `[REJEITADO] Nota ${evaluation.score}/10. Razão: ${evaluation.reasoning}`
        );
        logError('3-auditor.ts', `Cena [${task.metadata.angleName}] REJEITADA pelo Tribunal.`);
      }

    } catch (error: any) {
      logError('3-auditor.ts', `Falha ao auditar cena ${task.id}`, error);
    }
  }

  logSuccess('3-auditor.ts', 'Auditoria finalizada.');
}

runAuditor();
