"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const SIZES = ["Todos", "P", "M", "G", "GG"];

interface QuickFiltersProps {
  availableColors?: string[];
}

export default function QuickFilters({ availableColors = [] }: QuickFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSize = searchParams?.get("size") || "Todos";
  const currentColor = searchParams?.get("color") || "Todas";

  const FINAL_COLORS = ["Todas", ...availableColors.filter(c => c !== "Todas")];

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      if (value === "Todos" || value === "Todas") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="w-full bg-white border-b border-gray-100 py-3 sticky top-20 z-30">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col gap-3">
        
        {/* Tamanhos */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[9px] font-black tracking-widest uppercase text-gray-400 shrink-0">Tam</span>
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => router.push(`${pathname}?${createQueryString("size", size)}`, { scroll: false })}
              className={`shrink-0 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${
                currentSize === size
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-zinc-200 hover:border-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Cores */}
        {FINAL_COLORS.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[9px] font-black tracking-widest uppercase text-gray-400 shrink-0">Cor</span>
            {FINAL_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => router.push(`${pathname}?${createQueryString("color", color)}`, { scroll: false })}
              className={`shrink-0 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${
                currentColor === color
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-zinc-200 hover:border-black"
              }`}
            >
              {color}
            </button>
          ))}
          </div>
        )}

      </div>
    </div>
  );
}
