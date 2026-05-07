import { NextResponse } from "next/server";
import { TinyClient } from "@/lib/tiny/client";

export async function POST(request: Request) {
  try {
    const product = await request.json();

    // 1. Validar SKU base
    const baseSku = product.id; // No hooke-store, o slug/id é a base
    
    // 2. Orquestrar criação no Tiny
    // Nota: O Tiny recomenda criar o produto pai e depois as variações, 
    // ou enviar tudo em uma estrutura específica.
    
    const tinyResponse = await TinyClient.createProduct({
        codigo: baseSku,
        nome: product.name,
        preco: product.price,
        preco_promocional: product.comboPrice,
        unidade: 'UN',
        tipo: 'P',
        situacao: product.isActive ? 'A' : 'I',
        descricao_complementar: product.description,
        categoria: product.category,
        // Enviar imagens se houver
        anexos: product.images?.map((url: string) => ({ url })) || []
    });

    // 3. Se houver variações (Cores/Tamanhos), o Tiny pode exigir chamadas extras 
    // ou processamento de grade. Para a Hooke, cada par Cor-Tamanho tem seu SKU.
    
    if (product.skus) {
        for (const sku of Object.values(product.skus)) {
            // Logica para criar variação no Tiny se necessário
            console.log(`Sincronizando SKU de variação: ${sku}`);
        }
    }

    if (tinyResponse.retorno.status === 'Erro') {
        throw new Error(tinyResponse.retorno.erros[0].erro);
    }

    return NextResponse.json({
      success: true,
      tinyId: tinyResponse.retorno.registros?.[0]?.registro?.id,
    });

  } catch (error) {
    const err = error as Error;
    console.error("Admin -> Tiny Sync Error:", error);
    return NextResponse.json(
      { error: err.message || "Erro na sincronização" }, 
      { status: 500 }
    );
  }
}
