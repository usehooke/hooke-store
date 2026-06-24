'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

/**
 * HOOKE HQ: Error Boundary do Admin (Nível Raiz)
 * 
 * Captura qualquer erro não tratado dentro do layout admin.
 * Se uma página filha não tiver seu próprio error.tsx, este aqui entra em ação.
 * Design: Soft Brutalism, premium, informativo.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log mesmo em produção (após remoção do removeConsole)
    console.error('[Hooke Admin Error Boundary]', error);
  }, [error]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#FDFDFD', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ 
        maxWidth: '520px', 
        width: '100%',
        border: '2px solid #000',
        background: '#fff',
        padding: '48px 40px',
      }}>
        {/* Ícone */}
        <div style={{ 
          width: '48px', 
          height: '48px', 
          background: '#000', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <AlertTriangle size={24} color="#fff" />
        </div>

        {/* Título */}
        <h1 style={{ 
          fontSize: '11px', 
          fontWeight: 900, 
          letterSpacing: '0.25em', 
          textTransform: 'uppercase' as const,
          color: '#000',
          marginBottom: '8px',
        }}>
          Falha no Painel Admin
        </h1>

        <p style={{ 
          fontSize: '13px', 
          color: '#71717a',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}>
          Um erro inesperado impediu o carregamento desta página. 
          Isso pode ser temporário — tente novamente ou volte ao início.
        </p>

        {/* Detalhes do Erro (sempre visível para o admin) */}
        <div style={{ 
          background: '#fafafa', 
          border: '1px solid rgba(0,0,0,0.05)',
          padding: '16px',
          marginBottom: '24px',
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#a1a1aa',
          wordBreak: 'break-all' as const,
          maxHeight: '120px',
          overflow: 'auto',
        }}>
          <div style={{ marginBottom: '4px', color: '#ef4444', fontWeight: 700 }}>
            {error.message || 'Erro desconhecido'}
          </div>
          {error.digest && (
            <div style={{ fontSize: '10px', color: '#d4d4d8' }}>
              Digest: {error.digest}
            </div>
          )}
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={reset}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 20px',
              background: '#000',
              color: '#fff',
              border: 'none',
              fontSize: '10px',
              fontWeight: 900,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              cursor: 'pointer',
            }}
          >
            <RefreshCcw size={14} /> Tentar Novamente
          </button>
          <a 
            href="/admin/pdv"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 20px',
              background: '#fafafa',
              color: '#52525b',
              border: '1px solid rgba(0,0,0,0.1)',
              fontSize: '10px',
              fontWeight: 900,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <Home size={14} /> Voltar ao PDV
          </a>
        </div>
      </div>
    </div>
  );
}
