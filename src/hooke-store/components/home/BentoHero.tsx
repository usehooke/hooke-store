import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/productService";

export default async function BentoHero() {
  const featuredProducts = await getFeaturedProducts(3);

  const mainProduct = featuredProducts[0];
  const secondaryProduct = featuredProducts[1];
  const tertiaryProduct = featuredProducts[2];

  if (!mainProduct) return null;

  return (
    <section className="w-full animate-in fade-in duration-700 mb-1">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1 h-auto md:h-[85vh]">

        {/* 1. HERO PRINCIPAL (Maior Destaque) */}
        <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-hooke-900 h-[600px] md:h-auto">
          <Image
            src={mainProduct.imageUrl}
            alt={mainProduct.name}
            fill
            priority
            className="object-cover object-top opacity-95 group-hover:scale-105 transition-transform duration-1000"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

          <div className="absolute bottom-10 left-6 md:bottom-16 md:left-12 text-white z-20 max-w-lg">
            <span className="inline-block mb-3 text-[10px] font-bold uppercase tracking-[0.2em] border border-white/30 px-2 py-1 backdrop-blur-sm">
              Destaque da Coleção
            </span>

            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4 leading-none">
              {mainProduct.name}
            </h1>

            <div className="flex items-center gap-6">
              <span className="text-lg font-medium text-gray-100">
                R$ {mainProduct.price.toFixed(2).replace('.', ',')}
              </span>
              <Link href={`/produto/${mainProduct.slug}`} className="group/link flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all">
                Comprar Agora <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. PRODUTO SECUNDÁRIO (Direita Cima) */}
        {secondaryProduct && (
          <div className="md:col-span-2 md:row-span-1 relative overflow-hidden group bg-gray-50 h-[400px] md:h-auto">
            <Image
              src={secondaryProduct.imageUrl}
              alt={secondaryProduct.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-10" />

            <div className="absolute bottom-8 left-8 md:top-12 md:left-12 z-20">
              <span className="text-hooke-900 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">
                Best Seller
              </span>
              <h3 className="text-2xl font-bold text-hooke-900 mb-4 leading-none tracking-tight max-w-[200px]">
                {secondaryProduct.name}
              </h3>
              <Link href={`/produto/${secondaryProduct.slug}`} className="inline-block bg-hooke-900 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-hooke-700 transition-colors">
                Ver Oferta
              </Link>
            </div>
          </div>
        )}

        {/* 3. PRODUTO TERCIÁRIO (Direita Baixo) */}
        {tertiaryProduct && (
          <div className="md:col-span-2 md:row-span-1 relative overflow-hidden group bg-black h-[400px] md:h-auto">
            <Image
              src={tertiaryProduct.imageUrl}
              alt={tertiaryProduct.name}
              fill
              className="object-cover object-center opacity-80 group-hover:opacity-100 transition-all duration-1000"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/20 z-10" />

            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 text-white">
              <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
                {tertiaryProduct.name}
              </h3>
              <Link href={`/produto/${tertiaryProduct.slug}`} className="text-[10px] font-bold uppercase tracking-widest border-b border-white/50 pb-0.5 hover:border-white transition-colors">
                Descobrir
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}