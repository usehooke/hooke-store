import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { client } from "@/lib/mercadopago";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OrderStatus } from "@/types/order";

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const type = url.searchParams.get("type");
        const dataId = url.searchParams.get("data.id");

        // Verifica se a notificação é referente a um Pagamento
        if (type === "payment" && dataId) {
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

                const orderRef = doc(db, "pedidos", externalReference);

                await updateDoc(orderRef, {
                    status: orderStatus,
                    paymentId: paymentData.id?.toString(),
                    paymentMethod: paymentData.payment_type_id || paymentData.payment_method_id,
                    updatedAt: Date.now()
                });

                console.log(`[Webhook] Pedido ${externalReference} atualizado para ${orderStatus}`);
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: unknown) {
        console.error("[Webhook Error] Falha no processamento:", error instanceof Error ? error.message : 'Unknown Error');
        // Mesmo em falha, é boa prática retornar 200 para o MP não ficar re-tentando infinitamente
        // caso não seja um erro vital de rede. Mas retornaremos 500 para debug interno no vercel logs se preferir.
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
