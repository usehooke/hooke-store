'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { ShieldCheck, Share2, ArrowLeft, Fingerprint, Lock, Droplets, Wind } from 'lucide-react';
import Link from 'next/link';

/**
 * HOOKE PASSPORT: POST-PURCHASE VAULT
 * Aesthetic: Deep Slate Mode (#0A0A0A) + Cinematic Animation
 */

export default function PassportVault({ params }: { params: { id: string } }) {
    const appId = 'hooke-standalone-pwa';
    const vaultId = params.id;
    
    const [vaultData, setVaultData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isClaimed, setIsClaimed] = useState(false);

    // 1. INIT AUTH & FIRESTORE LISTENER
    useEffect(() => {
        if (!auth || !db) return;

        const initVault = async () => {
            try {
                // Autenticação anônima para permitir leitura e claim
                const cred = await signInAnonymously(auth as any);
                setUser(cred.user);

                // Vault Listener
                const vaultRef = doc(db, `artifacts/${appId}/vault`, vaultId);
                const unsub = onSnapshot(vaultRef, (snap) => {
                    if (snap.exists()) {
                        setVaultData(snap.data());
                    } else {
                        setVaultData(null); // Asset não encontrado
                    }
                    setIsLoading(false);
                });

                return () => unsub();
            } catch (err) {
                console.error("Erro no Vault:", err);
                setIsLoading(false);
            }
        };

        initVault();
    }, [vaultId]);

    // 2. CLAIM ASSET (VINCULAÇÃO VIP)
    const handleClaimAsset = async () => {
        if (!user || !vaultData || isClaimed || !db) return;
        
        try {
            // Haptic Feedback: Simula cofre destravando
            if (navigator.vibrate) navigator.vibrate([30, 10, 30, 10, 100]);

            const userRef = doc(db, `artifacts/${appId}/users`, user.uid);
            await updateDoc(userRef, {
                owned_assets: arrayUnion(vaultId)
            });
            
            setIsClaimed(true);
        } catch (err) {
            console.error("Falha ao vincular asset:", err);
            // Em caso de documento de usuário não existir, cria-lo seria o ideal na arquitetura real, 
            // assumiremos que o login inicial já garante a estrutura mínima.
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
                console.log("Compartilhamento cancelado ou falhou.");
            }
        } else {
            alert("Compartilhamento não suportado neste navegador. Copie o link da barra de endereços.");
        }
    };

    // UI RENDER HELPERS
    const renderAnimatedText = (text) => {
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
        return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="w-8 h-8 border-t-2 border-white/20 rounded-full animate-spin" /></div>;
    }

    if (!vaultData) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-white text-center">
                <Lock size={48} className="text-white/20 mb-8" />
                <h1 className="text-2xl font-bold tracking-tighter mb-4">Registro não encontrado</h1>
                <p className="text-sm text-white/50 max-w-xs mb-12">O código inserido não corresponde a nenhum ativo validado no cofre da Hooke.</p>
                <Link href="/" className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                    Retornar ao Arsenal
                </Link>
            </div>
        );
    }

    const grammage = Number(vaultData.Gramatura_Tecnica) || 0;
    const isHeavy = grammage >= 300;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-white selection:text-black pb-32">
            
            {/* Header */}
            <header className="p-8 flex justify-between items-center">
                <Link href="/" className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <button onClick={handleShare} className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Share2 size={20} />
                </button>
            </header>

            <main className="px-8 md:max-w-md md:mx-auto space-y-16 mt-8">
                
                {/* Autenticidade Visual */}
                <div className="text-center space-y-8">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mx-auto w-32 h-32 rounded-full bg-[#0f0f0f] shadow-[15px_15px_30px_#060606,-15px_-15px_30px_#141414,0_0_40px_rgba(212,175,55,0.15)] flex items-center justify-center border border-white/5 relative overflow-hidden"
                    >
                        <ShieldCheck size={40} className="text-[#D4AF37] relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/10 to-transparent animate-pulse" />
                    </motion.div>
                    
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">
                            {renderAnimatedText("Ativo Autenticado")}
                        </p>
                        <h1 className="text-4xl font-semibold tracking-tighter italic font-mono break-all">
                            {renderAnimatedText(vaultData.Numero_de_Serie)}
                        </h1>
                    </div>
                </div>

                {/* Vault Specs */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-[2rem] bg-[#0f0f0f] shadow-[inset_4px_4px_10px_#060606,inset_-4px_-4px_10px_#141414] border border-white/5 space-y-6"
                >
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Categoria</span>
                        <span className="text-sm font-semibold tracking-wide">{vaultData.Categoria}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Geometria Têxtil</span>
                        <span className="text-sm font-mono font-bold text-[#D4AF37]">{vaultData.Gramatura_Tecnica}g/m²</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Origem</span>
                        <span className="text-sm font-semibold tracking-wide">{vaultData.Data_de_Lancamento}</span>
                    </div>
                </motion.div>

                {/* Card de Preservação (UX adaptativa) */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="p-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10"
                >
                    <div className="flex items-center gap-4 mb-4">
                        {isHeavy ? <Wind size={20} className="text-white/70" /> : <Droplets size={20} className="text-white/70" />}
                        <h3 className="text-[11px] font-black uppercase tracking-widest">Protocolo de Preservação</h3>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">
                        {isHeavy 
                            ? "ESTRUTURA PESADA: Lavagem em ciclo suave com sabão neutro. Secagem horizontal à sombra para manter a arquitetura da gola e ombros."
                            : "FLUIDEZ SENSÍVEL: Lavagem delicada (preferencialmente manual). Evitar torção mecânica para proteger a trama de viscose."}
                    </p>
                </motion.div>

                {/* Claim Button */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
                    <button 
                        onClick={handleClaimAsset}
                        disabled={isClaimed}
                        className={`w-full py-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all ${
                            isClaimed 
                            ? "bg-[#1a1a1a] text-[#D4AF37] border border-[#D4AF37]/20 cursor-default"
                            : "bg-[#D4AF37] text-black hover:bg-[#b5952f] shadow-[0_10px_30px_rgba(212,175,55,0.2)] active:scale-95"
                        }`}
                    >
                        {isClaimed ? (
                            <>
                                <Fingerprint size={18} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Ativo Vinculado</span>
                            </>
                        ) : (
                            <>
                                <Lock size={18} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Vincular ao meu Perfil VIP</span>
                            </>
                        )}
                    </button>
                </motion.div>

            </main>
        </div>
    );
}
