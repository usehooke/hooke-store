"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function CartItemsList() {
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  if (items.length === 0) return null;

  return (
    <ul className="space-y-8">
      {items.map((item) => (
        <li key={item.cartItemId} className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="relative aspect-[4/5] w-24 flex-shrink-0 overflow-hidden rounded-none bg-hooke-100 border border-hooke-200">
            <Image
              priority 
              src={item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : "/placeholder-produto.avif")}
              alt={item.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 25vw, 100px"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex justify-between">
              <div>
                <h3 className="text-base font-bold text-hooke-900">
                  <Link href={`/produto/${item.id}`} className="hover:underline">{item.name}</Link>
                </h3>
                <p className="mt-1 text-sm text-hooke-500">
                  Tamanho: {item.selectedSize}
                  {item.selectedColor && ` | Cor: ${item.selectedColor}`}
                </p>
              </div>
              <p className="text-base font-bold text-hooke-900 text-right">
                {formatter.format(item.price * item.quantity)}
              </p>
            </div>
            <div className="flex items-end justify-between text-sm">
              <div className="flex items-center border border-hooke-200 rounded-none bg-white">
                <button
                  onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="p-2 text-hooke-500 hover:text-hooke-900 disabled:opacity-30 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 font-bold text-hooke-900 min-w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                  className="p-2 text-hooke-500 hover:text-hooke-900 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.cartItemId)}
                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
              >
                <Trash2 size={14} />
                <span>Remover</span>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
