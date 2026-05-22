'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@/types/order';

export async function updateOrderStatus(orderId: string, status: OrderStatus, trackingCode?: string) {
    if (!adminDb) throw new Error("Database offline");

    const updateData: any = { status, updatedAt: Date.now() };
    if (trackingCode !== undefined) {
        updateData.trackingCode = trackingCode;
    }

    try {
        await adminDb.collection("pedidos").doc(orderId).update(updateData);
        revalidatePath("/admin/pedidos");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar pedido:", error);
        return { success: false, error: "Falha ao atualizar pedido no banco de dados." };
    }
}

export async function bulkUpdateOrders(orderIds: string[], status: OrderStatus) {
    if (!adminDb) throw new Error("Database offline");

    try {
        const batch = adminDb.batch();
        const now = Date.now();

        for (const id of orderIds) {
            const ref = adminDb.collection("pedidos").doc(id);
            batch.update(ref, { status, updatedAt: now });
        }

        await batch.commit();
        revalidatePath("/admin/pedidos");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar pedidos em lote:", error);
        return { success: false, error: "Falha ao processar ações em lote." };
    }
}
