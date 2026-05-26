"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { Check, ShoppingBag } from "lucide-react";
import { Product } from "@/types";

interface GalleryCardProps {
  product: Product;
  priority?: boolean;
}

/**
 * Hooke Gallery Card — "Obra de Arte Comprável"
 *
 * Estratégia de CRO:
 * - Mobile: Toque na foto → revela seletor de tamanho inline (sem redirect).
 * - Desktop: Hover → overlay com seletores desliza de baixo para cima.
 * - A foto é soberana. Os gatilhos de compra são silenciosos até precisarem existir.
 */
export default function GalleryCard({ product, priority = false }: GalleryCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false); // Mobile: toque na foto
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const sizes = product.sizes || ["P", "M", "G", "GG"];
  
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://usehooke.com.br';

  const prepareImage = (src: string) => {
    if (!src) return { src: '', deliveryType: 'upload' as const };
    
    // Se for URL completa do Cloudinary
    if (src.includes('res.cloudinary.com')) {
      const parts = src.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      return { src: publicId, deliveryType: 'upload' as const };
    }
    
    // Se for caminho local (ex: /images/mock1.png)
    if (src.startsWith('/')) {
      return { src: `${siteUrl}${src}`, deliveryType: 'fetch' as const };
    }
    
    // Outras URLs
    return { src, deliveryType: 'fetch' as const };
  };

  const imageProps = prepareImage(product.imageUrl || "");

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize) {
      toast.error("Toque em um tamanho para adicionar.", {
        style: { borderRadius: 0, background: "#000", color: "#fff", border: "none" },
      });
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      addItem(product, selectedSize);
      toast.success(`${product.name} · ${selectedSize} — adicionado.`, {
        icon: <Check size={13} />,
        style: { borderRadius: 0, background: "#000", color: "#fff", border: "none" },
      });
      setIsAdding(false);
      setIsRevealed(false);
      setSelectedSize(null);
    }, 300);
  };

  return (
    <article className="group relative flex flex-col gap-3">
      {/* ─── FOTO PRINCIPAL ─── */}
      <div
        className="relative w-full aspect-[2/3] overflow-hidden bg-zinc-100 cursor-pointer"
        onClick={() => setIsRevealed((p) => !p)}
      >
        <Link href={`/produto/${product.slug || product.id}`} onClick={(e) => isRevealed && e.preventDefault()}>
          {imageProps.src ? (
            <CldImage
              src={imageProps.src}
              alt={product.name}
              fill
              className="object-cover object-top transition-transform duration-[1800ms] group-hover:scale-105"
              priority={priority}
              deliveryType={imageProps.deliveryType}
              format="avif"
              quality="auto"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
              <span className="text-zinc-400 text-xs font-black uppercase tracking-widest">Sem Foto</span>
            </div>
          )}
        </Link>

        {/* TAG VIP (Escassez Premium) */}
        {product.featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black text-white text-[8px] font-black tracking-[0.2em] uppercase px-2.5 py-1">
              DROP
            </span>
          </div>
        )}

        {/* TAG ESTOQUE BAIXO (Gatilho Invisível de Escassez) */}
        {product.totalStock !== undefined && product.totalStock > 0 && product.totalStock <= 5 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-white text-black text-[8px] font-black tracking-[0.15em] uppercase px-2 py-1 border border-black/20">
              {product.totalStock} restantes
            </span>
          </div>
        )}

        {/* OVERLAY DE COMPRA RÁPIDA (Desktop Hover) */}
        <div className="hidden md:flex absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex-col gap-2 bg-white/95 backdrop-blur-sm p-3 border-t border-black/10">
          <div className="flex gap-1.5">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(s);
                }}
                className={`flex-1 h-9 text-[10px] font-black border transition-all uppercase ${
                  selectedSize === s
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black/30 hover:border-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full py-2.5 text-[10px] font-black tracking-[0.15em] bg-black text-white uppercase hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isAdding ? (
              <span className="animate-pulse">ADICIONANDO...</span>
            ) : (
              <>
                <ShoppingBag size={11} />
                {selectedSize ? `ADICIONAR · ${selectedSize}` : "SELECIONE UM TAMANHO"}
              </>
            )}
          </button>
        </div>

        {/* OVERLAY DE COMPRA RÁPIDA (Mobile Toque) */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-3 border-t border-black/10 flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-4 gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-11 text-[11px] font-black border-2 uppercase transition-all ${
                      selectedSize === s
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleQuickAdd}
                  disabled={isAdding}
                  className="flex-1 py-3 text-[10px] font-black tracking-widest bg-black text-white uppercase flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isAdding ? "..." : <><ShoppingBag size={12} /> ADICIONAR</>}
                </button>
                <Link
                  href={`/produto/${product.slug || product.id}`}
                  className="px-4 py-3 text-[10px] font-black border-2 border-black text-black uppercase flex items-center justify-center"
                >
                  VER
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── META (ABAIXO DA FOTO) ─── */}
      <Link
        href={`/produto/${product.slug || product.id}`}
        className="flex flex-col gap-0.5"
      >
        <div className="flex justify-between items-baseline">
          <p className="text-[11px] font-black text-black uppercase tracking-tight truncate max-w-[75%]">
            {product.name}
          </p>
          <p className="text-[11px] font-black text-black shrink-0">
            {formatter.format(product.price)}
          </p>
        </div>
        {product.category && (
          <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-[0.15em]">
            {product.category}
          </p>
        )}
      </Link>
    </article>
  );
}
