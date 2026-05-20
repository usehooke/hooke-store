"use client";

import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { MotionDiv } from "@/components/admin/MotionComponents";
import { Product } from "@/types";
import { usePDVStore, selectPDVTotal, selectPDVCount } from "@/store/pdv-store";
import { Scan, Plus, Minus, Trash2, ShoppingBag, Loader2, ChevronRight, CreditCard } from "lucide-react";
import { PDVCheckoutModal } from "@/features/admin/components/pdv/PDVCheckoutModal";
import { useSyncOfflineSales } from "@/hooks/useSyncOfflineSales";

/**
 * HOOKE HQ: PDV V15.0 - FAT FINGER DESIGN
 * Focado em Tablets e Acessibilidade (Público 60+)
 * Máximo contraste, fontes grandes e botões gigantes.
 */
export default function PDVPage() {
  const { isSyncing, pendingCount, exhaustedCount, isContingencyMode } = useSyncOfflineSales();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { items, addItem, updateSizeQuantity, removeItem, clearCart } = usePDVStore();
  const total = usePDVStore(selectPDVTotal);
  const count = usePDVStore(selectPDVCount);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products-pdv"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
    },
  });

  // 4 Mais Vendidos (Simulado ou Real)
  const topSellers = Array.isArray(products) ? products.slice(0, 4) : [];

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

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-black" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col lg:flex-row overflow-hidden">
      
      {/* LADO ESQUERDO: VITRINE / STUDIO (60% da tela) */}
      <section className="flex-1 lg:flex-[0.6] flex flex-col p-6 border-r-2 border-black overflow-y-auto custom-scrollbar">
        
        {/* Botão Herói: Escanear */}
        <button className="w-full bg-black text-white py-12 flex flex-col items-center justify-center gap-4 active:bg-zinc-800 transition-all mb-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)]">
          <Scan size={48} strokeWidth={1.5} />
          <span className="text-2xl font-black uppercase tracking-widest">Escanear Etiqueta</span>
        </button>

        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Acesso Rápido (Mais Vendidos)</h2>
        
        {/* Grid de Ação Rápida */}
        <div className="grid grid-cols-2 gap-6">
          {topSellers.map((product) => (
            <button 
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group relative aspect-square border-2 border-black overflow-hidden flex flex-col active:scale-95 transition-all"
            >
              {product.imageUrl && (
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-white text-sm font-black uppercase tracking-tighter text-left">{product.name}</span>
                <span className="text-emerald-400 text-xs font-black text-left">
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
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-xl text-center mb-10">
              <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Escolha o Tamanho</h2>
              <h3 className="text-white text-4xl font-black uppercase tracking-tighter italic">{selectedProduct.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
              {selectedProduct.sizes.map((size) => (
                <button 
                  key={size}
                  onClick={() => handleAddWithSize(size)}
                  className="bg-white text-black py-10 text-4xl font-black border-4 border-transparent hover:border-emerald-500 active:scale-95 transition-all"
                >
                  {size}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setSelectedProduct(null)}
              className="mt-12 text-zinc-500 font-black uppercase tracking-widest text-[10px] underline underline-offset-8"
            >
              Cancelar / Fechar
            </button>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* LADO DIREITO: CARRINHO (40% da tela) */}
      <aside className="flex-1 lg:flex-[0.4] bg-zinc-50 flex flex-col relative h-full">
        
        <div className="p-6 border-b-2 border-black bg-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} />
            <span className="text-sm font-black uppercase tracking-widest">Carrinho ({count})</span>
          </div>

          {/* Indicador de Sincronia Offline com Inteligência Visual Avançada (Shake e Pulsação) */}
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
              className={`flex items-center gap-1.5 px-2 py-1 border-2 border-black text-[9px] font-black uppercase tracking-wider ${
                isContingencyMode 
                ? 'bg-amber-100 border-amber-500 text-amber-900' 
                : exhaustedCount > 0 
                ? 'bg-red-100 border-red-500 text-red-900'
                : 'bg-zinc-100 border-black text-black'
              }`}
            >
              {isSyncing && <Loader2 size={10} className="animate-spin text-black" />}
              {isContingencyMode ? (
                <span>Contingência</span>
              ) : pendingCount > 0 ? (
                <span>{pendingCount} Pendente{pendingCount > 1 ? 's' : ''}</span>
              ) : exhaustedCount > 0 ? (
                <span>{exhaustedCount} Exaurida{exhaustedCount > 1 ? 's' : ''}</span>
              ) : (
                <span className="text-emerald-700">Sincronizado</span>
              )}
            </motion.div>
          )}

          {items.length > 0 && (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={clearCart} 
              className="text-[10px] font-black uppercase text-red-500 underline decoration-2 underline-offset-4 cursor-pointer"
            >
              Limpar
            </motion.button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-40">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-10">
              <ShoppingBag size={48} strokeWidth={1} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Carrinho Vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border-2 border-black p-4 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black uppercase tracking-tight leading-none max-w-[70%]">{item.name}</span>
                    <motion.button 
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeItem(item.id)} 
                      aria-label={`Remover ${item.name}`} 
                      title={`Remover ${item.name}`} 
                      className="text-zinc-300 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                  
                  {Object.entries(item.sizeQuantities).map(([size, qty]) => (
                    <div key={size} className="flex items-center justify-between bg-zinc-50 p-2 border border-black/5">
                      <span className="text-xs font-black">TAM: {size}</span>
                      <div className="flex items-center gap-6">
                        <motion.button 
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateSizeQuantity(item.id, size, qty - 1)}
                          aria-label={`Remover ${size}`}
                          title={`Remover ${size}`}
                          className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center active:bg-zinc-100 cursor-pointer"
                        >
                          <Minus size={20} strokeWidth={3} />
                        </motion.button>
                        <span className="text-xl font-black min-w-[20px] text-center">{qty}</span>
                        <motion.button 
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateSizeQuantity(item.id, size, qty + 1)}
                          aria-label={`Adicionar ${size}`}
                          title={`Adicionar ${size}`}
                          className="w-12 h-12 bg-black text-white flex items-center justify-center active:bg-zinc-800 cursor-pointer"
                        >
                          <Plus size={20} strokeWidth={3} />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR: COBRAR */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t-2 border-black shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <motion.button 
            disabled={items.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
            whileTap={items.length > 0 ? { 
              y: 4, 
              scale: 0.98,
              boxShadow: "0 0px 0px 0px rgba(5,150,105,1)"
            } : {}}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="w-full bg-emerald-500 text-white py-8 flex flex-col items-center justify-center gap-1 active:bg-emerald-600 transition-all disabled:grayscale disabled:opacity-20 shadow-[0_4px_0px_0px_rgba(5,150,105,1)] cursor-pointer"
          >
            <span className="text-xs font-black uppercase tracking-[0.4em] opacity-80">Finalizar Venda</span>
            <span className="text-3xl font-black uppercase tracking-tighter">
              Cobrar {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
            </span>
          </motion.button>
        </div>
      </aside>

      {/* MODAL DE CHECKOUT BIFÁSICO */}
      <PDVCheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}
