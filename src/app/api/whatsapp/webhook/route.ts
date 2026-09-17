import { NextRequest, NextResponse } from "next/server";
import { resolveCustomerIntent, sendWhatsAppMessage } from "@/lib/whatsapp/engine";
import { adminDb } from "@/lib/firebase-admin";

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "hooke_wa_verify_token_2026";

/**
 * Validação do Webhook do WhatsApp Business Cloud API (Meta)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ [WhatsApp Webhook] Verificação do Webhook Meta aprovada com sucesso.");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Token de verificação inválido" }, { status: 403 });
}

/**
 * Processamento de Mensagens Entrantes
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Estrutura padrão Meta WhatsApp Business Cloud API
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0]?.value;
    const message = changes?.messages?.[0];

    if (message && message.type === "text") {
      const fromPhone = message.from; // Número do cliente
      const messageText = message.text?.body || "";

      console.log(`📩 [WhatsApp Recebido] De: ${fromPhone} | Texto: "${messageText}"`);

      // 1. Resolução inteligente de intenção
      const resolved = resolveCustomerIntent(messageText);

      // 2. Registro no Firestore para acompanhamento de tickets (se adminDb ativo)
      if (adminDb) {
        try {
          await adminDb.collection("whatsapp_tickets").add({
            fromPhone,
            messageText,
            intentDetected: resolved.intent,
            replySent: resolved.reply,
            timestamp: Date.now(),
            status: resolved.intent === "humano" ? "pendente_atendente" : "resolvido_bot",
          });
        } catch (dbErr) {
          console.warn("[WhatsApp Webhook] Falha ao salvar ticket no Firestore:", dbErr);
        }
      }

      // 3. Resposta automática caso Cloud API esteja ativa
      await sendWhatsAppMessage({
        to: fromPhone,
        bodyText: resolved.reply,
        category: "suporte",
      });
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error: any) {
    console.error("[WhatsApp Webhook Error]", error);
    return NextResponse.json({ status: "ERROR", message: error?.message }, { status: 500 });
  }
}
