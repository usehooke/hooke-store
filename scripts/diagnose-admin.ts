import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { adminDb } from '../src/lib/firebase-admin';
import { ProductSchema } from '../src/features/catalog/schemas';

async function checkFirebase() {
  if (!adminDb) {
    console.error("❌ adminDb is null. Check FIREBASE_SERVICE_ACCOUNT_KEY in .env.local");
    return;
  }

  try {
    const snapshot = await adminDb.collection('produtos').get();
    console.log(`Encontrados ${snapshot.size} produtos na coleção 'produtos'.`);

    let passed = 0;
    let failed = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const validation = ProductSchema.safeParse({ id: doc.id, ...data });
      
      if (validation.success) {
        passed++;
        if (data.department === 'masculino') {
          console.log(`✅ [MASCULINO PASSOU] ${data.name}`);
        }
      } else {
        failed++;
        console.log(`\n❌ [FALHOU VALIDAÇÃO ZOD] ID: ${doc.id} | Nome: ${data.name}`);
        console.log(`- Department armazenado: "${data.department}"`);
        console.log(`- Category armazenado: "${data.category}"`);
        console.log(`- Erros:`, JSON.stringify(validation.error.format(), null, 2));
      }
    });

    console.log(`\nResumo: ${passed} passaram no Zod, ${failed} falharam.`);

  } catch (e: any) {
    console.error("ERRO FIREBASE ADMIN:", e.message);
  }
}

checkFirebase();
