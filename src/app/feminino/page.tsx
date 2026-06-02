import { getFilteredProductsAdmin } from "@/lib/productServiceAdmin";
import QuickFilters from "@/features/catalog/components/QuickFilters";
import GalleryCard from "@/components/shop/GalleryCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { getColorFamily } from "@/utils/colorMap";

export const metadata: Metadata = {
  title: "Feminino | Hooke",
  description: "O minimalismo da Hooke agora para elas. Estética crua, modelagem impecável e texturas densas.",
};

export default async function FemininoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  headers();
  const params = await searchParams;
  const activeFilters = {
    department: "feminino",
    category: typeof params.category === "string" ? params.category : undefined,
    size: typeof params.size === "string" ? params.size : undefined,
    color: typeof params.color === "string" ? params.color : undefined,
    minPrice: typeof params.minPrice === "string" ? Number(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined,
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* CABEÇALHO EDITORIAL */}
      <div className="w-full px-5 md:px-12 pt-6 md:pt-10 pb-10">
        <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-zinc-400 mb-6 uppercase font-black">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={9} />
          <span className="text-black">Feminino</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[9px] font-black tracking-[0.4em] text-zinc-400 uppercase block mb-3">
              HOOKE WOMENSWEAR
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none uppercase">
              Essencial<br />
              <span className="font-light opacity-30">Feminino</span>
            </h1>
          </div>
          <p className="text-[11px] tracking-[0.1em] text-zinc-500 max-w-xs font-medium leading-relaxed uppercase md:text-right">
            Raw. Amplo. Essencial. Toque para comprar sem sair da vitrine.
          </p>
        </div>
      </div>

      {/* BARRA DE FERRAMENTAS STICKY */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-t border-b border-black/10">
        <div className="w-full px-5 md:px-12 py-3 flex justify-between items-center">
          <Suspense fallback={<div className="h-4 w-24 bg-zinc-100 animate-pulse" />}>
            <ProductCounter filters={activeFilters} />
          </Suspense>
          <Suspense fallback={<div className="h-10 w-24 bg-gray-200 animate-pulse"></div>}>
            <QuickFiltersWrapper baseFilters={{ department: "feminino", category: activeFilters.category }} />
          </Suspense>
        </div>
      </div>

      {/* GRADE DE PRODUTOS */}
      <div className="w-full px-5 md:px-12 py-10">
        <Suspense fallback={<ProductGridSkeleton />} key={JSON.stringify(activeFilters)}>
          <ProductGrid filters={activeFilters} />
        </Suspense>
      </div>

      {/* RODAPÉ EDITORIAL */}
      <div className="w-full px-5 md:px-12 mt-4">
        <div className="border-2 border-black/10 py-12 text-center">
          <p className="text-[9px] font-black tracking-[0.4em] uppercase text-zinc-400 mb-2">HOOKE · NOVO PADRÃO FEMININO</p>
          <h3 className="text-xl font-black uppercase tracking-tighter text-black">Minimalismo que respira.</h3>
        </div>
      </div>
    </div>
  );
}

async function ProductCounter({ filters }: { filters: any }) {
  const products = await getFilteredProductsAdmin(filters);
  return (
    <span className="text-[9px] font-black tracking-[0.3em] text-zinc-400 uppercase">
      {products.length} {products.length === 1 ? "peça" : "peças"}
    </span>
  );
}

async function QuickFiltersWrapper({ baseFilters }: { baseFilters: any }) {
  const allProducts = await getFilteredProductsAdmin(baseFilters);
  const colorsSet = new Set<string>();
  allProducts.forEach(p => {
    if (p.color) colorsSet.add(getColorFamily(p.color));
  });
  const dynamicColors = Array.from(colorsSet).sort();
  
  return <QuickFilters availableColors={dynamicColors} />;
}

async function ProductGrid({ filters }: { filters: any }) {
  const products = await getFilteredProductsAdmin(filters);

  if (products.length === 0) {
    return (
      <div className="py-24 border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-center">
        <p className="text-[9px] font-black tracking-[0.4em] text-zinc-300 uppercase mb-3">Inventário em Recalibração</p>
        <p className="text-xs text-zinc-400 max-w-xs">O próximo drop feminino está a caminho.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-20">
      {products.map((product, index) => (
        <GalleryCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="aspect-[2/3] bg-zinc-100 animate-pulse" />
      ))}
    </div>
  );
}
