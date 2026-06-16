import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { addContactToBrevo } from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, total } = body;

    if (!customer?.phone || items?.length === 0) {
      return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
    }

    // Usar o número de telefone limpo como ID do rascunho para evitar duplicatas (upsert)
    const phoneId = customer.phone.replace(/\D/g, "");
    
    // Unificar datas como timestamps numéricos (ms) para evitar quebras de ordenação no Firestore
    const createdAt = Date.now();
    const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48 horas em ms

    if (!adminDb) {
      return NextResponse.json({ message: "Serviço de Banco de Dados Admin indisponível" }, { status: 500 });
    }

    await adminDb.collection("pedidos").doc(`draft_${phoneId}`).set({
      customer,
      items,
      total,
      status: "abandoned_cart",
      createdAt,
      expiresAt,
      recovered: false
    }, { merge: true });

    // Sincroniza o lead no Brevo se houver e-mail associado
    // Lista ID 3: Carrinho Abandonado
    if (customer?.email && customer.email.trim() !== "") {
      // Executa em background sem bloquear a resposta ao usuário
      addContactToBrevo(customer.email, customer.phone, customer.name, [3]).catch(err => {
        console.error("Falha ao registrar lead do carrinho abandonado no Brevo:", err);
      });
    }

    return NextResponse.json({ message: "Draft salvo" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao salvar carrinho abandonado:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
