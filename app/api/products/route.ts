import { NextResponse } from "next/server";
export const runtime = 'edge';
import { products } from "@/data/products";

export async function GET() {
  try {
    // Simulando um pequeno delay para testar estados de loading
    // await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
