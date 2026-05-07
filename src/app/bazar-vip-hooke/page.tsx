import { BazarGrid } from "@/components/bazar-vip-hooke/BazarGrid";
import { PRODUTOS } from "@/config";
import { AlertOctagon } from "lucide-react";

export const metadata = {
  title: "Bazar VIP Hooke | Últimas Peças",
  description: "O que acabar não volta. Tecidos exclusivos de lote único.",
};

export default function BazarVipPage() {
  // Como o estoque não vem mapeado no catálogo original, criamos uma seed baseada no nome
  // para garantir consistência e simular os produtos com estoque < 5 e > 0
  const bazarProducts = PRODUTOS.slice(0, 8).map((p) => {
    // Gerando um "estoque" determinístico entre 1 e 4
    const simulatedStock = (p.name.length % 4) + 1; 
    return {
      ...p,
      bazarStock: simulatedStock
    };
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ff0000] selection:text-white pb-20">
      
      {/* Alert Header */}
      <div className="bg-[#ff0000] text-white w-full py-2 px-4 shadow-[0_0_20px_rgba(255,0,0,0.5)] z-50 sticky top-0 flex items-center justify-center gap-2 font-bold text-xs md:text-sm uppercase tracking-wider text-center">
        <AlertOctagon className="w-4 h-4 animate-pulse" />
        Acesso VIP: Produtos com menos de 5 unidades em estoque.
      </div>

      <main className="max-w-6xl mx-auto px-4 pt-10 md:pt-16">
        
        {/* Title & Copy */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Bazar <span className="text-[#ff0000]">VIP</span>
          </h1>
          <p className="text-neutral-400 font-medium md:text-lg">
            A regra é simples: <strong className="text-white">O que acabar não volta.</strong> Tecidos premium exclusivos de lote único. Garanta sua peça antes que a tag de &quot;Esgotado&quot; apareça.
          </p>
        </div>

        {/* Dynamic Grid */}
        <BazarGrid products={bazarProducts} />

      </main>
    </div>
  );
}
