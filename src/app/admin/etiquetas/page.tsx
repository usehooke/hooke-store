"use client";

import { useState, useEffect, useMemo } from "react";
import type { Variants } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import { Loader2, Printer, CheckSquare, Square, Search, Trash2, LayoutGrid, List } from "lucide-react";
import Barcode from "react-barcode";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constantes Pimaco 6280 ──────────────────────────────────────────────────
// Folha A4 210mm x 297mm | Grade: 3 colunas × 10 linhas = 30 etiquetas por folha
const LABELS_PER_SHEET = 30;
const COLS = 3;

// ─── Shake Variant (Framer Motion) ──────────────────────────────────────────
const shakeVariants: Variants = {
  idle: { x: 0, rotate: 0 },
  shake: {
    x: [0, -10, 10, -8, 8, -5, 5, 0],
    rotate: [0, -3, 3, -2, 2, 0],
    transition: { duration: 0.5, ease: "easeInOut" as const },
  },
};

// ─── Componente: Célula da Folha Pimaco ─────────────────────────────────────
function PimacoCell({
  sku,
  productName,
  isEmpty,
}: {
  sku?: string;
  productName?: string;
  isEmpty?: boolean;
}) {
  if (isEmpty || !sku) {
    return (
      <div className="aspect-[63.5/38.1] border border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center">
        <span className="text-[7px] text-zinc-300 font-mono uppercase tracking-widest">vazio</span>
      </div>
    );
  }

  return (
    <div className="aspect-[63.5/38.1] border border-zinc-300 bg-white flex flex-col items-center justify-center px-1 py-0.5 shadow-sm overflow-hidden">
      <span className="text-[6px] font-black uppercase tracking-[0.15em] text-zinc-500 truncate w-full text-center leading-tight mb-0.5">
        HOOKE STORE
      </span>
      <div className="scale-[0.55] origin-center w-[180%]">
        <Barcode
          value={sku}
          width={1}
          height={28}
          fontSize={8}
          margin={0}
          displayValue={true}
          background="transparent"
        />
      </div>
      {productName && (
        <span className="text-[5.5px] text-zinc-400 font-mono truncate w-full text-center mt-0.5 leading-tight">
          {productName}
        </span>
      )}
    </div>
  );
}

// ─── Componente: Folha Pimaco 2.5D ──────────────────────────────────────────
function PimacoSheet({
  printQueue,
  sheetIndex,
}: {
  printQueue: { sku: string; productName: string }[];
  sheetIndex: number;
}) {
  const startIdx = sheetIndex * LABELS_PER_SHEET;
  const cells = Array.from({ length: LABELS_PER_SHEET }, (_, i) => printQueue[startIdx + i] ?? null);

  return (
    <div className="relative bg-white border-2 border-zinc-300 shadow-[6px_6px_0px_rgba(0,0,0,0.15)] p-3 aspect-[210/297] w-full max-w-[320px]">
      {/* Marca d'água da folha */}
      <div className="absolute top-1 right-2 text-[7px] font-black uppercase tracking-widest text-zinc-200">
        Folha {sheetIndex + 1}
      </div>

      {/* Grade de etiquetas */}
      <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {cells.map((cell, i) => (
          <PimacoCell
            key={i}
            sku={cell?.sku}
            productName={cell?.productName}
            isEmpty={!cell}
          />
        ))}
      </div>

      {/* Rodapé da folha */}
      <div className="mt-1 flex justify-between items-center">
        <span className="text-[6px] text-zinc-300 font-mono uppercase">Pimaco 6280 · 3×10 · A4</span>
        <span className="text-[6px] text-zinc-300 font-mono uppercase">
          {cells.filter(Boolean).length}/{LABELS_PER_SHEET} preenchidas
        </span>
      </div>
    </div>
  );
}

