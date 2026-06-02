import { getProductsAdmin } from "@/lib/productServiceAdmin";
import GalleryCard from "@/components/shop/GalleryCard";
import CampaignBanner from "@/components/home/CampaignBanner";
import React from "react";
import { headers } from "next/headers";

/**
 * Hooke MVP - Modo Conversão Direta
 * Vitrine simplificada apenas com produtos e botão de compra.
 */
export default async function Home() {
  headers(); // Opt-out do static rendering para revalidar produtos em tempo real
  const allProducts = await getProductsAdmin();

  return (
    <main className="bg-white min-h-screen pb-24 md:pb-0">

      {/* Subtítulo Discreto (Sem duplicar o logo) */}
      <section className="pt-3 pb-3 px-4 md:px-8 lg:px-12 border-b border-zinc-100">
        <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase">
          Conforto Premium · Preço Justo de Fábrica
        </p>
      </section>

      {/* Banner de Campanha Grayscale Hover */}
      <CampaignBanner />

      {/* Grade de Produtos — Edge-to-Edge */}
      <section className="py-4 md:py-8 px-3 md:px-6 lg:px-10 w-full">
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
            {allProducts.map((product, index) => (
              <GalleryCard
                key={product.id}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <div className="border border-zinc-200 p-12 text-center">
            <p className="text-lg font-bold text-black uppercase">
              Estoque sendo atualizado.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
