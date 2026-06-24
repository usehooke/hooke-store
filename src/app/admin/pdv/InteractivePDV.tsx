"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { usePDVStore, selectPDVTotal, selectPDVCount } from "@/store/pdv-store";
import { Scan, Plus, Minus, Trash2, ShoppingBag, Loader2, ChevronUp } from "lucide-react";
import { PDVCheckoutModal } from "@/features/admin/components/pdv/PDVCheckoutModal";
import { useSyncOfflineSales } from "@/hooks/useSyncOfflineSales";
import { QRScanner } from "@/features/admin/components/pdv/QRScanner";

interface InteractivePDVProps {
  initialProducts: Product[];
}

export function InteractivePDV({ initialProducts }: InteractivePDVProps) {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { isSyncing, pendingCount, exhaustedCount, isContingencyMode } = useSyncOfflineSales();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const { items, addItem, updateSizeQuantity, removeItem, clearCart } = usePDVStore();
  const total = usePDVStore(selectPDVTotal);
  const count = usePDVStore(selectPDVCount);

  const products = initialProducts || [];

  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8 w-full">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Carregando Módulo PDV...</p>
        </div>
      </div>
    );
  }

  const handleAddWithSize = (product: Product, size: string) => {
    // Feedback tátil brutalista (vibrar o dispositivo mobile)
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    addItem(product, size);
    toast.success(`${product.name} (${size}) ADICIONADO.`, {
      style: { borderRadius: 0, border: '2px solid black', background: 'black', color: 'white' }
    });
  };

  const handleScanSuccess = (decodedText: string) => {
    // decodedText is our internal QR Code ID, e.g., HK-FUSCA-PR-G
    // Let's assume the ID format is SKU-SIZE for simplicity if not found directly
    // Find the product by ID or SKU
    const product = products.find(p => decodedText.includes(p.id) || p.id === decodedText);
    
    if (product) {
      // Determine size from barcode if possible, else default to 'M'
      const possibleSizes = ["PP", "P", "M", "G", "GG", "XG", "XGG", "G1", "G2", "G3"];
      const sizeFromCode = possibleSizes.find(s => decodedText.endsWith(`-${s}`));
      const size = sizeFromCode || "M";

      handleAddWithSize(product, size);
      setIsScannerOpen(false);
    } else {
      toast.error("Produto não encontrado no catálogo.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans flex flex-col lg:flex-row overflow-hidden pb-24 lg:pb-0 relative">
      
      {/* LADO ESQUERDO: VITRINE (TAP-TO-ADD) */}
      <section className="flex-1 lg:flex-[0.6] flex flex-col p-4 md:p-6 lg:border-r-2 border-black overflow-y-auto custom-scrollbar">
        
        {/* SCANNER HERO BUTTON */}
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="w-full bg-black text-white py-6 md:py-8 flex flex-col items-center justify-center gap-2 active:bg-zinc-800 transition-all mb-6 md:mb-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none rounded-none"
        >
          <Scan size={32} strokeWidth={2} />
          <span className="text-lg md:text-xl font-black uppercase tracking-widest">Escanear Etiqueta</span>
        </button>

        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-6 border-b-2 border-black pb-2">Catálogo Tátil V4</h2>
        
        {/* GRID TÁTIL BRUTALISTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-none flex flex-col overflow-hidden">
              <div className="relative aspect-square border-b-2 border-black">
                {product.imageUrl ? (
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sem Foto</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <span className="text-[11px] font-black uppercase tracking-widest leading-tight mb-4">{product.name}</span>
                
                {/* PÍLULAS DE TAMANHO "TAP-TO-ADD" */}
                <div className="mt-auto">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {product.sizes && product.sizes.length > 0 ? (
                      product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => handleAddWithSize(product, size)}
                          className="min-w-[48px] h-12 flex-1 flex items-center justify-center bg-zinc-100 border-2 border-black text-black text-sm font-black uppercase active:bg-black active:text-white transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                        >
                          {size}
                        </button>
                      ))
                    ) : (
                      <button
                        onClick={() => handleAddWithSize(product, 'UN')}
                        className="w-full h-12 flex items-center justify-center bg-zinc-100 border-2 border-black text-black text-[10px] font-black uppercase tracking-widest active:bg-black active:text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                      >
                        ADICIONAR (UN)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LADO DIREITO: CARRINHO DESKTOP */}
      <aside className="hidden lg:flex flex-[0.4] bg-white flex-col relative h-full">
        {/* Renderiza a UI do Carrinho aqui (igual ao mobile expandido, mas fixo) */}
        <CartContent 
          items={items} count={count} total={total} 
          isSyncing={isSyncing} pendingCount={pendingCount} 
          exhaustedCount={exhaustedCount} isContingencyMode={isContingencyMode}
          updateSizeQuantity={updateSizeQuantity} removeItem={removeItem} clearCart={clearCart}
          openCheckout={() => setIsCheckoutOpen(true)}
        />
      </aside>

      {/* MOBILE BOTTOM BAR (SWIPE UP CART) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black shadow-[0px_-4px_10px_rgba(0,0,0,0.1)] flex flex-col">
        {/* Barra Minimiza (O que fica sempre visível) */}
        <button 
          onClick={() => setIsMobileCartOpen(!isMobileCartOpen)}
          className="w-full bg-black text-white p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <span className="text-[11px] font-black uppercase tracking-widest">{count} ITENS</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
            <ChevronUp size={20} className={`transition-transform ${isMobileCartOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Carrinho Expandido Mobile */}
        <AnimatePresence>
          {isMobileCartOpen && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: "60vh" }}
              exit={{ height: 0 }}
              className="w-full bg-white flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto">
                <CartContent 
                  items={items} count={count} total={total} 
                  isSyncing={isSyncing} pendingCount={pendingCount} 
                  exhaustedCount={exhaustedCount} isContingencyMode={isContingencyMode}
                  updateSizeQuantity={updateSizeQuantity} removeItem={removeItem} clearCart={clearCart}
                  openCheckout={() => {
                    setIsMobileCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  isMobile
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isScannerOpen && (
        <QRScanner 
          onScanSuccess={handleScanSuccess} 
          onClose={() => setIsScannerOpen(false)} 
        />
      )}

      <PDVCheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}

// Subcomponente para reutilizar o layout do carrinho no Desktop e Mobile
function CartContent({ items, count, total, isSyncing, pendingCount, exhaustedCount, isContingencyMode, updateSizeQuantity, removeItem, clearCart, openCheckout, isMobile = false }: any) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className={`p-4 md:p-6 border-b-2 border-black flex justify-between items-center ${isMobile ? 'hidden' : ''}`}>
        <div className="flex items-center gap-3">
          <ShoppingBag size={18} strokeWidth={2.5} className="text-black" />
          <span className="text-[10px] font-black uppercase tracking-widest text-black">Carrinho ({count})</span>
        </div>

        {(pendingCount > 0 || exhaustedCount > 0 || isSyncing || isContingencyMode) && (
          <div className="flex items-center gap-1.5 px-2 py-1 border-2 border-black text-[8px] font-black uppercase tracking-wider text-black">
            {isSyncing && <Loader2 size={10} className="animate-spin" />}
            {isContingencyMode ? "OFFLINE" : pendingCount > 0 ? `${pendingCount} PEND` : "ON"}
          </div>
        )}

        {items.length > 0 && (
          <button onClick={clearCart} className="text-[10px] font-black uppercase text-red-600 hover:text-black transition-colors">
            LIMPAR
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-32">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-10">
            <ShoppingBag size={48} strokeWidth={1} className="mb-4 text-black" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Aguardando Escaneamento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="bg-white border-2 border-black p-4 flex flex-col gap-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest leading-snug max-w-[80%] text-black">{item.name}</span>
                  <button onClick={() => removeItem(item.id)} className="text-black hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {Object.entries(item.sizeQuantities).map(([size, qty]: any) => (
                  <div key={size} className="flex items-center justify-between bg-zinc-50 p-2 border-2 border-black">
                    <span className="text-xs font-black text-black">TM {size}</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateSizeQuantity(item.id, size, qty - 1)}
                        className="w-8 h-8 md:w-10 md:h-10 bg-white border-2 border-black flex items-center justify-center active:bg-black active:text-white transition-colors"
                      >
                        <Minus size={16} strokeWidth={2.5} />
                      </button>
                      <span className="text-lg font-black min-w-[24px] text-center text-black">{qty}</span>
                      <button 
                        onClick={() => updateSizeQuantity(item.id, size, qty + 1)}
                        className="w-8 h-8 md:w-10 md:h-10 bg-black text-white border-2 border-black flex items-center justify-center active:bg-zinc-800 transition-colors"
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${isMobile ? 'static' : 'absolute bottom-0 left-0 right-0'} p-4 md:p-6 bg-white border-t-2 border-black z-10`}>
        <button 
          disabled={items.length === 0}
          onClick={openCheckout}
          className="w-full bg-black text-white py-4 md:py-6 flex flex-col items-center justify-center gap-1 active:translate-y-1 transition-transform disabled:opacity-30 disabled:pointer-events-none rounded-none shadow-[4px_4px_0px_rgba(0,0,0,0.3)] border-2 border-black"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-80">COBRAR IMEDIATO</span>
          <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
          </span>
        </button>
      </div>
    </div>
  );
}
