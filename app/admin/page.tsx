'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    doc, 
    updateDoc, 
    getDocs,
    Timestamp,
    orderBy,
    limit
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
    Package, 
    Users, 
    Activity, 
    Zap, 
    ShieldCheck, 
    Image as ImageIcon, 
    Cpu, 
    Pause, 
    Play,
    PlusCircle,
    BarChart3,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HOOKE ADMIN: ALPHA COMMAND CENTER V5.0
 * Architecture: Antigravity Elite Standards
 * Validation: Strict Founder-Led Access (nandof83@gmail.com)
 */

// 1. COMPONENTE DE MÉTRICA NEUMÓRFICA (SOFT-EXTRUSION)
const MetricCard = ({ title, value, icon: Icon, description }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="p-10 rounded-[3rem] bg-[#F5F5F5] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] transition-all duration-700"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="p-4 rounded-2xl shadow-[inset_4px_4px_10px_#d1d1d1,inset_-4px_-4px_10px_#ffffff]">
                <Icon size={20} className="text-zinc-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">Live Sync</span>
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">{title}</h3>
        <p className="text-4xl font-semibold tracking-tighter text-black mb-4">{value}</p>
        <p className="text-[10px] text-zinc-400 font-medium tracking-wide">{description}</p>
    </motion.div>
);

