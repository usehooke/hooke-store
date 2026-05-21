import { adminDb } from "@/lib/firebase-admin";
import { Product } from "@/types";
import { ProductSchema } from "./schemas";

export const COLLECTION_NAME = "produtos";

export interface FilterOptions {
    category?: string;
    department?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    limitCount?: number;
}

const mapToProduct = (docId: string, data: any): Product | null => {
    try {
        const rawBody = { 
            id: docId, 
            slug: data.slug || docId, // Garante que nunca fica sem slug
            isActive: data.isActive !== false, // Garante que o default é true
            ...data 
        };
        const validation = ProductSchema.safeParse(rawBody);
        return validation.success ? (validation.data as Product) : null;
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
        const result = await firestoreQuery();
        return result || emptyFallback;
    } catch (error) {
        console.warn(`⚠️ [Hooke DB] Falha em ${operationName}. Retornando fallback vazio.`, error);
        return emptyFallback;
    }
}

export async function getProducts(category?: string): Promise<Product[]> {
    return executeResilientCached(
        "getProducts",
        `products-v2-${category || 'all'}`,
        ['products', category ? `category-${category}` : 'all-products'],
        async () => {
            let query: any = adminDb!.collection(COLLECTION_NAME);
            if (category) query = query.where("category", "==", category);
            
            const snapshot = await query.get();
            const products: Product[] = [];
            snapshot.forEach((doc: any) => {
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
            const query = adminDb!.collection(COLLECTION_NAME).where("slug", "==", slug).limit(1);
            const snapshot = await query.get();

            if (!snapshot.empty) return mapToProduct(snapshot.docs[0].id, snapshot.docs[0].data());

            // Fallback para ID
            const qFb = adminDb!.collection(COLLECTION_NAME).where("id", "==", slug).limit(1);
            const snapshotFb = await qFb.get();
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
            const query = adminDb!.collection(COLLECTION_NAME).where("featured", "==", true);
            const snapshot = await query.get();

            const products: Product[] = [];
            snapshot.forEach((doc: any) => {
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
            let query: any = adminDb!.collection(COLLECTION_NAME);

            if (category) query = query.where("category", "==", category);
            if (department) query = query.where("department", "==", department);
            if (size) query = query.where("sizes", "array-contains", size);
            if (featured !== undefined) query = query.where("featured", "==", featured);
            if (minPrice !== undefined) query = query.where("price", ">=", minPrice);
            if (maxPrice !== undefined) query = query.where("price", "<=", maxPrice);
            if (limitCount) query = query.limit(limitCount);

            const snapshot = await query.get();
            
            const products: Product[] = [];
            snapshot.forEach((doc: any) => {
                const data = doc.data();
                const p = mapToProduct(doc.id, data);
                if (data.isActive !== false && p) products.push(p);
            });
            
            products.sort((a, b) => a.price - b.price);
            
            return products;
        },
        [] as Product[]
    );
}
