import { db } from "@/lib/firebase";
import { 
  doc, 
  runTransaction, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp
} from "firebase/firestore";

interface LockResult {
  success: boolean;
  message: string;
}

/**
 * Realiza um lock pessimista no estoque para garantir que a venda física tenha prioridade total.
 * Invalida imediatamente carrinhos online que contenham o mesmo SKU.
 */
export async function acquireStockLock(sku: string, requestedQty: number): Promise<LockResult> {
  const firestore = db;
  if (!firestore) return { success: false, message: "Banco de dados offline." };

  try {
    return await runTransaction(firestore, async (transaction) => {
      const stockDocRef = doc(firestore, "stock", sku);
      const stockDoc = await transaction.get(stockDocRef);

      if (!stockDoc.exists()) {
        return { success: false, message: "Produto não encontrado no controle de estoque atômico." };
      }

      const currentStock = stockDoc.data().quantity;

      if (currentStock < requestedQty) {
        return { success: false, message: "Estoque insuficiente para completar a venda física." };
      }

      // 1. Atualiza o estoque imediatamente (Pessimistic Lock)
      transaction.update(stockDocRef, {
        quantity: currentStock - requestedQty,
        lastUpdated: Timestamp.now(),
        updatedBy: "PDV-Physical"
      });

      // 2. Invalida carrinhos online (Checkouts pendentes)
      // Nota: Em uma arquitetura Firebase, poderíamos ter uma coleção 'active_checkouts'
      const checkoutsQuery = query(
        collection(firestore, "active_checkouts"), 
        where("items", "array-contains", sku)
      );
      
      const sessionSnapshots = await getDocs(checkoutsQuery);
      sessionSnapshots.forEach((doc) => {
        // Marcamos como invalidado ou deletamos para forçar o recálculo/aviso no site
        transaction.delete(doc.ref);
      });

      return { success: true, message: "Estoque reservado e carrinhos online invalidados." };
    });
  } catch (error) {
    console.error("Locking Error:", error);
    return { success: false, message: "Erro crítico ao travar o estoque." };
  }
}
