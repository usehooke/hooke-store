"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CampaignBanner() {
  return (
    <section className="w-full bg-white py-12 md:py-24 px-6 md:px-12 flex flex-col items-center">
      
      <div className="text-center mb-8">
        <span className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-zinc-400 block mb-3">
          Nova Cápsula
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-hooke-900 tracking-tighter uppercase">
          Raízes & Ferrugem
        </h2>
      </div>

      <div className="relative w-full max-w-5xl aspect-[4/5] md:aspect-[21/9] bg-zinc-100 overflow-hidden cursor-pointer group">
        <Link href="/colecao" className="block w-full h-full">
          <CldImage
            src="Copilot_20260602_113201_x8ks5n"
            alt="Campanha Ferrugem"
            fill
            className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-[2000ms] ease-out"
            sizes="(max-width: 768px) 100vw, 1024px"
          />
          {/* Overlay Escuro Minimalista */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-[2000ms] ease-out" />
          
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 flex items-center gap-4">
            <div className="bg-white text-black px-6 py-4 flex items-center gap-3 text-xs font-black tracking-widest uppercase transform group-hover:translate-x-2 transition-transform duration-500 shadow-xl">
              Descubra <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </div>

      <p className="mt-8 text-xs text-zinc-500 font-medium tracking-widest uppercase text-center max-w-md">
        A textura do tempo aplicada ao básico impecável.
      </p>
    </section>
  );
}
