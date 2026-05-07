'use client';

import { useState, useEffect, useCallback } from 'react';
import { get, set } from 'idb-keyval';
import { Product } from '@/config';

const RECENTLY_VIEWED_KEY = 'hooke_recently_viewed';
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const saved = await get(RECENTLY_VIEWED_KEY);
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing recently viewed", e);
        }
      }
    };
    loadItems();
  }, []);

  const addViewedProduct = useCallback(async (product: Product) => {
    const saved = await get(RECENTLY_VIEWED_KEY);
    let current: Product[] = saved ? JSON.parse(saved) : [];

    // Remove se já existir (para mover para o topo)
    current = current.filter(item => item.id !== product.id);
    
    // Adiciona ao início
    current.unshift(product);

    // Limita o tamanho
    const trimmed = current.slice(0, MAX_ITEMS);
    
    await set(RECENTLY_VIEWED_KEY, JSON.stringify(trimmed));
    setItems(trimmed);
  }, []);

  return { items, addViewedProduct };
}
