import { db } from '../src/lib/firebase/index';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ProductSchema } from '../src/features/catalog/schemas';

async function diagnose() {
  try {
    console.log("🔥 Buscando na coleção 'produtos' onde department == 'masculino'...");
    const q = query(collection(db, 'produtos'), where("department", "==", "masculino"));
    const snap = await getDocs(q);
    
    console.log(`Encontrados ${snap.size} documentos com department == "masculino".\n`);
    
    snap.forEach(doc => {
      const data = doc.data();
      console.log(`\n--- Doc: ${doc.id} ---`);
      console.log(`Name: ${data.name}`);
      console.log(`isActive: ${data.isActive}`);
      console.log(`category: ${data.category}`);
      console.log(`department: ${data.department}`);
      
      const validation = ProductSchema.safeParse({ id: doc.id, ...data });
      if (validation.success) {
        console.log(`✅ Zod Validation: PASSED`);
      } else {
        console.log(`❌ Zod Validation: FAILED`);
        console.log(JSON.stringify(validation.error.format(), null, 2));
      }
    });
    
  } catch (err: any) {
    console.error("ERRO FIREBASE:", err.message);
  }
}

diagnose();
