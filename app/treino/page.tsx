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
  Zap,
  Music,
  Calendar,
  CheckCircle2,
  Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonalHookePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [typebotKey, setTypebotKey] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState<string[]>([]);
  const [showMusic, setShowMusic] = useState(false);
  const [musicService, setMusicService] = useState<'spotify' | 'ytmusic'>('ytmusic');

  // Carregar histórico do localStorage
  useEffect(() => {
    const savedMusic = localStorage.getItem("hooke_music_service");
    if (savedMusic) setMusicService(savedMusic as 'spotify' | 'ytmusic');

    const saved = localStorage.getItem("hooke_workout_history");
    if (saved) {
      setWorkoutHistory(JSON.parse(saved));
    }

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

  const handleFinishWorkout = () => {
    const today = new Date().toLocaleDateString('pt-BR');
    if (!workoutHistory.includes(today)) {
      const newHistory = [today, ...workoutHistory].slice(0, 7); // Guarda os últimos 7 treinos
      setWorkoutHistory(newHistory);
      localStorage.setItem("hooke_workout_history", JSON.stringify(newHistory));
    }
    // Feedback visual opcional pode ser adicionado aqui
  };

  const handleMusicServiceChange = (service: 'spotify' | 'ytmusic') => {
    setMusicService(service);
    localStorage.setItem("hooke_music_service", service);
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

        {/* Botões Rápidos */}
        <div className="flex gap-3 pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMusic(!showMusic)}
            className={`bg-white/5 backdrop-blur-xl p-3.5 rounded-2xl border transition-all ${showMusic ? 'border-orange-500/50 text-orange-500' : 'border-white/5 text-white/40'}`}
          >
            <Music className="w-5 h-5" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="bg-white/5 backdrop-blur-xl p-3.5 rounded-2xl border border-white/5 text-white/40 hover:text-white"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* MUSIC PLAYER OVERLAY (PORTABLE) */}
      <AnimatePresence>
        {showMusic && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute top-24 right-6 z-[80] w-[330px] h-[220px] bg-black/60 backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Music Service Selector */}
            <div className="flex p-2 gap-2 bg-white/5 border-b border-white/5">
              <button 
                onClick={() => handleMusicServiceChange('ytmusic')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${musicService === 'ytmusic' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'hover:bg-white/5 text-white/40'}`}
              >
                YT Music
              </button>
              <button 
                onClick={() => handleMusicServiceChange('spotify')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${musicService === 'spotify' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'hover:bg-white/5 text-white/40'}`}
              >
                Spotify
              </button>
            </div>

            <div className="flex-1">
              {musicService === 'spotify' ? (
                <iframe 
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX76W9SrhLp9O?utm_source=generator&theme=0" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="opacity-90 hover:opacity-100 transition-opacity"
                />
              ) : (
                <iframe 
                  src="https://www.youtube.com/embed/videoseries?list=RDCLAK5uy_n9F8ai_8yv8YOfX8L_dC7d995_9m9Srhw&mute=0" 
                  width="100%" 
                  height="100%" 
                  title="YouTube Music"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="opacity-90 hover:opacity-100 transition-opacity"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="relative w-[320px] h-full bg-[#0a0a0a]/90 backdrop-blur-3xl border-r border-white/10 p-8 flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
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

              <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Seção Stats Local */}
                <div className="bg-gradient-to-br from-white/[0.03] to-transparent p-5 rounded-3xl border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-4 h-4 text-orange-500" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Resumo da Semana</p>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                      const hasTrained = workoutHistory.length >= day;
                      return (
                        <div 
                          key={day} 
                          className={`flex-1 h-1.5 rounded-full ${hasTrained ? 'bg-orange-500' : 'bg-white/10'}`} 
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-white">{workoutHistory.length}</span>
                      <span className="text-[10px] text-white/30 uppercase font-bold">Treinos</span>
                    </div>
                    <button 
                      onClick={handleFinishWorkout}
                      className="text-[9px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/5 transition-colors font-bold uppercase tracking-tighter flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Marcar Hoje
                    </button>
                  </div>
                </div>

                {/* Seção Quick Actions */}
                <div className="space-y-3">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest pl-1">Atalhos de Sistema</p>
                  <div className="grid grid-cols-2 gap-3">
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex flex-col gap-3 bg-white/5 p-4 rounded-3xl border border-white/5 transition-all hover:bg-white/10 group active:scale-[0.95]"
                      >
                        <item.icon className="w-5 h-5 text-white/40 group-hover:text-orange-500 transition-colors" />
                        <span className="font-bold text-[10px] uppercase text-white/70 group-hover:text-white leading-tight">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Seção Ferramentas */}
                <div className="space-y-3">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest pl-1">Assistente</p>
                  <button
                    onClick={handleRestart}
                    className="w-full flex items-center justify-between bg-orange-500/10 p-5 rounded-3xl border border-orange-500/20 transition-all hover:bg-orange-500/20 group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30">
                        <RotateCcw className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="font-bold text-sm text-orange-200">Reiniciar Treino</span>
                    </div>
                    <Zap className="w-4 h-4 text-orange-500/30" />
                  </button>
                </div>

                {/* Histórico Recente */}
                {workoutHistory.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest pl-1">Últimos Registros</p>
                    <div className="space-y-2">
                       {workoutHistory.map((date, idx) => (
                         <div key={idx} className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                           <Calendar className="w-3.5 h-3.5 text-white/20" />
                           <span className="text-[11px] font-medium text-white/40">{date}</span>
                           <div className="ml-auto w-1 h-1 rounded-full bg-orange-500/40" />
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Sidebar */}
              <div className="mt-auto pt-8 border-t border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/20">
                  <Zap className="w-4 h-4 text-white fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/60">Privado & Seguro</p>
                  <p className="text-[9px] text-white/30 truncate">hooke-assistant-v2.1</p>
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