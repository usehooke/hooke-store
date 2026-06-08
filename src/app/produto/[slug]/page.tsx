import { getProductBySlug, getProductsByModelId } from "@/lib/productServiceServer";
import { notFound } from "next/navigation";
import SsenseProductView from "@/components/shop/SsenseProductView";
import React, { Suspense } from "react";
import Link from "next/link";
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
    title: product?.name ? `${product.name} | Hooke Elite` : 'Produto Exclusivo | Hooke Elite',
    description: product?.description || "Equipamento premium projetado para a permanência absoluta.",
    openGraph: {
      title: product?.name || 'Hooke Elite',
      description: product?.description || 'Equipamento premium',
      url: `https://www.usehooke.com.br/produto/${slug}`,
      siteName: "Hooke",
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: product?.name || 'Hooke',
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    other: {
      "product:price:amount": (product?.price || 0).toString(),
      "product:price:currency": "BRL"
    },
    twitter: {
      card: "summary_large_image",
      title: product?.name || 'Hooke Elite',
      description: product?.description || 'Equipamento premium',
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

  // Buscar variantes de cores baseadas no modelId
  let variants: any[] = [];
  if (product.modelId) {
    variants = await getProductsByModelId(product.modelId);
  }

  // Gemini-First: Estruturação Semântica de Alta Densidade (JSON-LD Schema.org)
  const productUrl = `https://www.usehooke.com.br/produto/${slug}`;
  const isAvailable = (product.totalStock ?? 1) > 0;
  
  // Base do produto
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.name || 'Produto',
    image: product?.imageUrl || '',
    description: product?.description || "Equipamento premium projetado para a permanência absoluta.",
    sku: product?.id || 'SKU',
    mpn: product?.id || 'MPN',
    brand: {
      "@type": "Brand",
      name: "HOOKE"
    },
    material: product?.details?.fabric || "Algodão Certificado BCI",
    color: (product?.details as any)?.color || "Preto",
    audience: {
      "@type": "PeopleAudience",
      suggestedGender: product?.department === "feminino" ? "female" : product?.department === "masculino" ? "male" : "unisex"
    },
    itemCondition: "https://schema.org/NewCondition",

    // Oferta Base (Fallback)
    offers: {
      "@type": "AggregateOffer",
      url: productUrl,
      priceCurrency: "BRL",
      lowPrice: (product?.price || 0).toFixed(2),
      highPrice: (product?.price || 0).toFixed(2),
      offerCount: product?.sizes?.length || 1,
      offers: (product?.sizes && product.sizes.length > 0) ? product.sizes.map(size => ({
        "@type": "Offer",
        name: `${product?.name || 'Produto'} - Tamanho ${size}`,
        sku: `${product?.id || 'ID'}-${size}`,
        priceCurrency: "BRL",
        price: (product?.price || 0).toFixed(2),
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: productUrl,
        itemCondition: "https://schema.org/NewCondition",
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "20.00",
            currency: "BRL"
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "BR",
            addressRegion: "SP"
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 1,
              unitCode: "d"
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 1,
              maxValue: 3,
              unitCode: "d"
            }
          }
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "BR",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 7,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn"
        }
      })) : [{
        "@type": "Offer",
        priceCurrency: "BRL",
        price: (product?.price || 0).toFixed(2),
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: productUrl,
        itemCondition: "https://schema.org/NewCondition"
      }]
    }
  };

  // BreadcrumbList para SEO e IA entender a hierarquia do site
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "https://www.usehooke.com.br"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product?.department ? product.department.charAt(0).toUpperCase() + product.department.slice(1) : "Loja",
        item: product?.department ? `https://www.usehooke.com.br/${product.department}` : "https://www.usehooke.com.br"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product?.name || 'Produto',
        item: productUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Suspense fallback={<ProductSkeleton />}>
        <SsenseProductView product={product} variants={variants} />
      </Suspense>
    </>
  );
}

// Skeleton estrutural de alta fidelidade para transição suave durante o PPR
function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28 pb-24 px-4 md:px-8 lg:px-16 animate-pulse">
      {/* Layout Mobile Skeleton */}
      <div className="md:hidden space-y-6">
        <div className="w-full aspect-[3/4] bg-zinc-100" />
        <div className="h-8 bg-zinc-200 w-3/4" />
        <div className="h-6 bg-zinc-200 w-1/3 mt-2" />
        <div className="grid grid-cols-4 gap-2 pt-2">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="h-14 bg-zinc-100" />
          ))}
        </div>
        <div className="h-14 bg-zinc-200 w-full" />
      </div>

      {/* Layout Desktop Skeleton */}
      <div className="hidden md:grid grid-cols-12 gap-10 items-start max-w-[1440px] mx-auto">
        {/* Col 1: Especificações */}
        <div className="col-span-3 border-2 border-zinc-100 p-6 space-y-6 h-[400px]">
          <div className="h-4 bg-zinc-200 w-1/2" />
          <div className="space-y-3 pt-4">
            <div className="h-3 bg-zinc-100 w-1/3" />
            <div className="h-4 bg-zinc-200 w-3/4" />
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-zinc-100 w-1/3" />
            <div className="h-4 bg-zinc-200 w-2/3" />
          </div>
        </div>
        {/* Col 2: Galeria */}
        <div className="col-span-6 space-y-6">
          <div className="aspect-[2/3] w-full bg-zinc-100 border-2 border-zinc-100" />
          <div className="aspect-[2/3] w-full bg-zinc-100 border-2 border-zinc-100" />
        </div>
        {/* Col 3: Bloco de Compra */}
        <div className="col-span-3 border-2 border-zinc-100 p-6 space-y-6 h-[500px]">
          <div className="h-8 bg-zinc-200 w-3/4" />
          <div className="h-6 bg-zinc-200 w-1/3 mt-4" />
          <div className="space-y-3 pt-6">
            <div className="h-3 bg-zinc-100 w-1/4" />
            <div className="grid grid-cols-4 gap-2">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="h-12 bg-zinc-100" />
              ))}
            </div>
          </div>
          <div className="h-14 bg-zinc-200 w-full pt-6" />
        </div>
      </div>
    </div>
  );
}

