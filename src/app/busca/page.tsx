import { getProducts } from "@/lib/productServiceServer";
import GalleryCard from "@/components/shop/GalleryCard";
import Link from "next/link";
import { ChevronRight, SearchX } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Resultados da Busca | Hooke",
  description: "Encontre os melhores equipamentos e peças essenciais da Hooke.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  headers();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.toLowerCase().trim() : "";

  let results: any[] = [];
  if (query.length >= 2) {
    const allProducts = await getProducts();
    results = allProducts.filter((p) => {
      const haystack = [
        p.name,
        p.description,
        p.category,
        p.department,
        ...(p.sizes || []),
      ]
        .join(" ")
        .toLowerCase();
      return query.split(" ").every((word) => haystack.includes(word));
    });
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* CABEÇALHO DA BUSCA */}
      <div className="w-full px-5 md:px-12 pt-3 md:pt-5 pb-8 border-b border-black/10">
        <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-zinc-400 mb-6 uppercase font-black">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={9} />
          <span className="text-black">Busca</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[9px] font-black tracking-[0.4em] text-zinc-400 uppercase block mb-3">
              RESULTADOS PARA
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-none uppercase">
              "{query}"
            </h1>
          </div>
          <p className="text-[11px] tracking-[0.1em] text-zinc-500 max-w-xs font-medium leading-relaxed uppercase md:text-right">
            {results.length} {results.length === 1 ? "peça encontrada" : "peças encontradas"}
          </p>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="w-full px-5 md:px-12 py-12">
        {results.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-zinc-400">
              <SearchX size={24} />
            </div>
            <p className="text-[9px] font-black tracking-[0.4em] text-zinc-400 uppercase mb-3">
              NENHUM RESULTADO
            </p>
            <p className="text-sm text-zinc-500 max-w-sm mb-8">
              Não encontramos nenhum equipamento correspondente a "{query}". Tente buscar por termos mais genéricos como "Oversized" ou "Preta".
            </p>
            <Link
              href="/"
              className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors"
            >
              VOLTAR PARA A LOJA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-20">
            {results.map((product, index) => (
              <GalleryCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
