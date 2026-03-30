// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, FacebookAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

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

// Initialize Firebase (Singleton pattern to prevent memory leaks and build errors)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exports for the application
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const facebookProvider = new FacebookAuthProvider();

export { app, db, auth, storage, facebookProvider };
