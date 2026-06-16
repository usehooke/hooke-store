"use client";

import { useState } from "react";
import { ProductCard } from "@/features/catalog";
import { SlidersHorizontal } from "lucide-react";
import { Product } from "@/types";

interface CamisetasClientProps {
  initialProducts: Product[];
}

export default function CamisetasClient({ initialProducts }: CamisetasClientProps) {
  const [filter, setFilter] = useState<'todos' | 'oversized' | 'vintage'>('todos');

  // Lógica de filtragem
  const filteredProducts = initialProducts.filter((product) => {
    // Camisetas englobam as categorias "Oversized" (lisas) e "Vintage" (estampadas)
    const isCamiseta = product.category === 'Oversized' || product.category === 'Vintage';
    if (!isCamiseta) return false;

    if (filter === 'todos') return true;
    if (filter === 'oversized') return product.category === 'Oversized';
    if (filter === 'vintage') return product.category === 'Vintage';

    return true;
  });

  return (
    <section className="max-w-[1920px] mx-auto px-6 md:px-12 py-12 md:py-20">
      {/* CABEÇALHO DA COLEÇÃO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-gray-100 pb-12">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-hooke-500 mb-2 block font-sans">
            Coleção 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-hooke-900 tracking-tighter leading-none">
            Camisetas
          </h1>
        </div>

        {/* CONTADOR DE PRODUTOS */}
        <div className="text-hooke-500 text-sm font-medium font-sans">
          Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'peça' : 'peças'}
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-wrap items-center gap-3 mb-12 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
        <div className="flex items-center text-hooke-900 mr-2">
          <SlidersHorizontal size={18} />
        </div>

        {/* Botão TODOS */}
        <button
          onClick={() => setFilter('todos')}
          className={`px-6 py-3 rounded-none text-xs font-bold tracking-widest transition-all duration-300 border ${filter === 'todos'
            ? 'bg-hooke-900 text-white border-hooke-900'
            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900 hover:text-hooke-900'
          }`}
        >
          Todas
        </button>

        {/* Botão OVERSIZED (Lisas) */}
        <button
          onClick={() => setFilter('oversized')}
          className={`px-6 py-3 rounded-none text-xs font-bold tracking-widest transition-all duration-300 border ${filter === 'oversized'
            ? 'bg-hooke-900 text-white border-hooke-900'
            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900 hover:text-hooke-900'
          }`}
        >
          Oversized (Lisas)
        </button>

        {/* Botão VINTAGE (Estampadas) */}
        <button
          onClick={() => setFilter('vintage')}
          className={`px-6 py-3 rounded-none text-xs font-bold tracking-widest transition-all duration-300 border ${filter === 'vintage'
            ? 'bg-hooke-900 text-white border-hooke-900'
            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900 hover:text-hooke-900'
          }`}
        >
          Vintage (Estampadas)
        </button>
      </div>

      {/* GRID DE PRODUTOS */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="text-center py-32 bg-gray-50 border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm tracking-widest mb-4">Nenhuma peça encontrada nesta categoria.</p>
          <button
            onClick={() => setFilter('todos')}
            className="text-hooke-900 text-xs font-black underline hover:text-gray-600 underline-offset-4"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </section>
  );
}
