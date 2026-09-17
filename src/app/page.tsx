import { getProducts, getHeroBanners } from "@/lib/productServiceServer";
import GalleryCard from "@/components/shop/GalleryCard";
import VIPGreeting from "@/components/home/VIPGreeting";
import BentoHero from "@/components/home/BentoHero";
import BrandBento from "@/components/home/BrandBento";
import SocialFeed from "@/components/home/SocialFeed";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import React from "react";

export const metadata = {
  alternates: {
    canonical: "https://www.usehooke.com.br",
  },
};

export default async function Home() {
  const allProducts = await getProducts();
  const heroBanners = await getHeroBanners();

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hooke",
    "url": "https://www.usehooke.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.usehooke.com.br/colecao?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      
      {/* Mensagem reativa para membros VIP ou clientes recorrentes */}
      <VIPGreeting />

      <main className="bg-white min-h-screen pb-24 md:pb-0">


        {/* Subtítulo Discreto e Identidade Minimalista */}
        <section className="pt-3 pb-3 px-4 md:px-8 lg:px-12 border-b border-zinc-100 flex items-center justify-between">
          <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase">
            Conforto Premium · Preço Justo de Fábrica
          </p>
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-default font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">ESSENTIALS 2026</span>
          </div>
        </section>

        {/* Bento Hero Editorial - Divisão Masculino/Feminino */}
        <BentoHero banners={heroBanners} />

        {/* CTA Acima do Fold */}
        <div className="flex items-center justify-center gap-4 py-4 px-4 bg-hooke-900 text-white">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
            Nova coleção disponível
          </span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <a
            href="/colecao"
            className="text-[10px] font-black tracking-[0.3em] uppercase underline underline-offset-4 hover:no-underline transition-all"
          >
            Ver Catálogo Completo →
          </a>
        </div>

        {/* Grade de Produtos Principal */}
        <section className="py-16 px-3 md:px-6 lg:px-10 w-full border-t border-zinc-100 bg-[#FAF9F7]">
          <div className="text-center mb-12">
            <span className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-zinc-400 block mb-3">
              Catálogo Curado
            </span>
            <h1 className="text-3xl font-black text-hooke-900 tracking-tighter uppercase">
              Equipamento em Destaque
            </h1>
          </div>

          {allProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 max-w-[1920px] mx-auto">
              {allProducts.map((product, index) => (
                <GalleryCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="border border-zinc-200 p-12 text-center max-w-md mx-auto bg-white">
              <p className="text-sm font-bold text-black uppercase tracking-widest">
                Estoque sendo atualizado.
              </p>
            </div>
          )}
        </section>

        {/* Seção de Depoimentos */}
        <TestimonialsSection />

        {/* Diferenciais da Marca e Filosofia (BCI Cotton) imbutido perto do rodapé */}
        <BrandBento />

        {/* Carrossel de Social Proof do Instagram */}
        <SocialFeed />
      </main>
    </>
  );
}
