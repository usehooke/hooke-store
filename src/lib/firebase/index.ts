// Hooke Elite: Firebase Infrastructure Hub
// IMPORTANTE: Este módulo é exclusivo do lado CLIENT (browser).
// O Admin SDK (firebase-admin.ts) deve ser usado para operações server-side.

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isConfigPresent =
    !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

// Instâncias Globais (Singletons)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
const facebookProvider = new FacebookAuthProvider();

/**
 * 📐 Inicialização Silenciosa & Resiliente
 *
 * ✅ Inicializa sempre que a config estiver presente (browser ou servidor).
 *
 * ⚠️ IMPORTANTE — Por que não há guard `typeof window !== 'undefined'`:
 * O admin layout é um componente `'use client'` que o Next.js pré-renderiza
 * no servidor (SSR). Um guard de módulo bloquearia a inicialização nessa fase,
 * fazendo com que `auth` seja `null` e o layout retorne `null` (tela branca).
 *
 * Os erros gRPC do Firebase Client SDK em ambiente Node.js são esperados
 * durante o build e não afetam a experiência do usuário no browser.
 * Para operações server-side, use o Admin SDK em src/lib/firebase-admin.ts.
 */
if (isConfigPresent) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        db = getFirestore(app);
        auth = getAuth(app);
    } catch (error) {
        console.error("❌ [Hooke Rescue] Falha crítica ao despertar o Firebase:", error);
    }
}

export { app, db, auth, facebookProvider };
