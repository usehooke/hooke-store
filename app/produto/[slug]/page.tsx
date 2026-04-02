"use client";

import { getProductBySlug } from "@/lib/productService";
import { notFound } from "next/navigation";
import SsenseProductView from "@/components/shop/SsenseProductView";
import React, { use, useEffect, useState } from "react";
import { Product } from "@/data/catalogo";

// Interface para os parâmetros da página (Promise no Next 15)
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  // Unwrap params using React 19 'use' hook
  const { slug } = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Hook para carregar o produto com base no slug
  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug).then(res => {
      setProduct(res);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-hooke-100 border-t-hooke-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) notFound();

  return <SsenseProductView product={product} />;
}