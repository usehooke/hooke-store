"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PackagePlus, ShoppingBag, Search, Store, Zap } from 'lucide-react';

/**
 * Hooke HQ: Titanium Bottom Navigation
 * Focado em Tablets e Acessibilidade (Público 60+)
 * Botões grandes, textos claros e feedback visual óbvio.
 */
export function AdminBottomNav() {
  const pathname = usePathname() || "";

  const navItems = [
    { label: 'Site', icon: Store, href: '/', color: 'bg-zinc-100' },
    { label: 'PDV', icon: Zap, href: '/admin/pdv', color: 'bg-zinc-100' },
    { label: 'Produtos', icon: PackagePlus, href: '/admin/produtos', color: 'bg-zinc-100' }, 
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black flex items-center justify-around px-2 h-24 md:h-28 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-95 ${
              isActive ? 'bg-black text-white' : 'text-zinc-400 hover:text-black'
            }`}
          >
            <Icon size={isActive ? 28 : 24} strokeWidth={isActive ? 3 : 2} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
      
      {/* Botão de Busca Especial (Gatilho para CMDK) */}
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
        className="flex flex-col items-center justify-center gap-1 w-full h-full text-zinc-400 hover:text-black active:scale-95"
      >
        <Search size={24} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Busca</span>
      </button>
    </nav>
  );
}
