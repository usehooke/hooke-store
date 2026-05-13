"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2, X, Truck, Check } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, facebookProvider } from "@/lib/firebase";
import { useCartStore, selectCartSubTotal, selectCartPromoDiscount } from "@/store/cart-store";
import { brandConfig } from "@/config/brandConfig";
import { trackEvent } from "@/lib/analytics";
import ShippingSection from "./ShippingSection";

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

interface CheckoutFormProps {
  onClose: () => void;
}

export default function CheckoutForm({ onClose }: CheckoutFormProps) {
  const { 
    items, 
    customer, 
    setCustomer, 
    shippingMethod, 
    shippingCost, 
    shippingZipCode,
    appliedCoupon
  } = useCartStore();

  const subtotal = useCartStore(selectCartSubTotal);
  const promoDiscount = useCartStore(selectCartPromoDiscount);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  // Totais (Cálculo Seguro) - Nota: O desconto de cupom será aplicado aqui se necessário
  // Por enquanto mantendo a lógica de valor fixo ou percentual vindo da store/api
  const totalGeral = subtotal - promoDiscount + (shippingCost || 0);

  // --- PERSISTÊNCIA REATIVA (META CAPI ABANDONMENT) ---
  useEffect(() => {
    if (customer.phone.length >= 14 && items.length > 0) {
       const timer = setTimeout(() => {
          fetch("/api/analytics/capi", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               eventName: "InitiateCheckout",
               userData: { phone: customer.phone.replace(/\D/g, ''), em: customer.email, fn: customer.name },
               customData: { value: totalGeral, currency: "BRL", content_ids: items.map(i => i.id) }
             })
          }).catch(() => {});
       }, 2500);
       return () => clearTimeout(timer);
    }
  }, [customer.phone, items, totalGeral, customer.name, customer.email]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    if (value.length > 9) value = value.replace(/(\d{5})(\d)/, "$1-$2");
    setCustomer({ phone: value.substring(0, 15) });
  };

  const handleFacebookCheckoutFill = async () => {
    if (!auth) {
        setError("Serviço Meta temporariamente indisponível.");
        return;
    }
    setIsFacebookLoading(true);
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        setCustomer({
            name: user.displayName || customer.name,
            email: user.email || customer.email,
        });
    } catch (err) {
        console.error("Meta Auth Error:", err);
    } finally {
        setIsFacebookLoading(false);
    }
  };

  const handleMercadoPagoCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || customer.phone.length < 14) {
      setError("Preencha Nome e WhatsApp para prosseguir.");
      return;
    }
    if (!shippingMethod || !shippingCost) {
      setError("Calcule e selecione um frete primeiro.");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const payload = {
        customer: { ...customer, address: { zip_code: shippingZipCode, street_name: "", street_number: "", neighborhood: "", city: "", state: "" } },
        shippingValue: shippingCost,
        shippingMethod,
        shippingZipcode: shippingZipCode,
        discountValue: promoDiscount,
        couponCode: appliedCoupon || "",
        items: items.map(item => ({ ...item, id: item.id, title: item.name, unit_price: item.price, quantity: item.quantity }))
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro no checkout");
      if (data.init_point) window.location.href = data.init_point;
    } catch (err) {
      setError("Falha ao gerar link de pagamento. Tente novamente.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 md:p-10 animate-in slide-in-from-bottom-8 duration-500">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
      >
        <X size={24} />
      </button>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <header className="mb-8">
          <h3 className="text-3xl font-black text-hooke-900 tracking-tighter leading-none mb-3">
            Finalize seu <br/> Pedido de Elite
          </h3>
          <p className="text-sm text-gray-500 font-medium"> Total estimado: <strong className="text-black">{formatter.format(totalGeral)}</strong></p>
        </header>

        <button
          type="button"
          onClick={handleFacebookCheckoutFill}
          disabled={isFacebookLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-black tracking-widest py-4 mb-8 text-[10px] uppercase hover:bg-[#145dbf] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
        >
          <FaFacebook size={18} />
          {isFacebookLoading ? "Puxando dados..." : "Preenchimento 1-Clique (Meta)"}
        </button>

        <form onSubmit={handleMercadoPagoCheckout} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-[0.2em] text-hooke-900 uppercase">Seu Nome Completo</label>
            <input
              type="text"
              required
              value={customer.name}
              onChange={(e) => setCustomer({ name: e.target.value })}
              className="w-full border-b-2 border-hooke-900 px-0 py-3 text-sm focus:outline-none focus:border-hooke-500 transition-colors bg-transparent rounded-none font-bold"
              placeholder="Ex: Nando Hooke"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-[0.2em] text-hooke-900 uppercase">WhatsApp</label>
            <input
              type="tel"
              required
              value={customer.phone}
              onChange={handlePhoneChange}
              className="w-full border-b-2 border-hooke-900 px-0 py-3 text-sm focus:outline-none focus:border-hooke-500 transition-colors bg-transparent rounded-none font-bold"
              placeholder="(11) 90000-0000"
            />
          </div>

          {(!shippingMethod || !shippingCost) && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <ShippingSection />
            </div>
          )}

          <div className="flex items-start gap-3 py-2">
            <div className="relative flex items-center">
               <input
                type="checkbox"
                id="vip-list"
                checked={customer.isVip}
                onChange={(e) => setCustomer({ isVip: e.target.checked })}
                className="peer h-5 w-5 cursor-pointer appearance-none border-2 border-hooke-900 rounded-none checked:bg-hooke-900 transition-all"
              />
              <Check className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5" />
            </div>
            <label htmlFor="vip-list" className="text-[10px] text-gray-500 font-bold leading-tight cursor-pointer uppercase tracking-tighter">
              Quero entrar para a <strong className="text-black">Lista VIP</strong> e receber bastidores e lançamentos exclusivos.
            </label>
          </div>

          {error && (
            <div className="bg-red-50 p-3 border-l-4 border-red-500">
               <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-black text-white px-8 py-5 flex items-center justify-center gap-3 rounded-none text-xs font-black tracking-[0.3em] uppercase hover:bg-hooke-900 transition-all disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
            {isProcessing ? 'PROCESSANDO...' : 'FINALIZAR PAGAMENTO'}
          </button>
          
          <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest opacity-60">
            Checkout Seguro & Criptografado
          </p>
        </form>
      </div>
    </div>
  );
}
