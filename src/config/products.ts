import { Product } from "@/types"; import { Department, Size } from "@/types";
import { IMAGE_BASE_URL } from "./site";

export const PRODUTOS: Product[] = [
  // --- KITS (O CORAÇÃO DO LUCRO) ---
  {
    id: "kit-3-oversized-premium",
    name: "Kit 3 Camisetas Oversized Premium",
    seoAltText: "Conjunto Kit 3 Camisetas Oversized Masculinas Premium em Algodão 30.1 Penteado cores básicas - Hooke Store",
    slug: "kit-3-camisetas-oversized-premium",
    price: 150.90, // TODO: Migrar para API/Firebase (Preço Dinâmico)
    featured: true,
    isNew: true,
    isPremiumCollection: true,
    description: "O essencial elevado. Três peças em algodão de alta gramatura, projetadas para manter a estrutura e o frescor no dia a dia.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_ov_black_03.avif`,
    images: [
      `${IMAGE_BASE_URL}/produtos/hk_prod_ov_black_01.avif`,
      `${IMAGE_BASE_URL}/produtos/hk_prod_ov_offwhite_01.avif`,
      `${IMAGE_BASE_URL}/produtos/hk_prod_ov_green_01.avif`,
      `${IMAGE_BASE_URL}/produtos/hk_prod_ov_blue_01.avif`
    ],
    sizes: [Size.P, Size.M, Size.G, Size.GG, Size.XG],
    department: Department.MASCULINO,
    category: "Kits",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada com Silicone" },
    totalStock: 3 // TODO: Migrar para API/Firebase (Estoque Dinâmico)
  },
  {
    id: "kit-5-oversized-premium",
    name: "Kit 5 Camisetas Oversized Premium",
    seoAltText: "Conjunto Kit 5 Camisetas Oversized Masculinas Premium em Algodão 30.1 Penteado cores básicas - Hooke Store",
    slug: "kit-5-camisetas-oversized-premium",
    price: 225.90, // TODO: Migrar para API/Firebase (Preço Dinâmico)
    featured: false,
    isNew: true,
    description: "O guarda-roupa completo. Cinco peças com modelagem exclusiva em algodão de alta densidade.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_ov_black_03.avif`,
    images: [
      `${IMAGE_BASE_URL}/produtos/hk_prod_ov_black_03.avif`,
      `${IMAGE_BASE_URL}/produtos/hk_prod_ov_offwhite_01.avif`
    ],
    sizes: [Size.P, Size.M, Size.G, Size.GG, Size.XG],
    department: Department.MASCULINO,
    category: "Kits",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada com Silicone" }
  },
  {
    id: "kit-3-regatas-caneladas",
    name: "Kit 3 Regatas Caneladas Americana",
    seoAltText: "Conjunto Kit 3 Regatas Caneladas Masculinas em Algodão com elastano e modelagem ajustada ao corpo cores básicas - Hooke Store",
    slug: "kit-3-regatas-caneladas-americana",
    price: 120.90, // TODO: Migrar para API/Firebase
    featured: false,
    isNew: true,
    description: "As 3 cores essenciais para o seu treino. Malha canelada com elastano.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_re_military_hero.avif`,
    images: [
      `${IMAGE_BASE_URL}/produtos/hk_prod_re_military_hero.avif`,
      `${IMAGE_BASE_URL}/produtos/hk_prod_re_sand_01.jpg`,
      `${IMAGE_BASE_URL}/produtos/hk_prod_re_coffee_01.jpg`
    ],
    sizes: [Size.P, Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Kits",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "kit-5-regatas-caneladas",
    name: "Kit 5 Regatas Caneladas Americana",
    seoAltText: "Conjunto Kit 5 Regatas Caneladas Masculinas em Algodão com elastano e modelagem ajustada ao corpo cores básicas - Hooke Store",
    slug: "kit-5-regatas-caneladas-americana",
    price: 175.90, // TODO: Migrar para API/Firebase
    featured: false,
    isNew: true,
    description: "Kit Semana. 5 Regatas para garantir o estilo em todos os treinos.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_re_coffee_01.jpg`,
    images: [
      `${IMAGE_BASE_URL}/produtos/hk_prod_re_coffee_01.jpg`,
      `${IMAGE_BASE_URL}/produtos/hk_prod_re_military_01.jpg`
    ],
    sizes: [Size.P, Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Kits",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "kit-3-vintage-premium",
    name: "Kit 3 Camisetas Vintage",
    seoAltText: "Conjunto Kit 3 Camisetas Masculinas Vintage em Algodão Premium com estampas retrô automotivas - Hooke Store",
    slug: "kit-3-camisetas-vintage",
    price: 120.90, // TODO: Migrar para API/Firebase
    featured: false,
    isNew: true,
    description: "Herança e estilo. Algodão premium nacional com estampas que celebram a história clássica com suavidade.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_black_01.jpg`,
    images: [`${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_black_01.jpg`],
    sizes: [Size.P, Size.M, Size.G, Size.GG, Size.XG],
    department: Department.MASCULINO,
    category: "Kits",
    details: { fabric: "Algodão Egípcio", model: "Regular", wash: "Pré-Encolhida" }
  },
  {
    id: "kit-5-vintage-premium",
    name: "Kit 5 Camisetas Vintage",
    seoAltText: "Conjunto Kit 5 Camisetas Masculinas Vintage em Algodão Premium com estampas retrô automotivas - Hooke Store",
    slug: "kit-5-camisetas-vintage",
    price: 175.90, // TODO: Migrar para API/Firebase
    featured: false,
    isNew: true,
    description: "Coleção completa. 5 camisetas vintage para quem tem personalidade.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_offwhite_01.jpg`,
    images: [`${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_offwhite_01.jpg`],
    sizes: [Size.P, Size.M, Size.G, Size.GG, Size.XG],
    department: Department.MASCULINO,
    category: "Kits",
    details: { fabric: "Algodão Egípcio", model: "Regular", wash: "Pré-Encolhida" }
  },

  // --- OVERSIZED (CARRO CHEFE) ---
  {
    id: "oversized-preta",
    name: "Camiseta Oversized Black",
    seoAltText: "Camiseta Oversized Masculina Heavy Cotton Preta em Algodão Egípcio de alta gramatura - Hooke Store",
    slug: "camiseta-oversized-preta-premium",
    price: 69.90, // TODO: Migrar para API/Firebase
    featured: false,
    isNew: true,
    description: "A base do guarda-roupa contemporâneo. Algodão denso de toque macio, moldado para oferecer uma presença forte e confortável.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_ov_black_03.avif`,
    images: [
      `${IMAGE_BASE_URL}/produtos/hk_prod_ov_black_03.avif`,
      `${IMAGE_BASE_URL}/produtos/hk_prod_ov_black_01.avif`,
      `${IMAGE_BASE_URL}/produtos/hk_prod_ov_black_04.avif`
    ],
    sizes: [Size.P, Size.M, Size.G, Size.GG, Size.XG],
    department: Department.MASCULINO,
    category: "Oversized",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada" },
    totalStock: 2 // TODO: Migrar para API/Firebase
  },
  {
    id: "oversized-offwhite",
    name: "Camiseta Oversized Off-White",
    seoAltText: "Camiseta Oversized Masculina Heavy Cotton Off-White em Algodão Egípcio de alta gramatura - Hooke Store",
    slug: "camiseta-oversized-offwhite-premium",
    price: 69.90, // TODO: Migrar para API/Firebase
    featured: false,
    isNew: true,
    description: "Tonalidade natural que traz sofisticação para o streetwear. Suedine 240g que não fica transparente.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_ov_offwhite_01.avif`,
    images: [`${IMAGE_BASE_URL}/produtos/hk_prod_ov_offwhite_01.avif`],
    sizes: [Size.P, Size.M, Size.G, Size.GG, Size.XG],
    department: Department.MASCULINO,
    category: "Oversized",
    details: { fabric: "Suedine 240g", model: "Oversized Boxy", wash: "Amaciada" }
  },

  // --- REGATAS ---
  {
    id: "regata-verde",
    name: "Regata Canelada Militar",
    seoAltText: "Regata Canelada Masculina Verde Militar em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-verde",
    price: 50.90, // TODO: Migrar para API/Firebase
    featured: true,
    description: "Desempenho e textura. Malha respirável com acabamento Stone Wash, ideal para o dinamismo do nosso clima.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_re_military_hero.avif`,
    images: [
      `${IMAGE_BASE_URL}/produtos/hk_prod_re_military_hero.avif`
    ],
    sizes: [Size.P, Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Regatas",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "regata-marrom",
    name: "Regata Canelada Coffee",
    seoAltText: "Regata Canelada Masculina Marrom Coffee em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-marrom",
    price: 50.90, // TODO: Migrar para API/Firebase
    featured: false,
    description: "Textura que diferencia. Malha canelada que se ajusta ao corpo sem apertar.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_re_coffee_01.jpg`,
    images: [
      `${IMAGE_BASE_URL}/produtos/hk_prod_re_coffee_01.jpg`
    ],
    sizes: [Size.P, Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Regatas",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "regata-areia",
    name: "Regata Canelada Sand",
    seoAltText: "Regata Canelada Masculina Areia Sand em Algodão com elastano e modelagem ajustada ao corpo - Hooke Store",
    slug: "regata-canelada-areia",
    price: 50.90, // TODO: Migrar para API/Firebase
    featured: false,
    description: "Tons terrosos são essenciais. Uma peça neutra que combina com bermudas de qualquer cor.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_re_sand_01.jpg`,
    images: [
      `${IMAGE_BASE_URL}/produtos/hk_prod_re_sand_01.jpg`
    ],
    sizes: [Size.P, Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Regatas",
    details: { fabric: "Malha Canelada", model: "Machão", wash: "Stone Washed" }
  },
  {
    id: "regata-lifestyle-bege",
    name: "Regata Lifestyle Bege",
    seoAltText: "Regata Lifestyle Masculina Bege em Algodão BCI de corte a fio e caimento estruturado - Hooke Store",
    slug: "regata-lifestyle-bege",
    price: 89.90, // TODO: Migrar para API/Firebase
    featured: false,
    description: "Básica, mas nunca simples. Corte a fio na gola e mangas para um visual despojado.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_re_lifestyle_bege_01.jpg`,
    images: [`${IMAGE_BASE_URL}/produtos/hk_prod_re_lifestyle_bege_01.jpg`],
    sizes: [Size.P, Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Lifestyle",
    details: { fabric: "Algodão BCI", model: "Oversized", wash: "Tingimento Ecológico" }
  },

  // --- VINTAGE (ESTAMPA) ---
  {
    id: "fusca-preta",
    name: "Camiseta Vintage Beetle Black",
    seoAltText: "Camiseta Masculina Vintage Fusca Clássico em Algodão Premium Preta com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-fusca-preta",
    price: 50.90, // TODO: Migrar para API/Firebase
    featured: true,
    description: "O clássico absoluto. Estampa do Fusca em silk screen de alta definition sobre algodão preto profundo.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_editorial_01.png`,
    images: [
      `${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_editorial_01.png`
    ],
    sizes: [Size.P, Size.M, Size.G, Size.GG, Size.XG],
    department: Department.MASCULINO,
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim Comfort", wash: "Pré-Encolhida" }
  },
  {
    id: "maverick-vermelha",
    name: "Camiseta Vintage Maverick Red",
    seoAltText: "Camiseta Masculina Vintage Maverick em Algodão Premium Vermelha com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-maverick-vermelha",
    price: 50.90, // TODO: Migrar para API/Firebase
    featured: false,
    description: "Velocidade e história. Homenagem ao lendário V8. Cor vibrante com estampa desgastada.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_vi_maverick_red_01.jpg`,
    images: [`${IMAGE_BASE_URL}/produtos/hk_prod_vi_maverick_red_01.jpg`],
    sizes: [Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Vintage",
    details: { fabric: "Algodão Premium", model: "Regular", wash: "Amaciada" }
  },
  {
    id: "fusca-offwhite",
    name: "Camiseta Vintage Beetle Off-White",
    seoAltText: "Camiseta Masculina Vintage Fusca Clássico em Algodão Premium Off-White com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-fusca-offwhite",
    price: 50.90, // TODO: Migrar para API/Firebase
    featured: false,
    description: "Um visual limpo e clássico. A cor off-white destaca a estampa do Beetle com suavidade.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_offwhite_01.jpg`,
    images: [`${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_offwhite_01.jpg`, `${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_offwhite_04.jpg`],
    sizes: [Size.P, Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Regular Fit", wash: "Pré-Encolhida" }
  },
  {
    id: "fusca-bordo",
    name: "Camiseta Vintage Beetle Bordô",
    seoAltText: "Camiseta Masculina Vintage Fusca Clássico em Algodão Premium Bordô com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-fusca-bordo",
    price: 50.90, // TODO: Migrar para API/Firebase
    featured: false,
    description: "Elegância e atitude. O tom bordô traz sofisticação para o visual casual.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_bordo_01.jpg`,
    images: [`${IMAGE_BASE_URL}/produtos/hk_prod_vi_fusca_bordo_01.jpg`],
    sizes: [Size.P, Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim Comfort", wash: "Amaciada" }
  },
  {
    id: "kombi-offwhite",
    name: "Camiseta Vintage Kombi",
    seoAltText: "Camiseta Masculina Vintage Kombi Roadtrip em Algodão Premium Off-White com estampa retrô automotiva - Hooke Store",
    slug: "camiseta-vintage-kombi-offwhite",
    price: 50.90, // TODO: Migrar para API/Firebase
    featured: false,
    description: "Para espíritos livres. A Kombi representa a viagem, não o destino.",
    imageUrl: `${IMAGE_BASE_URL}/produtos/hk_prod_vi_kombi_offwhite_01.jpg`,
    images: [`${IMAGE_BASE_URL}/produtos/hk_prod_vi_kombi_offwhite_01.jpg`],
    sizes: [Size.P, Size.M, Size.G, Size.GG],
    department: Department.MASCULINO,
    category: "Vintage",
    details: { fabric: "Algodão Egípcio", model: "Slim", wash: "Pré-Encolhida" }
  },
  // --- FEMININO (Ensaio Profissional v4 - Hooke Elite) ---
  {
    id: "fem-conjunto-viscose-verde",
    name: "Conjunto Minimalista Forest",
    seoAltText: "presente premium dia das maes conjunto feminino verde forest em viscose lore liso de alta gramatura - hooke femme",
    slug: "conjunto-feminino-viscose-verde",
    price: 100.00, // TODO: Migrar para API/Firebase
    featured: true,
    isPremiumCollection: true,
    isNew: true,
    totalStock: 24, // TODO: Migrar para API/Firebase
    description: "lote 001. arquitetura têxtil projetada para o repouso absoluto. viscose de toque gelado com gramatura superior que não marca. o presente definitivo para quem valoriza conforto sem abrir mão da presença. (coleção dia das mães).",
    imageUrl: `${IMAGE_BASE_URL}/assets/femme/musas_001_forest_fit.png`,
    images: [
      `${IMAGE_BASE_URL}/assets/femme/musas_001_forest_fit.png`,
      `${IMAGE_BASE_URL}/assets/femme/musas_001_forest_details.png`
    ],
    sizes: [Size.P, Size.M, Size.G],
    department: Department.FEMININO,
    category: "Conjuntos",
    details: { fabric: "96% Viscose, 4% Elastano (Lore Liso)", model: "Pantalona & Relaxed T-shirt", wash: "Acabamento Fosco Premium" }
  },
  {
    id: "fem-conjunto-viscose-azul",
    name: "Conjunto Minimalista Navy",
    seoAltText: "presente premium dia das maes conjunto feminino azul navy em viscose inteligente lore liso - hooke femme",
    slug: "conjunto-feminino-viscose-azul",
    price: 100.00, // TODO: Migrar para API/Firebase
    featured: false,
    isPremiumCollection: true,
    isNew: true,
    totalStock: 24, // TODO: Migrar para API/Firebase
    description: "pré-venda lote 001. para os dias em que a discrição é a maior de todas as presenças. caimento fluido e estruturado que abraça todos os corpos com conforto absoluto. o luxo essencial para o dia das mães.",
    imageUrl: `${IMAGE_BASE_URL}/assets/femme/musas_001_navy_focus.png`,
    images: [
      `${IMAGE_BASE_URL}/assets/femme/musas_001_navy_focus.png`,
      `${IMAGE_BASE_URL}/assets/femme/musas_001_navy_construction.png`
    ],
    sizes: [Size.P, Size.M, Size.G],
    department: Department.FEMININO,
    category: "Conjuntos",
    details: { fabric: "96% Viscose, 4% Elastano (Lore Liso)", model: "Pantalona & Relaxed T-shirt", wash: "Acabamento Fosco Premium" }
  },
  {
    id: "fem-conjunto-viscose-chocolate",
    name: "Conjunto Minimalista Chocolate",
    seoAltText: "presente luxo dia das maes conjunto feminino marrom chocolate alfaiataria em viscose premium - hooke femme",
    slug: "conjunto-feminino-viscose-chocolate",
    price: 100.00, // TODO: Migrar para API/Firebase
    featured: true,
    isPremiumCollection: true,
    isNew: true,
    totalStock: 24, // TODO: Migrar para API/Firebase
    description: "pré-venda lote 001. a sofisticação do tom chocolate unida à engenharia têxtil hooke. tecido gelado inteligente que proporciona estrutura impecável. uma experiência tátil inesquecível para presentear quem importa.",
    imageUrl: `${IMAGE_BASE_URL}/assets/femme/musas_001_chocolate_1.png`,
    images: [
      `${IMAGE_BASE_URL}/assets/femme/musas_001_chocolate_1.png`,
      `${IMAGE_BASE_URL}/assets/femme/musas_001_chocolate_2.png`,
      `${IMAGE_BASE_URL}/assets/femme/musas_001_chocolate_3.png`,
      `${IMAGE_BASE_URL}/assets/femme/musas_001_chocolate_4.png`
    ],
    sizes: [Size.P, Size.M, Size.G],
    department: Department.FEMININO,
    category: "Conjuntos",
    details: { fabric: "96% Viscose, 4% Elastano (Lore Liso)", model: "Pantalona & Relaxed T-shirt", wash: "Acabamento Fosco Premium" }
  },
  {
    id: "fem-conjunto-manga-morcego-marrom",
    name: "Conjunto Manga Morcego Marrom",
    seoAltText: "presente perfeito dia das maes conjunto feminino manga morcego marrom alta gramatura que nao marca - hooke femme",
    slug: "conjunto-feminino-manga-morcego-marrom",
    price: 100.00, // TODO: Migrar para API/Firebase
    featured: true,
    isPremiumCollection: true,
    isNew: true,
    totalStock: 24, // TODO: Migrar para API/Firebase
    description: "edição especial. arquitetura silhueta manga morcego. viscose estruturada de alta densidade projetada para cair com fluidez e não marcar. o nível máximo do streetwear de luxo para o dia das mães.",
    imageUrl: `${IMAGE_BASE_URL}/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_master_01_1777561912183.png`,
    images: [
      `${IMAGE_BASE_URL}/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_master_01_1777561912183.png`,
      `${IMAGE_BASE_URL}/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_master_02_dynamic_1777562012010.png`,
      `${IMAGE_BASE_URL}/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_calca_focus.png`,
      `${IMAGE_BASE_URL}/ensaio-feminino/conjunto-feminino-manga_morcego-marrom/hooke_manga_morcego_marrom_alfaiate_closeup.png`
    ],
    sizes: [Size.P, Size.M, Size.G],
    department: Department.FEMININO,
    category: "Conjuntos",
    details: { fabric: "Viscose e Elastano (Alta Gramatura)", model: "Manga Morcego & Pantalona", wash: "Acabamento Premium" }
  }
];
