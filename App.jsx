import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, 
  Compass, 
  ShoppingBag, 
  User, 
  Menu, 
  Search, 
  Zap,
  ArrowRight,
  Share2,
  CheckCircle2,
  MessageCircle,
  X,
  Trash2,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useStore } from './src/store/useStore';
import OptimizedImage from './src/components/ui/OptimizedImage';
import { triggerHaptic } from './src/utils/haptics';
import { usePrefetch } from './src/hooks/usePrefetch';

/**
 * HOOKE STORE - PWA ELITE EDITION (PHASE 5: PSYCHOLOGY & FLUIDITY)
 * Masterpiece UI: Consolidated Experience with Scarcity, Arsenal & Concierge
 */

export default function App() {
  const { arsenal, addToArsenal, clearArsenal } = useStore();
  
  // 1. STATE MANAGEMENT
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartStatus, setCartStatus] = useState('idle');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [fitHeight, setFitHeight] = useState('');
  const [fitWeight, setFitWeight] = useState('');

  // 2. INITIALIZATION
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 3. LOGIC HANDLERS
  const handleBiometricLogin = () => {
    triggerHaptic('medium');
    setTimeout(() => {
      setIsAuthenticated(true);
      triggerHaptic('heavy');
    }, 800);
  };

  const handlePurchase = () => {
    if (cartStatus === 'added') {
      setIsCartOpen(true);
      return;
    }
    triggerHaptic('heavy');
    setCartStatus('added');
    const item = {
      id: Date.now(),
      name: 'Lote 001: Lore V2',
      price: 249.90,
      image: '/assets/femme/musas_001_forest_fit.png'
    };
    addToArsenal(item);
  };

  const handleSmartShare = async (productName) => {
    triggerHaptic('light');
    if (navigator.share) {
      await navigator.share({ title: `Hooke | ${productName}`, url: window.location.href });
    }
  };

  const getFitRecommendation = () => {
    if (!fitHeight || !fitWeight) return null;
    const h = parseFloat(fitHeight);
    const w = parseFloat(fitWeight);
    if (h >= 1.80 && h <= 1.90 && w >= 80 && w <= 90) {
      return "Match Exato: O tamanho M terá o caimento perfeito da nossa foto de referência. O tamanho G terá um corte Oversized autêntico.";
    }
    return h < 1.75 ? "Sugerimos o tamanho P para um caimento Slim ou M para um visual Boxy." : "O tamanho G garantirá a estrutura ideal para sua estatura.";
  };

  const prefetchData = useCallback(() => console.log('[PREFETCH] Ativo.'), []);
  const prefetchRef = usePrefetch(prefetchData, 0.3);

  return (
    <HelmetProvider>
      <div className="bg-[#F5F5F5] min-h-screen font-sans selection:bg-black selection:text-white pb-24 md:pb-0 overflow-x-hidden">
        
        <Helmet>
          <title>Hooke | Lote 001 : Experiência de Elite</title>
          <meta name="theme-color" content="#F5F5F5" />
        </Helmet>

        {/* 1. ANNOUNCEMENT BAR */}
        <div className="bg-black text-white py-2 overflow-hidden relative z-50">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="flex items-center gap-12 shrink-0">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase italic">Hooke Elite PWA : Fase 5 Ativa</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. HEADER */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="px-6 md:px-12 flex justify-between items-center h-20">
            <div className="flex-1 flex items-center">
              <button className="md:hidden text-black p-2" onClick={() => triggerHaptic('light')}>
                <Menu size={24} strokeWidth={1.5} />
              </button>
              <nav className="hidden md:flex gap-8">
                {['Masculino', 'Feminino'].map(link => (
                  <a key={link} href="#" className="text-[11px] font-bold tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">
                    {link}
                  </a>
                ))}
              </nav>
            </div>
            
            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl md:text-4xl font-black tracking-[-0.05em] lowercase">hooke</h1>
            </div>

            <div className="flex-1 flex justify-end gap-6 items-center">
              <Search className="hidden md:block cursor-pointer" size={20} strokeWidth={1.5} />
              <button onClick={handleBiometricLogin} className="focus:outline-none">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    <span className="hidden md:block text-[9px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm">VIP Elite</span>
                  </div>
                ) : (
                  <User size={20} strokeWidth={1.5} />
                )}
              </button>
              <button 
                className="relative p-1 focus:outline-none" 
                onClick={() => { setIsCartOpen(true); triggerHaptic('medium'); }}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {arsenal.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                    {arsenal.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* 3. HERO SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-1">
          <div className="relative h-[60vh] md:h-[85vh] bg-black overflow-hidden group">
            <OptimizedImage 
              src="/produtos/hk_elite_heavy_black_v2.png" 
              lowResSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              alt="Heavy Black Elite"
              className="w-full h-full"
            />
            <button 
              className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur-md p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleSmartShare('Heavy Black Elite')}
            >
              <Share2 size={18} />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <div className="absolute bottom-12 left-8 text-white z-20">
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase border border-white/20 px-3 py-1 mb-4 block w-max">Lançamento</span>
              <h2 className="text-4xl font-black uppercase leading-none mb-6">Heavy <br/> <span className="text-zinc-500">Elite</span></h2>
              <button className="bg-white text-black px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-3">
                Explorar <ArrowRight size={14} />
              </button>
            </div>
          </div>
          
          <div className="relative h-[60vh] md:h-[85vh] bg-[#D1D1D1] overflow-hidden group p-12 flex flex-col justify-end">
            <OptimizedImage 
              src="/assets/femme/musas_001_forest_fit.png" 
              lowResSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88/9fAAM0A0NfVlpRAAAAAElFTkSuQmCC"
              alt="Lore V2 Forest"
              className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
            
            <div className="relative z-20 text-white max-w-sm">
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase bg-white text-black px-3 py-1 mb-4 block w-max">Lote 001 : Ativo</span>
              <h2 className="text-4xl font-black uppercase leading-none mb-6">Lore V2: <br/> <span className="opacity-70">A Fluidez</span></h2>
              
              <button 
                onClick={handlePurchase}
                className={`
                  w-full border border-white/40 px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-all duration-500
                  ${cartStatus === 'added' ? 'bg-white text-black shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)]' : 'hover:bg-white hover:text-black'}
                `}
              >
                {cartStatus === 'added' ? 'No Arsenal' : 'Adquirir Lote'} 
                {cartStatus !== 'added' && <ArrowRight size={14} />}
              </button>

              {/* INDICADOR DE ESCASSEZ (Gargalo 13) */}
              <div className="mt-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase text-white/50">Disponibilidade</span>
                  <span className="text-[10px] font-bold text-white">22 / 24</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '91.6%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-white"
                  />
                </div>
                <p className="text-[7px] mt-2 font-black text-white/40 uppercase tracking-[0.3em] animate-pulse">Protocolo de Produção Limitado</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FIT ENGINE */}
        <section className="py-24 px-6 md:px-12 bg-white/30 border-y border-white/50">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[10px] font-black tracking-[0.5em] text-zinc-400 uppercase">Protocolo de Caimento</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-12">Fit Engine <span className="font-light opacity-30">V1</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex flex-col gap-4">
                <input 
                  type="number" placeholder="Altura (m)" value={fitHeight} onChange={(e) => setFitHeight(e.target.value)}
                  className="bg-[#F5F5F5] shadow-[inset_4px_4px_10px_#D1D1D1,inset_-4px_-4px_10px_#FFFFFF] border-none px-6 py-5 outline-none text-sm font-bold tracking-widest text-center"
                />
              </div>
              <div className="flex flex-col gap-4">
                <input 
                  type="number" placeholder="Peso (kg)" value={fitWeight} onChange={(e) => setFitWeight(e.target.value)}
                  className="bg-[#F5F5F5] shadow-[inset_4px_4px_10px_#D1D1D1,inset_-4px_-4px_10px_#FFFFFF] border-none px-6 py-5 outline-none text-sm font-bold tracking-widest text-center"
                />
              </div>
            </div>

            <AnimatePresence>
              {getFitRecommendation() && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 bg-black text-white text-[11px] font-bold tracking-[0.1em] uppercase leading-relaxed">
                  <Zap className="mx-auto mb-4 text-zinc-500" size={20} />
                  {getFitRecommendation()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 5. PRODUCT GRID (Skeletons) */}
        <section ref={prefetchRef} className="py-24 px-6 md:px-12">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Equipamento <br/> <span className="font-light opacity-30">Base</span></h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {isLoading ? (
              [1,2,3,4].map(i => (
                <motion.div key={i} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="aspect-[3/4] bg-[#F5F5F5] shadow-[6px_6px_12px_#D1D1D1,-6px_-6px_12px_#FFFFFF]" />
              ))
            ) : (
              [1,2,3,4].map(i => (
                <div key={i} className="group cursor-pointer" onContextMenu={(e) => e.preventDefault()}>
                  <div className="aspect-[3/4] bg-zinc-100 overflow-hidden relative mb-6">
                    <OptimizedImage 
                      src={`/produtos/${i + 10}.avif`} 
                      lowResSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                      alt="Produto"
                      className="w-full h-full"
                    />
                  </div>
                  <h3 className="text-[11px] font-bold tracking-widest uppercase mb-2">Camiseta Heavy Weight 00{i}</h3>
                  <p className="text-[10px] text-zinc-500 font-medium tracking-wider">R$ 189,90</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 6. CONCIERGE FAB (Gargalo 15) */}
        <button 
          onClick={() => { setIsChatOpen(true); triggerHaptic('medium'); }}
          className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50 bg-black p-4 text-white shadow-[10px_10px_20px_rgba(0,0,0,0.2)] hover:scale-110 transition-transform focus:outline-none"
        >
          <MessageCircle size={24} />
        </button>

        {/* 7. ARSENAL FLUTUANTE (Gargalo 14) */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F5F5F5] z-[70] shadow-[-20px_0_40px_rgba(0,0,0,0.1)] p-12 overflow-y-auto">
                <div className="flex justify-between items-center mb-16">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Seu Arsenal</h3>
                  <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
                </div>
                {arsenal.length === 0 ? (
                  <div className="text-center py-24 opacity-30">
                    <ShoppingBag size={48} className="mx-auto mb-4" strokeWidth={1} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Arsenal Vazio</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {arsenal.map((item, idx) => (
                      <div key={idx} className="flex gap-6 items-center bg-white p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.05)]">
                        <div className="w-16 h-20 bg-zinc-100 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest">{item.name}</p>
                          <p className="text-[10px] text-zinc-400 mt-1">R$ {item.price}</p>
                        </div>
                        <button className="text-zinc-300 hover:text-black transition-colors"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={clearArsenal} className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] border-b border-black pb-2 w-max">Limpar Arsenal</button>
                    <button className="mt-4 bg-black text-white py-6 text-[11px] font-black uppercase tracking-[0.5em] hover:opacity-90 transition-opacity">Finalizar Protocolo</button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 8. CONCIERGE CHAT WINDOW */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed bottom-32 right-6 md:bottom-28 md:right-12 z-[60] w-full max-w-sm bg-white shadow-[20px_20px_60px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="bg-black p-6 text-white flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase">Hooke Concierge</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">Online agora</span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)}><X size={20} /></button>
              </div>
              <div className="h-80 p-6 overflow-y-auto bg-[#F9F9F9] flex flex-col gap-4">
                <div className="bg-white p-4 text-[11px] font-medium leading-relaxed shadow-sm w-3/4">Olá. Como posso elevar sua experiência hoje?</div>
                <div className="bg-black text-white p-4 text-[11px] font-medium leading-relaxed shadow-sm w-3/4 self-end">Gostaria de saber mais sobre o Lote 001.</div>
              </div>
              <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input type="text" placeholder="Escreva aqui..." className="flex-1 bg-zinc-50 border-none px-4 py-3 text-[11px] focus:outline-none" />
                <button className="bg-black text-white p-3"><Send size={16} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 9. BOTTOM NAV */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F5F5F5]/80 backdrop-blur-md border-t border-white shadow-[0_-4px_10px_rgba(209,209,209,0.3)]">
          <div className="flex justify-between items-center px-8 py-4 max-w-md mx-auto">
            {[{ icon: Home, label: 'Home' }, { icon: Compass, label: 'Explore' }, { icon: ShoppingBag, label: 'Arsenal', onClick: () => setIsCartOpen(true) }, { icon: User, label: 'VIP' }].map((item, idx) => (
              <button 
                key={idx}
                className="flex flex-col items-center text-zinc-400 hover:text-black transition-colors focus:outline-none"
                onClick={item.onClick || (() => triggerHaptic('medium'))}
              >
                <item.icon size={22} strokeWidth={1.5} className={idx === 0 ? 'text-black' : ''} />
                <span className={`text-[8px] mt-1 font-black uppercase tracking-[0.1em] ${idx === 0 ? 'text-black' : 'opacity-0'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

      </div>
    </HelmetProvider>
  );
}