// ─── Página Principal ────────────────────────────────────────────────────────
export default function EtiquetasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkus, setSelectedSkus] = useState<Record<string, number>>({});
  const [shakeKeys, setShakeKeys] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState<"mockup" | "list">("mockup");

  useEffect(() => {
    const fetchProducts = async () => {
      const firestore = db;
      if (!firestore) { setLoading(false); return; }
      try {
        const q = query(collection(firestore, "produtos"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
      } catch (e) {
        console.error("Erro ao buscar produtos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtragem reativa 0ms
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  // Monta a fila de impressão expandida (sku × quantidade)
  const printQueue: { sku: string; productName: string }[] = useMemo(() => {
    const queue: { sku: string; productName: string }[] = [];
    Object.entries(selectedSkus).forEach(([sku, qty]) => {
      const product = products.find((p) =>
        Object.values(p.skus || {}).includes(sku)
      );
      for (let i = 0; i < qty; i++) {
        queue.push({ sku, productName: product?.name || "Hooke" });
      }
    });
    return queue;
  }, [selectedSkus, products]);

  const totalSheets = Math.ceil(printQueue.length / LABELS_PER_SHEET);
  const hasSelected = printQueue.length > 0;

  const triggerShake = (key: string) => {
    setShakeKeys((prev) => new Set([...prev, key]));
    setTimeout(() => {
      setShakeKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 600);
  };

  const handleToggleSku = (sku: string, stock: number) => {
    if (!sku) return;
    if (stock === 0) {
      // Shake visual + toast de alerta sensorial
      triggerShake(sku);
      return;
    }
    setSelectedSkus((prev) => {
      const next = { ...prev };
      if (next[sku]) delete next[sku];
      else next[sku] = 1;
      return next;
    });
  };

  const updateQuantity = (sku: string, qty: number) => {
    if (qty < 1) return;
    setSelectedSkus((prev) => ({ ...prev, [sku]: qty }));
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 size={32} className="animate-spin text-black mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Carregando arsenal de SKUs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      {/* ── CSS de Impressão ── */}
      <style>{`
        .label-etiqueta-print {
          height: 38.1mm;
          width: 63.5mm;
          page-break-inside: avoid;
        }
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            position: absolute;
            top: 0; left: 0;
            width: 210mm;
          }
          .print-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-6 md:p-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b-2 border-black gap-4 print:hidden">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-2">Arsenal Hooke · Logística</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase leading-none">
              Gerador de<br /><span className="opacity-20 font-light not-italic">Etiquetas</span>
            </h1>
          </div>
          <button
            onClick={handlePrint}
            disabled={!hasSelected}
            className="flex items-center gap-3 bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed self-start md:self-auto"
          >
            <Printer size={16} />
            Imprimir ({printQueue.length} etiquetas · {totalSheets > 0 ? totalSheets : 0} {totalSheets === 1 ? "folha" : "folhas"})
          </button>
        </div>

        {/* ── Layout Principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">

          {/* ── COLUNA ESQUERDA: Lista de Produtos ── */}
          <div className="lg:col-span-7 space-y-4">

            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder="Buscar produto por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-black focus:outline-none text-sm bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)] font-mono"
              />
            </div>

            {/* Lista de Produtos e Variações */}
            <div className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] divide-y-2 divide-zinc-100">
              {filteredProducts.map((product) => {
                const variations: { key: string; label: string; sku: string; stock: number }[] = [];

                if (product.colors && product.colors.length > 0) {
                  product.colors.forEach((color) => {
                    product.sizes.forEach((size) => {
                      const key = `${color.name}-${size}`;
                      variations.push({
                        key,
                        label: `${color.name} / ${size}`,
                        sku: product.skus?.[key] || "",
                        stock: product.stock?.[key] || 0,
                      });
                    });
                  });
                } else {
                  product.sizes.forEach((size) => {
                    variations.push({
                      key: size,
                      label: `Tam. ${size}`,
                      sku: product.skus?.[size] || "",
                      stock: product.stock?.[size] || 0,
                    });
                  });
                }

                const validVariations = variations.filter((v) => v.sku);
                if (validVariations.length === 0) return null;

                return (
                  <div key={product.id} className="p-5 bg-white">
                    <h3 className="font-black text-black text-sm uppercase tracking-widest mb-4 flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                      {product.name}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {validVariations.map((variation) => {
                        const isSelected = !!selectedSkus[variation.sku];
                        const isZeroStock = variation.stock === 0;

                        return (
                          <motion.div
                            key={variation.key}
                            variants={shakeVariants}
                            animate={shakeKeys.has(variation.sku) ? "shake" : "idle"}
                            onClick={() => handleToggleSku(variation.sku, variation.stock)}
                            className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-all select-none ${
                              isZeroStock
                                ? "border-red-200 bg-red-50 cursor-not-allowed opacity-60"
                                : isSelected
                                ? "border-black bg-zinc-900 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                : "border-zinc-200 bg-white hover:border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div>
                                {isSelected ? (
                                  <CheckSquare size={16} className="text-white" />
                                ) : (
                                  <Square size={16} className={isZeroStock ? "text-red-300" : "text-zinc-400"} />
                                )}
                              </div>
                              <div>
                                <p className={`text-xs font-black uppercase tracking-widest ${isSelected ? "text-white" : "text-black"}`}>
                                  {variation.label}
                                </p>
                                <p className={`text-[9px] font-mono mt-0.5 ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}>
                                  SKU: {variation.sku}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest border ${
                                  isZeroStock
                                    ? "bg-red-100 text-red-600 border-red-300"
                                    : variation.stock < 3
                                    ? "bg-amber-100 text-amber-700 border-amber-300"
                                    : isSelected
                                    ? "bg-white text-black border-zinc-400"
                                    : "bg-zinc-100 text-zinc-600 border-zinc-200"
                                }`}
                              >
                                {isZeroStock ? "Ruptura" : `${variation.stock} un`}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredProducts.filter((p) =>
                Object.values(p.skus || {}).some(Boolean)
              ).length === 0 && (
                <div className="p-16 text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-300">
                    Nenhum produto com SKU cadastrado encontrado.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── COLUNA DIREITA: Preview Pimaco + Fila ── */}
          <div className="lg:col-span-5 space-y-6">

            {/* Toggle de Visualização */}
            <div className="flex border-2 border-black overflow-hidden shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              {(["mockup", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative ${
                    previewMode === mode ? "bg-black text-white" : "bg-white text-zinc-400 hover:bg-zinc-50"
                  }`}
                >
                  {mode === "mockup" ? <LayoutGrid size={12} /> : <List size={12} />}
                  {mode === "mockup" ? "Preview Pimaco" : "Fila de Impressão"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {/* ── Mockup 2.5D Pimaco ── */}
              {previewMode === "mockup" && (
                <motion.div
                  key="mockup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Cabeçalho do mockup */}
                  <div className="p-4 border-2 border-black bg-zinc-50 flex justify-between items-center shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Folha Pimaco 6280</p>
                      <p className="text-[8px] text-zinc-400 font-mono uppercase">3 colunas × 10 linhas · A4</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-black">{printQueue.length}</p>
                      <p className="text-[8px] text-zinc-400 uppercase tracking-widest font-bold">etiquetas · {totalSheets} {totalSheets === 1 ? "folha" : "folhas"}</p>
                    </div>
                  </div>

                  {/* Folhas */}
                  {totalSheets === 0 ? (
                    <div className="border-2 border-dashed border-zinc-200 p-12 text-center">
                      <LayoutGrid size={32} className="text-zinc-200 mx-auto mb-3" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                        Selecione SKUs para visualizar o preview da folha
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
                      {Array.from({ length: totalSheets }, (_, i) => (
                        <PimacoSheet key={i} printQueue={printQueue} sheetIndex={i} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Lista de Fila de Impressão ── */}
              {previewMode === "list" && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sticky top-8"
                >
                  <div className="p-4 border-b-2 border-black bg-zinc-50">
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Fila de Impressão ({Object.keys(selectedSkus).length} SKUs · {printQueue.length} etiquetas)
                    </p>
                  </div>

                  {!hasSelected ? (
                    <div className="p-10 text-center">
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-300">
                        Selecione variações ao lado.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100 max-h-[60vh] overflow-y-auto">
                      {Object.entries(selectedSkus).map(([sku, qty]) => (
                        <div key={sku} className="flex items-center justify-between p-4 bg-white hover:bg-zinc-50 transition-colors">
                          <div>
                            <span className="text-xs font-mono font-black text-black">{sku}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <label htmlFor={`qty-${sku}`} className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">
                              Qtd
                            </label>
                            <input
                              id={`qty-${sku}`}
                              type="number"
                              value={qty}
                              min={1}
                              onChange={(e) => updateQuantity(sku, parseInt(e.target.value) || 1)}
                              className="w-14 border-2 border-black p-1 text-center text-xs font-bold focus:outline-none"
                              aria-label={`Quantidade de etiquetas para ${sku}`}
                            />
                            <button
                              onClick={() => setSelectedSkus((prev) => { const n = { ...prev }; delete n[sku]; return n; })}
                              aria-label={`Remover ${sku} da fila`}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-red-200"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {hasSelected && (
                    <div className="p-4 border-t-2 border-black bg-zinc-50">
                      <button
                        onClick={() => setSelectedSkus({})}
                        className="w-full py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors border border-zinc-200 hover:border-red-300"
                      >
                        Limpar Fila Completa
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Área de Impressão (oculta na tela, visível no Print) ── */}
        <div id="print-area" className="hidden print:block bg-white w-full">
          <div className="print-grid">
            {printQueue.map((item, i) => (
              <div key={i} className="label-etiqueta-print flex flex-col items-center justify-center border border-dashed border-gray-300 p-2">
                <Barcode
                  value={item.sku}
                  width={1.5}
                  height={40}
                  fontSize={10}
                  margin={0}
                  displayValue={true}
                  background="transparent"
                />
                <span className="text-[7px] mt-0.5 font-bold text-black tracking-widest">Hooke Store</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
