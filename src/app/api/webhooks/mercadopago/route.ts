import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { client } from "@/lib/mercadopago";
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";
import crypto from "crypto";
import { brandConfig } from "@/config/brandConfig";
import { MPNotificationSchema } from "@/lib/schemas";

/**
 * Hooke Elite: Mercado Pago Webhook (Production Ready)
 * Processa notificações de pagamento e atualiza o Firestore usando o Admin SDK.
 */

const isDev = process.env.NODE_ENV === 'development';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        
        // ==========================================
        // 🛡️ SECURITY ELITE: Validação de Assinatura (HMAC)
        // ==========================================
        const xSignature = req.headers.get("x-signature");
        const xRequestId = req.headers.get("x-request-id");
        const webhookSecret = process.env.MP_WEBHOOK_SECRET;

        // Extrai parâmetros do query
        const dataIdParam = url.searchParams.get("data.id") || url.searchParams.get("id");
        
        if (webhookSecret && xSignature && xRequestId && dataIdParam) {
            // x-signature format: "ts=169...,v1=4a5b6c..."
            const parts = xSignature.split(',');
            let ts = '';
            let v1 = '';
            parts.forEach(part => {
                const [key, value] = part.split('=');
                if (key === 'ts') ts = value;
                if (key === 'v1') v1 = value;
            });

            if (ts && v1) {
                const manifest = `id:${dataIdParam};request-id:${xRequestId};ts:${ts};`;
                const hmac = crypto.createHmac('sha256', webhookSecret).update(manifest).digest('hex');
                if (hmac !== v1) {
                    console.error("🚨 [Hooke Security] Fake Webhook Interceptado! Assinatura Inválida.");
                    return NextResponse.json({ error: "Unauthorized. Invalid Signature." }, { status: 401 });
                }
            } else {
                if (isDev) console.warn("⚠️ [Hooke Security] Assinatura malformada.");
            }
        } else {
            if (isDev) console.warn("⚠️ [Hooke Security] Validação de assinatura ignorada (Faltam chaves ou headers).");
        }
        // ==========================================
        
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

            // ==========================================
            // 🔒 TRANSACTION ELITE: Atualização e Baixa de Estoque Atômica
            // ==========================================
            await adminDb.runTransaction(async (transaction) => {
                const orderDoc = await transaction.get(orderRef);
                if (!orderDoc.exists) {
                    throw new Error("Pedido não encontrado no banco.");
                }

                const currentData = orderDoc.data();
                
                // Evitar duplo processamento (Idempotência a nível de banco)
                if (currentData?.status === 'approved' && orderStatus === 'approved') {
                    if (isDev) console.log(`[Hooke Webhook] Pedido ${externalReference} já estava aprovado. Ignorando baixa dupla.`);
                    return;
                }

                // Dá baixa atômica no estoque se foi aprovado agora
                if (orderStatus === 'approved' && currentData?.items) {
                    for (const item of currentData.items) {
                        const productRef = adminDb!.collection("produtos").doc(item.id);
                        const productDoc = await transaction.get(productRef);
                        
                        if (productDoc.exists) {
                            const pData = productDoc.data();
                            if (pData && pData.sizes && pData.stock) {
                                const sizeKey = item.size;
                                const currentStock = pData.stock[sizeKey] || 0;
                                const newStock = Math.max(0, currentStock - item.quantity);
                                
                                // O totalStock será recalculado em background ou a UI puxará o novo map, mas podemos reduzir o totalStock também
                                const newTotalStock = Math.max(0, (pData.totalStock || 0) - item.quantity);

                                transaction.update(productRef, {
                                    [`stock.${sizeKey}`]: newStock,
                                    totalStock: newTotalStock
                                });
                            }
                        }
                    }
                }

                const updateFields: Record<string, any> = {
                    status: orderStatus,
                    paymentId: paymentData.id?.toString(),
                    paymentMethod: paymentData.payment_type_id || paymentData.payment_method_id,
                    updatedAt: Date.now()
                };

                // Captura automática de CPF/CNPJ do comprador no Mercado Pago
                const docNum = paymentData.payer?.identification?.number;
                if (docNum) {
                    updateFields["customer.document"] = docNum;
                }

                transaction.update(orderRef, updateFields);
            });

            if (isDev) console.log(`✅ [Hooke Webhook] Pedido ${externalReference} atualizado para ${orderStatus}`);

            // INÍCIO: NOTIFICAÇÃO WHATSAPP DE NOVA VENDA
            if (orderStatus === 'approved') {
                try {
                    const orderDoc = await orderRef.get();
                    if (orderDoc.exists) {
                        const orderData = orderDoc.data();
                        
                        const nome = orderData?.customer?.name || "Cliente Hooke";
                        const whatsapp = orderData?.customer?.phone || "Não informado";
                        const cep = orderData?.shippingZipcode || orderData?.shipping?.zipCode || "Não informado";
                        const produto = orderData?.items?.[0]?.name || "Produto(s) da loja";
                        const tamanho = orderData?.items?.[0]?.size || "-";
                        const valor_total = Number(orderData?.totalAmount || orderData?.total || paymentData.transaction_amount || 0).toFixed(2).replace('.', ',');
                        const referrer = orderData?.referrer || "";

                        let message = `💸 HOOKE STORE - NOVA VENDA! 💸\n\n👤 Cliente: ${nome}\n📱 WhatsApp: ${whatsapp}\n📍 CEP: ${cep}\n\n📦 Pedido: ${produto} (Tamanho: ${tamanho})\n💰 Valor: R$ ${valor_total}`;

                        if (referrer) {
                            message += `\n\n🎁 INDICAÇÃO SOCIAL CLUB!\n👤 Padrinho: ${referrer}\n(Lembre-se de enviar o cupom de R$ 35,00!)`;
                            
                            // Registra na coleção mgm_rewards para controle do admin
                            await adminDb.collection("mgm_rewards").add({
                                referrer: referrer,
                                refereeName: nome,
                                refereePhone: whatsapp,
                                orderId: externalReference,
                                orderTotal: Number(orderData?.totalAmount || paymentData.transaction_amount || 0),
                                status: "pending",
                                createdAt: Date.now()
                            });
                        }

                        message += `\n\nChame o cliente para combinar a entrega!`;

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
                            }).catch(e => { if (isDev) console.warn(`⚠️ Falha na API do WhatsApp:`, e.message); });
                            
                            if (isDev) console.log(`✅ [Hooke Webhook] Notificação de Venda disparada!`);
                        } else {
                            if (isDev) console.log(`⚠️ [Hooke Webhook] WHATSAPP_API_URL não configurada. Venda não notificada.`);
                        }
                    }
                } catch (notifyErr) {
                    console.error("❌ [Hooke Webhook] Erro na fiação do WhatsApp:", notifyErr);
                }
            }
            // INÍCIO: INTEGRAÇÃO META ADS CAPI (PURCHASE)
            if (orderStatus === 'approved') {
                try {
                    const orderDoc = await orderRef.get();
                    if (orderDoc.exists) {
                        const orderData = orderDoc.data();
                        
                        const pixelId = brandConfig.analytics.metaPixelId;
                        const accessToken = brandConfig.analytics.metaCapiToken;
                        
                        if (pixelId && accessToken && orderData) {
                            const email = orderData.customer?.email?.trim().toLowerCase() || "";
                            const phone = orderData.customer?.phone?.replace(/\D/g, "") || "";
                            const fbc = orderData.tracking?._fbc || "";
                            const fbp = orderData.tracking?._fbp || "";
                            
                            const hashedEmail = email ? crypto.createHash('sha256').update(email).digest('hex') : undefined;
                            const hashedPhone = phone ? crypto.createHash('sha256').update(phone).digest('hex') : undefined;
                            
                            const items = orderData.items || [];
                            const content_ids = items.map((i: any) => i.id || i.slug);
                            const totalValue = Number(orderData.total || paymentData.transaction_amount || 0);

                            const payload = {
                                data: [
                                    {
                                        event_name: 'Purchase',
                                        event_time: Math.floor(Date.now() / 1000),
                                        action_source: 'website',
                                        event_id: orderData.event_id || `evt_purchase_${externalReference}`,
                                        user_data: {
                                            client_ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
                                            client_user_agent: req.headers.get('user-agent'),
                                            em: hashedEmail,
                                            ph: hashedPhone,
                                            fbc: fbc || undefined,
                                            fbp: fbp || undefined,
                                        },
                                        custom_data: {
                                            currency: 'BRL',
                                            value: totalValue,
                                            content_ids: content_ids,
                                            content_type: 'product',
                                        }
                                    }
                                ]
                            };

                            await fetch(`https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${accessToken}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload),
                            });
                            if (isDev) console.log(`✅ [Hooke Webhook] Evento Purchase enviado para Meta CAPI (Pedido: ${externalReference})`);
                        }
                    }
                } catch (metaErr) {
                    console.error("❌ [Hooke Webhook] Erro na CAPI Meta:", metaErr);
                }
            }
            // FIM: INTEGRAÇÃO META ADS CAPI
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("❌ [Hooke Webhook Error] Falha no processamento:", errorMessage);
        return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
    }
}
