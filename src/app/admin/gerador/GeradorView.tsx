'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import {
  Camera,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  User,
  Maximize,
  Focus,
  SunMedium,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProductOption {
  id: string;
  name: string;
  color: string;
  category: string;
  imageUrl: string;
  details: {
    fabric: string;
    grammage: string;
    collar: string;
    model: string;
  };
}

interface GeradorViewProps {
  products: ProductOption[];
}

type ShotType = 'hero' | 'meioCorpo' | 'editorial' | 'detalhe';

// ---------------------------------------------------------------------------
// Color translation map (PT-BR → English for prompts)
// ---------------------------------------------------------------------------

const COLOR_EN_MAP: Record<string, string> = {
  preto: 'solid black',
  branco: 'pure white',
  'off-white': 'warm off-white cream',
  'off white': 'warm off-white cream',
  cinza: 'medium heather gray',
  chumbo: 'dark charcoal gray',
  mescla: 'heather gray melange',
  prata: 'light silver gray',
  azul: 'deep navy blue',
  'azul marinho': 'deep navy blue',
  'azul bebê': 'soft baby blue',
  'azul petróleo': 'dark teal blue',
  'azul claro': 'light sky blue',
  areia: 'warm sand beige',
  bege: 'warm sand beige',
  caqui: 'earthy khaki',
  nude: 'soft nude beige',
  ferrugem: 'deep rust orange',
  mostarda: 'rich mustard yellow',
  amarelo: 'bright golden yellow',
  verde: 'deep forest green',
  'verde musgo': 'dark moss green',
  'verde militar': 'deep military olive green',
  vermelho: 'bold crimson red',
  bordo: 'deep burgundy wine',
  bordô: 'deep burgundy wine',
  vinho: 'dark burgundy wine',
  rosa: 'dusty rose pink',
  marrom: 'dark chocolate brown',
};

function translateColor(ptColor: string): string {
  if (!ptColor) return 'solid black';
  const normalized = ptColor.toLowerCase().trim();
  if (COLOR_EN_MAP[normalized]) return COLOR_EN_MAP[normalized];
  for (const [key, en] of Object.entries(COLOR_EN_MAP)) {
    if (normalized.includes(key)) return en;
  }
  return ptColor;
}

// ---------------------------------------------------------------------------
// Founder anchor (fixed across all prompts)
// ---------------------------------------------------------------------------

const FOUNDER_ANCHOR = `The same man from the reference photo. Brazilian man, early 30s, broad stocky athletic build, fair skin, very short buzzed dark hair, well-groomed short dark beard, blue-green eyes, strong jaw, confident serious expression with subtle intensity. He wears a thin black cord necklace with a small gold Hamsa pendant.`;

// ---------------------------------------------------------------------------
// Prompt generators
// ---------------------------------------------------------------------------

function buildProductDesc(color: string, details: ProductOption['details']): string {
  const fabric = details.fabric || 'heavyweight cotton';
  const grammage = details.grammage || '260gsm';
  const collar = details.collar || 'thick ribbed crew neck collar';
  const model = details.model || 'oversized drop-shoulder';

  return `${color} ${model} ${fabric} t-shirt with waffle textured knit fabric, ${grammage}, ${collar}, relaxed boxy fit`;
}

function generatePrompt(
  shot: ShotType,
  colorEN: string,
  details: ProductOption['details']
): string {
  const productDesc = buildProductDesc(colorEN, details);

  const prompts: Record<ShotType, string> = {
    hero: `Full body studio photograph of ${FOUNDER_ANCHOR}

He is wearing a ${productDesc}, hem falling below the waist. Paired with dark washed baggy jeans and white sneakers.

Standing in a relaxed confident pose, one hand in pocket, facing the camera. Full body shot from head to shoes.

Clean minimal studio with soft gray concrete wall background. Soft diffused natural lighting from the left. Editorial fashion e-commerce photography, shot on 85mm lens, f/2.8, high resolution, 4K. No logos, no text, no graphics on the shirt.`,

    meioCorpo: `Medium shot photograph of ${FOUNDER_ANCHOR}

The gold Hamsa pendant on the black cord necklace is visible on his chest.

He is wearing a ${productDesc}. Arms relaxed at sides.

Medium shot framing from waist to top of head.

Clean minimal studio, soft gray concrete wall background. Soft diffused lighting, slight shadow on the right side of the face for depth. Editorial fashion photography, shot on 85mm lens, f/2.0, shallow depth of field, high resolution. No logos, no text, no graphics on the shirt.`,

    editorial: `Candid editorial photograph of ${FOUNDER_ANCHOR}

Looking slightly to the side with a serious intense expression.

He is wearing a ${productDesc}. Paired with dark jeans and white sneakers.

Walking naturally through an urban industrial setting, raw concrete walls, warm golden hour sunlight creating dramatic side lighting. Candid editorial pose.

Cinematic streetwear photography, warm color grading, shallow depth of field with blurred background, shot on 85mm lens, f/1.8, 4K resolution. Mood: premium urban masculinity. No logos, no text, no graphics on the shirt.`,

    detalhe: `Extreme close-up detail photograph of the neckline and upper chest area of a ${productDesc} being worn.

Focus on the thick ribbed crew neck collar showing the dense knit texture, the heavy waffle textured cotton fabric with clearly visible weave pattern, and the drop-shoulder seam construction.

The gold Hamsa pendant on a black cord necklace is partially visible resting on the fabric.

Macro photography style, soft studio lighting from the left creating subtle fabric shadows that enhance texture visibility. Very shallow depth of field, fabric weave in sharp focus. Premium fashion detail photography, 4K resolution. No logos, no text, no graphics on the shirt.`,
  };

  return prompts[shot];
}

