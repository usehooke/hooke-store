import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Send,
  Sun,
  Moon,
  CreditCard,
  CloudLightning,
  Fingerprint,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where,
  getDoc
} from 'firebase/firestore';

import { auth, db } from './lib/firebase';
import { useStore } from './src/store/useStore';
import OptimizedImage from './src/components/ui/OptimizedImage';
import { triggerHaptic } from './src/utils/haptics';
import { usePrefetch } from './src/hooks/usePrefetch';

/**
 * HOOKE STORE - PWA LUXURY FINALIZATION
 * Standalone Experience + Cinematic Dark Mode + Preferences Sync
 */

export default function App() {
  const { arsenal, addToArsenal, clearArsenal } = useStore();
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'hooke-v4';
  
  // 1. STATE MANAGEMENT
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('hooke-theme') === 'dark';
    return false;
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricAuth, setIsBiometricAuth] = useState(false);
  const [stockData, setStockData] = useState({ current: 22, max: 24 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [socialProof, setSocialProof] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [fitData, setFitData] = useState({ height: '', weight: '' });

  // 2. THEME REFINEMENT (Gargalo 17)
  const bgMain = isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F5F5F5]';
  const textMain = isDarkMode ? 'text-white/90' : 'text-slate-900';
  const shadowNeumorphic = isDarkMode 
    ? 'shadow-[6px_6px_12px_#050914,-6px_-6px_12px_#1e293b]' 
    : 'shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff]';
  const shadowInset = isDarkMode
    ? 'shadow-[inset_4px_4px_10px_#050914,inset_-4px_-4px_10px_#1e293b]'
    : 'shadow-[inset_4px_4px_10px_#d1d1d1,inset_-4px_-4px_10px_#ffffff]';

  // 3. CLOUD & PREFERENCES SYNC
  useEffect(() => {
    if (!auth || !db) { setIsLoading(false); return; }

    const initCloud = async () => {
      try {
        const cred = await signInAnonymously(auth);
        // Load Settings
        const settingsRef = doc(db, `artifacts/${appId}/users/${cred.user.uid}/settings`, 'preferences');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists() && settingsSnap.data().theme) {
          setIsDarkMode(settingsSnap.data().theme === 'dark');
        }
      } catch (err) { console.error("[CLOUD] Handshake failed:", err); }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => setUser(u));
    const stockRef = doc(db, `artifacts/${appId}/public/data`, 'stock');
    const unsubscribeStock = onSnapshot(stockRef, (snap) => {
      if (snap.exists()) setStockData(snap.data());
      setIsLoading(false);
    });

    // PWA INSTALL CAPTURE (Gargalo 19)
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowInstallModal(true), 10000);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    initCloud();
    return () => { 
      unsubscribeAuth(); 
      unsubscribeStock(); 
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, [appId]);

  // 4. ACTION HANDLERS
  const toggleTheme = async () => {
    triggerHaptic('medium');
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    const themeStr = newMode ? 'dark' : 'light';
    localStorage.setItem('hooke-theme', themeStr);

    if (user && db) {
      const settingsRef = doc(db, `artifacts/${appId}/users/${user.uid}/settings`, 'preferences');
      await setDoc(settingsRef, { theme: themeStr, lastSync: Date.now() }, { merge: true });
    }
  };

  const handleInstallApp = async () => {
    triggerHaptic('heavy');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
      setShowInstallModal(false);
    }
  };

  const handlePurchase = async () => {
    triggerHaptic('heavy');
    addToArsenal({ id: Date.now(), name: 'Lote 001: Lore V2', price: 249.90 });
    setIsCartOpen(true);
  };

  return (
    <HelmetProvider>
      <div className={`${bgMain} ${textMain} min-h-screen font-sans selection:bg-zinc-500 selection:text-white pb-24 md:pb-0 overflow-x-hidden transition-all duration-500 ease-in-out`}>
        
        <Helmet>
          <title>Hooke | Luxury PWA</title>
          <meta name="theme-color" content={isDarkMode ? "#0F172A" : "#F5F5F5"} />
        </Helmet>

        {/* 1. PWA INSTALL MODAL (Gargalo 19) */}
        <AnimatePresence>
          {showInstallModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-sm bg-black/20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className={`w-full max-w-sm p-10 ${bgMain} ${shadowNeumorphic} text-center`}
              >
                <div className={`mx-auto w-16 h-16 mb-8 flex items-center justify-center rounded-full ${shadowInset}`}>
                  <Download size={28} strokeWidth={1.5} className="opacity-40" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Eleve o seu Arsenal</h3>
                <p className="text-[11px] leading-relaxed opacity-50 font-bold uppercase tracking-widest mb-10">
                  Instale a Hooke Store para uma experiência de permanência absoluta.
                </p>
                <div className="flex flex-col gap-4">
                  <button onClick={handleInstallApp} className={`w-full py-5 text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    Instalar Agora
                  </button>
                  <button onClick={() => setShowInstallModal(false)} className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Depois</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 2. HEADER */}
        <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b ${isDarkMode ? 'bg-[#0F172A]/80 border-white/5' : 'bg-white/80 border-gray-100'}`}>
          <div className="px-6 md:px-12 flex justify-between items-center h-20">
            <div className="flex-1 flex items-center">
              <button onClick={toggleTheme} className={`p-3 focus:outline-none rounded-full transition-all ${shadowInset}`}>
                {isDarkMode ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
              </button>
            </div>
            
            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl font-black tracking-[-0.05em] lowercase italic">hooke</h1>
            </div>

            <div className="flex-1 flex justify-end gap-6 items-center">
              <button onClick={() => { triggerHaptic('medium'); setIsBiometricAuth(!isBiometricAuth); }} className="focus:outline-none">
                {isBiometricAuth ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Fingerprint size={20} strokeWidth={1.5} className="opacity-40" />}
              </button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-1 focus:outline-none">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {arsenal.length > 0 && (
                  <span className={`absolute -top-1 -right-1 text-[8px] w-3.5 h-3.5 flex items-center justify-center font-bold ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    {arsenal.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* 3. EXPERIENCE GRID */}
        <main className="max-w-[1800px] mx-auto">
          {isLoading ? (
            <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1,2].map(i => <div key={i} className={`aspect-[4/5] animate-pulse ${bgMain} ${shadowNeumorphic}`} />)}
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div className="relative h-[70vh] md:h-[85vh] bg-black overflow-hidden group">
                <OptimizedImage src="/produtos/hk_elite_heavy_black_v2.png" alt="Heavy Black" className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute bottom-12 left-10 text-white z-20">
                  <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-4 block">Series 001</span>
                  <h2 className="text-5xl font-black uppercase leading-none mb-10 italic">Heavy <br/> <span className="opacity-30">Origin</span></h2>
                  <button className="bg-white text-black px-12 py-5 text-[10px] font-black tracking-[0.5em] uppercase hover:scale-105 transition-transform">Ver Detalhes</button>
                </div>
              </div>

              <div className={`relative h-[70vh] md:h-[85vh] overflow-hidden p-12 flex flex-col justify-end ${isDarkMode ? 'bg-slate-900' : 'bg-[#D1D1D1]'}`}>
                <OptimizedImage src="/assets/femme/musas_001_forest_fit.png" alt="Lore V2" className="absolute inset-0 w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                
                <div className="relative z-20 text-white max-w-sm">
                  <h2 className="text-5xl font-black uppercase leading-none mb-8 italic">Lore V2</h2>
                  <button onClick={handlePurchase} className="w-full border border-white/20 py-5 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all">Adquirir Lote</button>
                  <div className="mt-10">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(stockData.current/stockData.max)*100}%` }} transition={{ duration: 2 }} className="h-full bg-white" />
                    </div>
                    <p className="text-[7px] mt-3 font-black text-white/30 uppercase tracking-[0.4em] animate-pulse">Estoque Sincronizado : Live</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 4. FIT ENGINE 4.0 */}
          <section className={`py-32 px-6 text-center border-y ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-white/50 bg-white/30'}`}>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 italic">Fit Engine <span className="font-light opacity-20 italic">v4</span></h2>
            <div className="max-w-xl mx-auto grid grid-cols-2 gap-8 mb-16">
              <input type="number" placeholder="Altura" value={fitData.height} onChange={(e) => setFitData({...fitData, height: e.target.value})} className={`${bgMain} ${shadowInset} px-8 py-6 text-center outline-none text-sm font-black tracking-widest`} />
              <input type="number" placeholder="Peso" value={fitData.weight} onChange={(e) => setFitData({...fitData, weight: e.target.value})} className={`${bgMain} ${shadowInset} px-8 py-6 text-center outline-none text-sm font-black tracking-widest`} />
            </div>
            {fitData.height && fitData.weight && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-10 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} text-[11px] font-black uppercase tracking-[0.4em] italic`}>Tamanho Recomendado: M</motion.div>
            )}
          </section>
        </main>

        {/* 5. DRAWER ARSENAL */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70]" />
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className={`fixed right-0 top-0 h-full w-full md:max-w-[450px] ${bgMain} z-[80] shadow-2xl p-12 flex flex-col`}>
                <div className="flex justify-between items-center mb-16">
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic">Seu Arsenal</h3>
                  <button onClick={() => setIsCartOpen(false)}><X size={32} /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {arsenal.map((item, i) => (
                    <div key={i} className={`p-6 mb-4 flex justify-between items-center ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                      <button className="text-red-500 opacity-40 hover:opacity-100"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-6 mt-auto text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                  <CloudLightning size={16} /> Cloud Sync
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 6. BOTTOM NAV */}
        <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t transition-all ${isDarkMode ? 'bg-slate-950/80 border-white/5' : 'bg-[#F5F5F5]/80 border-white shadow-2xl'}`}>
          <div className="flex justify-between px-12 py-6 max-w-md mx-auto">
            {[{ icon: Home, label: 'Home' }, { icon: ShoppingBag, label: 'Arsenal', onClick: () => setIsCartOpen(true) }, { icon: User, label: 'VIP' }].map((t) => (
              <button key={t.label} onClick={() => { setActiveTab(t.label); if (t.onClick) t.onClick(); triggerHaptic('light'); }} className={`flex flex-col items-center transition-all ${activeTab === t.label ? '-translate-y-2' : 'opacity-30'}`}>
                <t.icon size={22} strokeWidth={activeTab === t.label ? 2.5 : 1.5} />
                {activeTab === t.label && <span className="text-[9px] font-black uppercase tracking-widest mt-1 italic">{t.label}</span>}
              </button>
            ))}
          </div>
        </nav>

      </div>
    </HelmetProvider>
  );
}
