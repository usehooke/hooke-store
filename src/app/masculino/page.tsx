import { getFilteredProducts } from "@/lib/productService";
import { ProductCard, FilterDrawer } from "@/features/catalog";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
 title: "Masculino | Hooke Elite",
 description: "O básico masculino elevado à perfeição. Camisetas Oversized, Heavy Cotton e Wafer.",
};


export default async function MasculinoPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const activeFilters = {
    department: "masculino",
    category: typeof params.category === 'string' ? params.category : undefined,
    size: typeof params.size === 'string' ? params.size : undefined,
    minPrice: typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined,
  };

  return (
    <div className="bg-white min-h-screen pb-20">

 {/* 1. CABEÇALHO (Full Width & Editorial) */}
 <div className="w-full px-6 md:px-12 pt-12 md:pt-24 pb-12">

 {/* Caminho (Breadcrumb) - Alinhado à esquerda */}
 <div className="flex items-center gap-2 text-[10px] tracking-widest text-hooke-400 mb-6 font-sans">
 <Link href="/" className="hover:text-hooke-900 transition-colors border-b border-transparent hover:border-hooke-900 pb-0.5">
 Home
 </Link>
 <ChevronRight size={10} />
 <span className="text-hooke-900 font-bold">Masculino</span>
 </div>

 <div className="flex flex-col md:flex-row justify-between items-end gap-8">
 <div className="max-w-2xl">
 {/* Título Impactante (Estilo Suíço) */}
 <h1 className="text-4xl md:text-6xl font-black text-hooke-900 tracking-tighter leading-[0.9] mb-6">
 Hooke<br /> Menswear
 </h1>

 {/* Descrição */}
 <p className="font-sans text-sm text-gray-500 leading-relaxed max-w-lg">
 O básico elevado à perfeição. Desenvolvido com Suedine 240g, Algodão Egípcio e Silhuetas Boxy.
 </p>
 </div>
 </div>
 </div>

  {/* 2. BARRA DE FERRAMENTAS (Static Shell) */}
  <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-t border-b border-gray-100">
  <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center">

   <Suspense fallback={<div className="h-4 text-xs bg-gray-50 w-20 animate-pulse" />}>
    <ProductCounter filters={activeFilters} />
   </Suspense>

   <FilterDrawer />
  </div>
  </div>

  {/* 3. GRADE DE PRODUTOS (Dynamic Hole for PPR) */}
  <div className="w-full px-6 md:px-12 py-12">
    <Suspense fallback={<ProductGridSkeleton />} key={JSON.stringify(activeFilters)}>
      <ProductGrid filters={activeFilters} />
    </Suspense>
  </div>

 {/* 4. BANNER FINAL (Rodapé da Categoria) */}
 <div className="w-full px-6 md:px-12 mt-12">
 <div className="bg-white border border-hooke-100 py-16 text-center">
 <h3 className="text-xl font-bold tracking-tight mb-2 text-hooke-900">
 Engineering Basics
 </h3>
 <p className="text-gray-500 text-xs mb-0 tracking-widest uppercase">
 Feito no Brasil com Algodão Sustentável Responsável
 </p>
 </div>
 </div>

  </div>
  );
}

// --- COMPONENTES AUXILIARES PARA PPR (DYNAMIC HOLES) ---

async function ProductCounter({ filters }: { filters: any }) {
  const products = await getFilteredProducts(filters);
  return (
    <span className="text-xs font-black tracking-[0.2em] text-hooke-500 font-sans uppercase">
      {products.length} Equipamentos
    </span>
  );
}

async function ProductGrid({ filters }: { filters: any }) {
  const products = await getFilteredProducts(filters);

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
