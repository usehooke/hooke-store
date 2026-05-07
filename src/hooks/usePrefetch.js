import { useEffect, useRef } from 'react';

/**
 * HOOKE ELITE: PREDICTIVE PREFETCHING HOOK
 * Detecta quando um componente entra no campo de visão para antecipar o carregamento.
 * Foco em Latência Zero para a experiência de luxo.
 */

export const usePrefetch = (onEnter, threshold = 0.5) => {
  const elementRef = useRef(null);

  useEffect(() => {
    // Garantir que a API está disponível (SSR check)
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Dispara a função de prefetch (Zustand, imagens, etc)
          onEnter();
          
          // Desconectar após o primeiro acionamento para otimizar performance
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      { threshold }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onEnter, threshold]);

  return elementRef;
};
