'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

/**
 * HOOKE HQ: Rota de Diagnóstico Efêmera
 * 
 * Acesse /admin/debug?secret=hooke2025 para visualizar o estado
 * de inicialização do Firebase e das variáveis de ambiente.
 * 
 * ⚠️ Protegida por parâmetro secreto para não expor dados em produção.
 * 🗑️ Remover esta rota após a estabilização.
 */

const EMERGENCY_SECRET = 'hooke2025';

interface DiagnosticItem {
  label: string;
  value: string;
  status: 'ok' | 'warning' | 'error';
}

export default function AdminDebugPage() {
  const [authorized, setAuthorized] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([]);
  const [authState, setAuthState] = useState<string>('verificando...');

  useEffect(() => {
    // Verificar parâmetro secreto
    const params = new URLSearchParams(window.location.search);
    if (params.get('secret') !== EMERGENCY_SECRET) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);

    // ─── Diagnóstico de Variáveis de Ambiente ─────────────────────────────────
    const envChecks: DiagnosticItem[] = [
      {
        label: 'NEXT_PUBLIC_FIREBASE_API_KEY',
        value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? `✅ Presente (${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.slice(0, 8)}...)` : '❌ AUSENTE',
        status: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'ok' : 'error',
      },
      {
        label: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ AUSENTE',
        status: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'ok' : 'error',
      },
      {
        label: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ AUSENTE',
        status: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'ok' : 'error',
      },
      {
        label: 'NEXT_PUBLIC_FIREBASE_APP_ID',
        value: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? `✅ Presente (${process.env.NEXT_PUBLIC_FIREBASE_APP_ID.slice(0, 10)}...)` : '❌ AUSENTE',
        status: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'ok' : 'error',
      },
      {
        label: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        value: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '❌ AUSENTE',
        status: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'ok' : 'warning',
      },
    ];

    // ─── Diagnóstico do Firebase Client SDK ───────────────────────────────────
    envChecks.push({
      label: 'Firebase Auth Object',
      value: auth ? '✅ Inicializado' : '❌ NULL (SDK não carregou)',
      status: auth ? 'ok' : 'error',
    });

    if (auth) {
      envChecks.push({
        label: 'Firebase Auth - currentUser',
        value: auth.currentUser ? `✅ Logado (${auth.currentUser.email || auth.currentUser.uid})` : '⚠️ Null (não logado ou ainda carregando)',
        status: auth.currentUser ? 'ok' : 'warning',
      });
    }

    // ─── Diagnóstico do Ambiente ──────────────────────────────────────────────
    envChecks.push({
      label: 'NODE_ENV',
      value: process.env.NODE_ENV || 'indefinido',
      status: 'ok',
    });

    envChecks.push({
      label: 'User Agent',
      value: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) + '...' : 'N/A',
      status: 'ok',
    });

    envChecks.push({
      label: 'Window Location',
      value: typeof window !== 'undefined' ? window.location.href : 'N/A',
      status: 'ok',
    });

    setDiagnostics(envChecks);

    // ─── Monitorar Auth State ─────────────────────────────────────────────────
    if (auth) {
      const { onAuthStateChanged } = require('firebase/auth');
      const unsub = onAuthStateChanged(auth, (user: any) => {
        if (user) {
          setAuthState(`✅ Autenticado: ${user.email || user.uid}`);
        } else {
          setAuthState('❌ Não autenticado (onAuthStateChanged retornou null)');
        }
      });
      return () => unsub();
    } else {
      setAuthState('❌ Auth é null — não foi possível escutar onAuthStateChanged');
    }
  }, []);

  if (!authorized) {
    return (
      <div style={{ 
        minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#a1a1aa' }}>
            Acesso Restrito
          </p>
          <p style={{ fontSize: '11px', color: '#d4d4d8', marginTop: '8px' }}>
            Use ?secret=TOKEN para acessar o diagnóstico.
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    ok: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
    error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
  };

  return (
    <div style={{ 
      maxWidth: '700px', margin: '0 auto', padding: '40px 24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: '8px' }}>
          Hooke HQ Diagnóstico
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.02em' }}>
          Sistema de Debug
        </h1>
        <p style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>
          Timestamp: {new Date().toISOString()}
        </p>
      </div>

      {/* Auth State Live */}
      <div style={{ 
        padding: '16px', border: '2px solid #000', marginBottom: '24px',
        background: '#fff',
      }}>
        <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Auth State (Live)
        </p>
        <p style={{ fontSize: '13px', fontFamily: 'monospace' }}>
          {authState}
        </p>
      </div>

      {/* Diagnósticos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {diagnostics.map((item, i) => {
          const colors = statusColors[item.status];
          return (
            <div key={i} style={{ 
              padding: '12px 16px', 
              background: colors.bg, 
              border: `1px solid ${colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525b', flexShrink: 0 }}>
                {item.label}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: colors.text, textAlign: 'right', wordBreak: 'break-all' }}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Aviso */}
      <div style={{ 
        marginTop: '32px', padding: '12px', background: '#fffbeb', 
        border: '1px solid #fde68a', fontSize: '10px', color: '#92400e',
        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>
        ⚠️ Remova esta rota após a estabilização do sistema.
      </div>
    </div>
  );
}
