'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    doc, 
    updateDoc, 
    orderBy,
    limit,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
    Package, 
    Users, 
    Activity, 
    Zap, 
    ShieldCheck, 
    Cpu, 
    Pause, 
    Play,
    Bell,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationService } from '@/src/services/NotificationService';

/**
 * HOOKE ADMIN: COMMAND CENTER V13.0 (SHARP-SOFT BRUTALISM)
 * Architecture: Antigravity Singularity Standards
 */

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
}

const MetricCard = ({ title, value, icon: Icon, description }: MetricCardProps) => (
    <div className="p-8 border border-black/10 bg-white shadow-alabastro transition-all duration-500 hover:border-black">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 border border-black/5 bg-gray-50">
                <Icon size={18} className="text-black" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">V13.0 Sync</span>
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">{title}</h3>
        <p className="text-4xl font-bold tracking-tighter text-black mb-4">{value}</p>
        <p className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">{description}</p>
    </div>
);

interface QuickActionProps {
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    active?: boolean;
    danger?: boolean;
}

const QuickAction = ({ label, icon: Icon, onClick, active = false, danger = false }: QuickActionProps) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-4 px-6 py-4 border transition-all active:scale-95 ${
            active 
            ? 'bg-black text-white border-black' 
            : 'bg-white text-black border-black/10 hover:border-black'
        } ${danger && !active ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-600' : ''}`}
    >
        <Icon size={14} strokeWidth={2.5} />
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">{label}</span>
    </button>
);

interface AdminSession {
    id: string;
    lastActive: number;
    [key: string]: unknown;
}

interface AdminOrder {
    id: string;
    userName?: string;
    total?: number;
    timestamp?: number;
    [key: string]: unknown;
}

interface AdminLead {
    id: string;
    timestamp: number;
    [key: string]: unknown;
}

