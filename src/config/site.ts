import { brandConfig } from "./brandConfig";

export const IMAGE_BASE_URL = 'https://www.usehooke.com.br/cdn/shop/files';

export const siteConfig = {
  name: "Hooke",
  description: "Moda Masculina Premium",
  whatsappNumber: "5511975902528", // Seu número aqui
  links: {
    instagram: "https://instagram.com/usehooke",
    facebook: "https://facebook.com/usehooke",
  },
  // Função helper para gerar o link do zap já com texto
  getWhatsAppUrl: (text: string) => {
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
};

export const SITE_CONFIG = {
  max_parcelas: brandConfig.shop.maxInstallments,
};
