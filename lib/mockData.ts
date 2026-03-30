import { Product } from "@/types";

/**
 * HOOKE ELITE: MOCK DATA - GOLDEN RULE EDITION
 * All images point to the real founder (Fernando) in public/lookbook/
 * Types strictly aligned with src/types/index.ts
 */

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "conjunto-wafer-offwhite",
    name: "Conjunto Wafer Off-White",
    slug: "conjunto-wafer-offwhite",
    price: 449.90,
    description: "Algodão Egípcio de gramatura pesada. O ápice do minimalismo Hooke Elite.",
    category: "Conjuntos",
    imageUrl: "/lookbook/founder-1.png",
    images: ["/lookbook/founder-1.png", "/lookbook/founder-6.png"],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Off-White", imageUrl: "/lookbook/founder-1.png" }
    ],
    featured: true,
    isActive: true,
    seoAltText: "Fernando vestindo Conjunto Wafer Off-White Hooke",
    stock: { "Off-White-P": 2, "Off-White-M": 5, "Off-White-G": 3, "Off-White-GG": 1 }
  },
  {
    id: "camiseta-heavy-black",
    name: "Camiseta Heavy Black",
    slug: "camiseta-heavy-black",
    price: 189.90,
    description: "Modelagem boxy, gola 3cm e costuras reforçadas. 100% Algodão Premium.",
    category: "Camisetas",
    imageUrl: "/lookbook/founder-2.jpg",
    images: ["/lookbook/founder-2.jpg", "/lookbook/founder-3.jpg"],
    sizes: ["P", "M", "G", "GG"],
    featured: true,
    isActive: true,
    seoAltText: "Fernando vestindo Camiseta Heavy Black Hooke"
  }
];

export const MOCK_LOOKBOOK = {
  title: "Conjunto\nOff-white",
  subtitle: "Coleção Resort 2026",
  imageSrc: "/lookbook/founder-1.png",
  price: "R$ 449,90",
  description: "Algodão Egípcio de gramatura pesada. Menos excesso, mais qualidade em cada fibra.",
  tag: "HOOKE ELITE FOUNDER"
};
