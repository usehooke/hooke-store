"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Zap, 
  Users, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Sparkles,
  Lock,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DiagnosticReport, DiagnosticAlert, AlertPriority } from "@/lib/diagnostics/engine";

export default function DiagnosticsDashboardPage() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterLevel, setFilterLevel] = useState<AlertPriority | "todos">("todos");

  const fetchDiagnostics = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/diagnostics", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
        if (isManual) {
          toast.success("Diagnóstico em tempo real concluído com sucesso.", {
            style: { borderRadius: 0, background: "#111827", color: "#fff", border: "none" },
          });
        }
      } else {
        throw new Error(data.error || "Falha na resposta do diagnóstico");
      }
    } catch (err: any) {
      toast.error(`Erro ao atualizar diagnóstico: ${err?.message || "Serviço indisponível"}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDiagnostics();
    // Polling contínuo automático a cada 60 segundos
    const interval = setInterval(() => {
      fetchDiagnostics(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchDiagnostics]);

  if (loading && !report) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Executando crawlers sintéticos e compilando KPIs...
        </p>
      </div>
    );
  }

  const kpis = report?.kpis;
  const filteredAlerts = report?.alerts.filter(
    (a) => filterLevel === "todos" || a.level === filterLevel
  ) || [];

  const healthScore = report?.overallHealthScore ?? 100;
  const healthColor =
    healthScore >= 85
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : healthScore >= 70
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-red-600 bg-red-50 border-red-200";

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* ─── Top Bar: Cockpit Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-serif italic tracking-tight text-zinc-900">
              Diagnóstico Contínuo
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800">
                Radar Ativo 24/7
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-1 tracking-wide font-sans">
            Monitoramento sintético de Core Web Vitals, detecção preditiva de anomalias e integridade de conversão.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 border flex items-center gap-2 ${healthColor}`}>
            <Activity size={16} />
            <span className="text-xs font-black tracking-widest uppercase">
              Saúde Global: {healthScore}/100
            </span>
          </div>

          <Button
            variant="buy"
            size="sm"
            onClick={() => fetchDiagnostics(true)}
            disabled={refreshing}
            className="gap-2 tracking-widest text-[10px]"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Auditando..." : "Auditar Agora"}
          </Button>
        </div>
      </div>

      {/* ─── Grid de KPIs em Tempo Real ────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Métricas de Conversão & Negócio (Últimas 24 Horas)
          </span>
          <span className="text-[9px] font-mono text-zinc-400">
            Atualizado: {report ? new Date(report.timestamp).toLocaleTimeString("pt-BR") : "--"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Taxa de Conversão */}
          <Card variant="brutalist">
            <CardHeader className="pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-zinc-400 text-xs uppercase">Conversão (CVR)</CardTitle>
                <TrendingUp size={16} className="text-zinc-400" />
              </div>
              <CardDescription>Sessões x Pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tighter text-zinc-900">
                  {kpis?.conversionRate}%
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800">
                  Meta: &gt; 1.8%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Abandono de Carrinho */}
          <Card variant="brutalist">
            <CardHeader className="pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-zinc-400 text-xs uppercase">Abandono de Carrinho</CardTitle>
                <ShoppingBag size={16} className="text-zinc-400" />
              </div>
              <CardDescription>Drafts vs Finalizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className={`text-3xl font-black tracking-tighter ${
                  (kpis?.cartAbandonmentRate ?? 0) > 60 ? "text-amber-600" : "text-zinc-900"
                }`}>
                  {kpis?.cartAbandonmentRate}%
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-zinc-100 text-zinc-700">
                  Threshold: &lt; 60%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Médio */}
          <Card variant="brutalist">
            <CardHeader className="pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-zinc-400 text-xs uppercase">Ticket Médio (AOV)</CardTitle>
                <Zap size={16} className="text-zinc-400" />
              </div>
              <CardDescription>Média por Pedido Pago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tighter text-zinc-900">
                  R$ {kpis?.averageOrderValue}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800">
                  {kpis?.ordersCount24h} vendas
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Latência / Core Web Vitals */}
          <Card variant="brutalist">
            <CardHeader className="pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-zinc-400 text-xs uppercase">Latência Média (LCP)</CardTitle>
                <Clock size={16} className="text-zinc-400" />
              </div>
              <CardDescription>Crawler Sintético</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tighter text-zinc-900">
                  {kpis?.avgLcpLatencyMs}ms
                </span>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 ${
                  (kpis?.avgLcpLatencyMs ?? 0) < 2000
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  Google &lt; 2.5s
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Linha secundária de KPIs: CAC, LTV, LTV/CAC e Receita */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-white border border-black/[0.06] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">CAC Estimado</span>
            <span className="text-xl font-black text-zinc-800 mt-1">R$ {kpis?.cacEstimated?.toFixed(2)}</span>
            <span className="text-[8px] text-zinc-400 mt-0.5">Meta Ads Moda</span>
          </div>

          <div className="p-4 bg-white border border-black/[0.06] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">LTV Projetado</span>
            <span className="text-xl font-black text-zinc-800 mt-1">R$ {kpis?.ltvEstimated?.toFixed(2)}</span>
            <span className="text-[8px] text-zinc-400 mt-0.5">Ciclo 12 meses</span>
          </div>

          <div className="p-4 bg-white border border-black/[0.06] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Relação LTV / CAC</span>
            <span className="text-xl font-black text-emerald-700 mt-1">{kpis?.ltvCacRatio}x</span>
            <span className="text-[8px] text-zinc-400 mt-0.5">Benchmark: &gt; 3.0x</span>
          </div>

          <div className="p-4 bg-white border border-black/[0.06] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Receita 24h</span>
            <span className="text-xl font-black text-zinc-900 mt-1">R$ {kpis?.revenue24h?.toLocaleString("pt-BR")}</span>
            <span className="text-[8px] text-zinc-400 mt-0.5">Vendas finalizadas</span>
          </div>
        </div>
      </section>

      {/* ─── Monitor de Rotas e Uptime Sintético ────────────────────────────── */}
      <section className="space-y-3">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block">
          Radar Sintético de Rotas Vitais (End-to-End)
        </span>

        <div className="bg-white border border-black/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] bg-[#FAF9F7] text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  <th className="py-3 px-4">Rota / Aplicação</th>
                  <th className="py-3 px-4">Status HTTP</th>
                  <th className="py-3 px-4">Latência Total</th>
                  <th className="py-3 px-4">TTFB (Server)</th>
                  <th className="py-3 px-4">SSL &amp; HSTS</th>
                  <th className="py-3 px-4 text-right">Diagnóstico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-xs">
                {report?.routes.map((route, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/60 transition-colors font-mono">
                    <td className="py-3 px-4 font-sans font-bold text-zinc-900 flex items-center gap-2">
                      {route.ok ? (
                        <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle size={14} className="text-red-600 flex-shrink-0" />
                      )}
                      <span>{route.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono font-normal">({route.url})</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-black ${
                        route.status >= 200 && route.status < 400
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {route.status || "ERR"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-zinc-700">
                      <span className={route.latencyMs > 3000 ? "text-red-600 font-bold" : ""}>
                        {route.latencyMs} ms
                      </span>
                    </td>

                    <td className="py-3 px-4 text-zinc-500">
                      {route.ttfbMs} ms
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[8px] bg-zinc-50">
                          {route.sslSecure ? "HTTPS OK" : "SEM SSL"}
                        </Badge>
                        {route.headers.hsts && (
                          <Badge variant="outline" className="text-[8px] bg-emerald-50 text-emerald-700 border-emerald-200">
                            HSTS
                          </Badge>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-sans font-bold">
                      {route.ok ? (
                        <span className="text-[10px] text-emerald-700 uppercase tracking-wider">Operacional</span>
                      ) : (
                        <span className="text-[10px] text-red-600 uppercase tracking-wider">{route.error || "Degradado"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Painel de Alertas & Anomalias em Tempo Real ────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Alertas Ativos &amp; Detecção de Anomalias ({report?.alerts.length || 0})
            </span>
          </div>

          <div className="flex items-center gap-1">
            {(["todos", "critico", "moderado", "informativo"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider border transition-all ${
                  filterLevel === lvl
                    ? "bg-hooke-900 text-white border-hooke-900"
                    : "bg-white text-zinc-500 border-black/[0.08] hover:border-black"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 bg-white border border-black/[0.06] text-center">
              <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Nenhum alerta para o filtro selecionado
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const borderBadge =
                alert.level === "critico"
                  ? "border-l-4 border-l-red-600 bg-red-50/30"
                  : alert.level === "moderado"
                  ? "border-l-4 border-l-amber-500 bg-amber-50/30"
                  : "border-l-4 border-l-blue-500 bg-blue-50/20";

              return (
                <div
                  key={alert.id}
                  className={`p-5 bg-white border border-black/[0.08] ${borderBadge} flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ${
                        alert.level === "critico"
                          ? "bg-red-600 text-white"
                          : alert.level === "moderado"
                          ? "bg-amber-500 text-white"
                          : "bg-blue-600 text-white"
                      }`}>
                        {alert.level}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-900">
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        ({alert.metric})
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                      {alert.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                        Ação Recomendada:
                      </span>
                      <span className="text-[11px] font-bold text-zinc-800">
                        {alert.actionRecommendation}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 font-mono">
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Valor Atual / Limite</p>
                    <p className="text-sm font-black text-zinc-900">
                      {alert.currentValue} <span className="text-zinc-400 font-normal">/ {alert.threshold}</span>
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ─── Grid Duplo: Conformidade Regulatória & IA Preditiva ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matriz de Segurança e Conformidade */}
        <section className="bg-white border border-black/[0.08] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-zinc-900" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
              Conformidade &amp; Segurança Ativa
            </span>
          </div>

          <div className="divide-y divide-black/[0.06]">
            {report?.compliance.map((item, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[8px] uppercase">
                      {item.standard}
                    </Badge>
                    <span className="text-xs font-bold text-zinc-900">{item.item}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight">{item.details}</p>
                </div>

                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider flex-shrink-0 ${
                  item.status === "conforme"
                    ? "bg-emerald-100 text-emerald-800"
                    : item.status === "atencao"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recomendações Preditivas de IA */}
        <section className="bg-white border border-black/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
                Otimizações Preditivas por IA
              </span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
              Auto-Learning Hooke
            </span>
          </div>

          <div className="space-y-3">
            {report?.aiRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#FAF9F7] border border-black/[0.05] space-y-1 hover:border-black/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-black text-white">
                      {rec.area}
                    </span>
                    <span className="text-xs font-bold text-zinc-900">{rec.title}</span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-700 font-mono">
                    {rec.impactExpected}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                  {rec.action}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── Thresholds Configuráveis ────────────────────────────────────────── */}
      <section className="bg-[#FAF9F7] border border-black/[0.08] p-6">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-3">
          Parâmetros Globais de Gatilho de Alerta Imediato
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3 bg-white border border-black/[0.05]">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Latência Máx.</p>
            <p className="text-sm font-black text-zinc-900 font-mono mt-1">&gt; 3.0s</p>
          </div>

          <div className="p-3 bg-white border border-black/[0.05]">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Abandono Máx.</p>
            <p className="text-sm font-black text-zinc-900 font-mono mt-1">&gt; 60%</p>
          </div>

          <div className="p-3 bg-white border border-black/[0.05]">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Conversão Mín.</p>
            <p className="text-sm font-black text-zinc-900 font-mono mt-1">&lt; 1.8%</p>
          </div>

          <div className="p-3 bg-white border border-black/[0.05]">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Bounce Máx.</p>
            <p className="text-sm font-black text-zinc-900 font-mono mt-1">&gt; 60%</p>
          </div>

          <div className="p-3 bg-white border border-black/[0.05]">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">AOV Mínimo</p>
            <p className="text-sm font-black text-zinc-900 font-mono mt-1">&lt; R$ 70</p>
          </div>

          <div className="p-3 bg-white border border-black/[0.05]">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">LTV/CAC Mín.</p>
            <p className="text-sm font-black text-zinc-900 font-mono mt-1">&lt; 2.5x</p>
          </div>
        </div>
      </section>
    </div>
  );
}
