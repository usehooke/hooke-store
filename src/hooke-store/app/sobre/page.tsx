import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Sobre a Hooke | Nossa História",
  description: "Conheça a origem da Hooke. Moda masculina feita no Brasil com padrões internacionais.",
};

export default function AboutPage() {
  return (
    <main className="w-full bg-white min-h-screen">

      {/* SEÇÃO 1: EDITORIAL SPLIT (Foto Esq / Texto Dir) */}
      <div className="flex flex-col md:flex-row w-full min-h-screen">

        {/* Lado da Imagem (Fixo em Desktop - Metade da Tela) */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-screen relative bg-gray-100">
          <Image
            src="/produtos/sobre-image.jpg" // Corrigido provisoriamente
            alt="Bastidores da Hooke"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            priority
          />
          {/* Overlay sutil para dar profundidade */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Lado do Texto (Scroll - Metade da Tela) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-20 bg-white">

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 block font-sans">
            Desde 2006
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-hooke-900 uppercase tracking-tighter leading-[0.9] mb-8 font-sans">
            Não é apenas <br /> uma camiseta.
          </h1>

          <div className="space-y-6 text-sm md:text-base text-gray-600 leading-relaxed font-sans">
            <p>
              A Hooke nasceu de uma frustração comum: encontrar uma camiseta básica que não parecesse velha após a terceira lavagem.
            </p>
            <p>
              Somos filhos de nordestinos que vieram para São Paulo construir a vida na indústria têxtil. Cresci no meio das máquinas de costura, entendendo que <strong>qualidade não se apressa</strong>.
            </p>
            <p>
              Hoje, nossa missão é simples: criar as melhores peças essenciais do guarda-roupa masculino brasileiro. Usamos Algodão Egípcio certificado, modelagem proprietária e um acabamento que você sente no toque.
            </p>

            {/* Citação do Fundador */}
            <blockquote className="border-l-2 border-hooke-900 pl-6 py-2 my-8 italic text-hooke-900 font-medium">
              &quot;Eu sou a cara da minha marca porque uso, testo e aprovo cada peça. A Hooke é a extensão do meu estilo de vida.&quot;
            </blockquote>

            <p className="font-bold text-hooke-900">
              Menos excesso. Mais essência. Isso é Hooke.
            </p>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-hooke-900 font-sans">
              Fernando Luiz Ferreira Jr.
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-sans">
              Fundador & CEO
            </p>
          </div>

        </div>
      </div>

      {/* SEÇÃO 2: MANIFESTO (Faixa Preta) */}
      <section className="w-full bg-hooke-900 text-white py-24 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 font-sans">
            &quot;O detalhe é o que separa o comum do extraordinário.&quot;
          </h2>
          <Link href="/colecao" className="inline-flex items-center gap-3 border-b border-white pb-1 text-xs font-bold uppercase tracking-widest hover:text-gray-300 hover:border-gray-300 transition-all font-sans">
            Ver a Coleção <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </main>
  );
}