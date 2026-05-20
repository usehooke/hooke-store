"use server";

import { evaluateMagicStudioImage } from "./evaluateMagicStudioImage";
import { mapProductToModel } from "../../../lib/productMapper";

/**
 * HOOKE HQ: MAGIC STUDIO ORCHESTRATOR
 * Coordena a geração, a vestimenta matemática (VTON) e a auditoria de imagens.
 */
export async function generateAndAuditMagicImage(prompt: string, productPath?: string) {
  const MAX_RETRIES = 3;
  let attempt = 0;
  
  // Auto-detectamos o produto real da Hooke com base no prompt se não for passado explicitamente
  let detectedProduct = productPath || "produtos/HK_PROD_VI_FUSCA_BLACK_02.png";
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes("kombi")) {
    detectedProduct = "produtos/camiseta-vintage-kombi-offwhite-1.jpg";
  } else if (promptLower.includes("maverick")) {
    detectedProduct = "produtos/camiseta-vintage-maverik-areia-1.jpg";
  } else if (promptLower.includes("fusca")) {
    detectedProduct = "produtos/HK_PROD_VI_FUSCA_BLACK_02.png";
  }

  // Modificamos o prompt para instruir o motor a gerar o modelo vestindo uma camiseta neutra (molde)
  let currentPrompt = `
    ${prompt}. 
    DETALHE CRUCIAL DE MODELAGEM: Fernando deve estar vestindo obrigatoriamente uma camiseta premium lisa e neutra (branca ou preta), totalmente sem estampas, logos, bordados ou desenhos, servindo de tela limpa para o mapeador.
  `;

  console.log(`[ORCHESTRATOR] Iniciando fluxo VTON Nativo para: "${prompt}" com produto: "${detectedProduct}"`);

  while (attempt < MAX_RETRIES) {
    attempt++;
    console.log(`[ORCHESTRATOR] Tentativa ${attempt} de ${MAX_RETRIES}...`);

    // 1. GERAÇÃO (Modelo Base - Camiseta Lisa)
    const generatedImageBase64 = await mockNanoBanana2Generation(currentPrompt);

    // 1.5. VESTIMENTA DE PRODUTO (O Arquiteto Matemático VTON)
    // Aplica matematicamente a roupa real no corpo do Fernando
    const dressedImageBase64 = await mapProductToModel(generatedImageBase64, detectedProduct);

    // 2. AVALIAÇÃO FINAL (Tribunal de Estética)
    const result = await evaluateMagicStudioImage(dressedImageBase64);

    if (result.success) {
      console.log(`[ORCHESTRATOR] Imagem final vestida APROVADA com nota ${result.evaluation?.score}.`);
      return {
        success: true,
        image: dressedImageBase64,
        evaluation: result.evaluation,
        attempts: attempt
      };
    }

    // 3. AUTO-CORREÇÃO (Feedback Loop)
    console.warn(`[ORCHESTRATOR] Rejeitado pelo Tribunal. Ajustando prompt da base...`);
    
    currentPrompt = `
      ${prompt}.
      O modelo deve vestir camiseta premium lisa neutra (branca ou preta) sem nenhuma estampa.
      AJUSTE TÉCNICO NECESSÁRIO DO AUDITOR: ${result.evaluation?.reasoning}.
    `;
  }

  return {
    success: false,
    error: "O sistema não conseguiu atingir o padrão Elite após 3 tentativas.",
    attempts: attempt
  };
}

/**
 * NANO BANANA 2 GENERATION (GEMINI 3 FLASH IMAGE)
 * Motor central de geração de alta fidelidade.
 */
async function mockNanoBanana2Generation(prompt: string): Promise<string> {
  // Simulando latência de geração
  await new Promise(r => setTimeout(r, 2000));
  
  // Retorna um placeholder ou uma imagem base64 fake
  return "data:image/jpeg;base64,...(generated_content)...";
}
