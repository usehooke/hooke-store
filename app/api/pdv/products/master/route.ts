import { NextResponse } from "next/server";
import { TinyClient } from "@/lib/tiny/client";
import { getMarketplaceMapping, ModelSigla } from "@/utils/sku-generator";

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const mapping = getMarketplaceMapping(productData.model as ModelSigla);

    // 1. Cadastrar no Tiny ERP
    const tinyResponse = await TinyClient.createProduct({
        codigo: productData.sku,
        nome: productData.name,
        preco: productData.price,
        origem: '0',
        unidade: 'UN',
        tipo: 'P',
        peso_bruto: productData.weight,
        largura: productData.width,
        altura: productData.height,
        comprimento: productData.length,
    });

    // 2. Mock Shopee Integration com mapeamento sugerido
    console.log(`Integrando com Shopee na categoria: ${mapping?.shopeeCategory || 'T-shirt Masculina'}`);
    
    // 3. Mock TikTok Shop Integration
    console.log(`Integrando com TikTok Shop na categoria: ${mapping?.tiktokCategory || 'T-shirt Masculina'}`);

    return NextResponse.json({
      success: true,
      tiny: tinyResponse,
      mappingSuggested: mapping,
      platforms: ["Tiny", "Shopee", "TikTok Shop"],
    });
  } catch (error) {
    console.error("Master Registration Error:", error);
    return NextResponse.json({ error: "Erro no cadastro mestre" }, { status: 500 });
  }
}
