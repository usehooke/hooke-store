'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

/**
 * HOOKE HQ: Error Boundary — Etiquetas
 */
export default function EtiquetasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Etiquetas Error]', error);
  }, [error]);

  return (
    <div style={{ 
      minHeight: '60vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ 
          width: '48px', height: '48px', background: '#000', 
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' 
        }}>
          <AlertTriangle size={24} color="#fff" />
        </div>
        <h2 style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Falha nas Etiquetas
        </h2>
        <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '8px' }}>
          {error.message || 'Erro ao carregar o gerador de etiquetas.'}
        </p>
        {error.digest && <p style={{ fontSize: '10px', color: '#d4d4d8', fontFamily: 'monospace', marginBottom: '16px' }}>Digest: {error.digest}</p>}
        <button onClick={reset} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
          background: '#000', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 900,
          letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
        }}>
          <RefreshCcw size={14} /> Tentar Novamente
        </button>
      </div>
    </div>
  );
}
