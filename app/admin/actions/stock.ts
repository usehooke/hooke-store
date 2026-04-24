'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from './audit';

const APP_ID = 'hooke-standalone-pwa';
const STOCK_DOC = `artifacts/${APP_ID}/inventory/lote-001`;

export interface StockResult {
    success: boolean;
    newCount?: number;
    message?: string;
}

/**
 * Ajuste rápido de estoque (+/-).
 * O2O Shield: invalida cache da Vercel instantaneamente após mutação.
 */
export async function adjustStock(delta: number, userEmail: string = 'system'): Promise<StockResult> {
    if (!db) return { success: false, message: "DB indisponível" };

    try {
        const stockRef = doc(db, STOCK_DOC);
        await updateDoc(stockRef, {
            count: increment(delta),
            lastUpdated: Date.now()
        });

        // Lê o valor final para retornar ao cliente
        const snap = await getDoc(stockRef);
        const newCount = snap.exists() ? snap.data()?.count : undefined;

        await logAdminAction('ADJUST_STOCK', { delta, newCount }, userEmail);

        // O2O Shielding: limpa cache do catálogo e do admin ao mesmo tempo
        revalidatePath('/admin');
        revalidatePath('/vautier142');
        revalidatePath('/');

        return { success: true, newCount };
    } catch (err: unknown) {
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}

/**
 * Pausa ou libera as vendas (Panic Button / Drop Release).
 * Salva a flag `isPaused` no documento de inventário.
 */
export async function toggleSalesPause(isPaused: boolean, userEmail: string = 'system'): Promise<StockResult> {
    if (!db) return { success: false, message: "DB indisponível" };

    try {
        const stockRef = doc(db, STOCK_DOC);
        await updateDoc(stockRef, {
            isPaused,
            lastUpdated: Date.now()
        });

        await logAdminAction(isPaused ? 'PAUSE_SALES' : 'RELEASE_DROP', { isPaused }, userEmail);

        revalidatePath('/admin');
        revalidatePath('/vautier142');
        revalidatePath('/');

        return { success: true };
    } catch (err: unknown) {
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}
