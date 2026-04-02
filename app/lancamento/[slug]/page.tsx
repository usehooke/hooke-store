import { getProductBySlug } from "@/lib/productService";
import LaunchTemplate from "@/components/LaunchTemplate";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
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
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <LaunchTemplate product={product} />;
}
