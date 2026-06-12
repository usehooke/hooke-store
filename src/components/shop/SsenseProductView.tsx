"use client";

import React, { useState, useEffect, useRef, use, Suspense } from 'react';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { Check, ArrowRight, Zap, ChevronDown, ChevronLeft, ChevronRight, Ruler, X, CreditCard, Truck, RotateCcw } from 'lucide-react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

const DynamicSizeGuide = dynamic(() => import('./DynamicSizeGuide'), { ssr: false });

// Lazy: inicializa MP SDK apenas uma vez quando necessário
let mpInitialized = false;
function ensureMercadoPago() {
  if (!mpInitialized) {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'TEST-mock-key', { locale: 'pt-BR' });
    mpInitialized = true;
  }
}

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://usehooke.com.br';

const prepareImage = (src: string) => {
  if (!src) return { src: '', deliveryType: 'upload' as const };
  if (src.includes('res.cloudinary.com')) {
    const parts = src.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return { src: publicId, deliveryType: 'upload' as const };
  }
  if (src.startsWith('/')) {
    return { src: src, deliveryType: 'local' as const };
  }
  return { src, deliveryType: 'fetch' as const };
};

interface SsenseProductViewProps {
  product: Product;
  variantsPromise: Promise<Product[]>;
}

// Tabela de medidas para o guia contextual
const SIZE_GUIDE: Record<string, { peito: string; comprimento: string; ombro: string }> = {
  'P':  { peito: '96cm', comprimento: '68cm', ombro: '42cm' },
  'M':  { peito: '102cm', comprimento: '70cm', ombro: '44cm' },
  'G':  { peito: '108cm', comprimento: '72cm', ombro: '46cm' },
  'GG': { peito: '116cm', comprimento: '74cm', ombro: '48cm' },
};


// Função para construir a descrição premium e rica do tecido de forma dinâmica
const getFabricDescription = (fabric?: string) => {
  if (!fabric) {
    return 'Malha Heavyweight 260g — 100% Algodão Penteado Premium. Fio Egípcio de longa fibra. Estrutura pesada de alta costura com toque macio e permanência absoluta, mantendo a forma após a lavagem.';
  }

  const fabricLower = fabric.toLowerCase();
  
  if (fabric.length > 50) {
    return fabric;
  }

  if (fabricLower.includes('heavyweight') || fabricLower.includes('260g') || fabricLower.includes('300g') || fabricLower.includes('280g') || fabricLower.includes('pesada')) {
    const grammageMatch = fabric.match(/\d+g/i);
    const grammage = grammageMatch ? grammageMatch[0] : '260g';
    return `Malha Heavyweight ${grammage} — 100% Algodão Penteado Premium. Fio Egípcio de longa fibra. Estrutura pesada de alta costura com toque macio e permanência absoluta, mantendo a forma após a lavagem.`;
  }

  if (fabricLower.includes('viscose')) {
    return `${fabric} — Viscose Nobre de alta costura contemporânea. Proporciona caimento fluido impecável, toque frio incomparável e excelente conforto térmico. Costuras internas reforçadas em viés para acabamento premium de alfaiataria.`;
  }

  if (fabricLower.includes('pima')) {
    return `${fabric} — Produzida a partir de Algodão Pima peruano de fibra extra-longa selecionada, garantindo suavidade extraordinária ao toque e brilho sutil extremamente elegante. O básico refinado definitivo com durabilidade superior.`;
  }

  if (fabricLower.includes('linho')) {
    return `${fabric} — Linho Premium selecionado de alta qualidade, garantindo conforto térmico superior, alta respirabilidade e caimento leve alinhado com naturalidade elegante e sofisticação essencial.`;
  }

  return `${fabric} — Matéria-prima de altíssimo padrão selecionada sob curadoria Hooke. Proporciona caimento impecável, toque suave extraordinário e acabamento interno de alta costura para máxima usabilidade diária.`;
};

