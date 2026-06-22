// Hooke Elite: Firebase Infrastructure Hub
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, initializeFirestore } from "firebase/firestore";
import { getAuth, Auth, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const isConfigPresent = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

// Instâncias Globais (Singletons)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
const facebookProvider = new FacebookAuthProvider();

/** 📐 Inicialização Silenciosa & Resiliente */
if (isConfigPresent) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        try {
            db = initializeFirestore(app, {
                experimentalForceLongPolling: true,
                experimentalAutoDetectLongPolling: false,
                useFetchStreams: false
            } as any);
        } catch (e) {
            console.warn("⚠️ [Hooke Rescue] Falha ao inicializar com configurações avançadas, usando fallback getFirestore:", e);
            db = getFirestore(app);
        }
        auth = getAuth(app);
    } catch (error) {
        console.error("❌ [Hooke Rescue] Falha crítica ao despertar o Firebase:", error);
    }
} else if (typeof window !== "undefined") {
    console.warn("⚠️ [Hooke System] Rodando sem Firebase (Chaves ausentes).");
}

export { app, db, auth, facebookProvider };
