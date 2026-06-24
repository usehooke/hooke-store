'use client';

import React, { useEffect, useState, Component, ReactNode, ErrorInfo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/features/admin';
import { Toaster } from 'sonner'
import { AdminBottomNav } from '@/components/admin/AdminBottomNav';
import { GlobalCommand } from '@/components/admin/GlobalCommand';
import { NotificationPulse } from '@/components/admin/NotificationPulse';

// ─── Inline Error Boundary para componentes secundários ───────────────────────
// Evita que uma falha em GlobalCommand, NotificationPulse ou Sidebar
// derrube o layout inteiro, causando tela branca.
class SafeComponentBoundary extends Component<
  { children: ReactNode; name: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; name: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Hooke SafeBoundary] Componente "${this.props.name}" falhou:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Componente falhou → renderiza nada (invisível), não derruba o layout
      return null;
    }
    return this.props.children;
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Rotas que exigem foco total (Zen Mode)
    const isZenMode = pathname?.includes('/admin/pdv') || pathname?.includes('/admin/produtos/novo');

    useEffect(() => {
        // ─── Timeout de segurança ────────────────────────────────────────────────
        // Garante que o estado de loading nunca fique preso para sempre.
        // Se Firebase não responder em 8 segundos, mostra erro (não redireciona cegamente).
        const fallbackTimer = setTimeout(() => {
            console.warn('[AdminLayout] Firebase auth timeout após 8s');
            setAuthError('Timeout: Firebase Auth não respondeu em 8 segundos.');
            setLoading(false);
        }, 8000);

        if (!auth) {
            // Firebase Client SDK não inicializou (config ausente ou erro de init).
            clearTimeout(fallbackTimer);
            console.error('[AdminLayout] Firebase auth é null — config ausente ou erro de inicialização');
            setAuthError('Firebase Client SDK não inicializou. Verifique as variáveis de ambiente NEXT_PUBLIC_FIREBASE_*');
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            clearTimeout(fallbackTimer); // Cancela o timeout pois Firebase respondeu
            if (!currentUser) {
                router.push('/login');
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        });

        return () => {
            clearTimeout(fallbackTimer);
            unsubscribe();
        };
    }, [router]);

    // ─── Estado: Carregando ──────────────────────────────────────────────────────
    if (loading) {
        return (
            // ⚠️ Inline styles obrigatórios:
            // CSS vars do dark mode podem tornar texto invisível contra fundo claro.
            <div style={{ minHeight: '100vh', background: '#FDFDFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#111111', fontSize: '10px', letterSpacing: '0.5em', textTransform: 'uppercase', fontWeight: 900, animation: 'pulse 2s infinite' }}>
                    Hooke Alpha Command
                </div>
            </div>
        );
    }

    // ─── Estado: Erro de Auth / Firebase ─────────────────────────────────────────
    // Em vez de tela branca, mostramos um diagnóstico visual claro.
    if (authError) {
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
                    maxWidth: '480px', 
                    width: '100%',
                    border: '2px solid #000',
                    background: '#fff',
                    padding: '40px 32px',
                }}>
                    <div style={{ 
                        width: '40px', height: '40px', background: '#ef4444', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '20px', color: '#fff', fontSize: '20px', fontWeight: 900 
                    }}>!</div>
                    <h1 style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Falha na Autenticação
                    </h1>
                    <p style={{ fontSize: '12px', color: '#71717a', lineHeight: 1.6, marginBottom: '16px' }}>
                        O sistema de autenticação não conseguiu inicializar. 
                        Isso geralmente indica variáveis de ambiente ausentes na Vercel.
                    </p>
                    <div style={{ 
                        background: '#fef2f2', border: '1px solid #fecaca', padding: '12px',
                        fontSize: '11px', fontFamily: 'monospace', color: '#dc2626', marginBottom: '20px',
                        wordBreak: 'break-all',
                    }}>
                        {authError}
                    </div>
                    <div style={{ 
                        background: '#fafafa', border: '1px solid rgba(0,0,0,0.05)', padding: '12px',
                        fontSize: '10px', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '20px',
                    }}>
                        <strong style={{ color: '#52525b' }}>Checklist:</strong><br/>
                        • NEXT_PUBLIC_FIREBASE_API_KEY<br/>
                        • NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN<br/>
                        • NEXT_PUBLIC_FIREBASE_PROJECT_ID<br/>
                        • NEXT_PUBLIC_FIREBASE_APP_ID<br/>
                        • FIREBASE_SERVICE_ACCOUNT_KEY
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={() => window.location.reload()}
                            style={{
                                flex: 1, padding: '12px', background: '#000', color: '#fff',
                                border: 'none', fontSize: '10px', fontWeight: 900,
                                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                            }}
                        >
                            Recarregar
                        </button>
                        <a 
                            href="/login"
                            style={{
                                flex: 1, padding: '12px', background: '#fafafa', color: '#52525b',
                                border: '1px solid rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 900,
                                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                                textDecoration: 'none', textAlign: 'center',
                            }}
                        >
                            Ir para Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Estado: Sem usuário autenticado ──────────────────────────────────────────
    if (!user) return null;

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
            <Toaster position="bottom-right" theme="light" richColors />
            
            {/* Componentes secundários protegidos individualmente */}
            <SafeComponentBoundary name="GlobalCommand">
                <GlobalCommand />
            </SafeComponentBoundary>
            <SafeComponentBoundary name="NotificationPulse">
                <NotificationPulse />
            </SafeComponentBoundary>
            
            {/* Hooke HQ: Paradigma Linear (Mobile & Tablet First) */}
            <div className="flex h-screen overflow-hidden">
                
                {/* Navegação Lateral (Desktop) */}
                <div className="hidden lg:block h-full z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                    <SafeComponentBoundary name="Sidebar">
                        <Sidebar user={user} />
                    </SafeComponentBoundary>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar relative pb-24 md:pb-32">
                    {/* Linha de Grade Sutil (Subpixel) */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
                    
                    <div className={`relative z-10 transition-all duration-500 ${
                        isZenMode 
                        ? 'max-w-none p-0' 
                        : 'p-6 md:p-16 max-w-7xl mx-auto'
                    }`}>
                        {children}
                    </div>
                </main>
            </div>

            {/* Acessibilidade Balcão: Navegação de Titânio */}
            <div className="lg:hidden">
                <SafeComponentBoundary name="AdminBottomNav">
                    <AdminBottomNav />
                </SafeComponentBoundary>
            </div>
        </div>
    );
}
