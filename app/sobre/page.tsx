// src/app/sobre/page.tsx
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LADO ESQUERDO: Texto e História */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-hooke-900 tracking-tight">
              Mais do que roupa. <br />
              <span className="text-hooke-500">Uma declaração de atitude.</span>
            </h1>
            
            <div className="prose prose-lg text-hooke-600 space-y-6">
              <p>
                A <strong>Hooke</strong> nasceu de uma inquietação: por que é tão difícil encontrar o básico bem feito?
              </p>
              <p>
                Não acreditamos em logotipos gigantes ou tendências passageiras. 
                Acreditamos no corte perfeito, no tecido que respira e na peça que te acompanha 
                do escritório ao jantar sem perder a elegância.
              </p>
              <p>
                Cada camiseta é projetada pensando no homem moderno que valoriza seu tempo e sua imagem. 
                Minimalismo não é sobre ter pouco, é sobre ter apenas o essencial, e que esse essencial seja excelente.
              </p>
            </div>

            <div className="border-l-4 border-hooke-900 pl-6 py-2 mt-8">
              <p className="text-xl font-medium text-hooke-900 italic">
                "Eu sou a cara da minha marca porque uso, testo e aprovo cada peça. 
                A Hooke é a extensão do meu estilo de vida."
              </p>
              <span className="block mt-4 text-sm font-bold uppercase tracking-widest text-hooke-500">
                — Fundador, Hooke
              </span>
            </div>
          </div>

          {/* LADO DIREITO: Foto do Fundador */}
          <div className="relative aspect-[3/4] bg-hooke-50 rounded-sm overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
            <Image
              src="/sobre.jpg" // Certifique-se de colocar essa foto na pasta public
              alt="Fundador da Hooke"
              fill
              className="object-cover"
              priority
            />
            {/* Efeito de moldura sutil */}
            <div className="absolute inset-0 border border-black/5 rounded-sm"></div>
          </div>

        </div>
      </section>
    </main>
  );
}
