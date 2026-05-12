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
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error("❌ [Hooke Webhook Error] Falha no processamento:", error?.message || error);
        return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
    }
}
