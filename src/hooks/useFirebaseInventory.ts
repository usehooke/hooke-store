'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useFirebaseInventory(productId: string, staticStock?: Record<string, number>) {
  const [stock, setStock] = useState<Record<string, number> | undefined>(staticStock);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Se não tiver DB (como no build) ou não tiver ID, usa o estático.
    if (!db || !productId) {
      setStock(staticStock);
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
            setStock(staticStock);
          }
        } else {
          setStock(staticStock);
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn('⚠️ [useFirebaseInventory] Falha ao escutar estoque:', error);
        setStock(staticStock);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [productId, staticStock]);

  return { stock, isLoading };
}
