import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coleção Indisponível | Hooke",
  description: "A linha feminina da Hooke encontra-se temporariamente fora de estoque.",
  robots: { index: false, follow: true },
};

export default function FemininoPage() {
  return (
    <div className="bg-white min-h-[75vh] flex items-center justify-center p-6 font-mono">
      <div className="max-w-md w-full border-2 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#000] bg-white text-center space-y-6">
        <span className="inline-block text-[9px] font-black uppercase tracking-[0.3em] bg-black text-white px-3 py-1">
          STATUS // ESGOTADO
        </span>

        <h1 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-black uppercase">
          Coleção Feminina Indisponível
        </h1>

        <p className="text-xs text-zinc-600 leading-relaxed tracking-wider uppercase font-medium">
          A linha feminina encontra-se temporariamente fora de estoque e sem lote ativo no momento.
        </p>

        <div className="pt-4 border-t border-zinc-200">
          <Link
            href="/masculino"
            className="w-full inline-flex items-center justify-center gap-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.25em] py-4 px-6 hover:bg-zinc-800 transition-colors shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Explorar Catálogo Ativo <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
