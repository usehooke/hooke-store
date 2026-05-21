import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { ProductSchema } from '../src/lib/schemas';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log('Fetching from Client SDK...');
  try {
    const q = query(collection(db, 'produtos'), limit(10));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      console.log('No products found in DB! (Client SDK)');
    }

    snap.forEach(doc => {
      const data = doc.data();
      const res = ProductSchema.safeParse({ id: doc.id, ...data });
      if (!res.success) {
        console.log('\n❌ Doc', doc.id, `"${data.name}"`, 'FAILED validation:');
        console.log(JSON.stringify(res.error.format(), null, 2));
      } else {
        console.log('\n✅ Doc', doc.id, `"${data.name}"`, 'PASSED validation!');
        console.log('   isActive:', data.isActive, '| featured:', data.featured, '| category:', data.category);
      }
    });
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

run();
