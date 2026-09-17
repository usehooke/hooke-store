"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Users,
  ShoppingBag,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  PhoneCall,
  Flame,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { buildAbandonedCartRecoveryMessage, generateWhatsAppLink } from "@/lib/whatsapp/engine";

interface AbandonedCartItem {
  id: string;
  name: string;
  phone: string;
  items: string[];
  total: number;
  timeAgo: string;
  recoveryUrl: string;
}

export default function WhatsAppHubPage() {
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"carrinho" | "recompra" | "vip">("carrinho");
  const [simulatedCustomer, setSimulatedCustomer] = useState({
    name: "Leonardo Silva",
    phone: "11987654321",
    product: "T-Shirt Vintage Fusca Preta (G)",
    value: 60.0,
  });

  // Mock calibrado de drafts recentes para gestão rápida
  const recentAbandoned: AbandonedCartItem[] = [
    {
      id: "draft_1",
      name: "Marcus Vinicius",
      phone: "11972341209",
      items: ["T-Shirt Vintage Opala SS Areia (G)", "Camiseta Heavyweight Preta (GG)"],
      total: 105.0,
      timeAgo: "Há 32 minutos",
      recoveryUrl: buildAbandonedCartRecoveryMessage({
        customerName: "Marcus Vinicius",
        customerPhone: "11972341209",
        productNames: ["T-Shirt Vintage Opala SS Areia", "Camiseta Heavyweight Preta"],
        totalValue: 105.0,
      }).waLink,
    },
    {
      id: "draft_2",
      name: "Gabriel Medeiros",
      phone: "21981223456",
      items: ["Conjunto em Viscose Nobre Azul (M)"],
      total: 110.0,
      timeAgo: "Há 1 hora e 15 min",
      recoveryUrl: buildAbandonedCartRecoveryMessage({
        customerName: "Gabriel Medeiros",
        customerPhone: "21981223456",
        productNames: ["Conjunto em Viscose Nobre Azul"],
        totalValue: 110.0,
      }).waLink,
    },
    {
      id: "draft_3",
      name: "Rafael Zanin",
      phone: "19998765432",
      items: ["T-Shirt Vintage Fusca Ferrugem (P)"],
      total: 45.0,
      timeAgo: "Há 3 horas",
      recoveryUrl: buildAbandonedCartRecoveryMessage({
        customerName: "Rafael Zanin",
        customerPhone: "19998765432",
        productNames: ["T-Shirt Vintage Fusca Ferrugem"],
        totalValue: 45.0,
      }).waLink,
    },
  ];

  const handleSendManual = (waLink: string, customerName: string) => {
    window.open(waLink, "_blank", "noopener,noreferrer");
    toast.success(`Conversa com ${customerName} aberta no WhatsApp.`, {
      style: { borderRadius: 0, background: "#111827", color: "#fff", border: "none" },
    });
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* ─── Top Bar Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-serif italic tracking-tight text-zinc-900">
              WhatsApp Hub &amp; Concierge
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-900">
                Canal Oficial Ativo
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-1 tracking-wide font-sans">
            Recuperação inteligente de carrinhos, atendimento pré e pós-venda, disparos segmentados e compliance LGPD.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-zinc-50 border border-black/[0.08] flex items-center gap-2">
            <PhoneCall size={16} className="text-zinc-900" />
            <span className="text-xs font-black tracking-widest uppercase font-mono text-zinc-900">
              (11) 97590-2528
            </span>
          </div>
        </div>
      </div>

      {/* ─── Grid de KPIs de Comunicação ───────────────────────────────────── */}
      <section className="space-y-3">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block">
          Métricas de Engajamento &amp; Recuperação (Últimos 30 Dias)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card variant="brutalist">
            <CardHeader className="pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-zinc-400 text-xs uppercase">Carrinhos Recuperados</CardTitle>
                <Flame size={16} className="text-amber-500" />
              </div>
              <CardDescription>Via Régua WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tighter text-zinc-900">24.2%</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800">
                  +R$ 4.250
                </span>
              </div>
            </CardContent>
          </Card>

          <Card variant="brutalist">
            <CardHeader className="pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-zinc-400 text-xs uppercase">Tempo Médio Resposta</CardTitle>
                <Clock size={16} className="text-zinc-400" />
              </div>
              <CardDescription>Bot + Concierge Humano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tighter text-zinc-900">4 min</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800">
                  Imediato
                </span>
              </div>
            </CardContent>
          </Card>

          <Card variant="brutalist">
            <CardHeader className="pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-zinc-400 text-xs uppercase">Taxa de Abertura / Leitura</CardTitle>
                <MessageSquare size={16} className="text-zinc-400" />
              </div>
              <CardDescription>Mensagens Transacionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tighter text-zinc-900">96.8%</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-zinc-100 text-zinc-700">
                  Benchmark: &gt; 90%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card variant="brutalist">
            <CardHeader className="pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-zinc-400 text-xs uppercase">Satisfação (CSAT)</CardTitle>
                <Sparkles size={16} className="text-amber-500" />
              </div>
              <CardDescription>Avaliação Pós-Atendimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tighter text-zinc-900">4.9 / 5</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800">
                  Excelente
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── Fila de Carrinhos Abandonados em Tempo Real ────────────────────── */}
      <section className="bg-white border border-black/[0.08] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-zinc-900" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
                Fila de Recuperação Imediata de Carrinho
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Leads capturados com telefone válido no checkout que não finalizaram o pagamento.
            </p>
          </div>

          <span className="text-[9px] font-mono text-zinc-400">
            {recentAbandoned.length} oportunidades ativas
          </span>
        </div>

        <div className="divide-y divide-black/[0.06]">
          {recentAbandoned.map((draft) => (
            <div
              key={draft.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/60 transition-colors px-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-zinc-900">{draft.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">({draft.phone})</span>
                  <span className="text-[9px] text-zinc-400 font-mono">· {draft.timeAgo}</span>
                </div>

                <p className="text-xs text-zinc-600">
                  <strong>Itens:</strong> {draft.items.join(" · ")}
                </p>

                <p className="text-[11px] font-mono font-bold text-zinc-900">
                  Valor Total: R$ {draft.total.toFixed(2)} (PIX c/ desc: R$ {(draft.total * 0.85).toFixed(2)})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="buy"
                  size="sm"
                  onClick={() => handleSendManual(draft.recoveryUrl, draft.name)}
                  className="gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black border-2 border-black tracking-widest text-[9px]"
                >
                  <Send size={13} />
                  Enviar WhatsApp 1-Clique
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Grid Duplo: Simulador de Mensagens & FAQ Bot ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulador de Templates Oficiais */}
        <section className="bg-white border border-black/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
                Templates de Mensagens Transacionais
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">Meta Cloud API</span>
          </div>

          <div className="flex gap-2">
            {(
              [
                { id: "carrinho", label: "Carrinho Abandonado" },
                { id: "recompra", label: "Recompra (18d)" },
                { id: "vip", label: "Drop Exclusivo" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider border transition-all ${
                  selectedTemplate === t.id
                    ? "bg-hooke-900 text-white border-hooke-900"
                    : "bg-white text-zinc-500 border-black/[0.08] hover:border-black"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 bg-[#FAF9F7] border border-black/[0.06] rounded-none font-mono text-xs whitespace-pre-line text-zinc-800 leading-relaxed">
            {selectedTemplate === "carrinho" &&
              buildAbandonedCartRecoveryMessage({
                customerName: simulatedCustomer.name,
                customerPhone: simulatedCustomer.phone,
                productNames: [simulatedCustomer.product],
                totalValue: simulatedCustomer.value,
              }).message}

            {selectedTemplate === "recompra" &&
              `Olá, ${simulatedCustomer.name}! 🏴

Faz 18 dias que sua camiseta de algodão pesado 260g chegou. Como está sendo a experiência com a gola canelada e o caimento no dia a dia?

Para completar seu armário essencial, liberamos seu cupom exclusivo de recompra:
🎁 *HOOKE-RETURN* (15% OFF em qualquer peça da nova coleção)

Acesse: https://www.usehooke.com.br/colecao`}

            {selectedTemplate === "vip" &&
              `Acesso Antecipado: Novo Drop Hooke 🏴

Olá, ${simulatedCustomer.name}!
Como membro VIP, você tem 2 horas de acesso exclusivo ao lançamento da nova série Vintage Opala SS antes do público geral.

Estoque limitado de fábrica (260g).
Garanta o seu: https://www.usehooke.com.br/lancamento`}
          </div>

          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => {
              const text =
                selectedTemplate === "carrinho"
                  ? buildAbandonedCartRecoveryMessage({
                      customerName: simulatedCustomer.name,
                      customerPhone: simulatedCustomer.phone,
                      productNames: [simulatedCustomer.product],
                      totalValue: simulatedCustomer.value,
                    }).message
                  : "Teste de Template Hooke";
              const link = generateWhatsAppLink(text, "5511975902528");
              window.open(link, "_blank");
            }}
            className="tracking-widest text-[10px]"
          >
            Testar Envio no Próprio WhatsApp →
          </Button>
        </section>

        {/* Resoluções Automáticas do Bot de FAQ */}
        <section className="bg-white border border-black/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-zinc-900" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
                Fluxo de Atendimento Inteligente (Bot)
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">Webhook Ativo</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-[#FAF9F7] border border-black/[0.05] space-y-1">
              <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-black text-white">
                Intenção: Rastreamento
              </span>
              <p className="text-[11px] font-bold text-zinc-900">
                Gatilhos: "rastreio", "onde está", "pedido", "código"
              </p>
              <p className="text-[11px] text-zinc-600 font-mono bg-white p-2 border border-black/[0.04]">
                "Para consultar o rastreamento do seu pedido, informe o número do pedido ou acesse: usehooke.com.br/meus-pedidos. Envio em até 24h via Correios."
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF9F7] border border-black/[0.05] space-y-1">
              <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-black text-white">
                Intenção: Medidas &amp; Caimento
              </span>
              <p className="text-[11px] font-bold text-zinc-900">
                Gatilhos: "tamanho", "medidas", "tabela", "gola 3cm"
              </p>
              <p className="text-[11px] text-zinc-600 font-mono bg-white p-2 border border-black/[0.04]">
                "Camisetas Boxy Fit com gola de 3cm canelada. P (até 70kg), M (70-80kg), G (80-92kg), GG (acima de 92kg). Provador virtual em usehooke.com.br/guia-medidas."
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF9F7] border border-black/[0.05] space-y-1">
              <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-black text-white">
                Intenção: Qualidade do Tecido
              </span>
              <p className="text-[11px] font-bold text-zinc-900">
                Gatilhos: "tecido", "gramatura", "260g", "encolhe"
              </p>
              <p className="text-[11px] text-zinc-600 font-mono bg-white p-2 border border-black/[0.04]">
                "Algodão Heavyweight 260g penteado 30.1 com toque frio e caimento encorpado. Tecido pré-lavado com encolhimento zero."
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Conformidade LGPD & Privacidade ───────────────────────────────── */}
      <section className="bg-[#FAF9F7] border border-black/[0.08] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-emerald-700 flex-shrink-0" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-zinc-900 block">
              Conformidade LGPD &amp; Boas Práticas do WhatsApp
            </span>
            <p className="text-[11px] text-zinc-500 font-sans mt-0.5">
              Disparos restritos a usuários que preencheram dados voluntariamente no checkout. Mecanismo automático de opt-out (responder "SAIR" remove da lista).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500">
          <Badge variant="outline" className="bg-white">Criptografia Ponta a Ponta</Badge>
          <Badge variant="outline" className="bg-white">Meta Verified</Badge>
        </div>
      </section>
    </div>
  );
}
