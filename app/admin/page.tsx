'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot, Timestamp, limit } from 'firebase/firestore';
import MetricsGrid from '@/components/admin/sections/MetricsGrid';
import ActivityFeed from '@/components/admin/sections/ActivityFeed';

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
    const [revenueToday, setRevenueToday] = useState(0);
    const [ordersInProgress, setOrdersInProgress] = useState(0);
    const [conciergeSessions, setConciergeSessions] = useState<ConciergeSession[]>([]);

    useEffect(() => {
        if (!db) return;

        // 1. Buscar Dados Operacionais do Dia
        const fetchDailyStats = async () => {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const ts = Timestamp.fromDate(startOfDay);

            const q = query(collection(db!, 'pedidos'), where('createdAt', '>=', ts));
            const snapshot = await getDocs(q);
            
            let total = 0;
            let inProgress = 0;
            
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                total += data.total || 0;
                // Consideramos 'pending', 'processing', 'shipped' como em andamento
                if (['pending', 'processing', 'shipped'].includes(data.status)) {
                    inProgress++;
                }
            });

            setOrdersToday(snapshot.size);
            setRevenueToday(total);
            setOrdersInProgress(inProgress);
        };

        // 2. Monitorar Concierge em tempo real
        const unsubscribeConcierge = onSnapshot(
            query(collection(db!, 'concierge_sessions'), where('status', '==', 'active'), limit(5)),
            (snapshot) => {
                const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConciergeSession));
                setConciergeSessions(sessions);
            }
        );

        fetchDailyStats();
        return () => unsubscribeConcierge();
    }, []);

    return (
        <div className="space-y-12">
            
            {/* Header / Command Center - Atelier Style */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="w-12 h-[1px] bg-black opacity-20" />
                        <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 font-bold">Protocolo Hooke • Alpha 0.1</p>
                    </div>
                    <h1 className="text-7xl font-serif tracking-tighter text-zinc-900">Visão Geral</h1>
                    <p className="text-sm text-zinc-400 max-w-md font-medium">Estação de trabalho operacional. Monitoramento de faturamento, logística e atendimento concierge em tempo real.</p>
                </div>
                
                <div className="flex flex-col items-end border-r border-black/5 pr-8 py-2">
                    <p className="text-[9px] tracking-widest text-zinc-400 uppercase font-black mb-1">Ciclo de Produção</p>
                    <p className="text-2xl font-serif italic text-zinc-900">
                        {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </p>
                </div>
            </div>

            {/* Grid Bento de Alta Densidade */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* Coluna Principal: Métricas e Performance */}
                <div className="xl:col-span-8 space-y-8">
                    <MetricsGrid 
                        ordersToday={ordersToday} 
                        revenueToday={revenueToday}
                        ordersInProgress={ordersInProgress}
                    />
                    
                    {/* Placeholder para Gráfico de Performance (Próximo Turno) */}
                    <div className="bg-white border border-black/[0.05] p-12 h-96 flex items-center justify-center relative overflow-hidden group">
                         <div className="text-center space-y-4">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-300 font-black">Performance Analytics</p>
                            <p className="text-zinc-200 text-xs italic">Módulo de Gráficos Recharts em fase de calibração...</p>
                         </div>
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Coluna Lateral: Concierge & Ações Rápidas */}
                <div className="xl:col-span-4">
                    <ActivityFeed 
                        conciergeCount={conciergeSessions.length} 
                        sessions={conciergeSessions}
                    />
                </div>

            </div>

        </div>
    );
}
