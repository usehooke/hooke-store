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
  Download,
  ImageIcon,
  Code2,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Package,
  Eye,
  EyeOff,
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
  lookbookImages?: Record<ShotType, string | null>;
}

interface GeradorViewProps {
  products: ProductOption[];
}

type ShotType = 'hero' | 'meioCorpo' | 'editorial' | 'detalhe';

// ---------------------------------------------------------------------------
// Color translation map (PT-BR → English for JSON spec)
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
// Graphic Print Detection & Description Map
// Products with category "Vintage" have screen-printed graphics.
// This map describes each print so the AI reproduces it instead of ignoring it.
// ---------------------------------------------------------------------------

interface GraphicPrint {
  designName: string;
  description: string;
  detailDescription: string;
}

const GRAPHIC_PRINTS: Record<string, GraphicPrint> = {
  fusca: {
    designName: 'Vintage Beetle',
    description:
      'a large vintage-style screen-printed illustration of a classic Volkswagen Beetle (Fusca) seen from the front, rendered in a bold flat line-art style with visible headlights, bumper, windshield, and side mirrors. The license plate reads "HOOKE" in bold capital letters. The print is centered on the chest area, printed in a single dark ink tone that contrasts with the fabric color',
    detailDescription:
      'the screen-printed Beetle illustration showing the ink texture, the fine line work of the headlights and windshield details, and the "HOOKE" text on the license plate. The print has a slightly worn vintage screen-print feel with visible ink grain on the cotton fabric',
  },
  kombi: {
    designName: 'Vintage Kombi',
    description:
      'a large vintage-style screen-printed illustration of a classic Volkswagen Kombi (Type 2 Bus) seen from the front, rendered in minimalist bold black line-art style showing the split windshield, VW logo emblem, round headlights, and front bumper. Below the illustration, the word "HOOKE" is printed in stylized bold capital letters. The print is centered on the chest area',
    detailDescription:
      'the screen-printed Kombi illustration showing the clean black ink lines of the split windshield, the VW circular emblem, and the minimalist front-end details. The "HOOKE" text below is crisp. The print has a hand-drawn artisan quality with solid black ink on the fabric',
  },
  maverick: {
    designName: 'Vintage Maverick',
    description:
      'a large vintage-style screen-printed illustration of a classic Ford Maverick muscle car seen from the rear, rendered in bold silhouette style showing the distinctive rear lights, trunk, rear bumper, and muscular body lines. The license plate reads "HOOKE" in bold capital letters. The print is centered on the chest area, printed in dark ink that contrasts with the fabric',
    detailDescription:
      'the screen-printed Maverick illustration showing the ink texture of the rear silhouette, the distinctive taillights detail, and the "HOOKE" license plate text. The print has a vintage American muscle car aesthetic with solid dark ink on the fabric',
  },
};

/**
 * Detects if a product is a Vintage (graphic print) product and returns
 * the matching GraphicPrint info, or null for plain products.
 */
function detectGraphicPrint(category: string, productName: string): GraphicPrint | null {
  if (category?.toLowerCase() !== 'vintage') return null;
  const nameLower = productName.toLowerCase();
  if (nameLower.includes('fusca') || nameLower.includes('beetle')) return GRAPHIC_PRINTS.fusca;
  if (nameLower.includes('kombi')) return GRAPHIC_PRINTS.kombi;
  if (nameLower.includes('maverick')) return GRAPHIC_PRINTS.maverick;
  // Fallback: unknown vintage design — still flag as graphic
  return GRAPHIC_PRINTS.fusca;
}

// ---------------------------------------------------------------------------
// Prompt generators (kept for JSON spec & copy)
// ---------------------------------------------------------------------------

