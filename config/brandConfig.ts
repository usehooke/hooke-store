/**
 * brandConfig.ts - Single Source of Truth para a identidade da marca Hooke.
 * Centraliza WhatsApp, IDs de rastreamento, links sociais e contatos.
 * Versão: 2026.1 (Arquitetura Escalável)
 */

export const brandConfig = {
  name: "Hooke",
  tagline: "Essencialismo Brasileiro | Design para a Permanência",
  description: "Matéria-prima nacional moldada para o cotidiano tropical. A união entre a densidade têxtil e o frescor necessário para a estrutura masculina.",
  
  // Contatos
  contact: {
    whatsapp: {
      number: "5511975902528",
      message: "Olá! Vim pelo site da Hooke e gostaria de tirar uma dúvida.",
      getLink: (text?: string) => {
        const msg = text || "Olá! Vim pelo site da Hooke e gostaria de tirar uma dúvida.";
        return `https://wa.me/5511975902528?text=${encodeURIComponent(msg)}`;
      }
    },
    email: "suporte@usehooke.com.br",
    addresses: [
      {
        name: "Vautier Premium",
        street: "Rua Tiers, 184 - Loja 148",
        neighborhood: "Brás, São Paulo - SP"
      },
      {
        name: "Shopping Porto",
        street: "Rua Tiers, 282 - Loja 1598",
        neighborhood: "Brás, São Paulo - SP"
      }
    ],
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
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    metaCapiToken: process.env.META_CAPI_TOKEN,
    metaTestEventCode: process.env.META_TEST_EVENT_CODE,
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
  },
  promotions: {
    comboThreshold: 3,
    comboDiscountLabel: "Combo Hooke (3+ peças)",
  }
};
