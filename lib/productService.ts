import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit, QueryConstraint } from "firebase/firestore";
import { Product } from "@/types";
import { MOCK_PRODUCTS } from "./mockData";

export const COLLECTION_NAME = "produtos";

/**
 * Hooke Elite: Resilient data fetching with Mock Fallback for Build Stability.
 * --- O CURTO-CIRCUITO (SHORT-CIRCUIT) ---
 * Se o banco é null (build SSG sem chaves), devolve o Mock IMEDIATAMENTE.
 */

export async function getProducts(category?: string): Promise<Product[]> {
    // ⚡ CURTO-CIRCUITO DE BUILD: Evita falhas de permissão no Firestore durante o deploy na Vercel
    if (process.env.NEXT_PHASE === 'phase-production-build' || !db) {
        return category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS;
    }

    try {
        const productsRef = collection(db, COLLECTION_NAME);
        const conditions: QueryConstraint[] = [];

        if (category) {
            conditions.push(where("category", "==", category));
        }

        const q = query(productsRef, ...conditions);
        const snapshot = await getDocs(q);
        
        if (snapshot.empty && process.env.NODE_ENV === 'production') {
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
    } catch (error) {
        console.warn("⚠️ [Hooke System] Erro na nuvem, acionando redundância Mock.", error);
        return category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS;
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    // ⚡ BYPASS IMEDIATO
    if (process.env.NEXT_PHASE === 'phase-production-build' || !db) {
        return MOCK_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
    }

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
    } catch (error) {
        console.warn("⚠️ [Hooke System] Erro no getProductBySlug, usando Mocks.", error);
        return MOCK_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
    }
}



export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
    // ⚡ BYPASS IMEDIATO
    if (process.env.NEXT_PHASE === 'phase-production-build' || !db) {
        return MOCK_PRODUCTS.filter(p => p.featured).slice(0, limitCount);
    }

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
    } catch (error) {
        console.warn("⚠️ [Hooke System] Erro no getFeaturedProducts, usando Mocks.", error);
        return MOCK_PRODUCTS.filter(p => p.featured).slice(0, limitCount);
    }
}
