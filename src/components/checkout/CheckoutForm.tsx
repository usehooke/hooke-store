"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCartStore,
  selectCartSubTotal,
  selectCartPromoDiscount,
  selectCartFinalTotal,
} from "@/store/cart-store";
import { toast } from "sonner";
import { Minus, Plus, Trash2, ChevronDown, Loader2, ArrowRight, Package, ShieldCheck } from "lucide-react";

const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type ShippingOption = {
  method: string;
  label: string;
  cost: number;
  days: string;
};

export default function CheckoutForm({ expressProduct, expressSize }: { expressProduct?: any; expressSize?: string }) {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    customer,
    setCustomer,
    shippingZipCode,
    shippingCost,
    shippingMethod,
    setShipping,
    appliedCoupon,
    addItem
  } = useCartStore();

  const subtotal = useCartStore(selectCartSubTotal);
  const promoDiscount = useCartStore(selectCartPromoDiscount);
  const finalTotal = useCartStore(selectCartFinalTotal);

  const [cep, setCep] = useState(shippingZipCode || "");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(
    shippingMethod && shippingCost ? { method: shippingMethod, label: shippingMethod, cost: shippingCost, days: "" } : null
  );
  const [isFetchingShipping, setIsFetchingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [hasInitializedExpress, setHasInitializedExpress] = useState(false);

  const handleChangeItemSize = (item: any, newSize: string) => {
    // Remove o item com tamanho antigo do carrinho
    removeItem(item.cartItemId);
    
    // Calcula a nova chave única do item no carrinho
    const uniqueId = item.selectedColor ? `${item.id}-${item.selectedColor}-${newSize}` : `${item.id}-${newSize}`;
    
    const currentItems = useCartStore.getState().items;
    const filtered = currentItems.filter(x => x.cartItemId !== item.cartItemId);
    const existing = filtered.find(x => x.cartItemId === uniqueId);
    
    if (existing) {
      existing.quantity += item.quantity;
      useCartStore.setState({ items: [...filtered] });
    } else {
      const newItem = {
        ...item,
        selectedSize: newSize,
        cartItemId: uniqueId,
      };
      useCartStore.setState({ items: [...filtered, newItem] });
    }
    toast.success(`Tamanho alterado para ${newSize}`, {
      style: { borderRadius: 0, background: "#000", color: "#fff", border: "none" }
    });
  };

  // Inicialização atômica do Checkout Express
  useEffect(() => {
    async function initExpress() {
      // 1. Força a reidratação do Zustand do IndexedDB
      await useCartStore.persist.rehydrate();
      
      // 2. Se temos produto express do Swipe Up do Story, injeta no carrinho
      if (expressProduct) {
        console.log("[Checkout Express] Injetando produto no carrinho Zustand:", expressProduct.name);
        clearCart();
        addItem(expressProduct, expressSize || "G");
      }
      
      setHasInitializedExpress(true);
    }
    
    initExpress();
  }, [expressProduct, expressSize]);

  // Redireciona se carrinho vazio (apenas após inicializar e hidratar)
  useEffect(() => {
    if (hasInitializedExpress && items.length === 0) {
      router.push("/");
    }
  }, [items, hasInitializedExpress, router]);

  const handleCepFetch = async (rawCep: string) => {
    const clean = rawCep.replace(/\D/g, "");
    if (clean.length !== 8) return;

    setIsFetchingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: clean, items }),
      });

      if (res.ok) {
        const data = await res.json();
        const options: ShippingOption[] = data.options || [
          { method: "SEDEX", label: "SEDEX (1-3 dias úteis)", cost: data.sedex || 29.9, days: "1-3 dias úteis" },
          { method: "PAC", label: "PAC (5-10 dias úteis)", cost: data.pac || 14.9, days: "5-10 dias úteis" },
        ];
        setShippingOptions(options);
        // Auto-seleciona o mais barato
        const cheapest = options.reduce((a, b) => (a.cost <= b.cost ? a : b));
        setSelectedShipping(cheapest);
        setShipping(clean, cheapest.cost, cheapest.method);
      } else {
        // Fallback manual
        const fallback: ShippingOption[] = [
          { method: "SEDEX", label: "SEDEX", cost: 29.9, days: "1-3 dias úteis" },
          { method: "PAC", label: "PAC", cost: 14.9, days: "5-10 dias úteis" },
        ];
        setShippingOptions(fallback);
        setSelectedShipping(fallback[1]);
        setShipping(clean, fallback[1].cost, fallback[1].method);
      }
    } catch {
      toast.error("Erro ao calcular frete. Verifique o CEP.", {
        style: { borderRadius: 0, background: "#000", color: "#fff", border: "none" },
      });
    } finally {
      setIsFetchingShipping(false);
    }
  };

  const handleSelectShipping = (option: ShippingOption) => {
    setSelectedShipping(option);
    setShipping(cep, option.cost, option.method);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customer.name.trim()) errors.name = "Nome obrigatório";
    if (!customer.email.trim() || !/\S+@\S+\.\S+/.test(customer.email)) errors.email = "E-mail inválido";
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, "").length < 10) errors.phone = "Telefone inválido";
    if (!selectedShipping) errors.shipping = "Selecione uma opção de frete";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Preencha todos os campos obrigatórios.", {
        style: { borderRadius: 0, background: "#000", color: "#fff", border: "none" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items: items.map((item) => ({
          id: item.id,
          title: item.name,
          size: item.selectedSize,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        shippingValue: selectedShipping?.cost || 0,
        shippingMethod: selectedShipping?.method || "",
        shippingZipcode: cep,
        discountValue: promoDiscount,
        couponCode: appliedCoupon || "",
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao gerar link de pagamento.");
      }

      // Limpa o carrinho após criar o pedido
      clearCart();

      // Redireciona para o MercadoPago
      window.location.href = data.init_point;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Tente novamente.";
      toast.error(`Falha no checkout: ${message}`, {
        style: { borderRadius: 0, background: "#000", color: "#fff", border: "none" },
      });
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  const grandTotal = finalTotal + (selectedShipping?.cost || 0);
  const installment = (grandTotal / 3).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-['Inter'] pt-20 pb-32 md:pb-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1100px] mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-[9px] font-black tracking-[0.4em] text-zinc-400 uppercase mb-2">HOOKE CHECKOUT</p>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black">
            Finalizar Pedido
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── COLUNA ESQUERDA: FORMULÁRIO ── */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* [1] ITENS DO CARRINHO */}
            <section className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-5 md:p-6">
              <h2 className="text-[10px] font-black tracking-[0.3em] uppercase border-b-2 border-black pb-3 mb-4">
                Seu Carrinho · {items.length} {items.length === 1 ? "item" : "itens"}
              </h2>

              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-3 items-start">
                    {/* Foto */}
                    <div className="relative w-16 h-20 bg-zinc-100 shrink-0 border border-black/10 overflow-hidden">
                      {item.imageUrl ? (
                        <CldImage src={item.imageUrl} alt={item.name} fill className="object-cover object-top" deliveryType="fetch" format="avif" quality="auto" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-tight leading-tight truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1 mb-1">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Tamanho:</span>
                        <select
                          value={item.selectedSize}
                          onChange={(e) => handleChangeItemSize(item, e.target.value)}
                          className="rounded-none border border-black text-[10px] font-black uppercase px-2 py-0.5 bg-white focus:outline-none cursor-pointer hover:bg-zinc-50 transition-colors"
                        >
                          {(item.department === "feminino" ? ["PP", "P", "M", "G", "GG"] : ["P", "M", "G", "GG", "XG", "G1", "G2"]).map((sz) => (
                            <option key={sz} value={sz}>{sz}</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-[11px] font-black mt-1">{formatter.format(item.price)}</p>

                      {/* Controles de Quantidade */}
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1} className="w-7 h-7 border border-black flex items-center justify-center text-black disabled:opacity-30 hover:bg-black hover:text-white transition-colors">
                          <Minus size={11} />
                        </button>
                        <span className="text-[11px] font-black w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-7 h-7 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                          <Plus size={11} />
                        </button>
                        <button onClick={() => removeItem(item.cartItemId)} className="ml-2 text-zinc-400 hover:text-black transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="text-[12px] font-black shrink-0">{formatter.format(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Promoção Kit */}
              {promoDiscount > 0 && (
                <div className="mt-4 border-t-2 border-black pt-3">
                  <div className="bg-black text-white px-3 py-2 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest">🎁 Kit Hooke Ativo</span>
                    <span className="text-[11px] font-black">- {formatter.format(promoDiscount)}</span>
                  </div>
                </div>
              )}
            </section>

            {/* [2] FRETE */}
            <section className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-5 md:p-6">
              <h2 className="text-[10px] font-black tracking-[0.3em] uppercase border-b-2 border-black pb-3 mb-4 flex items-center gap-2">
                <Package size={13} /> Entrega
              </h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 8);
                    setCep(v);
                    if (v.length === 8) handleCepFetch(v);
                  }}
                  placeholder="Digite seu CEP"
                  className="flex-1 border-2 border-black bg-black/5 px-3 py-2.5 text-sm font-bold focus:outline-none placeholder-zinc-400"
                  maxLength={8}
                />
                <button
                  onClick={() => handleCepFetch(cep)}
                  disabled={isFetchingShipping || cep.length < 8}
                  className="px-4 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-40 flex items-center gap-1.5"
                >
                  {isFetchingShipping ? <Loader2 size={13} className="animate-spin" /> : "CALCULAR"}
                </button>
              </div>

              <AnimatePresence>
                {shippingOptions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3 flex flex-col gap-2"
                  >
                    {shippingOptions.map((opt) => (
                      <button
                        key={opt.method}
                        onClick={() => handleSelectShipping(opt)}
                        className={`w-full flex justify-between items-center p-3 border-2 transition-all text-left ${
                          selectedShipping?.method === opt.method
                            ? "border-black bg-black text-white"
                            : "border-black/20 hover:border-black bg-white"
                        }`}
                      >
                        <div>
                          <p className="text-[11px] font-black uppercase">{opt.method}</p>
                          <p className={`text-[10px] ${selectedShipping?.method === opt.method ? "text-white/70" : "text-zinc-500"}`}>{opt.days}</p>
                        </div>
                        <span className="text-[12px] font-black">{formatter.format(opt.cost)}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {formErrors.shipping && <p className="text-red-600 text-[10px] font-bold mt-2">{formErrors.shipping}</p>}
            </section>

            {/* [3] DADOS DO COMPRADOR */}
            <section className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-5 md:p-6">
              <h2 className="text-[10px] font-black tracking-[0.3em] uppercase border-b-2 border-black pb-3 mb-4 flex items-center gap-2">
                <ShieldCheck size={13} /> Seus Dados
              </h2>

              <div className="flex flex-col gap-4">
                {[
                  { key: "name", label: "Nome Completo", type: "text", placeholder: "Fernando Vautier" },
                  { key: "email", label: "E-mail", type: "email", placeholder: "seu@email.com" },
                  { key: "phone", label: "Telefone / WhatsApp", type: "tel", placeholder: "(11) 99999-9999" },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</label>
                    <input
                      type={type}
                      value={(customer as any)[key]}
                      onChange={(e) => setCustomer({ [key]: e.target.value })}
                      placeholder={placeholder}
                      className={`border-b-2 bg-transparent py-2 text-sm focus:outline-none placeholder-zinc-300 ${
                        formErrors[key] ? "border-red-500" : "border-black"
                      }`}
                    />
                    {formErrors[key] && <p className="text-red-600 text-[10px] font-bold">{formErrors[key]}</p>}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── COLUNA DIREITA: RESUMO + CTA (STICKY DESKTOP) ── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 flex flex-col gap-4">

              {/* RESUMO FINANCEIRO */}
              <section className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-5 md:p-6">
                <h2 className="text-[10px] font-black tracking-[0.3em] uppercase border-b-2 border-black pb-3 mb-4">Resumo</h2>

                <div className="flex flex-col gap-2.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-600 font-medium">Subtotal</span>
                    <span className="font-black">{formatter.format(subtotal)}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span className="font-black">Kit Hooke</span>
                      <span className="font-black">- {formatter.format(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-zinc-600 font-medium">Frete</span>
                    <span className="font-black">
                      {selectedShipping ? formatter.format(selectedShipping.cost) : "—"}
                    </span>
                  </div>

                  <div className="h-px bg-black my-1" />

                  <div className="flex justify-between items-baseline">
                    <span className="text-[13px] font-black uppercase">Total</span>
                    <span className="text-[18px] font-black">{formatter.format(grandTotal)}</span>
                  </div>

                  <p className="text-[10px] text-zinc-400 text-right">
                    ou 3x de R$ {installment} sem juros
                  </p>
                </div>
              </section>

              {/* BOTÃO FINALIZAR */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-5 bg-black text-white font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> GERANDO LINK...</>
                ) : (
                  <><ArrowRight size={16} /> FINALIZAR E PAGAR</>
                )}
              </button>

              <p className="text-[9px] text-zinc-400 text-center font-medium">
                Você será redirecionado para o ambiente seguro do MercadoPago.
                Aceitamos Pix, cartão de crédito e débito.
              </p>

              {/* SELOS DE CONFIANÇA */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {["🔒 Pagamento Seguro", "📦 Envio Imediato", "↩️ Troca Fácil"].map((v) => (
                  <div key={v} className="text-[8px] font-black uppercase tracking-wide text-zinc-500 leading-tight p-2 border border-black/10">
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BUY MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t-2 border-black px-4 py-3"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-black text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <><Loader2 size={14} className="animate-spin" /> PROCESSANDO...</>
          ) : (
            <><ArrowRight size={14} /> FINALIZAR · {formatter.format(grandTotal)}</>
          )}
        </button>
      </div>
    </div>
  );
}
