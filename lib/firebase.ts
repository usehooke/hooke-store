// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, FacebookAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4G4-PK-IsgMWHipcozSXKk5StrvW9XhU", // 'H' is uppercase now
    authDomain: "hooke-site.firebaseapp.com",
    projectId: "hooke-site",
    storageBucket: "hooke-site.firebasestorage.app",
    messagingSenderId: "441360492840",
    appId: "1:441360492840:web:5d20cf0c63a27f1b04481d",
    measurementId: "G-JRRNTWZCLW"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const facebookProvider = new FacebookAuthProvider();

export { app, db, auth, storage, facebookProvider };
