import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit, QueryConstraint, DocumentData, orderBy } from "firebase/firestore";
import { Product } from "@/types";
import { MOCK_PRODUCTS } from "./mockData";
import { unstable_cache } from "next/cache";
import { ProductSchema } from "./schemas";
import { getColorFamily } from "@/utils/colorMap";

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
    color?: string;
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
        const validation = ProductSchema.safeParse(rawBody);
        if (validation.success) {
            return validation.data as Product;
        } else {
            console.warn(`⚠️ [ProductService] Produto ${docId} falhou na validação estrita, usando fallback parcial:`, validation.error.format());
            return rawBody as unknown as Product; // Fallback tolerante para não sumir do catálogo público
        }
    } catch (err) {
        return null;
    }
};

/** 3. Motor de Execução Resiliente (Tempo Real) */
async function executeResilientCached<T>(
    operationName: string,
    cacheKey: string,
    tags: string[],
    firestoreQuery: () => Promise<T>,
    emptyFallback: T
): Promise<T> {
    try {
        const cachedQuery = unstable_cache(
            async () => {
                const result = await firestoreQuery();
                return result || emptyFallback;
            },
            [cacheKey],
            {
                tags: tags,
                revalidate: 3600 // Cache por 1h (ISR/Data Cache híbrido)
            }
        );
        return await cachedQuery();
    } catch (error) {
        console.warn(`⚠️ [Hooke DB] Falha em ${operationName}. Retornando fallback vazio.`, error);
        return emptyFallback;
    }
}

/** 
 * 🚀 EXPORTS DOS SERVIÇOS (Elite V13.0)
 */

export async function getProducts(category?: string): Promise<Product[]> {
    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        return category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS;
    }
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
            products.sort((a, b) => (a.order || 0) - (b.order || 0));
            return products;
        },
        [] as Product[]
    );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        return MOCK_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
    }
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

export async function getProductsByModelId(modelId: string): Promise<Product[]> {
    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        return MOCK_PRODUCTS.filter(p => p.modelId === modelId);
    }
    return executeResilientCached(
        "getProductsByModelId",
        `products-model-${modelId}`,
        ['products', `model-${modelId}`],
        async () => {
            const productsRef = collection(db!, COLLECTION_NAME);
            const q = query(productsRef, where("modelId", "==", modelId));
            const snapshot = await getDocs(q);
            
            const products: Product[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                const p = mapToProduct(doc.id, data);
                if (data.isActive !== false && p) products.push(p);
            });
            products.sort((a, b) => (a.order || 0) - (b.order || 0));
            return products;
        },
        [] as Product[]
    );
}

export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        return MOCK_PRODUCTS.filter(p => p.featured).slice(0, limitCount);
    }
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
            products.sort((a, b) => (a.order || 0) - (b.order || 0));
            return products;
        },
        [] as Product[]
    );
}
export async function getFilteredProducts(filters: FilterOptions): Promise<Product[]> {
    const { category, department, size, color, minPrice, maxPrice, featured, limitCount } = filters;
    
    // Cache key baseada nos filtros para granularidade máxima
    const cacheKey = `filtered-products-v2-${JSON.stringify(filters)}`;
    const tags = ['products'];
    if (category) tags.push(`category-${category}`);
    if (department) tags.push(`department-${department}`);
    if (size) tags.push(`size-${size}`);
    if (color) tags.push(`color-${color}`);

    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        let prods = [...MOCK_PRODUCTS];
        if (category) prods = prods.filter(p => p.category === category);
        if (department) prods = prods.filter(p => p.department === department);
        if (size) prods = prods.filter(p => p.sizes?.includes(size as any));
        if (color) prods = prods.filter(p => getColorFamily(p.color || "") === color);
        if (minPrice !== undefined) prods = prods.filter(p => p.price >= minPrice);
        if (maxPrice !== undefined) prods = prods.filter(p => p.price <= maxPrice);
        if (featured !== undefined) prods = prods.filter(p => p.featured === featured);
        if (limitCount) prods = prods.slice(0, limitCount);
        prods.sort((a, b) => a.price - b.price);
        return prods;
    }

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
            
            let finalProducts = products;
            if (color) {
                finalProducts = finalProducts.filter(p => getColorFamily(p.color) === color);
            }
            
            // Ordenação em Memória: Primeiro por order, depois por preço
            finalProducts.sort((a, b) => {
                if (a.order !== b.order) {
                    return (a.order || 0) - (b.order || 0);
                }
                return a.price - b.price;
            });
            
            return finalProducts;
        },
        [] as Product[]
    );
}
