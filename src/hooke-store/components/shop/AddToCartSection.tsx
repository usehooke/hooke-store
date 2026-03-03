// components/shop/AddToCartSection.tsx
"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { ShoppingBag, Check } from "lucide-react";
import Image from "next/image";
import SizeGuideModal from "./SizeGuideModal";
import toast from "react-hot-toast"; // CORRIGIDO: Agora está em inglês correto

interface AddToCartSectionProps {
  product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  // Pegamos a função de adicionar da store
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // 1. Validação: Obriga a escolher tamanho
    if (!selectedSize) {
      toast.error(
        () => (
          <div style={{ textAlign: 'center' }}>
            <b>Ops! Escolha um tamanho.</b>
            <br />
            <span>Precisamos saber se serve em você! 😉</span>
          </div>
        ),
        {
          duration: 3000,
        }
      );
      return;
    }

    // 2. Adiciona ao carrinho (Passando Produto E Tamanho)
    addItem(product, selectedSize);

    // 3. Feedback Visual e Notificação
    setIsAdded(true);

    toast.success(
      (t) => (
        <div className="flex flex-col items-center gap-2 text-center">
          <div>
            <b className="font-bold">Adicionado à sacola!</b>
            <p className="text-sm">{`${product.name} (Tam: ${selectedSize})`}</p>
          </div>
          <button
            onClick={() => {
              useCartStore.getState().openCart();
              toast.dismiss(t.id);
            }}
            className="mt-2 px-4 py-2 w-full text-center text-sm font-semibold text-white bg-slate-800 rounded-md shadow-md"
          >
            Ver Sacola
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );

    // Reseta o estado do botão depois de 2 segundos
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 delay-300">

      {/* SELEÇÃO DE CORES (V4) */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-hooke-900 mb-4">
            Cores
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('change-product-image', { detail: color.imageUrl }));
                }}
                className="group relative flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden relative group-hover:ring-2 group-hover:ring-hooke-900 group-hover:ring-offset-2 transition-all">
                  <Image src={color.imageUrl} alt={color.name} fill className="object-cover" sizes="40px" />
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-500 group-hover:text-hooke-900">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SELEÇÃO DE TAMANHOS */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-hooke-900">
            Tamanhos
          </h3>
          <SizeGuideModal />
        </div>

        <div className="flex flex-wrap gap-3">
          {["P", "M", "G", "GG", "XG"].map((size) => {
            const hasStock = product.sizes.includes(size);
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                onClick={() => hasStock && setSelectedSize(size)}
                disabled={!hasStock}
                className={`
                  w-12 h-12 flex items-center justify-center rounded-sm font-bold transition-all duration-200
                  ${!hasStock ? "opacity-30 cursor-not-allowed bg-gray-100 text-gray-400 border-2 border-gray-200" :
                    isSelected
                      ? "bg-hooke-900 text-white border-2 border-hooke-900 scale-105 shadow-md"
                      : "bg-white text-hooke-600 border-2 border-hooke-200 hover:border-hooke-400 hover:text-hooke-900"
                  }
                `}
                title={!hasStock ? "Esgotado" : ""}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTÃO DE AÇÃO */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || isAdded}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-5 rounded-sm text-base font-bold uppercase tracking-widest transition-all duration-300
          ${isAdded
            ? "bg-green-600 text-white cursor-default"
            : !selectedSize
              ? "bg-hooke-100 text-hooke-400 cursor-not-allowed" // Desabilitado (Cinza Claro)
              : "bg-hooke-900 text-white hover:bg-hooke-800 hover:shadow-lg active:scale-[0.98]" // Habilitado (Preto)
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
    </div>
  );
}