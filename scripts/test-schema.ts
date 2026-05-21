import { adminDb } from '../src/lib/firebase-admin';
import { ProductSchema } from '../src/lib/schemas';

async function run() {
  if (!adminDb) {
    console.error('adminDb is null');
    return;
  }
  const snap = await adminDb.collection('produtos').orderBy('createdAt', 'desc').limit(4).get();
  snap.forEach(doc => {
    const data = doc.data();
    const res = ProductSchema.safeParse({ id: doc.id, ...data });
    if (!res.success) {
      console.log('Doc', doc.id, 'failed validation:');
      console.log(JSON.stringify(res.error.format(), null, 2));
    } else {
      console.log('Doc', doc.id, 'passed validation!');
    }
  });
}

run();
