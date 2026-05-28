import { adminDb } from "@/lib/firebase-admin";
import { Product } from "@/types";
import { ProductSchema } from "./schemas";
import { FilterOptions } from "./productService";

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
    if (!adminDb) return [];
    
    const { category, department, size, minPrice, maxPrice, featured, limitCount } = filters;
    
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
        
        products.sort((a, b) => a.price - b.price);
        return products;
    } catch (error) {
        console.error("⚠️ [getFilteredProductsAdmin] Falha:", error);
        return [];
    }
}

export async function getHeroBannersAdmin(): Promise<Product[]> {
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
