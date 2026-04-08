import { Product } from "@/types";
import { PRODUTOS } from "@/data/catalogo";

/**
 * HOOKE ELITE: MOCK DATA - GOLDEN RULE EDITION
 * All images point to the real founder (Fernando) in public/lookbook/
 * Types strictly aligned with src/types/index.ts
 */

const HOOKE_ELITE_SPECIALS: Product[] = [
  {
    id: "conjunto-wafer-offwhite",
    name: "Conjunto Wafer Off-White",
    slug: "conjunto-wafer-offwhite",
    price: 449.90,
    description: "Algodão Egípcio de gramatura pesada. O ápice do minimalismo Hooke Elite.",
    category: "Conjuntos",
    imageUrl: "/produtos/HK_ELITE_WAFER_OW_V2.png",
    images: ["/produtos/HK_ELITE_WAFER_OW_V2.png"],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Off-White", imageUrl: "/produtos/HK_ELITE_WAFER_OW_V2.png" }
    ],
    featured: true,
    isActive: true,
    seoAltText: "Fernando vestindo Conjunto Wafer Off-White Hooke",
    stock: { "Off-White-P": 2, "Off-White-M": 5, "Off-White-G": 3, "Off-White-GG": 1 },
    department: "masculino"
  },
  {
    id: "camiseta-heavy-black",
    name: "Camiseta Heavy Black",
    slug: "camiseta-heavy-black",
    price: 189.90,
    description: "Modelagem boxy, gola 3cm e costuras reforçadas. 100% Algodão Premium.",
    category: "Camisetas",
    imageUrl: "/produtos/HK_ELITE_HEAVY_BLACK_V2.png",
    images: ["/produtos/HK_ELITE_HEAVY_BLACK_V2.png"],
    sizes: ["P", "M", "G", "GG"],
    featured: true,
    isActive: true,
    seoAltText: "Fernando vestindo Camiseta Heavy Black Hooke",
    department: "masculino"
  },
  {
    id: "retro-beetle-areia",
    name: "Retro Beetle Areia",
    slug: "retro-beetle-areia",
    price: 179.90,
    description: "Inspirada na nostalgia automobilística de 1972. Malha premium Sandstone com textura flocada e corte editorial boxy.",
    category: "Vintage",
    imageUrl: "/produtos/hk_prod_vi_fusca_areia_01.png",
    images: [
      "/produtos/hk_prod_vi_fusca_areia_01.png",
      "/produtos/hk_prod_vi_fusca_areia_02.png",
      "/produtos/hk_prod_vi_fusca_areia_03.png"
    ],
    sizes: ["P", "M", "G", "GG"],
    details: {
      fabric: "100% Heavy Cotton 280g",
      model: "Boxy Editorial",
      wash: "Acabamento Flocado"
    },
    featured: true,
    isNew: true,
    isActive: true,
    seoAltText: "Camiseta Hooke Retro Beetle Areia em algodão pesado",
    department: "masculino"
  }
];

// ⚡ A JUNÇÃO ELITE: Unifica os produtos do Catalogo Hardcoded com os Especiais do Lookbook
// Isso evita 404s em qualquer produto que exista em pelo menos uma das listas.
export const MOCK_PRODUCTS: Product[] = [
  ...HOOKE_ELITE_SPECIALS,
  ...PRODUTOS.filter(p => !HOOKE_ELITE_SPECIALS.some(h => h.id === p.id || h.slug === p.slug))
];

export const MOCK_LOOKBOOK = {
  title: "Conjunto\nOff-white",
  subtitle: "Coleção Resort 2026",
  imageSrc: "/produtos/HK_ELITE_WAFER_OW_V2.png",
  price: "R$ 449,90",
  description: "Algodão Egípcio de gramatura pesada. Menos excesso, mais qualidade em cada fibra.",
  tag: "HOOKE ELITE FOUNDER",
  department: "masculino",
};
