"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/data/catalogo';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { ShoppingCart, Check, ArrowRight } from 'lucide-react';

interface SsenseProductViewProps {
  product: Product;
}

const SsenseProductView = ({ product }: SsenseProductViewProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor, selecione um tamanho para sua curadoria.', {
        style: { borderRadius: 0, background: '#000', color: '#fff', border: 'none' }
      });
      return;
    }

    setIsAdding(true);
    
    // Simulação de "Elite Feel" (Atraso sutil para dar peso à ação)
    setTimeout(() => {
      addItem(product, selectedSize);

      toast.success(`${product.name} reservado com sucesso no seu Lounge.`, {
        icon: <Check size={14} />,
        style: { borderRadius: 0, background: '#000', color: '#fff', border: 'none' }
      });
      
      setIsAdding(false);
    }, 800);
  };

  return (
    <div className="bg-hooke-paper min-h-screen pt-24 px-6 lg:px-12 pb-24 selection:bg-black selection:text-white">
      
      {/* GRID EDITORIAL 3 COLUNAS */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* COLUNA 1: DETALHES (LEFT STICKY) - GLASS STYLE */}
        <div className="hidden md:flex md:col-span-3 flex-col space-y-12 sticky top-32 glass-card p-6 border-none">
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold tracking-widest text-hooke-400 font-sans uppercase">
              Detalhes do Produto
            </h2>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-hooke-900 font-sans tracking-tight">Sku</p>
                <p className="text-xs font-medium text-black/60">{product.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-hooke-900 font-sans tracking-tight">Composição</p>
                <p className="text-xs font-medium text-black/60">{product.details?.fabric || 'Algodão Premium'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-hooke-900 font-sans tracking-tight">Corte</p>
                <p className="text-xs font-medium text-black/60">{product.details?.model || 'Editorial Boxy'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-hooke-900 font-sans tracking-tight">Lavagem</p>
                <p className="text-xs font-medium text-black/60">{product.details?.wash || 'Manual/Dry Clean'}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-black/5 pt-8">
            <p className="text-[13px] leading-relaxed text-hooke-900/70 font-sans font-medium italic">
              &quot;{product.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}&quot;
            </p>
          </div>
        </div>

        {/* COLUNA 2: GALERIA VERTICAL (CENTER SCROLL) */}
        <div className="col-span-1 md:col-span-6 space-y-4 md:space-y-8">
          {(product.images && product.images.length > 0 ? product.images : [product.imageUrl]).map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="relative aspect-[2/3] w-full bg-white group overflow-hidden border border-black/5"
            >
              <Image
                src={img}
                alt={`${product.name} - Vista ${idx + 1}`}
                fill
                className="object-cover object-top transition-transform duration-[length:2s] group-hover:scale-105"
                priority={idx === 0}
              />
            </motion.div>
          ))}
        </div>

        {/* COLUNA 3: COMPRA (RIGHT STICKY) - GLASS STYLE */}
        <div className="col-span-1 md:col-span-3 flex flex-col space-y-10 sticky top-32 glass-card p-6 border-none">
          <div className="space-y-2">
            <span className="text-[10px] tracking-widest font-bold text-hooke-400">
              {product.category}
            </span>
            <h1 className="text-4xl lg:text-5xl font-heading font-light tracking-tighter text-hooke-900 leading-[0.9]">
              {product.name}
            </h1>
            <p className="text-2xl font-sans text-hooke-900 tracking-tight mt-4 font-light">
              {formatter.format(product.price)}
            </p>
          </div>

          <div className="space-y-8">
            <div className="border-t border-black/5 pt-8">
              <div className="space-y-4">
                <p className="text-[11px] font-bold tracking-widest text-hooke-400">Selecione o tamanho</p>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || ['P', 'M', 'G', 'GG']).map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border text-[11px] font-bold flex items-center justify-center font-sans transition-all duration-300 ${
                        selectedSize === size 
                        ? 'bg-black text-white border-black' 
                        : 'border-black/10 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-hooke-elite w-full mt-10 py-6 text-[11px] font-bold tracking-[0.2em] group relative shadow-premium disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isAdding ? (
                    <span className="animate-pulse">Reservando...</span>
                  ) : (
                    <>
                      Finalizar Reserva no Lounge
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              <div className="mt-6 flex flex-col space-y-2 opacity-40">
                <div className="text-[9px] font-semibold text-hooke-900 flex justify-between tracking-tight">
                  <span>Envio imediato</span>
                  <span>Brasil</span>
                </div>
                <div className="text-[9px] font-semibold text-hooke-900 flex justify-between tracking-tight">
                  <span>Edição Limitada</span>
                  <span>Disponível</span>
                </div>
              </div>
            </div>
          </div>

          {/* Marca d&apos;água Hooke Elite Vertical */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 2 }}
            className="pt-12 hidden lg:block"
          >
             <span className="text-7xl font-heading font-light rotate-90 origin-left inline-block tracking-tighter whitespace-nowrap opacity-20 text-hooke-900">
                hooke elite
             </span>
          </motion.div>
        </div>

      </div>

      {/* RODAPÉ EDITORIAL */}
      <footer className="mt-32 max-w-[1440px] mx-auto border-t border-black/5 pt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="max-w-md">
          <p className="text-[10px] font-bold tracking-[0.2em] text-hooke-400 mb-4 uppercase">Ref.: {product.id}</p>
          <p className="text-sm font-medium text-hooke-900/60 leading-relaxed font-sans">
            Menos excesso, mais qualidade. A Hooke Elite redefine o essencial através de tecidos nobres e acabamento magistral.
          </p>
        </div>
        <div className="flex gap-12 lg:gap-20">
          <div className="flex flex-col space-y-1 text-right">
            <span className="text-[10px] font-bold text-hooke-400">Local</span>
            <span className="text-xs font-bold text-hooke-900 tracking-widest uppercase">São Paulo, BR</span>
          </div>
          <div className="flex flex-col space-y-1 text-right">
            <span className="text-[10px] font-bold text-hooke-400">Ano</span>
            <span className="text-xs font-bold text-hooke-900 tracking-widest">2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SsenseProductView;
