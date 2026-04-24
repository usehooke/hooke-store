import Image from "next/image";
import { CheckCircle2, TrendingUp, DollarSign } from "lucide-react";
import ConditionalTracking from "@/components/layout/ConditionalTracking";

export const metadata = {
  title: "Hooke Drop 01/26 - Earth & Moss Edition",
  description: "Catálogo Exclusivo B2B - Wafer Tex 320g",
  robots: { index: false, follow: false },
};

export default function CatalogoB2BPage() {
  const whatsappNumber = "5511975902528";
  const wppMessage = encodeURIComponent("Olá! Recebi o Catálogo B2B Hooke Drop 01/26. QUERO RESERVAR MINHA GRADE do Conjunto Wafer Tex.");
  const wppLink = `https://wa.me/${whatsappNumber}?text=${wppMessage}`;

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-[#4B5320] selection:text-white pb-0">
      <div className="hidden"><ConditionalTracking /></div>
      
      {/* CAPA (PDF Page 1 Equivalent) */}
      <section className="relative w-full h-[100svh] flex flex-col justify-end p-6 md:p-12 overflow-hidden border-b-8 border-[#4A3728]">
        <div className="absolute inset-0 z-0">
           <Image
            src="/sobre.jpg"
            alt="Fernando / Hooke Vision"
            fill
            className="object-cover object-top opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full mb-10">
          <div className="inline-block border border-neutral-600 bg-black/50 px-4 py-1 rounded-none mb-6">
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">
              Uso Exclusivo B2B — Catálogo Lojistas
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white drop-shadow-lg mb-6">
            Hooke <br/> Drop 01/26
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-[#4B5320] mb-4 uppercase tracking-wide">
            Earth & Moss Edition
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl font-medium border-l-2 border-[#4A3728] pl-4">
            O caimento mestre da Hooke agora em tons terrosos. Edição limitada para varejistas selecionados.
          </p>
        </div>
      </section>

      {/* PROPOSTA DE VALOR (PDF Page 2 Equivalent) */}
      <section className="bg-neutral-950 py-24 px-6 md:px-12 w-full flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
            Sua loja precisa de diferencial, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A3728] to-[#4B5320]">não de preço.</span>
          </h3>
          <p className="text-xl text-neutral-400 leading-relaxed font-medium mb-16">
            Apresentamos a tecnologia <strong className="text-white">Wafer Tex 320g</strong>. Uma gramatura suprema, estrutura tridimensional anti-amassado e tingimento resistente a mais de 100 lavagens. <br/><br/>
            <span className="text-[#4B5320] font-bold">O Toque que converte o cliente diretamente no provador.</span>
          </p>

          {/* Color Palette Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="flex flex-col items-center group">
              <div className="w-full aspect-video bg-[#000000] rounded-none mb-4 border border-neutral-800 shadow-2xl relative overflow-hidden flex items-center justify-center">
                 <span className="font-bold text-neutral-800 text-6xl opacity-20 group-hover:opacity-40 transition-opacity">01</span>
                 <Image src="/produtos/camiseta-oversized-preta-premium-hooke-1.avif" alt="Deep Black" fill className="object-cover opacity-80 mix-blend-lighten" />
              </div>
              <h4 className="font-black text-xl tracking-wide uppercase">Deep Black</h4>
              <p className="text-sm text-neutral-500 font-bold tracking-widest">O Eterno.</p>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-full aspect-video bg-[#4A3728] rounded-none mb-4 shadow-2xl relative overflow-hidden flex items-center justify-center border border-[#5c4431]">
                 <span className="font-bold text-[#2a1f16] text-6xl opacity-40 group-hover:opacity-80 transition-opacity">02</span>
                 <Image src="/produtos/testura-canelada-marrom-1.webp" alt="Earth Brown" fill className="object-cover opacity-60 mix-blend-overlay" />
              </div>
              <h4 className="font-black text-xl tracking-wide uppercase">Earth Brown</h4>
              <p className="text-sm text-[#4A3728] font-bold tracking-widest">Sofisticação.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-full aspect-video bg-[#4B5320] rounded-none mb-4 shadow-2xl relative overflow-hidden flex items-center justify-center border border-[#6b7530]">
                 <span className="font-bold text-[#20240d] text-6xl opacity-40 group-hover:opacity-80 transition-opacity">03</span>
                 <Image src="/produtos/Hooke-Regata-Canelada-Verde.avif" alt="Olive Moss" fill className="object-cover opacity-60 mix-blend-overlay" />
              </div>
              <h4 className="font-black text-xl tracking-wide uppercase">Olive Moss</h4>
              <p className="text-sm text-[#4B5320] font-bold tracking-widest">Tendência 2026.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARGEM DE LUCRO (PDF Page 3 Equivalent) */}
      <section className="py-24 px-6 md:px-12 w-full bg-black border-t border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 justify-center">
             <DollarSign className="w-10 h-10 text-green-500" />
             <h3 className="text-4xl font-black uppercase tracking-tight">Tabela Blindada B2B</h3>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <div className="space-y-6">
                <div className="flex flex-col border-b border-neutral-800 pb-4">
                  <span className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-1">Valor Varejo (DTC)</span>
                  <span className="text-3xl font-black line-through text-neutral-400">R$ 189,90</span>
                  <span className="text-xs text-neutral-500 mt-1">Preço tabelado e protegido em nosso e-commerce.</span>
                </div>

                <div className="flex flex-col border-b border-neutral-800 pb-4">
                  <span className="text-[#4B5320] font-bold uppercase tracking-widest text-xs mb-1">Custo Atacado Lojista</span>
                  <span className="text-5xl font-black text-white">R$ 129,90</span>
                  <span className="text-xs text-neutral-500 mt-1">Grade mínima exigida: 10 peças.</span>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-none p-6 flex flex-col justify-center items-center text-center h-full">
                <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
                <span className="text-green-500 font-bold uppercase tracking-widest text-sm mb-2">Seu Lucro Líquido Protegido</span>
                <span className="text-6xl font-black text-white">R$ 60,00</span>
                <span className="text-sm font-bold text-green-400 mt-2">Por peça vendida. Venda Rápida.</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-t from-[#1a140f] to-black py-20 px-6 border-t border-[#4A3728]/30 flex flex-col items-center">
        <h4 className="text-2xl font-black uppercase mb-8 text-center">O Lote Inicia com 300 Peças. Garanta seu volume.</h4>
        <a 
          href={wppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-sm flex items-center justify-center gap-3 bg-white text-black font-black text-xl py-5 rounded-none hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] group"
        >
          <CheckCircle2 className="w-6 h-6 group-hover:text-[#4B5320] transition-colors" />
          QUERO RESERVAR MINHA GRADE
        </a>
      </section>

    </div>
  );
}
