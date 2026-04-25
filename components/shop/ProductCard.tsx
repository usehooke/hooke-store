"use client";

import { Product, SITE_CONFIG } from "@/data/catalogo";
import Image from "next/image";
import Link from 'next/link';
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const parcelas = SITE_CONFIG.max_parcelas;
  const valorParcela = (product.price / parcelas).toFixed(2).replace('.', ',');
  const precoFormatado = product.price.toFixed(2).replace('.', ',');
  const [imgError, setImgError] = useState(false);
  const [imgError2, setImgError2] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link href={`/produto/${product.slug}`} className="block w-full">
        {/* 1. IMAGEM CONTAINER */}
        <div className="relative aspect-[3/4] overflow-hidden bg-hooke-paper skeleton-shimmer mb-4">
          {!imgError ? (
            <Image
              priority={priority}
              src={product.imageUrl}
              alt={product.seoAltText || product.name}
              fill
              className={`object-cover object-center transition-all duration-1000 ${product.images && (product.images as string[]).length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#F5F5F5] flex flex-col items-center justify-center border border-black/5 shadow-alabastro">
               <span className="text-[10px] font-bold tracking-[0.3em] text-hooke-400 uppercase">Imagem Indisponível</span>
            </div>
          )}

          {product.images && (product.images as string[]).length > 1 && (
            !imgError2 ? (
              <Image
                src={product.images[1]}
                alt={`${product.name} - Ângulo 2`}
                fill
                className="object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => setImgError2(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-[#F5F5F5] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center border border-black/5 shadow-alabastro transition-all duration-1000">
                <span className="text-[10px] font-bold tracking-[0.3em] text-hooke-400 uppercase">Hooke Elite</span>
              </div>
            )
          )}
          
          {/* Badge Minimalista */}
          {product.isNew && (!product.totalStock || product.totalStock > 24) && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-hooke-900 text-white text-[9px] font-bold px-2 py-1 tracking-[0.2em]">
                Novo
              </span>
            </div>
          )}

          {/* Badge de Pré-venda Elite */}
          {product.description?.includes('PRÉ-VENDA') && (
            <div className="absolute top-4 right-4 z-20">
              <span className="bg-white text-black text-[8px] font-black px-2 py-1 tracking-[0.1em] border border-black shadow-sm uppercase">
                Pré-venda
              </span>
            </div>
          )}

          {/* Gatilho de Escassez Elegante */}
          {product.totalStock !== undefined && product.totalStock <= 24 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-hooke-200 px-2 py-1 shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-none bg-red-600 animate-pulse"></div>
              <span className="text-hooke-900 text-[8px] font-bold uppercase tracking-[0.2em]">
                {product.totalStock <= 8 ? 'Lote Final' : `Lote 001 - ${product.totalStock} Unidades`}
              </span>
            </motion.div>
          )}

          {/* Overlay suave no Hover */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Quick Add Button (Visual only) */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-full bg-white text-hooke-900 p-3 text-[10px] font-bold tracking-[0.2em] flex items-center justify-center gap-2 shadow-sm">
              <ShoppingBag size={12} />
              Adicionar ao carrinho
            </div>
          </div>
        </div>

        {/* 2. INFO (EDITORIAL STYLE - BELOW IMAGE) */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h3 className="text-hooke-900 font-heading font-light text-lg leading-tight group-hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-hooke-900 tracking-tight">
              R$ {precoFormatado}
            </span>
            <span className="text-[10px] text-hooke-400 font-medium tracking-widest">
              {parcelas}x R$ {valorParcela}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
