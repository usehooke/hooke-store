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
  category: 'Vintage' | 'Regatas' | 'Lifestyle' | 'camisetas-lisas' | 'camisetas-estampadas' | 'acessorios' | 'Kits' | 'Oversized';
  details?: {
    fabric: string;
    model: string;
    wash: string;
  };
  isNew?: boolean;
  featured?: boolean; // Adicionado para produtos em destaque
  seoAltText: string;
  slug: string;
}

export interface MenuItem {
  label: string;
  href: string;
}
