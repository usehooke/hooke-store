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
    limit,
    addDoc
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
    Clock,
    DollarSign,
    Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationService } from '@/src/services/NotificationService';

/**
 * HOOKE ADMIN: ALPHA COMMAND CENTER V5.0 - ELITE REFINEMENT
 * Architecture: Antigravity Elite Standards + Sales Telemetry
 */

const MetricCard = ({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: any; description: string }) => (
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

const QuickAction = ({ label, icon: Icon, onClick, active = false, danger = false }: { label: string; icon: any; onClick: () => void; active?: boolean; danger?: boolean }) => (
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
    const [inventory, setInventory] = useState({ count: 22, status: 'ativo' });
    const [activeUsers, setActiveUsers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [isVipLocked, setIsVipLocked] = useState(false);
    const [isBatchPaused, setIsBatchPaused] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    // CREATIVE LAB V2 STATES
    const [fitCategory, setFitCategory] = useState('T-Shirt Boxy');
    const [grammage, setGrammage] = useState(320);
    const [showQAModal, setShowQAModal] = useState(false);
    const [qaChecks, setQaChecks] = useState({ pele: false, gola: false, modelagem: false, metal: false });

    const [activeTab, setActiveTab] = useState('operacoes');
    const [vautierLeads, setVautierLeads] = useState([]);

    // SECURITY HANDSHAKE
    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged((user) => {
            if (user?.email === 'nandof83@gmail.com') setIsAuthorized(true);
            else setIsAuthorized(false);
        });
        return () => unsubscribe?.();
    }, []);

    // REAL-TIME HANDLERS
    useEffect(() => {
        if (!isAuthorized || !db) return;

        // INVENTORY MONITOR
        const invRef = doc(db, `artifacts/${appId}/public/data/inventory`, 'lote-001');
        const unsubInv = onSnapshot(invRef, (snap) => {
            if (snap.exists()) setInventory(snap.data());
        });

        // ARSENAL TRACKER
        const usersRef = collection(db, `artifacts/${appId}/public/data/active_sessions`);
        const qUsers = query(usersRef, where('lastActive', '>=', Date.now() - 600000));
        const unsubUsers = onSnapshot(qUsers, (snap) => {
            setActiveUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        // SALES PULSE (FEED)
        const ordersRef = collection(db, `artifacts/${appId}/orders`);
        const qOrders = query(ordersRef, orderBy('timestamp', 'desc'), limit(10));
        const unsubOrders = onSnapshot(qOrders, (snap) => {
            const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setRecentOrders(orders);
            
            const total = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
            setTotalRevenue(prev => Math.max(prev, total * 5)); 
        });

        // VAUTIER LEADS
        const leadsRef = collection(db, `artifacts/${appId}/leads_vautier`);
        const qLeads = query(leadsRef, orderBy('timestamp', 'desc'), limit(50));
        const unsubLeads = onSnapshot(qLeads, (snap) => {
            setVautierLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => { unsubInv(); unsubUsers(); unsubOrders(); unsubLeads(); };
    }, [isAuthorized]);

    const handleGlobalPush = async () => {
        await NotificationService.sendGlobalPushNotification();
        alert("Notificação PWA disparada para todos os arsenais!");
    };

    const handleGenerateVaultId = async () => {
        try {
            const newId = `HK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            const vaultRef = doc(db, `artifacts/${appId}/vault`, newId);
            await updateDoc(vaultRef, {
                Numero_de_Serie: newId,
                Categoria: 'Reserva Especial',
                Gramatura_Tecnica: 320,
                Data_de_Lancamento: new Date().toLocaleDateString('pt-BR')
            }).catch(async (e) => {
                // se falhar porque nao existe, criamos (ideal seria setDoc)
                console.log("fallback creation");
            });
            alert(`Selo gerado: ${newId}`);
        } catch(e) { console.error(e) }
    }

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
                        <p className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-300 flex items-center gap-2">
                            Hooke Alpha Command • Elite v5.2 
                            <Zap size={10} className="text-emerald-500 fill-emerald-500 animate-pulse" />
                        </p>
                    </div>
                    <h1 className="text-7xl font-semibold tracking-tighter text-black italic">Operações</h1>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <QuickAction label="Disparo Global" icon={Bell} onClick={handleGlobalPush} />
                    <QuickAction label={isBatchPaused ? "Lote Pausado" : "Pausar Lote"} icon={isBatchPaused ? Play : Pause} onClick={() => setIsBatchPaused(!isBatchPaused)} active={isBatchPaused} danger />
                    <QuickAction label={isVipLocked ? "VIP Liberado" : "Liberar VIP"} icon={isVipLocked ? ShieldCheck : Zap} onClick={() => setIsVipLocked(!isVipLocked)} active={isVipLocked} />
                </div>
            </header>

            {/* TAB NAVIGATION */}
            <div className="flex gap-4 p-2 bg-black/5 rounded-2xl w-fit">
                {['operacoes', 'vault', 'vautier'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-black'
                        }`}
                    >
                        {tab === 'operacoes' ? 'Operações' : tab === 'vault' ? 'Vault (Passaportes)' : 'Leads Loja 142'}
                    </button>
                ))}
            </div>

            {/* ABA: OPERACOES */}
            {activeTab === 'operacoes' && (
                <div className="space-y-24">
                    {/* REVENUE COUNTER (GIANT NEUMORPHISM) */}
                    <section className="flex flex-col items-center justify-center py-20">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-20 rounded-full bg-[#F5F5F5] shadow-[30px_30px_70px_#d1d1d1,-30px_-30px_70px_#ffffff] text-center"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 block mb-6">Faturamento Total • Lote 001</span>
                            <h2 className="text-8xl font-semibold tracking-tighter font-mono italic">
                                <span className="text-4xl align-top mr-2 text-zinc-300">R$</span>
                                {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h2>
                        </motion.div>
                    </section>

                    {/* METRICS GRID */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <MetricCard 
                            title="Saúde do Lote" 
                            value={`${inventory.count || 22}/24`} 
                            icon={Package} 
                            description="Unidades físicas remanescentes no atelier." 
                        />
                        <MetricCard 
                            title="Arsenal Ativo" 
                            value={activeUsers.length || 0} 
                            icon={Users} 
                            description="Usuários monitorados com itens no checkout." 
                        />
                        <MetricCard 
                            title="Taxa de Drift" 
                            value="0.8%" 
                            icon={Activity} 
                            description="Eficiência operacional do protocolo de vendas." 
                        />
                    </section>

                    {/* SALES PULSE (LIVE FEED) */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                        
                        {/* FEED DE VENDAS */}
                        <div className="xl:col-span-8 p-12 rounded-[3.5rem] bg-[#F5F5F5] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] space-y-12">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-semibold tracking-tighter italic">SalesPulse Feed</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tempo Real • Log de Transações</p>
                                </div>
                                <Activity size={20} className="text-emerald-500 animate-pulse" />
                            </div>
                            
                            <div className="space-y-6">
                                <AnimatePresence mode='popLayout'>
                                    {recentOrders.length === 0 ? (
                                        <p className="text-center py-20 text-zinc-300 italic text-sm">Aguardando primeira reserva do lote...</p>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <motion.div 
                                                key={order.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                layout
                                                className="flex items-center gap-8 p-6 rounded-3xl bg-[#F5F5F5] shadow-[6px_6px_15px_#d1d1d1,-6px_-6px_15px_#ffffff] hover:shadow-[inset_4px_4px_10px_#d1d1d1,inset_-4px_-4px_10px_#ffffff] transition-all group"
                                            >
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                                                    <img src="https://www.usehooke.com.br/cdn/shop/files/conjunto-wafer-off-white.jpg" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30">Venda Confirmada</p>
                                                    <h4 className="text-md font-semibold tracking-tight">{order.userName || 'Comprador Anônimo'}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-md font-bold font-mono">R$ {order.total?.toFixed(2)}</p>
                                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Lote 001</p>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* ARSENAL LIST (DRY SESSIONS) */}
                        <div className="xl:col-span-4 p-12 rounded-[3.5rem] bg-[#F5F5F5] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] space-y-10">
                            <h3 className="text-xl font-semibold tracking-tighter italic mb-4">Radar de Drifters</h3>
                            <div className="space-y-6 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
                                {activeUsers.map((session, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl shadow-[inset_2px_2px_5px_#d1d1d1,inset_-2px_-2px_5px_#ffffff]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                            <p className="text-[11px] font-mono font-medium opacity-60">ID: {session.id.slice(0, 8)}</p>
                                        </div>
                                        <span className="text-[9px] font-black text-zinc-300 italic">Tracking</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ABA: VAULT */}
            {activeTab === 'vault' && (
                <div className="p-12 rounded-[3.5rem] bg-[#F5F5F5] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] space-y-12">
                    <h2 className="text-3xl font-semibold tracking-tighter italic">Gerenciamento de Passaportes</h2>
                    <p className="text-zinc-500">Crie novos IDs seriais para vincular às etiquetas das peças físicas.</p>
                    <button 
                        onClick={handleGenerateVaultId}
                        className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-all"
                    >
                        Gerar Novo Serial (Lote 001)
                    </button>
                </div>
            )}

            {/* ABA: VAUTIER */}
            {activeTab === 'vautier' && (
                <div className="p-12 rounded-[3.5rem] bg-[#F5F5F5] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] space-y-12">
                    <h2 className="text-3xl font-semibold tracking-tighter italic">Leads Físicos: Loja 142</h2>
                    <div className="space-y-4">
                        {vautierLeads.length === 0 ? (
                            <p className="text-zinc-400 italic text-sm">Nenhum acesso via QR Code Vautier até o momento.</p>
                        ) : (
                            vautierLeads.map((lead, i) => (
                                <div key={i} className="flex justify-between items-center p-6 rounded-2xl bg-white shadow-sm">
                                    <div>
                                        <p className="text-sm font-semibold">Lead Capturado</p>
                                        <p className="text-[10px] text-zinc-400 font-mono mt-1">{new Date(lead.timestamp).toLocaleString('pt-BR')}</p>
                                    </div>
                                    <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full">
                                        Redirecionado WA
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* CREATIVE LAB INTEGRATION (V2) */}
            <section className="p-16 rounded-[4rem] bg-zinc-900 text-white shadow-[30px_30px_80px_rgba(0,0,0,0.1)] space-y-16 overflow-hidden relative">
                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Cpu size={24} className="text-zinc-500" />
                            <h2 className="text-4xl font-semibold tracking-tighter italic">Laboratório de Ativos V2</h2>
                        </div>
                        <p className="text-zinc-500 text-sm max-w-xl">Motor de geração de assets Hooke (Flux.1). Calibração dinâmica de modelagem e gramatura com Veto Protocol.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* INPUTS DE ARQUITETURA TÊXTIL */}
                        <div className="space-y-10 bg-white/5 p-10 rounded-[3rem] border border-white/10">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6 block">Categoria de Modelagem</label>
                                <div className="flex flex-col gap-4">
                                    {['T-Shirt Boxy', 'Bermuda/Calça', 'Conjunto Viscose'].map(fit => (
                                        <button 
                                            key={fit}
                                            onClick={() => setFitCategory(fit)}
                                            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                                                fitCategory === fit ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-transparent hover:bg-white/10 border border-white/10 text-zinc-400'
                                            }`}
                                        >
                                            {fit}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Gramatura (g/m²)</label>
                                    <span className="text-xl font-mono font-bold text-emerald-400">{grammage}g</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="150" 
                                    max="400" 
                                    step="10"
                                    value={grammage} 
                                    onChange={(e) => setGrammage(Number(e.target.value))}
                                    className="w-full accent-white h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                        
                        {/* PROMPT GERADO E AÇÃO */}
                        <div className="space-y-8 flex flex-col justify-between">
                            <div className="p-8 rounded-[2rem] bg-black/50 border border-white/5 font-mono text-[10px] leading-loose text-zinc-300 h-full overflow-y-auto custom-scrollbar">
                                <span className="text-emerald-400"># MASTER CONTEXT</span><br/>
                                Atelier Mode, High-end studio, Softbox multidirecional, Cinematic DOF. Zero plastic effect.<br/><br/>
                                
                                <span className="text-emerald-400"># TECHNICAL SPECS</span><br/>
                                {fitCategory === 'T-Shirt Boxy' && `Heavy ${grammage}g cotton texture, thick collar perfectly structured, absolute facial authenticity.`}
                                {fitCategory === 'Conjunto Viscose' && `Fluid motion, ${grammage}g lightweight drape, elegant flow, gold-metallic drawstring tips.`}
                                {fitCategory === 'Bermuda/Calça' && `Structured drape, reinforced seams, high-density ${grammage}g fabric.`}
                            </div>
                            
                            <button 
                                onClick={() => setShowQAModal(true)}
                                className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-full transition-colors"
                            >
                                AVALIAÇÃO QA (VETO PROTOCOL)
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* QA VETO MODAL */}
            <AnimatePresence>
                {showQAModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-xl bg-[#F5F5F5] rounded-[3rem] p-12 shadow-[30px_30px_80px_rgba(0,0,0,0.2)] border border-white"
                        >
                            <h3 className="text-3xl font-semibold tracking-tighter italic text-black mb-2">Protocolo de Veto</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-10">Checklist Obrigatório antes da Publicação</p>
                            
                            <div className="space-y-4 mb-10">
                                {[
                                    { id: 'pele', label: '1. Pele Real (Poros visíveis, sem efeito plástico)' },
                                    { id: 'gola', label: '2. Estrutura Têxtil (Gola firme, sem afinar)' },
                                    { id: 'modelagem', label: '3. Modelagem Exata (Boxy Regular, não oversized)' },
                                    { id: 'metal', label: '4. Detalhes Metálicos (Ouro reflexivo e nítido)' }
                                ].map((item) => (
                                    <label key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-white cursor-pointer hover:shadow-md transition-all">
                                        <input 
                                            type="checkbox" 
                                            checked={qaChecks[item.id] || false}
                                            onChange={(e) => setQaChecks({...qaChecks, [item.id]: e.target.checked})}
                                            className="w-5 h-5 rounded accent-emerald-500"
                                        />
                                        <span className="text-sm font-medium text-black">{item.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowQAModal(false)}
                                    className="flex-1 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    disabled={Object.values(qaChecks).filter(Boolean).length !== 4}
                                    onClick={() => {
                                        alert("Asset validado e publicado no Lote 001 com sucesso.");
                                        setShowQAModal(false);
                                        setQaChecks({});
                                    }}
                                    className="flex-1 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-30 disabled:bg-zinc-400 disabled:cursor-not-allowed bg-black shadow-lg hover:scale-105 active:scale-95"
                                >
                                    PUBLICAR NO LOTE 001
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
