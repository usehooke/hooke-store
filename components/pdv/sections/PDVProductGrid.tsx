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
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Atalhos de Modelo (Padrão HQ) */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-1">
        {(Object.keys(MODEL_DICTIONARY) as ModelSigla[]).map((sigla) => (
          <button
            key={sigla}
            onClick={() => setSelectedModel(sigla === selectedModel ? "All" : sigla)}
            className={cn(
              "flex flex-col items-center justify-center p-6 border transition-all h-24",
              selectedModel === sigla 
                ? "bg-white text-black border-white" 
                : "bg-white/[0.02] text-zinc-500 border-white/[0.05] hover:border-white/10"
            )}
          >
            <span className="text-xl font-serif">{sigla}</span>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] mt-2 opacity-50">
                {MODEL_DICTIONARY[sigla]?.label?.split(' ')[0] || sigla}
            </span>
          </button>
        ))}
      </div>

      {/* Busca e Categorias */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="ARQUEOLOGIA DE PRODUTOS (NOME / SKU)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-4 pl-12 text-sm text-[#FAFAFA] font-light focus:border-white transition-all outline-none placeholder:text-zinc-700 uppercase tracking-widest"
          />
          <Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-700" />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap px-6 py-2 text-[9px] font-black uppercase tracking-widest border transition-all",
                selectedCategory === cat
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-transparent text-zinc-500 border-white/[0.05] hover:border-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Elite */}
      <div className="grid grid-cols-2 gap-px bg-white/[0.05] border border-white/[0.05]">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col bg-[#0D0D0D] p-6 hover:bg-[#111111] transition-colors"
          >
            {/* Tag de Modelo */}
            <div className="absolute top-6 left-6 z-10 bg-white/5 backdrop-blur-md border border-white/10 text-white text-[7px] font-black px-2 py-1 uppercase tracking-tighter italic">
              {product.modelSigla || (product.category === 'Oversized' ? 'OVE' : 'TSH')}
            </div>

            <div className="relative aspect-[3/4] bg-white/[0.02] mb-6 overflow-hidden">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              )}
            </div>
            
            <div className="flex flex-col flex-grow">
              <h3 className="text-xs font-bold text-[#FAFAFA] truncate uppercase tracking-tight mb-1">{product.name}</h3>
              <p className="text-[10px] font-mono text-zinc-500 mb-6 font-bold uppercase">R$ {product.price.toFixed(2)}</p>
              
              {/* Seleção de Tamanho Rápida */}
              <div className="mt-auto grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => addItem(product, size)}
                    className="bg-[#0D0D0D] py-3 text-[9px] font-black text-zinc-500 hover:bg-white hover:text-black transition-all uppercase"
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
