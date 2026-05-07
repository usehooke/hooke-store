'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Jost } from 'next/font/google';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

interface FashionSheetProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  price?: string;
  description?: string;
  tag?: string;
}

export default function FashionSheet({
  title,
  subtitle,
  imageSrc,
  price,
  description,
  tag = "HOOKE ELITE",
}: FashionSheetProps) {
  return (
    <div className={`relative w-full max-w-[1080px] aspect-[9/16] mx-auto bg-hooke-paper overflow-hidden shadow-editorial ${jost.className}`}>
      {/* Background Image com Zoom Sutil */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        {/* Overlay para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </motion.div>

      {/* Top Branding */}
      <div className="absolute top-8 left-8 z-10">
        <span className="text-[10px] font-medium tracking-[0.3em] text-hooke-900 uppercase">
          {tag}
        </span>
      </div>

      {/* Content Layout - Padrão Revista de Luxo */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-[80%]"
        >
          <p className="text-[12px] font-medium tracking-[0.2em] mb-2 text-white/80 uppercase">
            {subtitle}
          </p>
          <h1 className="text-5xl md:text-7xl font-light leading-[0.8] tracking-[-0.05em] mb-4 uppercase">
            {title}
          </h1>
          
          {description && (
            <p className="text-sm font-light leading-relaxed mb-6 opacity-70">
              {description}
            </p>
          )}

          {price && (
            <div className="flex items-center gap-4">
              <span className="text-2xl font-light tracking-tighter">
                {price}
              </span>
              <div className="h-[1px] w-12 bg-white/30" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-hooke-900/10 hidden md:block" />
    </div>
  );
}
