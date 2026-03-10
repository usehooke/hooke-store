import { NextResponse } from "next/server";
import { products } from "@/data/products";

export async function GET() {
  try {
    // Simulando um pequeno delay para testar estados de loading
    // await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
