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
        await deleteDoc(doc(db, 'produtos', id));
        await logAdminAction('DELETE_PRODUCT', { id, name }, userEmail);
        
        revalidatePath('/admin/produtos');
        revalidatePath('/');
        revalidatePath('/masculino');
        revalidatePath('/feminino');
        
        return { success: true };
    } catch (err: unknown) {
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
