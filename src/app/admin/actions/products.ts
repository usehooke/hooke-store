'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logAdminAction } from './audit';
import { Product } from '@/types';

export async function toggleProductVisibility(id: string, currentStatus: boolean, userEmail: string = 'system') {
    if (!adminDb) return { success: false, message: "Admin DB indisponível" };

    try {
        await adminDb.collection('produtos').doc(id).update({ isActive: !currentStatus });
        
        await logAdminAction('TOGGLE_PRODUCT_VISIBILITY', { id, newStatus: !currentStatus }, userEmail);
        
        // Elite Revalidation
        // @ts-ignore
        revalidateTag('products');
        revalidatePath('/admin/produtos');
        revalidatePath('/', 'layout'); 
        revalidatePath('/colecao');
        
        return { success: true, newStatus: !currentStatus };
    } catch (err: unknown) {
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}

export async function deleteProduct(id: string, name: string, userEmail: string = 'system') {
    if (!adminDb) return { success: false, message: "Admin DB indisponível" };

    try {
        // 1. PRIORIDADE MÁXIMA: Deleção do Documento no Firestore via Admin SDK (Ignora Regras)
        await adminDb.collection('produtos').doc(id).delete();
        
        // 2. LOG DA OPERAÇÃO
        await logAdminAction('DELETE_PRODUCT', { id, name }, userEmail);

        // 3. STORAGE CLEANUP (FAIL-SAFE)
        try {
            console.log(`[Hooke System] Produto ${id} removido do Firestore. Imagens órfãs no Storage aguardando expiração ou limpeza manual.`);
        } catch (storageErr) {
            console.warn("⚠️ [Hooke Rescue] Falha ao tentar limpar Storage (não crítico):", storageErr);
        }
        
        // 4. CACHE REVALIDATION
        // @ts-ignore
        revalidateTag('products');
        revalidatePath('/admin/produtos');
        revalidatePath('/', 'layout');
        revalidatePath('/colecao');
        
        return { success: true };
    } catch (err: unknown) {
        console.error("❌ [Hooke System] Falha crítica na deleção do produto:", err);
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}

export async function saveProduct(data: Partial<Product>, userEmail: string = 'system') {
    if (!adminDb) return { success: false, message: "Admin DB indisponível" };

    try {
        // Gera um novo ID ou usa o existente
        const productRef = data.id ? adminDb.collection('produtos').doc(data.id) : adminDb.collection('produtos').doc();
        const id = productRef.id;
        
        const payload = {
            ...data,
            id,
            updatedAt: Date.now()
        };

        // Salva com permissão total de Admin
        await productRef.set(payload);
        
        await logAdminAction(data.id ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT', payload, userEmail);
        
        // Elite Revalidation
        // @ts-ignore
        revalidateTag('products');
        revalidatePath('/admin/produtos');
        revalidatePath('/', 'layout');
        revalidatePath('/colecao');
        
        return { success: true, product: payload };
    } catch (err: unknown) {
        console.error("❌ [Hooke System] Falha ao salvar produto:", err);
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}
