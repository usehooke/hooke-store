"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";

export default function LookbookV171() {
  const images = {
    areia: "/lookbook/v1-7-1/areia.jpg",
    marrom: "/lookbook/v1-7-1/marrom.jpg",
    preta: "/lookbook/v1-7-1/preta.jpg",
    kombi: "/lookbook/v1-7-1/kombi.jpg",
    puff: "/lookbook/v1-7-1/puff.jpg",
  };

  return (
    <div className="bg-white min-h-screen font-sans text-black selection:bg-black selection:text-white pb-24">
      {/* 1. COVER - MINIMALIST HIGH-FASHION */}
      <section className="h-[100dvh] flex flex-col justify-between p-8 md:p-16">
        <div className="flex justify-between items-start pt-4">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase leading-none">hooke</h1>
            <p className="text-[10px] tracking-[0.5em] text-gray-400 pl-1 uppercase font-medium">Digital Catalog</p>
          </div>
          <p className="text-[10px] items-right text-right tracking-widest text-gray-400 font-bold uppercase">v1.7.1 <br/> Lot 03</p>
        </div>
        
        <div className="relative w-full aspect-[3/4] bg-neutral-50 overflow-hidden group">
          <Image 
            src={images.kombi}
            alt="Hooke Cover"
            fill
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            priority
          />
          {/* Badge flutuante minimalist */}
          <div className="absolute top-8 left-8 bg-white px-4 py-2 shadow-xl">
             <p className="text-[9px] font-black tracking-[0.4em] uppercase">Season 2026</p>
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-gray-100 pt-8">
          <div className="space-y-1">
            <p className="text-xs font-black tracking-[0.2em] uppercase">Curated Essentials</p>
            <p className="text-[10px] text-gray-400">Minimalism that speaks volume.</p>
          </div>
          <div className="animate-bounce p-2 border border-black/5 rounded-full">
            <MoveRight className="rotate-90 text-gray-300" size={16} strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* 2. WAFER SECTION - 3:4 DUALITY */}
      <section className="py-32 space-y-24 bg-[#FAFAFA]">
        <div className="px-8 md:px-16 space-y-6">
          <span className="text-[10px] font-bold tracking-[0.5em] text-gray-300 uppercase">Collection 01</span>
          <h2 className="text-5xl font-bold tracking-tighter uppercase italic leading-none">Lote Wafer</h2>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Explorando o relevo canelado &apos;Wafer Tex&apos;. Uma peça que equilibra estrutura, conforto e discrição.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4 h-full relative">
           {/* Imagem 1: Areia (Aspect 3:4) */}
           <div className="space-y-4">
              <div className="aspect-[3/4] relative overflow-hidden bg-neutral-200">
                <Image src={images.areia} alt="Wafer Areia" fill className="object-cover" />
              </div>
              <div className="px-4">
                <p className="text-[10px] font-black tracking-widest uppercase opacity-60">Color: Areia Natural</p>
                <p className="text-[9px] text-gray-400">Ref: W-SA-03</p>
              </div>
           </div>

           {/* Imagem 2: Black (Aspect 3:4) - Deslocado para look editorial */}
           <div className="space-y-4 mt-16 md:mt-24">
              <div className="aspect-[3/4] relative overflow-hidden bg-neutral-200 shadow-2xl">
                <Image src={images.preta} alt="Wafer Black" fill className="object-cover" />
              </div>
              <div className="px-4">
                <p className="text-[10px] font-black tracking-widest uppercase opacity-60">Color: Onyx Black</p>
                <p className="text-[9px] text-gray-400">Ref: W-BL-01</p>
              </div>
           </div>
        </div>

        {/* Detalhe Marrom Full Width but Proporcional */}
        <div className="px-4 md:px-16 pt-12">
            <div className="aspect-[3/4] md:aspect-[16/6] relative bg-neutral-200 overflow-hidden">
               <Image src={images.marrom} alt="Wafer Marrom Detail" fill className="object-cover" />
               <div className="absolute inset-0 bg-black/5" />
            </div>
            <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-8 border-t border-gray-200 pt-8">
               <div className="space-y-3">
                  <p className="text-[10px] font-black tracking-[0.5em] text-gray-300 uppercase">Details</p>
                  <p className="text-lg font-bold tracking-tighter uppercase">P M G GG</p>
               </div>
               <div className="max-w-[200px] text-[10px] text-gray-400 leading-relaxed pt-2">
                  <p>TECNOLOGIA WAFER TEX PREMIUM COMPOSICÃO 100% ALGODÃO EXTRA SOFT</p>
               </div>
            </div>
        </div>
      </section>

      {/* 3. RETRO KOMBI - DARK MODE MINIMALISM */}
      <section className="bg-black text-white py-32 space-y-24">
        <div className="px-8 md:px-16 text-right space-y-6 flex flex-col items-end">
          <span className="text-[10px] font-bold tracking-[0.5em] text-zinc-700 uppercase">Archive Series</span>
          <h2 className="text-5xl font-light tracking-[0.1em] uppercase leading-none">Retro <span className="font-bold border-b border-zinc-800 pb-1">Kombi</span></h2>
          <p className="text-sm text-zinc-500 max-w-sm text-right leading-relaxed">
            Uma homenagem à cultura vintage. Design minimalista com execução em alto relevo &apos;Puff Print&apos;.
          </p>
        </div>

        <div className="px-8 md:px-24">
           {/* Proporção 3:4 travada */}
           <div className="aspect-[3/4] relative bg-zinc-900 border border-white/5 shadow-inner">
             <Image src={images.kombi} alt="Retro Kombi Full" fill className="object-cover opacity-90" />
           </div>
        </div>

        <div className="px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square relative bg-zinc-900 border border-white/10 group overflow-hidden">
               <Image src={images.puff} alt="Puff detail" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-black tracking-widest uppercase">Technique: Puff Print</p>
                <div className="h-px w- full bg-zinc-800" />
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-widest">
                Tamanhos: P / M / G / GG <br/> 
                Cor: Deep Black <br/>
                Stock: Limited Batch
              </p>
              <button className="text-[10px] font-bold border border-white/20 px-6 py-2 uppercase hover:bg-white hover:text-black transition-colors tracking-widest">
                Contact for B2B
              </button>
            </div>
        </div>
      </section>

      {/* FOOTER / EXPORT BUTTON */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 print:hidden z-50">
        <button 
          onClick={() => window.print()}
          className="bg-zinc-900 text-white border border-white/10 px-10 py-4 rounded-full text-[10px] font-black tracking-[0.3em] flex items-center gap-4 shadow-black/80 shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase"
        >
          Exportar Catalogo
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; background: white !important; }
          .print\:hidden { display: none !important; }
          section { page-break-after: always; height: 100vh !important; display: block !important; overflow: hidden !important; }
          .bg-zinc-950, .bg-black { background-color: black !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}
