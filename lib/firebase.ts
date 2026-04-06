// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, FacebookAuthProvider } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Hooke Elite: Firebase Configuration using Protected Environment Variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// --- A BLINDAGEM DE BUILD (CURTO-CIRCUITO) ---
// Checa se a chave existe antes de acionar o SDK para evitar erros fatais no Vercel.
export const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;
const facebookProvider = new FacebookAuthProvider();

if (isConfigValid) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
    } catch (error) {
        console.error("❌ [Hooke System] Erro Crático ao inicializar Firebase:", error);
    }
} else {
    // Diagnóstico para o desenvolvedor
    if (typeof window !== "undefined") {
        console.error("⚠️ [Hooke System] Firebase Keys ausentes. Verifique seu .env.local ou as configurações da Vercel.");
    }
    
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
        console.warn("🚀 [Hooke System] Chaves ausentes no Build (SSG). Ativando modo Short-Circuit...");
    }
}

// Exportamos os serviços. Se não houver chaves, eles serão 'null'.
export { app, db, auth, storage, facebookProvider };
