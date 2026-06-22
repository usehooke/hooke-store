import { getApps, getApp, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

/**
 * Hooke Elite: Firebase Admin SDK
 * Fornece acesso privilegiado ao Firestore em API Routes (Server-Side).
 * Resolve erros de 'PERMISSION_DENIED' ao salvar pedidos.
 */

let adminApp;

if (getApps().length === 0) {
    try {
        const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (serviceAccountBase64) {
            const serviceAccount = JSON.parse(
                Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
            );

            adminApp = initializeApp({
                credential: cert(serviceAccount),
            });
        } else {
            // Fallback para quando estamos em build time ou sem chaves
        }
    } catch (error) {
        console.error("❌ [Hooke Admin] Erro ao inicializar Admin SDK:", error);
    }
} else {
    adminApp = getApp();
}

const adminDb = getApps().length ? getFirestore() : null;
const adminAuth = getApps().length ? getAuth() : null;

export { adminDb, adminAuth };
