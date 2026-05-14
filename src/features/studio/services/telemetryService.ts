import { z } from "zod";
import { set, get, update } from "idb-keyval";

// 🛡️ HOOKE HQ: TELEMETRY SCHEMA
export const TraceRecordSchema = z.object({
  traceId: z.string().uuid(),
  prompt: z.string(),
  aiReasoning: z.string().optional(),
  humanFeedback: z.string().optional(),
  status: z.enum(["ai_rejected", "human_rejected", "approved"]),
  score: z.number().optional(),
  timestamp: z.number(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type TraceRecord = z.infer<typeof TraceRecordSchema>;

const TRACES_KEY = "hooke_studio_traces";

/**
 * SERVIÇO DE TELEMETRIA (OFFLINE-FIRST)
 * Gerencia o ciclo de vida dos rastros de IA e feedback humano via IndexedDB.
 */
export const TelemetryService = {
  /**
   * Salva um novo rastro de operação da IA.
   */
  async saveTrace(record: Omit<TraceRecord, "timestamp">) {
    const fullRecord: TraceRecord = {
      ...record,
      timestamp: Date.now(),
    };

    try {
      const validated = TraceRecordSchema.parse(fullRecord);
      const existingTraces = (await get<TraceRecord[]>(TRACES_KEY)) || [];
      await set(TRACES_KEY, [...existingTraces, validated]);
      console.log(`[TELEMETRY] Trace ${validated.traceId} salvo.`);
      return validated;
    } catch (error) {
      console.error("[TELEMETRY] Erro ao salvar rastro:", error);
      throw error;
    }
  },

  /**
   * Adiciona feedback humano a um rastro existente.
   */
  async addHumanFeedback(traceId: string, feedback: string) {
    try {
      const existingTraces = (await get<TraceRecord[]>(TRACES_KEY)) || [];
      const updatedTraces = existingTraces.map((t) =>
        t.traceId === traceId
          ? { ...t, humanFeedback: feedback, status: "human_rejected" as const }
          : t
      );
      await set(TRACES_KEY, updatedTraces);
      console.log(`[TELEMETRY] Feedback humano adicionado ao rastro ${traceId}.`);
    } catch (error) {
      console.error("[TELEMETRY] Erro ao adicionar feedback:", error);
    }
  },

  /**
   * Recupera todos os rastros armazenados.
   */
  async getAllTraces(): Promise<TraceRecord[]> {
    return (await get<TraceRecord[]>(TRACES_KEY)) || [];
  },

  /**
   * Limpa os rastros (útil após handoff).
   */
  async clearTraces() {
    await set(TRACES_KEY, []);
  }
};
