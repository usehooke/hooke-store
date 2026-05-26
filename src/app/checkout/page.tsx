import React, { Suspense } from "react";
import { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Finalizar Pedido | Hooke",
  description: "Conclua seu pedido de forma segura. Pagamento via MercadoPago — Pix, cartão de crédito e débito.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[9px] font-black tracking-[0.4em] uppercase text-zinc-400 mb-4">HOOKE CHECKOUT</p>
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
