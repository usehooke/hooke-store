import { adminDb } from '@/lib/firebase-admin';
import { Product } from '@/types';
import { productSchema } from '@/features/catalog/schemas';

const COLLECTION = 'produtos';

export async function getAdminProducts(): Promise<Product[]> {
  if (!adminDb) {
    console.error("❌ adminDb não inicializado no getAdminProducts");
    return [];
  }

  try {
    const snapshot = await adminDb.collection(COLLECTION).get();
    const products: Product[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const p = mapToProduct(doc.id, data);
      // Admin vê TODOS os produtos, ignorando isActive
      if (p) products.push(p);
    });

    // Ordenação em memória: respeitar a ordenação manual (order), ou fallback para data
    products.sort((a, b) => {
      const orderA = (a as any).order ?? 0;
      const orderB = (b as any).order ?? 0;
      if (orderA !== orderB) {
        return orderA - orderB; // Ascendente (0, 1, 2, 3...)
      }
      // Fallback para updatedAt se a ordem for igual
      const timeA = (a as any).updatedAt ? new Date((a as any).updatedAt).getTime() : 0;
      const timeB = (b as any).updatedAt ? new Date((b as any).updatedAt).getTime() : 0;
      return timeB - timeA;
    });

    return products;
  } catch (error) {
    console.error("🔥 Erro fatal ao buscar produtos no Admin:", error);
    // Re-lança para que o Server Component possa tratar via error.tsx
    throw error;
  }
}

export async function getAdminProductById(id: string): Promise<Product | null> {
  if (!adminDb) return null;

  try {
    const doc = await adminDb.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    
    return mapToProduct(doc.id, doc.data()!);
  } catch (error) {
    console.error(`🔥 Erro ao buscar produto ${id} no Admin:`, error);
    return null;
  }
}

function mapToProduct(docId: string, data: any): Product | null {
  try {
    // ✅ CORREÇÃO: Inclui campos extras (color, details, order, etc.) que o
    // Zod schema pode não validar mas o Gerador IA e outros módulos precisam.
    const rawBody = {
      id: docId,
      name: data.name || "Produto Sem Nome",
      description: data.description || "",
      price: typeof data.price === 'number' ? data.price : 0,
      compareAtPrice: typeof data.compareAtPrice === 'number' ? data.compareAtPrice : undefined,
      images: Array.isArray(data.images) ? data.images : [],
      imageUrl: data.imageUrl || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : ""),
      category: data.category || "Sem Categoria",
      department: data.department || "masculino",
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      colors: Array.isArray(data.colors) ? data.colors : [],
      featured: !!data.featured,
      isActive: data.isActive !== false, // Default true se não existir
      slug: data.slug || docId,
      tags: Array.isArray(data.tags) ? data.tags : [],
      order: typeof data.order === 'number' ? data.order : 0,
      // Campos extras críticos para o Gerador IA e edição de produtos
      color: data.color || '',
      details: {
        fabric: data.details?.fabric || '',
        model: data.details?.model || '',
        wash: data.details?.wash || '',
        grammage: data.details?.grammage || '',
        yarn: data.details?.yarn || '',
        collar: data.details?.collar || '',
      },
      seo: data.seo || {},
      stock: data.stock || {},
      skus: data.skus || {},
      modelId: data.modelId || '',
      shipping: data.shipping || undefined,
      updatedAt: data.updatedAt || null,
    };

    const validation = productSchema.safeParse(rawBody);
    
    if (validation.success) {
      // Merge: dados validados + campos extras não cobertos pelo schema
      return { ...rawBody, ...validation.data } as Product;
    } else {
      console.warn(`⚠️ Produto ${docId} falhou na validação estrita, usando parse parcial.`, validation.error.format());
      return rawBody as unknown as Product; // Fallback para não quebrar a listagem do admin
    }
  } catch (err) {
    console.error(`🔥 Erro extremo ao mapear produto ${docId}:`, err);
    return null;
  }
}
