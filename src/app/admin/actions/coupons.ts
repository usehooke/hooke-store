'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { logAdminAction } from './audit';

const COUPONS_COLLECTION = 'coupons';

export interface CouponDTO {
    code: string;
    discountPercent: number;
    maxUses: number;
    usedCount: number;
    expiresAt: number; // timestamp
    isActive: boolean;
    eligibleCategories?: string[];
}

export interface CouponValidationResult {
    valid: boolean;
    discountPercent?: number;
    message?: string;
}

/**
 * SINGLE SOURCE OF TRUTH: Validação de cupom no servidor.
 * O cliente NUNCA calcula o desconto — apenas exibe o que o servidor autorizar.
 * Arquitetura Híbrida: A lógica de Kit (3x199/5x299) permanece no cliente para UX offline.
 * Esta função valida apenas cupons de código promocional.
 */
export async function validateCouponCode(code: string, cartSubtotal: number): Promise<CouponValidationResult> {
    if (!db) return { valid: false, message: "Serviço indisponível" };
    if (!code || code.trim().length < 3) return { valid: false, message: "Código inválido" };

    try {
        const couponRef = doc(db, COUPONS_COLLECTION, code.toUpperCase().trim());
        const snap = await getDoc(couponRef);

        if (!snap.exists()) return { valid: false, message: "Cupom não encontrado" };

        const coupon = snap.data() as CouponDTO;

        if (!coupon.isActive) return { valid: false, message: "Cupom inativo" };
        if (coupon.expiresAt < Date.now()) return { valid: false, message: "Cupom expirado" };
        if (coupon.usedCount >= coupon.maxUses) return { valid: false, message: "Limite de usos atingido" };

        return { valid: true, discountPercent: coupon.discountPercent };
    } catch (err: unknown) {
        return { valid: false, message: "Erro ao validar cupom" };
    }
}

/** Cria ou atualiza um cupom via Admin */
export async function saveCoupon(coupon: CouponDTO, userEmail: string = 'system') {
    if (!db) return { success: false, message: "DB indisponível" };

    try {
        const couponRef = doc(db, COUPONS_COLLECTION, coupon.code.toUpperCase().trim());
        await setDoc(couponRef, { ...coupon, code: coupon.code.toUpperCase().trim() });
        await logAdminAction('SAVE_COUPON', { code: coupon.code }, userEmail);
        revalidatePath('/admin');
        revalidateTag('coupons');
        return { success: true };
    } catch (err: unknown) {
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}

/** Ativa ou desativa um cupom existente */
export async function toggleCouponStatus(code: string, newStatus: boolean, userEmail: string = 'system') {
    if (!db) return { success: false, message: "DB indisponível" };

    try {
        const couponRef = doc(db, COUPONS_COLLECTION, code.toUpperCase());
        await updateDoc(couponRef, { isActive: newStatus });
        await logAdminAction('TOGGLE_COUPON', { code, newStatus }, userEmail);
        revalidatePath('/admin');
        revalidateTag('coupons');
        return { success: true };
    } catch (err: unknown) {
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}

/** Remove um cupom */
export async function deleteCoupon(code: string, userEmail: string = 'system') {
    if (!db) return { success: false, message: "DB indisponível" };

    try {
        await deleteDoc(doc(db, COUPONS_COLLECTION, code.toUpperCase()));
        await logAdminAction('DELETE_COUPON', { code }, userEmail);
        revalidatePath('/admin');
        revalidateTag('coupons');
        return { success: true };
    } catch (err: unknown) {
        return { success: false, message: (err instanceof Error ? err.message : "Unknown error") };
    }
}

/** Lista todos os cupons para o painel admin */
export const listCoupons = unstable_cache(
    async (): Promise<CouponDTO[]> => {
        if (!db) return [];

        try {
            const snap = await getDocs(collection(db, COUPONS_COLLECTION));
            return snap.docs.map(d => d.data() as CouponDTO);
        } catch {
            return [];
        }
    },
    ['coupons-list'],
    { tags: ['coupons'], revalidate: 3600 }
);