// Função para construir a descrição premium e rica da modelagem de forma dinâmica
const getModelDescription = (model?: string) => {
  if (!model) {
    return 'Boxy Fit — Estruturado para o ombro. Gola canelada de 3cm reforçada. Costura dupla nas barras. Um corte pensado para o homem que constrói, não que segue.';
  }

  if (model.length > 50) {
    return model;
  }

  const modelLower = model.toLowerCase();

  if (modelLower.includes('boxy') || modelLower.includes('oversized') || modelLower.includes('estruturado')) {
    return `${model} — Modelagem estruturada nos ombros com proporções modernas. Apresenta caimento boxy encorpado, gola canelada robusta de 3cm de espessura que não deforma com o uso e acabamento brutalista premium de costuras duplas.`;
  }

  if (modelLower.includes('relaxed') || modelLower.includes('fluid') || modelLower.includes('elegant')) {
    return `${model} — Modelagem fluida e descontraída que valoriza o movimento natural do corpo com elegância e caimento fluido impecável. Desenvolvida com acabamentos internos em viés e costuras rebatidas de altíssima longevidade.`;
  }

  if (modelLower.includes('standard') || modelLower.includes('classic')) {
    return `${model} — Modelagem clássica atemporal com caimento perfeitamente alinhado. Desenvolvida sob engenharia de alfaiataria contemporânea para garantir excelente proporção de conforto e elegância em qualquer ocasião.`;
  }

  return `${model} — Modelagem exclusiva Hooke projetada com precisão técnica de alta costura, otimizando proporções e caimento para garantir silhueta limpa e conforto absoluto em qualquer biotipo.`;
};

