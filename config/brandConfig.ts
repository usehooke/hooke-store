/**
 * brandConfig.ts - Single Source of Truth para a identidade da marca Hooke.
 * Centraliza WhatsApp, IDs de rastreamento, links sociais e contatos.
 * Versão: 2026.1 (Arquitetura Escalável)
 */

export const brandConfig = {
  name: "Hooke",
  tagline: "Moda Masculina Premium | Menos Excesso, Mais Qualidade",
  description: "Redefinindo o básico masculino. Camisetas de algodão egípcio, modelagem precisa e durabilidade extrema.",
  
  // Contatos
  contact: {
    whatsapp: {
      number: "5511975902528",
      message: "Olá! Vim pelo site da UseHooke e gostaria de tirar uma dúvida.",
      getLink: (text?: string) => {
        const msg = text || "Olá! Vim pelo site da UseHooke e gostaria de tirar uma dúvida.";
        return `https://wa.me/5511975902528?text=${encodeURIComponent(msg)}`;
      }
    },
    email: "suporte@usehooke.com.br",
    address: "São Paulo, SP - Brasil",
  },

  // Redes Sociais
  social: {
    instagram: "https://instagram.com/use.hooke",
    instagramHandle: "@use.hooke",
    facebook: "https://facebook.com/usehooke",
    twitter: "https://twitter.com/usehooke",
  },

  // Rastreamento (IDs Reais via Env ou Fallback)
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "1234567890",
  },

  // URLs de rastreamento de pedidos
  tracking: {
    correios: "https://www2.correios.com.br/sistemas/rastreamento/",
    defaultCarrier: "Correios",
  },

  // Configurações da Loja
  shop: {
    baseUrl: "https://www.usehooke.com.br",
    freeShippingThreshold: 299.00,
    maxInstallments: 3,
    currency: "BRL",
    locale: "pt-BR",
  }
};
