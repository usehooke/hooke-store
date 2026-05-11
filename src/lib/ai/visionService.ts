import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIProductAnalysis {
  name: string;
  category: string;
  description: string;
  price: number;
  fabric: string;
  model: string;
  seoKeywords: string[];
  imageUrl?: string;
}

export async function analyzeProductImage(base64Image: string): Promise<AIProductAnalysis | null> {
  if (!API_KEY) {
    console.warn("VITE_GEMINI_API_KEY não encontrada. O Cadastro Mágico está operando em modo de simulação.");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }, { apiVersion: "v1beta" });

    const prompt = `
      Você é o Guardião SEO e Diretor de Arte da Hooke, uma marca de moda masculina premium com estética Soft Brutalism e Luxury.
      Analise esta imagem de produto e extraia as informações necessárias para o cadastro no sistema.
      
      Diretrizes de Tom de Voz:
      - Fria, minimalista, arquitetônica.
      - Foco na textura do tecido e na geometria do corte.
      - Use termos como "Equipamento Base", "Permanência Absoluta", "Arquitetura Têxtil".
      
      Retorne APENAS um objeto JSON válido (sem markdown, sem explicações) com a seguinte estrutura:
      {
        "name": "Nome curto e impactante (ex: T-Shirt Pima Boxy)",
        "category": "Uma das: Oversized, Vintage, Regata, Kit",
        "description": "Descrição técnica e poética (máximo 200 caracteres)",
        "price": Sugestão de preço (número, ex: 189.90),
        "fabric": "Tipo do tecido (ex: 100% Algodão Pima, Viscose Fluida)",
        "model": "Tipo da modelagem (ex: Boxy Fit, Regular, Slim)",
        "seoKeywords": ["lista", "de", "5", "palavras-chave"]
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
      return JSON.parse(jsonMatch[0]) as AIProductAnalysis;
    }

    return null;
  } catch (error) {
    console.error("Erro na análise da imagem:", error);
    return null;
  }
}
