"use client";

import Link from 'next/link';
import { Menu, ShoppingBag, X, Search, User, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import dynamic from "next/dynamic";
import { WorldCupMarquee } from "./WorldCupMarquee";

const SearchModal = dynamic(() => import("@/components/shop/SearchModal"), { ssr: false });

/**
 * HOOKE ELITE: NAVBAR
 * Estética Sharp (0px radius) forçada via CSS global.
 * Limpeza de classes redundantes para higiene técnica.
 */

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isBouncing, setIsBouncing] = useState(false);
  const openCart = useCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    // ⚡ VERCEL EDGE OPTIMIZATION: Sincronização com IndexedDB
    setHydrated(useCartStore.persist.hasHydrated());
    const unsub = useCartStore.persist.onFinishHydration(() => setHydrated(true));
    
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleEscape);
      unsub();
    };
  }, [isMobileMenuOpen]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (totalItems > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const navLinks = [
    { name: 'Masculino', href: '/masculino' },
    { name: 'Feminino', href: '/feminino' },
    { name: 'Lançamento', href: '/lancamento', highlight: true },
  ];

  return (
    <>
      <WorldCupMarquee />
      <header 
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
          isScrolled ? "border-b border-gray-100 shadow-sm" : "border-b border-transparent"
        }`}
      >
        <div className="w-full px-6 md:px-12">
          <nav className="flex justify-between items-center h-20" aria-label="Navegação Principal">
            
            {/* 1. ESQUERDA */}
            <div className="flex-1 flex items-center justify-start">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-hooke-900 -ml-2 w-11 h-11 flex items-center justify-center hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                aria-label="Abrir Menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu strokeWidth={1.5} size={24} aria-hidden="true" />
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
                <span className="font-heading text-4xl md:text-[2.75rem] font-bold tracking-[-0.05em] text-hooke-900 lowercase group-hover:tracking-[-0.02em] transition-all duration-500">
                  hooke
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-hooke-900 group-hover:w-full transition-all duration-500" />
              </Link>
            </div>

            {/* 3. DIREITA */}
            <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex w-11 h-11 items-center justify-center text-hooke-900 hover:text-gray-500 transition-colors"
                aria-label="Buscar"
              >
                <Search strokeWidth={1.5} size={20} />
              </button>

              <Link href="/meus-pedidos" aria-label="Minha Conta" className="hidden md:flex w-11 h-11 items-center justify-center text-hooke-900 hover:text-gray-500 transition-colors">
                <User strokeWidth={1.5} size={20} />
              </Link>

              <button 
                onClick={openCart}
                className={`hidden md:flex relative w-11 h-11 items-center justify-center text-hooke-900 hover:text-gray-500 transition-transform duration-200 group ${isBouncing ? 'scale-125' : 'scale-100'}`}
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

          </nav>
        </div>
      </header>

      {/* MENU MOBILE */}
      <div 
        className={`fixed inset-0 z-50 flex ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de Navegação Mobile"
      >
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
        <div className={`relative w-4/5 max-w-xs bg-white h-full shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="font-heading text-xl font-bold tracking-widest text-hooke-900 uppercase">Menu</h2>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label="Fechar Menu"
            >
              <X strokeWidth={1.5} size={24} aria-hidden="true" />
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
          {/* Busca no Menu Mobile */}
          <button
            onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
            className="flex items-center gap-3 text-sm font-medium text-gray-600 font-heading tracking-wide mt-2 mx-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <Search size={18} aria-hidden="true" /> Buscar Peças
          </button>
        </div>
      </div>

      {/* SEARCH MODAL GLOBAL */}
      <AnimatePresence>
        {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
