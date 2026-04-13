import { getProductBySlug } from "@/lib/productService";
import { notFound } from "next/navigation";
import SsenseProductView from "@/components/shop/SsenseProductView";
import React, { Suspense } from "react";

// Interface para os parâmetros da página (Promise no Next 15)
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Hooke V3: Estabilização de Performance via Server Component (RSC).
 * Esta página agora serve como a "Casca Estática" para o Partial Prerendering (PPR).
 */
export default async function ProductPage({ params }: ProductPageProps) {
  // No Next 15, params é uma Promise que deve ser aguardada
  const { slug } = await params;
  
  // Fetch direto no servidor - 100% SEO e zero delay de hidratação inicial
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <SsenseProductView product={product} />
    </Suspense>
  );
}

// Skeleton para transição suave durante o PPR
function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-hooke-100 border-t-hooke-900 rounded-full animate-spin"></div>
    </div>
  );
}