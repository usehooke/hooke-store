import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { generateSKU, ModelSigla, PrintSigla, ColorSigla } from "@/utils/sku-generator";
import { TinyClient } from "@/lib/tiny/client";

function inferAttributes(productName: string, category: string) {
  const nameExt = productName.toLowerCase();
  
  // Model inference
  let model: ModelSigla = "TSH"; // Default Tradicional
  if (category === "Oversized" || nameExt.includes("oversized")) model = "OVE";
  if (category === "Regatas" || nameExt.includes("regata")) model = "MAC";
  
  // Color inference
  let color: ColorSigla = "PRE"; // Default Black
  if (nameExt.includes("verde") || nameExt.includes("militar")) color = "VER";
  if (nameExt.includes("off") || nameExt.includes("off-white") || nameExt.includes("offwhite")) color = "OFF";
  if (nameExt.includes("marrom") || nameExt.includes("coffee")) color = "MAR";
  if (nameExt.includes("vermelh") || nameExt.includes("red")) color = "VMH";
  if (nameExt.includes("bordo") || nameExt.includes("bordô")) color = "BOR";
  if (nameExt.includes("areia") || nameExt.includes("sand") || nameExt.includes("bege")) color = "ARE";

  // Print (Estampa) inference
  let print: PrintSigla = "HK1"; // Default Logo Hooke
  if (nameExt.includes("fusca") || nameExt.includes("beetle")) print = "FSK";
  if (nameExt.includes("maverick")) print = "MAV";
  if (nameExt.includes("canelad")) print = "CAN";

  return { model, color, print };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const confirm = searchParams.get("confirm");

  if (confirm !== "true") {
    return NextResponse.json({ 
      message: "Safety Check: This script will create hundreds of SKUs in Tiny ERP.",
      instructions: "Pass ?confirm=true in the URL to execute."
    }, { status: 400 });
  }

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    if (product.id.includes("kit")) continue; // Pulamos kits para gerar só as unitárias

    const attrs = inferAttributes(product.name, product.category || "");
    
    for (const size of product.sizes) {
      const sku = generateSKU({
        model: attrs.model,
        print: attrs.print,
        color: attrs.color,
        size: size
      });

      const payload = {
        sequencia: "1",
        codigo: sku,
        nome: `${product.name} - Tamanho ${size}`,
        unidade: "UN",
        preco: product.price,
        origem: "0",
        situacao: "A",
        tipo: "P",
        gtin: sku, // Barcode principal para a bipagem na expedição
      };

      try {
        // Para evitar rate limiting brutal do Tiny API (geralmente suporta ~3 req/s)
        await new Promise(resolve => setTimeout(resolve, 350));
        
        const response = await TinyClient.createProduct(payload);
        
        if (response.retorno?.status === "Erro") {
            results.push({ sku, status: "error", error: response.retorno.erros?.[0]?.erro });
            errorCount++;
        } else {
            results.push({ sku, status: "success" });
            successCount++;
        }
      } catch (e: unknown) {
        results.push({ sku, status: "exception", error: e instanceof Error ? e.message : "Unknown error" });
        errorCount++;
      }
    }
  }

  return NextResponse.json({
    message: "Tiny ERP Barcode & SKU Sync Finished.",
    report: { successCount, errorCount },
    details: results
  });
}
