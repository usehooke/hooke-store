import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * HOOKE ELITE: ATELIER DRAMA IMAGE COMPONENT
 * Implementa o padrão Blur-up para imagens de alta resolução.
 * Garante transições suaves e previne Cumulative Layout Shift (CLS).
 */

const OptimizedImage = ({ src, lowResSrc, alt, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#F5F5F5] ${className}`}>
      
      {/* 1. CAMADA DE BAIXA RESOLUÇÃO (Blur Inicial) */}
      <img
        src={lowResSrc}
        alt={alt}
        className={`
          w-full h-full object-cover 
          filter blur-xl scale-110 
          transition-opacity duration-1000 ease-in-out
          ${isLoaded ? 'opacity-0' : 'opacity-100'}
        `}
      />

      {/* 2. CAMADA DE ALTA RESOLUÇÃO (Fade-in) */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        onLoad={() => setIsLoaded(true)}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Overlay de Luxo (Opcional, mantém estética Hooke) */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
    </div>
  );
};

export default OptimizedImage;
