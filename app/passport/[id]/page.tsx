'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { ShieldCheck, Share2, ArrowLeft, Fingerprint, Lock, Droplets, Wind } from 'lucide-react';
import Link from 'next/link';
import { triggerHaptic } from '@/src/utils/haptics';

/**
 * HOOKE PASSPORT: POST-PURCHASE VAULT
 * Aesthetic: Deep Slate Mode (#0A0A0A) + Cinematic Animation (Neumorfismo 4.0)
 * Core V10.0: Strict Types, Async Params, Offline-First Resiliency
 */

export interface VaultAsset {
    id?: string;
    Numero_de_Serie: string;
    Categoria: string;
    Gramatura_Tecnica: number;
    Data_de_Lancamento: string;
    owner_id?: string;
}

export interface UserRecord {
    uid: string;
    owned_assets?: string[];
}

export default function PassportVault({ params }: { params: Promise<{ id: string }> }) {
    const appId = 'hooke-standalone-pwa';
    
    // Async Params para Next.js 16
    const { id: vaultId } = React.use(params);
    
    const [vaultData, setVaultData] = useState<VaultAsset | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserRecord | null>(null);
    const [isClaimed, setIsClaimed] = useState(false);

    // 1. INIT AUTH & FIRESTORE LISTENER
    useEffect(() => {
        if (!auth || !db) return;

        const initVault = async () => {
            // Guarda de tipo: TS perde narrowing em funções async aninhadas
            if (!auth) {
                console.error("Firebase Auth não inicializado.");
                setIsLoading(false);
                return;
            }
            if (!db) {
                console.error("Firebase DB não inicializado.");
                setIsLoading(false);
                return;
            }

            try {
                // Agora o TS sabe que 'auth' e 'db' não são null
                const cred = await signInAnonymously(auth);
                setUser({ uid: cred.user.uid });

                // Vault Listener
                const vaultRef = doc(db, `artifacts/${appId}/vault`, vaultId);
                const unsub = onSnapshot(vaultRef, (snap) => {
                    if (snap.exists()) {
                        setVaultData(snap.data() as VaultAsset);
                    } else {
                        setVaultData(null); // Asset não encontrado
                    }
                    setIsLoading(false);
                });

                return () => unsub();
            } catch (err) {
                console.error("Erro no Vault:", err);
                triggerHaptic('heavy');
                setIsLoading(false);
            }
        };

        initVault();
    }, [vaultId]);

    // 2. CLAIM ASSET (VINCULAÇÃO VIP)
    const handleClaimAsset = async () => {
        if (!user || !vaultData || isClaimed || !db || !auth) return;
        
        try {
            // Haptic Feedback: Simula cofre destravando com sucesso
            triggerHaptic('success');

            const userRef = doc(db, `artifacts/${appId}/users`, user.uid);
            await updateDoc(userRef, {
                owned_assets: arrayUnion(vaultId)
            });
            
            setIsClaimed(true);
        } catch (err) {
            console.error("Falha ao vincular asset:", err);
            triggerHaptic('heavy');
            // Em caso de documento de usuário não existir, cria-lo seria o ideal na arquitetura real
        }
    };

    // 3. WEB SHARE API
    const handleShare = async () => {
        if (navigator.share && vaultData) {
            try {
                await navigator.share({
                    title: `Hooke Passport: ${vaultData.Categoria}`,
                    text: `Verifique a autenticidade do meu Lote 001. Serial: ${vaultData.Numero_de_Serie}`,
                    url: window.location.href,
                });
            } catch (err) {
                // Silently fail on share cancellation or unsupported platform
            }
        } else {
            alert("Compartilhamento não suportado neste navegador. Copie o link da barra de endereços.");
        }
    };

    // UI RENDER HELPERS
    const renderAnimatedText = (text: string) => {
        return text.split('').map((char, index) => (
            <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="inline-block"
            >
                {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ));
    };

    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-12 h-12 border border-white/20 border-t-white animate-spin" /></div>;
    }

    if (!vaultData) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-white text-center">
                <div className="p-8 border border-white/10 mb-12">
                    <Lock size={48} className="text-white/20" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase mb-4 italic">Cofre Vazio</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 max-w-xs mb-12">O serial inserido não corresponde a nenhum ativo validado no protocolo Hooke.</p>
                <Link href="/" className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-zinc-200 transition-colors border border-white">
                    Retornar ao Arsenal
                </Link>
            </div>
        );
    }

    const grammage = Number(vaultData.Gramatura_Tecnica) || 0;
    const isHeavy = grammage >= 300;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pb-32">
            
            {/* Header */}
            <header className="p-8 flex justify-between items-center border-b border-white/5">
                <Link href="/" className="p-4 border border-white/10 hover:bg-white hover:text-black transition-all">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.6em]">Hooke Passport</span>
                    <span className="text-[8px] font-medium uppercase tracking-[0.4em] opacity-30">V15.0 Elite</span>
                </div>
                <button onClick={handleShare} className="p-4 border border-white/10 hover:bg-white hover:text-black transition-all">
                    <Share2 size={20} />
                </button>
            </header>

            <main className="px-8 md:max-w-xl md:mx-auto space-y-16 mt-16">
                
                {/* Autenticidade Visual */}
                <div className="text-center space-y-10">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto w-40 h-40 bg-zinc-900 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] flex items-center justify-center relative group"
                    >
                        <ShieldCheck size={48} className="text-[#D4AF37] relative z-10" />
                        <div className="absolute inset-0 border border-[#D4AF37]/10 animate-pulse scale-110" />
                    </motion.div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <span className="w-10 h-[1px] bg-[#D4AF37]/30" />
                            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#D4AF37]">
                                Ativo Validado
                            </p>
                            <span className="w-10 h-[1px] bg-[#D4AF37]/30" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic break-all leading-none">
                            {vaultData.Numero_de_Serie}
                        </h1>
                    </div>
                </div>

                {/* Vault Specs */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-10 bg-zinc-900 border border-white/10 shadow-sharp space-y-8"
                >
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Categoria</span>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">{vaultData.Categoria}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Gramatura Têxtil</span>
                        <span className="text-xs font-mono font-black text-[#D4AF37]">{vaultData.Gramatura_Tecnica} G/M²</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Data de Registro</span>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">{vaultData.Data_de_Lancamento}</span>
                    </div>
                </motion.div>

                {/* Card de Preservação */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="p-10 bg-zinc-900 border-l-2 border-[#D4AF37] border-y border-r border-white/5 space-y-6"
                >
                    <div className="flex items-center gap-4">
                        {isHeavy ? <Wind size={18} className="text-[#D4AF37]" /> : <Droplets size={18} className="text-[#D4AF37]" />}
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Manutenção de Acervo</h3>
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-widest font-medium">
                        {isHeavy 
                            ? "Estrutura Heavy-Weight: Lavagem a frio. Secagem plana em ambiente controlado. Evitar exposição direta UV para preservar a integridade da fibra."
                            : "Estrutura Light-Fluid: Higienização manual obrigatória. Secagem suspensa sem torção. Proteção térmica máxima na passagem."}
                    </p>
                </motion.div>

                {/* Claim Button */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
                    <button 
                        onClick={handleClaimAsset}
                        disabled={isClaimed}
                        className={`w-full py-8 flex items-center justify-center gap-6 transition-all border ${
                            isClaimed 
                            ? "bg-zinc-950 text-[#D4AF37] border-[#D4AF37]/20 cursor-default"
                            : "bg-[#D4AF37] text-black hover:bg-white hover:text-black hover:border-white border-black active:scale-[0.98] shadow-sharp"
                        }`}
                    >
                        {isClaimed ? (
                            <>
                                <Fingerprint size={20} />
                                <span className="text-[11px] font-black uppercase tracking-[0.5em]">Ativo Vinculado ao Perfil</span>
                            </>
                        ) : (
                            <>
                                <Lock size={20} />
                                <span className="text-[11px] font-black uppercase tracking-[0.5em]">Vincular ao Meu Arsenal</span>
                            </>
                        )}
                    </button>
                </motion.div>

                <p className="text-center text-[8px] font-black uppercase tracking-[1em] opacity-10 pt-10">
                    Hooke Digital Assets • Blockchain Verified
                </p>

            </main>
        </div>
    );
}
}
