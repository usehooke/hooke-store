import { adminDb } from "@/lib/firebase-admin";
import { Product } from "@/types";
import { unstable_cache } from "next/cache";
import { 
    getProductsAdmin, 
    getProductBySlugAdmin, 
    getProductsByModelIdAdmin, 
    getFeaturedProductsAdmin, 
    getFilteredProductsAdmin,
    getHeroBannersAdmin
} from "./productServiceAdmin";
import { FilterOptions } from "./productService";

/**
 * HOOKE SYSTEM: SERVER-SIDE CACHED DATA ENGINE
 * Utiliza o Firebase Admin SDK (chamadas REST sem gRPC do cliente)
 * e o unstable_cache da Vercel para máxima performance.
 * Nunca importe este arquivo em Client Components ("use client").
 */

async function executeServerCached<T>(
    operationName: string,
    cacheKey: string,
    tags: string[],
    fetchQuery: () => Promise<T>,
    emptyFallback: T
): Promise<T> {
    try {
        const cachedQuery = unstable_cache(
            async () => {
                if (!adminDb) {
                    throw new Error("Admin DB is null/not initialized");
                }
                const result = await fetchQuery();
                if (!result || (Array.isArray(result) && result.length === 0)) {
                    throw new Error(`[Cache Bypass] Query returned empty/null for ${operationName}`);
                }
                return result;
            },
            [cacheKey],
            {
                tags: tags,
                revalidate: 3600 // Cache por 1h
            }
        );
        return await cachedQuery();
    } catch (error) {
        console.warn(`⚠️ [Hooke Server Cache] Falha em ${operationName} (${String(error)}). Retornando fallback vazio.`);
        return emptyFallback;
    }
}

export async function getProducts(category?: string): Promise<Product[]> {
    return executeServerCached(
        "getProducts",
        `products-v2-${category || 'all'}`,
        ['products', category ? `category-${category}` : 'all-products'],
        async () => {
            return await getProductsAdmin(category);
        },
        [] as Product[]
    );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    return executeServerCached(
        "getProductBySlug",
        `product-slug-${slug}`,
        ['products', `product-${slug}`],
        async () => {
            return await getProductBySlugAdmin(slug);
        },
        null
    );
}

export async function getProductsByModelId(modelId: string): Promise<Product[]> {
    return executeServerCached(
        "getProductsByModelId",
        `products-model-${modelId}`,
        ['products', `model-${modelId}`],
        async () => {
            return await getProductsByModelIdAdmin(modelId);
        },
        [] as Product[]
    );
}

export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
    return executeServerCached(
        "getFeaturedProducts",
        `featured-products-v2-${limitCount}`,
        ['products', 'featured'],
        async () => {
            return await getFeaturedProductsAdmin(limitCount);
        },
        [] as Product[]
    );
}

export async function getFilteredProducts(filters: FilterOptions): Promise<Product[]> {
    const { category, department, size, color } = filters;
    const cacheKey = `filtered-products-v2-${JSON.stringify(filters)}`;
    const tags = ['products'];
    if (category) tags.push(`category-${category}`);
    if (department) tags.push(`department-${department}`);
    if (size) tags.push(`size-${size}`);
    if (color) tags.push(`color-${color}`);

    return executeServerCached(
        "getFilteredProducts",
        cacheKey,
        tags,
        async () => {
            return await getFilteredProductsAdmin(filters);
        },
        [] as Product[]
    );
}

export async function getHeroBanners(): Promise<Product[]> {
    return executeServerCached(
        "getHeroBanners",
        "hero-banners",
        ['products', 'hero-banners'],
        async () => {
            return await getHeroBannersAdmin();
        },
        [] as Product[]
    );
}
