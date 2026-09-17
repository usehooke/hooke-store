import { NextResponse } from "next/server";
import { generateMarketingIntelligence } from "@/lib/marketing/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const report = generateMarketingIntelligence();
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("[Marketing API Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao compilar inteligência de marketing" },
      { status: 500 }
    );
  }
}
