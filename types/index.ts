// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comboPrice?: number; // Preço promocional para 3+ peças
  imageUrl: string;
  secondaryImageUrl?: string;
  images?: string[]; // Adicionando URLs de imagens da galeria
  seo?: { altText: string; metaDescription: string };
  colors?: { name: string; imageUrl: string }[];
  sizes: string[];
  stock?: Record<string, number>; // Controle de estoque em formato MAP. Chave: 'Cor-Tamanho' (ex: 'Branca-P') ou 'Tamanho' ('P')
  skus?: Record<string, string>; // Mapeia SKUs (ex: {'Preta-M': 'OVR-PRT-M-1X9A'})
  category: "Kits" | "Oversized" | "Regatas" | "Vintage" | "Lifestyle" | "Conjuntos" | "Camisetas";
  modelSigla?: string;
  printSigla?: string;
  weight?: number;
  details?: {
    fabric: string;
    model: string;
    wash: string;
  };
  isNew?: boolean;
  launchExpiry?: number;
  featured?: boolean; // Adicionado para produtos em destaque
  isActive?: boolean; // Flag para visibilidade na loja
  isPremiumCollection?: boolean; // Flag para Sprint v1.5: Gatilho de Qualidade
  seoAltText: string;
  slug: string;
  rating?: number;
  reviewsCount?: number;
}

export interface MenuItem {
  label: string;
  href: string;
}
