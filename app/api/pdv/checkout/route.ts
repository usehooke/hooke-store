import { NextResponse } from "next/server";
import { TinyClient } from "@/lib/tiny/client";

export async function POST(request: Request) {
  try {
    const saleData = await request.json();
    
    // 1. Processar cada item para dar baixa no estoque no Tiny
    const syncResults = await Promise.all(
        saleData.items.map(async (item: any) => {
            try {
                return await TinyClient.updateStock(item.id, item.quantity);
            } catch (err) {
                console.error(`Erro ao sincronizar item ${item.id}:`, err);
                return { error: true, itemId: item.id };
            }
        })
    );

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
