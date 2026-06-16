import { NextResponse } from "next/server";
import { calcularPrecoPrazo } from "correios-brasil";
import { get } from "@vercel/edge-config";
import { TinyClient } from "../../../lib/tiny/client";
import { ShippingRequestSchema } from "@/lib/schemas";

// Função para simular fallback funcional dinâmico
async function getFallbackShipping(cepDestino: string, pesoFinal: string): Promise<{ nome: string; valor: string; prazo: string }[]> {
    const isSP = cepDestino.startsWith("0") || cepDestino.startsWith("1");
    
    // Extrai o peso numérico
    const pesoNum = parseFloat(pesoFinal) || 0.3;
    
    // Regra: Para SP Base PAC é 18.90, Resto 34.50 (Até 1kg). Acima de 1kg adiciona valor por kg extra.
    const kgsExtras = Math.max(0, pesoNum - 1);
    const extraPAC = isSP ? (kgsExtras * 6.5) : (kgsExtras * 12.0);
    const extraSedex = isSP ? (kgsExtras * 9.5) : (kgsExtras * 18.0);
    
    const valorPAC = (isSP ? 18.90 + extraPAC : 34.50 + extraPAC).toFixed(2);
    const prazoPAC = isSP ? "3" : "8";
    
    const valorSedex = (isSP ? 24.90 + extraSedex : 68.50 + extraSedex).toFixed(2);
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
            // 2. CORREIOS COM TIMEOUT RÁPIDO DE 1.8 SEGUNDOS (EVITA LENTIDÃO NO CHECKOUT)
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Timeout de 1.8 segundos nos Correios")), 1800)
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
            console.warn("Correios indisponíveis ou timeout, ativando contingência de frete regional:", correiosError.message);

            // 3. FALLBACK DE CONTINGÊNCIA REGIONAL DE ALTA DISPONIBILIDADE
            try {
                fretes = await getFallbackShipping(sCepDestino, pesoFinal);
            } catch (fallbackError) {
                console.error("Erro grave no fallback interno, entregando tarifas padrão de segurança:", fallbackError);
                // Garantia final: Tarifas padrão para não travar a venda
                const isSP = sCepDestino.startsWith("0") || sCepDestino.startsWith("1");
                fretes = [
                    { nome: "Jadlog Package (PAC)", valor: isSP ? "18.90" : "34.50", prazo: isSP ? "3" : "8" },
                    { nome: "Jadlog .Com (SEDEX)", valor: isSP ? "24.90" : "68.50", prazo: isSP ? "1" : "4" }
                ];
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
