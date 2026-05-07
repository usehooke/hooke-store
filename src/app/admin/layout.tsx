'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/features/admin';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Rotas que exigem foco total (Zen Mode)
    const isZenMode = pathname?.includes('/admin/pdv') || pathname?.includes('/admin/produtos');

    useEffect(() => {
        if (!auth) {
            setLoading(false);
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
        <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-black selection:text-white">
            <Toaster position="bottom-right" theme="light" richColors />
            
            {/* HCC Atelier 3.0 Architecture */}
            <div className="flex h-screen overflow-hidden">
                
                {/* Sidebar Adaptativo - Oculto no Zen Mode */}
                {!isZenMode && <Sidebar user={user} />}

                {/* Main Content Area */}
                <main className={`flex-1 overflow-y-auto custom-scrollbar relative ${isZenMode ? 'p-0' : ''}`}>
                    {/* Linha de Grade Sutil (Subpixel) - Agora em cinza suave */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    
                    <div className={`relative z-10 transition-all duration-500 ${
                        isZenMode 
                        ? 'max-w-none p-0' 
                        : 'p-8 md:p-12 lg:p-16 max-w-7xl mx-auto'
                    }`}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