// Engenharia da Malha - Bloco Técnico Interativo Brutalista
const EngenhariaDaMalhaDetails = ({ grammage, yarn }: { grammage?: string; yarn?: string }) => {
  if (!grammage) return null;

  // Extrai a gramatura numérica (ex: 260g/m² -> 260)
  const match = grammage.match(/\d+/);
  const weightNum = match ? parseInt(match[0], 10) : 0;
  
  if (weightNum === 0) return null;

  // Escala vai de 100g/m² a 300g/m²
  const minWeight = 100;
  const maxWeight = 300;
  const percentage = Math.min(Math.max(((weightNum - minWeight) / (maxWeight - minWeight)) * 100, 0), 100);

  let categoryLabel = "Leve";
  let categoryColor = "text-zinc-500";
  if (weightNum >= 230) {
    categoryLabel = "Heavyweight";
    categoryColor = "text-black font-black";
  } else if (weightNum >= 170) {
    categoryLabel = "Intermediária";
    categoryColor = "text-zinc-800 font-bold";
  }

  return (
    <div className="mt-4 border-t border-black/10 pt-4 font-mono">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-[8px] font-black uppercase tracking-wider text-zinc-400 block mb-0.5">Engenharia da Malha</span>
          <span className="text-[10px] font-black uppercase text-black">{yarn || "Algodão Premium"} · {grammage}</span>
        </div>
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border border-black/10 bg-zinc-50 ${categoryColor}`}>
          {categoryLabel}
        </span>
      </div>

      {/* Escala Gráfica Brutalista */}
      <div className="relative w-full h-3 border border-black bg-zinc-100 mb-2">
        {/* Linhas divisórias (160g e 220g) */}
        <div className="absolute left-[30%] top-0 bottom-0 w-px bg-black/20" />
        <div className="absolute left-[60%] top-0 bottom-0 w-px bg-black/20" />

        {/* Marcador Reativo */}
        <div 
          className="absolute top-0 bottom-0 w-2.5 bg-black -translate-x-1/2 border-x border-white"
          style={{ left: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[7px] text-zinc-400 font-bold uppercase tracking-wider">
        <span>Leve (≤ 160g)</span>
        <span>Intermediária (170-220g)</span>
        <span>Heavyweight (≥ 230g)</span>
      </div>
    </div>
  );
};

// Vantagens Comerciais Brutalistas
const VantagensComerciais = () => {
  return (
    <div className="grid grid-cols-3 gap-2 pt-1 pb-1 text-center font-mono">
      <div className="border border-black p-2 bg-zinc-50 flex flex-col items-center justify-center min-h-[64px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <CreditCard size={14} className="mb-1 text-black" />
        <span className="text-[8px] font-black uppercase tracking-wider text-black">Até 3x Sem Juros</span>
        <span className="text-[7px] text-zinc-500 font-bold uppercase mt-0.5">ou 15% Pix</span>
      </div>
      <div className="border border-black p-2 bg-zinc-50 flex flex-col items-center justify-center min-h-[64px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <Truck size={14} className="mb-1 text-black" />
        <span className="text-[8px] font-black uppercase tracking-wider text-black">Frete Prioritário</span>
        <span className="text-[7px] text-zinc-500 font-bold uppercase mt-0.5">Gratuito nas Regiões</span>
      </div>
      <div className="border border-black p-2 bg-zinc-50 flex flex-col items-center justify-center min-h-[64px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <RotateCcw size={14} className="mb-1 text-black" />
        <span className="text-[8px] font-black uppercase tracking-wider text-black">Troca Facilitada</span>
        <span className="text-[7px] text-zinc-500 font-bold uppercase mt-0.5">Até 7 dias grátis</span>
      </div>
    </div>
  );
};

interface VariantColorsSelectorProps {
  variantsPromise: Promise<Product[]>;
  currentProductId: string;
  isDesktop?: boolean;
}

const VariantColorsSelectorContent = ({ variantsPromise, currentProductId, isDesktop }: VariantColorsSelectorProps) => {
  const variants = use(variantsPromise);

  if (!variants || variants.length <= 1) return null;

  return (
    <div className={isDesktop ? "space-y-3 pt-2" : "space-y-3"}>
      <p className={isDesktop ? "text-[10px] font-black tracking-[0.2em] uppercase text-black" : "text-[11px] font-black tracking-[0.2em] text-black uppercase"}>
        Cores Disponíveis
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isActive = v?.id === currentProductId;
          const variantColor = v?.color || v?.name?.split(' ').pop() || 'Cor';
          return (
            <Link
              key={v.id}
              href={`/produto/${v.slug}`}
              className={isDesktop 
                ? `px-3 py-2 text-[9px] font-black border transition-all uppercase tracking-wider ${
                    isActive
                      ? 'bg-black text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black border-zinc-200 hover:border-black'
                  }`
                : `px-4 py-2.5 text-[10px] font-black border transition-all uppercase tracking-wider ${
                    isActive
                      ? 'bg-black text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black border-zinc-200 hover:border-black'
                  }`
              }
            >
              {variantColor}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const VariantColorsSelector = (props: VariantColorsSelectorProps) => {
  return (
    <Suspense fallback={
      <div className="space-y-2 animate-pulse font-mono">
        <div className="h-3 bg-zinc-100 w-24" />
        <div className="flex gap-2">
          <div className="h-9 bg-zinc-100 w-16" />
          <div className="h-9 bg-zinc-100 w-16" />
        </div>
      </div>
    }>
      <VariantColorsSelectorContent {...props} />
    </Suspense>
  );
};

const SsenseProductView = ({ product, variantsPromise }: SsenseProductViewProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('tecido');
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const installment = ((product?.price || 0) / 3).toFixed(2).replace('.', ',');
  const pixPrice = (product?.price || 0) * 0.85;
  const formattedPixPrice = formatter.format(pixPrice);
  const formattedPrice = formatter.format(product?.price || 0);
  const rawImages = (product?.images?.length ? product.images : [product?.imageUrl || '/placeholder.png']).filter(Boolean);
  const images = rawImages.length > 0 ? rawImages.map(img => prepareImage(img as string)) : [{ src: '/placeholder.png', deliveryType: 'local' as const }];

  // Dispara view_item GA4
  const trackEcommerceEvent = (eventName: string, size?: string) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ ecommerce: null });
      (window as any).dataLayer.push({
        event: eventName,
        ecommerce: {
          currency: 'BRL',
          value: product?.price || 0,
          items: [{ item_id: product?.id, item_name: product?.name, item_brand: 'HOOKE', item_category: product?.category, price: product?.price || 0, item_variant: size || 'N/A', quantity: 1 }]
        }
      });
    }
  };

  useEffect(() => { ensureMercadoPago(); trackEcommerceEvent('view_item'); }, []);

  // Sticky Buy Button ao scrollar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (stickyRef.current) observer.observe(stickyRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Selecione um tamanho para continuar.', {
        style: { borderRadius: 0, background: '#000', color: '#fff', border: 'none' }
      });
      return;
    }
    trackEcommerceEvent('add_to_cart', selectedSize);
    setIsAdding(true);
    setTimeout(() => {
      addItem(product, selectedSize);
      toast.success(`${product.name} (${selectedSize}) adicionado ao carrinho.`, {
        icon: <Check size={14} />,
        style: { borderRadius: 0, background: '#000', color: '#fff', border: 'none' }
      });
      setIsAdding(false);
    }, 350);
  };

  const nextSlide = () => setActiveSlide((p) => (p + 1) % images.length);
  const prevSlide = () => setActiveSlide((p) => (p - 1 + images.length) % images.length);

  const hasCollar3cm = product.details?.collar?.toLowerCase().includes('3cm') || false;
  const hasFabricSpecs = !!(product.details?.grammage && product.details?.yarn);
  const toggleAccordion = (key: string) => setOpenAccordion(prev => prev === key ? null : key);

  const accordions = [
    {
      key: 'tecido',
      label: '🧵 O Tecido',
      content: (
        <div className="space-y-3">
          <p>{getFabricDescription(product.details?.fabric)}</p>
          {hasFabricSpecs && (
            <EngenhariaDaMalhaDetails 
              grammage={product.details?.grammage} 
              yarn={product.details?.yarn} 
            />
          )}
        </div>
      )
    },
    {
      key: 'corte',
      label: '📐 O Corte',
      content: <p>{getModelDescription(product.details?.model)}</p>
    },
    {
      key: 'manifesto',
      label: '⚡ O Manifesto',
      content: (
        <p>
          {product.description
            ? product.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
            : 'Cada peça Hooke é um protocolo de essencialismo. Feita para durar mais do que qualquer tendência. O básico refeito como declaração.'}
        </p>
      )
    },
    {
      key: 'sustentabilidade',
      label: '🌱 Sustentabilidade e Origem da Malha',
      content: (
        <p>
          Nossas camisetas são confeccionadas com malhas feitas de algodão certificado pela Better Cotton Initiative (BCI). Isso garante um cultivo sustentável com redução do uso de água, melhoria real nas condições de trabalho no campo e total transparência. Através de um sistema rigoroso de transferência de créditos rastreados por nota fiscal, garantimos que a matéria-prima do seu conforto cumpre os mais altos critérios globais de sustentabilidade e responsabilidade.
        </p>
      )
    },
  ];

  return (
    <div className="bg-white min-h-screen font-['Inter'] selection:bg-black selection:text-white">

      {/* ============================================
          MOBILE: LAYOUT VERTICAL (< md)
          ============================================ */}
      <div className="md:hidden">

        {/* CARROSSEL FULL-WIDTH (SWIPE NATIVO) */}
        <div className="relative w-full aspect-[3/4] bg-zinc-100 overflow-hidden group">
          
          <div 
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.clientWidth;
              if(width > 0) setActiveSlide(Math.round(scrollLeft / width));
            }}
          >
            {images.map((img: any, i: number) => (
              <div key={i} className="flex-none w-full h-full snap-start relative">
                {img.deliveryType === 'local' ? (
                  <Image
                    src={img.src}
                    alt={`${product?.name || 'Produto'} - Vista ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                    priority={i === 0}
                    loading={i === 0 ? undefined : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                  />
                ) : (
                  <CldImage
                    src={img.src}
                    alt={`${product?.name || 'Produto'} - Vista ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                    priority={i === 0}
                    loading={i === 0 ? undefined : "lazy"}
                    deliveryType={img.deliveryType as any}
                    format="avif"
                    quality="auto"
                    fetchPriority={i === 0 ? "high" : "low"}
                  />
                )}
                {i === 0 && hasCollar3cm && (
                  <div className="absolute top-[18%] left-[50%] -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-10 font-mono scale-[0.85] origin-top">
                    <div className="relative flex items-center justify-between w-24 h-px bg-black">
                      <div className="w-px h-2 bg-black absolute left-0 -translate-y-1/2 top-1/2"></div>
                      <div className="w-px h-2 bg-black absolute right-0 -translate-y-1/2 top-1/2"></div>
                      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[10px] bg-white border border-black px-1.5 py-0.5 text-[8px] font-black tracking-widest text-black uppercase whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        3.0 CM
                      </div>
                    </div>
                    <div className="w-px h-4 bg-black"></div>
                    <div className="bg-white border border-black p-1.5 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-w-[150px]">
                      <p className="text-[8px] font-black uppercase tracking-wider text-black">Gola Canelada</p>
                      <p className="text-[6.5px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5 leading-tight">Firmeza Eterna e Alta Densidade</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navegação do Carrossel (Apenas visível se forçando uso no mobile, mas focamos no swipe. Vamos esconder por padrão e focar nas bolinhas) */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {images.map((_: any, i: number) => (
                <div
                  key={i}
                  className={`h-1.5 transition-all duration-300 ${i === activeSlide ? 'w-8 bg-black' : 'w-2 bg-black/20'}`}
                />
              ))}
            </div>
          )}

          {/* Tag VIP */}
          {product.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-black text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1">
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* BLOCO DE COMPRA MOBILE */}
        <div className="px-5 pt-6 pb-4 space-y-5">

          {/* Nome + Preço */}
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-black uppercase leading-tight">
              {product?.name || 'Produto'}
            </h1>
            <div className="mt-2.5 space-y-1">
              {/* Opção PIX (Destaque Principal) */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-black">{formattedPixPrice}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-emerald-300">
                  PIX -15%
                </span>
              </div>
              {/* Opção Cartão/Crédito */}
              <p className="text-[11px] text-zinc-500 font-medium">
                ou <span className="font-bold text-black">{formattedPrice}</span> no cartão em até <span className="font-bold text-black">3x de R$ {installment}</span> sem juros
              </p>
            </div>
          </div>

          {/* SELEÇÃO DE VARIANTES DE COR (MOBILE) */}
          <VariantColorsSelector 
            variantsPromise={variantsPromise} 
            currentProductId={product.id} 
          />

          {/* SELEÇÃO DE TAMANHO ONE-TAP */}
          <div ref={stickyRef}>
            <div className="flex justify-between items-center mb-3">
              <p className="text-[11px] font-black tracking-[0.2em] text-black uppercase">Tamanho</p>
              <button
                onClick={() => setShowSizeGuide(p => !p)}
                className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 underline"
              >
                <Ruler size={11} />
                Guia de Medidas
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(product?.sizes || ['P', 'M', 'G', 'GG']).map((size: string) => {
                const isOutOfStock = product?.stock ? (product.stock[size] !== undefined && product.stock[size] <= 0) : false;
                return (
                  <button
                    key={size}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={isOutOfStock}
                    aria-pressed={selectedSize === size}
                    aria-label={isOutOfStock ? `Tamanho ${size} - Indisponível` : `Tamanho ${size}`}
                    className={`h-14 text-sm font-black border transition-all uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                      isOutOfStock
                        ? 'bg-zinc-50 text-zinc-300 border-zinc-100 line-through cursor-not-allowed shadow-none'
                        : selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-zinc-200 hover:border-black hover:bg-zinc-50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Guia de Medidas Contextual (dica do fundador) */}
            <p className="text-[10px] text-zinc-500 mt-2 font-medium">
              Fernando (1,82m, 82kg) veste <span className="font-black text-black underline">M</span>.
            </p>

            {/* Modal de Medidas (Mobile/Desktop compartilhado abaixo) */}
          </div>

          {/* BOTÃO COMPRAR (visível no scroll normal) */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full py-4 text-[12px] font-black tracking-[0.2em] bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-black hover:text-white hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-y-px transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              {isAdding ? <span className="animate-pulse">PROCESSANDO...</span> : <><span>ADICIONAR AO CARRINHO</span><ArrowRight size={14} aria-hidden="true" /></>}
            </button>
            <div className="w-full border border-zinc-200 p-2 bg-zinc-50 min-h-[76px] flex flex-col justify-center transition-all">
              <p className="text-[8px] text-center font-bold tracking-widest text-zinc-400 mb-1.5 uppercase">Compra Expressa</p>
              {selectedSize ? (
                <div className="[&_.mercadopago-button]:!rounded-none [&_.mercadopago-button]:!bg-white [&_.mercadopago-button]:!text-black [&_.mercadopago-button]:!border [&_.mercadopago-button]:!border-zinc-200 [&_.mercadopago-button]:!font-bold [&_.mercadopago-button]:!tracking-[0.2em] [&_.mercadopago-button]:!h-11 [&_.mercadopago-button]:!shadow-none hover:bg-zinc-100">
                  <Wallet
                    initialization={{ preferenceId: '<A_PREFERENCE_ID_SERA_GERADA_AQUI>' }}
                    customization={{ texts: { action: 'pay', valueProp: 'security_details' } } as any}
                  />
                </div>
              ) : (
                <button disabled className="w-full h-11 bg-zinc-100 text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] border border-zinc-200 flex items-center justify-center gap-2 cursor-not-allowed">
                  <Zap size={11} /> Selecione o Tamanho
                </button>
              )}
            </div>
          </div>

          <VantagensComerciais />

          {/* ACORDEÕES RETRÁTEIS */}
          <div className="border-t-2 border-black pt-4 space-y-0">
            {accordions.map((a) => (
              <div key={a.key} className="border-b border-black/10">
                <button
                  onClick={() => toggleAccordion(a.key)}
                  aria-expanded={openAccordion === a.key}
                  aria-controls={`accordion-panel-mobile-${a.key}`}
                  className="w-full flex justify-between items-center py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                >
                  <span className="text-[12px] font-black uppercase tracking-wide">{a.label}</span>
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={`transition-transform duration-300 ${openAccordion === a.key ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === a.key && (
                    <motion.div
                      id={`accordion-panel-mobile-${a.key}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 text-[13px] text-zinc-600 leading-relaxed font-normal">
                        {a.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* META-DADOS LOGÍSTICA */}
          <div className="grid grid-cols-2 gap-2 text-[9px] font-black uppercase tracking-widest border-t-2 border-black pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-400">Envio</span>
              <span>Imediato · Brasil</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-400">Edição</span>
              <span>Limitada · {new Date().getFullYear()}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-400">Origem</span>
              <span>São Paulo · BR</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-400">SKU</span>
              <span className="truncate">{product?.id || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          DESKTOP: GRID 3 COLUNAS (>= md)
          ============================================ */}
      <div className="hidden md:block pt-28 px-8 lg:px-16 pb-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-10 items-start">

          {/* COL 1: DETALHES (STICKY LEFT) */}
          <div className="col-span-3 sticky top-32 flex flex-col gap-8 p-6 border-2 border-black shadow-[8px_8px_0px_0px_#000]">
            <div className="space-y-5">
              <h2 className="text-[9px] font-black tracking-[0.3em] uppercase border-b-2 border-black pb-2">Especificações</h2>
              {[
                { label: 'SKU', value: product.id },
                { label: 'Composição', value: product.details?.fabric || 'Algodão 100% Penteado Heavyweight 260g' },
                { label: 'Corte', value: product.details?.model || 'Boxy Fit Estruturado' },
                { label: 'Lavagem', value: product.details?.wash || 'Manual / Máquina Fria' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
                  <p className="text-xs font-medium text-black mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-black pt-6">
              <p className="text-[11px] leading-relaxed text-black/70 font-medium italic">
                "{product.description
                  ? product.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').slice(0, 180)
                  : 'Design essencial para a permanência absoluta.'}"
              </p>
            </div>
          </div>

          {/* COL 2: GALERIA (CENTER SCROLL) */}
          <div className="col-span-6 space-y-6">
            {images.map((img: { src: string; deliveryType: 'fetch' | 'upload' | 'local' }, idx: number) => {
              const isFirst = idx === 0;
              const content = (
                <>
                  {img.deliveryType === 'local' ? (
                    <Image
                      src={img.src}
                      alt={`${product.name} - Vista ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-[2000ms] group-hover:scale-105"
                      priority={isFirst}
                      loading={isFirst ? undefined : "lazy"}
                      fetchPriority={isFirst ? "high" : "low"}
                    />
                  ) : (
                    <CldImage
                      src={img.src}
                      alt={`${product.name} - Vista ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-[2000ms] group-hover:scale-105"
                      priority={isFirst}
                      loading={isFirst ? undefined : "lazy"}
                      deliveryType={img.deliveryType as any}
                      format="avif"
                      quality="auto"
                      fetchPriority={isFirst ? "high" : "low"}
                    />
                  )}
                  {isFirst && product.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-black text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1">
                        {product.category}
                      </span>
                    </div>
                  )}
                </>
              );

              if (isFirst) {
                return (
                  <div
                    key={idx}
                    className="relative aspect-[2/3] w-full bg-zinc-100 overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_#000] group"
                  >
                    {content}
                    {hasCollar3cm && (
                      <div className="absolute top-[18%] left-[50%] -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-10 font-mono">
                        <div className="relative flex items-center justify-between w-28 h-px bg-black">
                          <div className="w-px h-3 bg-black absolute left-0 -translate-y-1/2 top-1/2"></div>
                          <div className="w-px h-3 bg-black absolute right-0 -translate-y-1/2 top-1/2"></div>
                          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[12px] bg-white border border-black px-1.5 py-0.5 text-[9px] font-black tracking-widest text-black uppercase whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            3.0 CM
                          </div>
                        </div>
                        <div className="w-px h-6 bg-black"></div>
                        <div className="bg-white border-2 border-black p-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-[180px]">
                          <p className="text-[9px] font-black uppercase tracking-wider text-black">Gola Canelada</p>
                          <p className="text-[7.5px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5 leading-tight">Firmeza Eterna e Alta Densidade</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className="relative aspect-[2/3] w-full bg-zinc-100 overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_#000] group"
                >
                  {content}
                </motion.div>
              );
            })}
          </div>

          {/* COL 3: COMPRA (STICKY RIGHT) */}
          <div className="col-span-3 sticky top-32 flex flex-col gap-6 p-6 border-2 border-black shadow-[8px_8px_0px_0px_#000]">

            {/* Título + Preço */}
            <div className="border-b-2 border-black pb-5">
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-400">{product?.category || ''}</span>
              <h1 className="text-3xl font-black tracking-tighter uppercase leading-none mt-2">{product?.name || 'Produto'}</h1>
              <div className="mt-4 space-y-1">
                {/* Opção PIX (Destaque Principal) */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-black">{formattedPixPrice}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-emerald-300">
                    PIX -15%
                  </span>
                </div>
                {/* Opção Cartão/Crédito */}
                <p className="text-[11px] text-zinc-500 font-medium">
                  ou <span className="font-bold text-black">{formattedPrice}</span> no cartão em até <span className="font-bold text-black">3x de R$ {installment}</span> sem juros
                </p>
              </div>
            </div>

            {/* SELEÇÃO DE VARIANTES DE COR (DESKTOP) */}
            <VariantColorsSelector 
              variantsPromise={variantsPromise} 
              currentProductId={product.id} 
              isDesktop 
            />

            {/* Tamanho ONE-TAP */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] font-black tracking-[0.2em] uppercase">Tamanho</p>
                <button
                  onClick={() => setShowSizeGuide(p => !p)}
                  className="text-[9px] font-bold text-zinc-500 underline flex items-center gap-1"
                >
                  <Ruler size={10} /> Medidas
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(product?.sizes || ['P', 'M', 'G', 'GG']).map((size: string) => {
                  const isOutOfStock = product?.stock ? (product.stock[size] !== undefined && product.stock[size] <= 0) : false;
                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      aria-pressed={selectedSize === size}
                      aria-label={isOutOfStock ? `Tamanho ${size} - Indisponível` : `Tamanho ${size}`}
                      className={`h-12 text-[11px] font-black border transition-all uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                        isOutOfStock
                          ? 'bg-zinc-50 text-zinc-300 border-zinc-100 line-through cursor-not-allowed shadow-none'
                          : selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-zinc-200 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-zinc-400 mt-2">Fernando (1,82m · 82kg) veste <strong className="text-black">M</strong>.</p>

              {/* Modal será renderizado fora deste escopo para ficar por cima de tudo */}
            </div>

            {/* Botões de Compra */}
            <div className="flex flex-col gap-2.5">
              <Button
                variant="hexa"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full py-6 text-[10px]"
              >
                {isAdding ? <span className="animate-pulse">PROCESSANDO...</span> : <><span>ADICIONAR AO CARRINHO</span><ArrowRight size={13} aria-hidden="true" /></>}
              </Button>
              <div className="w-full border border-zinc-200 p-2 bg-zinc-50 min-h-[72px] flex flex-col justify-center transition-all">
                <p className="text-[8px] text-center font-bold tracking-widest text-zinc-400 mb-1.5 uppercase">Compra Expressa</p>
                {selectedSize ? (
                  <div className="[&_.mercadopago-button]:!rounded-none [&_.mercadopago-button]:!bg-white [&_.mercadopago-button]:!text-black [&_.mercadopago-button]:!border [&_.mercadopago-button]:!border-zinc-200 [&_.mercadopago-button]:!font-bold [&_.mercadopago-button]:!tracking-[0.2em] [&_.mercadopago-button]:!h-10 [&_.mercadopago-button]:!shadow-none hover:bg-zinc-100">
                    <Wallet
                      initialization={{ preferenceId: '<A_PREFERENCE_ID_SERA_GERADA_AQUI>' }}
                      customization={{ texts: { action: 'pay', valueProp: 'security_details' } } as any}
                    />
                  </div>
                ) : (
                  <button disabled className="w-full h-10 bg-zinc-100 text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] border border-zinc-200 flex items-center justify-center gap-2 cursor-not-allowed">
                    <Zap size={11} /> Selecione o Tamanho
                  </button>
                )}
              </div>
            </div>

            <VantagensComerciais />

            {/* Acordeões Desktop */}
            <div className="border-t-2 border-black pt-3 space-y-0">
              {accordions.map((a) => (
                <div key={a.key} className="border-b border-black/10">
                  <button 
                    onClick={() => toggleAccordion(a.key)} 
                    aria-expanded={openAccordion === a.key}
                    aria-controls={`accordion-panel-desktop-${a.key}`}
                    className="w-full flex justify-between items-center py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                  >
                    <span className="text-[10px] font-black uppercase tracking-wide">{a.label}</span>
                    <ChevronDown size={13} aria-hidden="true" className={`transition-transform duration-300 ${openAccordion === a.key ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openAccordion === a.key && (
                      <motion.div 
                        id={`accordion-panel-desktop-${a.key}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        transition={{ duration: 0.2 }} 
                        className="overflow-hidden"
                      >
                        <div className="pb-3 text-[11px] text-zinc-600 leading-relaxed">{a.content}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Meta-dados */}
            <div className="grid grid-cols-2 gap-3 text-[9px] font-black uppercase tracking-widest border-t-2 border-black pt-4">
              <div><span className="text-zinc-400 block">Envio</span>Imediato · Brasil</div>
              <div><span className="text-zinc-400 block">Edição</span>Limitada · {new Date().getFullYear()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          STICKY BUY BUTTON (MOBILE ONLY) 
          Aparece quando o botão normal sai da tela
          ============================================ */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200 px-4 py-3 flex gap-3 items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-black uppercase truncate">{product?.name || 'Produto'}</p>
              <p className="text-[11px] font-black text-black">{formatter.format(product?.price || 0)}</p>
            </div>
            <div className="flex gap-2">
              {(product?.sizes || ['P', 'M', 'G', 'GG']).map((size: string) => {
                const isOutOfStock = product?.stock ? (product.stock[size] !== undefined && product.stock[size] <= 0) : false;
                return (
                  <button
                    key={size}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={isOutOfStock}
                    aria-pressed={selectedSize === size}
                    aria-label={isOutOfStock ? `Tamanho ${size} - Indisponível` : `Tamanho ${size}`}
                    className={`w-10 h-10 text-[10px] font-black border uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                      isOutOfStock
                        ? 'bg-zinc-50 text-zinc-300 border-zinc-100 line-through cursor-not-allowed shadow-none'
                        : selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-zinc-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="bg-black text-white text-[10px] font-black px-5 py-3 uppercase tracking-widest disabled:opacity-50 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              {isAdding ? '...' : 'COMPRAR'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================
          SIZE GUIDE MODAL (DYNAMIC IMPORT)
          ============================================ */}
      <DynamicSizeGuide 
        show={showSizeGuide} 
        onClose={() => setShowSizeGuide(false)} 
        selectedSize={selectedSize} 
        sizeGuideData={SIZE_GUIDE} 
        grammage={product.details?.grammage}
        model={product.details?.model}
      />

    </div>
  );
};

export default SsenseProductView;
