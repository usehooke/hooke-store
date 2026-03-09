'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface ProductTrackerProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    [key: string]: any;
  };
}

export default function ProductTracker({ product }: ProductTrackerProps) {
  const { addViewedProduct } = useRecentlyViewed();

  useEffect(() => {
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
    addViewedProduct(product as any);
  }, [product, addViewedProduct]);

  return null;
}
