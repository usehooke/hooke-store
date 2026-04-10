// src/data/products.ts
import { Product } from "@/types";

export const products: Product[] = [
  // --- 1. [DESTAQUE HERO] LANÇAMENTO: KIT 3 OVERSIZED ---
  // Este aparece no Banner Gigante da Esquerda
  {
    id: "kit-3-oversized-premium",
    name: "Kit 3 Camisetas Oversized Premium",
    seoAltText: "Conjunto Kit 3 Camisetas Oversized Masculinas Premium em Algodão 30.1 Penteado cores básicas - Hooke Store",
    slug: "kit-3-camisetas-oversized-premium",
    price: 135.00,
    featured: true, // TRUE = Hero Principal
    isNew: true,    // Tag "Lançamento"
    description: "O essencial elevado. Três peças em algodão de alta gramatura, projetadas para manter a estrutura e o frescor no dia a dia.",
    // Capa: Preta
    imageUrl: "/produtos/HK_PROD_OV_BLACK_03.avif",
    images: [
      "/produtos/HK_PROD_OV_BLACK_01.avif",
      "/produtos/HK_PROD_OV_OFFWHITE_01.avif",
      "/produtos/HK_PROD_OV_GREEN_01.avif",
      "/produtos/HK_PROD_OV_BLUE_01.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Kits",
    details: { fabric: "Algodão Premium Encorpado", model: "Oversized Streetwear", wash: "Amaciada com Silicone" }
  },

  // --- 2. [DESTAQUE HERO] Regata Verde (OFERTA) ---
  {
    id: "regata-verde",
    name: "Regata Canelada Militar",
    seoAltText: "Regata Canelada Masculina Verde Militar em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-verde",
    price: 99.90,
    featured: true,
    description: "Desempenho e textura. Malha respirável com acabamento Stone Wash, ideal para o dinamismo do nosso clima.",
    imageUrl: "/produtos/HK_PROD_RE_MILITARY_01.jpg",
    images: [
      "/produtos/HK_PROD_RE_MILITARY_01.jpg",
      "/produtos/HK_PROD_RE_MILITARY_02.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Regatas",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },

  // --- 3. [DESTAQUE HERO] O Clássico Fusca ---
  // Este aparece no bloco "Clássico" (Direita Baixo)
  {
    id: "fusca-preta",
    name: "Camiseta Vintage Beetle Black",
    seoAltText: "Camiseta Masculina Vintage Fusca Clássico em Algodão Premium Preta com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-fusca-preta",
    price: 159.90,
    featured: true,
    description: "Herança e estilo. Algodão premium nacional com estampas que celebram a história clássica com suavidade.",
    imageUrl: "/produtos/HK_PROD_VI_FUSCA_BLACK_01.jpg",
    images: [
      "/produtos/HK_PROD_VI_FUSCA_BLACK_01.jpg",
      "/produtos/HK_PROD_VI_FUSCA_BLACK_02.png",
      "/produtos/HK_PROD_VI_FUSCA_BLACK_03.png",
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim Comfort", wash: "Pré-Encolhida" }
  },

  // --- PRODUTOS REGULARES ---

  {
    id: "oversized-preta",
    name: "Camiseta Oversized Black",
    seoAltText: "Camiseta Oversized Masculina Heavy Cotton Preta em Algodão Egípcio de alta gramatura - Hooke Store",
    slug: "camiseta-oversized-preta-premium",
    price: 69.90,
    featured: false,
    isNew: true,
    description: "A base do guarda-roupa contemporâneo. Algodão denso de toque macio, moldado para oferecer uma presença forte e confortável.",
    imageUrl: "/produtos/HK_PROD_OV_BLACK_03.avif",
    images: [
      "/produtos/HK_PROD_OV_BLACK_03.avif",
      "/produtos/HK_PROD_OV_BLACK_01.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Oversized",
    details: { fabric: "Algodão Premium", model: "Oversized", wash: "Amaciada" }
  },
  {
    id: "oversized-offwhite",
    name: "Camiseta Oversized Off-White",
    seoAltText: "Camiseta Oversized Masculina Heavy Cotton Off-White em Algodão Egípcio de alta gramatura - Hooke Store",
    slug: "camiseta-oversized-offwhite-premium",
    price: 69.90,
    featured: false,
    isNew: true,
    description: "Tonalidade natural que traz sofisticação e leveza para o cotidiano.",
    imageUrl: "/produtos/HK_PROD_OV_OFFWHITE_01.avif",
    images: ["/produtos/HK_PROD_OV_OFFWHITE_01.avif"],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Oversized",
    details: { fabric: "Algodão Premium", model: "Oversized", wash: "Amaciada" }
  },
  {
    id: "regata-marrom",
    name: "Regata Canelada Coffee",
    seoAltText: "Regata Canelada Masculina Marrom Coffee em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-marrom",
    price: 99.90,
    featured: false,
    description: "Diferenciação pela textura. Malha canelada de toque macio que se ajusta ao corpo com liberdade.",
    imageUrl: "/produtos/HK_PROD_RE_COFFEE_01.jpg",
    images: [
      "/produtos/HK_PROD_RE_COFFEE_01.jpg",
      "/produtos/HK_PROD_RE_COFFEE_02.jpg",
      "/produtos/HK_PROD_RE_COFFEE_03.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Regatas",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "maverick-vermelha",
    name: "Camiseta Vintage Maverick Red",
    seoAltText: "Camiseta Masculina Vintage Maverick em Algodão Premium Vermelha com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-maverick-vermelha",
    price: 159.90,
    featured: false,
    description: "Velocidade e história. Homenagem ao lendário V8. Cor vibrante com estampa desgastada.",
    imageUrl: "/produtos/HK_PROD_VI_MAVERICK_RED_01.jpg",
    images: ["/produtos/HK_PROD_VI_MAVERICK_RED_01.jpg"],
    sizes: ["M", "G", "GG"],
    department: "masculino",
    category: "Vintage",
    details: { fabric: "Algodão Premium", model: "Regular", wash: "Amaciada" }
  },
  {
    id: "fusca-offwhite",
    name: "Camiseta Vintage Beetle Off-White",
    seoAltText: "Camiseta Masculina Vintage Fusca Clássico em Algodão Premium Off-White com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-fusca-offwhite",
    price: 159.90,
    featured: false,
    description: "Um visual limpo e clássico. A cor off-white destaca a estampa do Beetle com suavidade.",
    imageUrl: "/produtos/HK_PROD_VI_FUSCA_OFFWHITE_01.jpg",
    images: ["/produtos/HK_PROD_VI_FUSCA_OFFWHITE_01.jpg", "/produtos/HK_PROD_VI_FUSCA_OFFWHITE_04.jpg"],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Regular Fit", wash: "Pré-Encolhida" }
  },
  {
    id: "regata-lifestyle-bege",
    name: "Regata Lifestyle Bege",
    seoAltText: "Regata Lifestyle Masculina Bege em Algodão BCI de corte a fio e caimento estruturado - Hooke Store",
    slug: "regata-lifestyle-bege",
    price: 89.90,
    featured: false,
    description: "Básica, mas nunca simples. Corte a fio na gola e mangas para um visual despojado.",
    imageUrl: "/produtos/HK_PROD_RE_LIFESTYLE_BEGE_01.jpg",
    images: ["/produtos/HK_PROD_RE_LIFESTYLE_BEGE_01.jpg"],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Lifestyle",
    details: { fabric: "Algodão BCI", model: "Oversized", wash: "Tingimento Ecológico" }
  },
  {
    id: "fusca-bordo",
    name: "Camiseta Vintage Beetle Bordô",
    seoAltText: "Camiseta Masculina Vintage Fusca Clássico em Algodão Premium Bordô com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-fusca-bordo",
    price: 159.90,
    featured: false,
    description: "Elegância e atitude. O tom bordô traz sofisticação para o visual casual.",
    imageUrl: "/produtos/HK_PROD_VI_FUSCA_BORDO_01.jpg",
    images: ["/produtos/HK_PROD_VI_FUSCA_BORDO_01.jpg"],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim Comfort", wash: "Amaciada" }
  },
  {
    id: "regata-areia",
    name: "Regata Canelada Sand",
    seoAltText: "Regata Canelada Masculina Areia Sand em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-areia",
    price: 99.90,
    featured: false,
    description: "Tons terrosos são essenciais. Uma peça neutra que combina com bermudas de qualquer cor.",
    imageUrl: "/produtos/HK_PROD_RE_SAND_01.jpg",
    images: [
      "/produtos/HK_PROD_RE_SAND_01.jpg",
      "/produtos/HK_PROD_RE_SAND_02.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Regatas",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "kombi-offwhite",
    name: "Camiseta Vintage Kombi",
    seoAltText: "Camiseta Masculina Vintage Kombi Roadtrip em Algodão Premium Off-White com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-kombi-offwhite",
    price: 159.90,
    featured: false,
    description: "Para espíritos livres. A Kombi representa a viagem, não o destino.",
    imageUrl: "/produtos/HK_PROD_VI_KOMBI_OFFWHITE_01.jpg",
    images: ["/produtos/HK_PROD_VI_KOMBI_OFFWHITE_01.jpg"],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim", wash: "Pré-Encolhida" }
  }
];
