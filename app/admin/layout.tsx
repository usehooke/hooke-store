'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
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
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-white text-[10px] tracking-[0.5em] uppercase animate-pulse font-light">
                    Hooke Command Center
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#FAFAFA] selection:text-black">
            <Toaster position="bottom-right" theme="dark" richColors />
            
            {/* HCC 2026 Architecture */}
            <div className="flex h-screen overflow-hidden">
                
                {/* Sidebar Fixo */}
                <Sidebar user={user} />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {/* Linha de Grade Sutil (Subpixel) */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                    
                    <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
