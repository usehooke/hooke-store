import { getProductsAdmin } from "@/lib/productServiceAdmin";
import GalleryCard from "@/components/shop/GalleryCard";
import React from "react";

export const revalidate = 3600; // Atualiza o cache no Edge a cada 1 hora (ou quando forçar via Painel Admin)

/**
 * Hooke MVP - Modo Conversão Direta
 * Vitrine simplificada apenas com produtos e botão de compra.
 */
export default async function Home() {
  const allProducts = await getProductsAdmin();

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
      <main className="bg-white min-h-screen pb-24 md:pb-0">

      {/* Subtítulo Discreto (Sem duplicar o logo) */}
      <section className="pt-3 pb-3 px-4 md:px-8 lg:px-12 border-b border-zinc-100">
        <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase">
          Conforto Premium · Preço Justo de Fábrica
        </p>
      </section>

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
    </>
  );
}
