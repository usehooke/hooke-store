/**
 * HOOKE ELITE: ADMIN PRIVILEGE ELEVATION
 * Este script concede a claim 'admin: true' para um usuário específico.
 * 
 * COMO USAR:
 * 1. Tenha o arquivo 'serviceAccountKey.json' na raiz do projeto (baixado do console do Firebase).
 * 2. Altere a variável 'USER_EMAIL' abaixo para o SEU email.
 * 3. Rode no terminal: node ./scratch/set-admin.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const USER_EMAIL = 'nandof83@gmail.com'; // 👈 MUDE ISTO

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ SUCESSO: O usuário ${email} agora é um ADMINISTRADOR ELITE.`);
    console.log(`⚠️  AVISO: Você precisa fazer LOGOUT e LOGIN novamente no site para as permissões serem atualizadas.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ ERRO ao conceder permissão:', error.message);
    process.exit(1);
  }
}

setAdminClaim(USER_EMAIL);
