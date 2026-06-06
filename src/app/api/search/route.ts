import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/productServiceServer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    const allProducts = await getProducts();

    const results = allProducts.filter((p) => {
      const haystack = [
        p.name,
        p.description,
        p.category,
        p.department,
        ...(p.sizes || []),
      ]
        .join(" ")
        .toLowerCase();

      return query.split(" ").every((word) => haystack.includes(word));
    });

    return NextResponse.json({
      results: results.slice(0, 20),
      total: results.length,
    });
  } catch {
    return NextResponse.json({ results: [], total: 0, error: "Falha na busca" }, { status: 500 });
  }
}
