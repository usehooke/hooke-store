'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MapPin, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { triggerHaptic } from '@/utils/haptics';

/**
 * HOOKE STORE: VAUTIER 142 FUNNEL - V15.0 ELITE EDITION
 * Aesthetic: Sharp-Soft Brutalism (Alabastro Depth)
 */

export default function Vautier142Funnel() {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleWhatsAppRedirect = async () => {
        if (!db) return;
        triggerHaptic('success');
        setIsLoading(true);
        try {
            const leadsRef = collection(db, 'artifacts/hooke-standalone-pwa/leads_vautier');
            await addDoc(leadsRef, {
                timestamp: Date.now(),
                origin: 'vautier_142',
                userAgent: navigator.userAgent
            });

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

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariant: Variants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen font-sans bg-hooke-paper selection:bg-black selection:text-white flex flex-col items-center justify-center p-6 md:p-12">
            
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="max-w-2xl w-full space-y-12"
            >
                {/* Visual Concierge Header */}
                <motion.div variants={itemVariant} className="text-center">
                    <div className="inline-flex items-center gap-4 px-10 py-5 bg-white border border-black/10 shadow-alabastro">
                        <MapPin size={12} className="text-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-black">Vautier Premium • 142</span>
                    </div>
                </motion.div>

                {/* THE MASSIVE CONCIERGE CARD */}
                <motion.div 
                    variants={itemVariant}
                    className="relative w-full bg-white border border-black shadow-sharp overflow-hidden flex flex-col items-center"
                >
                    <div 
                        className="w-full h-[400px] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000"
                        style={{ 
                            backgroundImage: 'url("https://www.usehooke.com.br/cdn/shop/files/camiseta-heavy-black.jpg")'
                        }}
                    />
                    
                    {/* Card Content Area */}
                    <div className="w-full px-12 py-16 text-center space-y-12 relative z-10 bg-white border-t border-black/5">
                        
                        <div className="space-y-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-400">Inventory Sync • Lote 001</span>
                            <h2 className="text-6xl md:text-7xl font-bold tracking-tighter text-black uppercase">
                                Arsenal VIP
                            </h2>
                            <p className="text-sm italic text-zinc-500 max-w-sm mx-auto">
                                Protocolo de reserva direta Rua Tiers 184. Experiência de atelier sob demanda.
                            </p>
                        </div>

                        {/* VIP WhatsApp Button */}
                        <button 
                            onClick={handleWhatsAppRedirect}
                            disabled={isLoading}
                            className="group w-full max-w-md mx-auto relative flex items-center justify-between p-10 bg-black text-white active:scale-[0.98] transition-all shadow-sharp border border-black"
                        >
                            <div className="flex items-center gap-6 relative z-10">
                                <Zap size={28} className="text-white fill-white" />
                                <div className="text-left">
                                    <span className="block text-[11px] font-black uppercase tracking-[0.3em] text-white">
                                        {isLoading ? 'Sincronizando...' : 'Acesso VIP Imediato'}
                                    </span>
                                    <span className="text-[9px] font-medium opacity-50 uppercase tracking-widest">Atendimento Direct Alpha</span>
                                </div>
                            </div>
                            <ArrowRight size={24} className="text-white group-hover:translate-x-2 transition-transform" />
                        </button>

                        {/* Trust Badges */}
                        <div className="flex justify-center gap-12 pt-4">
                            <div className="flex items-center gap-3 opacity-30">
                                <ShieldCheck size={16} />
                                <span className="text-[8px] font-black uppercase tracking-[0.4em]">Reserva Segura</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-30">
                                <FaInstagram size={16} />
                                <span className="text-[8px] font-black uppercase tracking-[0.4em]">@use.hooke</span>
                            </div>
                        </div>

                    </div>
                </motion.div>
                
                <motion.p variants={itemVariant} className="text-center text-[9px] font-black uppercase tracking-[0.8em] opacity-20">
                    Hooke Elite Systems • V15.0
                </motion.p>
            </motion.div>
        </div>
    );
}
