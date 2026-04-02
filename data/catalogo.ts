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
    price: 150.90, // Atualizado conforme seu pedido anterior
    featured: true, // Hero Principal
    isNew: true,
    isPremiumCollection: true,
    description: "O melhor custo-benefício. Leve 3 peças da nossa modelagem Oversized exclusiva. Suedine 240g, gola de 2,5cm e caimento streetwear.",
    imageUrl: "/produtos/camiseta-oversized-preta-premium-hooke-3.avif",
    images: [
      "/produtos/camiseta-oversized-preta-premium-hooke-1.avif",
      "/produtos/camiseta-oversized-offwhite-premium-hooke-1.avif",
      "/produtos/camiseta-oversized-verde-premium-hooke-1.avif",
      "/produtos/camiseta-oversized-azul-premium-hooke-1.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    category: "Kits",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada com Silicone" }
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
    imageUrl: "/produtos/camiseta-oversized-preta-premium-hooke-3.avif",
    images: [
      "/produtos/camiseta-oversized-preta-premium-hooke-3.avif",
      "/produtos/camiseta-oversized-offwhite-premium-hooke-1.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
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
    imageUrl: "/produtos/camiseta-Regata-canelada-verde-1.jpg",
    images: [
      "/produtos/camiseta-Regata-canelada-verde-1.jpg",
      "/produtos/camiseta-Regata-canelada-areia-1.jpg",
      "/produtos/camiseta-Regata-canelada-marrom-1.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
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
    imageUrl: "/produtos/camiseta-Regata-canelada-marrom-1.jpg",
    images: [
      "/produtos/camiseta-Regata-canelada-marrom-1.jpg",
      "/produtos/camiseta-Regata-canelada-verde-1.jpg"
    ],
    sizes: ["P", "M", "G", "GG"],
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
    imageUrl: "/produtos/camiseta-vintage-fusca-preta-1.jpg",
    images: ["/produtos/camiseta-vintage-fusca-preta-1.jpg"],
    sizes: ["P", "M", "G", "GG", "XG"],
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
    imageUrl: "/produtos/camiseta-vintage-fusca-offwhite-1.jpg",
    images: ["/produtos/camiseta-vintage-fusca-offwhite-1.jpg"],
    sizes: ["P", "M", "G", "GG", "XG"],
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
    imageUrl: "/produtos/camiseta-oversized-preta-premium-hooke-3.avif",
    images: [
      "/produtos/camiseta-oversized-preta-premium-hooke-3.avif",
      "/produtos/camiseta-oversized-preta-premium-hooke-1.avif",
      "/produtos/camiseta-oversized-preta-premium-hooke-4.avif"
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    category: "Oversized",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada" }
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
    imageUrl: "/produtos/camiseta-oversized-offwhite-premium-hooke-1.avif",
    images: ["/produtos/camiseta-oversized-offwhite-premium-hooke-1.avif"],
    sizes: ["P", "M", "G", "GG", "XG"],
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
    featured: true, // Destaque Secundário
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
  {
    id: "regata-marrom",
    name: "Regata Canelada Coffee",
    seoAltText: "Regata Canelada Masculina Marrom Coffee em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-marrom",
    price: 50.90,
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
    id: "regata-areia",
    name: "Regata Canelada Sand",
    seoAltText: "Regata Canelada Masculina Areia Sand em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-areia",
    price: 50.90,
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

  // --- VINTAGE (ESTAMPA) ---
  {
    id: "fusca-preta",
    name: "Camiseta Vintage Beetle Black",
    seoAltText: "Camiseta Masculina Vintage Fusca Clássico em Algodão Premium Preta com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-fusca-preta",
    price: 50.90,
    featured: true, // Destaque "Clássico"
    description: "O clássico absoluto. Estampa do Fusca em silk screen de alta definição sobre algodão preto profundo.",
    imageUrl: "/produtos/camiseta-vintage-fusca-preta-1.jpg",
    images: [
      "/produtos/HK_PROD_VI_FUSCA_EDITORIAL_01.png",
      "/produtos/camiseta-vintage-fusca-preta-1.jpg",
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
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
    price: 50.90,
    featured: false,
    description: "Um visual limpo e clássico. A cor off-white destaca a estampa do Beetle com suavidade.",
    imageUrl: "/produtos/camiseta-vintage-fusca-offwhite-1.jpg",
    images: ["/produtos/camiseta-vintage-fusca-offwhite-1.jpg", "/produtos/camiseta-vintage-fusca-offwhite-4.jpg"],
    sizes: ["P", "M", "G", "GG"],
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
    imageUrl: "/produtos/camiseta-vintage-fusca-bordo-1.jpg",
    images: ["/produtos/camiseta-vintage-fusca-bordo-1.jpg"],
    sizes: ["P", "M", "G", "GG"],
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
    imageUrl: "/produtos/camiseta-vintage-kombi-offwhite-1.jpg",
    images: ["/produtos/camiseta-vintage-kombi-offwhite-1.jpg"],
    sizes: ["P", "M", "G", "GG"],
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim", wash: "Pré-Encolhida" }
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
    { size: "XG", chest: "64-66", length: "80-82", sleeve: "24-25" } // Adicionei XG pois tem nos produtos
  ]
};

// ---------------------------------------------------------------------------------
// 3. MENU DE NAVEGAÇÃO
// ---------------------------------------------------------------------------------

export const MENU_LINKS = [
  { name: 'Shop', href: '/' },
  { name: 'Coleção', href: '/colecao' },
  { name: 'Lançamento', href: '/lancamento', highlight: true }, // Link Destaque
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