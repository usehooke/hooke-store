'use server';

import { db } from '@/lib/firebase/index';
import { collection, addDoc } from 'firebase/firestore';

/**
 * HOOKE ELITE V11.0: AUDIT LOGGING
 * Action Server-Side para registrar atividades de administradores de forma silenciosa e segura (LGPD Compliant).
 */
export async function logAdminAction(actionType: string, payload: Record<string, any>, userEmail: string = 'system') {
    if (!db) {
        console.error("Firebase DB não inicializado no Server Action.");
        return;
    }

    try {
        const auditRef = collection(db, 'artifacts/hooke-standalone-pwa/users/admin_logs');
        await addDoc(auditRef, {
            action: actionType,
            payload,
            actor: userEmail,
            timestamp: Date.now(),
            env: process.env.NODE_ENV || 'development'
        });
    } catch (e) {
        console.error("Falha ao registrar log de auditoria:", e);
        // Falhas de auditoria não devem quebrar a aplicação (Silent Failure)
    }
}
