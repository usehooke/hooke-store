import { getApps, getApp, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

/**
 * Hooke Elite: Firebase Admin SDK
 * Fornece acesso privilegiado ao Firestore em API Routes (Server-Side).
 * 
 * ⚡ BLINDAGEM VERCEL SERVERLESS:
 * - preferRest: true é configurado ANTES de qualquer chamada ao Firestore
 * - Evita vazamentos e timeouts gRPC sob suspensão de containers serverless
 */

let adminDb: ReturnType<typeof getFirestore> | null = null;
let adminAuth: ReturnType<typeof getAuth> | null = null;

try {
  if (getApps().length === 0) {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountBase64) {
      const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
      );

      const adminApp = initializeApp({
        credential: cert(serviceAccount),
      });

      // ✅ ORDEM CORRETA: Firestore instanciado IMEDIATAMENTE após initializeApp,
      // com settings aplicadas antes de qualquer operação de leitura/escrita.
      const db = getFirestore(adminApp);
      db.settings({ preferRest: true } as any);
      adminDb = db;
      adminAuth = getAuth(adminApp);
    } else {
      // Build time ou ambiente sem credenciais (CI/CD preview)
      console.warn("⚠️ [Hooke Admin] FIREBASE_SERVICE_ACCOUNT_KEY ausente. AdminDB desabilitado.");
    }
  } else {
    // App já inicializado (hot reload em dev)
    const existingApp = getApp();
    adminDb = getFirestore(existingApp);
    adminAuth = getAuth(existingApp);
    // settings não pode ser chamado novamente — já foram aplicadas
  }
} catch (error) {
  console.error("❌ [Hooke Admin] Erro ao inicializar Admin SDK:", error);
}

export { adminDb, adminAuth };
