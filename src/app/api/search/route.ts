import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/productServiceServer";
import { z } from "zod";

/**
 * HOOKE — /api/search (Fase 3: Sanitização)
 * 
 * Camada de validação e sanitização via Zod antes de qualquer lógica de negócio.
 * Previne injeção de scripts e queries malformadas.
 */

// Schema de validação da query de busca
const SearchQuerySchema = z.object({
  q: z
    .string()
    .min(2, "Query muito curta")
    .max(100, "Query muito longa")
    .transform((val) =>
      // Sanitização: remove tags HTML e caracteres perigosos
      val
        .replace(/<[^>]*>/g, "")           // remove tags HTML
        .replace(/[<>"'`]/g, "")           // remove chars de injection
        .replace(/javascript:/gi, "")      // remove protocolo JS
        .toLowerCase()
        .trim()
    ),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("q") ?? "";

  // Validação e sanitização via Zod
  const parsed = SearchQuerySchema.safeParse({ q: rawQuery });
  if (!parsed.success) {
    return NextResponse.json(
      { results: [], total: 0, error: "Query inválida" },
      { status: 400 }
    );
  }

  const query = parsed.data.q;

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
    return NextResponse.json(
      { results: [], total: 0, error: "Falha na busca" },
      { status: 500 }
    );
  }
}
