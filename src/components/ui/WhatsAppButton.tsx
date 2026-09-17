"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ChevronRight, ShieldCheck, Ruler, PackageCheck, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brandConfig";
import { generateWhatsAppLink, generateContextualMessage } from "@/lib/whatsapp/engine";
import { trackGAEvent } from "@/lib/analytics";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "";
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Fechar popover ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isVisible) return null;

  // Determinar o contexto da rota atual
  const getRouteContext = () => {
    if (pathname.includes("/produto/")) return "product" as const;
    if (pathname.includes("/checkout")) return "checkout" as const;
    if (pathname.includes("/colecao")) return "cart" as const;
    if (pathname === "/") return "home" as const;
    return "default" as const;
  };

  const contextType = getRouteContext();
  const defaultMessage = generateContextualMessage({
    pageType: contextType,
    productName: typeof window !== "undefined" ? (window as any).__currentProduct : undefined,
  });

  const handleOpenWhatsApp = (customText?: string) => {
    const textToSend = customText || defaultMessage;
    trackGAEvent("WhatsAppClick", {
      context: contextType,
      path: pathname,
    });
    const url = generateWhatsAppLink(textToSend);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div ref={popoverRef} className="fixed bottom-20 md:bottom-6 right-5 z-50 flex flex-col items-end">
      {/* ─── Popover Concierge Soft Brutalism ─────────────────────────────── */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Header do Concierge */}
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">
                Hooke Concierge 24h
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-black"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-zinc-600 mt-3 mb-4 leading-relaxed font-sans">
            Atendimento direto de fábrica. Como podemos auxiliar sua experiência hoje?
          </p>

          {/* Opções Rápidas em 1 Clique */}
          <div className="space-y-2">
            <button
              onClick={() => handleOpenWhatsApp()}
              className="w-full text-left p-2.5 bg-[#FAF9F7] border border-black/[0.08] hover:border-black hover:bg-black hover:text-white transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle size={14} className="text-emerald-600 group-hover:text-emerald-400 flex-shrink-0" />
                <span className="text-[11px] font-bold tracking-wide">
                  {contextType === "product"
                    ? "Dúvida sobre esta peça"
                    : contextType === "checkout"
                    ? "Auxílio com o pagamento / PIX"
                    : "Falar com Especialista de Estilo"}
                </span>
              </div>
              <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() =>
                handleOpenWhatsApp(
                  "Olá! Gostaria de consultar qual é o tamanho recomendado para minha altura e peso na malha 260g."
                )
              }
              className="w-full text-left p-2.5 bg-[#FAF9F7] border border-black/[0.08] hover:border-black hover:bg-black hover:text-white transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Ruler size={14} className="text-zinc-600 group-hover:text-white flex-shrink-0" />
                <span className="text-[11px] font-bold tracking-wide">
                  Guia de Medidas &amp; Gola 3cm
                </span>
              </div>
              <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() =>
                handleOpenWhatsApp(
                  "Olá! Gostaria de consultar o status e rastreamento do meu pedido na Hooke Store."
                )
              }
              className="w-full text-left p-2.5 bg-[#FAF9F7] border border-black/[0.08] hover:border-black hover:bg-black hover:text-white transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <PackageCheck size={14} className="text-zinc-600 group-hover:text-white flex-shrink-0" />
                <span className="text-[11px] font-bold tracking-wide">
                  Rastrear Meu Pedido
                </span>
              </div>
              <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[9px] text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-600" />
              Canal Oficial Verificado
            </span>
            <span>Brás · São Paulo</span>
          </div>
        </div>
      )}

      {/* ─── Botão Flutuante Principal ───────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir Atendimento WhatsApp"
        className="relative group flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:bg-[#20bd5a] hover:scale-105 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
      >
        <MessageCircle size={28} fill="white" className="relative z-10" />

        {/* Bolinha de notificação pulsante */}
        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black z-20">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
        </span>

        {/* Tooltip quando o popover estiver fechado */}
        {!isOpen && (
          <span className="absolute right-16 bg-white text-zinc-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-none border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
            Concierge WhatsApp
          </span>
        )}
      </button>
    </div>
  );
}

