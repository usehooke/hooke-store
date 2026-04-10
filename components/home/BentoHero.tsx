"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BentoHero() {
  return (
    <section className="w-full mb-1">
      <div className="flex flex-col md:flex-row gap-1 h-auto md:h-[85vh]">

        {/* MASCULINO - ESQUERDA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="flex-1 relative group overflow-hidden bg-black h-[500px] md:h-auto"
        >
          <Image
            src="/produtos/HK_ELITE_HEAVY_BLACK_V2.png" 
            alt="Hooke Menswear"
            fill
            priority
            className="object-contain object-top opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-[length:3000ms] ease-out"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

          <div className="absolute bottom-12 left-8 md:bottom-16 md:left-12 text-white z-20 max-w-md">
            <span className="inline-block mb-3 text-[9px] font-bold tracking-[0.3em] uppercase border border-white/20 px-3 py-1 backdrop-blur-md">
              Coleção Origem
            </span>

            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-[-0.04em] mb-4 uppercase leading-[0.9]">
              Geometria <br /> <span className="text-hooke-400">Têxtil</span>
            </h1>

            <p className="text-gray-300 text-[10px] tracking-[0.3em] max-w-xs mb-8 leading-relaxed uppercase font-medium">
              O rigor da construção em 350g. Silhuetas arquitetônicas projetadas para a permanência.
            </p>

            <Link href="/masculino" className="group/link flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase bg-white text-black px-8 py-5 hover:bg-gray-200 transition-all w-max inline-flex">
              Explorar Engenharia <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* FEMININO - DIREITA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex-1 relative group overflow-hidden bg-[#b0b0b0] h-[500px] md:h-auto"
        >
          <Image
            src="/assets/femme/musas_001_forest_1.png" 
            alt="Hooke Womenswear - Musa 001"
            fill
            priority
            className="object-contain object-center opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[length:3000ms] ease-out"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

          <div className="absolute bottom-12 left-8 md:bottom-16 md:left-12 text-white z-20 max-w-md">
            <span className="inline-block mb-3 text-[9px] font-bold tracking-[0.4em] uppercase bg-white text-black px-4 py-1.5 font-black">
              LOTE 001 : ATIVO
            </span>

            <h1 className="text-3xl md:text-5xl font-heading font-black tracking-[-0.04em] mb-4 drop-shadow-lg uppercase leading-[0.9]">
              Lore V2: <br /> <span className="opacity-70">Densidade</span>
            </h1>

            <div className="inline-block border border-white/40 backdrop-blur-md text-white text-[9px] font-bold px-4 py-2 mb-6 tracking-[0.3em] uppercase">
              Reserva de Elite — Lote 001
            </div>

            <p className="text-white/80 text-[10px] tracking-[0.25em] max-w-xs mb-8 leading-relaxed uppercase font-medium drop-shadow-sm">
              A geometria do repouso em Viscose 230g. O feminino sob o prisma do rigor Hooke.
            </p>

            <Link href="/feminino" className="group/link flex items-center gap-4 text-[10px] font-black tracking-[0.4em] uppercase border-b border-white/50 pb-2 hover:text-white hover:border-white transition-all w-max inline-flex">
              ADQUIRIR LOTE 001 <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}