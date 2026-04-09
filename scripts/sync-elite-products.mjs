import admin from "firebase-admin";
import dotenv from "dotenv";
import { PRODUTOS } from "../data/catalogo";
import { Buffer } from "buffer";

dotenv.config({ path: ".env.local" });

/**
 * HOOKE ELITE: SYNC SCRIPT (FIRESTORE)
 * Consome o PRODUTOS local e injeta na coleção 'produtos' da nuvem.
 * Resolve o problema de catálogo vazio ou desatualizado.
 */

async function syncProducts() {
  const serviceAccountKeyB64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKeyB64) {
    console.error("❌ Erro: FIREBASE_SERVICE_ACCOUNT_KEY não encontrada no .env.local");
    process.exit(1);
  }

  try {
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountKeyB64, "base64").toString("utf-8")
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    const db = admin.firestore();
    const collectionRef = db.collection("produtos");

    console.log(`🚀 Iniciando sincronização de ${PRODUTOS.length} produtos...`);

    let count = 0;
    for (const product of PRODUTOS) {
      // Usamos .doc(id).set() para garantir sobrescrita fiel ao local
      await collectionRef.doc(product.id).set({
        ...product,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isActive: true, // Garante que fiquem ativos na loja
      });
      console.log(`✅ [${count + 1}/${PRODUTOS.length}] Sincronizado: ${product.name}`);
      count++;
    }

    console.log("\n✨ SINCRONIZAÇÃO DE ELITE CONCLUÍDA COM SUCESSO!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Erro durante a sincronização:", error);
    process.exit(1);
  }
}

syncProducts();
