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
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useStore } from './src/store/useStore';
import OptimizedImage from './src/components/ui/OptimizedImage';
import { triggerHaptic } from './src/utils/haptics';
import { usePrefetch } from './src/hooks/usePrefetch';

/**
 * HOOKE STORE - PWA ELITE EDITION (RETENTION & MAGIC UPGRADE)
 * Consolidated App Experience: Biometrics + Optimistic UI + Fit Engine
 */

export default function App() {
  const { arsenal, addToArsenal } = useStore();
  
  // 1. STATE MANAGEMENT
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartStatus, setCartStatus] = useState('idle');
  const [fitHeight, setFitHeight] = useState('');
  const [fitWeight, setFitWeight] = useState('');

  // 2. INITIALIZATION (Simulation)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 3. BIOMETRIC LOGIN (Gargalo 10)
  const handleBiometricLogin = () => {
    triggerHaptic('medium');
    // Mock WebAuthn Interaction
    setTimeout(() => {
      setIsAuthenticated(true);
      triggerHaptic('heavy');
    }, 1000);
  };

  // 4. TELEMETRY & PURCHASE (Optimistic UI - Gargalo 11)
  const trackOfflineAction = (actionName, payload) => {
    if (!navigator.onLine) {
      const queue = JSON.parse(localStorage.getItem('@hooke/analytics_queue') || '[]');
      queue.push({ actionName, payload, timestamp: Date.now() });
      localStorage.setItem('@hooke/analytics_queue', JSON.stringify(queue));
    }
  };

  const handlePurchase = () => {
    if (cartStatus === 'added') return;
    
    triggerHaptic('heavy');
    setCartStatus('added'); // Latência Zero Visual
    
    const item = {
      name: 'Lote 001: Lore V2',
      price: 249.90,
      image: '/assets/femme/musas_001_forest_fit.png'
    };
    
    addToArsenal(item);
    trackOfflineAction('add_to_cart', { item: item.name });
  };

  // 5. FIT ENGINE LOGIC (Gargalo 12)
  const getFitRecommendation = () => {
    if (!fitHeight || !fitWeight) return null;
    const h = parseFloat(fitHeight);
    const w = parseFloat(fitWeight);
    if (h >= 1.80 && h <= 1.90 && w >= 80 && w <= 90) {
      return "Match Exato: O tamanho M terá o caimento perfeito da nossa foto de referência. O tamanho G terá um corte Oversized autêntico.";
    }
    return h < 1.75 ? "Sugerimos o tamanho P para um caimento Slim ou M para um visual Boxy." : "O tamanho G garantirá a estrutura ideal para sua estatura.";
  };

  // 6. SHARED LOGIC
  const handleSmartShare = async (productName) => {
    triggerHaptic('light');
    if (navigator.share) {
      await navigator.share({ title: `Hooke | ${productName}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado.');
    }
  };

  const prefetchData = useCallback(() => console.log('[PREFETCH] Ativo.'), []);
  const prefetchRef = usePrefetch(prefetchData, 0.3);

  return (
    <HelmetProvider>
      <div className="bg-[#F5F5F5] min-h-screen font-sans selection:bg-black selection:text-white pb-24 md:pb-0">
        
        <Helmet>
          <title>Hooke | Experiência de Elite</title>
          <meta name="theme-color" content="#F5F5F5" />
        </Helmet>

        {/* 1. ANNOUNCEMENT BAR */}
        <div className="bg-black text-white py-2 overflow-hidden relative z-50">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="flex items-center gap-12 shrink-0">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Hooke Elite PWA : Fase 4 Ativa</span>
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
              <button 
                onClick={handleBiometricLogin}
                className="relative group focus:outline-none"
                aria-label="Login Biométrico"
              >
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    <span className="hidden md:block text-[9px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm">VIP Elite</span>
                  </div>
                ) : (
                  <User size={20} strokeWidth={1.5} className="group-hover:text-black transition-colors" />
                )}
              </button>
              <button className="relative p-1" onClick={() => triggerHaptic('medium')}>
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
          
          <div className="relative h-[60vh] md:h-[85vh] bg-[#D1D1D1] overflow-hidden group">
            <OptimizedImage 
              src="/assets/femme/musas_001_forest_fit.png" 
              lowResSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88/9fAAM0A0NfVlpRAAAAAElFTkSuQmCC"
              alt="Lore V2 Forest"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
            <div className="absolute bottom-12 left-8 text-white z-20">
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase bg-white text-black px-3 py-1 mb-4 block w-max">Lote 001 : Ativo</span>
              <h2 className="text-4xl font-black uppercase leading-none mb-6">Lore V2: <br/> <span className="opacity-70">A Fluidez</span></h2>
              <button 
                onClick={handlePurchase}
                className={`
                  border border-white/40 px-8 py-3 text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-3 transition-all duration-500
                  ${cartStatus === 'added' ? 'bg-white text-black shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)]' : 'hover:bg-white hover:text-black'}
                `}
              >
                {cartStatus === 'added' ? 'Adicionado ao Arsenal' : 'Adquirir Lote'} 
                {cartStatus !== 'added' && <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        </section>

        {/* 4. FIT ENGINE (Gargalo 12) */}
        <section className="py-24 px-6 md:px-12 bg-white/30 border-y border-white/50">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[10px] font-black tracking-[0.5em] text-zinc-400 uppercase">Protocolo de Caimento</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-12">Fit Engine <span className="font-light opacity-30">V1</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-bold tracking-widest uppercase text-left ml-1">Altura (m)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="ex: 1.85"
                  value={fitHeight}
                  onChange={(e) => setFitHeight(e.target.value)}
                  className="bg-[#F5F5F5] shadow-[inset_4px_4px_10px_#D1D1D1,inset_-4px_-4px_10px_#FFFFFF] border-none px-6 py-4 outline-none text-sm font-bold tracking-widest"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-bold tracking-widest uppercase text-left ml-1">Peso (kg)</label>
                <input 
                  type="number" 
                  placeholder="ex: 85"
                  value={fitWeight}
                  onChange={(e) => setFitWeight(e.target.value)}
                  className="bg-[#F5F5F5] shadow-[inset_4px_4px_10px_#D1D1D1,inset_-4px_-4px_10px_#FFFFFF] border-none px-6 py-4 outline-none text-sm font-bold tracking-widest"
                />
              </div>
            </div>

            <AnimatePresence>
              {getFitRecommendation() && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 bg-black text-white text-sm font-medium tracking-wide leading-relaxed border-l-4 border-zinc-500"
                >
                  <Zap className="mb-4 text-zinc-500" size={20} />
                  {getFitRecommendation()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 5. PRODUCT GRID (Skeletons Neumórficos - Gargalo 11) */}
        <section ref={prefetchRef} className="py-24 px-6 md:px-12">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Equipamento <br/> <span className="font-light opacity-30">Base</span></h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {isLoading ? (
              [1,2,3,4].map(i => (
                <motion.div 
                  key={i} 
                  animate={{ opacity: [0.5, 1, 0.5] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="aspect-[3/4] bg-[#F5F5F5] shadow-[6px_6px_12px_#D1D1D1,-6px_-6px_12px_#FFFFFF] p-4"
                />
              ))
            ) : (
              [1,2,3,4].map(i => (
                <div key={i} className="group cursor-pointer outline-none transition-all" onContextMenu={(e) => e.preventDefault()}>
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

        {/* 6. BOTTOM NAV */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F5F5F5]/80 backdrop-blur-md border-t border-white shadow-[0_-4px_10px_rgba(209,209,209,0.3)]">
          <div className="flex justify-between items-center px-8 py-4 max-w-md mx-auto">
            {[{ icon: Home, label: 'Home' }, { icon: ShoppingBag, label: 'Carrinho' }, { icon: User, label: 'VIP' }].map((item, idx) => (
              <button 
                key={idx}
                className="flex flex-col items-center text-zinc-400 hover:text-black transition-colors"
                onClick={() => triggerHaptic('medium')}
              >
                <item.icon size={22} className={idx === 0 ? 'text-black' : ''} />
                <span className={`text-[8px] mt-1 font-bold uppercase tracking-[0.1em] ${idx === 0 ? 'text-black' : ''}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

      </div>
    </HelmetProvider>
  );
}