// ---------------------------------------------------------------------------
// Shot metadata
// ---------------------------------------------------------------------------

const SHOTS: {
  key: ShotType;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  tip: string;
}[] = [
  {
    key: 'hero',
    label: 'HERO',
    sublabel: 'Corpo inteiro • Thumbnail',
    icon: User,
    tip: 'Use sua foto SEM camiseta como referência para este shot.',
  },
  {
    key: 'meioCorpo',
    label: 'MEIO CORPO',
    sublabel: 'Caimento • Textura',
    icon: Maximize,
    tip: 'Use uma foto com camiseta similar como referência.',
  },
  {
    key: 'editorial',
    label: 'EDITORIAL',
    sublabel: 'Lifestyle • Anúncio',
    icon: SunMedium,
    tip: 'Use sua foto SEM camiseta como referência para este shot.',
  },
  {
    key: 'detalhe',
    label: 'DETALHE',
    sublabel: 'Close no tecido • Gola',
    icon: Focus,
    tip: 'Use uma foto vestindo peça similar como referência.',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GeradorView({ products }: GeradorViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [copiedShot, setCopiedShot] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const colorEN = useMemo(
    () => (selectedProduct ? translateColor(selectedProduct.color) : ''),
    [selectedProduct]
  );

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.color?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleCopy = useCallback(async (text: string, shotKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedShot(shotKey);
      setTimeout(() => setCopiedShot(null), 2500);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedShot(shotKey);
      setTimeout(() => setCopiedShot(null), 2500);
    }
  }, []);

  const handleCopyAll = useCallback(() => {
    if (!selectedProduct) return;
    const allPrompts = SHOTS.map(
      (s, i) =>
        `=== SHOT ${i + 1}: ${s.label} ===\n${s.tip}\n\n${generatePrompt(s.key, colorEN, selectedProduct.details)}`
    ).join('\n\n' + '═'.repeat(60) + '\n\n');
    handleCopy(allPrompts, 'all');
  }, [selectedProduct, colorEN, handleCopy]);

  return (
    <div className="space-y-8">
      {/* ─── Product Selector ─── */}
      <section className="border border-black/10 bg-white p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Camera size={18} strokeWidth={2} />
          <h2 className="text-[10px] font-black tracking-[0.25em] uppercase">
            Selecionar Produto
          </h2>
        </div>

        {/* Custom Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              'w-full flex items-center gap-4 p-4 border transition-all text-left',
              isDropdownOpen
                ? 'border-black bg-zinc-50'
                : 'border-black/10 hover:border-black/30'
            )}
          >
            {selectedProduct ? (
              <>
                <div className="w-12 h-12 bg-zinc-100 border border-black/5 flex-shrink-0 overflow-hidden">
                  {selectedProduct.imageUrl && (
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black tracking-tight truncate">
                    {selectedProduct.name}
                  </p>
                  <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 mt-0.5">
                    {selectedProduct.color || 'Sem cor'} • {selectedProduct.category}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-zinc-400 text-sm font-bold">
                Clique para selecionar um produto...
              </span>
            )}
            <ChevronDown
              size={16}
              className={cn(
                'text-zinc-400 transition-transform flex-shrink-0',
                isDropdownOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown Options */}
          {isDropdownOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-black/10 shadow-xl max-h-[400px] overflow-hidden flex flex-col">
              {/* Search */}
              <div className="p-3 border-b border-black/5">
                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-black/5">
                  <Search size={14} className="text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-sm bg-transparent outline-none placeholder:text-zinc-300"
                    autoFocus
                  />
                </div>
              </div>

              {/* Product List */}
              <div className="overflow-y-auto max-h-[340px] custom-scrollbar">
                {filteredProducts.length === 0 ? (
                  <div className="p-6 text-center text-zinc-400 text-sm">
                    Nenhum produto encontrado
                  </div>
                ) : (
                  filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 text-left transition-all hover:bg-zinc-50 border-b border-black/[0.03]',
                        selectedProductId === p.id && 'bg-zinc-50'
                      )}
                    >
                      <div className="w-10 h-10 bg-zinc-100 border border-black/5 flex-shrink-0 overflow-hidden">
                        {p.imageUrl && (
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold tracking-tight truncate">
                          {p.name}
                        </p>
                        <p className="text-[9px] font-bold tracking-wider uppercase text-zinc-400 mt-0.5">
                          {p.color || '—'} • {p.category}
                        </p>
                      </div>
                      {selectedProductId === p.id && (
                        <div className="w-2 h-2 bg-black flex-shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Color Translation Preview */}
        {selectedProduct && (
          <div className="flex items-center gap-3 p-4 bg-zinc-50 border border-black/5">
            <Sparkles size={14} className="text-zinc-400" />
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400">
                Tradução para o prompt
              </p>
              <p className="text-sm font-bold mt-0.5">
                <span className="text-zinc-400">{selectedProduct.color || '—'}</span>
                <span className="text-zinc-300 mx-2">→</span>
                <span className="text-black font-mono">&quot;{colorEN}&quot;</span>
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ─── Generated Prompts ─── */}
      {selectedProduct && (
        <>
          {/* Copy All Button */}
          <div className="flex justify-end">
            <button
              onClick={handleCopyAll}
              className={cn(
                'flex items-center gap-2 px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all',
                copiedShot === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black text-white hover:bg-zinc-800'
              )}
            >
              {copiedShot === 'all' ? (
                <>
                  <Check size={14} /> Todos copiados!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copiar os 4 prompts
                </>
              )}
            </button>
          </div>

          {/* Shot Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SHOTS.map((shot, index) => {
              const prompt = generatePrompt(
                shot.key,
                colorEN,
                selectedProduct.details
              );
              const isCopied = copiedShot === shot.key;

              return (
                <div
                  key={shot.key}
                  className="border border-black/10 bg-white flex flex-col"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-5 border-b border-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-[10px] font-black">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-[11px] font-black tracking-[0.15em] uppercase">
                          {shot.label}
                        </p>
                        <p className="text-[9px] font-bold tracking-wider uppercase text-zinc-400 mt-0.5">
                          {shot.sublabel}
                        </p>
                      </div>
                    </div>
                    <shot.icon size={18} className="text-zinc-300" />
                  </div>

                  {/* Tip */}
                  <div className="px-5 py-3 bg-amber-50/50 border-b border-amber-100/50">
                    <p className="text-[9px] font-black tracking-wider uppercase text-amber-700/70">
                      💡 {shot.tip}
                    </p>
                  </div>

                  {/* Prompt Content */}
                  <div className="flex-1 p-5">
                    <pre className="text-[11px] leading-relaxed text-zinc-600 font-mono whitespace-pre-wrap break-words max-h-[280px] overflow-y-auto custom-scrollbar">
                      {prompt}
                    </pre>
                  </div>

                  {/* Copy Button */}
                  <div className="p-4 border-t border-black/5">
                    <button
                      onClick={() => handleCopy(prompt, shot.key)}
                      className={cn(
                        'w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all',
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-black hover:text-white'
                      )}
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copiar prompt
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instructions footer */}
          <section className="border border-black/10 bg-white p-6 md:p-8 space-y-4">
            <h3 className="text-[10px] font-black tracking-[0.25em] uppercase">
              Como Usar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  title: 'Selecione',
                  desc: 'Escolha o produto acima',
                },
                {
                  step: '02',
                  title: 'Copie',
                  desc: 'Clique em "Copiar Prompt" no shot desejado',
                },
                {
                  step: '03',
                  title: 'Cole na IA',
                  desc: 'Anexe sua foto de referência + cole o prompt',
                },
                {
                  step: '04',
                  title: 'Publique',
                  desc: 'Baixe a imagem e suba no catálogo',
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <span className="text-2xl font-black text-zinc-200 leading-none">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-[10px] font-black tracking-wider uppercase">
                      {s.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Empty State */}
      {!selectedProduct && (
        <div className="border border-dashed border-black/10 bg-white p-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center">
            <Camera size={28} strokeWidth={1} className="text-zinc-300" />
          </div>
          <div>
            <p className="text-sm font-black tracking-tight">
              Nenhum produto selecionado
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Selecione um produto acima para gerar os 4 prompts de fotografia.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
