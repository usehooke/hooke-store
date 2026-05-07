import React from 'react';
import Image from 'next/image';

const RetroFuscaHero = () => {
  return (
    <section className="relative min-h-screen bg-hooke-paper flex items-center overflow-hidden py-12 md:py-24 px-6 lg:px-12 border-b border-black/5">
      
      {/* GRID EDITORIAL ESTILO SSENSE (3 COLUNAS NO DESKTOP) */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 items-start relative z-10 w-full">
        
        {/* COLUNA 1: METADATA E DETALHES TECNICOS (LEFT) */}
        <div className="hidden md:flex md:col-span-2 flex-col space-y-16 pt-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-black/40">Ref. Sku</span>
            <p className="text-[11px] font-medium text-black">HK_FUSCA72_AREIA_01</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] tracking-widest text-black/30 font-bold">Material</span>
              <p className="text-xs font-light text-black">Heavy Cotton 280g</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] tracking-widest text-black/30 font-bold">Finish</span>
              <p className="text-xs font-light text-black">Textura Flocada</p>
            </div>
          </div>

          <div className="pt-24 opacity-10">
            <span className="text-4xl font-heading font-black rotate-90 origin-left inline-block tracking-tighter">
              hooke elite
            </span>
          </div>
        </div>

        {/* COLUNA 2: HERO PRODUCT (CENTER) */}
        <div className="col-span-1 md:col-span-7 relative flex justify-center items-center">
          <div className="relative w-full aspect-[4/5] bg-hooke-paper group overflow-hidden border border-black/5">
            {/* Overlay para marca d'agua interna sutil */}
            <div className="absolute top-6 left-6 z-20 opacity-20 group-hover:opacity-10 transition-opacity">
              <span className="text-[8px] tracking-[0.4em] font-bold uppercase">Heritage Photography</span>
            </div>

            <div className="relative w-full h-full p-4 md:p-8">
              <Image
                src="/produtos/hk_prod_vi_fusca_areia_01.png"
                alt="Fotografia de estúdio da Camiseta Hooke Retro Beetle Sandstone - Estética SSENSE"
                fill
                className="object-contain mix-blend-multiply transition-all duration-[length:1.5s] scale-[0.95] group-hover:scale-100"
                priority
              />
            </div>

            <div className="absolute bottom-6 right-6 z-20 opacity-30">
              <span className="text-[8px] tracking-[0.1em] font-light italic">hk_std. v_2026</span>
            </div>
          </div>
        </div>

        {/* COLUNA 3: INFO, PREÇO E AÇÃO (RIGHT) */}
        <div className="col-span-1 md:col-span-3 flex flex-col justify-between h-full space-y-12 md:space-y-0 md:min-h-[70vh] py-4">
          
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.3em] font-bold text-hooke-400">Drop Vintage // Beetle</span>
              <h1 className="text-5xl md:text-7xl font-heading font-black leading-[0.85] text-black tracking-tighter mb-4">
                Retro<br />
                Beetle
              </h1>
              <p className="text-sm font-medium text-black leading-tight max-w-[240px]">
                Areia Areia Areia Areia Areia Areia
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/10">
              <p className="text-[11px] text-hooke-500 font-light leading-relaxed max-w-[280px]">
                O ponto de encontro entre o minimalismo contemporâneo e a nostalgia automotiva. 
                Cor Sandstone exclusiva Hooke.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="text-3xl font-jost font-medium text-black tracking-tighter">BRL 179.90</span>
              <span className="text-[9px] text-black/40 tracking-widest mt-1">Free Shipping across Brazil</span>
            </div>

            <button className="w-full bg-black text-white text-[10px] font-bold tracking-[0.2em] py-6 transition-all hover:bg-zinc-800 border-[1px] border-black">
              Reservar Drop
            </button>
            
            <p className="text-[9px] text-center text-black/50 font-medium tracking-tight">
              Apenas 72 unidades disponíveis para este lote.
            </p>
          </div>

        </div>

      </div>

      {/* Marca lateral Vertical - Marca d'água Hooke Elite Style */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 hidden 2xl:block opacity-5 pointer-events-none">
        <span className="text-[12rem] font-heading font-black tracking-tighter mix-blend-difference lowercase">
          hooke elite
        </span>
      </div>
    </section>
  );
};

export default RetroFuscaHero;
