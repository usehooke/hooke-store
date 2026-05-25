'use server';

import { adminDb } from '@/lib/firebase-admin';

export async function createLookbook(productIds: string[]) {
    if (!adminDb) throw new Error("Database offline");

    try {
        const ref = await adminDb.collection("lookbooks").add({
            productIds,
            createdAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 dias
        });

        return { success: true, id: ref.id };
    } catch (error) {
        console.error("Erro ao criar lookbook:", error);
        return { success: false, error: "Falha ao criar lookbook no banco de dados." };
    }
}
