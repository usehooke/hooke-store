import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { client } from "@/lib/mercadopago";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OrderStatus } from "@/types/order";
import { z } from "zod";

// Schema para validação da notificação do Mercado Pago (via Query Params)
const MPNotificationSchema = z.object({
    type: z.literal("payment"),
    "data.id": z.string().min(1)
});

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        
        // Validação via Zod para garantir integridade do input
        const params = {
            type: url.searchParams.get("type"),
            "data.id": url.searchParams.get("data.id")
        };

        const validation = MPNotificationSchema.safeParse(params);

        if (!validation.success) {
            // Ignoramos notificações que não sejam de pagamento sem quebrar o fluxo
            return NextResponse.json({ success: true, ignored: true });
        }

        const { "data.id": dataId } = validation.data;

        const payment = new Payment(client);
        const paymentData = await payment.get({ id: dataId });

        const externalReference = paymentData.external_reference; // ID do nosso Pedido Firestore
        const mpStatus = paymentData.status;

        if (externalReference) {
            // Mapeamento de status MP para o nosso modelo de Pedidos
            let orderStatus: OrderStatus = 'pending';

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
                default:
                    orderStatus = 'pending';
            }

            // ⚡ A TRAVA DO TECH LEAD: Se o banco estiver offline, o Webhook não pode persistir a aprovação.
            if (!db) {
                console.error("❌ [Hooke System] Webhook abortado: Firestore offline.");
                return NextResponse.json({ error: "[Hooke System] Service Unavailable" }, { status: 503 });
            }

            const orderRef = doc(db, "pedidos", externalReference);

            await updateDoc(orderRef, {
                status: orderStatus,
                paymentId: paymentData.id?.toString(),
                paymentMethod: paymentData.payment_type_id || paymentData.payment_method_id,
                updatedAt: Date.now()
            });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: unknown) {
        console.error("[Webhook Error] Falha crítica no processamento:", error instanceof Error ? error.message : 'Unknown Error');
        return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
    }
}
