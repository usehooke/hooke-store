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
  Fingerprint,
  Layers,
  Sparkles,
  Share2,
  ChevronRight,
  Ruler,
  Package,
  ShieldCheck,
  Zap
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
  addDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

import { auth, db } from './lib/firebase';
import { useStore } from './src/store/useStore';
import { triggerHaptic } from './src/utils/haptics';
import { NotificationService } from './src/services/NotificationService';

/**
 * HOOKE STORE - STANDALONE PWA (ANTIGRAVITY PROJECT)
 * UI/UX Architecture: Organic Neumorphism & VIP Intelligence
 */

// 1. ASSET MAPPING (REFERÊNCIA 1 - FERNANDO)
const ASSETS = {
  WAFER: "https://www.usehooke.com.br/cdn/shop/files/conjunto-wafer-off-white.jpg",
  HEAVY: "https://www.usehooke.com.br/cdn/shop/files/camiseta-heavy-black.jpg",
};

const PRODUCTS = [
  { id: 'hk-01', name: 'Wafer Off-White Atelier', price: 289.90, category: 'Feminino', fit_type: 'Conjunto Viscose', grammage: 230, image: ASSETS.WAFER, isNew: true },
  { id: 'hk-02', name: 'Heavy Black Heavyweight', price: 199.90, category: 'Masculino', fit_type: 'T-Shirt Boxy', grammage: 320, image: ASSETS.HEAVY, isNew: false },
];

// 2. COMPONENTE: VIP TAGS DINÂMICAS (GLASSMORPHISM + NEUMORPHIC BORDER)
const VipTag = ({ stock, isNew, isAuthenticated }) => {
  const [tag, setTag] = useState({ label: '', icon: Zap });

  useEffect(() => {
    if (stock < 5 && stock > 0) setTag({ label: 'Lote Final: Últimas Unidades', icon: Package });
    else if (isNew) setTag({ label: 'Drop Origem: 001', icon: Zap });
    else if (isAuthenticated) setTag({ label: 'Acesso VIP Reconhecido', icon: ShieldCheck });
    else setTag({ label: '', icon: null });
  }, [stock, isNew, isAuthenticated]);

  if (!tag.label) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => triggerHaptic('light')}
      className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)] cursor-pointer group"
    >
      <tag.icon size={10} className="text-black group-hover:animate-pulse" />
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black">{tag.label}</span>
    </motion.div>
  );
};

