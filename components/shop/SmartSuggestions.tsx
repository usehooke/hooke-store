'use client';

import { useCartStore } from "@/store/cart-store";
import { Product } from "@/types";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { getFeaturedProducts } from "@/lib/productService";
import toast from "react-hot-toast";

export default function SmartSuggestions() {
  const items = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSuggestions() {
      // Pega produtos destacados que não estão no carrinho
      const featured = await getFeaturedProducts(6);
      const filtered = featured.filter(p => !items.some(item => item.id === p.id));
      setSuggestions(filtered.slice(0, 3));
    }
    loadSuggestions();
  }, [items]);

  const handleQuickAdd = (product: Product) => {
    setAddingId(product.id);
    
    // Adição rápida com tamanho padrão (M) ou o primeiro disponível
    const size = product.sizes.includes("M") ? "M" : product.sizes[0];
    const color = product.colors && product.colors.length > 0 ? product.colors[0].name : undefined;
    
    addItem(product, size, color);

    toast.success(`${product.name} adicionado!`);
    
    setTimeout(() => setAddingId(null), 1500);
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-100 pt-8 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-hooke-900 italic">
          Complete seu Look Hooke
        </h4>
        <div className="h-[1px] flex-1 bg-gray-100 ml-4"></div>
      </div>
      
      <div className="space-y-4">
        {suggestions.map(product => (
          <div key={product.id} className="flex items-center gap-4 group p-2 hover:bg-gray-50 transition-colors rounded-sm">
            <div className="relative w-14 h-18 bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
              <Image 
                priority src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="60px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-hooke-900 uppercase truncate">
                {product.name}
              </p>
              <p className="text-[11px] font-black text-hooke-400 mt-0.5">R$ {product.price.toFixed(2).replace('.', ',')}</p>
            </div>
            
            <button 
              onClick={() => handleQuickAdd(product)}
              disabled={addingId === product.id}
              className={`
                p-2.5 border transition-all duration-300 rounded-sm active:scale-90
                ${addingId === product.id 
                  ? "bg-green-600 border-green-600 text-white" 
                  : "border-hooke-200 text-hooke-900 hover:bg-hooke-900 hover:text-white hover:border-hooke-900"}
              `}
              title="Adição Rápida"
            >
              {addingId === product.id ? <Check size={14} /> : <Plus size={14} />}
            </button>
          </div>
        ))}
      </div>
      
      <p className="text-[9px] text-gray-400 mt-4 text-center uppercase tracking-widest leading-loose">
        Produtos selecionados com base no seu perfil de estilo
      </p>
    </div>
  );
}
