import { TelemetryService, TraceRecord } from "@/features/studio/services/telemetryService";

/**
 * HOOKE HQ: HANDOFF GENERATOR (HALO PROTOCOL)
 * Consolida rastros de erro e feedback humano para otimização da IA.
 */
export const HandoffGenerator = {
  /**
   * Gera o arquivo Markdown de Handoff baseado nos dados locais.
   */
  async generateMarkdown(): Promise<string> {
    const traces = await TelemetryService.getAllTraces();
    const failures = traces.filter(t => t.status !== "approved");
    const successes = traces.filter(t => t.status === "approved");

    if (traces.length === 0) {
      return "# Hooke Studio: Nenhum rastro capturado nesta sessão.";
    }

    const timestamp = new Date().toLocaleString("pt-BR");

    let md = `# 🛡️ HOOKE HQ: AGENT HANDOFF (HALO PROTOCOL)\n`;
    md += `**Data do Relatório:** ${timestamp}\n`;
    md += `**Volume de Operações:** ${traces.length} | **Sucessos:** ${successes.length} | **Falhas/Rejeições:** ${failures.length}\n\n`;

    md += `## 🧠 RESUMO DE PERFORMANCE\n`;
    md += `- Taxa de Aprovação IA: ${((successes.length / traces.length) * 100).toFixed(1)}%\n`;
    md += `- Principais Modos de Falha: ${this.identifyFailureModes(failures)}\n\n`;

    md += `## 🚫 RASTROS DE REJEIÇÃO (TECHNICAL DEBT)\n`;
    
    failures.forEach((trace, index) => {
      md += `### [${trace.status.toUpperCase()}] Rastro #${index + 1}\n`;
      md += `- **ID:** \`${trace.traceId}\`\n`;
      md += `- **Prompt:** \`${trace.prompt}\`\n`;
      md += `- **Motivo IA:** ${trace.aiReasoning || "N/A"}\n`;
      md += `- **Feedback Humano:** ${trace.humanFeedback || "Sem feedback adicional"}\n`;
      md += `- **Score IA:** ${trace.score || "N/A"}/10\n`;
      md += `--- \n\n`;
    });

    md += `\n## 🏁 DIRETRIZES DE OTIMIZAÇÃO (PARA ANTIGRAVITY)\n`;
    md += `> Agente, utilize os rastros acima para calibrar o auditor em \`evaluateMagicStudioImage.ts\` e as regras de ouro em \`campaignDirector.ts\`. Foco em eliminar os modos de falha recorrentes identificados.\n`;

    return md;
  },

  /**
   * Identifica padrões de erro nos rastros.
   */
  identifyFailureModes(failures: TraceRecord[]): string {
    if (failures.length === 0) return "Nenhum detectado.";
    
    const words = failures.map(f => `${f.aiReasoning} ${f.humanFeedback}`).join(" ").toLowerCase();
    const modes = [];
    
    if (words.includes("etiqueta") || words.includes("woven") || words.includes("silk")) {
      modes.push("Integridade da Etiqueta Woven");
    }
    if (words.includes("rosto") || words.includes("fernando") || words.includes("fidelidade")) {
      modes.push("Fidelidade Facial");
    }
    if (words.includes("brutalism") || words.includes("estética")) {
      modes.push("Conformidade Estética");
    }

    return modes.length > 0 ? modes.join(", ") : "Falhas variadas sem padrão claro.";
  },

  /**
   * Aciona o download do relatório para o usuário.
   */
  async downloadReport() {
    const markdown = await this.generateMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hooke_handoff_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
