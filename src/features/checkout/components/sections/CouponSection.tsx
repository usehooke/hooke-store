"use client";

import { useState } from "react";
import { Loader2, X, Tag } from "lucide-react";
import { useCartStore, selectCartSubTotal, selectCartPromoDiscount } from "@/store/cart-store";

export default function CouponSection() {
  const { appliedCoupon, setCoupon } = useCartStore();
  const subtotal = useCartStore(selectCartSubTotal);
  const promoDiscount = useCartStore(selectCartPromoDiscount);

  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);

  const applyCoupon = async () => {
    if (!input) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input })
      });
      const data = await res.json();
      
      if (res.ok && data.valid) {
        setCoupon(input.toUpperCase());
        setDiscountValue(data.discount);
      } else {
        setError(data.message || "Cupom inválido");
        setCoupon(null);
      }
    } catch {
      setError("Erro ao validar cupom.");
      setCoupon(null);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setInput("");
    setError("");
    setDiscountValue(0);
  };

  return (
    <div className="border-t border-hooke-100 pt-6 mt-4">
      <label className="text-[10px] font-black tracking-[0.2em] text-hooke-900 uppercase block mb-3">
        Possui um cupom?
      </label>
      
      {!appliedCoupon ? (
        <div className="animate-in fade-in duration-300">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="CÓDIGO"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              className="flex-1 border border-hooke-200 px-4 py-3 text-sm focus:outline-none focus:border-hooke-900 focus:ring-1 focus:ring-hooke-900 rounded-none bg-white font-bold placeholder:font-normal placeholder:lowercase transition-all"
            />
            <button
              onClick={applyCoupon}
              disabled={!input || isLoading}
              className="bg-hooke-900 text-white px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-black transition-all rounded-none disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Aplicar"}
            </button>
          </div>
          {error && <p className="text-[10px] text-red-500 font-bold mt-2 animate-pulse">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center justify-between border-2 border-green-500 bg-green-50 px-4 py-3 animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute -inset-2 bg-gradient-to-r from-green-300 to-transparent opacity-10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-green-500 text-white p-1 rounded-sm shadow-sm">
              <Tag size={12} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-green-900 tracking-widest">{appliedCoupon}</span>
              <span className="text-[10px] text-green-700 font-bold uppercase tracking-tighter">Benefício Ativado</span>
            </div>
          </div>
          <button onClick={removeCoupon} className="text-green-900 hover:text-red-500 transition-colors p-1 relative z-10">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
