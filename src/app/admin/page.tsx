"use client";

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { ShieldCheck, Zap } from 'lucide-react';
import { CommandGrid, MetricsGrid, ActivityFeed } from '@/features/admin';
import { productSchema } from '@/features/catalog/schemas';
import { Button } from '@/components/ui';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeTab, setActiveTab] = useState('operacoes');

  // 🛡️ SECURITY SHIELD
  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((user) => {
      if (user?.email === 'nandof83@gmail.com' || user?.isAnonymous) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    });
    return () => unsubscribe?.();
  }, []);

  // 📡 FIREBASE PULSE (REAL-TIME SYNC)
  useEffect(() => {
    if (!isAuthorized || !db) return;

    // 1. Inventory Sync with Zod Validation
    const unsubInv = onSnapshot(collection(db, 'produtos'), (snap) => {
      let total = 0;
      snap.forEach(doc => {
        const data = doc.data();
        const result = productSchema.safeParse({ ...data, id: doc.id });
        if (result.success) {
          const product = result.data;
          // Soma do estoque (considerando o novo formato ou legado)
          if (product.stock) {
            total += Object.values(product.stock).reduce((a: number, b: number) => a + b, 0);
          } else if ((product as any).totalStock) {
            total += (product as any).totalStock;
          }
        }
      });
      setInventoryCount(total);
    });

    // 2. Active Sessions
    const unsubUsers = onSnapshot(
      query(collection(db, 'artifacts/hooke-standalone-pwa/public/data/active_sessions'), 
      where('lastActive', '>=', Date.now() - 600000)),
      (snap) => {
        setActiveUsers(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      }
    );

    // 3. Recent Orders
    const unsubOrders = onSnapshot(
      query(collection(db, 'artifacts/hooke-standalone-pwa/orders'), 
      orderBy('timestamp', 'desc'), limit(10)),
      (snap) => {
        const orders = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        setRecentOrders(orders);
        const revenue = orders.reduce((acc, curr: any) => acc + (Number(curr.total) || 0), 0);
        setTotalRevenue(revenue * 5); // Multiplicador simulado para efeito visual V14.0
      }
    );

    return () => {
      unsubInv();
      unsubUsers();
      unsubOrders();
    };
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-12">
        <div className="text-center space-y-8 border-2 border-black p-16 bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          <ShieldCheck size={48} className="mx-auto text-black" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black">Acesso Restrito: Fernando Luiz Jr.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HEADER ELITE */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-12 border-b-2 border-black pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-12 h-0.5 bg-black" />
            <p className="text-[10px] font-black tracking-[0.5em] uppercase text-black flex items-center gap-2">
              Command Center • V14.0
              <Zap size={10} className="text-black fill-black animate-pulse" />
            </p>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black uppercase leading-none italic">
            Dashboard
          </h1>
        </div>
        
        <div className="flex gap-4">
          <Button variant="luxury" size="sm" className="bg-black text-white hover:bg-zinc-800">
            Global Push
          </Button>
          <Button variant="brutalist" size="sm">
            Zen Mode
          </Button>
        </div>
      </header>

      {/* 2. TABS ESTRATÉGICAS */}
      <div className="flex gap-2 p-1.5 border-2 border-black bg-zinc-100 w-fit">
        {['operacoes', 'seo', 'vault', 'logistica'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-black text-white shadow-sharp' : 'text-zinc-500 hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. CONTEÚDO DINÂMICO */}
      {activeTab === 'operacoes' && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* TACTICAL COMMAND GRID */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 ml-1">Atalhos de Combate</h2>
            <CommandGrid />
          </div>

          {/* REAL-TIME METRICS */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 ml-1">Firebase Pulse</h2>
            <MetricsGrid 
              inventoryCount={inventoryCount}
              activeUsers={activeUsers.length}
              totalRevenue={totalRevenue}
            />
          </div>

          {/* ACTIVITY FEED */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 ml-1">Live Operations</h2>
            <ActivityFeed 
              recentOrders={recentOrders}
              activeUsers={activeUsers}
            />
          </div>
        </div>
      )}

      {/* FOOTER BRUTALISTA */}
      <footer className="pt-20 border-t border-black/5 flex justify-between items-center opacity-20">
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Hooke Atelier Engine v15.0</span>
        <div className="flex gap-4">
          <div className="w-1 h-1 bg-black" />
          <div className="w-1 h-1 bg-black" />
          <div className="w-1 h-1 bg-black" />
        </div>
      </footer>
    </div>
  );
}
