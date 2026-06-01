"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { Product } from "@/types";

interface GalleryCardProps {
  product: Product;
  priority?: boolean;
}

export default function GalleryCard({ product, priority = false }: GalleryCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const sizes = product.sizes || ["P", "M", "G", "GG"];
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://usehooke.com.br';

  const prepareImage = (src: string) => {
    if (!src) return { src: '', deliveryType: 'upload' as const };
    if (src.includes('res.cloudinary.com')) {
      const parts = src.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      return { src: publicId, deliveryType: 'upload' as const };
    }
    if (src.startsWith('/')) return { src: `${siteUrl}${src}`, deliveryType: 'fetch' as const };
    return { src, deliveryType: 'fetch' as const };
  };

  const imageProps = prepareImage(product.imageUrl || "");
  const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedSize) {
      alert("Por favor, selecione um tamanho antes de comprar.");
      return;
    }
    setIsAdding(true);
    addItem(product, selectedSize);
    // Redirecionamento brutal direto pro checkout
    router.push("/checkout");
  };

  return (
    <article className="flex flex-col h-full gap-3 border border-zinc-200 p-2 bg-white">
      {/* Foto (Direta, sem zoom) */}
      <Link href={`/produto/${product.slug || product.id}`} className="block relative w-full aspect-[2/3] bg-zinc-100">
        {imageProps.src ? (
          <CldImage
            src={imageProps.src}
            alt={product.name}
            fill
            className="object-cover object-top"
            priority={priority}
            deliveryType={imageProps.deliveryType}
            format="avif"
            quality="auto"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-zinc-400 text-xs font-bold uppercase">Sem Foto</span>
          </div>
        )}
      </Link>

      {/* Meta Dados */}
      <div className="flex flex-col gap-1 text-center mt-2 flex-grow">
        <h2 className="text-sm font-black uppercase text-black leading-tight">
          {product.name}
        </h2>
        <p className="text-lg font-black text-green-600">
          {formatter.format(product.price)}
        </p>
      </div>

      {/* Container de Ações (Fixo no fundo) */}
      <div className="mt-auto">
        {/* Seleção de Tamanho Permanente (Sem hover escondendo) */}
        <div className="grid grid-cols-4 gap-1 mt-1">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`py-2 text-xs font-bold uppercase border ${
                selectedSize === s
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-zinc-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Botão de Compra Direta */}
        <button
          onClick={handleBuyNow}
          disabled={isAdding}
          className="w-full mt-2 py-4 bg-black text-white text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          {isAdding ? "Processando..." : "Comprar Agora →"}
        </button>
      </div>
    </article>
  );
}
