import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Product } from "@/types";
import { usePDVStore } from "@/store/pdv-store";
import { useState } from "react";
import { Search, Loader2, Camera, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function PDVProductGrid() {
  const addItem = usePDVStore(state => state.addItem);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Controls: Scanner & Search */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
            <Camera size={16} />
            Scan QR Code
          </button>
          <button className="w-14 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="PRODUTO OU SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-[10px] text-white font-bold focus:bg-white/10 focus:border-white/20 transition-all outline-none placeholder:text-zinc-600 uppercase tracking-widest"
          />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
        </div>
      </div>

      {/* Categorias (Fitas horizontais compactas) */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "flex-shrink-0 px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all",
              selectedCategory === cat
                ? "bg-white text-black border-white"
                : "bg-transparent text-zinc-500 border-white/5 hover:border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Produtos de Alta Densidade */}
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group relative bg-white/2 border border-white/5 p-2 hover:border-emerald-500/50 transition-all cursor-pointer"
                onClick={() => addItem(product, product.sizes[0] || 'G')}
              >
                <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden mb-3">
                  {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-emerald-400 text-[8px] font-black px-1.5 py-0.5 border border-emerald-500/20">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </div>
                </div>
                <div>
                  <h3 className="text-[9px] font-black text-white uppercase tracking-tighter truncate leading-tight mb-1">{product.name}</h3>
                  <div className="flex gap-1">
                    {product.sizes.slice(0, 3).map(s => (
                       <span key={s} className="text-[7px] text-zinc-600 font-bold">{s}</span>
                    ))}
                    {product.sizes.length > 3 && <span className="text-[7px] text-zinc-600 font-bold">...</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center border border-white/5 bg-white/2 mt-10">
            <p className="text-[8px] font-black tracking-[0.4em] text-zinc-600 uppercase italic">Catálogo Vazio</p>
          </div>
        )}
      </div>
    </div>
  );
}
  );
}
