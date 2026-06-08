// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/productServiceServer';

function parseFirestoreDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date() : d;
  }
  // Se for um Timestamp do Firestore (com toDate)
  if (typeof val.toDate === 'function') {
    try {
      return val.toDate();
    } catch {
      return new Date();
    }
  }
  // Se for um objeto Timestamp serializado no JSON do cache
  if (typeof val.seconds === 'number') {
    return new Date(val.seconds * 1000);
  }
  if (typeof val._seconds === 'number') {
    return new Date(val._seconds * 1000);
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.usehooke.com.br';
  const products = await getProducts();

  // 1. Gera links para todos os produtos automaticamente
  const productUrls = products.map((product) => {
    let lastModifiedDate = new Date();
    try {
      if (product.updatedAt) {
        lastModifiedDate = parseFirestoreDate(product.updatedAt);
      } else if (product.createdAt) {
        lastModifiedDate = parseFirestoreDate(product.createdAt);
      }
    } catch (e) {
      lastModifiedDate = new Date();
    }

    return {
      url: `${baseUrl}/produto/${product.slug || product.id}`,
      lastModified: lastModifiedDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  // 2. Junta com as páginas fixas + todas as rotas públicas
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/masculino`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/feminino`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/colecao`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lancamento`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/camisetas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/regatas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lookbook`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guia-medidas`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/busca`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica-de-trocas`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-de-devolucao`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...productUrls,
  ];
}
