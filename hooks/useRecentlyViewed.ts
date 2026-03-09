'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/data/catalogo';

const RECENTLY_VIEWED_KEY = 'hooke_recently_viewed';
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const addViewedProduct = (product: Product) => {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let current: Product[] = saved ? JSON.parse(saved) : [];

    // Remove se já existir (para mover para o topo)
    current = current.filter(item => item.id !== product.id);
    
    // Adiciona ao início
    current.unshift(product);

    // Limita o tamanho
    const trimmed = current.slice(0, MAX_ITEMS);
    
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(trimmed));
    setItems(trimmed);
  };

  return { items, addViewedProduct };
}
