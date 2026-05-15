"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { CampaignPlanSchema, CampaignPlan } from "../schemas/aiSchemas";
import { generateAndAuditMagicImage } from "@/app/admin/actions/studioOrchestrator";

/**
 * 1. O DIRETOR DE ARTE (Decupagem do Tema)
 */
export async function planCampaign(themeDescription: string): Promise<{ success: boolean; plan?: any; error?: string }> {
  try {
    const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!key) return { success: false, error: "Chave Gemini não configurada." };

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    }, { apiVersion: "v1" });

    const directorPrompt = `
      VOCÊ É O DIRETOR DE ARTE DA HOOKE STORE.
      Sua missão é quebrar o tema "${themeDescription}" em um ensaio fotográfico coeso de 4 a 5 cenas.

      REGRAS DE OURO ABSOLUTAS (Injete em CADA prompt de cena):
      - FIDELIDADE: O rosto e corpo do Fundador (Fernando) são a prioridade absoluta e imutável. Homem de 43 anos, estrutura física robusta com 173cm de altura e 96kg. Cabelo com divisão no meio.
      - PRODUTO: Foco em camisetas premium (lisas ou com gráficos de carros clássicos: Fusca, Kombi).
      - BRANDING: Detalhe a Etiqueta Woven em alta definição. Logo Wordmark HOOKE.
      - ESTÉTICA: 'Soft Brutalism', minimalismo, tons sóbrios.

      FORMATO DE RETORNO (JSON):
      {
        "campaignTitle": "string",
        "scenes": [
          { "id": "uuid", "angleName": "string", "scenePrompt": "string" }
        ]
      }
    `;

    const planResult = await model.generateContent(directorPrompt);
    const text = planResult.response.text();
    
    if (!text) throw new Error("IA retornou resposta vazia.");

    let planData;
    try {
      const cleanText = text.replace(/```json\n?|```/g, "").trim();
      planData = JSON.parse(cleanText);
    } catch (e) {
      console.error("[CAMPAIGN_DIRECTOR] JSON Parse Error:", text);
      return { success: false, error: "IA gerou um formato inválido." };
    }

    // Validação Zod com captura de erro específica
    const validation = CampaignPlanSchema.safeParse(planData);
    if (!validation.success) {
      console.error("[CAMPAIGN_DIRECTOR] Zod Error:", validation.error.format());
      return { success: false, error: "Estrutura do plano de campanha inválida." };
    }

    return JSON.parse(JSON.stringify({ success: true, plan: validation.data }));
  } catch (error: any) {
    console.error("[CAMPAIGN_DIRECTOR] Erro Fatal:", error);
    return { success: false, error: "Falha na API: " + error.message };
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
    const generationPromises = campaignPlan.scenes.map((scene: any) => 
      generateAndAuditMagicImage(scene.scenePrompt)
    );

    const results = await Promise.allSettled(generationPromises);

    // 3. CONSOLIDAÇÃO DA COLEÇÃO
    const finalCollection = results.map((res, index) => {
      const scene: any = campaignPlan.scenes[index];
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

    return JSON.parse(JSON.stringify({
      success: allApproved,
      campaignTitle: campaignPlan.campaignTitle,
      collection: finalCollection,
      totalScenes: campaignPlan.scenes.length,
      approvedScenes: finalCollection.filter((item: any) => item.success).length
    }));

  } catch (error: any) {
    console.error("[CAMPAIGN] Falha na direção da campanha:", error);
    return { success: false, error: error.message };
  }
}
