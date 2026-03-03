"use client";

import { Zap, Percent, Check, ArrowRight } from "lucide-react";
import { Product } from "@/types"; // Certifique-se que o tipo Product existe em @/types

interface KitPromoCardProps {
  product: Product;
}

export default function KitPromoCard({ product }: KitPromoCardProps) {
  // Lógica: Se o nome do produto tiver "Regata", mostra a oferta.
  // Ajuste essa condição conforme o nome dos seus produtos no banco de dados.
  const isEligible = product.name.toLowerCase().includes("regata") || product.category.toLowerCase().includes("regata");

  if (!isEligible) return null;

  // Cálculos do Kit (4 peças com 15% off)
  const qtdKit = 4;
  const precoUnitario = product.price;
  const totalSemDesconto = precoUnitario * qtdKit;
  const desconto = 0.15; // 15%
  const totalComDesconto = totalSemDesconto * (1 - desconto);

  return (
    <div className="w-full mt-8 border border-green-200 bg-green-50/30 overflow-hidden transition-all hover:shadow-md animate-in slide-in-from-bottom-2 duration-700">
      
      {/* Cabeçalho da Promoção */}
      <div className="bg-green-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs">
          <Zap size={14} fill="currentColor" />
          Oferta Relâmpago
        </div>
        <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide">
          Tempo Limitado
        </span>
      </div>

      {/* Corpo da Oferta */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h4 className="text-lg font-black text-hooke-900 uppercase tracking-tight mb-1">
              Pack {qtdKit} Unidades
            </h4>
            <p className="text-xs text-gray-500 font-medium">Abasteça seu guarda-roupa.</p>
          </div>
          <div className="text-right">
             <span className="block text-xs text-gray-400 line-through decoration-red-400">
               R$ {totalSemDesconto.toFixed(2).replace('.', ',')}
             </span>
             <span className="block text-xl font-black text-green-700">
               R$ {totalComDesconto.toFixed(2).replace('.', ',')}
             </span>
          </div>
        </div>

        {/* Vantagens (Lista Limpa) */}
        <ul className="space-y-3 mb-6 border-t border-green-100 pt-4">
          <li className="flex items-center gap-3 text-xs text-hooke-700 font-bold uppercase tracking-wide">
            <Percent size={14} className="text-green-600" />
            15% OFF no Checkout
          </li>
          <li className="flex items-center gap-3 text-xs text-hooke-700 font-bold uppercase tracking-wide">
            <Check size={14} className="text-green-600" />
            Frete Grátis Brasil
          </li>
        </ul>

        {/* Botão de Ação */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-widest text-xs py-4 flex items-center justify-center gap-2 transition-all group">
          Adicionar Pack ao Carrinho
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
          *Desconto aplicado automaticamente.
        </p>
      </div>
    </div>
  );
}