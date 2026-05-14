import { z } from "zod";

// 🛡️ HOOKE HQ: AI EVALUATION SCHEMA
export const AIEvaluationSchema = z.object({
  matchesFernandoFace: z.boolean(),
  isWovenLabel: z.boolean(),
  isQuietLuxuryAesthetic: z.boolean(),
  score: z.number().min(0).max(10),
  reasoning: z.string().describe("Breve explicação técnica da nota"),
});

export type AIEvaluation = z.infer<typeof AIEvaluationSchema>;

// 🎬 HOOKE HQ: CAMPAIGN SCHEMA
export const CampaignPlanSchema = z.object({
  campaignTitle: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  scenes: z.array(z.object({
    id: z.string(),
    angleName: z.string(),
    scenePrompt: z.string().describe("Prompt ultra-detalhado injetando as Regras de Ouro da marca"),
  })).min(4).max(5),
});

export type CampaignPlan = z.infer<typeof CampaignPlanSchema>;
