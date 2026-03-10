import { NextResponse } from "next/server";
import { TinyClient } from "@/lib/tiny/client";

export async function POST(request: Request) {
  try {
    const saleData = await request.json();
    const saleId = saleData.id;

    if (!saleId) {
      return NextResponse.json({ error: "Missing Sale ID" }, { status: 400 });
    }

    // 1. Verificar idempotência no Firestore
    const { db } = await import("@/lib/firebase");
    const { doc, getDoc, setDoc } = await import("firebase/firestore");
    
    const syncDocRef = doc(db, "pdv_syncs", saleId);
    const syncDoc = await getDoc(syncDocRef);

    if (syncDoc.exists()) {
      console.log(`Venda ${saleId} já sincronizada anteriormente. Ignorando.`);
      return NextResponse.json({ 
        success: true, 
        message: "Venda já processada (Idempotência)",
        alreadyProcessed: true 
      });
    }
    
    // 2. Processar cada item para dar baixa no estoque no Tiny
    const syncResults = await Promise.all(
        saleData.items.map(async (item: { id: string; quantity: number }) => {
            try {
                // No Tiny, o ID pode ser o SKU ou o ID interno do produto
                return await TinyClient.updateStock(item.id, item.quantity);
            } catch (err) {
                console.error(`Erro ao sincronizar item ${item.id}:`, err);
                return { error: true, itemId: item.id };
            }
        })
    );

    // 3. Registrar sucesso da sincronização para evitar duplicidade no futuro
    await setDoc(syncDocRef, {
        processedAt: new Date().toISOString(),
        total: saleData.total,
        itemCount: saleData.items.length,
        paymentMethod: saleData.paymentMethod || 'não informado'
    });

    console.log("Sincronização Tiny concluída:", syncResults);

    return NextResponse.json({ 
      success: true, 
      message: "Venda sincronizada com sucesso",
      transactionId: `ERP-${Date.now()}`,
      syncResults
    });
  } catch (error) {
    console.error("PDV Checkout Error:", error);
    return NextResponse.json({ error: "Erro ao processar checkout" }, { status: 500 });
  }
}
