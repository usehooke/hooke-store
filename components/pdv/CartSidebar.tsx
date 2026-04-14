"use client";

import { useState } from "react";
import { usePDVStore, selectPDVTotal, selectPDVCount } from "@/store/pdv-store";
import { useShallow } from 'zustand/react/shallow';
import { Trash2, Minus, Plus, Zap, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import ReceiptTemplate from "./ReceiptTemplate";

export default function PDVCartSidebar() {
 const items = usePDVStore(useShallow(state => state.items));
 const removeItem = usePDVStore(state => state.removeItem);
 const updateQuantity = usePDVStore(state => state.updateQuantity);
 const addToQueue = usePDVStore(state => state.addToQueue);
 const clearCart = usePDVStore(state => state.clearCart);
 const total = usePDVStore(selectPDVTotal);
 const count = usePDVStore(selectPDVCount);

 const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'pix' | 'cartao'>('pix');
 const [showReceipt, setShowReceipt] = useState(false);

 const handleFastSale = () => {
 if (items.length === 0) {
 toast.error("Carrinho vazio!");
 return;
 }

 // Feedback Tátil (Haptic)
 if (typeof navigator !== 'undefined' && navigator.vibrate) {
 navigator.vibrate([50, 30, 50]);
 }

 // Feedback Sonoro (Mock/Simple)
 const audio = new Audio('/sounds/success_beep.mp3');
 audio.play().catch(() => {}); // Catch blocking by browser

 addToQueue({
 items: [...items],
 total,
 paymentMethod,
 timestamp: Date.now(),
 });

 toast.success(`Venda registrada (${paymentMethod.toUpperCase()})!`, {
 icon: <Zap className="text-yellow-500" />,
 style: {
 background: '#000',
 color: '#fff',
 borderRadius: '0px'
 }
 });

 // Abrir comprovante
 setShowReceipt(true);
 
 // O carrinho já é limpo pelo addToQueue dentro da store
 };

 return (
 <div className="flex flex-col h-full min-h-[500px]">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-black tracking-tighter">Carrinho</h2>
 <span className="bg-hooke-900 text-white text-[10px] font-bold px-2 py-1">
 {count} ITENS
 </span>
 </div>

 <div className="flex-grow overflow-y-auto space-y-4 mb-6 max-h-[400px] lg:max-h-none pr-2">
 {items.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-48 text-hooke-300">
 <AlertCircle className="h-8 w-8 mb-2" />
 <p className="text-xs font-bold">NENHUM ITEM SELECIONADO</p>
 </div>
 ) : (
 items.map((item) => (
 <div key={item.cartItemId} className="flex gap-3 p-3 shadow-neumorph-inset bg-hooke-50">
 <div className="relative h-16 w-16 shadow-neumorph">
 <Image
 priority src={item.imageUrl}
 alt={item.name}
 fill
 className="object-cover"
 />
 </div>
 <div className="flex-1 min-w-0">
 <h4 className="text-xs font-bold truncate ">{item.name}</h4>
 <p className="text-[10px] font-bold text-hooke-500 mb-2">TAM: {item.selectedSize} - R$ {(item.price || 0).toFixed(2)}</p>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1">
 <button 
 onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
 className="p-1 shadow-neumorph active:shadow-neumorph-inset"
 >
 <Minus className="h-3 w-3" />
 </button>
 <span className="text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
 <button 
 onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
 className="p-1 shadow-neumorph active:shadow-neumorph-inset"
 >
 <Plus className="h-3 w-3" />
 </button>
 </div>
 <button 
 onClick={() => removeItem(item.cartItemId)}
 className="text-red-500 p-1 shadow-neumorph active:shadow-neumorph-inset"
 >
 <Trash2 className="h-3 w-3" />
 </button>
 </div>
 </div>
 </div>
 ))
 )}
 </div>

 <div className="mt-auto pt-6 border-t border-hooke-200">
 <div className="flex justify-between items-end mb-6">
 <span className="text-xs font-bold text-hooke-500">TOTAL DA VENDA</span>
 <span className="text-3xl font-black tracking-tighter">R$ {(total || 0).toFixed(2)}</span>
 </div>

 <div className="flex flex-col gap-3 mb-6">
 <span className="text-[10px] font-black text-hooke-500">Forma de Pagamento</span>
 <div className="grid grid-cols-3 gap-2">
 {(['dinheiro', 'pix', 'cartao'] as const).map((method) => (
 <button
 key={method}
 onClick={() => setPaymentMethod(method)}
 className={`py-3 text-[10px] font-black tracking-widest border transition-all ${
 paymentMethod === method 
 ? 'bg-hooke-900 text-white border-hooke-900 shadow-neumorph-inset' 
 : 'bg-white text-hooke-900 border-gray-200 shadow-neumorph active:shadow-neumorph-inset'
 }`}
 >
 {method}
 </button>
 ))}
 </div>
 </div>

 <button
 onClick={handleFastSale}
 className="w-full bg-hooke-900 text-white p-6 font-black tracking-widest flex items-center justify-center gap-3 shadow-neumorph active:scale-[0.98] transition-all"
 >
 <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
 Concluir Venda
 </button>
 
 <button
 onClick={clearCart}
 className="w-full mt-3 text-hooke-500 py-3 text-[10px] font-bold tracking-widest hover:text-red-500 transition-colors"
 >
 Cancelar Tudo
 </button>
 </div>

 {showReceipt && (
 <ReceiptTemplate
 saleId={`PED-${Date.now()}`} // Mock ID for display until sync
 items={items}
 total={total}
 paymentMethod={paymentMethod}
 onClose={() => setShowReceipt(false)}
 />
 )}
 </div>
 );
}
