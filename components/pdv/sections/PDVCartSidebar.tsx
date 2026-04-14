"use client";

import { useState } from "react";
import { usePDVStore, selectPDVTotal, selectPDVCount } from "@/store/pdv-store";
import { useShallow } from 'zustand/react/shallow';
import { Trash2, Minus, Plus, Zap, AlertCircle, User, Phone } from "lucide-react";
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
    <div className="flex flex-col h-full space-y-8">
      {/* Header Seletivo */}
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 italic">Carrinho Elite</h2>
        <span className="bg-white/5 border border-white/10 text-[#FAFAFA] text-[10px] font-mono px-3 py-1">
          {count} ITENS
        </span>
      </div>

      {/* Cadastro do Cliente - Operação Rápida */}
      <div className="space-y-4 bg-white/[0.02] border border-white/[0.05] p-6">
        <div className="flex items-center gap-2 mb-2 border-b border-white/[0.05] pb-2">
            <User size={12} className="text-zinc-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#FAFAFA]">Identificação</span>
        </div>
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="NOME DO CLIENTE *"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-[#FAFAFA] font-light focus:border-white transition-all outline-none placeholder:text-zinc-700 uppercase"
          />
          <div className="relative">
            <Phone size={12} className="absolute left-0 top-3 text-zinc-700 font-bold" />
            <input 
                type="tel" 
                placeholder="WHATSAPP (OPCIONAL)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 pl-6 text-xs text-zinc-400 font-light focus:border-white transition-all outline-none placeholder:text-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Listagem de Itens com Scroll Minimalista */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[300px] lg:max-h-none">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-white/10 opacity-30">
            <AlertCircle size={24} strokeWidth={1} />
            <p className="text-[9px] font-bold tracking-widest mt-3">AGUARDANDO PRODUTOS</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.cartItemId} className="flex gap-4 group">
              <div className="relative h-16 w-12 bg-white/5 overflow-hidden flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-[11px] font-bold text-[#FAFAFA] truncate uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{item.selectedSize} • R$ {item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="text-zinc-500 hover:text-white transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-[10px] font-mono text-[#FAFAFA]">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="text-zinc-500 hover:text-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-zinc-800 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer de Fechamento */}
      <div className="pt-6 border-t border-white/10 space-y-6">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Subtotal</span>
          <span className="text-4xl font-serif text-[#FAFAFA] tracking-tighter leading-none">R$ {total.toFixed(2)}</span>
        </div>

        <div className="space-y-3">
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] italic">Método de Liquidação</span>
          <div className="grid grid-cols-3 gap-1">
            {(['dinheiro', 'pix', 'cartao'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={cn(
                  "py-3 text-[9px] font-black uppercase tracking-widest border transition-all",
                  paymentMethod === method 
                    ? "bg-white text-black border-white" 
                    : "bg-transparent text-zinc-500 border-white/5 hover:border-white/20"
                )}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleFastSale}
          className="w-full bg-white text-black p-5 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-zinc-200 active:scale-[0.98] transition-all"
        >
          <Zap size={14} className="fill-black" />
          Concluir Venda
        </button>
        
        <button
          onClick={clearCart}
          className="w-full text-zinc-600 hover:text-zinc-400 py-2 text-[9px] font-black uppercase tracking-widest transition-colors"
        >
          Limpar Sessão
        </button>
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
