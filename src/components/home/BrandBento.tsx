import Image from 'next/image';
import { Sprout, Ruler, Fingerprint } from "lucide-react";

export default function BrandBento() {
  return (
    <section className="py-24 px-6 md:px-12 w-full bg-[#FAF9F7]">
      
      {/* Cabeçalho da Seção (Estilo Editorial Serif) */}
      <div className="text-center mb-16">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6B4F] mb-3 block">
          Nossa Filosofia
        </span>
        <h2 className="text-3xl md:text-4xl font-light text-black tracking-tight font-serif italic mb-4">
          O Padrão Hooke Store
        </h2>
        <div className="h-[1px] w-20 bg-black/10 mx-auto"></div>
      </div>

      {/* Grid Bento - Estética Fine-Line Brutalism */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-0 border border-black/10 bg-white max-w-[1440px] mx-auto">

        {/* ITEM 1: Algodão (Grande - Esquerda) */}
        <div className="group relative overflow-hidden bg-black md:col-span-2 md:row-span-2 min-h-[350px] md:min-h-auto border-b md:border-b-0 md:border-r border-black/10">
          <Image
            priority 
            src="/banner-home.jpg" 
            alt="Tecido Premium Hooke"
            fill
            className="object-cover opacity-50 group-hover:scale-102 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white z-10">
            <Sprout className="w-8 h-8 text-[#FAF9F7] mb-4" strokeWidth={1} />
            <h3 className="text-2xl font-light font-serif tracking-tight mb-2">
              Algodão Certificado BCI
            </h3>
            <p className="text-zinc-300 max-w-md text-xs font-mono uppercase tracking-wide leading-relaxed">
              Fibra sustentável premium, duas vezes mais resistente que o algodão comum. O toque macio que preserva a densidade e impede a formação de bolinhas, mantendo a cor profunda lavagem após lavagem.
            </p>
          </div>
        </div>

        {/* ITEM 2: Modelagem (Pequeno - Direita Cima) */}
        <div className="group relative overflow-hidden bg-white p-8 md:p-12 border-b border-black/10 flex flex-col justify-center min-h-[220px]">
          <Ruler className="w-6 h-6 text-black mb-4" strokeWidth={1.2} />
          <h4 className="text-lg font-light font-serif tracking-tight text-black mb-2">
            Modelagem Streetwear
          </h4>
          <p className="text-xs text-zinc-500 font-mono uppercase leading-relaxed">
            Corte Oversized autêntico ou Regular Fit estruturado. Geometria pensada para valorizar a silhueta robusta com caimento boxy impecável que não marca.
          </p>
        </div>

        {/* ITEM 3: Exclusividade (Pequeno - Direita Baixo) */}
        <div className="group relative overflow-hidden bg-[#F1EFEA] p-8 md:p-12 flex flex-col justify-center min-h-[220px] text-black">
          <Fingerprint className="w-6 h-6 text-black mb-4" strokeWidth={1.2} />
          <h4 className="text-lg font-light font-serif tracking-tight text-black mb-2">
            Exclusividade Limitada
          </h4>
          <p className="text-xs text-zinc-600 font-mono uppercase leading-relaxed">
            Produção local, familiar e estritamente controlada. Cada lote passa por uma curadoria e revisão manual rigorosa antes de alcançar a sua sacola.
          </p>
        </div>

      </div>
    </section>
  );
}
