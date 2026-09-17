import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { addContactToBrevo } from "@/lib/brevo";
import { buildAbandonedCartRecoveryMessage, sendWhatsAppMessage } from "@/lib/whatsapp/engine";

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

    // 1. Gera mensagem e link de recuperação direta via WhatsApp
    const productNames = Array.isArray(items) ? items.map((i: any) => i.name || "Camiseta Hooke") : [];
    const { message: recoveryMessage, waLink: recoveryWhatsappUrl } = buildAbandonedCartRecoveryMessage({
      customerName: customer.name || "Cliente",
      customerPhone: customer.phone,
      productNames,
      totalValue: Number(total || 0),
      discountCoupon: "HOOKE-VIP",
      checkoutUrl: `https://www.usehooke.com.br/checkout?phone=${phoneId}`,
    });

    await adminDb.collection("pedidos").doc(`draft_${phoneId}`).set({
      customer,
      items,
      total,
      status: "abandoned_cart",
      createdAt,
      expiresAt,
      recovered: false,
      recoveryWhatsappUrl,
      recoveryMessage,
      whatsappNotified: false,
    }, { merge: true });

    // Dispara via WhatsApp Cloud API em background se credenciais ativas
    sendWhatsAppMessage({
      to: customer.phone,
      bodyText: recoveryMessage,
      category: "recuperacao_carrinho",
    }).catch((err) => {
      console.warn("[Abandoned Cart] Disparo automático WhatsApp:", err?.message);
    });

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
