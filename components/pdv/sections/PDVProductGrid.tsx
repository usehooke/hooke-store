import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Product } from "@/types";
import { usePDVStore } from "@/store/pdv-store";
import { useState } from "react";
import { Search, Loader2, LayoutList, Grid3X3 } from "lucide-react";
import { MODEL_DICTIONARY, ModelSigla } from "@/utils/sku-generator";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function PDVProductGrid() {
  const addItem = usePDVStore(state => state.addItem);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedModel, setSelectedModel] = useState<ModelSigla | "All">("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Falha ao carregar catálogo.");
      return res.json();
    },
  });

  const categories = ["All", ...new Set(Array.isArray(products) ? products.map((p) => p.category) : [])];
  const items = Array.isArray(products) ? products : [];

  const filteredProducts = items.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesModel = selectedModel === "All" || p.modelSigla === selectedModel || (p.category === 'Oversized' && selectedModel === 'OVE') || (p.category !== 'Oversized' && selectedModel === 'TSH');
    return matchesSearch && matchesCategory && matchesModel;
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* SELEÇÃO DE CATEGORIA - ALTA VISIBILIDADE (McD STYLE) */}
      <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
        <div className="flex gap-3 overflow-x-auto custom-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "flex-shrink-0 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] border transition-all",
                selectedCategory === cat
                  ? "bg-black text-white border-black shadow-lg"
                  : "bg-white text-zinc-400 border-black/[0.05] hover:border-black/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-zinc-100 p-1 border border-black/[0.05] ml-6">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition-all ${viewMode === "list" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
            title="Modo Lista"
          >
            <LayoutList size={20} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition-all ${viewMode === "grid" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
            title="Modo Grade"
          >
            <Grid3X3 size={20} />
          </button>
        </div>
      </div>

      {/* GRADE DE MODELOS - ATALHOS TÁTEIS */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        {(Object.keys(MODEL_DICTIONARY) as ModelSigla[]).map((sigla) => (
          <button
            key={sigla}
            onClick={() => setSelectedModel(sigla === selectedModel ? "All" : sigla)}
            className={cn(
              "flex flex-col items-center justify-center p-4 border transition-all h-24 group",
              selectedModel === sigla 
                ? "bg-zinc-100 text-black border-black" 
                : "bg-zinc-50 text-zinc-400 border-black/[0.03] hover:bg-white hover:border-black/5"
            )}
          >
            <span className="text-xl font-serif group-hover:scale-110 transition-transform">{sigla}</span>
            <span className="text-[7px] font-bold uppercase tracking-[0.2em] mt-2 opacity-60">
                {MODEL_DICTIONARY[sigla]?.label?.split(' ')[0] || sigla}
            </span>
          </button>
        ))}
      </div>

      {/* BARRA DE BUSCA INDUSTRIAL */}
      <div className="relative">
        <input
          type="text"
          placeholder="PESQUISAR PRODUTO OU SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-50 border border-black/[0.05] p-5 pl-14 text-xs text-zinc-900 font-bold focus:bg-white focus:border-black transition-all outline-none placeholder:text-zinc-300 uppercase tracking-widest"
        />
        <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-300" />
      </div>

      {/* RENDERIZAÇÃO DE PRODUTOS */}
      <AnimatePresence mode="popLayout">
        {viewMode === "grid" ? (
          /* MODO GRID (Visual Original) */
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative flex flex-col bg-white border border-black/[0.05] p-2 hover:border-black/10 transition-all shadow-sm">
                <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
                  {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-all duration-700" />}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-black/[0.05] text-black text-[8px] font-black px-3 py-1 uppercase tracking-tighter italic">{product.modelSigla || 'ELITE'}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-[11px] font-black text-black truncate uppercase tracking-tight mb-1">{product.name}</h3>
                  <p className="text-xs font-serif text-zinc-500 mb-6">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</p>
                  <div className="mt-auto grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button key={size} onClick={() => addItem(product, size)} className="flex items-center justify-center h-12 bg-zinc-50 text-[10px] font-black text-zinc-400 hover:bg-black hover:text-white transition-all border border-black/[0.03]">{size}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* MODO LISTA OPERACIONAL (Foco em Velocidade 3.1) */
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex items-center bg-white border border-black/[0.05] p-4 gap-8 hover:border-black/20 transition-all shadow-sm">
                {/* Miniatura Nítida (Solicitada para validação de estampa) */}
                <div className="relative h-24 w-20 bg-zinc-50 flex-shrink-0 border border-black/[0.05] overflow-hidden">
                  {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />}
                </div>

                {/* Info do Produto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-[12px] font-black text-black uppercase tracking-tight truncate">{product.name}</h3>
                    <span className="text-[8px] font-bold text-zinc-400 border border-black/[0.05] px-2 py-0.5 bg-zinc-50 italic uppercase">{product.modelSigla || 'TSH'}</span>
                  </div>
                  <p className="text-[11px] font-serif text-zinc-500">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </p>
                </div>

                {/* Seleção de Tamanho (Botões Táteis em Linha) */}
                <div className="flex items-center gap-2">
                  {product.sizes.map((size) => (
                    <button 
                      key={size} 
                      onClick={() => addItem(product, size)}
                      className="w-14 h-14 flex items-center justify-center bg-zinc-50 border border-black/[0.05] text-[11px] font-black text-zinc-400 hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-black/[0.05] bg-zinc-50/50">
          <p className="text-[10px] font-black tracking-[0.4em] text-zinc-300 uppercase">Resumo da Arqueologia: Nenhum item disponível</p>
        </div>
      )}
    </div>
  );
}
