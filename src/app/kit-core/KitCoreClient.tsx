'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import {
  ShoppingBag,
  ChevronDown,
  MessageCircle,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Zap,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';

// ─────────────────────────────────────────────
//  CONSTANTES
// ─────────────────────────────────────────────

const COLORS = [
  {
    id: 'black',
    name: 'Preta',
    hex: '#111111',
    textColor: 'text-white',
    borderColor: 'border-black',
    bgClass: 'bg-[#111111]',
    label: 'Preta',
  },
  {
    id: 'off-white',
    name: 'Off-White',
    hex: '#F5F0E8',
    textColor: 'text-black',
    borderColor: 'border-black',
    bgClass: 'bg-[#F5F0E8]',
    label: 'Off-White',
  },
  {
    id: 'mescla',
    name: 'Mescla',
    hex: '#AEADAB',
    textColor: 'text-black',
    borderColor: 'border-black',
    bgClass: 'bg-[#AEADAB]',
    label: 'Mescla',
  },
] as const;

const SIZES = ['P', 'M', 'G', 'GG', 'XGG'];

const KIT_PRICE = 199.90;
const KIT_ORIGINAL_PRICE = 249.90;
const KIT_PIX_PRICE = KIT_PRICE * 0.85;

// Mock de produto para o Kit — ID real a ser vinculado
const KIT_PRODUCT_BASE = {
  id: 'kit-core-hooke',
  name: 'Kit Core Hooke',
  slug: 'kit-core-hooke',
  price: KIT_PRICE,
  category: 'camisetas-lisas' as const,
  description: 'Kit com 3 camisetas heavyweight 260g',
  images: [],
  sizes: SIZES,
  details: {
    grammage: '260g/m²',
    yarn: 'Algodão Pima',
    collar: '3cm canelada',
  },
  isActive: true,
  createdAt: new Date().toISOString(),
};

// ─────────────────────────────────────────────
//  UTILITÁRIOS DE FORMATAÇÃO
// ─────────────────────────────────────────────

const formatBRL = (val: number) =>
  val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ─────────────────────────────────────────────
//  HOOK: SCROLL POSITION
// ─────────────────────────────────────────────

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrollY;
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: FADE-IN WRAPPER
// ─────────────────────────────────────────────

function FadeInUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: BARRA DE ESCASSEZ
// ─────────────────────────────────────────────

