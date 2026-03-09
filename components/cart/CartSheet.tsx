// components/cart/CartSheet.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X, CreditCard, Loader2, Facebook } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, facebookProvider } from "@/lib/firebase";
import { brandConfig } from "@/config/brandConfig";
import { trackEvent } from "@/lib/analytics";
import FreeShippingBar from "@/components/shop/FreeShippingBar";
import SmartSuggestions from "@/components/shop/SmartSuggestions";

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";

import { useCartStore, selectCartSubTotal, selectCartPromoDiscount } from "@/store/cart-store";
import { Tag } from "lucide-react";

export default function CartSheet() {
  // Estado e ações reativas da store
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const shippingCost = useCartStore(state => state.shippingCost);
  const shippingMethod = useCartStore(state => state.shippingMethod);
  const shippingZipCode = useCartStore(state => state.shippingZipCode);
  const setShipping = useCartStore(state => state.setShipping);

  const appliedCoupon = useCartStore(state => state.appliedCoupon);
  const setCoupon = useCartStore(state => state.setCoupon);

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const subtotal = useCartStore(selectCartSubTotal);
  const promoDiscount = useCartStore(selectCartPromoDiscount);

  // --- ESTADOS DO CHECKOUT ---
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", isVip: true });
  const [checkoutError, setCheckoutError] = useState("");
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const handleFacebookCheckoutFill = async () => {
    setIsFacebookLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      setCustomer(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        // Telefones via Firebase Auth Meta normalmente são nulos, mas passamos caso tenha.
        phone: user.phoneNumber || prev.phone,
      }));
    } catch (error) {
      console.error("Erro ao puxar dados da Meta", error);
      // Opcional: Avisar falha
    } finally {
      setIsFacebookLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    if (value.length > 9) value = value.replace(/(\d{5})(\d)/, "$1-$2");
    setCustomer({ ...customer, phone: value.substring(0, 15) });
  };

  // --- ESTADOS DO FRETE ---
  const [zipInput, setZipInput] = useState(shippingZipCode || "");
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<Array<{ nome: string, valor: string, prazo: string }>>([]);
  const [shippingError, setShippingError] = useState("");

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    setZipInput(value.substring(0, 9));
  };

  const calculateShipping = async () => {
    if (zipInput.length !== 9) {
      setShippingError("Digite um CEP válido.");
      return;
    }
    setShippingError("");
    setIsCalculatingShipping(true);

    // Peso: 300g (0.3kg) por item. Mínimo de 0.3kg.
    const calculatedWeight = Math.max(0.3, items.reduce((acc, item) => acc + (0.3 * item.quantity), 0));

    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cepDestino: zipInput, peso: calculatedWeight.toString() })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fallbackWhatsApp) {
          setShippingError("FALLBACK_WHATSAPP");
          return;
        }
        throw new Error(data.message || "Erro ao calcular");
      }

      setShippingOptions(data.fretes);
    } catch (err: unknown) {
      setShippingError("Serviço indisponível ou CEP inválido.");
      console.error(err);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleSelectShipping = (nome: string, valor: string) => {
    setShipping(zipInput, Number(valor), nome);
  };

  // --- ESTADOS DO CUPOM ---
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const applyCoupon = () => {
    if (!couponInput) return;
    if (couponInput.trim().toUpperCase() === "MAVERICK10") {
      setCoupon("MAVERICK10");
      setCouponError("");
    } else {
      setCoupon(null);
      setCouponError("Cupom inválido ou expirado.");
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const couponDiscount = appliedCoupon === "MAVERICK10" ? (subtotal - promoDiscount) * 0.1 : 0;
  const totalGeral = subtotal - promoDiscount - couponDiscount + (shippingCost || 0);

  // --- CONFIGURAÇÃO DO WHATSAPP ---
  const whatsappNumber = brandConfig.contact.whatsapp.number;
  // --------------------------------

  // --- FUNÇÃO QUE GERA O LINK DO ZAP ---
  const handleWhatsAppCheckout = () => {
    // Analytics
    trackEvent('InitiateCheckout', {
      value: totalGeral,
      currency: 'BRL',
      content_ids: items.map(i => i.id),
      content_type: 'product'
    });

    let message = "*Olá, Hooke!* Gostaria de finalizar o seguinte pedido:\n\n";
    items.forEach((item) => {
      const itemTotal = formatter.format(item.price * item.quantity);
      message += `- ${item.quantity}x ${item.name} (Tamanho: ${item.selectedSize}${item.selectedColor ? `, Cor: ${item.selectedColor}` : ''}) - ${itemTotal}\n`;
    });
    message += `\n*Subtotal: ${formatter.format(subtotal)}*`;
    if (promoDiscount > 0) {
      message += `\n*Desconto Kit: -${formatter.format(promoDiscount)}* 🏷️`;
    }
    if (shippingCost) {
      message += `\n*Frete (${shippingMethod}): ${formatter.format(shippingCost)}*`;
    }
    if (couponDiscount > 0) {
      message += `\n*Cupom (${appliedCoupon}): -${formatter.format(couponDiscount)}*`;
    }
    message += `\n*Total estimado: ${formatter.format(totalGeral)}*`;
    message += "\n\nAguardo retorno para combinar pagamento e envio.";
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };
  // ------------------------------------

  const handleMercadoPagoCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || customer.phone.length < 14) {
      setCheckoutError("Preencha seu Nome e WhatsApp corretamente para prosseguir.");
      return;
    }
    if (!shippingMethod || !shippingCost) {
      setCheckoutError("Por favor, calcule e selecione um frete antes de prosseguir.");
      return;
    }

    // Analytics
    trackEvent('InitiateCheckout', {
      value: totalGeral,
      currency: 'BRL',
      content_ids: items.map(i => i.id),
      content_type: 'product'
    });

    setCheckoutError("");
    setIsProcessing(true);

    try {
      const payload = {
        customer: {
          ...customer,
          address: { zip_code: shippingZipCode, street_name: "", street_number: "", neighborhood: "", city: "", state: "" }
        },
        shippingValue: shippingCost,
        shippingMethod: shippingMethod,
        shippingZipcode: shippingZipCode,
        discountValue: promoDiscount + couponDiscount,
        couponCode: appliedCoupon || "",
        items: items.map(item => ({
          cartItemId: item.cartItemId,
          id: item.id,
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor || "",
          imageUrl: item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : "")
        }))
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro no checkout");

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error("Link não retornado");
      }
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : err);
      setCheckoutError("Houve um erro ao processar seu pagamento. Tente novamente.");
      setIsProcessing(false);
    }
  };

  // NOTE: O componente Sheet agora é parte do CartSidebar, que controla sua visibilidade.
  // Este componente foca apenas no conteúdo da gaveta.

  return (
    <div className="flex flex-col h-full bg-white relative">
      <SheetHeader className="border-b border-hooke-100 flex-shrink-0 px-6 py-6 pb-4 flex flex-row items-center justify-between">
        <SheetTitle className="text-xl font-bold text-hooke-900">Seu Carrinho</SheetTitle>
        <SheetDescription className="sr-only">Sacola de compras com os seus itens selecionados.</SheetDescription>
        <SheetClose className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-hooke-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-hooke-100 data-[state=open]:text-hooke-500">
          <X className="h-6 w-6" />
          <span className="sr-only">Fechar</span>
        </SheetClose>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-6 px-6">
        <FreeShippingBar subtotal={subtotal} />
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="bg-hooke-50 p-6 rounded-full">
              <ShoppingBag size={48} className="text-hooke-300" />
            </div>
            <h3 className="text-lg font-medium text-hooke-900">Sua sacola está vazia</h3>
            <p className="text-sm text-hooke-500 max-w-xs">
              Que tal dar uma olhada nas novidades da coleção?
            </p>
            <SheetClose asChild>
              <Link href="/" className="mt-4 bg-hooke-900 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-wider hover:bg-hooke-800 transition-colors">
                Continuar Comprando
              </Link>
            </SheetClose>
          </div>
        ) : (
          <ul className="space-y-8">
            {items.map((item) => (
              <li key={item.cartItemId} className="flex gap-4">
                <div className="relative aspect-[4/5] w-24 flex-shrink-0 overflow-hidden rounded-sm bg-hooke-100 border border-hooke-200">
                  <Image
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
                      <p className="mt-1 text-sm text-hooke-500">Tamanho: {item.selectedSize}{item.selectedColor && ` | Cor: ${item.selectedColor}`}</p>
                    </div>
                    <p className="text-base font-bold text-hooke-900 text-right">
                      {formatter.format(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-end justify-between text-sm">
                    <div className="flex items-center border border-hooke-200 rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 text-hooke-500 hover:text-hooke-900 disabled:opacity-50 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 font-medium text-hooke-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-2 text-hooke-500 hover:text-hooke-900 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.cartItemId)}
                      className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && <SmartSuggestions />}
      </div>

      {/* OVERLAY DE CHECKOUT RÁPIDO */}
      {isCheckoutOpen && items.length > 0 && (
        <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col p-6 overflow-y-auto w-full h-full">
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mt-8 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <h3 className="text-2xl font-black text-hooke-900 uppercase tracking-tighter mb-2">Quase lá!</h3>
            <p className="text-sm text-gray-500 mb-6">Precisamos de dois dados rápidos para gerar seu pedido de <strong>{formatter.format(subtotal)}</strong> com segurança.</p>

            <button
              type="button"
              onClick={handleFacebookCheckoutFill}
              disabled={isFacebookLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 font-bold uppercase tracking-widest py-3 mb-6 text-[10px] hover:bg-[#1877F2]/20 transition-colors disabled:opacity-50 rounded-sm"
            >
              <Facebook size={16} fill="currentColor" stroke="none" />
              {isFacebookLoading ? "Puxando seus dados..." : "Preenchimento 1-Clique (Meta)"}
            </button>

            <form onSubmit={handleMercadoPagoCheckout} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900">Seu Nome Completo</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full border-b-2 border-hooke-900 px-0 py-2 text-sm focus:outline-none focus:border-hooke-500 transition-colors bg-transparent rounded-none"
                  placeholder="Ex: Nando Hooke"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900">Seu E-mail <span className="text-gray-400 font-normal lowercase tracking-normal">(opcional)</span></label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full border-b-2 border-hooke-900 px-0 py-2 text-sm focus:outline-none focus:border-hooke-500 transition-colors bg-transparent rounded-none"
                  placeholder="exemplo@gmail.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900">Seu WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={handlePhoneChange}
                  className="w-full border-b-2 border-hooke-900 px-0 py-2 text-sm focus:outline-none focus:border-hooke-500 transition-colors bg-transparent rounded-none"
                  placeholder="(11) 90000-0000"
                />
              </div>

              <div className="flex items-start gap-3 mt-6">
                <input
                  type="checkbox"
                  id="vip-list"
                  checked={customer.isVip}
                  onChange={(e) => setCustomer({ ...customer, isVip: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded-none border-gray-400 text-hooke-900 focus:ring-hooke-900 focus:ring-opacity-50 transition-colors cursor-pointer"
                />
                <label htmlFor="vip-list" className="text-[10px] sm:text-xs text-gray-500 leading-snug cursor-pointer">
                  Quero entrar para a <strong className="text-black uppercase">Lista VIP</strong> e receber bastidores, ensaios e lançamentos exclusivos via WhatsApp.
                </label>
              </div>

              {checkoutError && (
                <p className="text-xs text-red-600 font-bold">{checkoutError}</p>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-8 bg-black text-white px-6 py-4 flex items-center justify-center gap-2 rounded-none text-sm font-bold uppercase tracking-widest hover:bg-hooke-800 transition-colors disabled:opacity-50"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                {isProcessing ? 'GERANDO LINK...' : 'IR PARA O PAGAMENTO'}
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-4 uppercase">Pagamento seguro processado por Mercado Pago</p>
            </form>
          </div>
        </div>
      )}

      {!isCheckoutOpen && items.length > 0 && (
        <SheetFooter className="border-t border-hooke-100 px-6 py-6 sm:justify-center">
          <div className="w-full flex flex-col gap-4">
            {/* SESSÃO DE FRETE */}
            <div className="border-t border-hooke-100 pt-4 mt-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block mb-2">Simular Frete</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={zipInput}
                  onChange={handleZipChange}
                  className="flex-1 border border-hooke-200 px-3 py-2 text-sm focus:outline-none focus:border-hooke-900 focus:ring-1 focus:ring-hooke-900 rounded-none bg-white transition-colors placeholder:text-gray-300"
                />
                <button
                  onClick={calculateShipping}
                  disabled={isCalculatingShipping || zipInput.length < 9}
                  className="bg-hooke-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-black transition-colors rounded-none whitespace-nowrap"
                >
                  {isCalculatingShipping ? <Loader2 size={16} className="animate-spin" /> : "Calcular"}
                </button>
              </div>
              {shippingError && <p className="text-[10px] text-red-500 font-bold mb-2">{shippingError}</p>}

              {shippingOptions.length > 0 && (
                <div className="space-y-2 mt-3 animate-in fade-in slide-in-from-top-2">
                  {shippingOptions.map((opt, idx) => {
                    const selected = shippingMethod === opt.nome;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectShipping(opt.nome, opt.valor)}
                        className={`w-full flex items-center justify-between p-3 border text-left bg-white transition-colors cursor-pointer rounded-none
                                    ${selected ? 'border-hooke-900 bg-gray-50 ring-1 ring-hooke-900' : 'border-hooke-200 hover:border-hooke-400'}
                                `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selected ? 'border-hooke-900' : 'border-gray-300'}`}>
                            {selected && <div className="w-2.5 h-2.5 bg-hooke-900 rounded-full" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-hooke-900">{opt.nome}</span>
                            <span className="text-[10px] text-gray-500 uppercase">Até {opt.prazo} dias úteis</span>
                          </div>
                        </div>
                        <span className="text-sm font-black text-hooke-900">{formatter.format(Number(opt.valor))}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* SESSÃO DE CUPOM */}
            <div className="border-t border-hooke-100 pt-4 mt-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-hooke-900 block mb-2">Cupom de Desconto</label>
              {!appliedCoupon ? (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="MAVERICK10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 border border-hooke-200 px-3 py-2 text-sm focus:outline-none focus:border-hooke-900 focus:ring-1 focus:ring-hooke-900 rounded-none bg-white font-bold uppercase placeholder:font-normal placeholder:lowercase"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponInput}
                      className="bg-hooke-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-none disabled:opacity-50"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 font-bold mt-2">{couponError}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between border border-green-200 bg-green-50 px-3 py-2 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-300 to-green-100 opacity-20 animate-pulse"></div>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-xs font-bold text-green-800 uppercase flex items-center gap-1">
                      🎉 {appliedCoupon}
                    </span>
                    <span className="text-[10px] text-green-700 bg-green-200 px-1.5 py-0.5 font-bold uppercase rounded-sm shadow-sm border border-green-300">10% OFF</span>
                  </div>
                  <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500 transition-colors relative z-10">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between text-base font-bold text-hooke-900 uppercase tracking-wider border-t border-hooke-100 pt-4 mt-2">
              <p>Subtotal</p>
              <p>{formatter.format(subtotal)}</p>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-base font-bold text-green-600 uppercase tracking-wider items-center">
                <div className="flex items-center gap-1">
                  <Tag size={16} />
                  <span>Pacote Promo (Kit)</span>
                </div>
                <p>- {formatter.format(promoDiscount)}</p>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-base font-bold text-green-600 uppercase tracking-wider">
                <p>Cupom ({appliedCoupon})</p>
                <p>- {formatter.format(couponDiscount)}</p>
              </div>
            )}
            {shippingCost !== null && (
              <div className="flex justify-between text-base font-bold text-hooke-900 uppercase tracking-wider">
                <p>Frete ({shippingMethod})</p>
                <p>{formatter.format(shippingCost)}</p>
              </div>
            )}

            {shippingError === "FALLBACK_WHATSAPP" && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm animate-in fade-in slide-in-from-top-2">
                <p className="text-xs text-amber-800 font-medium mb-3">
                  Os Correios estão temporariamente indisponíveis. Mas não se preocupe! Toque no botão abaixo para finalizarmos seu pedido rapidamente via WhatsApp com frete manual.
                </p>
              </div>
            )}
            <div className="flex justify-between text-xl font-black text-hooke-900 uppercase tracking-wider border-t border-hooke-100 pt-2 pb-2">
              <p>Total</p>
              <p>{formatter.format(totalGeral)}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-hooke-900 text-white px-6 py-4 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors"
              >
                <CreditCard size={18} />
                COMPRAR AGORA
              </button>

              <SheetClose asChild>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-transparent text-green-700 border-2 border-green-600 px-6 py-3 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-green-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.637 3.891 1.685 5.677l-1.073 3.92 3.877-1.296zm4.908-12.981c-.613-.306-3.588-1.78-4.022-1.987-.435-.206-.748-.312-1.06.157-.313.47-1.204 1.518-1.476 1.833-.271.314-.541.354-1.154.047-3.852-1.927-6.391-6.596-6.808-7.319-.199-.346.017-.53.301-.813.229-.229.51-.599.765-.902.256-.301.34-.515.511-.859.17-.345.085-.647-.043-.905-.127-.258-1.06-2.574-1.456-3.522-.386-.927-.775-.799-1.06-.815-.269-.015-.577-.017-.885-.017-.307 0-.807.116-1.228.579-.422.462-1.608 1.571-1.608 3.832 0 2.261 1.644 4.449 1.872 4.756.229.307 3.239 4.95 7.85 6.944 4.611 1.994 4.611 1.331 5.434 1.248.823-.084 2.647-1.083 3.019-2.128.373-1.046.373-1.943.261-2.13-.112-.187-.413-.299-1.026-.605z"></path></svg>
                  Atendimento por WhatsApp
                </button>
              </SheetClose>
            </div>

            <SheetClose asChild>
              <button className="w-full text-hooke-900 text-sm font-bold underline hover:text-hooke-600 transition-colors text-center">
                Ou continue comprando
              </button>
            </SheetClose>
          </div>
        </SheetFooter>
      )}
    </div>
  );
}
