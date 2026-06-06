import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, total } = body;

    if (!customer?.phone || items?.length === 0) {
      return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
    }

    // Usar o número de telefone limpo como ID do rascunho para evitar duplicatas (upsert)
    const phoneId = customer.phone.replace(/\D/g, "");
    
    // Calcula o prazo de expiração (48 horas)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    if (!adminDb) {
      return NextResponse.json({ message: "Serviço de Banco de Dados Admin indisponível" }, { status: 500 });
    }

    await adminDb.collection("pedidos").doc(`draft_${phoneId}`).set({
      customer,
      items,
      total,
      status: "abandoned_cart",
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      recovered: false
    }, { merge: true });

    return NextResponse.json({ message: "Draft salvo" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao salvar carrinho abandonado:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
