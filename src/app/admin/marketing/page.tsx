"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Search, 
  Mail, 
  Users, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Compass
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { 
  MarketingIntelligenceReport, 
  StrategicRecommendation 
} from "@/lib/marketing/engine";

export default function MarketingDashboardPage() {
  const [data, setData] = useState<MarketingIntelligenceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHorizon, setSelectedHorizon] = useState<"curto" | "medio" | "longo">("curto");

  const fetchMarketingData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/marketing", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.report) {
        setData(json.report);
        if (isManual) {
          toast.success("Inteligência de marketing recalculada com sucesso.", {
            style: { borderRadius: 0, background: "#111827", color: "#fff", border: "none" },
          });
        }
      }
    } catch (err: any) {
      toast.error(`Erro ao atualizar marketing: ${err?.message || "Serviço indisponível"}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketingData();
  }, [fetchMarketingData]);

  if (loading && !data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Processando atribuição multi-canal e compilando métricas de marketing...
        </p>
      </div>
    );
  }

  const kpis = data?.kpis;
  const filteredRecs = data?.recommendations.filter((r) => r.horizon === selectedHorizon) || [];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* ─── Header: Cockpit de Marketing ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-serif italic tracking-tight text-zinc-900">
              Inteligência de Marketing
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200">
              <Sparkles size={13} className="text-amber-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-900">
                Machine Learning Hooke
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-1 tracking-wide font-sans">
            Atribuição multi-canal, otimização de campanhas pagas, funil de conversão e benchmarking competitivo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-zinc-50 border border-black/[0.08] flex items-center gap-2">
            <Compass size={16} className="text-zinc-900" />
            <span className="text-xs font-black tracking-widest uppercase text-zinc-900">
              Score Geral: {data?.globalScore}/100
            </span>
          </div>

          <Button
            variant="buy"
            size="sm"
            onClick={() => fetchMarketingData(true)}
            disabled={refreshing}
            className="gap-2 tracking-widest text-[10px]"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Recalculando..." : "Atualizar Dados"}
          </Button>
        </div>
      </div>

      {/* ─── Grid de KPIs Financeiros de Marketing ─────────────────────────── */}
      <section className="space-y-3">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block">
          Eficiência Financeira &amp; Aquisição (Últimos 30 Dias)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-white border border-black/[0.08] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Blended CAC</span>
            <span className="text-2xl font-black text-zinc-900 mt-1">R$ {kpis?.blendedCAC}</span>
            <span className="text-[8px] font-bold text-emerald-700 mt-0.5">Meta: &lt; R$ 45</span>
          </div>

          <div className="p-4 bg-white border border-black/[0.08] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">ROAS Geral</span>
            <span className="text-2xl font-black text-emerald-700 mt-1">{kpis?.blendedROAS}x</span>
            <span className="text-[8px] font-bold text-emerald-700 mt-0.5">Meta: &gt; 2.5x</span>
          </div>

          <div className="p-4 bg-white border border-black/[0.08] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">LTV Projetado</span>
            <span className="text-2xl font-black text-zinc-900 mt-1">R$ {kpis?.ltv12m}</span>
            <span className="text-[8px] font-bold text-zinc-400 mt-0.5">Ciclo 12 meses</span>
          </div>

          <div className="p-4 bg-white border border-black/[0.08] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">LTV / CAC</span>
            <span className="text-2xl font-black text-zinc-900 mt-1">{kpis?.ltvCacRatio}x</span>
            <span className="text-[8px] font-bold text-emerald-700 mt-0.5">Saudável &gt; 3x</span>
          </div>

          <div className="p-4 bg-white border border-black/[0.08] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Taxa de Recompra</span>
            <span className="text-2xl font-black text-emerald-700 mt-1">{kpis?.repeatPurchaseRate}%</span>
            <span className="text-[8px] font-bold text-zinc-400 mt-0.5">Retenção 60-90d</span>
          </div>

          <div className="p-4 bg-white border border-black/[0.08] flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Recup. Carrinho</span>
            <span className="text-2xl font-black text-zinc-900 mt-1">{kpis?.cartRecoveryEfficiency}%</span>
            <span className="text-[8px] font-bold text-emerald-700 mt-0.5">Brevo + Webhook</span>
          </div>
        </div>
      </section>

      {/* ─── Funil de Conversão Completo (Full-Funnel) ─────────────────────── */}
      <section className="bg-white border border-black/[0.08] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-zinc-900" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
              Funil de Conversão Ponta a Ponta
            </span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
            Passagem &amp; Drop-off
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 pt-2">
          {data?.funnel.map((step, idx) => (
            <div 
              key={idx} 
              className="p-3.5 bg-[#FAF9F7] border border-black/[0.05] relative flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block">
                  {step.stage}
                </span>
                <p className="text-xs font-bold text-zinc-900 leading-tight">
                  {step.name}
                </p>
                <p className="text-xl font-black text-zinc-900 font-mono pt-1">
                  {step.users.toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="pt-3 border-t border-black/[0.06] mt-3 flex items-center justify-between text-[9px] font-mono">
                <span className="text-emerald-700 font-bold">
                  {step.conversionFromPrevious}% taxa
                </span>
                {step.dropOffRate > 0 && (
                  <span className="text-zinc-400">
                    -{step.dropOffRate}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Grid Duplo: Atribuição por Canal & Campanhas Pagas ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desempenho por Canal */}
        <section className="bg-white border border-black/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-zinc-900" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
                Atribuição por Canal
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">ROI &amp; Volume</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] text-[8px] font-black uppercase tracking-widest text-zinc-400">
                  <th className="py-2.5">Canal</th>
                  <th className="py-2.5">Share</th>
                  <th className="py-2.5">CVR</th>
                  <th className="py-2.5">Receita</th>
                  <th className="py-2.5">ROAS</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] font-mono">
                {data?.channels.map((ch, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-2.5 font-sans font-bold text-zinc-900">
                      {ch.channel}
                    </td>
                    <td className="py-2.5 text-zinc-500">{ch.shareTraffic}%</td>
                    <td className="py-2.5 text-zinc-700">{ch.conversionRate}%</td>
                    <td className="py-2.5 font-bold text-zinc-900">R$ {ch.revenue}</td>
                    <td className="py-2.5 text-emerald-700 font-bold">
                      {ch.roas > 10 ? "∞" : `${ch.roas}x`}
                    </td>
                    <td className="py-2.5 text-right font-sans">
                      <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                        ch.status === "escala"
                          ? "bg-emerald-100 text-emerald-800"
                          : ch.status === "otimizar"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-zinc-100 text-zinc-700"
                      }`}>
                        {ch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Campanhas Pagas em Destaque */}
        <section className="bg-white border border-black/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-zinc-900" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
                Campanhas Pagas Ativas
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">Meta &amp; Google</span>
          </div>

          <div className="space-y-3">
            {data?.campaigns.map((camp) => (
              <div 
                key={camp.id}
                className="p-3.5 bg-[#FAF9F7] border border-black/[0.05] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[8px] uppercase font-mono">
                      {camp.platform}
                    </Badge>
                    <span className="text-xs font-bold text-zinc-900 font-mono">
                      {camp.name}
                    </span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800">
                    ROAS {camp.roas}x
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono pt-1">
                  <div className="p-1.5 bg-white border border-black/[0.04]">
                    <span className="text-[7px] font-sans text-zinc-400 uppercase block">Gasto/mês</span>
                    <span className="font-bold text-zinc-800">R$ {camp.spendMonth}</span>
                  </div>
                  <div className="p-1.5 bg-white border border-black/[0.04]">
                    <span className="text-[7px] font-sans text-zinc-400 uppercase block">CTR</span>
                    <span className="font-bold text-zinc-800">{camp.ctr}%</span>
                  </div>
                  <div className="p-1.5 bg-white border border-black/[0.04]">
                    <span className="text-[7px] font-sans text-zinc-400 uppercase block">Vendas</span>
                    <span className="font-bold text-zinc-800">{camp.purchases}</span>
                  </div>
                  <div className="p-1.5 bg-white border border-black/[0.04]">
                    <span className="text-[7px] font-sans text-zinc-400 uppercase block">CPA</span>
                    <span className="font-bold text-emerald-700">R$ {camp.cpa}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── Grid Duplo: Auditoria SEO & Benchmark Competitivo ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO On-Page & Palavras-chave */}
        <section className="bg-white border border-black/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-zinc-900" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
                SEO &amp; Palavras-Chave Estratégicas
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">Score SEO: {data?.seo.score}/100</span>
          </div>

          <div className="space-y-2">
            {data?.seo.primaryKeywords.map((kw, idx) => (
              <div 
                key={idx}
                className="p-3 bg-[#FAF9F7] border border-black/[0.04] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-zinc-900">{kw.keyword}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{kw.opportunity}</p>
                </div>
                <div className="text-right flex-shrink-0 font-mono">
                  <span className="px-2 py-0.5 bg-white border border-black/[0.08] text-[9px] font-bold text-zinc-800 block">
                    {kw.currentRank}
                  </span>
                  <span className="text-[8px] text-zinc-400 mt-0.5 block">
                    {kw.volumeMonthly} buscas/mês
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benchmarking Competitivo */}
        <section className="bg-white border border-black/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-zinc-900" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
                Benchmarking Competitivo
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">Moda Premium DTC</span>
          </div>

          <div className="space-y-3">
            {data?.benchmarks.map((comp, idx) => (
              <div 
                key={idx}
                className="p-3.5 bg-[#FAF9F7] border border-black/[0.05] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-zinc-900 text-sm">{comp.competitor}</span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    Preço Médio: R$ {comp.avgPrice}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  <strong className="text-zinc-700">Foco:</strong> {comp.focus}
                </p>
                <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-2">
                  <strong>Vantagem Hooke:</strong> {comp.brandAdvantageHooke}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── Recomendações Estratégicas por Horizonte ──────────────────────── */}
      <section className="bg-white border border-black/[0.08] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 block">
              Recomendações Práticas de Otimização
            </span>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Ações classificadas por velocidade de retorno e impacto no faturamento.
            </p>
          </div>

          <div className="flex items-center gap-1">
            {(
              [
                { id: "curto", label: "Curto Prazo (0-15d)" },
                { id: "medio", label: "Médio Prazo (15-45d)" },
                { id: "longo", label: "Longo Prazo (45-90d)" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedHorizon(tab.id)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border transition-all ${
                  selectedHorizon === tab.id
                    ? "bg-hooke-900 text-white border-hooke-900"
                    : "bg-white text-zinc-500 border-black/[0.08] hover:border-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecs.map((rec) => (
            <div 
              key={rec.id}
              className="p-5 bg-[#FAF9F7] border border-black/[0.06] flex flex-col justify-between space-y-3 hover:border-black/20 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-black text-white">
                    {rec.category}
                  </span>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ${
                    rec.priority === "urgente"
                      ? "bg-red-100 text-red-800"
                      : rec.priority === "alta"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {rec.priority}
                  </span>
                </div>

                <h3 className="text-sm font-black text-zinc-900 leading-snug">
                  {rec.title}
                </h3>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block">
                    Impacto Estimado:
                  </span>
                  <span className="text-xs font-bold text-emerald-800 font-mono">
                    {rec.expectedImpact}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase">
                  Esforço: {rec.effort}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