function buildProductDesc(
  color: string,
  details: ProductOption['details'],
  graphicPrint: GraphicPrint | null
): string {
  const fabric = details.fabric || 'heavyweight cotton';
  const grammage = details.grammage || '260gsm';
  const collar = details.collar || 'thick ribbed crew neck collar';
  const model = details.model || 'oversized drop-shoulder';

  const base = `${color} ${model} ${fabric} t-shirt`;

  if (graphicPrint) {
    // Vintage: describe the graphic ON the shirt
    return `${base}, ${collar}, featuring ${graphicPrint.description}`;
  }

  // Plain: waffle texture, no graphics
  return `${base} with waffle textured knit fabric, ${grammage}, ${collar}, relaxed boxy fit`;
}

function generatePrompt(
  shot: ShotType,
  colorEN: string,
  details: ProductOption['details'],
  category: string,
  productName: string
): string {
  const graphicPrint = detectGraphicPrint(category, productName);
  const productDesc = buildProductDesc(colorEN, details, graphicPrint);

  // Graphic instruction: for plain → "No graphics"; for vintage → "Preserve the print"
  const graphicInstruction = graphicPrint
    ? `CRITICAL: The t-shirt MUST display the screen-printed graphic as described above. Reproduce the ${graphicPrint.designName} illustration exactly as shown in the reference product image. The graphic is the key visual element of this product. Do NOT render a blank or plain shirt.`
    : `No logos, no text, no graphics on the shirt.`;

  const prompts: Record<ShotType, string> = {
    hero: `Full body studio photograph of ${FOUNDER_ANCHOR}

He is wearing a ${productDesc}, hem falling below the waist. Paired with dark washed baggy jeans and white sneakers.

Standing in a relaxed confident pose, one hand in pocket, facing the camera. Full body shot from head to shoes.

Clean minimal studio with soft gray concrete wall background. Soft diffused natural lighting from the left. Editorial fashion e-commerce photography, shot on 85mm lens, f/2.8, high resolution, 4K. ${graphicInstruction}`,

    meioCorpo: `Medium shot photograph of ${FOUNDER_ANCHOR}

The gold Hamsa pendant on the black cord necklace is visible on his chest.

He is wearing a ${productDesc}. Arms relaxed at sides.

Medium shot framing from waist to top of head.

Clean minimal studio, soft gray concrete wall background. Soft diffused lighting, slight shadow on the right side of the face for depth. Editorial fashion photography, shot on 85mm lens, f/2.0, shallow depth of field, high resolution. ${graphicInstruction}`,

    editorial: `Candid editorial photograph of ${FOUNDER_ANCHOR}

Looking slightly to the side with a serious intense expression.

He is wearing a ${productDesc}. Paired with dark jeans and white sneakers.

Walking naturally through an urban industrial setting, raw concrete walls, warm golden hour sunlight creating dramatic side lighting. Candid editorial pose.

Cinematic streetwear photography, warm color grading, shallow depth of field with blurred background, shot on 85mm lens, f/1.8, 4K resolution. Mood: premium urban masculinity. ${graphicInstruction}`,

    detalhe: graphicPrint
      ? `Extreme close-up detail photograph of the chest area of a ${productDesc} being worn.

Focus on ${graphicPrint.detailDescription}.

The gold Hamsa pendant on a black cord necklace is partially visible resting near the graphic.

Macro photography style, soft studio lighting from the left creating subtle fabric shadows. Very shallow depth of field, the printed graphic in sharp focus showing ink texture on fabric. Premium fashion detail photography, 4K resolution. ${graphicInstruction}`
      : `Extreme close-up detail photograph of the neckline and upper chest area of a ${productDesc} being worn.

Focus on the thick ribbed crew neck collar showing the dense knit texture, the heavy waffle textured cotton fabric with clearly visible weave pattern, and the drop-shoulder seam construction.

The gold Hamsa pendant on a black cord necklace is partially visible resting on the fabric.

Macro photography style, soft studio lighting from the left creating subtle fabric shadows that enhance texture visibility. Very shallow depth of field, fabric weave in sharp focus. Premium fashion detail photography, 4K resolution. ${graphicInstruction}`,
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
  aspect: string;
}[] = [
  {
    key: 'hero',
    label: 'HERO',
    sublabel: 'Corpo inteiro • Thumbnail',
    icon: User,
    aspect: 'aspect-[3/4]',
  },
  {
    key: 'meioCorpo',
    label: 'MEIO CORPO',
    sublabel: 'Caimento • Textura',
    icon: Maximize,
    aspect: 'aspect-[3/4]',
  },
  {
    key: 'editorial',
    label: 'EDITORIAL',
    sublabel: 'Lifestyle • Anúncio',
    icon: SunMedium,
    aspect: 'aspect-[3/4]',
  },
  {
    key: 'detalhe',
    label: 'DETALHE',
    sublabel: 'Close no tecido • Gola',
    icon: Focus,
    aspect: 'aspect-square',
  },
];

// ---------------------------------------------------------------------------
// JSON Control Spec Builder
// ---------------------------------------------------------------------------

function buildAntigravitySpec(product: ProductOption, colorEN: string): object {
  return {
    engine: 'antigravity-v2',
    model: 'gemini-2.5-flash',
    codename: 'Nano Banana 2',
    product: {
      id: product.id,
      name: product.name,
      color: { original: product.color, translated: colorEN },
      category: product.category,
      details: {
        fabric: product.details.fabric || 'heavyweight cotton',
        grammage: product.details.grammage || '260gsm',
        collar: product.details.collar || '3cm ribbed crew neck',
        model: product.details.model || 'oversized drop-shoulder',
      },
    },
    founderAnchor: {
      description: 'Brazilian man, early 30s, broad stocky athletic build',
      accessories: ['thin black cord necklace', 'small gold Hamsa pendant'],
      expression: 'confident serious with subtle intensity',
    },
    shots: SHOTS.map((s) => ({
      key: s.key,
      label: s.label,
      prompt: generatePrompt(s.key, colorEN, product.details, product.category, product.name),
      outputPath: `/lookbook/${product.id}/${s.key}.jpg`,
      settings: {
        lens: s.key === 'detalhe' ? '100mm macro' : '85mm',
        aperture: s.key === 'editorial' ? 'f/1.8' : s.key === 'meioCorpo' ? 'f/2.0' : 'f/2.8',
        resolution: '4K',
        negativePrompt: detectGraphicPrint(product.category, product.name)
          ? 'distorted face, extra fingers, blank plain shirt without graphic, missing print'
          : 'logos, text, graphics on shirt, distorted face, extra fingers',
      },
    })),
    rules: [
      'NO logos, text, or graphics on the shirt',
      'Collar must show 3cm ribbed knit texture',
      'Fabric weight: 260g heavyweight feel',
      'Waffle texture must be visible in close-ups',
    ],
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GeradorView({ products }: GeradorViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [copiedShot, setCopiedShot] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showJsonSpec, setShowJsonSpec] = useState(false);
  const [expandedShot, setExpandedShot] = useState<ShotType | null>(null);

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

  const handleCopySpec = useCallback(() => {
    if (!selectedProduct) return;
    const spec = buildAntigravitySpec(selectedProduct, colorEN);
    handleCopy(JSON.stringify(spec, null, 2), 'json-spec');
  }, [selectedProduct, colorEN, handleCopy]);

  const handleCopyPrompt = useCallback((shotKey: ShotType) => {
    if (!selectedProduct) return;
    const prompt = generatePrompt(shotKey, colorEN, selectedProduct.details, selectedProduct.category, selectedProduct.name);
    handleCopy(prompt, shotKey);
  }, [selectedProduct, colorEN, handleCopy]);

  const handleDownloadImage = useCallback((imageUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

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
                Tradução para o Engine
              </p>
              <p className="text-sm font-bold mt-0.5">
                <span className="text-zinc-400">{selectedProduct.color || '—'}</span>
                <span className="text-zinc-300 mx-2">→</span>
                <span className="text-black font-mono">&quot;{colorEN}&quot;</span>
              </p>
            </div>
          </div>
        )}

        {/* Product Type Indicator: Estampado (Vintage) vs Liso */}
        {selectedProduct && (() => {
          const gp = detectGraphicPrint(selectedProduct.category, selectedProduct.name);
          return (
            <div className={cn(
              'flex items-center gap-3 p-4 border',
              gp
                ? 'bg-violet-50 border-violet-200/50'
                : 'bg-zinc-50 border-black/5'
            )}>
              {gp ? (
                <>
                  <ImageIcon size={14} className="text-violet-500" />
                  <div>
                    <p className="text-[9px] font-black tracking-[0.2em] uppercase text-violet-500">
                      Produto Estampado — {gp.designName}
                    </p>
                    <p className="text-[10px] text-violet-400 mt-0.5">
                      O prompt inclui a descrição da estampa. Anexe a foto do produto como referência visual.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Package size={14} className="text-zinc-400" />
                  <div>
                    <p className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400">
                      Produto Liso — Sem estampa
                    </p>
                    <p className="text-[10px] text-zinc-300 mt-0.5">
                      O prompt instrui a IA a manter a camiseta sem gráficos.
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </section>

      {/* ─── Lookbook Studio ─── */}
      {selectedProduct && (
        <>
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200/50">
                <AlertCircle size={14} className="text-amber-600" />
                <span className="text-[10px] font-black tracking-[0.15em] uppercase text-amber-700">
                  Lookbook pendente — Gerar imagens via Antigravity
                </span>
              </div>
            </div>

            {/* JSON Spec Toggle + Copy */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowJsonSpec(!showJsonSpec)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-[10px] font-black tracking-[0.15em] uppercase transition-all border',
                  showJsonSpec
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-zinc-600 border-black/10 hover:border-black/30'
                )}
              >
                <Code2 size={14} />
                {showJsonSpec ? 'Ocultar JSON' : 'Ver JSON Engine Spec'}
              </button>
              <button
                onClick={handleCopySpec}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-[10px] font-black tracking-[0.15em] uppercase transition-all',
                  copiedShot === 'json-spec'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black text-white hover:bg-zinc-800'
                )}
              >
                {copiedShot === 'json-spec' ? (
                  <>
                    <Check size={14} /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copiar Spec
                  </>
                )}
              </button>
            </div>
          </div>

          {/* JSON Engine Spec Panel (Collapsible) */}
          {showJsonSpec && (
            <section className="border border-black/10 bg-zinc-950 p-6 overflow-hidden animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Code2 size={14} className="text-emerald-400" />
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-400">
                  Antigravity Engine Control Spec
                </p>
              </div>
              <pre className="text-[11px] leading-relaxed text-zinc-300 font-mono whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto custom-scrollbar">
                {JSON.stringify(buildAntigravitySpec(selectedProduct, colorEN), null, 2)}
              </pre>
            </section>
          )}

          {/* Shot Cards — Image Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SHOTS.map((shot, index) => {
              const realLookbookImage = selectedProduct.lookbookImages?.[shot.key] || null;
              const hasImage = !!realLookbookImage;
              const displayImage = realLookbookImage || (shot.key === 'hero' ? selectedProduct.imageUrl : null);
              
              const isExpanded = expandedShot === shot.key;
              const isCopied = copiedShot === shot.key;

              return (
                <div
                  key={shot.key}
                  className="border border-black/10 bg-white flex flex-col group"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-5 border-b border-black/5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 flex items-center justify-center text-[10px] font-black',
                        hasImage
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black text-white'
                      )}>
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
                    <div className="flex items-center gap-2">
                      {hasImage ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={16} className="text-amber-400" />
                      )}
                      <shot.icon size={18} className="text-zinc-300" />
                    </div>
                  </div>

                  {/* Image Preview Area */}
                  <div className={cn('relative overflow-hidden bg-zinc-100', shot.aspect)}>
                    {displayImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={displayImage}
                          alt={`${selectedProduct.name} — ${shot.label}`}
                          fill
                          className={cn(
                            "object-cover transition-transform duration-500 group-hover:scale-[1.02]",
                            !hasImage && "opacity-50 grayscale"
                          )}
                        />
                        
                        {!hasImage && (
                          <div className="absolute top-3 left-3 bg-amber-500 text-white text-[8px] font-black tracking-widest uppercase px-2.5 py-1">
                            Rascunho Catálogo
                          </div>
                        )}

                        {/* Hover overlay with download - only active when real image is present */}
                        {hasImage && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => handleDownloadImage(
                                displayImage,
                                `${selectedProduct.id}_${shot.key}.jpg`
                              )}
                              className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-black tracking-[0.2em] uppercase hover:bg-zinc-100 transition-colors"
                            >
                              <Download size={14} /> Baixar Imagem
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-14 h-14 bg-zinc-200/50 flex items-center justify-center mb-4">
                          <ImageIcon size={24} className="text-zinc-300" />
                        </div>
                        <p className="text-[10px] font-black tracking-[0.15em] uppercase text-zinc-400">
                          Imagem pendente
                        </p>
                        <p className="text-[10px] text-zinc-300 mt-1 max-w-[240px]">
                          Gere via Antigravity Engine e salve em:
                        </p>
                        <code className="text-[9px] font-mono text-zinc-400 mt-2 bg-zinc-200/30 px-3 py-1.5">
                          /lookbook/{selectedProduct.id}/{shot.key}.jpg
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Prompt Toggle & Actions */}
                  <div className="border-t border-black/5">
                    {/* Expand/collapse prompt */}
                    <button
                      onClick={() => setExpandedShot(isExpanded ? null : shot.key)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <EyeOff size={14} className="text-zinc-400" />
                        ) : (
                          <Eye size={14} className="text-zinc-400" />
                        )}
                        <span className="text-[10px] font-black tracking-[0.15em] uppercase text-zinc-500">
                          {isExpanded ? 'Ocultar prompt' : 'Ver prompt de geração'}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className={cn(
                          'text-zinc-300 transition-transform',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    </button>

                    {/* Expanded prompt area */}
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-3 animate-in slide-in-from-top-1 duration-200">
                        <pre className="text-[11px] leading-relaxed text-zinc-600 font-mono whitespace-pre-wrap break-words max-h-[220px] overflow-y-auto custom-scrollbar p-4 bg-zinc-50 border border-black/5">
                          {generatePrompt(shot.key, colorEN, selectedProduct.details, selectedProduct.category, selectedProduct.name)}
                        </pre>
                        <button
                          onClick={() => handleCopyPrompt(shot.key)}
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
                    )}
                  </div>

                  {/* Bottom action bar */}
                  {hasImage && (
                    <div className="p-4 border-t border-black/5">
                      <button
                        onClick={() => handleDownloadImage(
                          displayImage!,
                          `${selectedProduct.id}_${shot.key}.jpg`
                        )}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all"
                      >
                        <Download size={14} /> Baixar Imagem
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Workflow Guide */}
          <section className="border border-black/10 bg-white p-6 md:p-8 space-y-4">
            <h3 className="text-[10px] font-black tracking-[0.25em] uppercase">
              Fluxo Antigravity
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
                  title: 'Copie o Prompt',
                  desc: 'Expanda o shot e copie o prompt de geração',
                },
                {
                  step: '03',
                  title: 'Gere na IA',
                  desc: 'Cole o prompt + sua foto de referência na IA',
                },
                {
                  step: '04',
                  title: 'Salve no Lookbook',
                  desc: 'Salve em /lookbook/{id}/{shot}.jpg para exibição automática',
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
            <Package size={28} strokeWidth={1} className="text-zinc-300" />
          </div>
          <div>
            <p className="text-sm font-black tracking-tight">
              Nenhum produto selecionado
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Selecione um produto acima para abrir o Estúdio Lookbook.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
