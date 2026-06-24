"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * HOOKE: Global Error Boundary (Última Linha de Defesa)
 * 
 * Captura erros catastróficos que escapam de todos os outros error boundaries.
 * Renderiza uma UI informativa com inline styles (não depende de CSS externo).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error('[Hooke Global Error]', error);
  }, [error]);

  return (
    <html>
      <body style={{ 
        margin: 0, 
        minHeight: '100vh',
        background: '#FDFDFD',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px',
      }}>
        <div style={{ 
          maxWidth: '480px', 
          width: '100%',
          border: '2px solid #000',
          background: '#fff',
          padding: '48px 32px',
          textAlign: 'center',
        }}>
          <div style={{ 
            fontSize: '32px', marginBottom: '16px',
          }}>⚠️</div>
          <h1 style={{ 
            fontSize: '11px', fontWeight: 900, letterSpacing: '0.3em', 
            textTransform: 'uppercase', marginBottom: '12px', color: '#000',
          }}>
            Erro Crítico
          </h1>
          <p style={{ 
            fontSize: '13px', color: '#71717a', lineHeight: 1.6, marginBottom: '24px',
          }}>
            Ocorreu um erro inesperado no sistema. A equipe foi notificada automaticamente.
          </p>
          <div style={{ 
            background: '#fef2f2', border: '1px solid #fecaca', padding: '12px',
            fontSize: '11px', fontFamily: 'monospace', color: '#dc2626', 
            marginBottom: '24px', wordBreak: 'break-all', textAlign: 'left',
          }}>
            {error.message || 'Erro desconhecido'}
            {error.digest && (
              <div style={{ fontSize: '10px', color: '#d4d4d8', marginTop: '4px' }}>
                Digest: {error.digest}
              </div>
            )}
          </div>
          <button 
            onClick={reset}
            style={{
              padding: '14px 32px', background: '#000', color: '#fff',
              border: 'none', fontSize: '10px', fontWeight: 900,
              letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </body>
    </html>
  );
}
