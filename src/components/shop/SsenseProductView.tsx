"use client";

import React, { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicialização do SDK do Mercado Pago (Google Pay / Apple Pay)
// Em produção, isso usará a chave real do .env
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'TEST-mock-key', { locale: 'pt-BR' });

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

  // Função centralizada de telemetria GA4 / GTM
  const trackEcommerceEvent = (eventName: string, size?: string) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ ecommerce: null }); // Clear anterior para evitar duplicação
      (window as any).dataLayer.push({
        event: eventName,
        ecommerce: {
          currency: "BRL",
          value: product.price,
          items: [
            {
              item_id: product.id,
              item_name: product.name,
              item_brand: "HOOKE",
              item_category: product.category,
              price: product.price,
              item_variant: size || "N/A",
              quantity: 1
            }
          ]
        }
      });
    }
  };

  // Dispara evento de view_item assim que renderiza
  useEffect(() => {
    trackEcommerceEvent('view_item');
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor, selecione um tamanho para sua curadoria.', {
        style: { borderRadius: 0, background: '#000', color: '#fff', border: 'none' }
      });
      return;
    }

    // Telemetria PMax: Adição ao Carrinho Tátil
    trackEcommerceEvent('add_to_cart', selectedSize);

    setIsAdding(true);
    
    setTimeout(() => {
      addItem(product, selectedSize);

      toast.success(`${product.name} reservado com sucesso no seu Lounge.`, {
        icon: <Check size={14} />,
        style: { borderRadius: 0, background: '#000', color: '#fff', border: 'none' }
      });
      
      setIsAdding(false);
    }, 400); // Reduzido de 800ms para 400ms para manter peso sem penalizar conversão
  };

  return (
    <div className="bg-white min-h-screen pt-24 px-6 lg:px-12 pb-24 selection:bg-black selection:text-white font-mono">
      
      {/* GRID EDITORIAL 3 COLUNAS */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* COLUNA 1: DETALHES (LEFT STICKY) - BRUTALIST STYLE */}
        <div className="hidden md:flex md:col-span-3 flex-col space-y-12 sticky top-32 p-6 border-2 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-none">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-black uppercase border-b-2 border-black pb-2">
              Detalhes do Produto
            </h2>
            <div className="space-y-6 pt-4">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-black uppercase tracking-widest">Sku</p>
                <p className="text-xs text-black">{product.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-black uppercase tracking-widest">Composição</p>
                <p className="text-xs text-black">{product.details?.fabric || 'Algodão Premium Heavyweight 260g'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-black uppercase tracking-widest">Corte</p>
                <p className="text-xs text-black">{product.details?.model || 'Editorial Boxy Estruturado'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-black uppercase tracking-widest">Lavagem</p>
                <p className="text-xs text-black">{product.details?.wash || 'Manual / Dry Clean'}</p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-black pt-8">
            <p className="text-[11px] leading-relaxed text-black font-medium uppercase tracking-widest text-justify">
              {product.description ? `"${product.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}"` : 'DESIGN ESSENCIAL PARA A PERMANÊNCIA ABSOLUTA.'}
            </p>
          </div>
        </div>

        {/* COLUNA 2: GALERIA VERTICAL (CENTER SCROLL) */}
        <div className="col-span-1 md:col-span-6 space-y-4 md:space-y-8">
          {(product.images && product.images.length > 0 ? product.images : [product.imageUrl]).map((img: string, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="relative aspect-[2/3] w-full bg-white group overflow-hidden border-2 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)]"
            >
              <CldImage
                src={img}
                alt={`${product.name} - Vista ${idx + 1}`}
                fill
                className="object-cover object-top transition-transform duration-[length:2s] group-hover:scale-105"
                priority={idx === 0}
                deliveryType="fetch"
                format="avif"
                quality="auto"
              />
            </motion.div>
          ))}
        </div>

        {/* COLUNA 3: COMPRA (RIGHT STICKY) - BRUTALIST STYLE */}
        <div className="col-span-1 md:col-span-3 flex flex-col space-y-10 sticky top-32 p-6 border-2 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-none">
          <div className="space-y-2 border-b-2 border-black pb-6">
            <span className="text-[10px] tracking-[0.4em] font-black text-black uppercase">
              {product.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-black uppercase leading-[0.9] mt-2">
              {product.name}
            </h1>
            <p className="text-2xl font-black text-black tracking-tighter mt-4">
              {formatter.format(product.price)}
            </p>
          </div>

          <div className="space-y-8">
            <div className="pt-2">
              <div className="space-y-4">
                <p className="text-[11px] font-black tracking-[0.2em] text-black uppercase">Selecione o tamanho</p>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || ['P', 'M', 'G', 'GG']).map((size: string) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border-2 text-[11px] font-black flex items-center justify-center transition-all duration-150 uppercase rounded-none ${
                        selectedSize === size 
                        ? 'bg-black text-white border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] translate-x-[-1px] translate-y-[-1px]' 
                        : 'bg-white text-black border-black hover:bg-zinc-100 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-10">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full py-4 text-[11px] font-black tracking-[0.2em] group relative shadow-[6px_6px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:shadow-none bg-white text-black uppercase border-2 border-black hover:bg-black hover:text-white transition-colors rounded-none"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isAdding ? (
                      <span className="animate-pulse">PROCESSANDO...</span>
                    ) : (
                      <>
                        ADICIONAR AO LOUNGE
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                {/* BOTÃO ONE-TAP MERCADO PAGO / GPAY */}
                {selectedSize ? (
                  <div className="w-full mt-2 relative z-0">
                    <p className="text-[9px] text-center font-bold tracking-widest text-black/50 mb-2 uppercase">Compra Expressa</p>
                    {/* O Wallet Brick injeta o botão nativo do GPay/ApplePay do Mercado Pago */}
                    <div className="border-2 border-black p-1 shadow-[6px_6px_0px_rgba(0,0,0,1)] bg-black/5">
                      <Wallet 
                        initialization={{ preferenceId: '<A_PREFERENCE_ID_SERA_GERADA_AQUI>' }} 
                        customization={{ texts: { action: 'pay', valueProp: 'security_details' } }}
                      />
                    </div>
                  </div>
                ) : (
                   <button 
                    disabled
                    className="w-full mt-2 py-4 text-[11px] font-black tracking-[0.2em] shadow-[6px_6px_0px_rgba(0,0,0,0.1)] bg-black/5 text-black/30 uppercase border-2 border-black/10 rounded-none flex items-center justify-center gap-2"
                  >
                    <Zap size={14} /> EXPRESSO (GPay)
                  </button>
                )}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black flex flex-col space-y-3">
                <div className="text-[9px] font-black text-black flex justify-between tracking-[0.2em] uppercase">
                  <span>ENVIO IMEDIATO</span>
                  <span>BRASIL</span>
                </div>
                <div className="text-[9px] font-black text-black flex justify-between tracking-[0.2em] uppercase">
                  <span>EDIÇÃO LIMITADA</span>
                  <span>DISPONÍVEL</span>
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
