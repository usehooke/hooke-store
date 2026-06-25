"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    if (src.startsWith('/')) return { src: src, deliveryType: 'local' as const };
    return { src, deliveryType: 'fetch' as const };
  };

  const imageProps = prepareImage(product.imageUrl || "");
  const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  const secondaryImageSrc = (() => {
    const src = product.imageUrl || "";
    if (src.includes("-1.jpg")) return src.replace("-1.jpg", "-2.jpg");
    if (src.includes("_01.png")) return src.replace("_01.png", "_02.png");
    if (src.includes("_01.jpg")) return src.replace("_01.jpg", "_02.jpg");
    if (src.includes("_01.avif")) return src.replace("_01.avif", "_02.avif");
    if (src.includes("HK_ELITE_WAFER_OW.png")) return "/produtos/HK_ELITE_WAFER_OW_V2.png";
    if (src.includes("HK_ELITE_HEAVY_BLACK.png")) return "/produtos/HK_ELITE_HEAVY_BLACK_V2.png";
    if (src.includes("hk_prod_vi_fusca_areia_01.png")) return "/produtos/HK_PROD_VI_FUSCA_EDITORIAL_01.png";
    return null;
  })();

  const secondaryProps = secondaryImageSrc ? prepareImage(secondaryImageSrc) : null;
  const weightBadge = product.name.toLowerCase().includes("wafer") ? "280g/m²" : "260g/m²";

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedSize) {
      alert("Por favor, selecione um tamanho antes de comprar.");
      return;
    }
    setIsAdding(true);
    addItem(product, selectedSize);
    router.push("/checkout");
  };

  return (
    <Card variant="product" className="flex flex-col h-full gap-3 p-2 bg-white">
      {/* Foto (Com Hover Reveal e Badge de Peso) */}
      <Link 
        href={`/produto/${product.slug || product.id}`} 
        className="block relative w-full aspect-[2/3] bg-[#FAF9F7] overflow-hidden group border border-black/5"
      >
        {/* Badge Têxtil Discreta */}
        <span className="absolute top-2 left-2 text-[8px] font-mono tracking-widest uppercase bg-black text-white px-2 py-0.5 z-10">
          {weightBadge}
        </span>

        {imageProps.src ? (
          <div className="w-full h-full relative">
            {/* Imagem Principal */}
            {imageProps.deliveryType === 'local' ? (
              <Image
                src={imageProps.src}
                alt={product.name}
                fill
                className={`object-cover object-top transition-all duration-700 ${
                  secondaryProps ? "opacity-100 group-hover:opacity-0" : "group-hover:scale-105"
                }`}
                priority={priority}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              />
            ) : (
              <CldImage
                src={imageProps.src}
                alt={product.name}
                fill
                className={`object-cover object-top transition-all duration-700 ${
                  secondaryProps ? "opacity-100 group-hover:opacity-0" : "group-hover:scale-105"
                }`}
                priority={priority}
                loading={priority ? undefined : "lazy"}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                deliveryType={imageProps.deliveryType as any}
                format="avif"
                quality="auto"
              />
            )}

            {/* Imagem de Hover (Se disponível) */}
            {secondaryProps && (
              secondaryProps.deliveryType === 'local' ? (
                <Image
                  src={secondaryProps.src}
                  alt={`${product.name} Editorial`}
                  fill
                  className="absolute inset-0 object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-103 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
              ) : (
                <CldImage
                  src={secondaryProps.src}
                  alt={`${product.name} Editorial`}
                  fill
                  className="absolute inset-0 object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-103 transition-transform duration-700"
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  deliveryType={secondaryProps.deliveryType as any}
                  format="avif"
                  quality="auto"
                />
              )
            )}
          </div>
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
        <div className="flex flex-col gap-0.5 mt-1">
          <p className="text-xs font-bold text-zinc-400 line-through">
            {formatter.format(product.price)}
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-base font-black text-black">
              {formatter.format(product.price * 0.85)}
            </span>
            <span className="text-[8px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 uppercase tracking-wider">
              PIX -15%
            </span>
          </div>
        </div>
      </div>

      {/* Container de Ações (Fixo no fundo) */}
      <div className="mt-auto">
        {/* Seleção de Tamanho */}
        <div className="grid grid-cols-4 gap-1 mt-1">
          {sizes.map((s) => (
            <Button
              key={s}
              variant={selectedSize === s ? "buy" : "outline"}
              size="xs"
              onClick={() => setSelectedSize(s)}
              aria-pressed={selectedSize === s}
              className={selectedSize === s ? "" : "border-zinc-200 hover:border-black"}
            >
              {s}
            </Button>
          ))}
        </div>

        {/* Botão de Compra Direta */}
        <Button
          variant="buy"
          size="lg"
          fullWidth
          onClick={handleBuyNow}
          disabled={isAdding}
          aria-label={`Comprar ${product.name} agora`}
          className="mt-2 py-4"
        >
          {isAdding ? "Processando..." : "Comprar Agora →"}
        </Button>
      </div>
    </Card>
  );
}
