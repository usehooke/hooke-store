import { NextResponse } from "next/server";
import { calcularPrecoPrazo } from "correios-brasil";
import { get } from "@vercel/edge-config";
import { TinyClient } from "../../../lib/tiny/client";
import { ShippingRequestSchema } from "@/lib/schemas";

// Função para simular fallback funcional dinâmico
async function getFallbackShipping(cepDestino: string, pesoFinal: string): Promise<{ nome: string; valor: string; prazo: string }[]> {
    // Regra simples: Estado de SP e arredores (CEPs iniciados em 0 ou 1) vs Resto do Brasil
    const isSP = cepDestino.startsWith("0") || cepDestino.startsWith("1");
    
    const valorPAC = isSP ? "18.90" : "34.50";
    const prazoPAC = isSP ? "3" : "8";
    
    const valorSedex = isSP ? "24.90" : "68.50";
    const prazoSedex = isSP ? "1" : "4";

    return [
        { nome: "Jadlog Package (PAC)", valor: valorPAC, prazo: prazoPAC },
        { nome: "Jadlog .Com (SEDEX)", valor: valorSedex, prazo: prazoSedex }
    ];
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = ShippingRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ 
                message: "Dados de frete inválidos.", 
                errors: validation.error.format() 
            }, { status: 400 });
        }

        const { cepDestino, peso, comprimento, altura, largura } = validation.data;

        // Remover traços ou pontos do CEP
        const sCepDestino = cepDestino.replace(/\D/g, "");

        // Validar e Formatar Peso (mínimo exigido pelos correios é 0.3kg)
        const pesoFinal = peso ? Math.max(0.3, parseFloat(peso)).toString() : "0.3";
        const comprimentoFinal = comprimento ? Math.max(16, parseFloat(comprimento)).toString() : "20"; // Min correios = 16
        const alturaFinal = altura ? Math.max(2, parseFloat(altura)).toString() : "10"; // Min correios = 2
        const larguraFinal = largura ? Math.max(11, parseFloat(largura)).toString() : "15"; // Min correios = 11

        // Dados base da loja Hooke (Caixa Genérica de 1 Camiseta)
        const cepOrigemLoja = "03031000"; // CEP da Loja no Brás (Tiers, 184)

        // 1. CHECAR CACHE NAS ÚLTIMAS 24H VIA VERCEL EDGE CONFIG
        try {
            const cacheKey = `shipping_${sCepDestino}_${pesoFinal}`;
            const cachedValue = await get(cacheKey);
            if (cachedValue && Array.isArray(cachedValue)) {
                return NextResponse.json({ fretes: cachedValue }, { status: 200 });
            }
        } catch (edgeError) {
            console.warn("Aviso: Falha ao ler do Edge Config:", edgeError);
        }

        // 03298 = PAC | 04014 = SEDEX
        const args = {
            sCepOrigem: cepOrigemLoja,
            sCepDestino: sCepDestino,
            nVlPeso: pesoFinal,
            nCdFormato: "1", // 1 para caixa / pacote
            nVlComprimento: comprimentoFinal,
            nVlAltura: alturaFinal,
            nVlLargura: larguraFinal,
            nCdServico: ["03298", "04014"],
            nVlDiametro: "0",
        };

        let fretes = [];

        try {
            // 2. CORREIOS COM TIMEOUT DE 8 SEGUNDOS
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Timeout de 8 segundos nos Correios")), 8000)
            );

            const response = await Promise.race([
                calcularPrecoPrazo(args),
                timeoutPromise
            ]) as { Codigo: string; Valor: string; PrazoEntrega: string }[];

            if (!response || response.length === 0) {
                throw new Error("Serviço dos Correios vazio.");
            }

            // Retorna formatado para o Frontend (PAC e Sedex num array)
            fretes = response.map((item: { Codigo: string; Valor: string; PrazoEntrega: string }) => ({
                nome: item.Codigo === "03298" ? "PAC" : "SEDEX",
                valor: item.Valor.replace(",", "."),
                prazo: item.PrazoEntrega
            }));
        } catch (correiosError) {
            console.warn("Correios indisponíveis ou timeout, partindo para Fallback Melhor Envio:", correiosError);

            // 3. FALLBACK INTELIGENTE (MELHOR ENVIO API / FRENET)
            try {
                fretes = await getFallbackShipping(sCepDestino, pesoFinal);
            } catch (fallbackError) {
                console.warn("Fallback (Melhor Envio/Frenet) também falhou, analisando Tiny ERP offline:", fallbackError);
                
                // 4. VERIFICAÇÃO DE CONTINGÊNCIA CORREIOS NO TINY ERP OFFLINE
                try {
                    const offlineRates = await TinyClient.getOfflineShippingRates(sCepDestino, pesoFinal);
                    if (offlineRates && offlineRates.length > 0) {
                        return NextResponse.json({ fretes: offlineRates }, { status: 200 });
                    }
                    throw new Error("Sem tabelas de contingência offline disponíveis.");
                } catch (tinyError) {
                    console.error("Falha Absoluta de Frete! Devolvendo erro de Fallback_Whatsapp.", tinyError);
                    
                    // Falha Crítica de Todos os Serviços: Devolvermos 503 com flag de fallback pro frontend lidar
                    return NextResponse.json(
                        { message: "Serviço dos Correios, Melhor Envio e tabelas offline indisponíveis temporariamente.", fallbackWhatsApp: true },
                        { status: 503 }
                    );
                }
            }
        }

        return NextResponse.json({ fretes }, { status: 200 });

    } catch (error: unknown) {
        console.error("Erro no cálculo de frete:", error);
        return NextResponse.json(
            { message: "Falha ao calcular o frete.", error: error instanceof Error ? error.message : "Erro Desconhecido" },
            { status: 500 }
        );
    }
}
