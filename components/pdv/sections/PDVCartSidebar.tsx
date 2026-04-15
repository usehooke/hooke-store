"use client";

import { useState } from "react";
import { usePDVStore, selectPDVTotal, selectPDVCount } from "@/store/pdv-store";
import { useShallow } from 'zustand/react/shallow';
import { Trash2, Minus, Plus, Zap, AlertCircle, User, Phone, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReceiptTemplate from "../ReceiptTemplate";

export default function PDVCartSidebar() {
  const items = usePDVStore(useShallow(state => state.items));
  const removeItem = usePDVStore(state => state.removeItem);
  const updateQuantity = usePDVStore(state => state.updateQuantity);
  const addToQueue = usePDVStore(state => state.addToQueue);
  const clearCart = usePDVStore(state => state.clearCart);
  const total = usePDVStore(selectPDVTotal);
  const count = usePDVStore(selectPDVCount);

  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'pix' | 'cartao'>('pix');
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSaleId, setLastSaleId] = useState("");

  const handleFastSale = () => {
    if (items.length === 0) {
      toast.error("Carrinho está vazio.");
      return;
    }

    if (!customerName || customerName.length < 3) {
      toast.error("Nome do cliente é obrigatório (mín. 3 letras)");
      return;
    }

    // Feedback Tátil
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }

    const saleId = `sale-${Date.now()}`;
    setLastSaleId(saleId);

    addToQueue({
      customerName,
      customerPhone,
      items: [...items],
      total,
      paymentMethod,
      timestamp: Date.now(),
    });

    toast.success("Venda registrada com sucesso!", {
      description: `${customerName} • R$ ${total.toFixed(2)}`,
      icon: <Zap className="text-yellow-400" />,
    });

    setCustomerName("");
    setCustomerPhone("");
    setShowReceipt(true);
  };

  return (
    <div className="flex flex-col h-full space-y-10">
      {/* Header Seletivo - Atelier Style */}
      <div className="flex items-center justify-between border-b border-black/[0.05] pb-6">
        <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-zinc-400 italic">Resumo Operacional</h2>
        <span className="bg-black text-white text-[10px] font-mono px-4 py-1.5 font-bold">
          {count} ITENS
        </span>
      </div>

      {/* Cadastro do Cliente - Operação Rápida */}
      <div className="space-y-6 bg-zinc-50/50 border border-black/[0.03] p-8">
        <div className="flex items-center gap-3 mb-2">
            <User size={14} className="text-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Identificação do Cliente</span>
        </div>
        <div className="space-y-5">
          <input 
            type="text" 
            placeholder="NOME COMPLETO *"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-white border border-black/[0.05] p-5 text-sm text-zinc-900 font-bold focus:border-black transition-all outline-none placeholder:text-zinc-300 uppercase shadow-sm"
          />
          <div className="relative">
            <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
            <input 
                type="tel" 
                placeholder="WHATSAPP (OPCIONAL)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-white border border-black/[0.05] p-5 pl-12 text-sm text-zinc-900 font-bold focus:border-black transition-all outline-none placeholder:text-zinc-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Listagem de Itens (Scroll Minimalista High Contrast) */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[250px] lg:max-h-none">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-black/[0.03] bg-zinc-50/30">
            <AlertCircle size={32} strokeWidth={1} className="text-zinc-200" />
            <p className="text-[10px] font-black tracking-[0.4em] mt-5 text-zinc-300 uppercase italic">Aguardando Produtos</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.cartItemId} className="flex gap-6 p-4 bg-white border border-black/[0.03] group hover:border-black/10 transition-all shadow-sm">
              <div className="relative h-20 w-16 bg-zinc-50 overflow-hidden shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[11px] font-black text-black truncate uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{item.selectedSize}</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-1 text-zinc-200 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 bg-zinc-100 p-1">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all border border-black/[0.05]"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center text-[11px] font-black text-black">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all border border-black/[0.05]"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-[11px] font-bold text-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer de Fechamento - Alta Performance */}
      <div className="pt-8 border-t-2 border-dashed border-black/[0.05] space-y-8">
        <div className="flex justify-between items-end bg-zinc-50 p-6">
          <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none">Total da Venda</span>
          <span className="text-5xl font-serif text-black tracking-tighter leading-none">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] pl-1">Liquidação</span>
          <div className="grid grid-cols-3 gap-2">
            {(['dinheiro', 'pix', 'cartao'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={cn(
                  "py-5 text-[10px] font-black uppercase tracking-widest border transition-all h-20 flex flex-col items-center justify-center gap-2",
                  paymentMethod === method 
                    ? "bg-black text-white border-black shadow-lg" 
                    : "bg-white text-zinc-400 border-black/[0.05] hover:border-black/20"
                )}
              >
                {method}
                <span className={`w-4 h-[1px] ${paymentMethod === method ? 'bg-white/20' : 'bg-zinc-100'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleFastSale}
            className="w-full bg-black text-white p-7 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xl shadow-black/10"
          >
            <CheckCircle2 size={18} />
            Concluir Venda
          </button>
          
          <button
            onClick={clearCart}
            className="w-full text-zinc-300 hover:text-red-500 py-2 text-[9px] font-black uppercase tracking-[0.4em] transition-all italic"
          >
            Cancelar Sessão
          </button>
        </div>
      </div>

      {showReceipt && (
        <ReceiptTemplate
          saleId={lastSaleId}
          items={items}
          total={total}
          paymentMethod={paymentMethod}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}
