import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Home, 
  ShoppingBag, 
  User, 
  CheckCircle2,
  X,
  Trash2,
  Sun,
  Moon,
  CloudLightning,
  Fingerprint,
  Layers,
  Sparkles,
  Zap,
  Box,
  Share2,
  ChevronRight
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
  getDoc
} from 'firebase/firestore';

import { auth, db } from './lib/firebase';
import { useStore } from './src/store/useStore';
import OptimizedImage from './src/components/ui/OptimizedImage';
import { triggerHaptic } from './src/utils/haptics';

/**
 * HOOKE STORE - CATALOG SCALING & VISUAL FIDELITY
 * Phase 7: Arsenal Expansion + Fernando's Ref-1 Fidelity
 */

const ASSETS = {
  FERNANDO_WAFER: "/produtos/hk_prod_ov_offwhite_01.avif",
  HEAVY_BLACK: "/produtos/hk_prod_ov_black_03.avif",
  RETRO_BEETLE_AREIA: "/produtos/hk_prod_vi_fusca_editorial_01.png",
  KIT_3_OVERSIZED: "/produtos/hk_prod_ov_black_03.avif",
  REGATA_MILITAR: "/produtos/hk_prod_re_military_hero.avif",
  VINTAGE_BEETLE_BLACK: "/produtos/hk_prod_vi_fusca_editorial_01.png",
  MUSA_FOREST: "/assets/femme/musas_001_forest_fit.png",
  MUSA_CHOCOLATE: "/assets/femme/musas_001_chocolate_1.png",
};

const PRODUCTS = [
  { id: 1, name: 'Wafer Off-White Premium', price: 69.90, category: 'Masculino', image: ASSETS.FERNANDO_WAFER, badge: 'Lote Final' },
  { id: 2, name: 'Heavy Black Origin', price: 79.90, category: 'Masculino', image: ASSETS.HEAVY_BLACK, badge: 'Elite VIP' },
  { id: 3, name: 'Conjunto Forest Viscose', price: 100.00, category: 'Feminino', image: ASSETS.MUSA_FOREST, badge: 'Pronta Entrega' },
  { id: 4, name: 'Kit 3 Oversized Heavy', price: 150.90, category: 'Masculino', image: ASSETS.KIT_3_OVERSIZED, badge: 'Mais Vendido' },
  { id: 5, name: 'Regata Militar Canelada', price: 50.90, category: 'Masculino', image: ASSETS.REGATA_MILITAR, badge: 'Essentials' },
  { id: 6, name: 'Conjunto Chocolate Lore', price: 100.00, category: 'Feminino', image: ASSETS.MUSA_CHOCOLATE, badge: 'Pré-venda' },
  { id: 7, name: 'Vintage Beetle Black', price: 50.90, category: 'Masculino', image: ASSETS.VINTAGE_BEETLE_BLACK, badge: 'Herança' },
];

