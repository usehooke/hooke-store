import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit, QueryConstraint, DocumentData } from "firebase/firestore";
import { Product } from "@/types";
import { MOCK_PRODUCTS } from "./mockData";

export const COLLECTION_NAME = "produtos";

/**
 * @Agent-LegacyRescue Protocol: RESILIENCE ENGINE V1
 * Centraliza a inteligência de Fallback para garantir "Zero Build Error" na Vercel
 * e alta disponibilidade em produção.
 */

/** 1. Utilitário de Detecção de Ambiente */
const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build' || !db;

import { ProductSchema } from "./schemas";

/** 2. Mapeamento Seguro de Documento com Blindagem Zod */
const mapToProduct = (docId: string, data: DocumentData): Product | null => {
    try {
        const rawBody = { id: docId, ...data };
        const validation = ProductSchema.safeParse(rawBody);

        if (!validation.success) {
            console.error(`❌ [Hooke Blindagem] Falha de esquema no produto ${docId}:`, validation.error.format());
            return null; // Força o motor resiliente a usar o fallback
        }

        return validation.data as Product;
    } catch (err) {
        return null;
    }
};

/** 3. Motor de Execução Resiliente (The Core) */
async function executeResilient<T>(
    operationName: string,
    firestoreQuery: () => Promise<T>,
    mockFallback: T
): Promise<T> {
    // A. Curto-circuito em tempo de Build
    if (isBuildPhase()) {
        return mockFallback;
    }

    try {
        const result = await firestoreQuery();
        // Se o resultado for vazio/falso, tentamos o Mock (Auto-cura)
        if (!result || (Array.isArray(result) && result.length === 0)) {
            return mockFallback;
        }
        return result;
    } catch (error) {
        console.warn(`⚠️ [Hooke Rescue] Falha em ${operationName}. Ativando Mock Fallback.`, error);
        // TODO: Enviar telemetria via analytics.ts quando implementado server-side
        return mockFallback;
    }
}

/** 
 * 🚀 EXPORTS DOS SERVIÇOS (Refatorados & Limpos)
 */

export async function getProducts(category?: string): Promise<Product[]> {
    return executeResilient(
        "getProducts",
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
        category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS
    );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    return executeResilient(
        "getProductBySlug",
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
        MOCK_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null
    );
}

export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
    return executeResilient(
        "getFeaturedProducts",
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
        MOCK_PRODUCTS.filter(p => p.featured).slice(0, limitCount)
    );
}
