"use client";

import Image from "next/image";
import Link from "next/link";
import { Shirt, Wind, Ruler, ShieldCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { Product } from "@/data/catalogo";

interface LaunchTemplateProps {
  product: Product;
}

export default function LaunchTemplate({ product }: LaunchTemplateProps) {

  useEffect(() => {
    // Scroll handling placeholder if needed in future
  }, []);

  // Formatador de Moeda
  const formatarMoeda = (valor: number) => 
    valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00';

  // Mapeamento de Imagens do Gemini Gem:
  // 0: Full Body, 1: Mid Shot, 2: Back Shot, 3: Macro, 4: Hero Banner
  const images = product.images || [];
  const heroImage = images[4] || images[0] || product.imageUrl;
  const fullBodyImage = images[0] || product.imageUrl;
  const midShotImage = images[1] || product.imageUrl;
  const backShotImage = images[2] || product.imageUrl;
  const macroImage = images[3] || product.imageUrl;

  return (
    <div className="bg-[#f9f9f9] text-[#1a1a1a] font-outfit antialiased overflow-x-hidden pt-12 md:pt-0">
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-zinc-100 mb-20 lg:mb-32">
        <div className="max-w-[1440px] mx-auto relative h-[70vh] md:h-[90vh] flex items-center">
          {/* Background Image (Hero Banner 16:9) */}
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full">
              <Image 
                src={heroImage} 
                alt={`${product.name} Hero`}
                fill
                className="object-cover object-center scale-105"
                priority
              />
              {/* Gradient Overlay para o Texto (na esquerda como planejado) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f9f9f9] via-[#f9f9f9]/80 to-transparent z-10 hidden md:block"></div>
            </div>
          </div>

          <div className="relative z-20 px-6 md:px-12 w-full md:w-2/3 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <span className="inline-block px-3 py-1 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold mb-6">
              Lançamento Hooke
            </span>
            <h1 className="text-5xl lg:text-8xl font-display font-bold leading-none mb-6 text-zinc-900 tracking-tight">
              Streetwear <br/>
              <span className="italic text-zinc-800/60 font-serif">Atemporal.</span>
            </h1>
            <p className="text-zinc-800 text-lg max-w-md font-light leading-relaxed mb-10">
              A união perfeita entre alfaiataria e utilidade urbana. Uma coleção definida por textura meticulosa e silhuetas modernas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`#comprar`}
                className="px-10 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all transform hover:-translate-y-1 text-center"
              >
                GARANTIR O MEU AGORA
              </Link>
              <div className="flex items-center gap-3 px-6 py-4">
                 <span className="text-xl font-black">{formatarMoeda(product.price)}</span>
                 <span className="text-[10px] text-zinc-400 uppercase tracking-widest leading-none">Em até 3x <br/>Sem juros</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section (Gallery) */}
      <section className="max-w-[1440px] mx-auto px-6 mb-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 pb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400 mb-2">Editorial Series</h2>
            <h3 className="text-3xl font-display font-bold italic font-serif">A Narrativa Hooke</h3>
          </div>
          <div className="hidden md:block max-w-sm text-right">
            <p className="text-sm text-zinc-500 font-light italic">&quot;Streetwear é a armadura para sobreviver à realidade do dia a dia.&quot;</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Full Body Frontal */}
          <div className="md:col-span-6 overflow-hidden relative group aspect-[3/4] bg-zinc-200">
            <Image 
              src={fullBodyImage} 
              alt="Modelo Hooke Frontal" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 text-white mix-blend-difference">
              <p className="text-[10px] uppercase tracking-widest font-bold">01 — Perfil Completo</p>
            </div>
          </div>

          {/* Mid-Shot Upper Focus */}
          <div className="md:col-span-6 overflow-hidden relative group aspect-[3/4] bg-zinc-200">
            <Image 
              src={midShotImage} 
              alt="Estudo de Silhueta" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 text-white mix-blend-difference">
              <p className="text-[10px] uppercase tracking-widest font-bold">02 — Detalhes do Rosto & Gola</p>
            </div>
          </div>

          {/* Back/Rear Drape */}
          <div className="md:col-span-5 overflow-hidden relative group aspect-[4/5] bg-zinc-200">
            <Image 
              src={backShotImage} 
              alt="Caimento Traseiro" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 text-white mix-blend-difference">
              <p className="text-[10px] uppercase tracking-widest font-bold">03 — Caimento das Costas</p>
            </div>
          </div>

          {/* Extreme Macro Highlight (The Weave) */}
          <div className="md:col-span-7 overflow-hidden relative group bg-black">
            <div className="relative w-full h-full aspect-square md:aspect-auto min-h-[400px]">
              <Image 
                src={macroImage} 
                alt="Textura do Tecido Macro" 
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-12 text-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 z-20">
                <h4 className="text-white text-3xl font-display italic font-serif mb-4">O Toque Premium</h4>
                <p className="text-white/80 text-sm font-light leading-relaxed max-w-xs uppercase tracking-widest">
                  Um olhar aproximado sobre a trama do tecido. Onde a engenharia têxtil encontra a excelência estética.
                </p>
              </div>
              <div className="absolute top-6 right-6 z-10">
                <span className="px-4 py-2 border border-white/30 text-white text-[10px] uppercase tracking-widest font-bold backdrop-blur-md">
                  Detalhe Têxtil
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Focus Section (Horizontal Scroll Preview) */}
      <section className="bg-black py-32 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 mb-20 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-white text-4xl md:text-6xl font-display font-bold mb-4 font-serif italic">Catalog Focus</h2>
            <div className="h-1 w-20 bg-white"></div>
          </div>
          <p className="text-white/50 text-sm max-w-xs mt-8 md:mt-0 font-light tracking-wide leading-relaxed uppercase">
            Capturado através de lentes de alto contraste, nossas peças enfatizam movimento e caimento.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-8 px-6 pb-12 scrollbar-none">
          {images.map((img, i) => (
            <div key={i} className="flex-none w-[300px] md:w-[500px] group">
              <div className="relative aspect-[3/4] mb-6 border border-white/10 overflow-hidden">
                <Image 
                  src={img} 
                  alt={`Variação ${i+1}`} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">Catalog Plate / 00{i+1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Purchase Section */}
      <section id="comprar" className="max-w-[1440px] mx-auto px-6 py-32 text-center">
        <div className="max-w-xl mx-auto mb-16">
          <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter mb-8 font-serif">LUXO AUTÊNTICO.</h2>
          <p className="text-zinc-400 text-xs font-bold tracking-[0.5em] mb-12">ESTABLISHED MMXIX — BRÁS, SP.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 py-12 border-y border-zinc-200">
             <div className="flex flex-col items-center">
                <Shirt className="mb-4 text-zinc-300" strokeWidth={1} size={32}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Suedine 240g</span>
             </div>
             <div className="flex flex-col items-center">
                <Wind className="mb-4 text-zinc-300" strokeWidth={1} size={32}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Respirável</span>
             </div>
             <div className="flex flex-col items-center">
                <Ruler className="mb-4 text-zinc-300" strokeWidth={1} size={32}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Corte Boxy</span>
             </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-20 shadow-2xl inline-block w-full max-w-4xl border border-zinc-100">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="w-full md:w-1/2 aspect-square relative bg-zinc-100 overflow-hidden">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
               </div>
               <div className="w-full md:w-1/2 text-left">
                  <span className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] mb-2 block">Destaque de Lançamento</span>
                  <h3 className="text-4xl font-bold tracking-tight mb-4 uppercase">{product.name}</h3>
                  <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mb-10">
                    <span className="text-4xl font-black block">{formatarMoeda(product.price)}</span>
                    <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">ou 3x de {formatarMoeda(product.price/3)} s/ juros</span>
                  </div>
                  <Link 
                    href={`/produto/${product.slug}`}
                    className="block w-full py-6 bg-black text-white text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all text-center"
                  >
                    FINALIZAR PEDIDO AGORA
                  </Link>
                  <p className="text-center text-[10px] text-zinc-400 mt-6 uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={14}/> Site 100% Seguro | Primeira Troca Grátis
                  </p>
               </div>
            </div>
        </div>
      </section>

      <footer className="py-20 bg-zinc-100 border-t border-zinc-200 text-center">
          <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-[1em]">HOOKE STORE © 2024</p>
      </footer>
    </div>
  );
}
