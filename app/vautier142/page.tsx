'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MapPin, ArrowRight, ShieldCheck, Instagram, Zap } from 'lucide-react';

/**
 * HOOKE STORE: VAUTIER 142 FUNNEL
 * Aesthetic: Neumorphic Alabastro (Light Mode)
 */

export default function Vautier142Funnel() {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleWhatsAppRedirect = async () => {
        if (!db) return;
        setIsLoading(true);
        try {
            // 1. Registrar Lead no Firestore
            const leadsRef = collection(db as any, 'artifacts/hooke-standalone-pwa/leads_vautier');
            await addDoc(leadsRef, {
                timestamp: Date.now(),
                origin: 'vautier_142',
                userAgent: navigator.userAgent
            });

            // 2. Redirecionar WhatsApp
            const message = encodeURIComponent("Olá Fernando! Estive na loja 142 e quero garantir meu item do Lote 001.");
            const whatsappUrl = `https://wa.me/5511975902528?text=${message}`;
            window.location.href = whatsappUrl;
        } catch (err) {
            console.error("Erro ao registrar lead:", err);
            // Redireciona mesmo em caso de erro no analytics
            const message = encodeURIComponent("Olá Fernando! Estive na loja 142 e quero garantir meu item do Lote 001.");
            window.location.href = `https://wa.me/5511975902528?text=${message}`;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] font-sans selection:bg-black selection:text-white flex flex-col items-center justify-center p-8">
            
            {/* Visual Concierge Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full shadow-[inset_4px_4px_10px_#d1d1d1,inset_-4px_-4px_10px_#ffffff] border border-white/50"
            >
                <MapPin size={14} className="text-black" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">ORIGEM: VAUTIER PREMIUM - LOJA 142</span>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-md w-full text-center space-y-12 relative">
                
                {/* Neumorphic Logo Sphere */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto w-32 h-32 rounded-full bg-[#F5F5F5] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] flex items-center justify-center mb-12"
                >
                    <h1 className="text-3xl font-bold tracking-tighter italic text-black">hooke</h1>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-4">
                    <h2 className="text-4xl font-semibold tracking-tighter text-black leading-tight">
                        Acesso Restrito ao <br/><span className="italic font-light">Lote 001</span>
                    </h2>
                    <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
                        Você está no centro de distribuição da Hooke. Confirme seu interesse diretamente com o fundador.
                    </p>
                </motion.div>

                {/* Call to Action */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <button 
                        onClick={handleWhatsAppRedirect}
                        disabled={isLoading}
                        className="group w-full relative flex items-center justify-between p-8 rounded-[2rem] bg-black text-white overflow-hidden active:scale-95 transition-all shadow-[15px_15px_40px_rgba(0,0,0,0.15)] disabled:opacity-50"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <Zap size={20} className="text-emerald-400" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-left">
                                {isLoading ? 'Processando...' : 'Acessar Arsenal via WhatsApp'}
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors relative z-10">
                            <ArrowRight size={18} />
                        </div>
                        
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                    </button>
                </motion.div>

                {/* Trust Badges */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="flex justify-center gap-8 pt-8 opacity-40"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Reserva Imediata</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Instagram size={16} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">@use.hooke</span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
