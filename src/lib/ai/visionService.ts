"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIProductAnalysis {
  title: string;
  category: string;
  luxuryDescription: string;
  suggestedPrice: number;
  fabric: string;
  model: string;
  seoKeywords: string[];
  imageUrl?: string;
}

export type AIResponse = 
  | { success: true; data: AIProductAnalysis }
  | { success: false; error: string };

export async function analyzeProductImage(base64Image: string): Promise<AIResponse> {
  if (!API_KEY) {
    return { success: false, error: "Chave API não configurada no servidor (Vercel)." };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      VOCÊ É O 'GUARDIÃO SEO' E DIRETOR DE ARTE DA HOOKE STORE.
      Sua missão é analisar imagens de roupas masculinas e gerar um objeto JSON rigoroso.

      ESTÉTICA DA MARCA: 'Quiet Luxury' e 'Soft Brutalism'. Foco em minimalismo, sofisticação fria e modelagem arquitetônica.
      Nós NÃO vendemos 'looks completos', focamos em peças básicas premium e camisetas com texturas perfeitas.

      REGRAS DE REDAÇÃO (LUXURY COPYWRITING):
      - ELEVAÇÃO TÁTIL: Nunca use palavras como 'confortável', 'legal' ou 'bonita'. Use 'arquitetura têxtil', 'caimento estruturado', 'gramatura premium' e 'toque frio'.
      - O DETALHE ASSINATURA: Destaque a nossa etiqueta física de alta definição (Woven Label). Exalte que é uma peça de engenharia com refino tipográfico puro (Wordmark).
      - SEO DENSO: Gere palavras-chave de cauda longa baseadas na cor exata, textura visual e corte.

      RETORNO OBRIGATÓRIO EM JSON (SEM MARKDOWN):
      {
        "title": "Nome SEO afiado (ex: T-Shirt Pima Boxy)",
        "luxuryDescription": "A copy de luxo focada no corte e na etiqueta Woven",
        "suggestedPrice": 189.90,
        "category": "Oversized, Vintage, Regata ou Kit",
        "fabric": "Tipo do tecido (ex: 100% Algodão Pima)",
        "model": "Tipo da modelagem (ex: Boxy Fit)",
        "seoKeywords": ["array", "de", "5", "tags", "específicas"]
      }
    `;

    // Remove o prefixo data:image/jpeg;base64, se presente
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
    
    // Limpeza básica para garantir que pegamos apenas o JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[0]) as AIProductAnalysis };
    }

    return { success: false, error: "A IA não retornou um formato JSON válido." };
  } catch (error: any) {
    console.error("Erro no motor de IA (Server):", error);
    return { success: false, error: "Falha de comunicação com o motor de IA." };
  }
}
