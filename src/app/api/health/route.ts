import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  // 🛡️ Trava de segurança: só roda em ambiente de desenvolvimento local
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 1. Teste do Firebase Admin / Firestore
  let firebaseStatus: "OK" | "ERROR" = "OK";
  let firebaseMessage = "Conexão com Firestore Admin estabelecida com sucesso.";
  try {
    if (!adminDb) {
      throw new Error(
        "SDK do Firebase Admin não inicializado. Verifique a variável FIREBASE_SERVICE_ACCOUNT_KEY."
      );
    }
    // Tenta ler 1 produto inofensivo para validar credenciais
    await adminDb.collection("products").limit(1).get();
  } catch (error: any) {
    firebaseStatus = "ERROR";
    firebaseMessage = error?.message || "Falha na validação do Firestore Admin.";
  }

  // 2. Teste do Mercado Pago API
  let mpStatus: "OK" | "ERROR" = "OK";
  let mpMessage = "Chave de acesso do Mercado Pago válida.";
  const mpToken = process.env.MP_ACCESS_TOKEN;
  if (!mpToken) {
    mpStatus = "ERROR";
    mpMessage = "Variável MP_ACCESS_TOKEN ausente nas configurações de ambiente.";
  } else {
    try {
      const res = await fetch("https://api.mercadopago.com/v1/payment_methods", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${mpToken}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || `API do Mercado Pago retornou erro com status ${res.status}`
        );
      }
    } catch (error: any) {
      mpStatus = "ERROR";
      mpMessage = error?.message || "Falha de autenticação ou rede com Mercado Pago.";
    }
  }

  // 3. Teste da API do Brevo CRM
  let brevoStatus: "OK" | "ERROR" = "OK";
  let brevoMessage = "API Key do Brevo validada com sucesso.";
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    brevoStatus = "ERROR";
    brevoMessage = "Variável BREVO_API_KEY ausente nas configurações de ambiente.";
  } else {
    try {
      const res = await fetch("https://api.brevo.com/v3/account", {
        method: "GET",
        headers: {
          "api-key": brevoKey,
          accept: "application/json",
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || `API do Brevo retornou erro com status ${res.status}`
        );
      }
    } catch (error: any) {
      brevoStatus = "ERROR";
      brevoMessage = error?.message || "Falha de autenticação ou rede com Brevo CRM.";
    }
  }

  // Consolidação de status
  const reports = [
    { service: "Firebase Admin", status: firebaseStatus, message: firebaseMessage },
    { service: "Mercado Pago", status: mpStatus, message: mpMessage },
    { service: "Brevo", status: brevoStatus, message: brevoMessage },
  ];

  // Se houver algum erro, retornamos 200 com os detalhes descritos (ou 207 Multi-Status)
  return NextResponse.json(reports);
}
