"use client";

import { getFeaturedProducts } from "@/lib/productService";
import { useEffect, useState } from "react";
import { Product } from "@/data/catalogo";

import BentoHero from "@/components/home/BentoHero";
import BrandMarquee from "@/components/ui/BrandMarquee";
import ProductCard from "@/components/shop/ProductCard";
import BrandBento from "@/components/home/BrandBento";
import SocialFeed from "@/components/home/SocialFeed";
import VIPGreeting from "@/components/home/VIPGreeting";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import { motion } from "framer-motion";

export default function Home() {
  const [showcaseProducts, setShowcaseProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts(8).then(setShowcaseProducts);
  }, []);

  return (
    <main className="bg-hooke-paper min-h-screen">
      <VIPGreeting />

      {/* 1. HERO BENTO */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <BentoHero />
      </motion.section>

      {/* 2. BARRA */}
      <BrandMarquee />

      {/* 3. LISTA DE PRODUTOS */}
      <section id="colecao" className="py-24 px-6 md:px-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4"
        >
          <div className="max-w-xl">
            <span className="text-[10px] font-bold tracking-[0.3em] text-hooke-400 mb-4 block">
              Curadoria Hooke
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-light text-hooke-900 leading-[1.1] mb-2">
              Coleção <span className="font-semibold tracking-tighter">Essencial</span>
            </h2>
            <p className="text-hooke-500 text-sm max-w-sm font-medium leading-relaxed">
              Peças fundamentais desenhadas para durar. Minimalismo elevado através de tecidos nobres.
            </p>
          </div>
          <div className="h-px bg-hooke-200 flex-1 mx-8 hidden md:block"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {showcaseProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SEÇÕES ADICIONAIS COM REVEAL */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <RecentlyViewed />
      </motion.div>

      <SocialFeed />

      <div className="bg-white border-t border-hooke-100">
        <BrandBento />
      </div>
    </main>
  );
}