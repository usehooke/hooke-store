'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * HOOKE ELITE: BOTTOM NAVIGATION BAR (PWA Edition)
 * Estética: Neumorfismo Suave, Alabastro/Off-White e minimalismo extremo.
 */

const NAV_ITEMS = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explorar', href: '/colecao', icon: Compass },
    { name: 'Carrinho', href: '/checkout', icon: ShoppingBag },
    { name: 'Perfil VIP', href: '/login', icon: User },
];

export default function BottomNav() {
    const pathname = usePathname() || "";

    return (
        <nav aria-label="Navegação Principal Mobile" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F5F5F5]/80 backdrop-blur-md border-t border-white shadow-[0_-4px_10px_rgba(209,209,209,0.3)]">
            <div className="flex justify-between items-center px-6 py-4 max-w-md mx-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} href={item.href} aria-label={item.name} className="relative flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-sm">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`
                                    flex flex-col items-center justify-center transition-all duration-300
                                    ${isActive ? 'text-black scale-110' : 'text-zinc-400'}
                                `}
                            >
                                <Icon 
                                    size={22} 
                                    strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span className={`text-[8px] mt-1 font-bold uppercase tracking-[0.15em] ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                    {item.name}
                                </span>
                            </motion.div>
                            
                            {isActive && (
                                <motion.div 
                                    layoutId="bottomNavActive"
                                    className="absolute -top-4 w-1 h-1 bg-black rounded-none"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
