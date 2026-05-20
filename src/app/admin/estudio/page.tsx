import React from 'react';

export default function EstudioPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 bg-hooke-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">
          HQ
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-hooke-900">
          Estúdio Mágico Migrado
        </h1>
        <p className="text-zinc-500 leading-relaxed text-sm">
          A infraestrutura do Estúdio Mágico (Orquestração de IA) foi migrada com sucesso para a arquitetura <strong>Hooke Elite Local</strong>. 
          Isso garante que a sua loja na Vercel opere com performance máxima, sem riscos de Timeout (Erros 504) causados pelo processamento pesado do Gemini.
        </p>
        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 text-left">
          <p className="text-xs text-zinc-400 font-mono mb-2">PROXIMOS PASSOS (ADMIN):</p>
          <ol className="text-sm text-zinc-600 space-y-2 list-decimal list-inside font-mono">
            <li>Abra o VSCode / Terminal</li>
            <li>Inicie a orquestração via Antigravity</li>
            <li>Acompanhe a Fila Local (JSON)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
