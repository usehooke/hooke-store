'use client';

import { useCartStore } from "@/store/cart-store";
import { Product } from "@/data/catalogo";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getFeaturedProducts } from "@/lib/productService";

export default function SmartSuggestions() {
  const items = useCartStore(state => state.items);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    async function loadSuggestions() {
      // Pega produtos em destaque que não estão no carrinho
      const featured = await getFeaturedProducts(4);
      const filtered = featured.filter(p => !items.some(item => item.id === p.id));
      setSuggestions(filtered.slice(0, 2));
    }
    loadSuggestions();
  }, [items]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-hooke-500 mb-4">
        Combine com seu estilo
      </h4>
      <div className="space-y-4">
        {suggestions.map(product => (
          <div key={product.id} className="flex items-center gap-3 group">
            <div className="relative w-12 h-16 bg-gray-50 overflow-hidden flex-shrink-0">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-hooke-900 uppercase truncate max-w-[120px]">
                {product.name}
              </p>
              <p className="text-[10px] text-hooke-500">R$ {product.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <Link 
              href={`/produto/${product.slug}`}
              className="p-2 border border-hooke-200 hover:border-hooke-900 transition-colors rounded-sm"
            >
              <Plus size={14} className="text-hooke-900" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