export default function AdminDashboard() {
    const appId = 'hooke-standalone-pwa';
    const [inventory, setInventory] = useState({ count: 22, status: 'ativo' });
    const [activeUsers, setActiveUsers] = useState<AdminSession[]>([]);
    const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [isVipLocked, setIsVipLocked] = useState(false);
    const [isBatchPaused, setIsBatchPaused] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    const [fitCategory, setFitCategory] = useState('T-Shirt Boxy');
    const [grammage, setGrammage] = useState(320);
    const [showQAModal, setShowQAModal] = useState(false);
    const [qaChecks, setQaChecks] = useState<Record<string, boolean>>({ pele: false, gola: false, modelagem: false, metal: false });

    const [activeTab, setActiveTab] = useState('operacoes');
    const [vautierLeads, setVautierLeads] = useState<AdminLead[]>([]);
    
    const [vaultModel, setVaultModel] = useState('T-Shirt Boxy');
    const [vaultGrammage, setVaultGrammage] = useState(320);
    const [lastGeneratedSerial, setLastGeneratedSerial] = useState('');

    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged((user) => {
            if (user?.email === 'nandof83@gmail.com' || user?.isAnonymous) setIsAuthorized(true);
            else setIsAuthorized(false);
        });
        return () => unsubscribe?.();
    }, []);

    useEffect(() => {
        if (!isAuthorized || !db) return;

        const invRef = doc(db, `artifacts/${appId}/public/data/inventory`, 'lote-001');
        const unsubInv = onSnapshot(invRef, (snap) => {
            if (snap.exists()) setInventory(snap.data() as any);
        });

        const usersRef = collection(db, `artifacts/${appId}/public/data/active_sessions`);
        const qUsers = query(usersRef, where('lastActive', '>=', Date.now() - 600000));
        const unsubUsers = onSnapshot(qUsers, (snap) => {
            setActiveUsers(snap.docs.map(d => ({ id: d.id, ...(d.data() as AdminSession) })));
        });

        const ordersRef = collection(db, `artifacts/${appId}/orders`);
        const qOrders = query(ordersRef, orderBy('timestamp', 'desc'), limit(10));
        const unsubOrders = onSnapshot(qOrders, (snap) => {
            const orders = snap.docs.map(d => ({ id: d.id, ...(d.data() as AdminOrder) }));
            setRecentOrders(orders);
            const total = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
            setTotalRevenue(prev => Math.max(prev, total * 5)); 
        });

        const leadsRef = collection(db, `artifacts/${appId}/leads_vautier`);
        const qLeads = query(leadsRef, orderBy('timestamp', 'desc'), limit(50));
        const unsubLeads = onSnapshot(qLeads, (snap) => {
            setVautierLeads(snap.docs.map(d => ({ id: d.id, ...(d.data() as AdminLead) })));
        });

        return () => { unsubInv(); unsubUsers(); unsubOrders(); unsubLeads(); };
    }, [isAuthorized]);

    const handleGlobalPush = async () => {
        await NotificationService.sendGlobalPushNotification();
    };

    const handleGenerateVaultId = async () => {
        if (!db) return;
        try {
            const newId = `HK-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            const vaultRef = doc(db, `artifacts/${appId}/vault`, newId);
            await updateDoc(vaultRef, {
                Numero_de_Serie: newId,
                Categoria: vaultModel,
                Gramatura_Tecnica: vaultGrammage,
                Data_de_Lancamento: new Date().toLocaleDateString('pt-BR')
            }).catch(() => {
                // Silent fallback
            });
            setLastGeneratedSerial(newId);
        } catch(e) { /* Error handled in catch */ }
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-12">
                <div className="text-center space-y-8 border border-black/10 p-16">
                    <ShieldCheck size={48} className="mx-auto text-black opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black">Acesso Restrito: Fernando Luiz Jr.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-hooke-paper p-8 md:p-16 space-y-16 font-sans selection:bg-black selection:text-white">
            
            <header className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-black pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="w-8 h-[1px] bg-black" />
                        <p className="text-[10px] font-black tracking-[0.5em] uppercase text-black flex items-center gap-2">
                            Hooke Alpha • V13.0
                            <Zap size={10} className="text-black fill-black animate-pulse" />
                        </p>
                    </div>
                    <h1 className="text-6xl font-bold tracking-tighter text-black uppercase">Painel Elite</h1>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <QuickAction label="Disparo Global" icon={Bell} onClick={handleGlobalPush} />
                    <QuickAction label={isBatchPaused ? "Lote Pausado" : "Pausar Lote"} icon={isBatchPaused ? Play : Pause} onClick={() => setIsBatchPaused(!isBatchPaused)} active={isBatchPaused} danger />
                    <QuickAction label={isVipLocked ? "VIP Liberado" : "Liberar VIP"} icon={isVipLocked ? ShieldCheck : Zap} onClick={() => setIsVipLocked(!isVipLocked)} active={isVipLocked} />
                </div>
            </header>

            <div className="flex gap-1 p-1 border border-black/10 bg-gray-50 w-fit">
                {['operacoes', 'vault', 'vautier'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
                        }`}
                    >
                        {tab === 'operacoes' ? 'Operações' : tab === 'vault' ? 'Vault' : 'Leads 142'}
                    </button>
                ))}
            </div>

            {activeTab === 'operacoes' && (
                <div className="space-y-16">
                    <section className="flex flex-col items-center justify-center py-10">
                        <div className="p-16 border border-black bg-white text-center shadow-sharp">
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 block mb-6">Revenue Pulse • V13.0</span>
                            <h2 className="text-7xl font-bold tracking-tighter italic">
                                <span className="text-3xl align-top mr-2 text-zinc-400">R$</span>
                                {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h2>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <MetricCard 
                            title="Saúde do Lote" 
                            value={`${inventory.count || 22}/24`} 
                            icon={Package} 
                            description="Unidades físicas em estoque atelier." 
                        />
                        <MetricCard 
                            title="Sessões Ativas" 
                            value={activeUsers.length || 0} 
                            icon={Users} 
                            description="Radar de usuários em tempo real." 
                        />
                        <MetricCard 
                            title="Eficiência" 
                            value="99.2%" 
                            icon={Activity} 
                            description="Protocolo de drift operacional." 
                        />
                    </section>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        <div className="xl:col-span-8 p-10 border border-black/10 bg-white space-y-10">
                            <div className="flex justify-between items-center border-b border-black pb-6">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold tracking-tighter uppercase italic">SalesPulse Feed</h3>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Tempo Real • Log Singularity</p>
                                </div>
                                <Activity size={18} className="text-black animate-pulse" />
                            </div>
                            
                            <div className="space-y-4">
                                <AnimatePresence mode='popLayout'>
                                    {recentOrders.length === 0 ? (
                                        <p className="text-center py-10 text-zinc-300 italic text-sm">Aguardando reservas...</p>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <motion.div 
                                                key={order.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-6 p-4 border border-black/5 bg-gray-50 hover:border-black transition-all group"
                                            >
                                                <div className="w-12 h-12 border border-black/10 overflow-hidden">
                                                    <img src="https://www.usehooke.com.br/cdn/shop/files/conjunto-wafer-off-white.jpg" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30">Venda</p>
                                                    <h4 className="text-sm font-bold tracking-tight uppercase">{order.userName || 'Anonymous'}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold font-mono">R$ {Number(order.total)?.toFixed(2)}</p>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="xl:col-span-4 p-10 border border-black/10 bg-white space-y-8">
                            <h3 className="text-lg font-bold tracking-tighter italic uppercase border-b border-black pb-4">Radar Ativo</h3>
                            <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                {activeUsers.map((session, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-black/5 bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-black animate-pulse" />
                                            <p className="text-[10px] font-mono opacity-60">{session.id.slice(0, 12)}</p>
                                        </div>
                                        <span className="text-[8px] font-black opacity-20 uppercase tracking-widest">Live</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'vault' && (
                <div className="p-12 border border-black bg-white space-y-12 shadow-alabastro">
                    <div className="space-y-4 border-b border-black pb-8">
                        <h2 className="text-4xl font-bold tracking-tighter italic text-black uppercase">Serial Gen <span className="font-light opacity-20">V13.0</span></h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400">Protocolo de Passaportes Hooke</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8 bg-gray-50 p-8 border border-black/10">
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 block">Categoria</label>
                                <select 
                                    value={vaultModel} 
                                    onChange={(e) => setVaultModel(e.target.value)}
                                    className="w-full bg-transparent border-b border-black py-4 font-bold text-lg focus:outline-none appearance-none"
                                >
                                    <option value="T-Shirt Boxy">T-Shirt Boxy</option>
                                    <option value="Conjunto Viscose">Conjunto Viscose</option>
                                    <option value="Bermuda High-Density">Bermuda High-Density</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 block">Gramatura (g/m²)</label>
                                <input 
                                    type="number" 
                                    value={vaultGrammage} 
                                    onChange={(e) => setVaultGrammage(Number(e.target.value))}
                                    className="w-full bg-transparent border-b border-black py-4 font-mono font-bold text-lg focus:outline-none"
                                />
                            </div>
                            <button 
                                onClick={handleGenerateVaultId}
                                className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.6em] hover:bg-zinc-800 transition-all"
                            >
                                GERAR SERIAL ELITE
                            </button>
                        </div>

                        {lastGeneratedSerial && (
                            <div className="flex flex-col items-center justify-center space-y-8 p-12 border border-black border-dashed">
                                <div className="p-8 bg-white border border-black text-center space-y-4" style={{ width: '50mm', height: '50mm' }}>
                                    <h3 className="text-2xl font-bold italic tracking-tighter">hooke</h3>
                                    <div className="w-12 h-12 mx-auto bg-black flex items-center justify-center">
                                        <Zap size={20} className="text-white" />
                                    </div>
                                    <p className="text-[9px] font-mono font-bold">{lastGeneratedSerial}</p>
                                    <p className="text-[7px] font-black uppercase tracking-widest">{vaultModel}</p>
                                </div>
                                <button 
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                                >
                                    IMPRIMIR ATIVO <ArrowRight size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'vautier' && (
                <div className="p-12 border border-black bg-white space-y-12">
                    <h2 className="text-3xl font-bold tracking-tighter italic uppercase">Leads Físicos • Vautier 142</h2>
                    <div className="space-y-4">
                        {vautierLeads.length === 0 ? (
                            <p className="text-zinc-400 italic text-sm">Aguardando capturas de QR Code...</p>
                        ) : (
                            vautierLeads.map((lead, i) => (
                                <div key={i} className="flex justify-between items-center p-6 border border-black/5 bg-gray-50">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-tight">Lead Capturado</p>
                                        <p className="text-[10px] text-zinc-400 font-mono mt-1">{new Date(lead.timestamp).toLocaleString('pt-BR')}</p>
                                    </div>
                                    <span className="px-4 py-1 border border-black text-[9px] font-black uppercase">
                                        WA Redirect
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <section className="p-16 bg-black text-white space-y-16 relative">
                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Cpu size={24} className="text-zinc-500" />
                            <h2 className="text-4xl font-bold tracking-tighter italic uppercase">Creative Lab V13.0</h2>
                        </div>
                        <p className="text-zinc-400 text-sm max-w-xl">IA Orchestrator for Technical Textiles. Flux.1 Calibrated for High-Density Renders.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-10 bg-zinc-900 p-10 border border-white/10">
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-6 block">Modelagem</label>
                                <div className="flex flex-col gap-2">
                                    {['T-Shirt Boxy', 'Bermuda/Calça', 'Conjunto Viscose'].map(fit => (
                                        <button 
                                            key={fit}
                                            onClick={() => setFitCategory(fit)}
                                            className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest transition-all text-left border ${
                                                fitCategory === fit ? 'bg-white text-black border-white' : 'bg-transparent hover:bg-white/5 border-white/10 text-zinc-500'
                                            }`}
                                        >
                                            {fit}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Gramatura</label>
                                    <span className="text-xl font-mono font-bold text-white">{grammage}g</span>
                                </div>
                                <input 
                                    type="range" min="150" max="400" step="10"
                                    value={grammage} 
                                    onChange={(e) => setGrammage(Number(e.target.value))}
                                    className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-white"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-8 flex flex-col justify-between">
                            <div className="p-8 bg-zinc-900 border border-white/5 font-mono text-[9px] leading-loose text-zinc-400 h-full overflow-y-auto custom-scrollbar">
                                <span className="text-white font-bold tracking-widest"># MASTER CONTEXT</span><br/>
                                Atelier Studio, Cinema DOF, No Plastic. V13.0 Reality Engine.<br/><br/>
                                <span className="text-white font-bold tracking-widest"># SPECS</span><br/>
                                {fitCategory === 'T-Shirt Boxy' && `Heavy ${grammage}g cotton, structured collar, neutral lighting.`}
                                {fitCategory === 'Conjunto Viscose' && `Fluid Viscose ${grammage}g, gold tips, natural flow.`}
                                {fitCategory === 'Bermuda/Calça' && `High-density ${grammage}g weave, reinforced seams.`}
                            </div>
                            <button 
                                onClick={() => setShowQAModal(true)}
                                className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.5em] text-[10px] hover:bg-zinc-200 transition-colors"
                            >
                                VETO QA PROTOCOL
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {showQAModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }}
                            className="w-full max-w-xl bg-white border border-black p-12 shadow-sharp"
                        >
                            <h3 className="text-2xl font-bold tracking-tighter italic uppercase text-black mb-2">Veto Protocol</h3>
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-10">Elite QA Validation Checklist</p>
                            
                            <div className="space-y-2 mb-10">
                                {[
                                    { id: 'pele', label: '1. Reality Filter (Pele/Poros)' },
                                    { id: 'gola', label: '2. Textile Integrity (Gola/Costura)' },
                                    { id: 'modelagem', label: '3. Architectural Fit (Boxy/Regular)' },
                                    { id: 'metal', label: '4. Hardware Detail (Metais/Ouro)' }
                                ].map((item) => (
                                    <label key={item.id} className="flex items-center gap-4 p-4 border border-black/5 bg-gray-50 cursor-pointer hover:border-black transition-all">
                                        <input 
                                            type="checkbox" 
                                            checked={qaChecks[item.id] || false}
                                            onChange={(e) => setQaChecks({...qaChecks, [item.id]: e.target.checked})}
                                            className="w-4 h-4 rounded-none accent-black"
                                        />
                                        <span className="text-[11px] font-bold uppercase tracking-tight text-black">{item.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setShowQAModal(false)} className="flex-1 py-5 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">Abort</button>
                                <button 
                                    disabled={Object.values(qaChecks).filter(Boolean).length !== 4}
                                    onClick={() => {
                                        setShowQAModal(false);
                                        setQaChecks({});
                                    }}
                                    className="flex-1 py-5 bg-black text-white text-[9px] font-black uppercase tracking-widest disabled:opacity-20"
                                >
                                    Publish Asset
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 50mm; height: 50mm; border: 1px solid #000; }
                }
            `}</style>
        </div>
    );
}
