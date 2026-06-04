import { GoogleGenerativeAI } from '@google/generative-ai';
import { logInfo, logSuccess, logError, logProgress } from './utils/logger';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!key) {
  logError('5-clone-founder.ts', 'Chave Gemini não encontrada no ambiente.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'studio-outputs');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function getImageData(input: string) {
  const cleanPath = input.replace(/^"|"$/g, '').trim();
  if (cleanPath.startsWith('http')) {
    const res = await fetch(cleanPath);
    if (!res.ok) throw new Error('Falha ao baixar imagem: ' + cleanPath);
    const buffer = await res.buffer();
    return { data: buffer.toString('base64'), mimeType: res.headers.get('content-type') || 'image/jpeg' };
  } else {
    if (!fs.existsSync(cleanPath)) throw new Error('Arquivo não encontrado no seu PC: ' + cleanPath);
    const buffer = fs.readFileSync(cleanPath);
    const ext = path.extname(cleanPath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    return { data: buffer.toString('base64'), mimeType };
  }
}

async function runCloner(personImageInput: string, productContextInput: string) {
  logInfo('5-clone-founder.ts', `Iniciando Motor de Clonagem...`);

  try {
    logProgress('5-clone-founder.ts', `1. Carregando foto de referência da pessoa...`);
    const personImage = await getImageData(personImageInput);

    let productPromptText = productContextInput;
    let productImage: any = null;

    // Tenta encontrar um caminho de arquivo local (.png ou .jpg) dentro do segundo argumento
    const imagePathRegex = /([^",\s]+?\.(png|jpg|jpeg))/i;
    const match = productContextInput.match(imagePathRegex);
    
    if (match) {
      const pPath = match[1];
      logProgress('5-clone-founder.ts', `   Encontrada foto do produto localmente: ${pPath}`);
      productImage = await getImageData(pPath);
      // Remove o caminho do arquivo do texto para não sujar o prompt
      productPromptText = productContextInput.replace(pPath, '').replace(/""/g, '').replace(/^,|,$/g, '').trim();
    }

    logProgress('5-clone-founder.ts', `2. Analisando arquivos com Gemini Vision (Dupla Visão)...`);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const promptVision = `
      Você é um Diretor de Arte fotorealista especialista em Midjourney/Stable Diffusion.
      Analise a primeira imagem (foto do modelo).
      Crie um PROMPT EM INGLÊS extremamente detalhado que recrie exatamente essa pessoa (mesmo rosto, biotipo, cabelo, pose geral).
      
      ${productImage ? "A SEGUNDA IMAGEM em anexo é a roupa/produto que você DEVE vestir a pessoa no prompt." : `Você DEVE vestir a pessoa com o seguinte produto da Hooke Store: "${productPromptText}".`}
      
      Diretrizes do Prompt:
      - Foque no padrão E-commerce High-End (Estilo SSENSE/Farfetch). Fotografia de catálogo de moda (8k, raw photo, sharp focus).
      - CENÁRIO E ILUMINAÇÃO DE CATÁLOGO: O fundo deve ser OBRIGATORIAMENTE BRANCO PURO (pure white seamless studio background). A iluminação deve ser clara, brilhante e uniforme (flat studio lighting), sem sombras dramáticas. A luz serve apenas para revelar a cor real e os detalhes da roupa.
      - POSES E ENQUADRAMENTO: Pose estática e neutra de catálogo (mãos relaxadas). O enquadramento deve ser focado na roupa (geralmente cortando na altura da coxa/joelhos).
      - BIOTIPO E CORPO RIGOROSOS: Mantenha o corpo exato da Foto 1 (atlético, ombros largos, porte físico forte/"stocky"). Isso é crucial para o caimento correto e padronizado da roupa na loja.
      - DESCRIÇÃO FACIAL EXTREMAMENTE LITERAL: Descreva o rosto e cabelo do modelo EXATAMENTE como na foto 1. Se o cabelo for raspado (buzz cut), diga buzz cut. Seja cirúrgico para preparar o terreno para o Face Swap posterior.
      - DESTAQUE ABSOLUTO PARA A ROUPA: O produto é o protagonista. A roupa deve estar perfeitamente iluminada, destacando a textura, o caimento (heavyweight, etc) e a qualidade.
      ${productPromptText ? "- INSTRUÇÃO DE POSE E PRODUTO: " + productPromptText : ""}
      
      IMPORTANTE: Retorne APENAS o texto do prompt em inglês, sem aspas, sem explicações.
    `;

    const payloadParts: any[] = [promptVision, { inlineData: personImage }];
    if (productImage) {
      payloadParts.push({ inlineData: productImage });
    }

    const result = await model.generateContent(payloadParts);
    const generatedPrompt = result.response.text().trim();
    logSuccess('5-clone-founder.ts', `Prompt mestre gerado:\n"${generatedPrompt}"`);

    logProgress('5-clone-founder.ts', `3. Renderizando imagem com Nano Banana (Pollinations AI)...`);

    const id = `clone-${Date.now()}`;
    const localPath = path.join(OUTPUT_DIR, `${id}.jpg`);
    
    // Limpar aspas do prompt do Gemini para evitar erros de interpretação
    const cleanPrompt = generatedPrompt.replace(/^"|"$/g, '').trim();
    
    // 3. Renderizar com Nano Banana via GET na camada 100% gratuita
    const seed = Math.floor(Math.random() * 1000000);
    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1080&height=1350&seed=${seed}`;
    
    try {
      const pollinationsResp = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/jpeg'
        }
      });

      if (!pollinationsResp.ok) {
        throw new Error(`Falha no Nano Banana: ${pollinationsResp.statusText}`);
      }

      const finalBuffer = await pollinationsResp.buffer();
      fs.writeFileSync(localPath, finalBuffer);
      
      const relativePath = path.relative(process.cwd(), localPath).replace(/\\/g, '/');
      logSuccess('5-clone-founder.ts', `SUCESSO TOTAL! Nova foto de campanha salva em: ${relativePath}`);
      
    } catch (apiError: any) {
      logError('5-clone-founder.ts', `O gerador de imagens bloqueou o pedido (Limite grátis atingido / ${apiError.message}).`);
      
      // FALLBACK: Salvar o prompt mestre em um arquivo TXT para o usuário copiar
      const txtPath = path.join(OUTPUT_DIR, `${id}-prompt.txt`);
      fs.writeFileSync(txtPath, cleanPrompt);
      logSuccess('5-clone-founder.ts', `O Prompt Mestre perfeito foi salvo em: ${path.relative(process.cwd(), txtPath)}`);
      logProgress('5-clone-founder.ts', `Cole o texto desse arquivo no ChatGPT Plus, Midjourney ou Bing Image Creator para gerar a foto!`);
    }

  } catch (error: any) {
    logError('5-clone-founder.ts', 'Falha no processo de clonagem', error);
  }
}

const photoUrlArg = process.argv[2];
const productArg = process.argv[3];

if (!photoUrlArg || !productArg) {
  logError('5-clone-founder.ts', 'Uso incorreto. Exemplo: npx tsx scripts/magic-studio-local/5-clone-founder.ts "C:\\caminho\\foto.png" "C:\\caminho\\produto.png, pose relaxada"');
  process.exit(1);
}

runCloner(photoUrlArg, productArg);
