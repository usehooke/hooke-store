// src/components/layout/Hero.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[90vh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-hooke-900">
      
      {/* --- FOTO A (ESQUERDA): Regata Verde (A Essência) --- */}
      <div className="relative h-1/2 lg:h-full w-full bg-hooke-100">
        <Image
          src="/hero-verde.avif" // A imagem que você converteu e colocou na pasta public
          alt="Homem Hooke com regata texturizada"
          fill
          className="object-cover object-top opacity-95 transition-transform duration-[2s] hover:scale-105"
          priority // Carrega primeiro
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* Sombra suave para destacar o texto no celular */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" />
      </div>

      {/* --- FOTO B (DIREITA): Camiseta Preta (O Detalhe) --- */}
      <div className="relative h-1/2 lg:h-full w-full bg-hooke-800 lg:border-l border-white/10">
        <Image
          src="/hero-preta.avif" // A imagem do close do Fusca que você converteu e colocou na pasta public
          alt="Detalhe camiseta Hooke Fusca"
          fill
          className="object-cover object-center opacity-95 transition-transform duration-[2s] hover:scale-105"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
         {/* Sombra para uniformizar */}
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      </div>

      {/* --- CONTEÚDO DE TEXTO (FLUTUANTE) --- */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end lg:justify-center items-center text-center pb-20 lg:pb-0 px-6 pointer-events-none">
        <div className="backdrop-blur-md bg-black/30 p-8 md:p-12 rounded-sm pointer-events-auto max-w-2xl mx-auto border border-white/10 shadow-2xl">
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter mb-4 drop-shadow-xl uppercase">
            Vista a sua <br className="hidden md:block"/> essência.
          </h1>
          
          <p className="text-lg md:text-xl text-hooke-100 mb-8 font-light max-w-lg mx-auto drop-shadow-md leading-relaxed">
            Minimalismo não é ausência. É o equilíbrio perfeito entre o corte, o tecido e a sua atitude.
          </p>
          
          <Link 
            href="/camisetas" 
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-hooke-900 text-sm font-bold uppercase tracking-widest hover:bg-hooke-100 transition-all duration-300 rounded-sm shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Explorar Coleção
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300"/>
          </Link>
        </div>
      </div>
    </section>
  );
}