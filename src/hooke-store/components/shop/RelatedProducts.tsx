import Link from "next/link";
import { getProducts } from "@/lib/productService";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  currentSlug: string;
  category?: string; // Opcional: para mostrar produtos da mesma categoria
}

export default async function RelatedProducts({ currentSlug, category }: RelatedProductsProps) {
  const PRODUTOS = await getProducts();

  // Lógica inteligente: Tenta pegar da mesma categoria primeiro
  let related = PRODUTOS.filter((p) => p.slug !== currentSlug && p.category === category);

  // Se não tiver o suficiente da mesma categoria, completa com outros
  if (related.length < 4) {
    const others = PRODUTOS.filter(p => p.slug !== currentSlug && p.category !== category);
    related = [...related, ...others];
  }

  // Pega apenas os 4 primeiros
  const displayProducts = related.slice(0, 4);

  if (displayProducts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-hooke-100 pt-16 animate-in fade-in duration-700 delay-700">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-hooke-900 uppercase tracking-wider">
          Você também pode curtir
        </h2>
        <Link href="/colecao" className="text-sm font-medium text-hooke-500 hover:text-hooke-900 underline-offset-4 hover:underline hidden sm:block">
          Ver tudo
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/colecao" className="inline-block px-6 py-3 border border-hooke-200 text-sm font-bold uppercase tracking-wider text-hooke-900 hover:bg-hooke-50 transition-colors">
          Ver Coleção Completa
        </Link>
      </div>
    </section>
  );
}