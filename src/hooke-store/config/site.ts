export const siteConfig = {
  name: "Hooke",
  description: "Moda Masculina Premium",
  whatsappNumber: "5511999999999", // Seu número aqui
  links: {
    instagram: "https://instagram.com/usehooke",
    facebook: "https://facebook.com/usehooke",
  },
  // Função helper para gerar o link do zap já com texto
  getWhatsAppUrl: (text: string) => {
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
};