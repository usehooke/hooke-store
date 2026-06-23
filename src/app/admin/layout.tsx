'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/features/admin';
import { Toaster } from 'sonner';
import { AdminBottomNav } from '@/components/admin/AdminBottomNav';
import { GlobalCommand } from '@/components/admin/GlobalCommand';
import { NotificationPulse } from '@/components/admin/NotificationPulse';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Rotas que exigem foco total (Zen Mode)
    const isZenMode = pathname?.includes('/admin/pdv') || pathname?.includes('/admin/produtos/novo');

    useEffect(() => {
        if (!auth) {
            // Firebase Client SDK não inicializou — redireciona para login de forma segura
            router.push('/login');
            return;
        }
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push('/login');
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
                <div className="text-hooke-900 text-[10px] tracking-[0.5em] uppercase animate-pulse font-black">
                    Hooke Alpha Command
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
            <Toaster position="bottom-right" theme="light" richColors />
            <GlobalCommand />
            <NotificationPulse />
            
            {/* Hooke HQ: Paradigma Linear (Mobile & Tablet First) */}
            <div className="flex h-screen overflow-hidden">
                
                {/* Navegação Lateral (Desktop) */}
                <div className="hidden lg:block h-full z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                    <Sidebar user={user} />
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
                <AdminBottomNav />
            </div>
        </div>
    );
}
