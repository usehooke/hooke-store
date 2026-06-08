'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const [prevPath, setPrevPath] = useState(pathname);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setPrevPath(pathname);
  }, [pathname]);

  // Lógica de Slide (Swipe)
  let initialX = 0;
  let exitX = 0;

  if (prevPath.includes("/masculino") && pathname.includes("/feminino")) {
    initialX = 100; // Entra pela direita
    exitX = -100;   // Sai pela esquerda
  } else if (prevPath.includes("/feminino") && pathname.includes("/masculino")) {
    initialX = -100; // Entra pela esquerda
    exitX = 100;     // Sai pela direita
  } else {
    // Transição padrão fade + y leve para outras rotas
    initialX = 0;
    exitX = 0;
  }

  const isSwipe = Math.abs(initialX) > 0;

  if (!isMounted) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isSwipe ? { opacity: 0, x: initialX } : { opacity: 0, y: 5 }}
        animate={isSwipe ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
        exit={isSwipe ? { opacity: 0, x: exitX } : { opacity: 0, y: -5 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Curva Apple-like
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
