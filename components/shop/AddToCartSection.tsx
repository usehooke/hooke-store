// components/shop/AddToCartSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { ShoppingBag, Check, Ruler } from "lucide-react";
import Image from "next/image";
import SizeGuideModal from "./SizeGuideModal";
import SizeQuizModal from "./SizeQuizModal";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import InventoryBadge from "./InventoryBadge";

interface AddToCartSectionProps {
  product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors && product.colors.length > 0 ? product.colors[0].name : null);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeQuizOpen, setIsSizeQuizOpen] = useState(false);
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setIsStickyVisible(window.scrollY > 600);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Escolha um tamanho', {
        description: 'Precisamos saber se serve em você! 😉',
        duration: 3000,
      });
      return;
    }

    addItem(product, selectedSize, selectedColor || undefined);

    trackEvent('AddToCart', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'BRL',
      content_category: product.category
    });

    setIsAdded(true);

    toast.success('Adicionado à sacola!', {
      description: `${product.name} (Tam: ${selectedSize}${selectedColor ? ` / Cor: ${selectedColor}` : ''})`,
      duration: 4000,
      action: {
        label: 'Ver Sacola',
        onClick: () => useCartStore.getState().openCart(),
      },
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 delay-300">

      {/* SELEÇÃO DE CORES */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-bold tracking-wider text-hooke-900 mb-4 uppercase">
            Cores
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color, idx) => {
              const isSelected = selectedColor === color.name;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedColor(color.name);
                    setSelectedSize(null);
                    window.dispatchEvent(new CustomEvent('change-product-image', { detail: color.imageUrl }));
                  }}
                  className={`group relative flex flex-col items-center gap-1 ${isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  <div className={`w-10 h-10 border overflow-hidden relative transition-all ${isSelected ? 'border-hooke-900 ring-2 ring-hooke-900 ring-offset-2' : 'border-gray-200'}`}>
                    <Image priority src={color.imageUrl} alt={color.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-hooke-900' : 'text-gray-500'}`}>{color.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* SELEÇÃO DE TAMANHOS */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm font-bold tracking-wider text-hooke-900 uppercase">
            Tamanhos
          </h3>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsSizeQuizOpen(true)}
              className="group flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-hooke-500 hover:text-hooke-900 transition-colors uppercase"
            >
              <Ruler size={14} className="group-hover:rotate-12 transition-transform" />
              Provador Virtual
            </button>
            <SizeGuideModal />
          </div>
        </div>

        <SizeQuizModal 
          isOpen={isSizeQuizOpen} 
          onClose={() => setIsSizeQuizOpen(false)} 
          onComplete={(size) => {
            setRecommendedSize(size);
            setSelectedSize(size);
          }}
        />

        <div className="flex flex-wrap gap-3">
          {["P", "M", "G", "GG", "XG"].map((size) => {
            let hasStock = false;

            if (product.stock) {
              const comboKey = selectedColor ? `${selectedColor}-${size}` : size;
              const stockQuantity = product.stock[comboKey] || 0;
              hasStock = stockQuantity > 0;
            } else {
              hasStock = product.sizes.includes(size);
            }

            const isSelected = selectedSize === size;
            const isRecommended = recommendedSize === size;

            return (
              <button
                key={size}
                onClick={() => hasStock && setSelectedSize(size)}
                disabled={!hasStock}
                className={`
                  relative w-12 h-12 flex items-center justify-center font-bold transition-all duration-200
                  ${!hasStock ? "opacity-30 cursor-not-allowed bg-gray-100 text-gray-400 border-2 border-gray-200" :
                    isSelected
                      ? "bg-hooke-900 text-white border-2 border-hooke-900 scale-105 shadow-md"
                      : isRecommended 
                      ? "bg-white text-hooke-900 border-2 border-hooke-900 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                      : "bg-white text-hooke-600 border-2 border-hooke-200 hover:border-hooke-400 hover:text-hooke-900"
                  }
                `}
                title={!hasStock ? "Esgotado" : isRecommended ? "Tamanho recomendado para você" : ""}
              >
                {size}
                {hasStock && isRecommended && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white p-0.5 shadow-sm animate-bounce">
                    <Check size={10} strokeWidth={4} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <InventoryBadge 
        stock={product.stock} 
        selectedSize={selectedSize} 
        selectedColor={selectedColor} 
      />

      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || isAdded}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-5 text-base font-bold tracking-widest transition-all duration-300
          ${isAdded
            ? "bg-green-600 text-white cursor-default"
            : !selectedSize
            ? "bg-hooke-100 text-hooke-400 cursor-not-allowed"
            : "bg-hooke-900 text-white hover:bg-hooke-800 hover:shadow-lg active:scale-[0.98]"
          }
        `}
      >
        {isAdded ? (
          <>
            <Check size={20} />
            Na Sacola!
          </>
        ) : (
          <>
            <ShoppingBag size={20} />
            {selectedSize ? "Adicionar à Sacola" : "Selecione um Tamanho"}
          </>
        )}
      </button>

      <div className={`
        fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-all duration-500 md:hidden
        ${isStickyVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}>
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <div className="flex-1 min-w-0">
            <h4 className="text-[10px] font-bold text-gray-400 tracking-widest truncate uppercase">{product.name}</h4>
            <p className="text-sm font-black text-hooke-900">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || isAdded}
            className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest transition-all
              ${isAdded ? "bg-green-600 text-white" : !selectedSize ? "bg-hooke-100 text-hooke-400" : "bg-hooke-900 text-white active:scale-95"}
            `}
          >
            {isAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
            {isAdded ? "Na Sacola" : selectedSize ? "Comprar" : "Selecione Tam"}
          </button>
        </div>
      </div>
    </div>
  );
}