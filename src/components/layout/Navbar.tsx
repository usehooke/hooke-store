"use client";

import Link from 'next/link';
import { Menu, ShoppingBag, X, Search, User, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

/**
 * HOOKE ELITE: NAVBAR
 * Estética Sharp (0px radius) forçada via CSS global.
 * Limpeza de classes redundantes para higiene técnica.
 */

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const openCart = useCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    // ⚡ VERCEL EDGE OPTIMIZATION: Sincronização com IndexedDB
    setHydrated(useCartStore.persist.hasHydrated());
    const unsub = useCartStore.persist.onFinishHydration(() => setHydrated(true));
    
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsub();
    };
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Masculino', href: '/masculino' },
    { name: 'Feminino', href: '/feminino' },
    { name: 'Lançamento', href: '/lancamento', highlight: true },
  ];

  return (
    <>
      <nav 
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
          isScrolled ? "border-b border-gray-100 shadow-sm" : "border-b border-transparent"
        }`}
      >
        <div className="w-full px-6 md:px-12">
          <div className="flex justify-between items-center h-20">
            
            {/* 1. ESQUERDA */}
            <div className="flex-1 flex items-center justify-start">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-hooke-900 -ml-2 p-2 hover:text-gray-600 transition-colors"
                aria-label="Abrir Menu"
              >
                <Menu strokeWidth={1.5} size={24} />
              </button>

              <div className="hidden md:flex items-center gap-6 lg:gap-8">
                {navLinks.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`text-[11px] md:text-xs font-medium tracking-[0.2em] transition-colors flex items-center gap-1 ${
                      item.highlight 
                        ? "text-hooke-900 border-b-2 border-hooke-900 pb-0.5 font-heading"
                        : "text-hooke-900 hover:text-gray-500 font-heading"
                    }`}
                  >
                    {item.highlight && <Zap size={12} fill="currentColor" className="text-hooke-900" />}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. CENTRO - LOGO */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="group text-center relative z-10 inline-block cursor-pointer">
                <h1 className="font-heading text-4xl md:text-[2.75rem] font-bold tracking-[-0.05em] text-hooke-900 lowercase group-hover:tracking-[-0.02em] transition-all duration-500">
                  hooke
                </h1>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-hooke-900 group-hover:w-full transition-all duration-500" />
              </Link>
            </div>

            {/* 3. DIREITA */}
            <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">
              <button className="hidden md:block text-hooke-900 hover:text-gray-500 transition-colors">
                <Search strokeWidth={1.5} size={20} />
              </button>

              <Link href="/meus-pedidos" className="hidden md:flex text-hooke-900 hover:text-gray-500 transition-colors">
                <User strokeWidth={1.5} size={20} />
              </Link>

              <button 
                onClick={openCart}
                className="hidden md:flex relative text-hooke-900 hover:text-gray-500 transition-colors group p-1"
                aria-label="Abrir Sacola"
              >
                <ShoppingBag strokeWidth={1.5} size={20} />
                {hydrated && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-hooke-900 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* MENU MOBILE */}
      <div className={`fixed inset-0 z-50 flex ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className={`relative w-4/5 max-w-xs bg-white h-full shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="font-heading text-xl font-bold tracking-widest text-hooke-900 uppercase">Menu</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500">
              <X strokeWidth={1.5} size={24} />
            </button>
          </div>
          <div className="flex flex-col p-6 gap-6">
            
            {navLinks.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`text-xs font-bold tracking-[0.2em] font-heading flex items-center gap-2 ${
                  item.highlight ? "text-hooke-900 bg-gray-50 p-2 -ml-2 pl-4 border-l-2 border-hooke-900" : "text-hooke-900"
                }`}
              >
                {item.name}
                {item.highlight && <span className="bg-hooke-900 text-white text-[9px] px-1.5 py-0.5 ml-2">NOVO</span>}
              </Link>
            ))}

            <Link 
              href="/contato" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-xs font-bold tracking-[0.2em] font-heading text-hooke-900"
            >
              Fale Conosco
            </Link>
            <div className="h-px bg-gray-100 my-2" />
            <Link 
              href="/meus-pedidos" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-3 text-sm font-medium text-gray-600 font-heading tracking-wide"
            >
              <User size={18} /> Minha Conta
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
