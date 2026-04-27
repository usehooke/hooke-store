'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from './audit';
import { Product } from '@/types';

export async function toggleProductVisibility(id: string, currentStatus: boolean, userEmail: string = 'system') {
    if (!db) return { success: false, message: "DB indisponível" };

    try {
        const productRef = doc(db, 'produtos', id);
        await updateDoc(productRef, { isActive: !currentStatus });
        
        await logAdminAction('TOGGLE_PRODUCT_VISIBILITY', { id, newStatus: !currentStatus }, userEmail);
        revalidatePath('/admin/produtos');
        revalidatePath('/'); // O2O Shielding: Limpa cache do catálogo
        revalidatePath('/masculino');
        revalidatePath('/feminino');
        
        return { success: true, newStatus: !currentStatus };
    } catch (err: unknown) {
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}

export async function deleteProduct(id: string, name: string, userEmail: string = 'system') {
    if (!db) return { success: false, message: "DB indisponível" };

    try {
        // 1. PRIORIDADE MÁXIMA: Deleção do Documento no Firestore
        // Isso garante que o produto saia da vitrine imediatamente.
        await deleteDoc(doc(db, 'produtos', id));
        
        // 2. LOG DA OPERAÇÃO
        await logAdminAction('DELETE_PRODUCT', { id, name }, userEmail);

        // 3. STORAGE CLEANUP (FAIL-SAFE)
        // Tentamos limpar as imagens, mas não permitimos que falhas de Storage 
        // bloqueiem a conclusão da deleção do produto.
        try {
            // @Agent-LegacyRescue: Como o Firebase Storage foi removido/migrado para Cloudinary,
            // aqui entraria a lógica de deleção do Cloudinary caso necessário.
            // Por enquanto, apenas logamos que o documento foi removido.
            console.log(`[Hooke System] Produto ${id} removido do Firestore. Imagens órfãs no Storage aguardando expiração ou limpeza manual.`);
        } catch (storageErr) {
            console.warn("⚠️ [Hooke Rescue] Falha ao tentar limpar Storage (não crítico):", storageErr);
        }
        
        // 4. CACHE REVALIDATION
        // Limpamos o cache da Home e listagens para garantir sincronia total.
        revalidatePath('/admin/produtos');
        revalidatePath('/');
        revalidatePath('/masculino');
        revalidatePath('/feminino');
        
        return { success: true };
    } catch (err: unknown) {
        console.error("❌ [Hooke System] Falha crítica na deleção do produto:", err);
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}

export async function saveProduct(data: Partial<Product>, userEmail: string = 'system') {
    if (!db) return { success: false, message: "DB indisponível" };

    try {
        // Se nao tem ID, gera um novo referenciando collection
        const id = data.id || doc(collection(db, 'produtos')).id;
        const payload = {
            ...data,
            id,
            updatedAt: Date.now()
        };

        await setDoc(doc(db, 'produtos', id), payload);
        await logAdminAction(data.id ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT', payload, userEmail);
        
        revalidatePath('/admin/produtos');
        revalidatePath('/');
        revalidatePath('/masculino');
        revalidatePath('/feminino');
        
        return { success: true, product: payload };
    } catch (err: unknown) {
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}
