'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useFirebaseInventory(productId: string, staticStock?: Record<string, number>) {
  const [stock, setStock] = useState<Record<string, number> | undefined>(staticStock);
  const [isLoading, setIsLoading] = useState(true);
  const staticStockRef = useRef(staticStock);

  // Mantém o ref atualizado caso o stock estático mude, sem disparar o useEffect do onSnapshot
  useEffect(() => {
    staticStockRef.current = staticStock;
  }, [staticStock]);

  useEffect(() => {
    // Se não tiver DB (como no build) ou não tiver ID, usa o estático.
    if (!db || !productId) {
      setStock(staticStockRef.current);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'produtos', productId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.stock) {
            setStock(data.stock);
          } else {
            setStock(staticStockRef.current);
          }
        } else {
          setStock(staticStockRef.current);
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn('⚠️ [useFirebaseInventory] Falha ao escutar estoque:', error);
        setStock(staticStockRef.current);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [productId]);

  return { stock, isLoading };
}
