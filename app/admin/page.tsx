'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot, Timestamp, limit } from 'firebase/firestore';
import Link from 'next/link';
import { ShoppingBag, CupSoda, TrendingUp, Users, ArrowUpRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConciergeSession {
    id: string;
    startTime: Timestamp;
    hasLink: boolean;
    customerName?: string;
    lastProduct?: string;
    status: string;
}



export default function AdminDashboard() {
    const [ordersToday, setOrdersToday] = useState(0);
    const [conciergeSessions, setConciergeSessions] = useState<ConciergeSession[]>([]);

    useEffect(() => {
        if (!db) return;

        // 1. Buscar Pedidos de Hoje
        const fetchOrders = async () => {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const ts = Timestamp.fromDate(startOfDay);

            const q = query(collection(db!, 'pedidos'), where('createdAt', '>=', ts));
            const snapshot = await getDocs(q);
            setOrdersToday(snapshot.size);
        };

        // 2. Monitorar Concierge em tempo real
        const unsubscribeConcierge = onSnapshot(
            query(collection(db!, 'concierge_sessions'), where('status', '==', 'active'), limit(10)),
            (snapshot) => {
                const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConciergeSession));
                setConciergeSessions(sessions);
            }
        );

        fetchOrders();
        return () => unsubscribeConcierge();
    }, []);

    return (
        <div className="space-y-12">
            
            {/* Header / Welcome */}
            <div className="flex justify-between items-end">
                <div>
                    <span className="text-[10px] tracking-[0.5em] uppercase text-zinc-500 font-bold mb-2 block italic">Command Center • Hooke Elite</span>
                    <h1 className="text-5xl font-serif tracking-tighter text-[#FAFAFA]">Vision Dashboard</h1>
                </div>
                <div className="text-right">
                    <p className="text-[10px] tracking-widest text-zinc-500 uppercase font-black">Data do Ciclo</p>
                    <p className="text-lg font-mono text-[#FAFAFA]">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
            </div>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* MÉTRICA DE OURO: PEDIDOS HOJE */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0D0D0D] border border-white/[0.05] p-10 relative overflow-hidden group hover:border-white/[0.1] transition-all"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <ShoppingBag className="text-zinc-500" size={20} strokeWidth={1.5} />
                            <span className="text-[9px] font-black bg-green-500/10 text-green-500 px-2 py-1 uppercase tracking-tighter italic">+12% vs Ontem</span>
                        </div>
                        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-2">Pedidos de Hoje</h3>
                        <p className="text-7xl font-serif text-[#FAFAFA] tracking-tighter">{ordersToday}</p>
                    </div>
                    {/* Background Graphic Mockup */}
                    <div className="absolute right-[-20px] bottom-[-20px] text-white/[0.02] scale-[4] rotate-[10deg] pointer-events-none">
                        <ShoppingBag size={48} />
                    </div>
                </motion.div>

                {/* MÉTRICA: SESSÕES CONCIERGE */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0D0D0D] border border-white/[0.05] p-10 relative overflow-hidden group hover:border-white/[0.1] transition-all"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <CupSoda className="text-zinc-500" size={20} strokeWidth={1.5} />
                            <ArrowUpRight className="text-zinc-700" size={20} />
                        </div>
                        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-2">Concierge Ativo</h3>
                        <p className="text-7xl font-serif text-[#FAFAFA] tracking-tighter">{conciergeSessions.length}</p>
                    </div>
                </motion.div>

                {/* MÉTRICA: VISITANTES LIVE */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0D0D0D] border border-white/[0.05] p-10 relative overflow-hidden group hover:border-white/[0.1] transition-all"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <Users className="text-zinc-500" size={20} strokeWidth={1.5} />
                            <TrendingUp className="text-green-500/50" size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-2">Live Store</h3>
                        <p className="text-7xl font-serif text-[#FAFAFA] tracking-tighter">42</p>
                    </div>
                </motion.div>
            </div>

            {/* Central Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                
                {/* STATUS SUMMARY */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                        <h2 className="text-xs font-black tracking-[0.3em] uppercase text-[#FAFAFA] flex items-center gap-3">
                             Operação de Hoje
                        </h2>
                    </div>
                    <div className="bg-white/5 border border-white/[0.05] p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Sessões Concierge</span>
                            <span className="text-[#FAFAFA] font-mono">{conciergeSessions.length} Ativas</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Ticket Médio Est.</span>
                            <span className="text-[#FAFAFA] font-mono">R$ 185,00</span>
                        </div>
                        <Link 
                            href="/admin/concierge"
                            className="block w-full py-4 bg-white/5 border border-white/10 text-center text-[9px] font-black uppercase tracking-[0.3em] text-[#FAFAFA] hover:bg-white/10 transition-all"
                        >
                            Abrir Monitor Completo
                        </Link>
                    </div>
                </div>

                {/* AGENT GROWTH ACTIVITY FEED */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                        <h2 className="text-xs font-black tracking-[0.3em] uppercase text-[#FAFAFA] flex items-center gap-3">
                            <TrendingUp size={16} className="text-zinc-500" /> Agent-Growth Insights
                        </h2>
                    </div>
                    <div className="bg-white/5 border border-white/[0.05] p-8 space-y-4">
                        <div className="flex gap-4">
                            <Zap size={20} className="text-yellow-500 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-[11px] text-[#FAFAFA] font-bold uppercase tracking-widest">Oportunidade Detectada</p>
                                <p className="text-[10px] text-zinc-400 leading-relaxed font-light">&quot;O fluxo no Lounge está alto. Recomendo ativar o Agente Comercial para fechamento de pedidos manuais.&quot;</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
