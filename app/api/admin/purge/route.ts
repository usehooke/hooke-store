import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

/**
 * MISSION: DATABASE PURGE & MALFORMED DATA CLEANUP
 * Alvo: Dados malformados, tags de teste e resíduos de desenvolvimento.
 */
export async function POST() {
  console.log("🚀 Iniciando Purga de Dados Hooke...");
  
  if (!db) {
    return NextResponse.json({ success: false, error: "Firestore não inicializado." }, { status: 500 });
  }

  try {
    const collections = ["produtos", "modelagens", "estampas_tecidos", "cores"];
    let totalDeleted = 0;
    let totalSanitized = 0;

    for (const colName of collections) {
      const colRef = collection(db, colName);
      const snapshot = await getDocs(colRef);
      
      for (const d of snapshot.docs) {
        const data = d.data();
        const id = d.id;
        
        // Critérios de Extermínio:
        const isTestId = id.toLowerCase().includes("test") || id.toLowerCase().includes("teste");
        const isTestName = data.name && (data.name.toLowerCase().includes("test") || data.name.toLowerCase().includes("teste"));
        const isMalformed = !data.name && colName === "produtos";

        if (isTestId || isTestName || isMalformed) {
          await deleteDoc(doc(db, colName, id));
          totalDeleted++;
        } else {
          // Sanitização de campos (XSS/HTML Malformado)
          let needsUpdate = false;
          const updatedData: any = {};

          if (data.description && (data.description.includes("<script") || data.description.includes("findDOMNode"))) {
            updatedData.description = data.description.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").replace(/findDOMNode/g, "ref");
            needsUpdate = true;
          }

          if (needsUpdate) {
            await updateDoc(doc(db, colName, id), updatedData);
            totalSanitized++;
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Purga concluída com sucesso.",
      deleted: totalDeleted,
      sanitized: totalSanitized
    });
  } catch (error) {
    console.error("❌ Falha crítica na purga:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
