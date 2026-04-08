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
  descricao_site: "Redefinindo o básico masculino. Camisetas de algodão egípcio e Suedine 240g.",
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
    description: "O melhor custo-benefício. Leve 3 peças da nossa modelagem Oversized exclusiva. Suedine 240g, gola de 2,5cm e caimento streetwear.",
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
    description: "O guarda-roupa completo. 5 peças da nossa modelagem Oversized exclusiva. Suedine 240g.",
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
    description: "Clássicos atemporais. 3 camisetas com estampas vintage exclusivas.",
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
    description: "A peça chave do estilo urbano. Malha Suedine 240g encorpada. Modelagem ampla e estruturada.",
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
    description: "Estilo militar urbano. Fresca, leve e com caimento impecável para o verão.",
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
    seoAltText: "Modelo oficial Hooke vestindo conjunto verde de camiseta e calça pantalona em viscose - Ensaio Profissional",
    slug: "conjunto-feminino-viscose-verde",
    price: 189.90,
    featured: true,
    isPremiumCollection: true,
    isNew: true,
    description: "A essência do loungewear de luxo. T-shirt de caimento solto e pantalona fluída. Conforto absoluto sem perder a imponência. Ensaio com modelo oficial da marca.",
    imageUrl: "/produtos/hk_fem_verde_1.png",
    images: [
      "/produtos/hk_fem_verde_1.png",
      "/produtos/hk_fem_verde_2.png"
    ],
    sizes: ["PP", "P", "M", "G"],
    department: "feminino",
    category: "Conjuntos",
    details: { fabric: "96% Viscose, 4% Elastano", model: "Pantalona & Relaxed T-shirt", wash: "Acabamento Fosco Premium" }
  },
  {
    id: "fem-conjunto-viscose-azul",
    name: "Conjunto Minimalista Navy",
    seoAltText: "Modelo oficial Hooke vestindo conjunto azul marinho profundo de camiseta e calça pantalona em viscose - Ensaio Profissional",
    slug: "conjunto-feminino-viscose-azul",
    price: 189.90,
    featured: false,
    isPremiumCollection: true,
    isNew: true,
    description: "Para os dias em que a discrição se torna a maior de todas as presenças. O caimento Hooke em Viscose Navy Blue.",
    imageUrl: "/produtos/hk_fem_azul_1.png",
    images: [
      "/produtos/hk_fem_azul_1.png",
      "/produtos/hk_fem_azul_2.png"
    ],
    sizes: ["PP", "P", "M", "G"],
    department: "feminino",
    category: "Conjuntos",
    details: { fabric: "96% Viscose, 4% Elastano", model: "Pantalona & Relaxed T-shirt", wash: "Acabamento Fosco Premium" }
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
  { q: "Qual o prazo de entrega?", a: "Enviamos em até 24h úteis. Para SP e região, a entrega costuma ser no dia seguinte." },
  { q: "Se não servir, posso trocar?", a: "Sim! A primeira troca é totalmente grátis e por nossa conta. Você tem 7 dias para testar." },
  { q: "A camiseta encolhe?", a: "Não. Nosso tecido passa por um processo de pré-encolhimento industrial. O tamanho que você compra é o que fica." },
  { q: "Como escolher meu tamanho?", a: "Recomendamos pegar seu tamanho usual. Nossa modelagem Regular Fit é padrão brasileiro." }
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
