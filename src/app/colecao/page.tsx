import { getFilteredProductsAdmin } from "@/lib/productServiceAdmin";
import { ProductCard } from "@/features/catalog";
import QuickFilters from "@/features/catalog/components/QuickFilters";
import React, { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { getColorFamily } from "@/utils/colorMap";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
 title: "Coleção Completa | Hooke",
 description: "Descubra a coleção completa de camisetas oversized, regatas e kits premium.",
};


export default async function CollectionPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  headers();
  const params = await searchParams;
  const activeFilters = {
    category: typeof params.category === 'string' ? params.category : undefined,
    size: typeof params.size === 'string' ? params.size : undefined,
    color: typeof params.color === 'string' ? params.color : undefined,
    minPrice: typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined,
  };

  return (
 <div className="bg-white min-h-screen pb-20">

 {/* 1. CABEÇALHO (Full Width & Editorial) */}
 <div className="w-full px-6 md:px-12 pt-6 md:pt-10 pb-10">

 {/* Caminho (Breadcrumb) - Alinhado à esquerda */}
 <div className="flex items-center gap-2 text-[10px] tracking-widest text-hooke-400 mb-6 font-sans">
 <Link href="/" className="hover:text-hooke-900 transition-colors border-b border-transparent hover:border-hooke-900 pb-0.5">
 Home
 </Link>
 <ChevronRight size={10} />
 <span className="text-hooke-900 font-bold">Shop</span>
 </div>

 <div className="flex flex-col md:flex-row justify-between items-end gap-8">
 <div className="max-w-2xl">
 {/* Título Impactante (Estilo Suíço) */}
 <h1 className="text-4xl md:text-6xl font-black text-hooke-900 tracking-tighter leading-[0.9] mb-6">
 Coleção <br /> Essencial
 </h1>

 {/* Descrição */}
 <p className="font-sans text-sm text-gray-500 leading-relaxed max-w-lg">
 O básico elevado à perfeição. Camisetas desenvolvidas com Suedine 240g, Algodão Egípcio sustentável e modelagem que valoriza o corpo masculino sem esforço.
 </p>
 </div>
 </div>
 </div>

 {/* 2. BARRA DE FERRAMENTAS (Sticky & Sharp) */}
 <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-t border-b border-gray-100">
 <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center">

   <Suspense fallback={<div className="h-4 text-xs bg-gray-50 w-20 animate-pulse" />}>
    <ProductCounter filters={activeFilters} />
   </Suspense>

          <Suspense fallback={<div className="h-10 w-24 bg-gray-200 animate-pulse"></div>}>
            <QuickFiltersWrapper baseFilters={{ category: activeFilters.category }} />
          </Suspense>
 </div>
 </div>

  <div className="w-full px-6 md:px-12 py-12">
    <Suspense fallback={<ProductGridSkeleton />} key={JSON.stringify(activeFilters)}>
      <ProductGrid filters={activeFilters} />
    </Suspense>
  </div>

 {/* 4. BANNER FINAL (Rodapé da Categoria) */}
 <div className="w-full px-6 md:px-12 mt-12">
 <div className="bg-white border border-hooke-100 py-16 text-center">
 <h3 className="text-xl font-bold tracking-tight mb-2 text-hooke-900">
 Qualidade Garantida
 </h3>
 <p className="text-gray-500 text-xs mb-0 tracking-widest">
 Feito no Brasil com Algodão Egípcio Certificado
 </p>
 </div>
 </div>

 </div>
 );
}
async function ProductCounter({ filters }: { filters: any }) {
  const products = await getFilteredProductsAdmin(filters);
  return (
    <span className="text-xs font-black tracking-[0.2em] text-hooke-500 font-sans uppercase">
      {products.length} Equipamentos
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
      <div className="py-24 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-black tracking-[0.4em] text-zinc-300 uppercase mb-4">
          Nenhum resultado encontrado
        </span>
        <p className="text-xs text-zinc-400 max-w-xs">
          Tente ajustar seus filtros ou limpar a seleção para ver o arsenal completo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 animate-in fade-in duration-1000 slide-in-from-bottom-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="aspect-[4/5] bg-gray-50 animate-pulse" />
      ))}
    </div>
  );
}
