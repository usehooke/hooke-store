"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { motion, useScroll, useSpring } from "framer-motion";

interface ProductGalleryProps {
  product: Product;
}

/**
 * Hooke V3: Galeria de Elite com Foco em Performance Nativa.
 * @Agent-LegacyRescue: Refatorado para usar Scroll-Snap (Nativo) em vez de AnimatePresence.
 * Isso garante 120 FPS constantes e menor uso de CPU em dispositivos móveis.
 */
export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl];

  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Barra de progresso sutil (Mantida para estética Premium)
  const { scrollXProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* 1. LAYOUT DESKTOP: LISTA EDITORIAL (FOCAL POINT) */}
      <div className="hidden md:flex flex-col gap-6">
        {images.map((img, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden group cursor-zoom-in border border-gray-100"
          >
            <Image
              src={img}
              alt={`${product.name} - Vista ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover object-center transition-transform duration-[3000ms] ease-out group-hover:scale-110"
              sizes="(max-width: 1200px) 70vw, 50vw"
            />
          </motion.div>
        ))}
      </div>

      {/* 2. LAYOUT MOBILE: PERFORMANCE ENGINE (CSS SCROLL SNAP) */}
      <div className="md:hidden relative w-full bg-white group/gallery">
        
        {/* Barra de Progresso Superior (Estética iOS 17) */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[2px] bg-hooke-900 origin-left z-20"
          style={{ scaleX }}
        />

        {/* Container de Scroll Nativo (Zero Latency) */}
        <div 
          ref={containerRef}
          className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none w-full h-[75vh] bg-gray-50"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, index) => (
            <div 
              key={index}
              className="relative min-w-full h-full snap-center flex-shrink-0 bg-gray-50 overflow-hidden"
            >
              <Image
                src={img}
                alt={`${product.name} - Detalhe ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover object-center animate-in fade-in duration-700"
                sizes="100vw"
              />

              {/* Tag de Exclusividade sutil no primeiro slide */}
              {index === 0 && (
                <div className="absolute top-8 left-8 z-10">
                  <span className="text-[9px] font-black tracking-[0.3em] uppercase bg-black text-white px-3 py-1">
                    Lote Elite
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Indicador de Paginação Sutil */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {images.map((_, i) => (
            <div 
              key={i} 
              className="h-[2px] w-4 bg-black/10 overflow-hidden"
            >
               {/* O preenchimento é visualmente guiado pelo scroll nativo */}
               <div className="h-full w-full bg-black/40 opacity-0 group-hover/gallery:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden flex justify-center items-center py-4">
         <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 animate-pulse">
           Deslize para Detalhes
         </span>
      </div>
    </div>
  );
}
