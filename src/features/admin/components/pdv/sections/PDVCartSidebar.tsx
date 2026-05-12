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
  const { items, isWholesale, setWholesale, removeItem, updateSizeQuantity, updateCustomPrice, addToQueue, clearCart } = usePDVStore();
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

    const saleId = `sale-${Date.now()}`;
    setLastSaleId(saleId);

    addToQueue({
      customerName,
      customerPhone,
      items: [...items],
      total,
      isWholesale,
      paymentMethod,
      timestamp: Date.now(),
    });

    toast.success("Venda comercializada com sucesso!", {
      description: `${customerName} • R$ ${total.toFixed(2)}`,
      icon: <CheckCircle2 className="text-emerald-500" />,
    });

    setCustomerName("");
    setCustomerPhone("");
    setShowReceipt(true);
  };

  const AVAILABLE_SIZES = ["P", "M", "G", "GG", "XG"];

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* Header Seletivo */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-zinc-400 italic">Itens da Venda (Atacado)</h2>
        <div className="flex items-center gap-4">
           {/* Wholesale Toggle Manual */}
           <button 
             onClick={() => setWholesale(!isWholesale)}
             className={cn(
               "flex items-center gap-2 px-3 py-1.5 border transition-all text-[9px] font-black uppercase tracking-widest",
               isWholesale ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" : "bg-white/5 border-white/10 text-zinc-500"
             )}
           >
             <Zap size={10} /> {isWholesale ? "Atacado Ativo" : "Atacado Manual"}
           </button>
           <span className="bg-white text-black text-[10px] font-mono px-4 py-1.5 font-bold">
            {count} PÇS
           </span>
        </div>
      </div>

      {/* Cadastro do Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 border border-white/5 p-6">
        <input 
          type="text" 
          placeholder="NOME DO CLIENTE *"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="bg-transparent border-b border-white/10 p-3 text-sm text-white font-bold focus:border-emerald-500 transition-all outline-none placeholder:text-zinc-600 uppercase"
        />
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input 
              type="tel" 
              placeholder="WHATSAPP"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 p-3 pl-10 text-sm text-white font-bold focus:border-emerald-500 transition-all outline-none placeholder:text-zinc-600 uppercase"
          />
        </div>
      </div>

      {/* Listagem de Itens com Grade de Tamanhos */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-[300px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 bg-white/2">
            <AlertCircle size={32} strokeWidth={1} className="text-zinc-800" />
            <p className="text-[10px] font-black tracking-[0.4em] mt-5 text-zinc-600 uppercase italic">Carrinho de Pedido Limpo</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-5 bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-all">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative h-20 w-16 bg-zinc-900 border border-white/5 shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[12px] font-black text-white uppercase tracking-tighter truncate">{item.name}</h4>
                    <button onClick={() => removeItem(item.id)} aria-label={`Remover ${item.name}`} title={`Remover ${item.name}`} className="p-1 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                  <p className="text-[9px] text-zinc-500 font-mono mt-1">ID: {item.id}</p>
                  
                  {/* Preço Editável */}
                  <div className="mt-4 flex items-center gap-2">
                    <label htmlFor={`price-${item.id}`} className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Preço Unitário:</label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-zinc-500">R$</span>
                      <input 
                        id={`price-${item.id}`}
                        type="number" 
                        value={item.customPrice ?? (total >= 5 && item.comboPrice ? item.comboPrice : item.price)}
                        onChange={(e) => updateCustomPrice(item.id, Number(e.target.value))}
                        className="w-24 bg-zinc-900/50 border border-white/10 px-2 py-1 text-xs font-bold text-emerald-400 outline-none focus:border-emerald-500/50"
                        aria-label={`Preço customizado para ${item.name}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade de Atacado (Tamanhos) */}
              <div className="grid grid-cols-5 gap-2 border-t border-white/5 pt-4">
                {AVAILABLE_SIZES.map(sigla => {
                  const qty = item.sizeQuantities[sigla] || 0;
                  return (
                    <div key={sigla} className="flex flex-col items-center">
                      <span className="text-[9px] font-black text-zinc-500 mb-1.5">{sigla}</span>
                      <div className="flex items-center w-full border border-white/10 bg-black/20">
                        <button 
                          onClick={() => updateSizeQuantity(item.id, sigla, qty - 1)}
                          className="w-6 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >-</button>
                        <input 
                        id={`qty-${item.id}-${sigla}`}
                        type="number"
                        value={qty}
                        onChange={(e) => updateSizeQuantity(item.id, sigla, Number(e.target.value))}
                        className="w-full h-8 bg-transparent text-center text-[11px] font-black text-white outline-none"
                        aria-label={`Quantidade do tamanho ${sigla} para ${item.name}`}
                        />
                        <button 
                          onClick={() => updateSizeQuantity(item.id, sigla, qty + 1)}
                          className="w-6 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer de Fechamento */}
      <div className="pt-8 border-t border-white/10 space-y-6">
        <div className="grid grid-cols-2 gap-4">
           {/* Métodos de Pagamento */}
           <div className="grid grid-cols-3 gap-1 p-1 bg-white/5">
              {(['dinheiro', 'pix', 'cartao'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={cn(
                    "py-3 text-[8px] font-black uppercase tracking-widest transition-all",
                    paymentMethod === method ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {method}
                </button>
              ))}
           </div>
           
           <div className="flex flex-col justify-center items-end bg-emerald-500/5 border border-emerald-500/10 px-6 py-2">
              <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Total Geral</span>
              <span className="text-3xl font-serif text-emerald-500 tracking-tighter">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
              </span>
           </div>
        </div>

        <button
          onClick={handleFastSale}
          className="w-full bg-emerald-600 text-white p-7 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-xl shadow-emerald-900/10"
        >
          <CheckCircle2 size={18} />
          Finalizar Venda
        </button>
      </div>

      {showReceipt && (
        <ReceiptTemplate
          saleId={lastSaleId}
          items={items as any}
          total={total}
          paymentMethod={paymentMethod}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}
