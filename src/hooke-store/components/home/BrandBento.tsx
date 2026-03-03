import Image from 'next/image';
import { Sprout, Ruler, Fingerprint } from "lucide-react";

export default function BrandBento() {
  return (
    <section className="py-20 px-6 md:px-12 w-full">
      
      {/* Cabeçalho da Seção */}
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-hooke-500 mb-2 block">
          Filosofia
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-hooke-900 uppercase tracking-tighter mb-4">
          O Padrão Hooke
        </h2>
        <div className="h-px w-24 bg-hooke-200 mx-auto"></div>
      </div>

      {/* Grid Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px]">

        {/* ITEM 1: Algodão (Grande - Esquerda) */}
        <div className="group relative overflow-hidden bg-black md:col-span-2 md:row-span-2 min-h-[300px] border border-gray-100">
          <Image
            src="/banner-home.jpg" 
            alt="Tecido Premium"
            fill
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-10 text-white z-10">
            <Sprout className="w-8 h-8 text-white mb-4" strokeWidth={1} />
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Algodão Certificado BCI</h3>
            <p className="text-gray-300 max-w-md text-sm leading-relaxed">
              Fibra sustentável e 2x mais resistente que o algodão comum. Toque macio que não forma bolinhas e mantém a cor preta intensa lavagem após lavagem.
            </p>
          </div>
        </div>

        {/* ITEM 2: Modelagem (Pequeno - Direita Cima) */}
        <div className="group relative overflow-hidden bg-hooke-100 p-8 border border-gray-100 flex flex-col justify-center min-h-[200px]">
           <Ruler className="w-6 h-6 text-hooke-900 mb-4" strokeWidth={1.5} />
           <h4 className="text-lg font-bold uppercase tracking-tight text-hooke-900 mb-2">Modelagem Streetwear</h4>
           <p className="text-xs text-hooke-500 leading-relaxed">
             Corte Oversized autêntico ou Regular Fit estruturado. Desenhado para valorizar o shape sem apertar.
           </p>
        </div>

        {/* ITEM 3: Exclusividade (Pequeno - Direita Baixo) */}
        <div className="group relative overflow-hidden bg-hooke-900 p-8 border border-hooke-900 flex flex-col justify-center min-h-[200px] text-white">
           <Fingerprint className="w-6 h-6 text-white mb-4" strokeWidth={1.5} />
           <h4 className="text-lg font-bold uppercase tracking-tight text-white mb-2">Exclusividade</h4>
           <p className="text-xs text-gray-400 leading-relaxed">
             Produção familiar e controlada. Cada peça passa por uma revisão manual rigorosa antes de chegar a você.
           </p>
        </div>

      </div>
    </section>
  );
}