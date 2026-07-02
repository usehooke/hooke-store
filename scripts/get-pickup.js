const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function getProduct() {
  try {
    const doc = await db.collection('produtos').doc('T-SHIRT-VINTAGE-PICKUP-ARE').get();
    if (!doc.exists) {
      console.log('Produto não encontrado!');
      return;
    }
    console.log(JSON.stringify(doc.data(), null, 2));
  } catch (error) {
    console.error("Erro:", error);
  }
}

getProduct();