const ProductCard = ({ product, isDarkMode, shadowNeumorphic, addToArsenal }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`p-4 rounded-[40px] transition-all duration-300 ${shadowNeumorphic} ${isDarkMode ? 'bg-[#1E293B]/30' : 'bg-[#F5F5F5]'}`}
  >
    <div className="relative aspect-[4/5] rounded-[30px] overflow-hidden mb-6 group">
      <OptimizedImage 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      {product.badge && (
        <div className={`absolute top-6 left-6 px-4 py-2 text-[8px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
          {product.badge}
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
        <button 
          onClick={() => { triggerHaptic('heavy'); addToArsenal(product); }}
          className="bg-white text-black px-8 py-4 text-[9px] font-black uppercase tracking-[0.4em]"
        >
          Adquirir Peça
        </button>
      </div>
    </div>
    <div className="px-4 pb-4">
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">{product.name}</h3>
      <div className="flex justify-between items-center">
        <span className="text-[12px] font-black">R$ {product.price.toFixed(2)}</span>
        <button onClick={() => triggerHaptic('light')} className="opacity-20 hover:opacity-100 transition-opacity">
          <Share2 size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const { arsenal, addToArsenal, clearArsenal } = useStore();
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'hooke-v4';
  const canvasRef = useRef(null);
  
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
  const [isBioPaying, setIsBioPaying] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [activeTab, setActiveTab] = useState('Home');
  const [labView, setLabView] = useState('texture');

  // 2. THEME REFINEMENT
  const bgMain = isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F5F5F5]';
  const textMain = isDarkMode ? 'text-white/90' : 'text-slate-900';
  const shadowNeumorphic = isDarkMode 
    ? 'shadow-[10px_10px_20px_#050914,-10px_-10px_20px_#1e293b]' 
    : 'shadow-[10px_10px_20px_#d1d1d1,-10px_-10px_20px_#ffffff]';
  const shadowInset = isDarkMode
    ? 'shadow-[inset_4px_4px_10px_#050914,inset_-4px_-4px_10px_#1e293b]'
    : 'shadow-[inset_4px_4px_10px_#d1d1d1,inset_-4px_-4px_10px_#ffffff]';

  // 3. CLOUD SYNC
  useEffect(() => {
    if (!auth || !db) { setIsLoading(false); return; }
    const initCloud = async () => {
      try {
        const cred = await signInAnonymously(auth);
        const settingsRef = doc(db, `artifacts/${appId}/users/${cred.user.uid}/settings`, 'preferences');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists() && settingsSnap.data().theme) setIsDarkMode(settingsSnap.data().theme === 'dark');
      } catch (err) { console.error("[CLOUD] Sync error:", err); }
    };
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => setUser(u));
    const stockRef = doc(db, `artifacts/${appId}/public/data`, 'stock');
    const unsubscribeStock = onSnapshot(stockRef, (snap) => {
      if (snap.exists()) setStockData(snap.data());
      setIsLoading(false);
    });
    initCloud();
    return () => { unsubscribeAuth(); unsubscribeStock(); };
  }, [appId]);

  // 4. ACTION HANDLERS
  const handleBioPay = async () => {
    triggerHaptic('heavy');
    setIsBioPaying(true);
    setTimeout(() => {
      setIsBioPaying(false);
      clearArsenal();
      setIsCartOpen(false);
      triggerHaptic('heavy');
    }, 2500);
  };

  const filteredProducts = PRODUCTS.filter(p => filter === 'Todos' || p.category === filter);

  return (
    <HelmetProvider>
      <div className={`${bgMain} ${textMain} min-h-screen font-sans selection:bg-zinc-500 selection:text-white pb-32 transition-all duration-500`}>
        
        <Helmet>
          <title>Hooke | Arsenal Oficial</title>
          <meta name="theme-color" content={isDarkMode ? "#0F172A" : "#F5F5F5"} />
        </Helmet>

        {/* 1. HEADER */}
        <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b ${isDarkMode ? 'bg-[#0F172A]/80 border-white/5' : 'bg-white/80 border-gray-100'}`}>
          <div className="px-6 md:px-12 flex justify-between items-center h-20">
            <button onClick={() => { triggerHaptic('medium'); setIsDarkMode(!isDarkMode); }} className={`p-3 rounded-full ${shadowInset}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <h1 className="text-3xl font-black tracking-[-0.05em] italic">hooke</h1>
            <div className="flex gap-6 items-center">
              <button onClick={() => { triggerHaptic('medium'); setIsBiometricAuth(!isBiometricAuth); }}>
                {isBiometricAuth ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Fingerprint size={20} className="opacity-40" />}
              </button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-1">
                <ShoppingBag size={20} />
                {arsenal.length > 0 && <span className={`absolute -top-1 -right-1 text-[8px] w-4 h-4 flex items-center justify-center font-bold ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>{arsenal.length}</span>}
              </button>
            </div>
          </div>
        </header>

        {/* 2. HERO */}
        <section className="relative h-[60vh] flex items-center justify-center text-center px-6 overflow-hidden">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <span className="text-[10px] font-black tracking-[0.8em] uppercase opacity-40 mb-6 block">Referência 1 : Fernando</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-10">Arsenal <br/> <span className="font-light opacity-20">2024</span></h2>
            <div className="flex justify-center gap-4">
              <button className={`px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>Explorar Lotes</button>
            </div>
          </motion.div>
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-zinc-300'}`} />
          </div>
        </section>

        {/* 3. MINIMALIST FILTER */}
        <div className="max-w-[1400px] mx-auto px-6 mb-20 flex justify-center">
          <div className={`p-2 rounded-full flex gap-2 ${shadowInset}`}>
            {['Todos', 'Masculino', 'Feminino'].map(cat => (
              <button 
                key={cat} onClick={() => { setFilter(cat); triggerHaptic('light'); }}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : 'opacity-40 hover:opacity-70'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. PRODUCT GRID */}
        <main className="max-w-[1600px] mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[1,2,3,4].map(i => <div key={i} className={`aspect-[4/5] rounded-[40px] animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-zinc-200'}`} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} product={product} isDarkMode={isDarkMode} 
                  shadowNeumorphic={shadowNeumorphic} addToArsenal={addToArsenal} 
                />
              ))}
            </div>
          )}
        </main>

        {/* 5. CREATIVE LAB MOCK */}
        <section className="py-40 px-6 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 italic opacity-10">Creative Lab : Atelier Preview</h2>
          <div className={`max-w-4xl mx-auto aspect-video rounded-[60px] ${shadowInset} flex items-center justify-center p-12 overflow-hidden`}>
             <OptimizedImage src={ASSETS.MUSA_FOREST} alt="Atelier Preview" className="w-full h-full object-cover opacity-20 blur-sm grayscale" />
             <div className="absolute flex flex-col items-center">
               <Layers size={40} className="mb-6 opacity-20" />
               <button className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Protocolo WebGPU em Espera</button>
             </div>
          </div>
        </section>

        {/* 6. DRAWER ARSENAL */}
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
                  {arsenal.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                      <ShoppingBag size={64} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-widest mt-8">Arsenal Vazio</p>
                    </div>
                  ) : (
                    arsenal.map((item, i) => (
                      <div key={i} className={`p-6 mb-4 flex justify-between items-center ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                        <button className="text-red-500 opacity-40 hover:opacity-100"><Trash2 size={18} /></button>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-auto pt-10 border-t border-zinc-200/10">
                  <button 
                    disabled={isBioPaying || arsenal.length === 0}
                    onClick={handleBioPay}
                    className={`w-full py-6 text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 transition-all relative overflow-hidden ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} disabled:opacity-20`}
                  >
                    {isBioPaying ? "Escaneando..." : <><Fingerprint size={18} /> Bio-Pay Checkout</>}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 7. BOTTOM NAV */}
        <nav className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t transition-all ${isDarkMode ? 'bg-slate-950/80 border-white/5' : 'bg-[#F5F5F5]/80 border-white shadow-2xl'}`}>
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
