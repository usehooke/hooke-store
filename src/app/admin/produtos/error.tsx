'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

/**
 * Hooke HQ: Error Boundary do Inventário
 * Captura erros do Server Component e exibe fallback premium
 * em vez de uma tela branca sem informação.
 */
export default function ProdutosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-md w-full border border-red-100 bg-white p-10 space-y-6 text-center">

        {/* Ícone */}
        <div className="w-14 h-14 bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
          <AlertTriangle size={24} className="text-red-400" strokeWidth={1.5} />
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase text-red-400">
            Falha no Inventário
          </p>
          <h2 className="text-xl font-black tracking-tight text-zinc-900">
            Não foi possível carregar
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Houve um erro ao buscar os produtos do catálogo.
            Isso pode ser uma falha temporária de conexão com o banco.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <pre className="text-[10px] text-left bg-red-50 border border-red-100 p-3 text-red-500 font-mono whitespace-pre-wrap break-all mt-4">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          )}
        </div>

        {/* Ação */}
        <button
          onClick={reset}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors"
        >
          <RefreshCcw size={12} />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
