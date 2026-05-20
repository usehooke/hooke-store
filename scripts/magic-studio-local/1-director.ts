import { GoogleGenerativeAI } from '@google/generative-ai';
import { createTransaction } from './queue/queueManager.js';
import { logInfo, logSuccess, logError } from './utils/logger.js';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!key) {
  logError('1-director.ts', 'Chave Gemini não encontrada no ambiente.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);

async function runDirector(theme: string) {
  logInfo('1-director.ts', `Iniciando decupagem de arte para o tema: "${theme}"`);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      VOCÊ É O DIRETOR DE ARTE DA HOOKE STORE.
      Sua missão é quebrar o tema "${theme}" em um ensaio fotográfico coeso de 3 a 5 cenas.

      REGRAS DE OURO ABSOLUTAS:
      - FIDELIDADE: O rosto e corpo do Fundador (Fernando) são a prioridade absoluta. Homem de 43 anos, 173cm, 96kg. Cabelo com divisão no meio.
      - PRODUTO: Camisetas premium lisas ou com gráficos.
      - BRANDING: Etiqueta Woven de alta definição aparente.
      - ESTÉTICA: 'Soft Brutalism', tons sóbrios.

      IMPORTANTE: Responda APENAS com o objeto JSON abaixo, sem texto adicional.
      {
        "campaignTitle": "string",
        "scenes": [
          { "angleName": "string", "scenePrompt": "detalhes hiper realistas" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("IA não retornou um formato JSON válido.");
    }

    const planData = JSON.parse(jsonMatch[0]);

    logSuccess('1-director.ts', `Plano criado: "${planData.campaignTitle}" com ${planData.scenes.length} cenas.`);

    // Inserir cada cena na Fila Resiliente
    for (const scene of planData.scenes) {
      const transactionId = crypto.randomUUID();
      
      createTransaction({
        id: transactionId,
        theme: planData.campaignTitle,
        status: "pending",
        metadata: { 
          // Guardaremos dados cruciais aqui pra passar de fase pra fase
          angleName: scene.angleName,
          scenePrompt: scene.scenePrompt 
        }
      });
      
      logSuccess('1-director.ts', `Cena [${scene.angleName}] engatilhada na Fila -> ID: ${transactionId}`);
    }

  } catch (error: any) {
    logError('1-director.ts', 'Falha na geração do plano', error);
  }
}

// Inicializa a partir do comando via CLI: `npx ts-node 1-director.ts "Retro Kombi"`
const themeArg = process.argv[2];
if (!themeArg) {
  logError('1-director.ts', 'Você deve fornecer um tema. Exemplo: npx ts-node scripts/magic-studio-local/1-director.ts "Camisa Vintage"');
  process.exit(1);
}

runDirector(themeArg);
