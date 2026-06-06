import { adminDb } from "@/lib/firebase-admin";
import { Product } from "@/types";
import { ProductSchema } from "./schemas";
import { FilterOptions } from "./productService";
import { getColorFamily } from "@/utils/colorMap";
import { MOCK_PRODUCTS } from "./mockData";

export const COLLECTION_NAME = "produtos";

const mapToProduct = (docId: string, data: any): Product | null => {
    try {
        const rawBody = { 
            id: docId, 
            slug: data.slug || docId,
            isActive: data.isActive !== false,
            ...data 
        };
        const validation = ProductSchema.safeParse(rawBody);
        if (validation.success) {
            return validation.data as Product;
        } else {
            console.warn(`⚠️ [ProductServiceAdmin] Produto ${docId} falhou na validação estrita, usando fallback parcial:`, validation.error.format());
            return rawBody as unknown as Product;
        }
    } catch (err) {
        console.error(`🔥 [ProductServiceAdmin] Erro extremo ao mapear produto ${docId}:`, err);
        return null;
    }
};

export async function getProductsByModelIdAdmin(modelId: string): Promise<Product[]> {
    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        return MOCK_PRODUCTS.filter(p => p.modelId === modelId);
    }
    if (!adminDb || !modelId) return [];
    try {
        const query = adminDb.collection(COLLECTION_NAME).where("modelId", "==", modelId);
        const snapshot = await query.get();
        const products: Product[] = [];
        snapshot.forEach((doc: any) => {
            const data = doc.data();
            const p = mapToProduct(doc.id, data);
            if (data.isActive !== false && p) products.push(p);
        });
        return products;
    } catch (error) {
        console.error("⚠️ [getProductsByModelIdAdmin] Falha:", error);
        return [];
    }
}

export async function getProductsAdmin(category?: string): Promise<Product[]> {
    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        return category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS;
    }
    if (!adminDb) return [];
    try {
        let query: any = adminDb.collection(COLLECTION_NAME);
        if (category) query = query.where("category", "==", category);
        
        const snapshot = await query.get();
        const products: Product[] = [];
        snapshot.forEach((doc: any) => {
            const data = doc.data();
            const p = mapToProduct(doc.id, data);
            if (data.isActive !== false && p) products.push(p);
        });
        return products;
    } catch (error) {
        return [];
    }
}

export async function getProductBySlugAdmin(slug: string): Promise<Product | null> {
    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        return MOCK_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
    }
    if (!adminDb) return null;
    try {
        const query = adminDb.collection(COLLECTION_NAME).where("slug", "==", slug).limit(1);
        const snapshot = await query.get();

        if (!snapshot.empty) return mapToProduct(snapshot.docs[0].id, snapshot.docs[0].data());

        const qFb = adminDb.collection(COLLECTION_NAME).where("id", "==", slug).limit(1);
        const snapshotFb = await qFb.get();
        if (!snapshotFb.empty) return mapToProduct(snapshotFb.docs[0].id, snapshotFb.docs[0].data());

        return null;
    } catch (error) {
        return null;
    }
}

export async function getFeaturedProductsAdmin(limitCount: number = 8): Promise<Product[]> {
    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        return MOCK_PRODUCTS.filter(p => p.featured).slice(0, limitCount);
    }
    if (!adminDb) return [];
    try {
        const query = adminDb.collection(COLLECTION_NAME).where("featured", "==", true).limit(limitCount);
        const snapshot = await query.get();

        const products: Product[] = [];
        snapshot.forEach((doc: any) => {
            const data = doc.data();
            const p = mapToProduct(doc.id, data);
            if (data.isActive !== false && p) products.push(p);
        });
        return products;
    } catch (error) {
        return [];
    }
}

export async function getFilteredProductsAdmin(filters: FilterOptions): Promise<Product[]> {
    const { category, department, size, color, minPrice, maxPrice, featured, limitCount } = filters;
    
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

    if (!adminDb) return [];
    
    try {
        let query: any = adminDb.collection(COLLECTION_NAME);

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
        
        let finalProducts = products;
        if (color) {
            finalProducts = finalProducts.filter(p => getColorFamily(p.color) === color);
        }
        
        finalProducts.sort((a, b) => a.price - b.price);
        return finalProducts;
    } catch (error) {
        console.error("⚠️ [getFilteredProductsAdmin] Falha:", error);
        return [];
    }
}

export async function getHeroBannersAdmin(): Promise<Product[]> {
    if (process.env.PLAYWRIGHT_TEST === "true" || process.env.NEXT_PUBLIC_APP_ENV === "test") {
        return MOCK_PRODUCTS.filter(p => p.isHeroBanner);
    }
    if (!adminDb) return [];
    try {
        const query = adminDb.collection(COLLECTION_NAME).where("isHeroBanner", "==", true);
        const snapshot = await query.get();
        const products: Product[] = [];
        snapshot.forEach((doc: any) => {
            const data = doc.data();
            const p = mapToProduct(doc.id, data);
            if (data.isActive !== false && p) products.push(p);
        });
        return products;
    } catch (error) {
        console.error("⚠️ [getHeroBannersAdmin] Falha:", error);
        return [];
    }
}
