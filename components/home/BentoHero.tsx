"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/data/catalogo";
import { getFeaturedProducts } from "@/lib/productService";
import { motion } from "framer-motion";

export default function BentoHero() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts(3).then(setFeaturedProducts);
  }, []);

  const mainProduct = featuredProducts[0];
  const secondaryProduct = featuredProducts[1];
  const tertiaryProduct = featuredProducts[2];

  if (!mainProduct) return null;

  return (
    <section className="w-full mb-1">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1 h-auto md:h-[85vh]">

        {/* 1. HERO PRINCIPAL */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-black h-[600px] md:h-auto"
        >
          <Image
            src={mainProduct.imageUrl}
            alt={mainProduct.name}
            fill
            priority
            className="object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-[length:2000ms] ease-out"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

          <div className="absolute bottom-10 left-6 md:bottom-16 md:left-12 text-white z-20 max-w-lg">
            <span className="inline-block mb-3 text-[9px] font-bold tracking-[0.3em] uppercase border border-white/20 px-3 py-1 backdrop-blur-md">
              Destaque Editorial
            </span>

            <h1 className="text-4xl md:text-6xl font-heading font-semibold leading-none mb-6">
              {mainProduct.name}
            </h1>

            <div className="flex items-center gap-8">
              <span className="text-xl font-light tracking-tight text-gray-200">
                R$ {mainProduct.price.toFixed(2).replace('.', ',')}
              </span>
              <Link href={`/produto/${mainProduct.slug}`} className="group/link flex items-center gap-3 text-[10px] font-medium tracking-[0.2em] uppercase border-b border-white/50 pb-2 hover:text-gray-300 hover:border-gray-300 transition-all">
                Shop Now <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 2. PRODUTO SECUNDÁRIO */}
        {secondaryProduct && (
          <div className="md:col-span-2 md:row-span-1 relative overflow-hidden group bg-hooke-paper h-[400px] md:h-auto border-l border-white/10">
            <Image
              src={secondaryProduct.imageUrl}
              alt={secondaryProduct.name}
              fill
              className="object-cover object-center transition-transform duration-[length:2s] group-hover:scale-105"
              priority
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />

            <div className="absolute bottom-8 left-8 md:top-12 md:left-12 z-20 text-white">
              <span className="text-white text-[9px] font-bold tracking-[0.4em] uppercase mb-3 block drop-shadow-md">
                Mais Vendidos
              </span>
              <h3 className="text-3xl font-heading font-medium text-white mb-6 leading-tight max-w-[240px] drop-shadow-lg">
                {secondaryProduct.name}
              </h3>
              <Link href={`/produto/${secondaryProduct.slug}`} className="inline-block bg-white text-hooke-900 px-8 py-4 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-500">
                Ver Coleção
              </Link>
            </div>
          </div>
        )}

        {/* 3. PRODUTO TERCIÁRIO */}
        {tertiaryProduct && (
          <div className="md:col-span-2 md:row-span-1 relative overflow-hidden group bg-black h-[400px] md:h-auto">
            <Image
              priority src={tertiaryProduct.imageUrl}
              alt={tertiaryProduct.name}
              fill
              className="object-cover object-center opacity-70 group-hover:opacity-95 transition-all duration-[length:2000ms] ease-out"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/30 z-10" />

            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 text-white">
              <h3 className="text-2xl font-heading font-light leading-tight mb-4">
                {tertiaryProduct.name}
              </h3>
              <Link href={`/produto/${tertiaryProduct.slug}`} className="text-[9px] font-bold tracking-[0.2em] uppercase border-b border-white/50 pb-1 hover:border-white transition-colors">
                Descobrir
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}