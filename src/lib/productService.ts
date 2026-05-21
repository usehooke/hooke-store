import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit, QueryConstraint, DocumentData, orderBy } from "firebase/firestore";
import { Product } from "@/types";
import { MOCK_PRODUCTS } from "./mockData";
import { unstable_cache } from "next/cache";
import { productSchema } from "./schemas";

export const COLLECTION_NAME = "produtos";

/**
 * @Agent-Elite V13.0: PERFORMANCE ENGINE
 * Centraliza a inteligência de Cache e Resiliência.
 */

const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build' || !db;

export interface FilterOptions {
    category?: string;
    department?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    limitCount?: number;
}

const mapToProduct = (docId: string, data: DocumentData): Product | null => {
    try {
        const rawBody = { 
            id: docId, 
            slug: data.slug || docId, // Garante que nunca fica sem slug
            isActive: data.isActive !== false, // Garante que o default é true
            ...data 
        };
        const validation = productSchema.safeParse(rawBody);
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
            try {
                const result = await firestoreQuery();
                return result || emptyFallback;
            } catch (error) {
                console.warn(`⚠️ [Hooke Cache] Falha em ${operationName}. Retornando fallback vazio.`, error);
                return emptyFallback;
            }
        },
        [cacheKey],
        { revalidate: 300, tags } // 5 min: produtos novos aparecem rápido
    );

    return cachedOperation();
}

/** 
 * 🚀 EXPORTS DOS SERVIÇOS (Elite V13.0)
 */

export async function getProducts(category?: string): Promise<Product[]> {
    return executeResilientCached(
        "getProducts",
        `products-v2-${category || 'all'}`,
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
        `featured-products-v2-${limitCount}`,
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
export async function getFilteredProducts(filters: FilterOptions): Promise<Product[]> {
    const { category, department, size, minPrice, maxPrice, featured, limitCount } = filters;
    
    // Cache key baseada nos filtros para granularidade máxima
    const cacheKey = `filtered-products-v2-${JSON.stringify(filters)}`;
    const tags = ['products'];
    if (category) tags.push(`category-${category}`);
    if (department) tags.push(`department-${department}`);
    if (size) tags.push(`size-${size}`);

    return executeResilientCached(
        "getFilteredProducts",
        cacheKey,
        tags,
        async () => {
            const productsRef = collection(db!, COLLECTION_NAME);
            const conditions: QueryConstraint[] = [];

            if (category) conditions.push(where("category", "==", category));
            if (department) conditions.push(where("department", "==", department));
            if (size) conditions.push(where("sizes", "array-contains", size));
            if (featured !== undefined) conditions.push(where("featured", "==", featured));
            
            // Filtros de Preço (Requerem Índice Composto se usados com outros filtros)
            if (minPrice !== undefined) conditions.push(where("price", ">=", minPrice));
            if (maxPrice !== undefined) conditions.push(where("price", "<=", maxPrice));

            // O Firebase requer um Composite Index para misturar 'where' e 'orderBy'.
            // Para evitar a quebra silenciosa, vamos fazer a ordenação local na memória.
            // conditions.push(orderBy("price", "asc"));
            
            if (limitCount) conditions.push(limit(limitCount));

            const q = query(productsRef, ...conditions);
            const snapshot = await getDocs(q);
            
            const products: Product[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                const p = mapToProduct(doc.id, data);
                if (data.isActive !== false && p) products.push(p);
            });
            
            // Ordenação em Memória (Bypass no Composite Index do Firebase)
            products.sort((a, b) => a.price - b.price);
            
            return products;
        },
        [] as Product[]
    );
}
