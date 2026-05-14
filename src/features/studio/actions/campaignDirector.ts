"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { generateAndAuditMagicImage } from "@/app/admin/actions/studioOrchestrator";

// 🎬 HOOKE HQ: CAMPAIGN SCHEMA
// Estrutura para o planejamento do ensaio fotográfico.
export const CampaignPlanSchema = z.object({
  campaignTitle: z.string(),
  scenes: z.array(z.object({
    id: z.string(),
    angleName: z.string(),
    scenePrompt: z.string().describe("Prompt ultra-detalhado injetando as Regras de Ouro da marca"),
  })).min(4).max(5),
});

export type CampaignPlan = z.infer<typeof CampaignPlanSchema>;

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * 1. O DIRETOR DE ARTE (Decupagem do Tema)
 * Apenas planeja a campanha sem executar a geração.
 */
export async function planCampaign(themeDescription: string): Promise<{ success: boolean; plan?: CampaignPlan; error?: string }> {
  if (!API_KEY) return { success: false, error: "Chave Gemini não configurada." };

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-pro",
      generationConfig: { responseMimeType: "application/json" }
    });

    const directorPrompt = `
      VOCÊ É O DIRETOR DE ARTE DA HOOKE STORE.
      Sua missão é quebrar o tema "${themeDescription}" em um ensaio fotográfico coeso de 4 a 5 cenas.

      REGRAS DE OURO ABSOLUTAS (Injete em CADA prompt de cena):
      - FIDELIDADE: O rosto e corpo do Fundador (Fernando) são a prioridade absoluta e imutável. Homem de 43 anos, estrutura física robusta com 173cm de altura e 96kg. O detalhe crucial e inegociável: o cabelo se divide naturalmente no meio. Proibida qualquer mutação facial, cortes de cabelo diferentes ou proporções físicas distorcidas.
      - PRODUTO: Foco em camisetas premium (lisas ou com gráficos de carros clássicos: Fusca, Kombi). NUNCA gere looks completos ou sobreposições pesadas.
      - BRANDING: Detalhe a Etiqueta Woven (tecida) em alta definição. Logo Wordmark HOOKE refinado.
      - ESTÉTICA: 'Soft Brutalism', minimalismo, tons sóbrios.

      FORMATO DE RETORNO (JSON):
      {
        "campaignTitle": "Nome épico da campanha",
        "scenes": [
          { "id": "uuid", "angleName": "Ex: Close-up Etiqueta", "scenePrompt": "Prompt detalhado..." }
        ]
      }
    `;

    const planResult = await model.generateContent(directorPrompt);
    const planData = JSON.parse(planResult.response.text());
    const campaignPlan = CampaignPlanSchema.parse(planData);

    return { success: true, plan: campaignPlan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * MISSION: HOOKE HQ - AI CAMPAIGN DIRECTOR
 * Orquestra a execução completa (Plano + Geração).
 */
export async function createAndExecuteCampaign(themeDescription: string) {
  const planResult = await planCampaign(themeDescription);
  if (!planResult.success || !planResult.plan) return planResult;

  const campaignPlan = planResult.plan;

  try {
    console.log(`[CAMPAIGN] Plano "${campaignPlan.campaignTitle}" gerado com ${campaignPlan.scenes.length} cenas.`);

    // 2. ORQUESTRAÇÃO EM LOTE (Execução Paralela com EDD)
    const generationPromises = campaignPlan.scenes.map((scene) => 
      generateAndAuditMagicImage(scene.scenePrompt)
    );

    const results = await Promise.allSettled(generationPromises);

    // 3. CONSOLIDAÇÃO DA COLEÇÃO
    const finalCollection = results.map((res, index) => {
      const scene = campaignPlan.scenes[index];
      if (res.status === 'fulfilled') {
        return {
          id: scene.id,
          angle: scene.angleName,
          ...res.value
        };
      } else {
        return {
          id: scene.id,
          angle: scene.angleName,
          success: false,
          error: "Erro crítico na orquestração da cena."
        };
      }
    });

    const allApproved = finalCollection.every(item => item.success);

    return {
      success: allApproved,
      campaignTitle: campaignPlan.campaignTitle,
      collection: finalCollection,
      totalScenes: campaignPlan.scenes.length,
      approvedScenes: finalCollection.filter(item => item.success).length
    };

  } catch (error: any) {
    console.error("[CAMPAIGN] Falha na direção da campanha:", error);
    return { success: false, error: error.message };
  }
}
