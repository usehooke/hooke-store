import "dotenv/config";
import { app, db } from "../lib/firebase.js";
import { collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";

async function purgeTestData() {
  console.log("Starting Production Reset: Data Purge...");

  try {
    const pedidosRef = collection(db, "pedidos");
    const pedidosSnapshot = await getDocs(pedidosRef);
    let deletedPedidos = 0;

    for (const docSnapshot of pedidosSnapshot.docs) {
      const data = docSnapshot.data();
      if (
        data.is_test === true || 
        (data.customer && data.customer.email && data.customer.email.endsWith("@test.com")) ||
        (data.customer && data.customer.email && data.customer.email.includes("teste"))
      ) {
        await deleteDoc(docSnapshot.ref);
        deletedPedidos++;
        console.log(`Deleted order test document: ${docSnapshot.id}`);
      }
    }
    console.log(`> Purged ${deletedPedidos} test orders.`);

  } catch (err) {
    console.error("Error purging test orders:", err);
  }

  try {
    const produtosRef = collection(db, "produtos");
    const produtosSnapshot = await getDocs(produtosRef);
    let updatedProdutos = 0;

    for (const docSnapshot of produtosSnapshot.docs) {
      const data = docSnapshot.data();
      // Reset counters
      const updates = {};
      if (data.views) updates.views = 0;
      if (data.clicks) updates.clicks = 0;
      if (data.sales) updates.sales = 0;

      if (Object.keys(updates).length > 0) {
        await updateDoc(docSnapshot.ref, updates);
        updatedProdutos++;
      }
    }
    console.log(`> Reset analytics counters for ${updatedProdutos} products.`);

  } catch (err) {
     console.error("Error resetting product analytics:", err);
  }

  console.log("Data Purge (Production Reset) Completed.");
  process.exit(0);
}

purgeTestData();
