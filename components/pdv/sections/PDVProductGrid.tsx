"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Product } from "@/types";
import { usePDVStore } from "@/store/pdv-store";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { MODEL_DICTIONARY, ModelSigla } from "@/utils/sku-generator";
import { cn } from "@/lib/utils";

export default function PDVProductGrid() {
  const addItem = usePDVStore(state => state.addItem);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedModel, setSelectedModel] = useState<ModelSigla | "All">("All");

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
    <div className="space-y-12">
      {/* SELEÇÃO DE CATEGORIA - ALTA VISIBILIDADE (McD STYLE) */}
      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "flex-shrink-0 px-10 py-6 text-xs font-black uppercase tracking-[0.2em] border transition-all flex flex-col items-center gap-2",
              selectedCategory === cat
                ? "bg-black text-white border-black shadow-xl scale-105"
                : "bg-white text-zinc-400 border-black/[0.05] hover:border-black/10"
            )}
          >
            {cat}
            <span className="w-4 h-[1px] bg-current opacity-30" />
          </button>
        ))}
      </div>

      {/* GRADE DE MODELOS - ATALHOS TÁTEIS */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        {(Object.keys(MODEL_DICTIONARY) as ModelSigla[]).map((sigla) => (
          <button
            key={sigla}
            onClick={() => setSelectedModel(sigla === selectedModel ? "All" : sigla)}
            className={cn(
              "flex flex-col items-center justify-center p-6 border transition-all h-28 group",
              selectedModel === sigla 
                ? "bg-zinc-100 text-black border-black" 
                : "bg-zinc-50 text-zinc-400 border-black/[0.03] hover:bg-white hover:border-black/5"
            )}
          >
            <span className="text-2xl font-serif group-hover:scale-110 transition-transform">{sigla}</span>
            <span className="text-[7px] font-bold uppercase tracking-[0.2em] mt-3 opacity-60">
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
          className="w-full bg-zinc-50 border border-black/[0.05] p-6 pl-16 text-xs text-zinc-900 font-bold focus:bg-white focus:border-black transition-all outline-none placeholder:text-zinc-300 uppercase tracking-widest"
        />
        <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-300" />
      </div>

      {/* GRADE DE PRODUTOS ELITE - VISUAL E TÁTIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col bg-white border border-black/[0.05] p-2 hover:border-black/10 hover:shadow-2xl hover:shadow-black/[0.02] transition-all"
          >
            <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-700"
                />
              )}
              {/* Modelo Sigla Overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-black/[0.05] text-black text-[8px] font-black px-3 py-1 uppercase tracking-tighter italic">
                {product.modelSigla || (product.category === 'Oversized' ? 'OVE' : 'TSH')}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-[11px] font-black text-black truncate uppercase tracking-tight mb-1">{product.name}</h3>
              <p className="text-xs font-serif text-zinc-500 mb-6">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </p>
              
              {/* SELEÇÃO DE TAMANHO MCD-STYLE (BOTÕES GRANDES) */}
              <div className="mt-auto grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => addItem(product, size)}
                    className="flex items-center justify-center h-12 bg-zinc-50 text-[10px] font-black text-zinc-400 hover:bg-black hover:text-white transition-all border border-black/[0.03]"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
