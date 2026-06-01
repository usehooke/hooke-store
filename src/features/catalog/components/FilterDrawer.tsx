"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { Size } from "@/types/enums";
import { ProductCategorySchema } from "@/lib/schemas";

const CATEGORIES = ProductCategorySchema.options;
const SIZES = Object.values(Size);

export function FilterDrawer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams?.get("category") || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(searchParams?.get("size") || null);
  const [minPrice, setMinPrice] = useState<string>(searchParams?.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams?.get("maxPrice") || "");

  // Sincroniza estado interno quando a URL muda (ex: botão limpar)
  useEffect(() => {
    setSelectedCategory(searchParams?.get("category") || null);
    setSelectedSize(searchParams?.get("size") || null);
    setMinPrice(searchParams?.get("minPrice") || "");
    setMaxPrice(searchParams?.get("maxPrice") || "");
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    
    if (selectedCategory) params.set("category", selectedCategory);
    else params.delete("category");
    
    if (selectedSize) params.set("size", selectedSize);
    else params.delete("size");
    
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSize(null);
    setMinPrice("");
    setMaxPrice("");
    router.push(window.location.pathname, { scroll: false });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 text-xs font-black tracking-[0.2em] text-hooke-900 hover:bg-black hover:text-white px-6 py-3 transition-all border-2 border-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
          <SlidersHorizontal size={14} />
          <span>Filtrar</span>
        </button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-white border-l-4 border-black">
        <SheetHeader className="p-8 border-b-4 border-black bg-zinc-50">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-3xl font-black uppercase tracking-tighter italic">
              Filtros <span className="opacity-20">Elite</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="p-8 space-y-10 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* CATEGORIAS */}
          <section>
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-4">
              Arsenal / Categoria
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                    selectedCategory === cat 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-black border-zinc-200 hover:border-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* TAMANHOS */}
          <section>
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-4">
              Geometria / Tamanho
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                  className={`h-12 flex items-center justify-center text-xs font-black border-2 transition-all ${
                    selectedSize === size 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-black border-zinc-200 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          {/* PREÇO */}
          <section>
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-4">
              Valor / Investimento
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Min R$</label>
                <input 
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full p-3 border-2 border-zinc-200 focus:border-black outline-none font-bold text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Max R$</label>
                <input 
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="999"
                  className="w-full p-3 border-2 border-zinc-200 focus:border-black outline-none font-bold text-sm"
                />
              </div>
            </div>
          </section>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 w-full p-8 bg-zinc-50 border-t-4 border-black grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="rounded-none border-2 border-zinc-300 font-black uppercase tracking-widest text-[10px] h-14"
          >
            Limpar
          </Button>
          <SheetClose asChild>
            <Button 
              onClick={applyFilters}
              className="rounded-none bg-black text-white border-2 border-black font-black uppercase tracking-widest text-[10px] h-14 hover:bg-zinc-800"
            >
              Aplicar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
