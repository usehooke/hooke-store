"use client";

import { useCartStore, selectCartSubTotal, selectCartPromoDiscount } from "@/store/cart-store";
import { Tag } from "lucide-react";

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function CartSummary() {
  const { shippingCost, shippingMethod, appliedCoupon } = useCartStore();
  const subtotal = useCartStore(selectCartSubTotal);
  const promoDiscount = useCartStore(selectCartPromoDiscount);
  
  // O desconto do cupom na Hooke é aplicado APÓS os descontos de Kit (acumulativo positivo)
  // Por enquanto, o cupom é fixo em termos de aplicação no subtotal corrigido
  // TODO: Integrar lógica de Cupom % ou Fixo na store v3.1
  const activeDiscountValue = 0; // Isso viria do estado do cupom se fosse reativo global
  const couponDiscount = appliedCoupon ? (subtotal - promoDiscount) * activeDiscountValue : 0;
  
  const totalGeral = subtotal - promoDiscount - couponDiscount + (shippingCost || 0);

  return (
    <div className="space-y-3 py-6 border-t border-hooke-100">
      <div className="flex justify-between text-sm font-bold text-hooke-900 tracking-widest uppercase">
        <p>Subtotal</p>
        <p>{formatter.format(subtotal)}</p>
      </div>
      
      {promoDiscount > 0 && (
        <div className="flex justify-between text-sm font-bold text-green-600 tracking-widest uppercase items-center">
          <div className="flex items-center gap-2">
            <Tag size={14} />
            <span>Pacote Promo (Kit)</span>
          </div>
          <p>- {formatter.format(promoDiscount)}</p>
        </div>
      )}

      {couponDiscount > 0 && (
        <div className="flex justify-between text-sm font-bold text-green-600 tracking-widest uppercase">
          <p>Cupom ({appliedCoupon})</p>
          <p>- {formatter.format(couponDiscount)}</p>
        </div>
      )}

      {shippingCost !== null && (
        <div className="flex justify-between text-sm font-bold text-hooke-900 tracking-widest uppercase">
          <p>Frete ({shippingMethod})</p>
          <p>{formatter.format(shippingCost)}</p>
        </div>
      )}

      <div className="flex justify-between text-xl font-black text-hooke-900 tracking-tighter border-t border-hooke-100 pt-4 mt-2">
        <p>Total</p>
        <p>{formatter.format(totalGeral)}</p>
      </div>
    </div>
  );
}
