// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  secondaryImageUrl?: string;
  images?: string[]; // Adicionando URLs de imagens da galeria
  seo?: { altText: string; metaDescription: string };
  colors?: { name: string; imageUrl: string }[];
  sizes: string[];
  category: 'Vintage' | 'Regatas' | 'Lifestyle' | 'camisetas-lisas' | 'camisetas-estampadas' | 'acessorios' | 'Kits' | 'Oversized';
  details?: {
    fabric: string;
    model: string;
    wash: string;
  };
  isNew?: boolean;
  featured?: boolean; // Adicionado para produtos em destaque
  slug: string;
}

export interface MenuItem {
  label: string;
  href: string;
}
