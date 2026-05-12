"use client";

import React from "react";

/**
 * 🧪 HOOKE SYSTEM: SENTRY TEST PAGE
 * Este arquivo serve apenas para validar a integração do Sentry.
 * Deve ser removido após a confirmação no dashboard.
 */
export default function SentryTestPage() {
  const triggerError = () => {
    // @ts-ignore
    myUndefinedFunction();
  };

  return (
    <main className="min-h-screen bg-hooke-paper flex flex-col items-center justify-center p-12 text-black font-jost">
      <div className="max-w-xl w-full border-4 border-black bg-white p-12 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-6">
          Sentry / <span className="opacity-30">Telemetry Test</span>
        </h1>
        
        <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-8 leading-relaxed">
          Pressione o botão abaixo para disparar um erro sintético e validar a recepção no dashboard da Sentry.
        </p>

        <button
          onClick={triggerError}
          className="w-full bg-red-600 text-white p-6 text-sm font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 border-2 border-black"
        >
          Disparar Erro de Teste
        </button>

        <div className="mt-8 pt-8 border-t border-zinc-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Hooke Elite Protocol : CI/CD Shield
          </p>
        </div>
      </div>
    </main>
  );
}