function ScarcityBar() {
  return (
    <div className="bg-black text-white text-center py-2 px-4 font-jost text-[11px] tracking-widest uppercase flex flex-wrap items-center justify-center gap-2">
      <span className="opacity-60">Lote 01/26</span>
      <span className="hidden sm:inline opacity-60">—</span>
      <span className="font-medium">Limitado a 150 kits</span>
      <span className="hidden sm:inline text-[#E8C97A] font-medium">·</span>
      <span className="text-[#E8C97A] font-medium">Restam poucas unidades</span>
      <span className="opacity-40 ml-2">🇧🇷 Torcida Hooke '26</span>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: HERO
// ─────────────────────────────────────────────

function HeroSection({ onScrollToBuy }: { onScrollToBuy: () => void }) {
  return (
    <section className="relative min-h-[100svh] flex flex-col bg-white overflow-hidden">
      {/* Background grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Imagem em coluna da direita no desktop, topo no mobile */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Coluna Esquerda — Texto */}
        <div className="flex flex-col justify-center px-6 py-16 md:px-16 md:w-1/2 z-10 order-2 md:order-1">
          {/* Tag de produto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 border border-black/20 px-3 py-1 mb-6 w-fit"
          >
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            <span className="font-jost text-[11px] tracking-widest uppercase text-black/60">
              Kit Exclusivo — Lote 01/26
            </span>
          </motion.div>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-jost font-light text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.95] tracking-tight text-black mb-6"
          >
            Kit
            <br />
            Core.
          </motion.h1>

          {/* Subtítulo descritivo */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-sans text-base text-black/60 leading-relaxed max-w-xs mb-2"
          >
            3 camisetas heavyweight de algodão <strong className="text-black font-medium">260g</strong>.
            {' '}A base do seu guarda-roupa.
          </motion.p>

          {/* Pills de características */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {['Não encolhe', 'Gola não deforma', 'Modelagem Boxy'].map((pill) => (
              <span
                key={pill}
                className="border border-black/25 font-sans text-[11px] tracking-wider uppercase px-3 py-1 text-black/70"
              >
                {pill}
              </span>
            ))}
          </motion.div>

          {/* Preço */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mb-8 relative"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-jost text-[clamp(2rem,5vw,2.8rem)] font-light text-black">
                {formatBRL(KIT_PRICE)}
              </span>
              <span className="font-sans text-sm text-black/40 line-through">
                {formatBRL(KIT_ORIGINAL_PRICE)}
              </span>
            </div>
            <p className="font-sans text-sm text-emerald-600 mt-1 mb-3">
              ou {formatBRL(KIT_PIX_PRICE)} no PIX
            </p>
            {/* Pulse de Gatilho Social */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/5 border border-black/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="font-sans text-[10px] uppercase tracking-wider text-black/60 font-medium">
                4 pessoas estão fechando este kit
              </span>
            </div>
          </motion.div>

          {/* CTA Principal */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            onClick={onScrollToBuy}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="btn-hooke-elite flex items-center justify-between px-6 py-4 text-sm font-jost tracking-widest uppercase w-full md:max-w-xs"
          >
            <span>Montar Meu Kit</span>
            <ArrowRight size={16} />
          </motion.button>

          {/* Prova social discreta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center gap-2 mt-5"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-black text-black" />
            ))}
            <span className="font-sans text-xs text-black/50 ml-1">4.9 · 312 avaliações</span>
          </motion.div>
        </div>

        {/* Coluna Direita — Imagem */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative md:w-1/2 h-[55vw] md:h-auto min-h-[280px] order-1 md:order-2 overflow-hidden border-b md:border-b-0 md:border-l border-black/10"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/kit-core-hero.png)',
              backgroundPosition: 'center top',
            }}
          />
          {/* Overlay gradiente para legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 md:to-transparent" />

          {/* Tag flutuante brutalista */}
          <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-2 flex flex-col shadow-brutal">
            <span className="font-jost text-[10px] tracking-widest uppercase opacity-60">Malha</span>
            <span className="font-jost text-lg font-light leading-none">260g</span>
            <span className="font-jost text-[9px] tracking-widest uppercase opacity-60">Heavyweight</span>
          </div>
        </motion.div>
      </div>

      {/* Seta de scroll */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 cursor-pointer"
        onClick={onScrollToBuy}
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <span className="font-sans text-[10px] tracking-widest uppercase text-black/40">Montar kit</span>
        <ChevronDown size={16} className="text-black/40" />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: ARGUMENTOS FÍSICOS
// ─────────────────────────────────────────────

const ARGUMENTS = [
  {
    num: '01',
    title: 'Gola que não deforma',
    body: 'Canelada de 3cm com reforço estrutural. Aguenta mil lavagens sem perder a forma ou afunilar o pescoço.',
    icon: Shield,
  },
  {
    num: '02',
    title: 'Malha que não encolhe',
    body: 'Algodão premium 260g compactado. O fio é pré-encolhido na fábrica. O que você compra, você usa — para sempre.',
    icon: Zap,
  },
  {
    num: '03',
    title: 'Modelagem Boxy',
    body: 'Caimento reto e estruturado no corpo. Ombro levemente caído. Comprimento estratégico que funciona com calça e short.',
    icon: Star,
  },
];

function ArgumentsSection() {
  return (
    <section className="py-20 px-6 md:px-16 bg-white border-t border-black/10">
      <FadeInUp>
        <div className="flex items-center gap-3 mb-12">
          <span className="font-jost text-[11px] tracking-widest uppercase text-black/40">
            Engenharia do Produto
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {ARGUMENTS.map((arg, i) => (
          <FadeInUp key={arg.num} delay={i * 0.15}>
            <div className="border border-black/10 p-8 md:border-r-0 last:border-r border-b md:border-b-0 group hover:bg-black hover:text-white transition-colors duration-500">
              <div className="flex items-start justify-between mb-6">
                <span className="font-jost text-[11px] tracking-widest text-black/30 group-hover:text-white/30">
                  {arg.num}
                </span>
                <arg.icon size={18} className="text-black/20 group-hover:text-white/30" />
              </div>
              <h3 className="font-jost text-xl font-light tracking-tight mb-3 leading-tight">
                {arg.title}
              </h3>
              <p className="font-sans text-sm text-black/60 group-hover:text-white/70 leading-relaxed">
                {arg.body}
              </p>
            </div>
          </FadeInUp>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: RÉGUA DE GRAMATURA
// ─────────────────────────────────────────────

const DENSITY_SCALE = [
  { g: 140, label: 'Básica', desc: 'Transparente' },
  { g: 180, label: 'Regular', desc: 'Encolhe' },
  { g: 220, label: 'Média', desc: 'Razoável' },
  { g: 260, label: 'Heavyweight', desc: 'Ideal', isActive: true },
  { g: 300, label: 'Ultra', desc: 'Pesada' },
];

function GrammageRuler() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const activeIdx = 3;

  return (
    <section className="py-20 px-6 md:px-16 bg-[#F5F4F2] border-t border-black/10">
      <FadeInUp>
        <div className="flex items-center gap-3 mb-12">
          <span className="font-jost text-[11px] tracking-widest uppercase text-black/40">
            Engenharia da Malha
          </span>
          <div className="flex-1 h-px bg-black/20" />
        </div>
      </FadeInUp>

      <div ref={ref} className="max-w-2xl mx-auto">
        <FadeInUp delay={0.1}>
          <p className="font-jost text-[clamp(1.6rem,4vw,2.4rem)] font-light tracking-tight mb-2 text-black">
            260g/m² — Heavyweight
          </p>
          <p className="font-sans text-sm text-black/50 mb-10">
            O ponto ideal entre peso, durabilidade e conforto.
          </p>
        </FadeInUp>

        {/* Escala horizontal */}
        <FadeInUp delay={0.2}>
          <div className="relative mb-4">
            <div className="flex border border-black/15">
              {DENSITY_SCALE.map((item, i) => (
                <div
                  key={item.g}
                  className={`flex-1 border-r border-black/15 last:border-r-0 group relative ${
                    item.isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5 transition-colors cursor-crosshair'
                  }`}
                >
                  <div className="p-3 text-center">
                    <span
                      className={`font-jost text-xs font-medium block ${
                        item.isActive ? 'text-white' : 'text-black/70'
                      }`}
                    >
                      {item.g}g
                    </span>
                    <span
                      className={`font-sans text-[9px] tracking-wider uppercase mt-0.5 block ${
                        item.isActive ? 'text-white/70' : 'text-black/30 group-hover:text-black/70'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {/* Tooltip interativa CRO */}
                  {!item.isActive && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 font-sans text-[10px] tracking-wide whitespace-nowrap pointer-events-none z-10 shadow-sharp">
                      {item.g === 140 && 'Transparente e fina'}
                      {item.g === 180 && 'Encolhe na lavagem'}
                      {item.g === 220 && 'Falta estrutura'}
                      {item.g === 300 && 'Quente demais'}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Ponteiro animado */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -top-3 flex flex-col items-center"
              style={{
                left: `${(activeIdx / DENSITY_SCALE.length) * 100 + 100 / DENSITY_SCALE.length / 2}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="bg-black text-white px-2 py-0.5 font-jost text-[9px] tracking-widest uppercase">
                Você está aqui
              </div>
              <div className="w-px h-3 bg-black" />
            </motion.div>
          </div>

          {/* Descrições */}
          <div className="flex border border-t-0 border-black/15">
            {DENSITY_SCALE.map((item) => (
              <div
                key={item.g}
                className={`flex-1 border-r border-black/15 last:border-r-0 px-2 py-1.5 text-center ${
                  item.isActive ? 'bg-black/5' : ''
                }`}
              >
                <span
                  className={`font-sans text-[9px] uppercase tracking-wider ${
                    item.isActive ? 'text-black font-medium' : 'text-black/30'
                  }`}
                >
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: BUNDLE SELECTOR
// ─────────────────────────────────────────────

type SizeSelection = {
  black: string | null;
  'off-white': string | null;
  mescla: string | null;
};

function BundleSelector({
  selectorRef,
  onAddToCart,
}: {
  selectorRef: React.RefObject<HTMLDivElement | null>;
  onAddToCart: (selections: SizeSelection) => void;
}) {
  const [sizes, setSizes] = useState<SizeSelection>({
    black: null,
    'off-white': null,
    mescla: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allSelected = Object.values(sizes).every((s) => s !== null);

  const handleSize = (colorId: keyof SizeSelection, size: string) => {
    setSizes((prev) => ({ ...prev, [colorId]: size }));
    setError(null);
  };

  const handleSubmit = () => {
    if (!allSelected) {
      setError('Escolha o tamanho de cada camiseta antes de continuar.');
      return;
    }
    setSubmitted(true);
    onAddToCart(sizes);
  };

  return (
    <section
      ref={selectorRef}
      id="bundle-selector"
      className="py-20 px-6 md:px-16 bg-white border-t border-black/10"
    >
      <FadeInUp>
        <div className="flex items-center gap-3 mb-12">
          <span className="font-jost text-[11px] tracking-widest uppercase text-black/40">
            Monte Seu Kit
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>
      </FadeInUp>

      <div className="max-w-2xl mx-auto space-y-0">
        {COLORS.map((color, i) => (
          <FadeInUp key={color.id} delay={i * 0.1}>
            <div className="border border-black/15 border-b-0 last:border-b p-6">
              {/* Cabeçalho da camiseta */}
              <div className="flex items-center gap-4 mb-5">
                {/* Swatch */}
                <div
                  className="w-10 h-10 border border-black/20 flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <p className="font-jost text-base font-light tracking-tight">{color.name}</p>
                  <p className="font-sans text-xs text-black/40">Camiseta #{i + 1} do kit</p>
                </div>
                {sizes[color.id] && (
                  <div className="ml-auto border border-black px-2.5 py-0.5 font-jost text-xs tracking-widest">
                    {sizes[color.id]}
                  </div>
                )}
              </div>

              {/* Grade de tamanhos */}
              <div className="flex gap-2 flex-wrap">
                {SIZES.map((size) => (
                  <motion.button
                    key={size}
                    id={`size-btn-${color.id}-${size}`}
                    onClick={() => handleSize(color.id as keyof SizeSelection, size)}
                    animate={error && !sizes[color.id] ? { x: [-4, 4, -4, 4, 0] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`min-h-[48px] min-w-[48px] flex items-center justify-center font-jost text-xs tracking-widest uppercase border transition-colors duration-200 ${
                      sizes[color.id] === size
                        ? 'bg-black text-white border-black shadow-brutal-sm'
                        : error && !sizes[color.id]
                        ? 'bg-red-50 text-red-600 border-red-300'
                        : 'bg-white text-black/70 border-black/20 hover:border-black hover:text-black'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInUp>
        ))}
      </div>

      {/* Sumário de preço */}
      <FadeInUp delay={0.35}>
        <div className="max-w-2xl mx-auto mt-0 border border-black/15 p-6 bg-[#F5F4F2]">
          <div className="flex justify-between items-center mb-1">
            <span className="font-sans text-sm text-black/60">3 camisetas heavyweight 260g</span>
            <span className="font-sans text-sm text-black/40 line-through">
              {formatBRL(KIT_ORIGINAL_PRICE)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-jost text-lg font-light">Total do Kit</span>
            <span className="font-jost text-2xl font-light">{formatBRL(KIT_PRICE)}</span>
          </div>
          <div className="flex justify-between items-center mb-5 pb-5 border-b border-black/10">
            <span className="font-sans text-xs text-black/50">No PIX com 15% de desconto</span>
            <span className="font-sans text-sm text-emerald-600 font-medium">
              {formatBRL(KIT_PIX_PRICE)}
            </span>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="font-sans text-xs text-red-600 mb-4 flex items-center gap-2"
              >
                <X size={12} />
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTA */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 font-jost text-sm tracking-widest uppercase"
              >
                <Check size={16} />
                Kit adicionado!
              </motion.div>
            ) : (
              <motion.button
                key="cta"
                id="kit-core-add-to-cart"
                onClick={handleSubmit}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                className={`w-full flex items-center justify-between px-6 py-4 font-jost text-sm tracking-widest uppercase border transition-all duration-300 ${
                  allSelected
                    ? 'bg-black text-white border-black shadow-brutal hover:shadow-brutal-lg'
                    : 'bg-white text-black/40 border-black/20 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={16} />
                  {allSelected ? 'Adicionar ao Carrinho' : 'Escolha os tamanhos'}
                </span>
                {allSelected && <ArrowRight size={16} />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </FadeInUp>

      {/* Garantias */}
      <FadeInUp delay={0.45}>
        <div className="max-w-2xl mx-auto mt-4 grid grid-cols-3 gap-0 border border-black/10">
          {[
            { icon: Truck, text: 'Frete grátis acima de R$ 199' },
            { icon: RotateCcw, text: 'Troca grátis em 30 dias' },
            { icon: Shield, text: 'Compra 100% segura' },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex flex-col items-center text-center gap-2 p-4 border-r border-black/10 last:border-r-0"
            >
              <Icon size={16} className="text-black/40" />
              <span className="font-sans text-[10px] text-black/50 leading-tight">{text}</span>
            </div>
          ))}
        </div>
      </FadeInUp>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: PROVA SOCIAL
// ─────────────────────────────────────────────

const REVIEWS = [
  {
    name: 'Rafael M.',
    city: 'São Paulo, SP',
    text: 'Comprei o kit e usei por 6 meses. Gola continua perfeita, não deformou nada. A malha é pesada mesmo, sensação premium.',
    rating: 5,
    verified: true,
  },
  {
    name: 'Lucas A.',
    city: 'Curitiba, PR',
    text: 'Já lavei umas 30 vezes e não encolheu nada. A cor preta continua intensa. Vale muito o preço do kit.',
    rating: 5,
    verified: true,
  },
  {
    name: 'Thiago R.',
    city: 'Rio de Janeiro, RJ',
    text: 'Melhor compra de camiseta que fiz na vida. O caimento é exato. Comprei M e ficou perfeito pro meu corpo.',
    rating: 5,
    verified: true,
  },
];

function SocialProof() {
  return (
    <section className="py-20 px-6 md:px-16 bg-[#F5F4F2] border-t border-black/10">
      <FadeInUp>
        <div className="flex items-center gap-3 mb-12">
          <span className="font-jost text-[11px] tracking-widest uppercase text-black/40">
            Quem comprou aprovou
          </span>
          <div className="flex-1 h-px bg-black/20" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className="fill-black text-black" />
            ))}
            <span className="font-sans text-[11px] text-black/60 ml-1">4.9 (312)</span>
          </div>
        </div>
      </FadeInUp>

      <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-0 hide-scrollbar pb-4 md:pb-0 -mx-6 md:mx-0 px-6 md:px-0">
        {REVIEWS.map((review, i) => (
          <FadeInUp key={review.name} delay={i * 0.12} className="min-w-[85vw] md:min-w-0 snap-center first:ml-0">
            <div className="bg-white border border-black/10 md:border-r-0 last:border-r p-6 md:border-b-0 border-b h-full">
              {/* Estrelas */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={11} className="fill-black text-black" />
                ))}
              </div>
              <p className="font-sans text-sm text-black/70 leading-relaxed mb-4 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-jost text-sm font-medium">{review.name}</p>
                  <p className="font-sans text-[11px] text-black/40">{review.city}</p>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 border border-black/15 px-2 py-0.5">
                    <Check size={9} className="text-emerald-600" />
                    <span className="font-sans text-[9px] uppercase tracking-wider text-black/40">
                      Verificado
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FadeInUp>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: FAQ
// ─────────────────────────────────────────────

const FAQS = [
  {
    q: 'Posso escolher tamanhos diferentes para cada cor?',
    a: 'Sim. O Kit Core foi pensado para isso. Cada camiseta tem sua própria seleção de tamanho independente.',
  },
  {
    q: 'As camisetas realmente não encolhem?',
    a: 'O algodão premium 260g passa por processo de pré-encolhimento industrial. Lavando em água fria e secando à sombra, o tamanho é permanente.',
  },
  {
    q: 'Em quanto tempo recebo o kit?',
    a: 'Enviamos em até 1 dia útil. Prazo de entrega varia por região: capitais 2-4 dias, interior até 7 dias úteis.',
  },
  {
    q: 'E se eu precisar trocar?',
    a: 'Garantimos troca gratuita em até 30 dias. Sem burocracia — só nos mandar a mensagem no WhatsApp.',
  },
];

function FaqSection({ onScrollToBuy }: { onScrollToBuy: () => void }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 md:px-16 bg-white border-t border-black/10">
      <FadeInUp>
        <div className="flex items-center gap-3 mb-12">
          <span className="font-jost text-[11px] tracking-widest uppercase text-black/40">Dúvidas</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>
      </FadeInUp>

      <div className="max-w-2xl mx-auto">
        {FAQS.map((faq, i) => (
          <FadeInUp key={faq.q} delay={i * 0.07}>
            <div className="border-b border-black/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left flex items-center justify-between py-5 gap-4"
                id={`faq-item-${i}`}
              >
                <span className="font-jost text-base font-light">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.25 }}>
                  <X size={14} className="flex-shrink-0 text-black/40" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 font-sans text-sm text-black/60 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeInUp>
        ))}

        <FadeInUp delay={0.3}>
          <div className="mt-10 text-center">
            <button
              onClick={onScrollToBuy}
              className="btn-hooke-elite inline-flex items-center gap-2 px-8 py-4 font-jost text-sm tracking-widest uppercase"
            >
              Montar Meu Kit Agora
              <ArrowRight size={15} />
            </button>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: STICKY BOTTOM CTA
// ─────────────────────────────────────────────

function StickyCta({ scrollY, onOpenDrawer }: { scrollY: number; onOpenDrawer: () => void }) {
  const show = scrollY > 320;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/20 px-6 py-4 safe-area-inset-bottom md:hidden"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center justify-between gap-3 max-w-sm mx-auto">
            <div>
              <p className="font-jost text-lg font-light leading-none">{formatBRL(KIT_PRICE)}</p>
              <p className="font-sans text-[10px] text-emerald-600 mt-0.5">
                {formatBRL(KIT_PIX_PRICE)} no PIX
              </p>
            </div>
            <button
              id="sticky-cta-kit-core"
              onClick={onOpenDrawer}
              className="btn-hooke-elite flex items-center gap-2 px-5 py-3 text-sm font-jost tracking-widest uppercase flex-1 justify-center"
            >
              <ShoppingBag size={14} />
              Montar Kit
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: MOBILE DRAWER SELECTOR
// ─────────────────────────────────────────────

function MobileDrawerSelector({ isOpen, onClose, onAddToCart }: { isOpen: boolean; onClose: () => void; onAddToCart: (s: SizeSelection) => void }) {
  const [sizes, setSizes] = useState<SizeSelection>({ black: null, 'off-white': null, mescla: null });
  const [error, setError] = useState<string | null>(null);
  const allSelected = Object.values(sizes).every((s) => s !== null);

  useEffect(() => { if (isOpen) setError(null); }, [isOpen]);

  const handleSize = (colorId: keyof SizeSelection, size: string) => {
    setSizes((prev) => ({ ...prev, [colorId]: size }));
    setError(null);
  };

  const handleSubmit = () => {
    if (!allSelected) { setError('Escolha o tamanho de cada camiseta.'); return; }
    onAddToCart(sizes);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white z-[70] md:hidden flex flex-col max-h-[85vh] shadow-brutal-lg"
          >
            {/* Header */}
            <div className="p-5 border-b border-black/10 flex items-center justify-between bg-[#F5F4F2]">
              <div>
                <p className="font-jost text-xl tracking-tight text-black">Montar Kit Core</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-sans text-sm text-black/40 line-through">{formatBRL(KIT_ORIGINAL_PRICE)}</span>
                  <span className="font-sans text-sm text-emerald-600 font-medium">{formatBRL(KIT_PIX_PRICE)} PIX</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 border border-black/10 hover:bg-black/5 transition-colors"><X size={20} className="text-black/60" /></button>
            </div>
            
            {/* Body */}
            <div className="overflow-y-auto p-5 space-y-4 pb-32">
              {COLORS.map((color) => (
                <div key={color.id} className="border border-black/15 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 border border-black/20" style={{ backgroundColor: color.hex }} />
                    <span className="font-jost text-sm uppercase tracking-widest">{color.name}</span>
                    {sizes[color.id] && <span className="ml-auto font-jost text-xs border border-black px-2 py-0.5">{sizes[color.id]}</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => handleSize(color.id as keyof SizeSelection, size)}
                        animate={error && !sizes[color.id] ? { x: [-4, 4, -4, 4, 0] } : {}}
                        transition={{ duration: 0.3 }}
                        className={`min-h-[44px] min-w-[44px] flex-1 font-jost text-xs tracking-widest uppercase border transition-colors ${
                          sizes[color.id] === size ? 'bg-black text-white border-black' : error && !sizes[color.id] ? 'bg-red-50 text-red-600 border-red-300' : 'bg-white text-black/70 border-black/20'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
              {error && <p className="font-sans text-xs text-red-600 flex items-center gap-1 mt-2"><X size={12}/>{error}</p>}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-black/10 safe-area-inset-bottom">
              <button
                onClick={handleSubmit}
                className={`w-full flex items-center justify-center gap-2 py-4 font-jost text-sm tracking-widest uppercase transition-colors ${
                  allSelected ? 'bg-black text-white border border-black shadow-brutal hover:bg-black/90' : 'bg-black/5 text-black/40 border border-black/10 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={16} />
                {allSelected ? 'Adicionar ao Carrinho' : 'Escolher tamanhos'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: WHATSAPP FAB
// ─────────────────────────────────────────────

function WhatsAppFab() {
  const WA_URL =
    'https://wa.me/5511975902528?text=Oi%2C+quero+saber+mais+sobre+o+Kit+Core+Hooke!';

  return (
    <motion.a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-fab-kit-core"
      aria-label="Atendimento via WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="fixed bottom-6 left-4 z-50 bg-[#25D366] text-white p-3.5 shadow-brutal flex items-center gap-2 md:bottom-6"
    >
      <MessageCircle size={20} className="fill-white" />
    </motion.a>
  );
}

// ─────────────────────────────────────────────
//  SUB-COMPONENT: MINI NAVBAR
// ─────────────────────────────────────────────

function MiniNavbar({ scrollY }: { scrollY: number }) {
  const scrolled = scrollY > 60;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-black/10' : 'bg-transparent'
      }`}
    >
      <a href="/" className="font-jost text-xl font-light tracking-tight text-black">
        Hooke
      </a>
      <a
        href="/"
        className="font-sans text-[11px] tracking-widest uppercase text-black/50 hover:text-black transition-colors"
      >
        Ver Loja
      </a>
    </motion.nav>
  );
}

// ─────────────────────────────────────────────
//  ROOT: KIT CORE CLIENT
// ─────────────────────────────────────────────

export default function KitCoreClient() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const scrollY = useScrollY();
  const selectorRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const scrollToBuy = () => {
    selectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleOpenDrawer = () => setIsDrawerOpen(true);

  const handleAddToCart = (selections: SizeSelection) => {
    // Adiciona 3 itens separados com cores e tamanhos individuais
    const colors: (keyof SizeSelection)[] = ['black', 'off-white', 'mescla'];
    const colorNames: Record<keyof SizeSelection, string> = {
      black: 'Preta',
      'off-white': 'Off-White',
      mescla: 'Mescla',
    };

    colors.forEach((colorId) => {
      const size = selections[colorId];
      if (!size) return;
      const colorName = colorNames[colorId];
      addItem(
        {
          ...KIT_PRODUCT_BASE,
          name: `Camiseta Core — ${colorName}`,
          price: KIT_PRICE / 3, // Divide o preço do kit por 3
        },
        size,
        colorName,
      );
    });

    openCart();

    // Redireciona para checkout depois de um breve delay (UX suave)
    setTimeout(() => {
      router.push('/checkout');
    }, 1200);
  };

  return (
    <div className="font-jost min-h-screen bg-white">
      {/* Barra de escassez fixa no topo */}
      <ScarcityBar />

      {/* Mini Navbar */}
      <MiniNavbar scrollY={scrollY} />

      {/* Hero */}
      <HeroSection onScrollToBuy={scrollToBuy} />

      {/* Argumentos físicos */}
      <ArgumentsSection />

      {/* Régua de gramatura */}
      <GrammageRuler />

      {/* Bundle Selector (zona de compra) */}
      <BundleSelector selectorRef={selectorRef} onAddToCart={handleAddToCart} />

      {/* Prova Social */}
      <SocialProof />

      {/* FAQ */}
      <FaqSection onScrollToBuy={scrollToBuy} />

      {/* Rodapé mínimo */}
      <footer className="border-t border-black/10 py-10 px-6 text-center">
        <a href="/" className="font-jost text-2xl font-light tracking-tight text-black">
          Hooke
        </a>
        <p className="font-sans text-xs text-black/30 mt-2">
          © {new Date().getFullYear()} Hooke. Todos os direitos reservados.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          {['Política de Trocas', 'Contato', 'Instagram'].map((link) => (
            <a
              key={link}
              href={
                link === 'Instagram'
                  ? 'https://instagram.com/usehooke'
                  : `/${link.toLowerCase().replace(' ', '-').replace(/[ê]/g, 'e')}`
              }
              className="font-sans text-[11px] text-black/40 hover:text-black tracking-wider uppercase transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <WhatsAppFab />

      {/* Mobile Drawer Selector */}
      <MobileDrawerSelector isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onAddToCart={handleAddToCart} />

      {/* Sticky Bottom CTA (mobile) */}
      <StickyCta scrollY={scrollY} onOpenDrawer={handleOpenDrawer} />
    </div>
  );
}
