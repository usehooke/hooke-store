'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

import { Product } from '@/data/catalogo';

interface ProductTrackerProps {
  product: Product;
}

export default function ProductTracker({ product }: ProductTrackerProps) {
  const { addViewedProduct } = useRecentlyViewed();

  useEffect(() => {
    const eventId = `view_${product.id}_${Date.now()}`;
    
    // Analytics
    trackEvent('ViewContent', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'BRL',
      content_category: product.category
    });

    // Rastro de Navegação (Recently Viewed)
    addViewedProduct(product);
  }, [product.id, product.name, product.price, product.category, addViewedProduct]);

  return null;
}
