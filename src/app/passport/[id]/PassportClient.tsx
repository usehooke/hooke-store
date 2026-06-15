'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { ShieldCheck, Share2, ArrowLeft, Fingerprint, Lock, Droplets, Wind } from 'lucide-react';
import Link from 'next/link';
import { triggerHaptic } from '@/utils/haptics';
import { VaultAsset } from './page';

interface PassportClientProps {
    vaultData: VaultAsset;
    vaultId: string;
}

export default function PassportClient({ vaultData, vaultId }: PassportClientProps) {
    const appId = 'hooke-standalone-pwa';
    const [isClaimed, setIsClaimed] = useState(false);
    const [isLoadingClaim, setIsLoadingClaim] = useState(false);

    // CLAIM ASSET (VINCULAÇÃO VIP)
    const handleClaimAsset = async () => {
        if (isClaimed || isLoadingClaim || !db || !auth) return;
        
        setIsLoadingClaim(true);
        try {
            // Haptic Feedback: Simula cofre destravando com sucesso
            triggerHaptic('success');

            // Autenticação anônima sob demanda se não estiver logado
            let currentUser = auth.currentUser;
            if (!currentUser) {
                const cred = await signInAnonymously(auth);
                currentUser = cred.user;
            }

            const userRef = doc(db, `artifacts/${appId}/users`, currentUser.uid);
            await updateDoc(userRef, {
                owned_assets: arrayUnion(vaultId)
            });
            
            setIsClaimed(true);
        } catch (err) {
            console.error("Falha ao vincular asset:", err);
            triggerHaptic('heavy');
            alert("Erro ao vincular ativo. Tente novamente.");
        } finally {
            setIsLoadingClaim(false);
        }
    };

    // WEB SHARE API
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
                        disabled={isClaimed || isLoadingClaim}
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
                                <span className="text-[11px] font-black uppercase tracking-[0.5em]">
                                    {isLoadingClaim ? 'Processando...' : 'Vincular ao Meu Arsenal'}
                                </span>
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
