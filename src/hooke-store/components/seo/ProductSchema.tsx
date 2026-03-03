import { Product } from "@/data/catalogo"; // Atualizado para importar do Cérebro

interface ProductSchemaProps {
  product: Product;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const siteUrl = 'https://www.usehooke.com.br';
  
  // Prepara lista de imagens completa para o Google
  const images = product.images && product.images.length > 0
    ? product.images.map(img => `${siteUrl}${img}`)
    : [`${siteUrl}${product.imageUrl}`];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.description,
    "sku": product.id,
    "mpn": product.id, // Manufacturer Part Number
    "brand": {
      "@type": "Brand",
      "name": "Hooke"
    },
    // Adiciona as estrelinhas no resultado do Google (Rich Snippets)
    // Estamos usando os dados que já aparecem no layout (4.9 e 27 reviews)
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "27",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/produto/${product.slug}`,
      "priceCurrency": "BRL",
      "price": product.price.toFixed(2),
      "priceValidUntil": "2026-12-31", // Data futura para evitar erros no Search Console
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Hooke"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}