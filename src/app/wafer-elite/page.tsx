'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import BottomNav from '@/components/layout/BottomNav';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

/**
 * Wafer Elite Launch Page - A Cúpula do E-commerce Hooke.
 * Mobile-First, Neumorphic, Imersivo.
 */

const PRODUCT_DATA = {
    id: 'wafer-elite-320g',
    name: 'Wafer Elite Black (320g)',
    price: 189.90,
    fabric: 'Wafer Tex 320g (Heavyweight)',
    description: 'Nossa peça mais pesada até hoje. Um tricô estruturado que mantém a forma original por anos. Modelagem "Sharp Boxy" e toque de algodão egípcio.',
    image: '/produtos/wafer-elite.png'
};

export default function WaferElitePage() {
    const { trackAction, pendingCount } = useOfflineSync();

    const handleAddToCart = () => {
        trackAction('ADD_TO_CART', PRODUCT_DATA.id);
        // Simulação de feedback Neumórfico
        alert("Adicionado com sucesso (Resiliência Offline Ativa!)");
    };

    return (
        <main className="min-h-screen bg-white text-black font-sans pb-32 overflow-x-hidden">
            {/* 1. HERO SECTION - IMERSÃO TOTAL */}
            <section className="relative w-full aspect-[3/4] md:aspect-video overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <Image 
                        src={PRODUCT_DATA.image}
                        alt={PRODUCT_DATA.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
                
                {/* Badge VIP Neumórfico Flutuante */}
                <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute top-8 right-8 bg-white/90 backdrop-blur shadow-neumorph-light px-4 py-2 text-[10px] uppercase tracking-[0.3em] font-medium"
                >
                    Elite Collection
                </motion.div>
            </section>

            {/* 2. PRODUCT INFO - MINIMALISMO GROTESCO */}
            <section className="px-8 -mt-12 relative z-10">
                <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 shadow-neumorph-light"
                >
                    <h1 className="text-3xl font-light tracking-tighter uppercase mb-2">
                        {PRODUCT_DATA.name}
                    </h1>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-xl font-medium tracking-tight">R$ {PRODUCT_DATA.price.toFixed(2)}</span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest border-l pl-4 border-zinc-200">
                            {PRODUCT_DATA.fabric}
                        </span>
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed font-light mb-8 max-w-lg">
                        {PRODUCT_DATA.description}
                    </p>

                    {/* BOTÃO NEUMÓRFICO DE AÇÃO */}
                    <button 
                        onClick={handleAddToCart}
                        className="w-full bg-black text-white py-5 flex items-center justify-center gap-3 neumorph-btn shadow-neumorph-dark active:shadow-neumorph-pressed group"
                    >
                        <ShoppingBag size={18} className="transition-transform group-hover:scale-110" />
                        <span className="text-[11px] uppercase tracking-[0.4em] font-medium">Reservar Agora</span>
                    </button>
                    
                    {pendingCount > 0 && (
                        <p className="text-[9px] text-zinc-400 mt-2 text-center italic">
                            {pendingCount} ações aguardando sincronização...
                        </p>
                    )}
                </motion.div>
            </section>

            {/* 3. TEXTURE DETAIL - FOCO NA QUALIDADE */}
            <section className="px-8 mt-16">
                <div className="border-t border-zinc-100 pt-12">
                    <h2 className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-8">Diferenciais Técnicos</h2>
                    <div className="grid grid-cols-1 gap-12">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="flex items-start gap-4"
                        >
                            <ShieldCheck className="text-zinc-300" size={24} />
                            <div>
                                <h3 className="text-xs uppercase font-medium mb-1">Estrutura True Potential</h3>
                                <p className="text-xs text-zinc-500 font-light leading-normal">
                                    O tecido de 320g garante que a camiseta não amasse e mantenha o volume &quot;boxy&quot; característico do streetwear de luxo.
                                </p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-50 p-6 flex flex-col items-center text-center">
                                <Truck size={20} className="mb-2 text-zinc-400" />
                                <span className="text-[9px] uppercase tracking-widest text-zinc-400">Entrega Expressa</span>
                            </div>
                            <div className="bg-zinc-50 p-6 flex flex-col items-center text-center">
                                <RefreshCw size={20} className="mb-2 text-zinc-400" />
                                <span className="text-[9px] uppercase tracking-widest text-zinc-400">Troca Grátis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BARRA DE NAVEGAÇÃO MOBILE (ELITE DESIGN) */}
            <BottomNav />
        </main>
    );
}
