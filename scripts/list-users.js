const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function listUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers(10);
    console.log('--- LISTA DE USUÁRIOS NO FIREBASE ---');
    listUsersResult.users.forEach((userRecord) => {
      console.log(`- ${userRecord.email} (UID: ${userRecord.uid})`);
    });
    console.log('------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    process.exit(1);
  }
}

listUsers();