// 3. COMPONENTE DE ELITE: OPTIMIZED IMAGE (BLUR-UP)
const OptimizedImage = ({ src, alt, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-[#F5F5F5] ${className}`}>
      <motion.img
        initial={{ filter: "blur(20px)", opacity: 0.3 }}
        animate={isLoaded ? { filter: "blur(0px)", opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        onLoad={() => setIsLoaded(true)}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
};

// 4. COMPONENTE: TECHNICAL SPECS (UX LUXURY)
const TechnicalSpecs = ({ fitType, grammage }) => {
  let specString = "";
  if (fitType === 'T-Shirt Boxy') specString = `GEOMETRIA TÊXTIL: ${grammage}G/M²`;
  else if (fitType === 'Conjunto Viscose') specString = `FLUIDEZ TÊXTIL: ${grammage}G/M²`;
  else if (fitType === 'Bermuda' || fitType === 'Calça') specString = `ESTRUTURA: HIGH-DENSITY`;
  else specString = `ENGENHARIA TÊXTIL: ${grammage}G/M²`;

  return (
    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.4em] mb-1">
      {specString}
    </p>
  );
};

// 5. PRODUCT CARD: ORGANIC NEUMORPHISM (SOFT-EXTRUSION)
const ProductCard = ({ product, stock, isAuthenticated, addToArsenal }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-6 rounded-[3rem] bg-[#F5F5F5] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] transition-all duration-700 relative"
  >
    <VipTag stock={stock} isNew={product.isNew} isAuthenticated={isAuthenticated} />
    
    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 group">
      <OptimizedImage src={product.image} alt={product.name} className="w-full h-full" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
        <button 
          onClick={() => addToArsenal(product)}
          className="bg-white text-black px-12 py-5 text-[9px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-110 transition-transform active:scale-95"
        >
          ADICIONAR AO ARSENAL
        </button>
      </div>
    </div>

    <div className="px-4">
      <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mb-2 block">{product.category}</span>
      <TechnicalSpecs fitType={product.fit_type} grammage={product.grammage} />
      <h3 className="text-lg font-semibold tracking-tighter text-black mb-3">{product.name}</h3>
      <div className="flex justify-between items-center">
        <span className="text-md font-bold font-mono">R$ {product.price.toFixed(2)}</span>
        <button onClick={() => { triggerHaptic('light'); }} className="p-3 rounded-full shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] opacity-40 hover:opacity-100 transition-all">
          <Share2 size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const { arsenal: localArsenal, addToArsenal: storeAdd } = useStore();
  const appId = 'hooke-standalone-pwa';
  
  // STATE
  const [user, setUser] = useState(null);
  const [stock, setStock] = useState(22);
  const [cloudArsenal, setCloudArsenal] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // FIREBASE SYNC
  useEffect(() => {
    if (!auth || !db) return;

    const initAuth = async () => {
      try {
        const cred = await signInAnonymously(auth);
        setUser(cred.user);

        // REAL-TIME STOCK (LOTE 001)
        const stockRef = doc(db, `artifacts/${appId}/public/data/inventory`, 'lote-001');
        onSnapshot(stockRef, (snap) => {
          if (snap.exists()) setStock(snap.data().count);
        });

        // REAL-TIME ARSENAL
        const arsenalRef = doc(db, `artifacts/${appId}/users/${cred.user.uid}/arsenal`, 'items');
        onSnapshot(arsenalRef, (snap) => {
          if (snap.exists()) setCloudArsenal(snap.data().list || []);
          else setDoc(arsenalRef, { list: [] });
        });
      } catch (err) { console.error("[HOOK PWA] Erro:", err); }
    };

    initAuth();
  }, []);

  const handleAddToArsenal = async (product) => {
    triggerHaptic('light');
    storeAdd(product);
    if (user && db) {
      const arsenalRef = doc(db, `artifacts/${appId}/users/${user.uid}/arsenal`, 'items');
      await updateDoc(arsenalRef, { list: arrayUnion({ ...product, addedAt: Date.now() }) });
    }
  };

  return (
    <HelmetProvider>
      <div className="bg-[#F5F5F5] min-h-screen font-sans selection:bg-black selection:text-white pb-32">
        <Helmet>
          <title>Hooke | Standalone PWA</title>
          <meta name="theme-color" content="#F5F5F5" />
        </Helmet>

        {/* HEADER */}
        <header className="fixed top-0 z-50 w-full h-24 flex items-center justify-between px-10 md:px-20 bg-[#F5F5F5]/80 backdrop-blur-xl border-b border-white/20">
          <button className="p-4 rounded-full shadow-[4px_4px_10px_#d1d1d1,-4px_-4px_10px_#ffffff] active:scale-90 transition-transform">
            <Fingerprint size={20} className={user ? 'text-emerald-500' : 'opacity-20'} />
          </button>
          <h1 className="text-4xl font-bold tracking-[-0.08em] italic text-black">hooke</h1>
          <button onClick={() => setIsCartOpen(true)} className="p-4 rounded-full shadow-[4px_4px_10px_#d1d1d1,-4px_-4px_10px_#ffffff] active:scale-90 transition-transform relative">
            <ShoppingBag size={20} />
            {cloudArsenal.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-lg">{cloudArsenal.length}</span>}
          </button>
        </header>

        {/* HERO */}
        <section className="h-[80vh] flex flex-col items-center justify-center text-center px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30 mb-8 block">Protocolo Atelier Edition</span>
            <h2 className="text-7xl md:text-[9rem] font-bold tracking-tighter leading-none italic mb-12 text-black">
              ORIGEM <br/> <span className="font-light opacity-10">001</span>
            </h2>
            <button className="px-12 py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-full shadow-[10px_10px_30px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all">
              EXPLORAR ARSENAL
            </button>
          </motion.div>
        </section>

        {/* PRODUCT GRID */}
        <main className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 mb-40">
          {PRODUCTS.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              stock={stock} 
              isAuthenticated={!!user} 
              addToArsenal={handleAddToArsenal}
            />
          ))}
        </main>

        {/* BOTTOM NAV */}
        <nav className="fixed bottom-0 left-0 right-0 z-[100] h-28 bg-[#F5F5F5]/60 backdrop-blur-2xl border-t border-white/40">
          <div className="max-w-lg mx-auto h-full flex justify-around items-center px-10">
            <button onClick={() => triggerHaptic('light')} className="opacity-20 hover:opacity-100 transition-all"><Home size={22} /></button>
            <button 
              onClick={() => { triggerHaptic('light'); setIsCartOpen(true); }}
              className="p-7 -mt-20 rounded-full bg-[#F5F5F5] shadow-[10px_10px_30px_#d1d1d1,-10px_-10px_30px_#ffffff] text-black active:scale-90 transition-all relative group"
            >
              <div className="absolute inset-0 rounded-full bg-black scale-0 group-hover:scale-100 transition-transform duration-500 -z-10" />
              <ShoppingBag size={28} className="group-hover:text-white transition-colors" />
            </button>
            <button onClick={() => triggerHaptic('light')} className="opacity-20 hover:opacity-100 transition-all"><User size={22} /></button>
          </div>
        </nav>

        {/* DRAWER */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-md z-[110]" />
              <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
                className="fixed right-0 top-0 h-full w-full md:max-w-md bg-[#F5F5F5] z-[120] shadow-2xl p-16 flex flex-col"
              >
                <div className="flex justify-between items-center mb-16">
                  <h3 className="text-3xl font-bold tracking-tighter italic">Seu Arsenal</h3>
                  <button onClick={() => setIsCartOpen(false)}><X size={32} /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-12">
                  {cloudArsenal.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10">
                      <ShoppingBag size={64} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-8">Arsenal Vazio</p>
                    </div>
                  ) : (
                    cloudArsenal.map((item, i) => (
                      <div key={i} className="flex gap-6 items-center">
                        <div className="w-20 h-24 rounded-2xl overflow-hidden shadow-inner bg-white/50">
                           <OptimizedImage src={item.image} alt={item.name} className="w-full h-full" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[11px] font-black uppercase tracking-widest leading-tight">{item.name}</h4>
                          <p className="text-[14px] font-mono mt-2">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <button className="text-red-500/20 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-auto pt-10 border-t border-black/5">
                  <div className="flex justify-between items-end mb-10">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Total do Lote</span>
                    <span className="text-3xl font-bold italic font-mono">R$ {cloudArsenal.reduce((acc, i) => acc + i.price, 0).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={async () => {
                      if (cloudArsenal.length === 0) return;
                      triggerHaptic('heavy');
                      
                      const total = cloudArsenal.reduce((acc, i) => acc + i.price, 0);
                      const orderSlug = `HK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
                      
                      const orderData = {
                        orderSlug: orderSlug,
                        userId: user.uid,
                        userName: user.isAnonymous ? 'Explorador Hooke' : user.displayName,
                        items: cloudArsenal,
                        total: total,
                        timestamp: Date.now(),
                        currentStock: stock - 1
                      };

                      try {
                        // 1. REGISTRO DA RESERVA
                        const ordersRef = collection(db, `artifacts/${appId}/orders`);
                        await addDoc(ordersRef, orderData);

                        // 2. BAIXA DE ESTOQUE (LOTE 001)
                        const stockRef = doc(db, `artifacts/${appId}/public/data/inventory`, 'lote-001');
                        await updateDoc(stockRef, { count: stock - 1 });

                        // 3. NOTIFICAÇÕES ELITE
                        await NotificationService.triggerSaleNotification(orderData);
                        await NotificationService.sendVipWhatsAppNotification(orderData);

                        // 4. LIMPEZA DO ARSENAL
                        const arsenalRef = doc(db, `artifacts/${appId}/users/${user.uid}/arsenal`, 'items');
                        await updateDoc(arsenalRef, { list: [] });
                        
                        alert("Reserva confirmada. Protocolo de envio iniciado.");
                        setIsCartOpen(false);
                      } catch (error) {
                        console.error("Falha no Checkout Protocol:", error);
                      }
                    }}
                    className="w-full py-8 bg-black text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-full shadow-2xl hover:opacity-90 active:scale-95 transition-all"
                  >
                    EFETUAR RESERVA (LOTE 001)
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </HelmetProvider>
  );
}
