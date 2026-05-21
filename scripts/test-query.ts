import { db } from './src/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

async function testQuery() {
  try {
    console.log("Executando query...");
    const q = query(
      collection(db, 'produtos'),
      where('department', '==', 'Masculino'),
      orderBy('price', 'asc')
    );
    const snapshot = await getDocs(q);
    console.log("Sucesso! Produtos encontrados:", snapshot.docs.length);
  } catch (e: any) {
    console.error("ERRO FIREBASE:", e.message);
  }
}

testQuery();
