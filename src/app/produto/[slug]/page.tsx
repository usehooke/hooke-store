import { getProductBySlugAdmin, getProductsByModelIdAdmin } from "@/lib/productServiceAdmin";
import { notFound } from "next/navigation";
import SsenseProductView from "@/components/shop/SsenseProductView";
import React, { Suspense } from "react";
import { Metadata } from "next";

export const revalidate = 3600; // SSG/ISR para o produto

// Interface para os parâmetros da página (Promise no Next 15)
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** 🚀 SEO Dinâmico: Geração de Metadados para Social Share */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugAdmin(slug);

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
      type: "product" as any,
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "BRL"
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
  const product = await getProductBySlugAdmin(slug);

  if (!product) notFound();

  // Buscar variantes de cores baseadas no modelId
  let variants: any[] = [];
  if (product.modelId) {
    variants = await getProductsByModelIdAdmin(product.modelId);
  }

  // Gemini-First: Estruturação Semântica de Alta Densidade (JSON-LD Schema.org)
  const productUrl = `https://www.usehooke.com.br/produto/${slug}`;
  const isAvailable = (product.totalStock ?? 1) > 0;
  
  // Base do produto
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imageUrl,
    description: product.description || "Equipamento premium projetado para a permanência absoluta.",
    sku: product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: "HOOKE"
    },
    material: product.details?.fabric || "Algodão Certificado BCI",
    color: (product.details as any)?.color || "Preto",
    audience: {
      "@type": "PeopleAudience",
      suggestedGender: product.department === "feminino" ? "female" : product.department === "masculino" ? "male" : "unisex"
    },
    itemCondition: "https://schema.org/NewCondition",

    // Oferta Base (Fallback)
    offers: {
      "@type": "AggregateOffer",
      url: productUrl,
      priceCurrency: "BRL",
      lowPrice: product.price.toFixed(2),
      highPrice: product.price.toFixed(2),
      offerCount: product.sizes?.length || 1,
      offers: (product.sizes && product.sizes.length > 0) ? product.sizes.map(size => ({
        "@type": "Offer",
        name: `${product.name} - Tamanho ${size}`,
        sku: `${product.id}-${size}`,
        priceCurrency: "BRL",
        price: product.price.toFixed(2),
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
        price: product.price.toFixed(2),
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
        name: product.department ? product.department.charAt(0).toUpperCase() + product.department.slice(1) : "Loja",
        item: product.department ? `https://www.usehooke.com.br/${product.department}` : "https://www.usehooke.com.br"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
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

// Skeleton para transição suave durante o PPR
function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-hooke-100 border-t-hooke-900 rounded-full animate-spin"></div>
    </div>
  );
}
