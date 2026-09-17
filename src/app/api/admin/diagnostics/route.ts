import { NextRequest, NextResponse } from "next/server";
import { runFullDiagnostic, getDiagnosticHistory } from "@/lib/diagnostics/engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const history = searchParams.get("history") === "true";

    if (history) {
      const pastReports = await getDiagnosticHistory(10);
      return NextResponse.json({ success: true, history: pastReports });
    }

    const report = await runFullDiagnostic();
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("[Diagnostics API Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Falha ao executar ciclo de diagnóstico" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const report = await runFullDiagnostic();
    return NextResponse.json({
      success: true,
      message: "Ciclo de diagnóstico contínuo executado e registrado com sucesso.",
      report,
    });
  } catch (error: any) {
    console.error("[Diagnostics Run Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro durante o disparo do diagnóstico" },
      { status: 500 }
    );
  }
}
