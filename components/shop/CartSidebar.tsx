// components/shop/CartSidebar.tsx
"use client";

import { useCartStore, selectCartSubTotal } from "@/store/cart-store";
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Formatter criado FORA do componente para evitar recalcular a cada render
const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function CartSidebar() {
  const [mounted, setMounted] = useState(false);

  // Pegar o estado do Zustand
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const subTotal = useCartStore(selectCartSubTotal);

  // Só renderizar no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    const phoneNumber = "5511975902528";
    const currentItems = useCartStore.getState().items;

    let message = "*NOVO PEDIDO HOOKE* 🛒\n\n";
    currentItems.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name} | Tam: ${item.selectedSize}\n`;
      message += `   Ref: R$ ${item.price} cada\n`;
    });
    message += `\n*TOTAL DO PEDIDO: ${formatter.format(subTotal)}*`;
    message += `\n\nOlá! Gostaria de finalizar a compra e combinar o pagamento/entrega.`;

    const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
  };

  // Só renderizar no cliente
  if (!mounted) return null;

  // Renderizar um portal invisível que só fica visível quando isOpen é true
  return createPortal(
    <div
      className={`fixed inset-0 z-[999] flex justify-end transition-opacity duration-300 pointer-events-none ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
    >
      {/* Fundo Escuro */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer ${isOpen ? "animate-in fade-in" : "animate-out fade-out"
          }`}
        onClick={closeCart}
      />

      {/* A Gaveta Lateral (Sharp) */}
      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-100 ${isOpen ? "animate-in slide-in-from-right" : "animate-out slide-out-to-right"
        } duration-300`}>

        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-hooke-900" strokeWidth={1.5} />
            <h2 className="text-sm font-black uppercase tracking-widest text-hooke-900">Sua Sacola ({items.length})</h2>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-50 transition-colors text-gray-500 hover:text-black">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" strokeWidth={1} />
              <p className="text-xs uppercase tracking-widest font-bold">Sua sacola está vazia</p>
              <button
                onClick={closeCart}
                className="text-xs border-b border-black pb-1 uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Imagem (Quadrada/Sharp) */}
                <div className="relative w-20 h-24 bg-gray-50 flex-shrink-0 border border-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info do Produto */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xs font-bold text-hooke-900 uppercase leading-tight tracking-wide max-w-[140px]">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                      Tamanho: <span className="text-black font-bold">{item.selectedSize}</span> | Qtd: {item.quantity}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <span className="text-sm font-bold text-hooke-900">
                      {formatter.format(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé (Checkout) */}
        {items.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">

            <div className="flex justify-between items-end text-hooke-900">
              <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Total Estimado</span>
              <span className="text-xl font-black tracking-tight">{formatter.format(subTotal)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-hooke-900 text-white py-4 font-bold uppercase tracking-[0.15em] text-xs hover:bg-black transition-all flex items-center justify-center gap-3 group"
            >
              <MessageCircle size={16} /> Finalizar no WhatsApp <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[10px] text-center text-gray-400 leading-tight">
              Frete e pagamento combinados diretamente com nosso time.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}