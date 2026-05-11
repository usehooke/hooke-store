import { getProductBySlug } from "@/lib/productService";
import { notFound } from "next/navigation";
import SsenseProductView from "@/components/shop/SsenseProductView";
import React, { Suspense } from "react";
import { Metadata } from "next";

// Interface para os parâmetros da página (Promise no Next 15)
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** 🚀 SEO Dinâmico: Geração de Metadados para Social Share */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: 'Produto não encontrado' };

  // Prioriza a imagem principal, mas garante fallback estético
  const previewImage = product.imageUrl || '/banner-home.jpg';

  return {
    title: `${product.name} | Hooke Elite`,
    description: product.description || "Equipamento premium projetado para a permanência absoluta.",
    openGraph: {
      title: product.name,
      description: product.description,
      url: `https://www.usehooke.com.br/produto/${slug}`,
      siteName: "Hooke",
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [previewImage],
    },
  };
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
