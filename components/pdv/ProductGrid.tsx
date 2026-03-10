"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Product } from "@/types";
import { usePDVStore } from "@/store/pdv-store";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { MODEL_DICTIONARY, ModelSigla } from "@/utils/sku-generator";

export default function PDVProductGrid() {
  const { addItem } = usePDVStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedModel, setSelectedModel] = useState<ModelSigla | "All">("All");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  const categories = ["All", ...new Set(products?.map((p) => p.category) || [])];

  const filteredProducts = products?.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    // Mock check: if model filter is on, we'd check against SKU prefix if it existed in data
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-hooke-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Shortcut Buttons (Large for Tablet) */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8">
        {(Object.keys(MODEL_DICTIONARY) as ModelSigla[]).map((sigla) => (
          <button
            key={sigla}
            onClick={() => setSelectedModel(sigla === selectedModel ? "All" : sigla)}
            className={`flex flex-col items-center justify-center p-4 transition-all ${
              selectedModel === sigla 
              ? "shadow-neumorph-inset bg-hooke-900 text-white" 
              : "shadow-neumorph bg-hooke-50 text-hooke-900"
            }`}
          >
            <span className="text-xl font-black">{sigla}</span>
            <span className="text-[8px] font-bold uppercase mt-1 opacity-70">
              {MODEL_DICTIONARY[sigla].label.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-hooke-50 p-4 pl-12 shadow-neumorph-inset outline-none focus:ring-0"
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hooke-500" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 text-[10px] font-bold transition-all uppercase ${
                selectedCategory === cat
                  ? "shadow-neumorph-inset text-hooke-900"
                  : "shadow-neumorph text-hooke-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredProducts?.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col bg-hooke-50 p-3 shadow-neumorph transition-transform active:scale-95"
          >
            {/* Model Tag Indicator */}
            <div className="absolute top-4 left-4 z-10 bg-black text-white text-[8px] font-black px-2 py-1">
              {product.category === 'Oversized' ? 'OVE' : 'TSH'}
            </div>

            <div className="relative aspect-square overflow-hidden mb-3 shadow-neumorph-inset">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col flex-grow">
              <h3 className="text-sm font-bold truncate mb-1">{product.name}</h3>
              <p className="text-xs text-hooke-500 mb-2">R$ {product.price.toFixed(2)}</p>
              
              {/* Quick Size Selection Overlay/Buttons */}
              <div className="mt-auto grid grid-cols-2 gap-1">
                {product.sizes.slice(0, 4).map((size) => (
                  <button
                    key={size}
                    onClick={() => addItem(product, size)}
                    className="bg-hooke-50 py-1 text-[10px] font-bold shadow-neumorph hover:shadow-neumorph-inset"
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
