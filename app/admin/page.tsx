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

        // 2. Monitorar Concierge em tempo real (Elite Sync)
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
        <div className="space-y-16">
            
            {/* Header / Command Center Welcome */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <span className="text-[9px] tracking-[0.5em] uppercase text-zinc-500 font-black mb-3 block italic opacity-60">Command Center • Hooke Advanced Architecture</span>
                    <h1 className="text-6xl font-serif tracking-tighter text-[#FAFAFA]">Vision Dashboard</h1>
                </div>
                <div className="text-right border-l md:border-l-0 md:border-r border-white/10 pr-6 pl-6 md:pr-6 md:pl-0">
                    <p className="text-[10px] tracking-widest text-zinc-600 uppercase font-black">Ciclo de Operação</p>
                    <p className="text-xl font-serif italic text-[#FAFAFA]">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Grid de Métricas Centralizado */}
            <MetricsGrid 
                ordersToday={ordersToday} 
                activeConcierge={conciergeSessions.length} 
            />

            {/* Inteligência Operacional & Feed */}
            <ActivityFeed 
                conciergeCount={conciergeSessions.length} 
            />

        </div>
    );
}
