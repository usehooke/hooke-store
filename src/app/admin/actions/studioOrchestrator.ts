"use server";

import { evaluateMagicStudioImage } from "./evaluateMagicStudioImage";

/**
 * HOOKE HQ: MAGIC STUDIO ORCHESTRATOR
 * Coordena a geração e a auditoria de imagens usando o fluxo de Self-Correction.
 */
export async function generateAndAuditMagicImage(prompt: string) {
  const MAX_RETRIES = 3;
  let currentPrompt = prompt;
  let attempt = 0;

  console.log(`[ORCHESTRATOR] Iniciando fluxo de geração de elite para: "${prompt}"`);

  while (attempt < MAX_RETRIES) {
    attempt++;
    console.log(`[ORCHESTRATOR] Tentativa ${attempt} de ${MAX_RETRIES}...`);

    // 1. GERAÇÃO (Nano Banana 2 - Gemini 3 Flash Image)
    // Motor focado em alta fidelidade facial e composição têxtil.
    const generatedImageBase64 = await mockNanoBanana2Generation(currentPrompt);

    // 2. AVALIAÇÃO (Gemini 3.1 Pro)
    const result = await evaluateMagicStudioImage(generatedImageBase64);

    if (result.success) {
      console.log(`[ORCHESTRATOR] Imagem aprovada com nota ${result.evaluation?.score}.`);
      return {
        success: true,
        image: generatedImageBase64,
        evaluation: result.evaluation,
        attempts: attempt
      };
    }

    // 3. AUTO-CORREÇÃO (Feedback Loop)
    console.warn(`[ORCHESTRATOR] Falha na avaliação. Ajustando estratégia...`);
    
    // Injetamos o feedback técnico do avaliador no próximo prompt
    currentPrompt = `
      ${prompt}. 
      AJUSTE TÉCNICO NECESSÁRIO: O avaliador anterior rejeitou a imagem pelo seguinte motivo: ${result.evaluation?.reasoning}.
      FOQUE EM: Melhorar a fidelidade facial e garantir a etiqueta Woven Label.
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
