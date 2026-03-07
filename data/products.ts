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
    description: "O melhor custo-benefício. Leve 3 peças da nossa modelagem Oversized exclusiva. Tecido encorpado, gola estruturada e caimento streetwear perfeito.",
    // Capa: Preta
    imageUrl: "/produtos/camiseta-oversized-preta-premium-hooke-3.avif",
    images: [
      "/produtos/camiseta-oversized-preta-premium-hooke-1.avif",
      "/produtos/camiseta-oversized-offwhite-premium-hooke-1.avif",
      "/produtos/camiseta-oversized-verde-premium-hooke-1.avif",
      "/produtos/camiseta-oversized-azul-premium-hooke-1.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
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
    description: "Estilo militar urbano. Fresca, leve e com caimento impecável para o verão.",
    imageUrl: "/produtos/camiseta-Regata-canelada-verde-1.jpg",
    images: [
      "/produtos/camiseta-Regata-canelada-verde-1.jpg",
      "/produtos/camiseta-Regata-canelada-verde-2.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
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
    description: "O clássico absoluto. Estampa do Fusca em silk screen de alta definição sobre algodão preto profundo.",
    imageUrl: "/produtos/camiseta-vintage-fusca-preta-1.jpg",
    images: [
      "/produtos/camiseta-vintage-fusca-preta-1.jpg",
      "/produtos/camiseta-vintage-fusca-preta-2.png",
      "/produtos/camiseta-vintage-fusca-preta-3.png",
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
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
    description: "A peça chave do estilo urbano. Modelagem ampla e estruturada. Caimento perfeito no corpo.",
    imageUrl: "/produtos/camiseta-oversized-preta-premium-hooke-3.avif",
    images: [
      "/produtos/camiseta-oversized-preta-premium-hooke-3.avif",
      "/produtos/camiseta-oversized-preta-premium-hooke-1.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
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
    description: "Tonalidade natural que traz sofisticação para o streetwear.",
    imageUrl: "/produtos/camiseta-oversized-offwhite-premium-hooke-1.avif",
    images: ["/produtos/camiseta-oversized-offwhite-premium-hooke-1.avif"],
    sizes: ["P", "M", "G", "GG", "XG"],
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
    description: "Textura que diferencia. Malha canelada que se ajusta ao corpo sem apertar.",
    imageUrl: "/produtos/camiseta-Regata-canelada-marrom-1.jpg",
    images: [
      "/produtos/camiseta-Regata-canelada-marrom-1.jpg",
      "/produtos/camiseta-Regata-canelada-marrom-2.jpg",
      "/produtos/camiseta-Regata-canelada-marrom-3.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
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
    imageUrl: "/produtos/camiseta-vintage-maverik-vermelha-1.jpg",
    images: ["/produtos/camiseta-vintage-maverik-vermelha-1.jpg"],
    sizes: ["M", "G", "GG"],
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
    imageUrl: "/produtos/camiseta-vintage-fusca-offwhite-1.jpg",
    images: ["/produtos/camiseta-vintage-fusca-offwhite-1.jpg", "/produtos/camiseta-vintage-fusca-offwhite-4.jpg"],
    sizes: ["P", "M", "G", "GG"],
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
    imageUrl: "/produtos/regata-lifestyle-bege.jpg",
    images: ["/produtos/regata-lifestyle-bege.jpg"],
    sizes: ["P", "M", "G", "GG"],
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
    imageUrl: "/produtos/camiseta-vintage-fusca-bordo-1.jpg",
    images: ["/produtos/camiseta-vintage-fusca-bordo-1.jpg"],
    sizes: ["P", "M", "G", "GG"],
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
    imageUrl: "/produtos/camiseta-Regata-canelada-areia-1.jpg",
    images: [
      "/produtos/camiseta-Regata-canelada-areia-1.jpg",
      "/produtos/camiseta-Regata-canelada-areia-2.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
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
    imageUrl: "/produtos/camiseta-vintage-kombi-offwhite-1.jpg",
    images: ["/produtos/camiseta-vintage-kombi-offwhite-1.jpg"],
    sizes: ["P", "M", "G", "GG"],
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim", wash: "Pré-Encolhida" }
  }
];
