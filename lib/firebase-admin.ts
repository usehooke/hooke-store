import * as admin from "firebase-admin";

/**
 * Hooke Elite: Firebase Admin SDK
 * Fornece acesso privilegiado ao Firestore em API Routes (Server-Side).
 * Resolve erros de 'PERMISSION_DENIED' ao salvar pedidos.
 */

if (!admin.apps.length) {
    try {
        const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (serviceAccountBase64) {
            const serviceAccount = JSON.parse(
                Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
            );

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });

        } else {
            // Fallback para quando estamos em build time ou sem chaves
        }
    } catch (error) {
        console.error("❌ [Hooke Admin] Erro ao inicializar Admin SDK:", error);
    }
}

const adminDb = admin.apps.length ? admin.firestore() : null;
const adminAuth = admin.apps.length ? admin.auth() : null;

export { adminDb, adminAuth };
