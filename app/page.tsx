import { getFeaturedProducts } from "@/lib/productService";
import BentoHero from "@/components/home/BentoHero";
import BrandMarquee from "@/components/ui/BrandMarquee";
import ProductCard from "@/components/shop/ProductCard";
import BrandBento from "@/components/home/BrandBento";
import SocialFeed from "@/components/home/SocialFeed";
import VIPGreeting from "@/components/home/VIPGreeting";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import React, { Suspense } from "react";

/**
 * Hooke V3: Home Page Otimizada com PPR.
 * A casca (Hero, Marquee) é servida instantaneamente do cache estático.
 * A lista de produtos e o saudoso VIP são carregados de forma asíncrona (Dynamic).
 */
export default async function Home() {
  // Otimização: Buscamos os produtos em paralelo/servidor
  const showcaseProducts = await getFeaturedProducts(8);

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
          {showcaseProducts.map(product => (
            <ProductCard key={product.id} product={product} />
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