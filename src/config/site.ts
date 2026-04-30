import { Truck, RefreshCw, ShieldCheck } from "lucide-react";

export const IMAGE_BASE_URL = ""; // TODO: Atualizar quando a CDN estiver finalizada

export const SITE_CONFIG = {
  nome: "Hooke",
  descricao_site: "Design essencial para a permanência. Matéria-prima nacional moldada para o cotidiano tropical.",
  whatsapp_number: "5511975902528",
  whatsapp_message: "Olá! Vim pelo site da UseHooke e gostaria de tirar uma dúvida.",
  frete_gratis_minimo: 299.00,
  max_parcelas: 3,
};

export const BENEFICIOS_MARQUEE = [
  {
    icon: Truck,
    text: "Enviamos para todo o Brasil",
  },
  {
    icon: RefreshCw,
    text: "Primeira troca grátis",
  },
  {
    icon: ShieldCheck,
    text: "Compra 100% segura",
  },
];
