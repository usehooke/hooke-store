"use server";

/**
 * HOOKE FINTECH: Mercado Pago PIX Engine
 * Gera pagamentos dinâmicos para o Balcão/PDV.
 */
export async function generatePixPayment(amount: number, description: string) {
  const accessToken = process.env.MP_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error("❌ [Hooke Payments] Erro: MP_ACCESS_TOKEN não configurado.");
    throw new Error("Serviço de pagamento indisponível (Token ausente).");
  }

  try {
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": `hooke-pdv-${Date.now()}`
      },
      body: JSON.stringify({
        transaction_amount: amount,
        description: description,
        payment_method_id: "pix",
        payer: {
          email: "hooke.pdv@gmail.com",
          first_name: "Cliente",
          last_name: "Hooke HQ"
        },
        notification_url: "https://www.usehooke.com.br/api/webhooks/mercadopago"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ [Mercado Pago API Error]:", errorData);
      throw new Error(errorData.message || "Falha na comunicação com o Mercado Pago.");
    }

    const data = await response.json();

    return {
      qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64,
      qr_code: data.point_of_interaction.transaction_data.qr_code,
      payment_id: data.id
    };
  } catch (error: any) {
    console.error("❌ [Hooke Payments] Falha crítica:", error.message);
    throw error;
  }
}
