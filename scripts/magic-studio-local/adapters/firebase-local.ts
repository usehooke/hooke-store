import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente manualmente, já que não estamos no runtime do Next.js
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!admin.apps.length) {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (!serviceAccountBase64 || !storageBucket) {
        throw new Error("❌ [ERRO GRAVE] Credenciais do Firebase ou Storage Bucket ausentes no .env.local.");
    }

    const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
    );

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: storageBucket
    });
}

const adminDb = admin.firestore();
const adminStorage = admin.storage().bucket();

export { adminDb, adminStorage };
