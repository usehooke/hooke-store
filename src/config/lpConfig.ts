export interface LandingPageContent {
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  features: { title: string; desc: string; icon: string }[];
  category: string; // Para filtrar os produtos
  ctaText: string;
}

export const lpConfig: Record<string, LandingPageContent> = {
  'oversized': {
    title: 'Linha Oversized: O Caimento Perfeito.',
    subtitle: 'Conforto extremo com a estética Streetwear que você procura.',
    heroImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
    description: 'Nossa linha Oversized foi desenhada para quem não abre mão do estilo. Tecido pesado (Heavyweight), gola que não laceia e modelagem que valoriza o shape.',
    features: [
      { title: 'Tecido Heavyweight', desc: 'Algodão de alta gramatura para durabilidade máxima.', icon: 'Zap' },
      { title: 'Gola Premium', desc: 'Reforço ombro a ombro que mantém a estrutura.', icon: 'ShieldCheck' },
      { title: 'Modelagem Exclusiva', desc: 'A proporção exata entre largura e comprimento.', icon: 'Check' },
    ],
    category: 'oversized',
    ctaText: 'Garantir minha Oversized',
  },
  'regatas': {
    title: 'Performance & Estilo: Regatas Hooke',
    subtitle: 'A peça definitiva para os seus treinos mais intensos.',
    heroImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop',
    description: 'Corte anatômico que valoriza a musculatura e proporciona liberdade total de movimento. O tecido tecnológico Hooke garante frescor durante todo o treino.',
    features: [
      { title: 'Corte Cavado', desc: 'Máximo conforto e ventilação lateral.', icon: 'Wind' },
      { title: 'Toque Macio', desc: 'Não irrita a pele mesmo com suor intenso.', icon: 'Heart' },
      { title: 'Secagem Rápida', desc: 'Pronta para o próximo round em minutos.', icon: 'Zap' },
    ],
    category: 'regatas',
    ctaText: 'Escolher minha Regata',
  },
  'basicas-premium': {
    title: 'O Essencial Elevado ao Máximo.',
    subtitle: 'A camiseta branca (ou preta) definitiva do seu guarda-roupa.',
    heroImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    description: 'Esqueça as básicas que estragam na primeira lavagem. A linha Premium da Hooke usa fibras selecionadas para um toque de seda e durabilidade eterna.',
    features: [
      { title: 'Algodão Pima', desc: 'O melhor algodão do mundo no seu corpo.', icon: 'Award' },
      { title: 'Cor Intensa', desc: 'Preto que não desbota e branco que não amarela.', icon: 'Palette' },
      { title: 'Versatilidade', desc: 'Do escritório ao happy hour com elegância.', icon: 'Briefcase' },
    ],
    category: 'basicas',
    ctaText: 'Ver Linha Premium',
  },
  'canelada-regular': {
    title: 'Textura & Estilo: Camisetas Caneladas',
    subtitle: 'O equilíbrio perfeito entre o casual e o sofisticado.',
    heroImage: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1000&auto=format&fit=crop',
    description: 'A malha canelada da Hooke oferece elasticidade natural e uma textura única que eleva qualquer visual básico. Modelagem regular que se adapta ao corpo sem apertar.',
    features: [
      { title: 'Elasticidade Natural', desc: 'Conforto que acompanha seus movimentos.', icon: 'Zap' },
      { title: 'Toque Canelado', desc: 'Textura visual que traz sofisticação imediata.', icon: 'Palette' },
      { title: 'Durabilidade', desc: 'Não perde a forma mesmo após diversas lavagens.', icon: 'ShieldCheck' },
    ],
    category: 'canelada',
    ctaText: 'Ver Caneladas',
  },
};
