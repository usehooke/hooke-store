import { getProductBySlugAdmin } from "@/lib/productServiceAdmin";
import LaunchTemplate from "@/components/LaunchTemplate";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import React, { Suspense } from "react";

// Interface para os parâmetros da página (Promise no Next 15)
interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Hooke V3: Página de Lançamento Otimizada para Next 16/Canary.
 * Usa Suspense para garantir que o Shell estático seja pré-renderizado.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugAdmin(slug);
  
  if (!product) {
    return {
      title: "Lançamento não encontrado | Hooke Store",
    };
  }

  return {
    title: `Lançamento: ${product.name} | Hooke Store`,
    description: product.description,
    openGraph: {
      title: `Coleção Exclusiva: ${product.name}`,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function LaunchPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={<LaunchSkeleton />}>
      <LaunchContent slug={slug} />
    </Suspense>
  );
}

// Componente Assíncrono para o Conteúdo Dinâmico (PPR Hole)
async function LaunchContent({ slug }: { slug: string }) {
  const product = await getProductBySlugAdmin(slug);

  if (!product) {
    notFound();
  }

  return <LaunchTemplate product={product} />;
}

// Skeleton Minimalista para Transição
function LaunchSkeleton() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-800 border-t-white rounded-full animate-spin"></div>
    </div>
  );
}
