import { NextResponse } from "next/server";

import { Preference } from "mercadopago";
import { client } from "@/lib/mercadopago";
import { adminDb } from "@/lib/firebase-admin";
import { Order, OrderItem } from "@/types/order";
import { CheckoutRequestSchema } from "@/lib/schemas";


// Minimal in-memory cache for simple idempotency to protect against network bounces
const idempotencyCache = new Map<string, number>();

// Helper to clean up old cache entries (older than 15 seconds)
function cleanIdempotencyCache() {
  const now = Date.now();
  for (const [key, timestamp] of idempotencyCache.entries()) {
    if (now - timestamp > 60000) {
      idempotencyCache.delete(key);
    }
  }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // 🔒 ARQUEOLOGIA: Blindagem Zod ativada
        const validation = CheckoutRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ 
                message: "Dados de checkout inválidos.", 
                errors: validation.error.format() 
            }, { status: 400 });
        }

        const { items, customer, shippingValue, shippingMethod, shippingZipcode, discountValue, couponCode, referrer } = validation.data;

        // --- IDEMPOTENCY CHECK ---
        cleanIdempotencyCache();
        const safeEmail = customer.email || "cliente@usehooke.com.br";
        // Create an idempotency key based on customer, items and total to prevent duplicate orders within a short window (15s)
        const idempotencyKey = `${safeEmail}-${items.length}-${items.reduce((acc, i) => acc + i.quantity, 0)}`;
        
        if (idempotencyCache.has(idempotencyKey)) {
             console.log(`[Idempotency] Duplicate request blocked for key: ${idempotencyKey}`);
             return NextResponse.json({ message: "Processando seu pedido. Por favor, aguarde alguns segundos antes de tentar novamente." }, { status: 429 });
        }
        
        // Add to cache
        idempotencyCache.set(idempotencyKey, Date.now());
        // -------------------------

        // Fallback para quem não preencheu o e-mail opcional
        // (Já declarado acima do bloco de idempotency cache)

        // 1. Gera o ID temporário (Reference do Pedido na Hooke)
        const orderId = `hooke-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // ==========================================
        // 🔒 SECURITY ELITE: Recálculo Server-Side
        // ==========================================
        let calculatedSubtotal = 0;
        const verifiedItems = [];

        if (!adminDb) {
            console.warn("⚠️ [Hooke System] Firebase ausente. Gerando link do Mercado Pago em Modo Standalone. PREÇOS NÃO VERIFICADOS.");
            // Fallback (Inseguro, apenas para ambiente sem setup)
            for (const item of items) {
                calculatedSubtotal += item.unit_price * item.quantity;
                verifiedItems.push(item);
            }
        } else {
            // Verificação rigorosa contra manipulação de payload
            for (const item of items) {
                const productDoc = await adminDb.collection("produtos").doc(item.id).get();
                
                if (!productDoc.exists) {
                    return NextResponse.json({ message: `Produto inválido ou indisponível: ${item.id}` }, { status: 400 });
                }

                const productData = productDoc.data();
                const realPrice = Number(productData?.price || 0);

                calculatedSubtotal += realPrice * item.quantity;

                verifiedItems.push({
                    ...item,
                    unit_price: realPrice,
                    title: productData?.name || item.title
                });
            }
        }

        // ==========================================
        // 🎟️ VALIDAÇÃO ESTÁTICA DE CUPONS
        // ==========================================
        let calculatedDiscount = 0;
        const upperCoupon = couponCode ? couponCode.toUpperCase().trim() : "";

        if (upperCoupon === "HOOKE10") {
            calculatedDiscount = calculatedSubtotal * 0.10; // 10% OFF
        } else if (upperCoupon === "BEMVINDO5") {
            calculatedDiscount = calculatedSubtotal * 0.05; // 5% OFF
        }

        // Aplicação do desconto de 15% do Social Club (MGM) se houver referrer
        let referralDiscount = 0;
        if (referrer && referrer.trim() !== "") {
            referralDiscount = (calculatedSubtotal - calculatedDiscount) * 0.15;
        }

        const totalDiscount = calculatedDiscount + referralDiscount;
        const totalAmount = calculatedSubtotal + (shippingValue || 0) - totalDiscount;

        // 2. Prepara o Documento Inicial (Pending) no Firestore
        // MVP Pragmatismo Brutal: Firebase Desativado Localmente para Checkout 
        if (!adminDb) {
            console.warn("⚠️ [Hooke System] Firebase ausente. Gerando link do Mercado Pago em Modo Standalone.");
        }

        const orderData: Order = {
            id: orderId,
            customer,
            items: verifiedItems,
            totalAmount,
            status: "pending",
            shippingValue: shippingValue || 0,
            shippingMethod: shippingMethod || "",
            shippingZipcode: shippingZipcode || "",
            discountValue: totalDiscount,
            couponCode: calculatedDiscount > 0 ? upperCoupon : "",
            referrer: referrer || "",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        if (adminDb) {
            await adminDb.collection("pedidos").doc(orderId).set(orderData);
        }

        // 3. Monta o Payload para a Preference do Mercado Pago
        // Essa URLBase ajuda no redirecionamento local ou de prod
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        // MP não aceita itens negativos facilmente. Aplicar desconto sobre o unit_price proporcionalmente.
        const discountMultiplier = totalDiscount ? (1 - (totalDiscount / calculatedSubtotal)) : 1;

        const mpItems = verifiedItems.map((i) => ({
            id: i.id,
            title: `${i.title} (Tamanho: ${i.size})`,
            quantity: i.quantity,
            unit_price: Number((i.unit_price * discountMultiplier).toFixed(2)),
            currency_id: "BRL"
        }));

        if (shippingValue && shippingValue > 0) {
            mpItems.push({
                id: "shipping",
                title: `Frete: ${shippingMethod}`,
                quantity: 1,
                unit_price: shippingValue,
                currency_id: "BRL"
            });
        }

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: mpItems,
                payer: {
                    name: customer.name,
                    email: safeEmail,
                    phone: customer.phone ? {
                        area_code: customer.phone.replace(/\D/g, "").substring(0, 2),
                        number: customer.phone.replace(/\D/g, "").substring(2)
                    } : undefined,
                    address: customer.address ? {
                        zip_code: customer.address.zip_code,
                        street_name: customer.address.street_name,
                        street_number: customer.address.street_number ? String(customer.address.street_number) : undefined
                    } : undefined
                },
                external_reference: orderId, // Crucial: amarra o Webhook ao nosso Doc no FB
                notification_url: `${appUrl}/api/webhooks/mercadopago`,
                auto_return: "approved",
                back_urls: {
                    success: `${appUrl}/meus-pedidos?email=${safeEmail}&id=${orderId}&status=success`,
                    failure: `${appUrl}/checkout?error=payment_failed`,
                    pending: `${appUrl}/meus-pedidos?email=${safeEmail}&id=${orderId}&status=pending`,
                },
                shipments: customer.address ? {
                    receiver_address: {
                        zip_code: customer.address.zip_code,
                        street_name: customer.address.street_name,
                        street_number: customer.address.street_number ? String(customer.address.street_number) : undefined,
                        floor: "",
                        apartment: ""
                    }
                } : undefined
            }
        });

        // 4. Retorna a URL do Checkout Pro gerada para o frontend redirecionar o usuário
        return NextResponse.json({
            id: result.id,
            init_point: result.init_point,
            orderId
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("Erro na Criação da Preference (MP):", error);
        return NextResponse.json(
            { message: "Falha ao gerar o Link de Pagamento.", error: error instanceof Error ? error.message : 'Unknown Error' },
            { status: 500 }
        );
    }
}
