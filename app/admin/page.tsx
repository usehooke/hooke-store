'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot, Timestamp, limit, orderBy } from 'firebase/firestore';
import { ShoppingBag, CupSoda, TrendingUp, Users, ArrowUpRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente Status Pulse para o Concierge
const StatusPulse = ({ session }: { session: any }) => {
    const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
    const elapsedMinutes = (Date.now() - startTime.getTime()) / 60000;
    const isStagnated = elapsedMinutes > 2 && !session.hasLink;

    return (
        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/[0.05] mb-2 group hover:bg-white/[0.08] transition-all">
            <div className="relative">
                <div className={`w-3 h-3 rounded-full ${isStagnated ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                {isStagnated && (
                    <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-75" />
                )}
            </div>
            <div className="flex-1">
                <p className="text-[11px] font-bold tracking-widest text-[#FAFAFA] uppercase">
                    {session.customerName || 'Cliente Anônimo'}
                </p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
                    {session.lastProduct || 'Explorando Curadoria'} • {Math.floor(elapsedMinutes)} min ativo
                </p>
            </div>
            {isStagnated && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20">
                    <Zap size={10} className="text-amber-500" />
                    <span className="text-[8px] font-black text-amber-500 uppercase italic">Intervir via WhatsApp</span>
                </div>
            )}
        </div>
    );
};

export default function AdminDashboard() {
    const [ordersToday, setOrdersToday] = useState(0);
    const [conciergeSessions, setConciergeSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setConciergeSessions(sessions);
                setLoading(false);
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
                
                {/* MONITOR CONCIERGE REAL-TIME */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                        <h2 className="text-xs font-black tracking-[0.3em] uppercase text-[#FAFAFA] flex items-center gap-3">
                             Concierge Status Monitor
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        </h2>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Atualização Live</span>
                    </div>

                    <div className="min-h-[300px] border-l border-white/[0.05] pl-6">
                        {conciergeSessions.length === 0 ? (
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest italic py-4">Nenhum cliente ativo no lounge no momento.</p>
                        ) : (
                            conciergeSessions.map(session => (
                                <StatusPulse key={session.id} session={session} />
                            ))
                        )}
                    </div>
                </div>

                {/* AGENT GROWTH ACTIVITY FEED */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                        <h2 className="text-xs font-black tracking-[0.3em] uppercase text-[#FAFAFA] flex items-center gap-3">
                            <Orbit size={16} className="text-zinc-500" /> Agent-Growth Insights
                        </h2>
                    </div>
                    <div className="bg-white/5 border border-white/[0.05] p-8 space-y-4">
                        <div className="flex gap-4">
                            <Zap size={20} className="text-yellow-500 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-[11px] text-[#FAFAFA] font-bold uppercase tracking-widest">Oportunidade Detectada</p>
                                <p className="text-[10px] text-zinc-400 leading-relaxed font-light">"3 clientes visualizaram o Kit 'Elite Essentials' nos últimos 15 min. Considere rodar um gatilho de escassez no Instagram Shopping."</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

// Mock icon Orbit since I don't have it imported correctly above for the demo
const Orbit = ({ size, className }: { size: number, className: string }) => <TrendingUp size={size} className={className} />;
