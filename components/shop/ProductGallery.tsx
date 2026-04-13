"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

interface ProductGalleryProps {
  product: Product;
}

/**
 * Hooke V3: Galeria de Elite com Gestos Nativos (Native-like Experience).
 * Implementa Swipe de alta fidelidade com inércia e elasticidade via Framer Motion.
 */
export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl];

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Barra de progresso sutil
  const { scrollXProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* 1. LAYOUT DESKTOP: LISTA VERTICAL (ESTILO LUXO ZARA/FARFETCH) */}
      <div className="hidden md:flex flex-col gap-4">
        {images.map((img, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden group cursor-zoom-in border border-gray-100"
          >
            <Image
              src={img}
              alt={`${product.name} - Vista ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover object-center transition-all duration-1000 group-hover:scale-110"
              sizes="70vw"
            />
          </motion.div>
        ))}
      </div>

        <motion.div 
          className="absolute top-0 left-0 right-0 h-[3px] bg-hooke-900 origin-left z-20 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
          style={{ scaleX }}
        />

        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex cursor-grab active:cursor-grabbing w-full h-[70vh] bg-gray-50"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 40,
                mass: 0.8
              }}
              className="relative w-full h-full flex-shrink-0"
            >
              <Image
                src={images[currentIndex]}
                alt={`${product.name} - Vista ${currentIndex + 1}`}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
              
              {/* Contador de Fotos Minimalista */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                {images.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === currentIndex ? "w-8 bg-hooke-900" : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 🔮 PINCH-TO-ZOOM: Placeholder para futura biblioteca dedicada para Pinch Real no Next 15 */}
      <div className="md:hidden text-center text-[10px] uppercase tracking-widest text-gray-400 py-2">
        Deslize para ver mais fotos
      </div>
    </div>
  );
}