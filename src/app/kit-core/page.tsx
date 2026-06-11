import type { Metadata } from 'next';
import KitCoreClient from './KitCoreClient';

const BASE_URL = 'https://usehooke.com.br';

export const metadata: Metadata = {
  title: 'Kit Core — 3 Camisetas Heavyweight 260g | Hooke',
  description:
    'O Kit Core da Hooke: 3 camisetas pesadas de algodão 260g com gola canelada de 3cm que não deforma. Preto, Off-White e Mescla. Malha heavyweight que não encolhe. Compre o kit completo com desconto.',
  keywords: [
    'kit de camisetas básicas',
    'camiseta 260g',
    'kit 3 camisetas premium',
    'camiseta heavyweight algodão',
    'camiseta gola canelada',
    'hooke kit core',
    'camisetas básicas masculinas',
    'kit camisetas que não encolhem',
  ],
  openGraph: {
    title: 'Kit Core — 3 Camisetas Heavyweight 260g | Hooke',
    description:
      'Gola que não deforma. Malha que não encolhe. 3 camisetas pesadas 260g para a base do seu guarda-roupa.',
    url: `${BASE_URL}/kit-core`,
    siteName: 'Hooke',
    images: [
      {
        url: `${BASE_URL}/banner-home.jpg`,
        width: 1200,
        height: 630,
        alt: 'Kit Core Hooke — 3 Camisetas Heavyweight 260g',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kit Core — 3 Camisetas Heavyweight 260g | Hooke',
    description: 'Gola que não deforma. Malha que não encolhe. Kit de 3 camisetas 260g.',
  },
  alternates: {
    canonical: `${BASE_URL}/kit-core`,
  },
};

const kitCoreJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Kit Core Hooke — 3 Camisetas Heavyweight 260g',
  description:
    'Kit com 3 camisetas de algodão premium 260g (Preta + Off-White + Mescla). Malha heavyweight que não encolhe, gola canelada de 3cm que não deforma e modelagem boxy estruturada. A base perfeita para qualquer guarda-roupa masculino.',
  brand: {
    '@type': 'Brand',
    name: 'Hooke',
  },
  offers: {
    '@type': 'Offer',
    url: `${BASE_URL}/kit-core`,
    priceCurrency: 'BRL',
    price: '199.90',
    priceValidUntil: '2026-12-31',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'Hooke',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '312',
  },
};

export default function KitCorePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kitCoreJsonLd) }}
      />
      <KitCoreClient />
    </>
  );
}
