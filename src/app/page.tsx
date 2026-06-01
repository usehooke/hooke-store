import { getProductsAdmin } from "@/lib/productServiceAdmin";
import GalleryCard from "@/components/shop/GalleryCard";
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
      {/* Cabeçalho Minimalista da Loja */}
      <section className="py-8 px-5 md:px-12 lg:px-20 border-b border-zinc-200">
        <h1 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter">
          HOOKE STORE
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          Conforto Premium. Preço Justo de Fábrica.
        </p>
      </section>

      {/* Grade de Produtos */}
      <section className="py-12 px-5 md:px-12 lg:px-20 w-full max-w-7xl mx-auto">
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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
