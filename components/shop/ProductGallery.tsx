"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { motion, useScroll, useSpring } from "framer-motion";

interface ProductGalleryProps {
 product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
 const images = product.images && product.images.length > 0
 ? product.images
 : [product.imageUrl];

 const containerRef = useRef<HTMLDivElement>(null);

 // Hook para barra de progresso no mobile (Sinaliza que tem mais fotos)
 const { scrollXProgress } = useScroll({ container: containerRef });
 const scaleX = useSpring(scrollXProgress, {
 stiffness: 100,
 damping: 30,
 restDelta: 0.001
 });

 // V4: Ouve eventos de mudança de cor
 useEffect(() => {
 const handleImageChange = () => {
 // TODO: Implementar scroll automático para a imagem da cor selecionada no futuro
 };
 window.addEventListener("change-product-image", handleImageChange);
 return () => window.removeEventListener("change-product-image", handleImageChange);
 }, []);

 return (
 <div className="w-full flex flex-col gap-4">
 
 {/* 1. LAYOUT DESKTOP: LISTA VERTICAL (ESTILO LUXO ZARA/FARFETCH) */}
 <div className="hidden md:flex flex-col gap-4">
 {images.map((img, index) => (
 <div 
 key={index} 
 className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden group cursor-zoom-in border border-gray-100"
 >
 <Image
 src={img}
 alt={`${product.name} - Vista ${index + 1}`}
 fill
 priority={index === 0}
 className="object-cover object-center transition-all duration-1000 group-hover:scale-110 group-hover:contrast-[1.05] group-hover:brightness-[1.02]"
 sizes="70vw"
 />
 </div>
 ))}
 </div>

 {/* 2. LAYOUT MOBILE: CARROSSEL COM PROGRESS BAR */}
 <div className="md:hidden relative w-full">
 {/* Barra de Progresso Superior (Sutil) */}
 <motion.div 
 className="absolute top-0 left-0 right-0 h-1 bg-hooke-900 origin-left z-20"
 style={{ scaleX }}
 />

 <div 
 ref={containerRef}
 className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-[75vh]"
 >
 {images.map((img, index) => (
 <div 
 key={index} 
 className="relative w-full flex-shrink-0 snap-center aspect-[4/5]"
 >
 <Image
 src={img}
 alt={`${product.name} - Vista ${index + 1}`}
 fill
 priority={index === 0}
 className="object-cover object-center"
 sizes="100vw"
 />
 <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white tracking-widest">
 {index + 1} / {images.length}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}