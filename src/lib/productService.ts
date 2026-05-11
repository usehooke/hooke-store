import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit, QueryConstraint, DocumentData } from "firebase/firestore";
import { Product } from "@/types";
import { MOCK_PRODUCTS } from "./mockData";
import { unstable_cache } from "next/cache";
import { ProductSchema } from "./schemas";

export const COLLECTION_NAME = "produtos";

/**
 * @Agent-Elite V13.0: PERFORMANCE ENGINE
 * Centraliza a inteligência de Cache e Resiliência.
 */

const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build' || !db;

const mapToProduct = (docId: string, data: DocumentData): Product | null => {
    try {
        const rawBody = { id: docId, ...data };
        const validation = ProductSchema.safeParse(rawBody);
        return validation.success ? (validation.data as Product) : null;
    } catch (err) {
        return null;
    }
};

/** 3. Motor de Execução Resiliente com Cache Persistente */
async function executeResilientCached<T>(
    operationName: string,
    cacheKey: string,
    tags: string[],
    firestoreQuery: () => Promise<T>,
    emptyFallback: T
): Promise<T> {

    const cachedOperation = unstable_cache(
        async () => {
                const result = await firestoreQuery();
                return result || emptyFallback;
            } catch (error) {
                console.warn(`⚠️ [Hooke Cache] Falha em ${operationName}. Retornando fallback vazio.`, error);
                return emptyFallback;
            }
        },
        [cacheKey],
        { revalidate: 3600, tags }
    );

    return cachedOperation();
}

/** 
 * 🚀 EXPORTS DOS SERVIÇOS (Elite V13.0)
 */

export async function getProducts(category?: string): Promise<Product[]> {
    return executeResilientCached(
        "getProducts",
        `products-${category || 'all'}`,
        ['products', category ? `category-${category}` : 'all-products'],
        async () => {
            const productsRef = collection(db!, COLLECTION_NAME);
            const conditions: QueryConstraint[] = [];
            if (category) conditions.push(where("category", "==", category));
            
            const q = query(productsRef, ...conditions);
            const snapshot = await getDocs(q);
            
            const products: Product[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                const p = mapToProduct(doc.id, data);
                if (data.isActive !== false && p) products.push(p);
            });
            return products;
        },
        [] as Product[]
    );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    return executeResilientCached(
        "getProductBySlug",
        `product-slug-${slug}`,
        ['products', `product-${slug}`],
        async () => {
            const productsRef = collection(db!, COLLECTION_NAME);
            const q = query(productsRef, where("slug", "==", slug), limit(1));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) return mapToProduct(snapshot.docs[0].id, snapshot.docs[0].data());

            // Fallback para ID
            const qFb = query(productsRef, where("id", "==", slug), limit(1));
            const snapshotFb = await getDocs(qFb);
            if (!snapshotFb.empty) return mapToProduct(snapshotFb.docs[0].id, snapshotFb.docs[0].data());

            return null;
        },
        null
    );
}

export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
    return executeResilientCached(
        "getFeaturedProducts",
        `featured-products-${limitCount}`,
        ['products', 'featured'],
        async () => {
            const productsRef = collection(db!, COLLECTION_NAME);
            const q = query(productsRef, where("featured", "==", true));
            const snapshot = await getDocs(q);

            const products: Product[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                const p = mapToProduct(doc.id, data);
                if (data.isActive !== false && p) products.push(p);
            });
            return products;
        },
        [] as Product[]
    );
}
