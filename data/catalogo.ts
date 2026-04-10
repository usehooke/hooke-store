import { Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { Product as GlobalProduct } from "@/types";

// Re-exportando para manter compatibilidade com componentes que ainda importam daqui
export type Product = GlobalProduct;

// =================================================================================
// 🟢 CÉREBRO DA HOOKE (HOOK OS)
// Centraliza todos os dados do site. Mudou aqui, mudou no site todo.
// =================================================================================

export const SITE_CONFIG = {
  nome: "Hooke",
  descricao_site: "Design essencial para a permanência. Matéria-prima nacional moldada para o cotidiano tropical.",
  whatsapp_number: "5511975902528", // Número real atualizado
  whatsapp_message: "Olá! Vim pelo site da UseHooke e gostaria de tirar uma dúvida.",
  frete_gratis_minimo: 299.00, // Valor para ganhar frete grátis (lógica futura)
  max_parcelas: 3, // Configuração Global de Parcelamento
};

// ---------------------------------------------------------------------------------
// 1. PRODUTOS (SEU ESTOQUE VIRTUAL)
// ---------------------------------------------------------------------------------

export const PRODUTOS: Product[] = [
  // --- KITS (O CORAÇÃO DO LUCRO) ---
  {
    id: "kit-3-oversized-premium",
    name: "Kit 3 Camisetas Oversized Premium",
    seoAltText: "Conjunto Kit 3 Camisetas Oversized Masculinas Premium em Algodão 30.1 Penteado cores básicas - Hooke Store",
    slug: "kit-3-camisetas-oversized-premium",
    price: 150.90,
    featured: true,
    isNew: true,
    isPremiumCollection: true,
    description: "O essencial elevado. Três peças em algodão de alta gramatura, projetadas para manter a estrutura e o frescor no dia a dia.",
    imageUrl: "/produtos/hk_prod_ov_black_03.avif",
    images: [
      "/produtos/hk_prod_ov_black_01.avif",
      "/produtos/hk_prod_ov_offwhite_01.avif",
      "/produtos/hk_prod_ov_green_01.avif",
      "/produtos/hk_prod_ov_blue_01.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Kits",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada com Silicone" },
    totalStock: 3
  },
  {
    id: "kit-5-oversized-premium",
    name: "Kit 5 Camisetas Oversized Premium",
    seoAltText: "Conjunto Kit 5 Camisetas Oversized Masculinas Premium em Algodão 30.1 Penteado cores básicas - Hooke Store",
    slug: "kit-5-camisetas-oversized-premium",
    price: 225.90,
    featured: false,
    isNew: true,
    description: "O guarda-roupa completo. Cinco peças com modelagem exclusiva em algodão de alta densidade.",
    imageUrl: "/produtos/hk_prod_ov_black_03.avif",
    images: [
      "/produtos/hk_prod_ov_black_03.avif",
      "/produtos/hk_prod_ov_offwhite_01.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Kits",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada com Silicone" }
  },
  {
    id: "kit-3-regatas-caneladas",
    name: "Kit 3 Regatas Caneladas Americana",
    seoAltText: "Conjunto Kit 3 Regatas Caneladas Masculinas em Algodão com elastano e modelagem ajustada ao corpo cores básicas - Hooke Store",
    slug: "kit-3-regatas-caneladas-americana",
    price: 120.90,
    featured: false,
    isNew: true,
    description: "As 3 cores essenciais para o seu treino. Malha canelada com elastano.",
    imageUrl: "/produtos/camiseta-regata-canelada-verde-1.jpg",
    images: [
      "/produtos/camiseta-regata-canelada-verde-1.jpg",
      "/produtos/camiseta-regata-canelada-areia-1.jpg",
      "/produtos/camiseta-regata-canelada-marrom-1.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Kits",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "kit-5-regatas-caneladas",
    name: "Kit 5 Regatas Caneladas Americana",
    seoAltText: "Conjunto Kit 5 Regatas Caneladas Masculinas em Algodão com elastano e modelagem ajustada ao corpo cores básicas - Hooke Store",
    slug: "kit-5-regatas-caneladas-americana",
    price: 175.90,
    featured: false,
    isNew: true,
    description: "Kit Semana. 5 Regatas para garantir o estilo em todos os treinos.",
    imageUrl: "/produtos/camiseta-canelada-marrom-1.jpg",
    images: [
      "/produtos/camiseta-canelada-marrom-1.jpg",
      "/produtos/hk_prod_re_military_01.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Kits",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "kit-3-vintage-premium",
    name: "Kit 3 Camisetas Vintage",
    seoAltText: "Conjunto Kit 3 Camisetas Masculinas Vintage em Algodão Premium com estampas retrô automotivas - Hooke Store",
    slug: "kit-3-camisetas-vintage",
    price: 120.90,
    featured: false,
    isNew: true,
    description: "Herança e estilo. Algodão premium nacional com estampas que celebram a história clássica com suavidade.",
    imageUrl: "/produtos/hk_prod_vi_fusca_black_01.jpg",
    images: ["/produtos/hk_prod_vi_fusca_black_01.jpg"],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Kits",
    details: { fabric: "Algodão Egípcio", model: "Regular", wash: "Pré-Encolhida" }
  },
  {
    id: "kit-5-vintage-premium",
    name: "Kit 5 Camisetas Vintage",
    seoAltText: "Conjunto Kit 5 Camisetas Masculinas Vintage em Algodão Premium com estampas retrô automotivas - Hooke Store",
    slug: "kit-5-camisetas-vintage",
    price: 175.90,
    featured: false,
    isNew: true,
    description: "Coleção completa. 5 camisetas vintage para quem tem personalidade.",
    imageUrl: "/produtos/hk_prod_vi_fusca_offwhite_01.jpg",
    images: ["/produtos/hk_prod_vi_fusca_offwhite_01.jpg"],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Kits",
    details: { fabric: "Algodão Egípcio", model: "Regular", wash: "Pré-Encolhida" }
  },

  // --- OVERSIZED (CARRO CHEFE) ---
  {
    id: "oversized-preta",
    name: "Camiseta Oversized Black",
    seoAltText: "Camiseta Oversized Masculina Heavy Cotton Preta em Algodão Egípcio de alta gramatura - Hooke Store",
    slug: "camiseta-oversized-preta-premium",
    price: 69.90,
    featured: false,
    isNew: true,
    description: "A base do guarda-roupa contemporâneo. Algodão denso de toque macio, moldado para oferecer uma presença forte e confortável.",
    imageUrl: "/produtos/hk_prod_ov_black_03.avif",
    images: [
      "/produtos/hk_prod_ov_black_03.avif",
      "/produtos/hk_prod_ov_black_01.avif",
      "/produtos/hk_prod_ov_black_04.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Oversized",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada" },
    totalStock: 2
  },
  {
    id: "oversized-offwhite",
    name: "Camiseta Oversized Off-White",
    seoAltText: "Camiseta Oversized Masculina Heavy Cotton Off-White em Algodão Egípcio de alta gramatura - Hooke Store",
    slug: "camiseta-oversized-offwhite-premium",
    price: 69.90,
    featured: false,
    isNew: true,
    description: "Tonalidade natural que traz sofisticação para o streetwear. Suedine 240g que não fica transparente.",
    imageUrl: "/produtos/hk_prod_ov_offwhite_01.avif",
    images: ["/produtos/hk_prod_ov_offwhite_01.avif"],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Oversized",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada" }
  },

  // --- REGATAS ---
  {
    id: "regata-verde",
    name: "Regata Canelada Militar",
    seoAltText: "Regata Canelada Masculina Verde Militar em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-verde",
    price: 50.90,
    featured: true,
    description: "Desempenho e textura. Malha respirável com acabamento Stone Wash, ideal para o dinamismo do nosso clima.",
    imageUrl: "/produtos/hk_prod_re_military_hero.avif",
    images: [
      "/produtos/hk_prod_re_military_hero.avif"
    ],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Regatas",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "regata-marrom",
    name: "Regata Canelada Coffee",
    seoAltText: "Regata Canelada Masculina Marrom Coffee em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-marrom",
    price: 50.90,
    featured: false,
    description: "Textura que diferencia. Malha canelada que se ajusta ao corpo sem apertar.",
    imageUrl: "/produtos/hk_prod_re_coffee_01.jpg",
    images: [
      "/produtos/hk_prod_re_coffee_01.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Regatas",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "regata-areia",
    name: "Regata Canelada Sand",
    seoAltText: "Regata Canelada Masculina Areia Sand em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-areia",
    price: 50.90,
    featured: false,
    description: "Tons terrosos são essenciais. Uma peça neutra que combina com bermudas de qualquer cor.",
    imageUrl: "/produtos/hk_prod_re_sand_01.jpg",
    images: [
      "/produtos/hk_prod_re_sand_01.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Regatas",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "regata-lifestyle-bege",
    name: "Regata Lifestyle Bege",
    seoAltText: "Regata Lifestyle Masculina Bege em Algodão BCI de corte a fio e caimento estruturado - Hooke Store",
    slug: "regata-lifestyle-bege",
    price: 89.90,
    featured: false,
    description: "Básica, mas nunca simples. Corte a fio na gola e mangas para um visual despojado.",
    imageUrl: "/produtos/hk_prod_re_lifestyle_bege_01.jpg",
    images: ["/produtos/hk_prod_re_lifestyle_bege_01.jpg"],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Lifestyle",
    details: { fabric: "Algodão BCI", model: "Oversized", wash: "Tingimento Ecológico" }
  },

  // --- VINTAGE (ESTAMPA) ---
  {
    id: "fusca-preta",
    name: "Camiseta Vintage Beetle Black",
    seoAltText: "Camiseta Masculina Vintage Fusca Clássico em Algodão Premium Preta com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-fusca-preta",
    price: 50.90,
    featured: true,
    description: "O clássico absoluto. Estampa do Fusca em silk screen de alta definition sobre algodão preto profundo.",
    imageUrl: "/produtos/hk_prod_vi_fusca_editorial_01.png",
    images: [
      "/produtos/hk_prod_vi_fusca_editorial_01.png"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    department: "masculino",
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim Comfort", wash: "Pré-Encolhida" }
  },
  {
    id: "maverick-vermelha",
    name: "Camiseta Vintage Maverick Red",
    seoAltText: "Camiseta Masculina Vintage Maverick em Algodão Premium Vermelha com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-maverick-vermelha",
    price: 50.90,
    featured: false,
    description: "Velocidade e história. Homenagem ao lendário V8. Cor vibrante com estampa desgastada.",
    imageUrl: "/produtos/hk_prod_vi_maverick_red_01.jpg",
    images: ["/produtos/hk_prod_vi_maverick_red_01.jpg"],
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
    price: 50.90,
    featured: false,
    description: "Um visual limpo e clássico. A cor off-white destaca a estampa do Beetle com suavidade.",
    imageUrl: "/produtos/hk_prod_vi_fusca_offwhite_01.jpg",
    images: ["/produtos/hk_prod_vi_fusca_offwhite_01.jpg", "/produtos/hk_prod_vi_fusca_offwhite_04.jpg"],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Regular Fit", wash: "Pré-Encolhida" }
  },
  {
    id: "fusca-bordo",
    name: "Camiseta Vintage Beetle Bordô",
    seoAltText: "Camiseta Masculina Vintage Fusca Clássico em Algodão Premium Bordô com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-fusca-bordo",
    price: 50.90,
    featured: false,
    description: "Elegância e atitude. O tom bordô traz sofisticação para o visual casual.",
    imageUrl: "/produtos/hk_prod_vi_fusca_bordo_01.jpg",
    images: ["/produtos/hk_prod_vi_fusca_bordo_01.jpg"],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim Comfort", wash: "Amaciada" }
  },
  {
    id: "kombi-offwhite",
    name: "Camiseta Vintage Kombi",
    seoAltText: "Camiseta Masculina Vintage Kombi Roadtrip em Algodão Premium Off-White com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-kombi-offwhite",
    price: 50.90,
    featured: false,
    description: "Para espíritos livres. A Kombi representa a viagem, não o destino.",
    imageUrl: "/produtos/hk_prod_vi_kombi_offwhite_01.jpg",
    images: ["/produtos/hk_prod_vi_kombi_offwhite_01.jpg"],
    sizes: ["P", "M", "G", "GG"],
    department: "masculino",
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim", wash: "Pré-Encolhida" }
  },
  // --- FEMININO (Ensaio Profissional v4 - Hooke Elite) ---
  {
    id: "fem-conjunto-viscose-verde",
    name: "Conjunto Minimalista Forest",
    seoAltText: "Musa 001 vestindo conjunto verde Forest em viscose Lore Liso 230g - Hooke Femme",
    slug: "conjunto-feminino-viscose-verde",
    price: 100.00,
    featured: true,
    isPremiumCollection: true,
    isNew: true,
    totalStock: 24, // 8 per size (P, M, G)
    description: "Lote 001. Viscose de toque gelado e caimento fluido. Um conjunto projetado para a leveza e elegância em qualquer estação brasileira.",
    imageUrl: "/assets/femme/musas_001_forest_1.png",
    images: [
      "/assets/femme/musas_001_forest_1.png",
      "/assets/femme/musas_001_forest_2.png",
      "/assets/femme/musas_001_forest_3.png",
      "/assets/femme/musas_001_forest_4.png"
    ],
    sizes: ["P", "M", "G"],
    department: "feminino",
    category: "Conjuntos",
    details: { fabric: "96% Viscose, 4% Elastano (Lore Liso)", model: "Pantalona & Relaxed T-shirt", wash: "Acabamento Fosco Premium" }
  },
  {
    id: "fem-conjunto-viscose-azul",
    name: "Conjunto Minimalista Navy",
    seoAltText: "Musa 001 vestindo conjunto azul Navy em viscose Lore Liso 230g - Hooke Femme",
    slug: "conjunto-feminino-viscose-azul",
    price: 100.00,
    featured: false,
    isPremiumCollection: true,
    isNew: true,
    totalStock: 24, // 8 per size (P, M, G)
    description: "PRÉ-VENDA LOTE 001. Para os dias em que a discrição se torna a maior de todas as presenças. Tecido Lore Liso com elastano para máximo conforto.",
    imageUrl: "/assets/femme/musas_001_navy_1.png",
    images: [
      "/assets/femme/musas_001_navy_1.png",
      "/assets/femme/musas_001_navy_2.png",
      "/assets/femme/musas_001_navy_3.png",
      "/assets/femme/musas_001_navy_4.png"
    ],
    sizes: ["P", "M", "G"],
    department: "feminino",
    category: "Conjuntos",
    details: { fabric: "96% Viscose, 4% Elastano (Lore Liso)", model: "Pantalona & Relaxed T-shirt", wash: "Acabamento Fosco Premium" }
  },
  {
    id: "fem-conjunto-viscose-chocolate",
    name: "Conjunto Minimalista Chocolate",
    seoAltText: "Musa 001 vestindo conjunto Marrom Chocolate em viscose Lore Liso 230g - Hooke Femme",
    slug: "conjunto-feminino-viscose-chocolate",
    price: 100.00,
    featured: true,
    isPremiumCollection: true,
    isNew: true,
    totalStock: 24, // 8 per size (P, M, G)
    description: "PRÉ-VENDA LOTE 001. A sofisticação do tom chocolate unida ao corte arquitetônico Hooke. O caimento fluído da viscose Lore Liso em sua melhor forma.",
    imageUrl: "/assets/femme/musas_001_chocolate_1.png",
    images: [
      "/assets/femme/musas_001_chocolate_1.png",
      "/assets/femme/musas_001_chocolate_2.png",
      "/assets/femme/musas_001_chocolate_3.png",
      "/assets/femme/musas_001_chocolate_4.png"
    ],
    sizes: ["P", "M", "G"],
    department: "feminino",
    category: "Conjuntos",
    details: { fabric: "96% Viscose, 4% Elastano (Lore Liso)", model: "Pantalona & Relaxed T-shirt", wash: "Acabamento Fosco Premium" }
  }
];

// ---------------------------------------------------------------------------------
// 2. GUIA DE MEDIDAS (SIZE GUIDE)
// ---------------------------------------------------------------------------------

export const GUIA_MEDIDAS = {
  referencia_modelo: "Referência: O modelo da foto principal tem 1,73m, 77kg e está vestindo tamanho M.",
  imagem_diagrama: "/images/guia-medidas-camiseta.png",
  tabela: [
    { size: "P", chest: "52-54", length: "68-70", sleeve: "20-21" },
    { size: "M", chest: "55-57", length: "71-73", sleeve: "21-22" },
    { size: "G", chest: "58-60", length: "74-76", sleeve: "22-23" },
    { size: "GG", chest: "61-63", length: "77-79", sleeve: "23-24" },
    { size: "XG", chest: "64-66", length: "80-82", sleeve: "24-25" }
  ]
};

// ---------------------------------------------------------------------------------
// 3. MENU DE NAVEGAÇÃO
// ---------------------------------------------------------------------------------

export const MENU_LINKS = [
  { name: 'Shop', href: '/' },
  { name: 'Coleção', href: '/colecao' },
  { name: 'Lançamento', href: '/lancamento', highlight: true },
  { name: 'Sobre', href: '/sobre' },
];

// ---------------------------------------------------------------------------------
// 4. FAQ GERAL (USADO NA HOME E LANDING PAGES)
// ---------------------------------------------------------------------------------

export const FAQ_GERAL = [
  { q: "Qual o prazo de logística?", a: "Operação rápida: despacho em até 24h úteis. Prioridade máxima para capitais." },
  { q: "Protocolo de trocas?", a: "Garantia de ajuste perfeito. A primeira troca é cortesia da Hooke. 7 dias para avaliação de caimento." },
  { q: "Estabilidade dimensional (encolhimento)?", a: "Zero. O tecido passa por estabilização prévia. A forma da peça é preservada lavagem após lavagem." },
  { q: "Cálculo de manuseio e tamanho?", a: "Padrão brasileiro de precisão. Recomendamos sua numeração habitual para o caimento planejado." }
];

// ---------------------------------------------------------------------------------
// 5. BENEFÍCIOS (BRAND MARQUEE)
// ---------------------------------------------------------------------------------

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
