import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { client } from "@/lib/mercadopago";
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";

/**
 * Hooke Elite: Mercado Pago Webhook (Production Ready)
 * Processa notificações de pagamento e atualiza o Firestore usando o Admin SDK.
 */

const MPNotificationSchema = z.object({
    type: z.literal("payment"),
    "data.id": z.string().min(1)
});

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        
        const params = {
            type: url.searchParams.get("type") || url.searchParams.get("topic"),
            "data.id": url.searchParams.get("data.id") || url.searchParams.get("id")
        };

        const validation = MPNotificationSchema.safeParse(params);

        if (!validation.success) {
            return NextResponse.json({ success: true, ignored: true });
        }

        const { "data.id": dataId } = validation.data;

        // Recupera detalhes do pagamento no Mercado Pago
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: dataId });

        const externalReference = paymentData.external_reference; 
        const mpStatus = paymentData.status;

        if (externalReference && adminDb) {
            let orderStatus = 'pending';

            switch (mpStatus) {
                case 'approved':
                    orderStatus = 'approved';
                    break;
                case 'rejected':
                case 'cancelled':
                    orderStatus = 'cancelled';
                    break;
                case 'in_process':
                case 'authorized':
                    orderStatus = 'in_process';
                    break;
                case 'refunded':
                case 'charged_back':
                    orderStatus = 'refunded';
                    break;
                default:
                    orderStatus = 'pending';
            }

            // Atualização via Admin SDK (Ignora regras de segurança do cliente)
            const orderRef = adminDb.collection("pedidos").doc(externalReference);

            await orderRef.update({
                status: orderStatus,
                paymentId: paymentData.id?.toString(),
                paymentMethod: paymentData.payment_type_id || paymentData.payment_method_id,
                updatedAt: Date.now()
            });

            console.log(`✅ [Hooke Webhook] Pedido ${externalReference} atualizado para ${orderStatus}`);

            // INÍCIO: NOTIFICAÇÃO WHATSAPP DE NOVA VENDA
            if (orderStatus === 'approved') {
                try {
                    const orderDoc = await orderRef.get();
                    if (orderDoc.exists) {
                        const orderData = orderDoc.data();
                        
                        const nome = orderData?.customer?.name || "Cliente Hooke";
                        const whatsapp = orderData?.customer?.phone || "Não informado";
                        const cep = orderData?.shipping?.zipCode || "Não informado";
                        const produto = orderData?.items?.[0]?.name || "Produto(s) da loja";
                        const tamanho = orderData?.items?.[0]?.size || "-";
                        const valor_total = Number(orderData?.total || paymentData.transaction_amount || 0).toFixed(2).replace('.', ',');

                        const message = `💸 HOOKE STORE - NOVA VENDA! 💸\n\n👤 Cliente: ${nome}\n📱 WhatsApp: ${whatsapp}\n📍 CEP: ${cep}\n\n📦 Pedido: ${produto} (Tamanho: ${tamanho})\n💰 Valor: R$ ${valor_total}\n\nChame o cliente para combinar a entrega!`;

                        const waApiUrl = process.env.WHATSAPP_API_URL;
                        const waNotifyNumber = process.env.WHATSAPP_NOTIFY_NUMBER;

                        if (waApiUrl) {
                            // Disparo agnóstico (Funciona com Z-API, Evolution, Make, etc)
                            await fetch(waApiUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    number: waNotifyNumber,
                                    text: message,
                                    message: message // Enviamos ambas as chaves para máxima compatibilidade
                                })
                            }).catch(e => console.warn(`⚠️ Falha na API do WhatsApp:`, e.message));
                            
                            console.log(`✅ [Hooke Webhook] Notificação de Venda disparada!`);
                        } else {
                            console.log(`⚠️ [Hooke Webhook] WHATSAPP_API_URL não configurada. Venda não notificada.`);
                        }
                    }
                } catch (notifyErr) {
                    console.error("❌ [Hooke Webhook] Erro na fiação do WhatsApp:", notifyErr);
                }
            }
            // FIM: NOTIFICAÇÃO WHATSAPP
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error("❌ [Hooke Webhook Error] Falha no processamento:", error?.message || error);
        return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
    }
}
