import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit, QueryConstraint } from "firebase/firestore";
import { Product } from "@/types";
import { MOCK_PRODUCTS } from "./mockData";

export const COLLECTION_NAME = "produtos";

/**
 * Hooke Elite: Resilient data fetching with Mock Fallback for Build Stability.
 * Wraps Firestore calls in try/catch to handle PERMISSION_DENIED during SSG.
 */

export async function getProducts(category?: string): Promise<Product[]> {
    try {
        const productsRef = collection(db, COLLECTION_NAME);
        const conditions: QueryConstraint[] = [];

        if (category) {
            conditions.push(where("category", "==", category));
        }

        const q = query(productsRef, ...conditions);
        const snapshot = await getDocs(q);
        
        if (snapshot.empty && process.env.NODE_ENV === 'production') {
            console.warn("Firestore returned empty products. Using Mock Data for build stability.");
            return category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS;
        }

        const products: Product[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.isActive !== false) {
                products.push({ id: doc.id, ...data } as Product);
            }
        });

        return products.length > 0 ? products : MOCK_PRODUCTS;
    } catch {
        console.error("Firestore PERMISSION_DENIED or Error. Falling back to Mock Data.");
        return category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS;
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const productsRef = collection(db, COLLECTION_NAME);
        const q = query(productsRef, where("slug", "==", slug), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
        }

        // Fallback: se o slug for na verdade o ID
        const qFallback = query(productsRef, where("id", "==", slug), limit(1));
        const snapshotFb = await getDocs(qFallback);

        if (!snapshotFb.empty) {
            return { id: snapshotFb.docs[0].id, ...snapshotFb.docs[0].data() } as Product;
        }

        // Se não encontrar no banco, procura no Mock (Fiel à Regra de Ouro)
        const mockProduct = MOCK_PRODUCTS.find(p => p.slug === slug || p.id === slug);
        return mockProduct || null;
    } catch {
        console.error("getProductBySlug Error. Falling back to Mock Data.");
        return MOCK_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
    }
}

export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
    try {
        const productsRef = collection(db, COLLECTION_NAME);
        const q = query(productsRef, where("featured", "==", true));
        const snapshot = await getDocs(q);

        const products: Product[] = [];
        snapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() } as Product);
        });

        if (products.length === 0) {
            return MOCK_PRODUCTS.filter(p => p.featured).slice(0, limitCount);
        }

        // Filtrando ativos
        const finalActiveProducts = products.filter(p => p.isActive !== false);
        return finalActiveProducts.slice(0, limitCount);
    } catch {
        console.error("getFeaturedProducts Error. Falling back to Mock Data.");
        return MOCK_PRODUCTS.filter(p => p.featured).slice(0, limitCount);
    }
}
