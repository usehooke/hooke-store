'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MapPin, ArrowRight, ShieldCheck, Instagram, Zap } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

/**
 * HOOKE STORE: VAUTIER 142 FUNNEL - V6.0 ELITE EDITION
 * Aesthetic: Deep Alabaster Radial + Layered Neumorphism
 */

export default function Vautier142Funnel() {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleWhatsAppRedirect = async () => {
        if (!db) return;
        triggerHaptic('success');
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
            const message = encodeURIComponent("Olá Fernando! Estive na loja 142 e quero garantir meu item do Lote 001.");
            window.location.href = `https://wa.me/5511975902528?text=${message}`;
        } finally {
            setIsLoading(false);
        }
    };

    const staggerContainer: any = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariant: any = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen font-jost bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffffff] via-[#f5f5f5] to-[#e0e0e0] selection:bg-black selection:text-white flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
            
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="max-w-2xl w-full"
            >
                {/* Visual Concierge Header */}
                <motion.div variants={itemVariant} className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/40 backdrop-blur-md rounded-full shadow-[inset_4px_4px_10px_#d1d1d1,inset_-4px_-4px_10px_#ffffff] border border-white/50">
                        <MapPin size={14} className="text-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-black">ORIGEM: UNIDADE VAUTIER PREMIUM</span>
                    </div>
                </motion.div>

                {/* THE MASSIVE CONCIERGE CARD */}
                <motion.div 
                    variants={itemVariant}
                    className="relative w-full bg-[#F5F5F5] rounded-[4rem] shadow-[50px_50px_100px_#d1d1d1,-50px_-50px_100px_#ffffff] overflow-hidden flex flex-col items-center"
                >
                    {/* Ref 1 Image with Soft Gradient Mask */}
                    <div 
                        className="w-full h-[350px] bg-cover bg-center"
                        style={{ 
                            backgroundImage: 'url("https://www.usehooke.com.br/cdn/shop/files/camiseta-heavy-black.jpg")',
                            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
                        }}
                    />
                    
                    {/* Card Content Area */}
                    <div className="w-full px-10 pb-16 pt-4 text-center space-y-12 relative z-10 -mt-16">
                        
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-black leading-tight">
                                O Seu Arsenal VIP
                            </h2>
                            <p className="text-lg italic text-slate-500 font-serif">
                                Direct from Rua Tiers 184 to your home.
                            </p>
                        </div>

                        {/* VIP WhatsApp Button */}
                        <button 
                            onClick={handleWhatsAppRedirect}
                            disabled={isLoading}
                            className="group w-full max-w-sm mx-auto relative flex items-center justify-between p-8 rounded-[2rem] bg-[#0A0A0A] text-white overflow-hidden active:scale-95 transition-all shadow-[15px_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <Zap size={24} className="text-[#D4AF37]" />
                                <span className="text-[12px] font-black uppercase tracking-widest text-left text-white">
                                    {isLoading ? 'Processando...' : 'Acesso VIP Imediato'}
                                </span>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors relative z-10">
                                <ArrowRight size={20} className="text-white group-hover:text-[#D4AF37]" />
                            </div>
                            
                            {/* Golden Shimmer Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent skew-x-12" />
                        </button>

                        {/* Trust Badges */}
                        <div className="flex justify-center gap-10 pt-4 opacity-40">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Reserva Direta</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Instagram size={18} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">@use.hooke</span>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
