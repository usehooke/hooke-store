import { getProductsAdmin, getHeroBannersAdmin } from "@/lib/productServiceAdmin";
import BentoHero from "@/components/home/BentoHero";
import BrandMarquee from "@/components/ui/BrandMarquee";
import BrandBento from "@/components/home/BrandBento";
import SocialFeed from "@/components/home/SocialFeed";
import VIPGreeting from "@/components/home/VIPGreeting";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import GalleryCard from "@/components/shop/GalleryCard";
import React, { Suspense } from "react";
import { headers } from "next/headers";

/**
 * Hooke V16.0: Gallery-CRO Home
 * "Obra de Arte Comprável" — todos os produtos ativos exibidos como exposição editorial.
 * GalleryCard permite compra em 1 toque sem sair da vitrine.
 */
export default async function Home() {
  headers(); // Opt-out do static rendering para revalidar produtos em tempo real
  const allProducts = await getProductsAdmin();
  const heroBanners = await getHeroBannersAdmin();

  return (
    <main className="bg-hooke-paper min-h-screen pb-24 md:pb-0">
      {/* Personalização via Suspense */}
      <Suspense fallback={<div className="h-10" />}>
        <VIPGreeting />
      </Suspense>

      {/* 1. HERO */}
      <BentoHero banners={heroBanners} />

      {/* 2. BARRA */}
      <BrandMarquee />

      {/* 2.5 BANNER PROMOÇÃO KIT */}
      <section className="w-full px-5 md:px-12 lg:px-20 py-6">
        <div className="border-2 border-black bg-black text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-[9px] font-black tracking-[0.4em] text-zinc-400 uppercase">Oferta Exclusiva</span>
            <p className="text-lg md:text-xl font-black tracking-tight uppercase">
              LEVE 3 PEÇAS POR <span className="text-emerald-400">R$ 199,90</span>
            </p>
            <span className="text-[10px] text-zinc-400 tracking-wider">ou 5 peças por R$ 299,90 · Desconto automático no carrinho</span>
          </div>
          <a href="#colecao" className="text-[10px] font-black tracking-[0.3em] uppercase bg-white text-black px-8 py-4 hover:bg-zinc-200 transition-all inline-flex items-center gap-2 whitespace-nowrap">
            Montar Kit →
          </a>
        </div>
      </section>
      <section id="colecao" className="py-20 px-5 md:px-12 lg:px-20 w-full">

        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div>
            <span className="text-[9px] font-black tracking-[0.4em] text-zinc-400 block mb-3 uppercase">
              PROTOCOLO HOOKE · {allProducts.length} PEÇAS
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-black leading-none uppercase tracking-tighter">
              EQUIPAMENTO <br />
              <span className="font-light opacity-40">BASE</span>
            </h2>
          </div>
          <p className="text-[11px] tracking-[0.1em] text-zinc-500 max-w-xs font-medium leading-relaxed uppercase md:text-right">
            Toque na peça para escolher o tamanho e adicionar ao carrinho — sem sair da vitrine.
          </p>
        </div>

        {/* GRID GALERIA */}
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-20">
            {allProducts.map((product, index) => (
              <GalleryCard
                key={product.id}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-black/10 p-16 flex flex-col items-center text-center gap-4">
            <p className="text-[9px] font-black tracking-[0.4em] uppercase text-zinc-400">
              INVENTÁRIO EM CALIBRAÇÃO
            </p>
            <p className="text-2xl font-black uppercase tracking-tighter text-black">
              Novos drops em breve.
            </p>
          </div>
        )}
      </section>

      {/* 4. SEÇÕES EDITORIAIS */}
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
