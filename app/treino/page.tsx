"use client";

import { Standard } from "@typebot.io/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Loader2, 
  Menu, 
  X, 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  RotateCcw,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonalHookePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [typebotKey, setTypebotKey] = useState(0);

  // Efeito para simular o tempo de carregamento inicial do widget
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleRestart = () => {
    setIsLoading(true);
    setTypebotKey(prev => prev + 1);
    setIsSidebarOpen(false);
    setTimeout(() => setIsLoading(false), 1200);
  };

  const menuItems = [
    { label: "Dashboard Admin", href: "/admin", icon: LayoutDashboard },
    { label: "PDV Hooke", href: "/admin/pdv", icon: Store },
    { label: "Meus Produtos", href: "/admin/produtos", icon: ShoppingBag },
    { label: "Voltar para a Loja", href: "/", icon: ArrowLeft },
  ];

  return (
    <div className="relative w-full h-[100dvh] bg-[#050505] flex flex-col overscroll-none overflow-hidden text-white font-sans">
      
      {/* HEADER / TOP CONTROLS */}
      <div className="absolute top-6 left-6 right-6 z-50 flex justify-between items-center pointer-events-none">
        
        {/* Botão de Menu (Atalhos de Rotina) */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(true)}
          className="pointer-events-auto bg-white/10 backdrop-blur-2xl p-3.5 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-colors hover:bg-white/15"
        >
          <Menu className="w-6 h-6 text-white" />
        </motion.button>

        {/* Status discreto com Glassmorphism */}
        <div className="hidden sm:flex bg-white/5 backdrop-blur-xl px-5 py-2 rounded-2xl border border-white/5 items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">
            Hooke Personal Assistant
          </span>
        </div>

        {/* Botão Rápido de Reiniciar (Opcional no Header) */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRestart}
          className="pointer-events-auto bg-white/5 backdrop-blur-xl p-3.5 rounded-2xl border border-white/5 text-white/40 hover:text-white"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* SIDEBAR (ATALHOS DE ROTINA) COM FRAMER MOTION */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] flex outline-none">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[300px] h-full bg-[#0a0a0a]/90 backdrop-blur-3xl border-r border-white/10 p-8 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-white">Hooke CP</h2>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-bold">Command Center</p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {/* Seção Quick Actions */}
                <div className="space-y-2">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest pl-1 mb-3">Atalhos Rápidos</p>
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 transition-all hover:bg-white/10 group active:scale-[0.98]"
                    >
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                        <item.icon className="w-5 h-5 text-white/50 group-hover:text-white" />
                      </div>
                      <span className="font-semibold text-sm text-white/80 group-hover:text-white">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Seção Ferramentas */}
                <div className="space-y-2 pt-4">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest pl-1 mb-3">Assistente</p>
                  <button
                    onClick={handleRestart}
                    className="w-full flex items-center gap-4 bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 transition-all hover:bg-orange-500/20 group active:scale-[0.98]"
                  >
                    <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30">
                      <RotateCcw className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="font-semibold text-sm text-orange-200">Reiniciar Treino</span>
                  </button>
                </div>
              </div>

              {/* Footer Sidebar */}
              <div className="mt-auto pt-8 border-t border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/20">
                  <Zap className="w-4 h-4 text-white fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/60">Privado & Seguro</p>
                  <p className="text-[9px] text-white/30 truncate">hooke-assistant-v2.0</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading State Premium */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-[90]"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
              <div className="relative bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              </div>
            </div>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white/40 font-bold tracking-[0.4em] uppercase text-[10px]"
            >
              Configurando Treino...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typebot Widget Container */}
      <motion.div 
        key={typebotKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full h-full pb-[env(safe-area-inset-bottom)]"
      >
        <Standard
          typebot="my-typebot-5ingwzy" 
          style={{ width: "100%", height: "100%", borderRadius: "0px" }}
          className="typebot-standard"
        />
      </motion.div>

      {/* CSS CUSTOM PARA OCULTAR BRANDING E MELHORAR UI */}
      <style jsx global>{`
        body {
          background-color: #050505;
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
          font-family: var(--font-inter), sans-serif;
        }

        /* Hack sutil para tentar empurrar o branding do Typebot para fora ou reduzir visibilidade */
        .typebot-standard iframe {
          border: none !important;
          background-color: transparent !important;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}