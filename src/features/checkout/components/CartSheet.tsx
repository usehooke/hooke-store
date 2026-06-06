"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ShoppingBag, CreditCard, X } from "lucide-react";
import { 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetClose, 
  SheetFooter 
} from "@/components/ui/sheet";
import { useCartStore, selectCartSubTotal } from "@/store/cart-store";
import { brandConfig } from "@/config/brandConfig";

// 🏎️ Módulos de Elite (Lazy Loaded para Performance Máxima)
const CartItemsList = dynamic(() => import("./sections/CartItemsList"), { ssr: false });
const ShippingSection = dynamic(() => import("./sections/ShippingSection"), { ssr: false });
const CouponSection = dynamic(() => import("./sections/CouponSection"), { ssr: false });
const CartSummary = dynamic(() => import("./sections/CartSummary"), { ssr: false });
const CheckoutForm = dynamic(() => import("./sections/CheckoutForm"), { 
  ssr: false,
  loading: () => <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">Carregando Smart Checkout...</div>
});

// Componente Smart Suggestions (Mantido como dinâmico se existir)
const SmartSuggestions = dynamic(() => import("@/components/shop/SmartSuggestions"), { ssr: false });
const FreeShippingBar = dynamic(() => import("@/components/shop/FreeShippingBar"), { ssr: false });

export function CartSheet() {
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore(state => state.items);
  const subtotal = useCartStore(selectCartSubTotal);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    setHydrated(useCartStore.persist.hasHydrated());
    const unsub = useCartStore.persist.onFinishHydration(() => setHydrated(true));
    return () => unsub();
  }, []);

  if (!hydrated) return <div className="h-[1px] w-full opacity-0" />;

  const handleWhatsAppCheckout = () => {
    // Lógica simplificada de WhatsApp movida para utilitário ou mantida aqui por conveniência
    const whatsappNumber = brandConfig.contact.whatsapp.number;
    let message = "*Olá, Hooke!* Gostaria de finalizar meu pedido:\n\n";
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${item.selectedSize}) - R$ ${item.price}\n`;
    });
    message += `\n*Subtotal: R$ ${subtotal.toFixed(2)}*`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <SheetHeader className="border-b border-hooke-100 flex-shrink-0 px-6 py-6 pb-4 flex flex-row items-center justify-between">
        <SheetTitle className="text-xl font-bold text-hooke-900 uppercase tracking-tighter">Sacola</SheetTitle>
        <SheetDescription className="sr-only">Seu carrinho de compras Hooke.</SheetDescription>
        <SheetClose 
          className="opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          aria-label="Fechar Sacola"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </SheetClose>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-6 px-6 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="bg-white p-8 rounded-none">
              <ShoppingBag size={48} className="text-hooke-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-hooke-900 uppercase tracking-widest">Sua sacola está vazia</h3>
              <p className="text-sm text-gray-400 font-medium">O minimalismo essencial te espera.</p>
            </div>
            <SheetClose asChild>
              <button className="bg-hooke-900 text-white px-8 py-3 text-xs font-black tracking-widest uppercase hover:bg-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
                Explorar Coleção
              </button>
            </SheetClose>
          </div>
        ) : (
          <div className="space-y-10">
            <FreeShippingBar subtotal={subtotal} />
            <CartItemsList />
            <ShippingSection />
            <CouponSection />
            <SmartSuggestions />
          </div>
        )}
      </div>

      {/* OVERLAY DE CHECKOUT RÁPIDO (LAZY LOADED) */}
      {isCheckoutOpen && items.length > 0 && (
        <div className="absolute inset-0 z-50 bg-white">
          <CheckoutForm onClose={() => setIsCheckoutOpen(false)} />
        </div>
      )}

      {items.length > 0 && !isCheckoutOpen && (
        <SheetFooter className="border-t border-hooke-100 px-6 py-6">
          <div className="w-full flex flex-col gap-4">
            <CartSummary />
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full h-16 bg-black text-white flex items-center justify-center gap-3 text-sm font-bold tracking-[0.2em] uppercase hover:bg-zinc-900 transition-all border border-black shadow-sharp focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <CreditCard size={18} aria-hidden="true" />
                Finalizar Compra
              </button>
              
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-4 text-black border border-black/10 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                WhatsApp Checkout
              </button>
            </div>
          </div>
        </SheetFooter>
      )}
    </div>
  );
}
