'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useCartStore, selectCartFinalTotal } from '@/store/cart-store';
import { motion, AnimatePresence } from 'framer-motion';
import { CupSoda, MessageCircle, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Gerador de ID Inteligente Hooke: HK-YYMMDD-XXXX
const generateHookeId = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
    const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `HK-${dateStr}-${randomHash}`;
};

export default function ConciergeLounge() {
    const router = useRouter();
    const { items } = useCartStore();
    const total = useCartStore(selectCartFinalTotal);

    // Estados de UX
    const [isTransitioning, setIsTransitioning] = useState(true); // Palate Cleanser
    const [stage, setStage] = useState<'analyzing' | 'preparing' | 'ready'>('analyzing');
    const [orderId] = useState(() => generateHookeId());
    const [customerName, setCustomerName] = useState('');
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Referência do primeiro item para o Shimmer
    const mainProduct = useMemo(() => items[0], [items]);

    const messages = {
        analyzing: "Iniciando sua curadoria personalizada...",
        preparing: "Preparando cada detalhe com a excelência Hooke.",
        ready: `Tudo pronto para você, ${customerName || 'Cliente Elite'}.`
    };

    // Efeito Palate Cleanser (Transição de 1.5s do Branco para Hooke-50)
    useEffect(() => {
        const timer = setTimeout(() => setIsTransitioning(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Geração do Checkout (Só inicia quando o nome estiver disponível ou se decidir pular)
    const handleStartExperience = useCallback(async () => {
        if (!items || items.length === 0) {
            router.push('/');
            return;
        }

        try {
            setStage('preparing');
            
            const response = await fetch('/api/checkout/mercado-pago', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    items, 
                    orderId,
                    customerName 
                }),
            });

            const data = await response.json();
            
            if (data.init_point) {
                setCheckoutUrl(data.init_point);
                // Simulação de tempo de "preparação de luxo" (Chá)
                setTimeout(() => setStage('ready'), 3500);
            } else {
                setError(data.error || 'Erro ao conectar com o provedor de pagamento.');
            }
        } catch (err) {
            console.error(err);
            setError('Falha na curadoria. Por favor, tente novamente.');
        }
    }, [items, orderId, customerName, router]);

    const handleWhatsAppConfirmation = () => {
        const productInfo = mainProduct ? `${mainProduct.name} - ${mainProduct.selectedSize}` : 'Curadoria';
        const text = `Olá, sou ${customerName || 'um Cliente Hooke'} e escolhi a Curadoria Hooke: ${productInfo}. Gostaria de confirmar meu pedido ${orderId} com um concierge.`;
        const url = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511375902528'}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-hooke-50 text-hooke-900 p-6">
                <div className="text-center space-y-4 max-w-md">
                    <h2 className="text-2xl font-serif">Ocorreu um imprevisto técnico</h2>
                    <p className="text-hooke-500 font-light">{error}</p>
                    <button onClick={() => window.location.reload()} className="underline tracking-widest text-xs uppercase">Tentar novamente</button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-hooke-50 text-hooke-900 font-sans overflow-hidden">
            
            {/* 🎞️ PALATE CLEANSER OVERLAY (Transição de Luxo) */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="fixed inset-0 bg-white z-[9999] flex items-center justify-center"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.2 }}
                            className="text-[40px] font-serif tracking-[1em] uppercase text-black"
                        >
                            Hooke
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center justify-center min-h-screen relative z-10">
                
                <AnimatePresence mode="wait">
                    {/* FASE 1: Coleta de Nome (Personalização) */}
                    {stage === 'analyzing' && !isTransitioning ? (
                        <motion.div 
                            key="name-collect"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-sm space-y-12 text-center"
                        >
                            <div className="space-y-4">
                                <span className="text-[10px] tracking-[0.4em] uppercase text-hooke-400">Welcome to Choice</span>
                                <h2 className="text-3xl font-serif italic">Como gostaria de ser chamado?</h2>
                            </div>
                            
                            <div className="relative border-b border-hooke-200">
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder="Seu nome ou apelido"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full py-4 bg-transparent outline-none text-center text-xl font-light placeholder:text-hooke-200"
                                    onKeyDown={(e) => e.key === 'Enter' && customerName.length > 2 && handleStartExperience()}
                                />
                            </div>

                            <button 
                                onClick={handleStartExperience}
                                disabled={customerName.length < 2}
                                className="w-full py-5 bg-hooke-900 text-white uppercase text-[10px] tracking-[0.3em] font-bold disabled:opacity-20 hover:bg-black transition-all"
                            >
                                Iniciar Atendimento
                            </button>
                        </motion.div>
                    ) : (stage === 'preparing' || stage === 'ready') ? (
                        <motion.div 
                            key="lounge-experience"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full max-w-xl space-y-12"
                        >
                            {/* Header Status */}
                            <div className="text-center space-y-6">
                                <div className="relative inline-block">
                                    <div className="w-20 h-20 border border-hooke-200 rounded-full flex items-center justify-center">
                                        {stage === 'preparing' ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 border-t border-hooke-900 rounded-full"
                                            />
                                        ) : (
                                            <Sparkles className="w-6 h-6 text-hooke-400 animate-pulse" />
                                        )}
                                        <CupSoda className={`w-6 h-6 ${stage === 'ready' ? 'text-hooke-900' : 'text-hooke-200'}`} strokeWidth={1} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-serif tracking-tight">{messages[stage]}</h1>
                                    <span className="text-[10px] tracking-[0.4em] uppercase text-hooke-400">Order ID: {orderId}</span>
                                </div>
                            </div>

                            {/* 🎞️ SHIMMER SILHOUETTE (Efeito sobre a imagem) */}
                            {mainProduct && (
                                <div className="relative group mx-auto w-48 h-64 shadow-xl">
                                    <Image 
                                        src={mainProduct.imageUrl} 
                                        alt={mainProduct.name}
                                        fill
                                        className="object-cover rounded-sm grayscale-[0.3]"
                                    />
                                    {/* Shimmer Overlay */}
                                    <motion.div 
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ 
                                            repeat: Infinity, 
                                            repeatDelay: 1, 
                                            duration: 1.8, 
                                            ease: "easeInOut" 
                                        }}
                                        className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                                    />
                                    <div className="absolute inset-0 border border-white/10 pointer-events-none" />
                                </div>
                            )}

                            {/* CTAs Finais */}
                            {stage === 'ready' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border p-10 space-y-8 shadow-sm backdrop-blur-xl bg-white/80"
                                >
                                    <div className="flex justify-between items-center bg-hooke-50 p-4">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-hooke-400">Investimento</span>
                                        <span className="text-2xl font-serif text-hooke-900">
                                            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <a 
                                            href={checkoutUrl || '#'} 
                                            className="flex items-center justify-center w-full py-6 bg-hooke-900 text-white font-bold tracking-[0.3em] text-[10px] hover:bg-black transition-all group"
                                        >
                                            PAGAR AGORA (SITE SEGURO)
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </a>

                                        <button 
                                            onClick={handleWhatsAppConfirmation}
                                            className="flex items-center justify-center w-full py-5 border border-hooke-900 text-hooke-900 text-[10px] font-bold tracking-[0.3em] hover:bg-hooke-900 hover:text-white transition-all"
                                        >
                                            <MessageCircle className="mr-2 w-4 h-4" />
                                            FALAR COM CONCIERGE (CONFIRMAÇÃO)
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center space-x-2 text-[9px] uppercase tracking-[0.2em] text-hooke-300">
                                        <Lock className="w-3 h-3" />
                                        <span>Criptografia Hooke Elite • 2026</span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : null}
                </AnimatePresence>

            </div>

            {/* Background Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[0]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            </div>
        </div>
    );
}
