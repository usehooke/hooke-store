"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { MotionDiv } from "@/components/admin/MotionComponents";
import { Product } from "@/types";
import { usePDVStore, selectPDVTotal, selectPDVCount } from "@/store/pdv-store";
import { Scan, Plus, Minus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { PDVCheckoutModal } from "@/features/admin/components/pdv/PDVCheckoutModal";
import { useSyncOfflineSales } from "@/hooks/useSyncOfflineSales";

interface InteractivePDVProps {
  initialProducts: Product[];
}

/**
 * HOOKE HQ: PDV V16.0 (Admin V4) - Server-Powered
 * Minimalista, Focado na Conversão e 100% Sincronizado.
 */
export function InteractivePDV({ initialProducts }: InteractivePDVProps) {
  const { isSyncing, pendingCount, exhaustedCount, isContingencyMode } = useSyncOfflineSales();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { items, addItem, updateSizeQuantity, removeItem, clearCart } = usePDVStore();
  const total = usePDVStore(selectPDVTotal);
  const count = usePDVStore(selectPDVCount);

  // Sem React Query! Usamos a base de dados real entregue pelo Server.
  const products = initialProducts || [];
  
  // Exibimos os produtos no painel principal
  const topSellers = products.slice(0, 6);

  // Estado para Seleção de Tamanho (Fat Finger)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddWithSize = (size: string) => {
    if (selectedProduct) {
      addItem(selectedProduct, size);
      setSelectedProduct(null);
      toast.success(`${selectedProduct.name} (${size}) adicionado.`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col lg:flex-row overflow-hidden">
      
      {/* LADO ESQUERDO: VITRINE / STUDIO (60% da tela) */}
      <section className="flex-1 lg:flex-[0.6] flex flex-col p-6 border-r-2 border-black overflow-y-auto custom-scrollbar">
        
        {/* Botão Herói: Escanear */}
        <button className="w-full bg-black text-white py-8 flex flex-col items-center justify-center gap-3 active:bg-zinc-800 transition-all mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
          <Scan size={36} strokeWidth={1.5} />
          <span className="text-xl font-black uppercase tracking-widest">Escanear Etiqueta</span>
        </button>

        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 border-b border-zinc-100 pb-2">Catálogo em Tempo Real</h2>
        
        {/* Grid Minimalista */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {topSellers.map((product) => (
            <button 
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group relative aspect-[3/4] border border-black/10 overflow-hidden flex flex-col active:scale-95 transition-all bg-zinc-50"
            >
              {product.imageUrl ? (
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[8px] text-zinc-300 font-bold uppercase tracking-widest">Sem Imagem</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 opacity-100">
                <span className="text-white text-[10px] font-black uppercase tracking-tighter text-left leading-tight mb-1">{product.name}</span>
                <span className="text-white text-xs font-serif font-black text-left">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* MODAL DE SELEÇÃO DE TAMANHO (MASSIVO) */}
      <AnimatePresence>
        {selectedProduct && (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-xl text-center mb-10">
              <h2 className="text-black text-[10px] font-black uppercase tracking-[0.5em] mb-4">Selecione a Geometria</h2>
              <h3 className="text-black text-3xl font-black uppercase tracking-tighter">{selectedProduct.name}</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
              {selectedProduct.sizes.map((size) => (
                <button 
                  key={size}
                  onClick={() => handleAddWithSize(size)}
                  className="bg-zinc-100 text-black py-8 text-2xl font-black border-2 border-transparent hover:border-black active:bg-black active:text-white transition-all"
                >
                  {size}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setSelectedProduct(null)}
              className="mt-12 text-zinc-400 font-black uppercase tracking-widest text-[10px] underline underline-offset-8 hover:text-black transition-colors"
            >
              Cancelar Operação
            </button>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* LADO DIREITO: CARRINHO (40% da tela) */}
      <aside className="flex-1 lg:flex-[0.4] bg-zinc-50 flex flex-col relative h-full border-l border-black/10">
        
        <div className="p-6 border-b border-black/10 bg-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">Carrinho ({count})</span>
          </div>

          {(pendingCount > 0 || exhaustedCount > 0 || isSyncing || isContingencyMode) && (
            <motion.div 
              key={`sync-indicator-${isContingencyMode ? 'contingency' : isSyncing ? 'syncing' : 'pending'}`}
              animate={
                isContingencyMode || exhaustedCount > 0 
                ? { x: [0, -6, 6, -6, 6, 0], transition: { duration: 0.5 } }
                : isSyncing 
                ? { opacity: [1, 0.4, 1], transition: { repeat: Infinity, duration: 1.5 } }
                : { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-[8px] font-black uppercase tracking-wider ${
                isContingencyMode 
                ? 'bg-amber-50 border-amber-500 text-amber-900' 
                : exhaustedCount > 0 
                ? 'bg-red-50 border-red-500 text-red-900'
                : 'bg-white border-black text-black'
              }`}
            >
              {isSyncing && <Loader2 size={10} className="animate-spin text-black" />}
              {isContingencyMode ? (
                <span>Modo Contigência</span>
              ) : pendingCount > 0 ? (
                <span>{pendingCount} Pendente</span>
              ) : exhaustedCount > 0 ? (
                <span>{exhaustedCount} Falhas</span>
              ) : (
                <span className="text-emerald-700">Online</span>
              )}
            </motion.div>
          )}

          {items.length > 0 && (
            <button 
              onClick={clearCart} 
              className="text-[10px] font-black uppercase text-zinc-400 hover:text-red-500 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-40">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-10">
              <ShoppingBag size={48} strokeWidth={1} className="mb-4 text-black" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Aguardando Produtos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-black/10 p-4 flex flex-col gap-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-tight leading-snug max-w-[80%]">{item.name}</span>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  {Object.entries(item.sizeQuantities).map(([size, qty]) => (
                    <div key={size} className="flex items-center justify-between bg-zinc-50 p-3 border border-black/5">
                      <span className="text-xs font-black">TM {size}</span>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updateSizeQuantity(item.id, size, qty - 1)}
                          className="w-10 h-10 bg-white border border-black/10 flex items-center justify-center active:bg-zinc-100 transition-colors"
                        >
                          <Minus size={16} strokeWidth={2.5} />
                        </button>
                        <span className="text-lg font-black min-w-[24px] text-center">{qty}</span>
                        <button 
                          onClick={() => updateSizeQuantity(item.id, size, qty + 1)}
                          className="w-10 h-10 bg-black text-white flex items-center justify-center active:bg-zinc-800 transition-colors"
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

        {/* BOTTOM ACTION BAR: COBRAR */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-black/10">
          <button 
            disabled={items.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-black text-white py-6 flex flex-col items-center justify-center gap-1 active:bg-zinc-800 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-60">Finalizar Transação</span>
            <span className="text-2xl font-black uppercase tracking-tighter">
              Cobrar {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
            </span>
          </button>
        </div>
      </aside>

      <PDVCheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}
