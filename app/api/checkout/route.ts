import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { client } from "@/lib/mercadopago";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order, OrderCustomer, OrderItem } from "@/types/order";

export const dynamic = 'force-dynamic';

// Minimal in-memory cache for simple idempotency to protect against network bounces
const idempotencyCache = new Map<string, number>();

// Helper to clean up old cache entries (older than 15 seconds)
function cleanIdempotencyCache() {
  const now = Date.now();
  for (const [key, timestamp] of idempotencyCache.entries()) {
    if (now - timestamp > 15000) {
      idempotencyCache.delete(key);
    }
  }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customer, shippingValue, shippingMethod, shippingZipcode, discountValue, couponCode } = body as {
            items: OrderItem[];
            customer: OrderCustomer;
            shippingValue?: number;
            shippingMethod?: string;
            shippingZipcode?: string;
            discountValue?: number;
            couponCode?: string;
        };

        if (!items || items.length === 0) {
            return NextResponse.json({ message: "Carrinho está vazio." }, { status: 400 });
        }

        if (!customer || !customer.name || !customer.phone) {
            return NextResponse.json({ message: "Dados do cliente incompletos (nome e telefone são obrigatórios)." }, { status: 400 });
        }

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
        // Uma abordagem segura e leve para gerar IDs parecidos com chaves (ex: hooke-1708940...)
        const orderId = `hooke-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const subtotal = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
        const totalAmount = subtotal + (shippingValue || 0) - (discountValue || 0);

        // 2. Prepara o Documento Inicial (Pending) no Firestore
        // ⚡ A TRAVA DO TECH LEAD: Se o banco estiver offline (Build/No Keys), abortamos.
        if (!db) {
            console.error("❌ [Hooke System] Checkout abortado: Servidor sem conexão com Firestore.");
            return NextResponse.json({ 
                error: "[Hooke System] Service Unavailable", 
                message: "Não foi possível persistir o pedido. Banco de dados offline." 
            }, { status: 503 });
        }

        const orderData: Order = {
            id: orderId,
            customer,
            items,
            totalAmount,
            status: "pending",
            shippingValue: shippingValue || 0,
            shippingMethod: shippingMethod || "",
            shippingZipcode: shippingZipcode || "",
            discountValue: discountValue || 0,
            couponCode: couponCode || "",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        await setDoc(doc(db, "pedidos", orderId), orderData);

        // 3. Monta o Payload para a Preference do Mercado Pago
        // Essa URLBase ajuda no redirecionamento local ou de prod
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        // MP não aceita itens negativos facilmente. Aplicar desconto sobre o unit_price proporcionalmente.
        const discountMultiplier = discountValue ? (1 - (discountValue / subtotal)) : 1;

        const mpItems = items.map((i) => ({
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
                    phone: {
                        area_code: customer.phone.substring(0, 2),
                        number: customer.phone.substring(2)
                    }
                },
                external_reference: orderId, // Crucial: amarra o Webhook ao nosso Doc no FB
                auto_return: "approved",
                back_urls: {
                    success: `${appUrl}/meus-pedidos?email=${safeEmail}&id=${orderId}&status=success`,
                    failure: `${appUrl}/checkout?error=payment_failed`,
                    pending: `${appUrl}/meus-pedidos?email=${safeEmail}&id=${orderId}&status=pending`,
                },
                // Caso a loja tenha frete, o shipements entra aqui.
                // No momento assumiremos setup básico (ou grátis/fora do sistema MP) como acordado.
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