// 2. QUICK ACTION BUTTON (NEUMORPHIC INSET)
const QuickAction = ({ label, icon: Icon, onClick, active = false, danger = false }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-4 px-8 py-5 rounded-2xl transition-all active:scale-95 ${
            active 
            ? 'shadow-[inset_4px_4px_10px_#d1d1d1,inset_-4px_-4px_10px_#ffffff] text-black bg-white/50' 
            : 'shadow-[6px_6px_15px_#d1d1d1,-6px_-6px_15px_#ffffff] hover:shadow-[10px_10px_20px_#d1d1d1,-10px_-10px_20px_#ffffff] text-zinc-600 bg-[#F5F5F5]'
        } ${danger && !active ? 'hover:text-red-500' : ''}`}
    >
        <Icon size={16} strokeWidth={2.5} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
    </button>
);

export default function AdminDashboard() {
    const appId = 'hooke-standalone-pwa';
    const [inventory, setInventory] = useState({ current: 0, status: 'ativo' });
    const [activeUsers, setActiveUsers] = useState([]);
    const [isVipLocked, setIsVipLocked] = useState(false);
    const [isBatchPaused, setIsBatchPaused] = useState(false);
    const [labStyle, setLabStyle] = useState('Estúdio');
    const [isAuthorized, setIsAuthorized] = useState(false);

    // 1. SECURITY HANDSHAKE (nandof83@gmail.com)
    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged((user) => {
            if (user?.email === 'nandof83@gmail.com') {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        });
        return () => unsubscribe?.();
    }, []);

    // 2. REAL-TIME FIREBASE HANDLERS
    useEffect(() => {
        if (!isAuthorized || !db) return;

        // INVENTORY MONITOR
        const invRef = doc(db, `artifacts/${appId}/public/data/inventory`, 'lote-001');
        const unsubInv = onSnapshot(invRef, (snap) => {
            if (snap.exists()) setInventory(snap.data());
        });

        // ARSENAL TRACKER (Simulação de usuários ativos com itens no carrinho)
        // Nota: Em produção, isto escutaria uma coleção de 'active_sessions' ou similar
        const usersRef = collection(db, `artifacts/${appId}/public/data/active_sessions`);
        const q = query(usersRef, where('lastActive', '>=', Timestamp.now().toMillis() - 600000)); // Ultimos 10 min
        const unsubUsers = onSnapshot(q, (snap) => {
            setActiveUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => { unsubInv(); unsubUsers(); };
    }, [isAuthorized]);

    // 3. ACTION HANDLERS
    const toggleVipAccess = async () => {
        const newStatus = !isVipLocked;
        setIsVipLocked(newStatus);
        const configRef = doc(db, `artifacts/${appId}/public/data/config`, 'global');
        await updateDoc(configRef, { vipAccessLocked: newStatus });
    };

    const toggleBatchPause = async () => {
        const newStatus = !isBatchPaused;
        setIsBatchPaused(newStatus);
        const configRef = doc(db, `artifacts/${appId}/public/data/config`, 'inventory');
        await updateDoc(configRef, { pauseBatch: newStatus });
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-12">
                <div className="text-center space-y-8">
                    <ShieldCheck size={48} className="mx-auto text-red-500 opacity-20" />
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">Acesso Restrito: Fernando Luiz Jr.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] p-12 md:p-24 space-y-24 font-sans selection:bg-black selection:text-white">
            
            {/* COMMAND CENTER HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-black/[0.03] pb-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-[1px] bg-black opacity-10" />
                        <p className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-300">Hooke Alpha Command • Elite v5.0</p>
                    </div>
                    <h1 className="text-7xl font-semibold tracking-tighter text-black italic">Operações</h1>
                </div>
                <div className="flex gap-4">
                    <QuickAction label={isBatchPaused ? "Lote Pausado" : "Pausar Lote"} icon={isBatchPaused ? Play : Pause} onClick={toggleBatchPause} active={isBatchPaused} danger />
                    <QuickAction label={isVipLocked ? "VIP Liberado" : "Liberar VIP"} icon={isVipLocked ? ShieldCheck : Zap} onClick={toggleVipAccess} active={isVipLocked} />
                </div>
            </header>

            {/* METRICS GRID */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <MetricCard 
                    title="Saúde do Lote" 
                    value={`${inventory.count || 22}/24`} 
                    icon={Package} 
                    description="Unidades físicas remanescentes no atelier em tempo real." 
                />
                <MetricCard 
                    title="Arsenal Ativo" 
                    value={activeUsers.length || 0} 
                    icon={Users} 
                    description="Usuários com peças no carrinho nos últimos 10 minutos." 
                />
                <MetricCard 
                    title="Taxa de Drift" 
                    value="1.2%" 
                    icon={Activity} 
                    description="Divergência entre intenção de compra e finalização." 
                />
            </section>

            {/* INVENTORY CHART & ARSENAL LIST */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                
                {/* ESTOQUE NEUMÓRFICO (VISUAL) */}
                <div className="xl:col-span-8 p-12 rounded-[3.5rem] bg-[#F5F5F5] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] space-y-12">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold tracking-tighter italic">Fluxo de Inventário</h3>
                        <BarChart3 size={20} className="opacity-10" />
                    </div>
                    
                    <div className="flex items-end gap-6 h-64 px-4 border-b border-black/[0.02]">
                        {[0.8, 0.6, 0.9, 0.4, 0.7, 0.3, 0.5, 0.9, 0.6].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h * 100}%` }}
                                className="flex-1 rounded-t-2xl shadow-[inset_4px_4px_10px_#d1d1d1,inset_-4px_-4px_10px_#ffffff] bg-zinc-100/50 relative group"
                            >
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity rounded-t-2xl" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ARSENAL TRACKER LIST */}
                <div className="xl:col-span-4 p-12 rounded-[3.5rem] bg-[#F5F5F5] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] space-y-10">
                    <h3 className="text-xl font-semibold tracking-tighter italic mb-4">Sessões em Aberto</h3>
                    <div className="space-y-6 overflow-y-auto max-h-[350px] pr-4 custom-scrollbar">
                        {activeUsers.length === 0 ? (
                            <div className="py-20 text-center opacity-10">
                                <Clock size={40} className="mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Nenhum Drifter Ativo</p>
                            </div>
                        ) : (
                            activeUsers.map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-2xl shadow-[inset_2px_2px_5px_#d1d1d1,inset_-2px_-2px_5px_#ffffff]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                        <p className="text-[11px] font-mono font-medium opacity-60">ID: {session.id.slice(0, 8)}</p>
                                    </div>
                                    <span className="text-[9px] font-black text-zinc-300">2m atrás</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* CREATIVE LAB INTEGRATION */}
            <section className="p-16 rounded-[4rem] bg-zinc-900 text-white shadow-[30px_30px_80px_rgba(0,0,0,0.1)] space-y-16 overflow-hidden relative">
                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Cpu size={24} className="text-zinc-500" />
                            <h2 className="text-4xl font-semibold tracking-tighter italic">Laboratório de Ativos</h2>
                        </div>
                        <p className="text-zinc-500 text-sm max-w-xl">Motor de geração de assets Hooke. Treinado na Referência 1 (Fernando). Prepare os ensaios para o próximo drop.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="p-12 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-6 hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="p-6 rounded-full bg-white/5 group-hover:scale-110 transition-transform">
                                <PlusCircle size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Drop Assets Here</p>
                        </div>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6 block">Estilo de Ensaio</label>
                                <div className="flex flex-wrap gap-4">
                                    {['Estúdio', 'Urbano', 'Praia', 'Noturno'].map(style => (
                                        <button 
                                            key={style}
                                            onClick={() => setLabStyle(style)}
                                            className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                                labStyle === style 
                                                ? 'bg-white text-black' 
                                                : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                            }`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                                CALIBRAR PROMPT IA
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* BACKGROUND DECOR */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.02] blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            </section>

        </div>
    );
}
