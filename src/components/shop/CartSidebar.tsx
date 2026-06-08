// components/shop/CartSidebar.tsx
"use client";

import { useCartStore, selectCartSubTotal, selectCartPromoDiscount, selectCartFinalTotal } from "@/store/cart-store";
import { X, Trash2, ShoppingBag, ArrowRight, Tag, CupSoda } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { trackEvent } from "@/lib/analytics";
import FreeShippingBar from "./FreeShippingBar";
import SmartSuggestions from "./SmartSuggestions";

// Formatter criado FORA do componente para evitar recalcular a cada render
const formatter = new Intl.NumberFormat("pt-BR", {
 style: "currency",
 currency: "BRL",
});

export default function CartSidebar() {
 const [mounted, setMounted] = useState(false);
 const router = useRouter();

 // Pegar o estado do Zustand
 const items = useCartStore((state) => state.items);
 const removeItem = useCartStore((state) => state.removeItem);
 const isOpen = useCartStore((state) => state.isOpen);
 const closeCart = useCartStore((state) => state.closeCart);
 const subTotal = useCartStore(selectCartSubTotal);
 const promoDiscount = useCartStore(selectCartPromoDiscount);
 const finalTotal = useCartStore(selectCartFinalTotal);

 // Só renderizar no cliente
 useEffect(() => {
 setMounted(true);
 }, []);

 const handleCheckout = () => {
    // Analytics
    trackEvent('InitiateCheckout', {
      value: finalTotal,
      currency: 'BRL',
      content_ids: items.map(i => i.id),
      content_type: 'product'
    });

    closeCart();
    router.push('/checkout/concierge');
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
 <h2 className="text-sm font-black tracking-widest text-hooke-900">Sua Sacola ({items.length})</h2>
 </div>
 <button onClick={closeCart} className="p-2 hover:bg-gray-50 transition-colors text-gray-500 hover:text-black">
 <X className="w-5 h-5" strokeWidth={1.5} />
 </button>
 </div>

 {/* Lista de Itens */}
 <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
 <FreeShippingBar subtotal={subTotal} />
 
 {items.length === 0 ? (
 <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
 <ShoppingBag className="w-12 h-12 opacity-20" strokeWidth={1} />
 <p className="text-xs tracking-widest font-bold">Sua sacola está vazia</p>
 <Button
  variant="link"
  onClick={closeCart}
 >
  Continuar Comprando
 </Button>
 </div>
 ) : (
 items.map((item) => (
 <div key={item.cartItemId} className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
 {/* Imagem (Quadrada/Sharp) */}
 <div className="relative w-20 h-24 bg-gray-50 flex-shrink-0 border border-gray-100">
 <Image
 priority src={item.imageUrl}
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
 <h3 className="text-xs font-bold text-hooke-900 leading-tight tracking-wide max-w-[140px]">
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
 <p className="text-[10px] text-gray-500 tracking-widest mt-1">
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

 {items.length > 0 && <SmartSuggestions />}
 </div>

 {/* Rodapé (Checkout) */}
 {items.length > 0 && (
 <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">

 {promoDiscount > 0 && (
 <div className="flex justify-between items-center text-green-600 mb-2 animate-in fade-in slide-in-from-bottom-2">
 <div className="flex items-center gap-1">
 <Tag size={12} />
 <span className="text-[10px] tracking-widest font-bold">Pacote Promo (Kit)</span>
 </div>
 <span className="text-sm font-bold">-{formatter.format(promoDiscount)}</span>
 </div>
 )}

  <div className="flex justify-between items-end text-hooke-900">
  <span className="text-xs tracking-widest font-bold text-gray-500">Total Estimado</span>
  <span className="text-xl font-black tracking-tight">{formatter.format(finalTotal)}</span>
  </div>

  <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 mt-2">
    <span className="text-[10px] tracking-widest font-black uppercase">No PIX (5% OFF)</span>
    <span className="text-sm font-black">{formatter.format(finalTotal * 0.95)}</span>
  </div>

   <Button
   variant="buy"
   size="xl"
   fullWidth
   onClick={handleCheckout}
   className="gap-3 group"
   >
   <CupSoda size={14} className="group-hover:rotate-12 transition-transform" /> Acessar Concierge Hooke <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
   </Button>

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
