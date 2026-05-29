"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";

export default function BentoHero({ banners = [] }: { banners?: Product[] }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Acurar banners ativos por departamento
  const maleBanner = banners.find(p => p.department === "masculino");
  const femaleBanner = banners.find(p => p.department === "feminino");

  // Dados do Banner Masculino
  const maleImage = maleBanner?.heroImageUrl || maleBanner?.imageUrl || "/produtos/HK_ELITE_HEAVY_BLACK_V2.png";
  const maleTitle = maleBanner ? maleBanner.name : "Estrutura";
  const maleSubtitle = maleBanner ? "Atemporal" : "Atemporal";
  const maleDesc = maleBanner 
    ? (maleBanner.description?.slice(0, 110) + (maleBanner.description && maleBanner.description.length > 110 ? "..." : ""))
    : "Densidade pensada para o clima brasileiro. Peças em algodão premium que mantêm a forma e o frescor.";
  const maleLink = maleBanner ? `/produto/${maleBanner.slug || maleBanner.id}` : "/masculino";
  const maleLinkText = maleBanner ? "Adquirir Peça" : "Explorar Coleção";
  const maleTag = maleBanner ? "Destaque Curado" : "Coleção Origem";

  // Dados do Banner Feminino
  const femaleImage = femaleBanner?.heroImageUrl || femaleBanner?.imageUrl || "/assets/femme/musas_001_forest_fit.png";
  const femaleTitle = femaleBanner ? femaleBanner.name : "Lore V2: A Fluidez";
  const femaleDesc = femaleBanner 
    ? (femaleBanner.description?.slice(0, 110) + (femaleBanner.description && femaleBanner.description.length > 110 ? "..." : ""))
    : "Viscose selada de toque gelado. O equilíbrio perfeito entre estrutura e movimento sob o sol do país.";
  const femaleLink = femaleBanner ? `/produto/${femaleBanner.slug || femaleBanner.id}` : "/feminino";
  const femaleLinkText = femaleBanner ? "Adquirir Peça" : "ADQUIRIR LOTE 001";
  const femaleTag = femaleBanner ? "Destaque Curado" : "LOTE 001 : ATIVO";

  return (
    <section className="w-full mb-1">
      <div className="flex flex-col md:flex-row gap-1 h-auto md:h-[85vh]">

        {/* MASCULINO - ESQUERDA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="flex-1 relative group overflow-hidden bg-black h-[42vh] md:h-auto"
        >
          {maleImage && (
            <Image
              src={maleImage} 
              alt="Hooke Menswear"
              fill
              priority
              className="object-contain opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-[length:3000ms] ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

          <div className="absolute bottom-12 left-8 md:bottom-16 md:left-12 text-white z-20 max-w-md">
            <span className="inline-block mb-3 text-[9px] font-bold tracking-[0.3em] uppercase border border-white/20 px-3 py-1 backdrop-blur-md">
              {maleTag}
            </span>

            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-[-0.04em] mb-4 uppercase leading-[0.9]">
              {maleBanner ? (
                <>
                  {maleBanner.name.split(" ")[0]} <br />
                  <span className="text-hooke-400">{maleBanner.name.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                <>
                  Estrutura <br /> <span className="text-hooke-400">Atemporal</span>
                </>
              )}
            </h1>

            <p className="text-gray-300 text-[10px] tracking-[0.3em] max-w-xs mb-8 leading-relaxed uppercase font-medium">
              {maleDesc}
            </p>

            <Link href={maleLink} className="group/link flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase bg-white text-black px-8 py-5 hover:bg-gray-200 transition-all w-max inline-flex">
              {maleLinkText} <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* FEMININO - DIREITA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex-1 relative group overflow-hidden bg-[#b0b0b0] h-[42vh] md:h-auto"
        >
          {femaleImage && (
            <Image
              src={femaleImage} 
              alt="Hooke Womenswear"
              fill
              priority
              className="object-contain opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[length:3000ms] ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

          <div className="absolute bottom-12 left-8 md:bottom-16 md:left-12 text-white z-20 max-w-md">
            <span className="inline-block mb-3 text-[9px] font-bold tracking-[0.4em] uppercase bg-white text-black px-4 py-1.5 font-black">
              {femaleTag}
            </span>

            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-[-0.04em] mb-4 drop-shadow-lg uppercase leading-[0.9]">
              {femaleBanner ? (
                <>
                  {femaleBanner.name.split(" ")[0]} <br />
                  <span className="opacity-70">{femaleBanner.name.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                <>
                  Lore V2: <br /> <span className="opacity-70">A Fluidez</span>
                </>
              )}
            </h2>

            <p className="text-white/80 text-[10px] tracking-[0.25em] max-w-xs mb-8 leading-relaxed uppercase font-medium drop-shadow-sm">
              {femaleDesc}
            </p>

            <Link href={femaleLink} className="group/link flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase bg-white text-black px-8 py-5 hover:bg-gray-200 transition-all w-max inline-flex">
              {femaleLinkText} <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
