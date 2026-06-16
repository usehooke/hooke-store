/**
 * HOOKE SYSTEM: BREVO CRM CONNECTOR
 * Integração robusta com a API v3 da Brevo.
 * Conta com fallback silencioso para logs locais caso a chave de API esteja ausente.
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = "https://api.brevo.com/v3/contacts";

interface BrevoContactPayload {
  email: string;
  attributes?: {
    FNAME?: string;
    SMS?: string;
    [key: string]: any;
  };
  listIds?: number[];
  updateEnabled?: boolean;
}

export async function addContactToBrevo(
  email: string,
  phone?: string,
  name?: string,
  listIds: number[] = [2] // Lista padrão (Newsletter ou geral)
): Promise<{ success: boolean; message: string; data?: any }> {
  // Limpar telefone para formato internacional e-164 (Ex: +5511975902528)
  let formattedPhone = "";
  if (phone) {
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length > 0) {
      // Se não começa com 55 e tem DDD padrão brasileiro, adiciona 55
      formattedPhone = digitsOnly.startsWith("55") ? `+${digitsOnly}` : `+55${digitsOnly}`;
    }
  }

  // Prepara payload de acordo com a API v3 do Brevo
  const attributes: Record<string, any> = {};
  if (name) {
    attributes.FNAME = name;
  }
  if (formattedPhone) {
    attributes.SMS = formattedPhone;
    attributes.WHATSAPP = formattedPhone; // Alguns painéis Brevo usam atributo customizado
  }

  const payload: BrevoContactPayload = {
    email: email.trim().toLowerCase(),
    attributes,
    listIds,
    updateEnabled: true
  };

  if (!BREVO_API_KEY || BREVO_API_KEY === "YOUR_API_V3_KEY" || BREVO_API_KEY.trim() === "") {
    console.warn("⚠️ [Brevo Integration] BREVO_API_KEY não configurada no .env.local. Simulando registro local de lead:");
    console.log("➡️ LEAD DRAFT:", JSON.stringify(payload, null, 2));
    return { 
      success: true, 
      message: "Modo Simulação: Lead registrado com sucesso no console do servidor." 
    };
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("🔥 [Brevo Integration] Falha ao enviar para Brevo:", data);
      return { 
        success: false, 
        message: data.message || "Erro retornado pela API do Brevo." 
      };
    }

    return { 
      success: true, 
      message: "Lead registrado na API do Brevo com sucesso.", 
      data 
    };
  } catch (error) {
    console.error("🔥 [Brevo Integration] Erro de rede ao conectar com Brevo:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido de rede." 
    };
  }
}
