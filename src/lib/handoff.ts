import { TelemetryService } from "@/features/studio/services/telemetryService";

/**
 * HOOKE SYSTEM: HANDOFF GENERATOR
 * Cria relatórios de telemetria dos experimentos de estúdio da IA
 * e permite que o time faça o download do JSON estruturado para auditorias.
 */
export const HandoffGenerator = {
  async downloadReport() {
    try {
      const traces = await TelemetryService.getAllTraces();
      const report = {
        brand: "Hooke Store",
        subsystem: "Studio Orchestrator",
        generatedAt: new Date().toISOString(),
        summary: {
          totalTraces: traces.length,
          approved: traces.filter((t) => t.status === "approved").length,
          aiRejected: traces.filter((t) => t.status === "ai_rejected").length,
          humanRejected: traces.filter((t) => t.status === "human_rejected").length,
        },
        traces,
      };

      const jsonString = JSON.stringify(report, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `hooke_studio_handoff_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log("[HANDOFF] Relatório de telemetria baixado com sucesso.");
    } catch (error) {
      console.error("[HANDOFF] Erro crítico ao exportar telemetria:", error);
    }
  },
};
