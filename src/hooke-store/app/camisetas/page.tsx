"use client"; // Habilita interatividade (Filtros)

import { useState, useEffect } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { SlidersHorizontal } from "lucide-react";
import { getProducts } from "@/lib/productService";
import type { Product } from "@/data/catalogo";

export default function CamisetasPage() {
  // Estado para controlar o filtro ativo
  // Adaptado para as novas categorias do Hooke OS
  const [filter, setFilter] = useState<'todos' | 'oversized' | 'vintage'>('todos');

  // Estado para os produtos vindos do Firebase
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProdutos(data);
      setLoading(false);
    });
  }, []);

  // Lógica de filtragem atualizada
  const filteredProducts = produtos.filter((product) => {
    // Primeiro, garantimos que só estamos olhando para "Camisetas" (ignorando Regatas e Kits por enquanto, ou ajustando conforme necessidade)
    // Aqui estou assumindo que "Camisetas" engloba Oversized e Vintage.
    const isCamiseta = product.category === 'Oversized' || product.category === 'Vintage';

    if (!isCamiseta) return false;

    if (filter === 'todos') return true;
    if (filter === 'oversized') return product.category === 'Oversized'; // Equivalente a "Lisas/Básicas"
    if (filter === 'vintage') return product.category === 'Vintage';     // Equivalente a "Estampadas"

    return true;
  });

  return (
    <main className="min-h-screen bg-white pb-20">

      <section className="max-w-[1920px] mx-auto px-6 md:px-12 py-12 md:py-20">

        {/* CABEÇALHO DA COLEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-gray-100 pb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-hooke-500 uppercase mb-2 block font-sans">
              Coleção 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-hooke-900 uppercase tracking-tighter leading-none">
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
            className={`px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'todos'
                ? 'bg-hooke-900 text-white border-hooke-900'
                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900 hover:text-hooke-900'
              }`}
          >
            Todas
          </button>

          {/* Botão OVERSIZED (Lisas) */}
          <button
            onClick={() => setFilter('oversized')}
            className={`px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'oversized'
                ? 'bg-hooke-900 text-white border-hooke-900'
                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900 hover:text-hooke-900'
              }`}
          >
            Oversized (Lisas)
          </button>

          {/* Botão VINTAGE (Estampadas) */}
          <button
            onClick={() => setFilter('vintage')}
            className={`px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'vintage'
                ? 'bg-hooke-900 text-white border-hooke-900'
                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900 hover:text-hooke-900'
              }`}
          >
            Vintage (Estampadas)
          </button>
        </div>

        {/* GRID DE PRODUTOS */}
        {loading ? (
          <div className="w-full text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando coleção...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-32 bg-gray-50 border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">Nenhuma peça encontrada nesta categoria.</p>
            <button
              onClick={() => setFilter('todos')}
              className="text-hooke-900 text-xs font-black uppercase underline hover:text-gray-600 underline-offset-4"
            >
              Limpar Filtros
            </button>
          </div>
        )}

      </section>
    </main>
  );
}