"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIEvaluationSchema, AIEvaluation } from "@/features/studio/schemas/aiSchemas";

/**
 * MISSION: HOOKE HQ - AI IMAGE AUDITOR (GEMINI 1.5 FLASH)
 */
export async function evaluateMagicStudioImage(base64Image: string): Promise<{
  success: boolean;
  evaluation?: AIEvaluation;
  error?: string;
  latencyMs?: number;
}> {
  const startTime = Date.now();
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!key) return { success: false, error: "Chave Gemini não configurada." };

  try {
    const genAI = new GoogleGenerativeAI(key);
    
    // 1. Configuração do Modelo (Foco em Visão de Alta Precisão)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. Prompt Estratégico (O "Tribunal de Estética" da Hooke)
    const prompt = `
      VOCÊ É O AUDITOR CHEFE DE QUALIDADE DA HOOKE STORE.
      Sua missão é avaliar uma imagem gerada por IA (Nano Banana 2) contra os padrões 'Elite' da marca.

      REGRAS DE AVALIAÇÃO:
      1. FIDELIDADE FACIAL: O rosto na imagem deve manter 100% das características do Fernando (Fundador).
      2. ETIQUETA WOVEN: Deve haver uma etiqueta física tecida de alta definição. Rejeite terminantemente qualquer sinal de Silk-Screen ou estampas de baixa qualidade.
      3. ESTÉTICA QUIET LUXURY: A composição deve ser minimalista, sofisticada, com tons sóbrios e 'Soft Brutalism'.

      IMPORTANTE: Responda APENAS com o objeto JSON abaixo, sem texto adicional ou markdown.
      RETORNE UM JSON NO SEGUINTE FORMATO:
      {
        "matchesFernandoFace": boolean,
        "isWovenLabel": boolean,
        "isQuietLuxuryAesthetic": boolean,
        "score": number (0-10),
        "reasoning": "string"
      }
    `;

    // 3. Processamento de Visão
    const pureBase64 = base64Image.split(",")[1] || base64Image;
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: pureBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // 4. Validação Zod (Blindagem de Dados)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("IA não retornou um JSON válido na avaliação.");
    }
    const rawData = JSON.parse(jsonMatch[0]);
    const evaluation = AIEvaluationSchema.parse(rawData);

    const endTime = Date.now();
    const latencyMs = endTime - startTime;

    // 5. Telemetria e Logs de Auditoria
    console.log(`[AI-EVAL] Image Audited. Score: ${evaluation.score}/10. Latency: ${latencyMs}ms`);

    // 6. Lógica de Retentativa (Auto-Correction)
    if (!evaluation.matchesFernandoFace || !evaluation.isWovenLabel || !evaluation.isQuietLuxuryAesthetic || evaluation.score < 10) {
      console.warn(`[AI-EVAL] Rejeição detectada: ${evaluation.reasoning}`);
      return JSON.parse(JSON.stringify({ success: false, evaluation, latencyMs, error: "Imagem não atingiu os critérios Elite de fidelidade." }));
    }

    return JSON.parse(JSON.stringify({ success: true, evaluation, latencyMs }));

  } catch (error: any) {
    console.error("[AI-EVAL] Erro crítico na auditoria:", error);
    return JSON.parse(JSON.stringify({ success: false, error: error.message, latencyMs: Date.now() - startTime }));
  }
}
