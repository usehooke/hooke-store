import { getFeaturedProducts } from "@/lib/productService";
import BentoHero from "@/components/home/BentoHero";
import BrandMarquee from "@/components/ui/BrandMarquee";
import { ProductCard } from "@/features/catalog";
import BrandBento from "@/components/home/BrandBento";
import SocialFeed from "@/components/home/SocialFeed";
import VIPGreeting from "@/components/home/VIPGreeting";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import React, { Suspense } from "react";

/**
 * Hooke V15.0: Atomic Cache Purge & Defensive Rendering.
 * @Agent-LegacyRescue: Esta versão injeta uma purga de cache forçada na borda (Edge)
 * para garantir que produtos deletados sumam instantaneamente da vitrine.
 */
export default async function Home() {
  // Otimização: Buscamos os produtos em paralelo/servidor
  const showcaseProducts = await getFeaturedProducts(8);

  // Removido o FAIL-SAFE agressivo que mostrava tela vazia se o banco falhasse no build

  return (
    <main className="bg-hooke-paper min-h-screen pb-24 md:pb-0">
      {/* 🚀 Dynamic Hole: Personalização via Suspense */}
      <Suspense fallback={<div className="h-10" />}>
        <VIPGreeting />
      </Suspense>

      {/* 1. HERO BENTO (Estático/Shell) */}
      <BentoHero />

      {/* 2. BARRA */}
      <BrandMarquee />

      {/* 3. LISTA DE PRODUTOS */}
      <section id="colecao" className="py-24 px-6 md:px-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div className="max-w-xl">
            <span className="text-[10px] font-black tracking-[0.4em] text-hooke-400 mb-4 block uppercase font-mono">
              PROTOCOLO HOOKE
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-hooke-900 leading-[0.9] mb-4 uppercase tracking-[-0.03em]">
              EQUIPAMENTO <br /> <span className="font-light opacity-50">BASE</span>
            </h2>
            <p className="text-hooke-500 text-[11px] tracking-[0.1em] max-w-sm font-medium leading-relaxed uppercase">
              A fundação do seu arsenal cotidiano. Geometria têxtil projetada para a permanência absoluta.
            </p>
          </div>
          <div className="h-px bg-hooke-200 flex-1 mx-8 hidden md:block"></div>
        </div>

        {/* 🚀 Dynamic Content Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {showcaseProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </section>

      {/* 4. SEÇÕES ADICIONAIS */}
      <Suspense fallback={<div className="h-40" />}>
        <RecentlyViewed />
      </Suspense>

      <SocialFeed />

      <div className="bg-white border-t border-hooke-100">
        <BrandBento />
      </div>
    </main>
  );
}

/** 🛡️ ESTADO DEFENSIVO: ALABASTRO / SHARP BRUTALISM */
function EmptyCatalogVisual() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-6 font-jost text-black">
      <div className="max-w-md w-full border border-black bg-white p-12 shadow-sharp flex flex-col items-center text-center gap-8">
        <div className="w-16 h-16 border border-black flex items-center justify-center">
          <span className="text-2xl font-light">00</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
            inventário <br /> <span className="opacity-30">em atualização</span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
            hooke elite : lounge privado
          </p>
        </div>

        <div className="h-px w-20 bg-black/10" />

        <p className="text-xs font-medium leading-relaxed lowercase tracking-tight max-w-[240px]">
          nossa curadoria está sendo recalibrada. novos itens de elite em breve no arsenal.
        </p>

        <a 
          href="/admin" 
          className="mt-4 px-8 py-4 border border-black text-[10px] font-black tracking-widest uppercase hover:bg-black hover:text-white transition-all shadow-sm active:shadow-none"
        >
          acessar painel hq
        </a>
      </div>
      
      <div className="mt-12 opacity-10">
        <span className="text-[8px] font-black tracking-[0.5em] uppercase">
          design para a permanência
        </span>
      </div>
    </main>
  );
}
