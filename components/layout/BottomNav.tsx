'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * BottomNav - A Barra de Navegação App-like (Hooke Elite).
 * Design Neumórfico, minimalista e focado no polegar (thumb-driven).
 */

const NAV_ITEMS = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'VIP', href: '/bazar-vip-hooke', icon: Heart },
    { name: 'Elite', href: '/wafer-elite', icon: ShoppingBag, highlight: true },
    { name: 'Perfil', href: '/login', icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-8 pt-4 bg-white/80 backdrop-blur-md border-t border-zinc-100 shadow-2xl">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} href={item.href} className="relative group">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`
                                    flex flex-col items-center justify-center p-3 transition-all duration-300
                                    ${item.highlight ? 'neumorph-btn shadow-neumorph-light rounded-full -translate-y-4 bg-black text-white' : 'text-zinc-500'}
                                    ${isActive && !item.highlight ? 'text-black' : ''}
                                `}
                            >
                                <Icon 
                                    size={item.highlight ? 24 : 20} 
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                    className={`${item.highlight ? 'text-white' : ''}`}
                                />
                                {!item.highlight && (
                                    <span className="text-[9px] mt-1 font-light uppercase tracking-widest">
                                        {item.name}
                                    </span>
                                )}

                                {isActive && !item.highlight && (
                                    <motion.div 
                                        layoutId="bottomNavDot"
                                        className="absolute -bottom-1 w-1 h-1 bg-black rounded-full"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
