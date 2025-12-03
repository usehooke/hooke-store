// src/components/layout/Hero.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[85vh] md:h-[90vh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-hooke-900">
      
      {/* --- FOTO A (PRINCIPAL) --- */}
      {/* No celular, ela ocupa a tela inteira. No PC, ocupa a metade esquerda. */}
      <div className="relative h-full w-full bg-hooke-100">
        <Image
          src="/hero-verde.webp"
          alt="Homem Hooke com regata texturizada"
          fill
          // No celular, foca no centro. No PC, foca no topo.
          className="object-cover object-center lg:object-top opacity-95 transition-transform duration-[2s] hover:scale-105"
          priority
          sizes="100vw"
        />
        {/* Sombra mais forte no celular para garantir a leitura do texto */}
        <div className="absolute inset-0 bg-black/40 lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" />
      </div>

      {/* --- FOTO B (SECUNDÁRIA - SÓ APARECE NO PC) --- */}
      {/* A classe `hidden lg:block` faz ela sumir no celular */}
      <div className="relative hidden lg:block h-full w-full bg-hooke-800 border-l border-white/10">
        <Image
          src="/hero-preta.webp"
          alt="Detalhe camiseta Hooke Fusca"
          fill
          className="object-cover object-center opacity-95 transition-transform duration-[2s] hover:scale-105"
          priority
          sizes="50vw"
        />
         <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      </div>

      {/* --- CONTEÚDO DE TEXTO (FLUTUANTE) --- */}
      {/* No celular, fica centralizado na tela inteira. No PC, fica sobre as duas fotos. */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 pointer-events-none">
        
        {/* Caixa de texto com fundo de vidro */}
        <div className="backdrop-blur-md bg-black/30 p-8 md:p-12 rounded-sm pointer-events-auto max-w-xl lg:max-w-2xl mx-auto border border-white/10 shadow-2xl">
          
          {/* Título (H1) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tighter mb-4 drop-shadow-xl uppercase">
            Vista a sua <br className="hidden md:block"/> essência.
          </h1>
          
          {/* Subtítulo (P) */}
          <p className="text-base sm:text-lg md:text-xl text-hooke-100 mb-8 font-light drop-shadow-md leading-relaxed">
            Minimalismo não é ausência. É o equilíbrio perfeito entre o corte, o tecido e a sua atitude.
          </p>
          
          {/* Botão (CTA) */}
          <Link 
            href="/camisetas" 
            className="group inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-white text-hooke-900 text-sm font-bold uppercase tracking-widest hover:bg-hooke-100 transition-all duration-300 rounded-sm shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Explorar Coleção
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300"/>
          </Link>
        </div>
      </div>
    </section>
  );
}