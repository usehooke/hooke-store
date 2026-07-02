const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function listAllIds() {
  try {
    console.log("Listando todos os IDs de produtos no Firestore...");
    const snapshot = await db.collection('produtos').get();
    
    snapshot.forEach(doc => {
      console.log(`- ID: "${doc.id}", Nome: "${doc.data().name}"`);
    });
  } catch (error) {
    console.error("Erro:", error);
  }
}

listAllIds();
