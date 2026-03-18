"use client";

import { Standard } from "@typebot.io/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Menu, X, LayoutDashboard, ShoppingBag, Store, User, Settings } from "lucide-react";

export default function PersonalHookePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Efeito para simular o tempo de carregamento inicial do widget
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { label: "Dashboard Admin", href: "/admin", icon: LayoutDashboard },
    { label: "PDV Hooke", href: "/admin/pdv", icon: Store },
    { label: "Meus Produtos", href: "/admin/produtos", icon: ShoppingBag },
    { label: "Voltar para a Loja", href: "/", icon: ArrowLeft },
  ];

  return (
    <div className="relative w-full h-[100dvh] bg-[#0a0a0a] flex flex-col overscroll-none overflow-hidden text-white">
      
      {/* HEADER / TOP CONTROLS */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
        
        {/* Botão de Menu (Atalhos de Rotina) */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="pointer-events-auto bg-white/10 backdrop-blur-xl p-3 rounded-full border border-white/10 shadow-xl transition-all hover:bg-white/20 active:scale-90"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Status discreto */}
        <div className="bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 text-[10px] uppercase tracking-[0.2em] font-medium text-white/40">
          Personal Assistant Mode
        </div>
      </div>

      {/* SIDEBAR (ATALHOS DE ROTINA) */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-[60] flex animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsSidebarOpen(false)} 
          />
          <div className="relative w-[85%] max-w-sm bg-[#111] h-full shadow-2xl border-r border-white/5 p-8 flex flex-col animate-in slide-in-from-left duration-500">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Personal Tools</h2>
                <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Sua Central de Comando</p>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 transition-all hover:bg-white/10 hover:translate-x-1 group"
                >
                  <item.icon className="w-5 h-5 text-white/60 group-hover:text-white" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] text-white/20 uppercase tracking-widest">
                Interface Personalizada para Hooke Assistant
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-40 transition-opacity duration-500">
          <Loader2 className="w-10 h-10 text-white/20 animate-spin mb-6" />
          <p className="text-white/40 font-medium tracking-widest uppercase text-xs animate-pulse">Initializing Interface...</p>
        </div>
      )}

      {/* Typebot Widget Container (Optimized for immersive feel) */}
      <div className={`w-full h-full transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Standard
          typebot="my-typebot-5ingwzy" 
          style={{ width: "100%", height: "100%", borderRadius: "0px" }}
        />
      </div>

      {/* ESTILO PARA OCULTAR BARRAS DO NAVEGADOR EM MODO STANDALONE */}
      <style jsx global>{`
        body {
          background-color: #0a0a0a;
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}