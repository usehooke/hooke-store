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

  // Busca o banner ativo (preferência masculino/geral)
  const mainBanner = banners.find(p => p.department === "masculino") || banners[0];

  const mainImage = mainBanner?.heroImageUrl || mainBanner?.imageUrl || "/produtos/HK_ELITE_HEAVY_BLACK_V2.png";
  const mainDesc = mainBanner 
    ? (mainBanner.description?.slice(0, 140) + (mainBanner.description && mainBanner.description.length > 140 ? "..." : ""))
    : "Densidade e estrutura pensadas para a permanência. Peças em malha heavyweight 260g de gola canelada atemporal.";
  const mainLink = mainBanner ? `/produto/${mainBanner.slug || mainBanner.id}` : "/masculino";
  const mainLinkText = mainBanner ? "Adquirir Peça" : "Explorar Catálogo";
  const mainTag = mainBanner ? "Destaque da Coleção" : "Essentials Collection // 2026";

  return (
    <section className="w-full mb-1">
      <div className="w-full h-[75vh] md:h-[85vh] relative overflow-hidden bg-black group">
        {mainImage && (
          <Image
            src={mainImage} 
            alt="Hooke Essentials"
            fill
            priority
            className="object-contain md:object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-[length:3000ms] ease-out"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

        <div className="absolute bottom-12 left-8 md:bottom-20 md:left-16 text-white z-20 max-w-xl">
          <span className="inline-block mb-4 text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase border border-white/20 px-4 py-1.5 backdrop-blur-md">
            {mainTag}
          </span>

          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-[-0.04em] mb-4 uppercase leading-[0.9]">
            {mainBanner ? (
              <>
                {mainBanner.name.split(" ")[0]} <br />
                <span className="text-hooke-400">{mainBanner.name.split(" ").slice(1).join(" ")}</span>
              </>
            ) : (
              <>
                Estrutura & <br /> <span className="text-hooke-400">Permanência</span>
              </>
            )}
          </h1>

          <p className="text-gray-300 text-[10px] md:text-xs tracking-[0.25em] max-w-md mb-8 leading-relaxed uppercase font-medium">
            {mainDesc}
          </p>

          <Link href={mainLink} className="group/link flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase bg-white text-black px-8 py-5 hover:bg-zinc-200 transition-all w-max inline-flex">
            {mainLinkText} <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
