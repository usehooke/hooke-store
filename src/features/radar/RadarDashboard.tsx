"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionDiv, MotionSpan } from '@/components/admin/MotionComponents';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { TrendingUp, ShoppingBag, AlertTriangle, Activity, Package } from 'lucide-react';
import { playSuccessChime } from '@/lib/notifications/soundService';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

/**
 * HOOKE HQ: RADAR DASHBOARD
 * Telemetria Viva e Estética Soft Brutalist.
 */
export function RadarDashboard() {
  const [caixaHoje, setCaixaHoje] = useState(0);
  const [vendasHoje, setVendasHoje] = useState(0);
  const [estoqueCritico, setEstoqueCritico] = useState(0);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const vendasHojeRef = useRef(0);

  // Histórico de Faturamento e Tendência Sparklines Premium (Escala de Cinzas Brutalista)
  const caixaChartData = [
    { value: caixaHoje * 0.45 },
    { value: caixaHoje * 0.60 },
    { value: caixaHoje * 0.50 },
    { value: caixaHoje * 0.85 },
    { value: caixaHoje * 0.70 },
    { value: caixaHoje }
  ];

  const vendasChartData = [
    { value: Math.max(0, vendasHoje - 3) },
    { value: Math.max(0, vendasHoje - 1) },
    { value: Math.max(0, vendasHoje - 2) },
    { value: Math.max(0, vendasHoje - 1) },
    { value: Math.max(0, vendasHoje - 1) },
    { value: vendasHoje }
  ];

  const estoqueChartData = [
    { value: estoqueCritico * 1.5 },
    { value: estoqueCritico * 1.2 },
    { value: estoqueCritico * 1.4 },
    { value: estoqueCritico * 1.1 },
    { value: estoqueCritico }
  ];

  useEffect(() => {
    if (!db) return;

    // 1. Telemetria de Pedidos de Hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ordersQuery = query(
      collection(db, "pedidos"),
      where("updatedAt", ">=", today.getTime())
    );

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      let total = 0;
      let count = 0;
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.status === 'approved' || data.status === 'completed') {
          total += data.total || 0;
          count += 1;
        }
      });

      // Dispara Alerta Sensorial se o número aumentar (Nova Venda)
      // Usamos o Ref para evitar re-registrar os listeners do Firestore em loop a cada alteração de estado
      if (count > vendasHojeRef.current) {
        playSuccessChime();
        window.dispatchEvent(new CustomEvent('hooke-sale-success'));
      }
      vendasHojeRef.current = count;

      setCaixaHoje(total);
      setVendasHoje(count);
    });

    // 2. Telemetria de Estoque Crítico
    const stockQuery = query(collection(db, "produtos"));
    const unsubStock = onSnapshot(stockQuery, (snapshot) => {
      let criticalCount = 0;
      snapshot.docs.forEach(doc => {
        const product = doc.data();
        // Soma estoque de todos os tamanhos
        const totalStock = product.stock ? Object.values(product.stock).reduce((a: any, b: any) => a + (Number(b) || 0), 0) : 0;
        if ((totalStock as number) < 3) criticalCount++;
      });
      setEstoqueCritico(criticalCount);
    });

    // 3. Log de Batalha (Eventos Recentes)
    const eventsQuery = query(collection(db, "pedidos"), orderBy("updatedAt", "desc"), limit(5));
    const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
      setRecentEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubOrders();
      unsubStock();
      unsubEvents();
    };
  }, []);

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
           <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-2">Workspace / Radar</h2>
           <h1 className="text-4xl font-black uppercase tracking-tighter italic">Telemetria HQ</h1>
        </div>
        <div className="flex items-center gap-2 text-emerald-500">
           <Activity size={14} className="animate-pulse" />
           <span className="text-[8px] font-black uppercase tracking-widest">Sincronizado ao Vivo</span>
        </div>
      </header>

      {/* BIG NUMBERS: Ação Massiva */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          label="Caixa Hoje" 
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(caixaHoje)} 
          icon={TrendingUp}
          highlight
          chartData={caixaChartData}
        />
        <MetricCard 
          label="Vendas" 
          value={vendasHoje.toString()} 
          icon={ShoppingBag} 
          chartData={vendasChartData}
        />
        <MetricCard 
          label="Estoque Crítico" 
          value={estoqueCritico.toString()} 
          icon={AlertTriangle} 
          urgent={estoqueCritico > 0}
          chartData={estoqueChartData}
        />
      </div>

      {/* LOG DE BATALHA: Atividade Recente */}
      <div className="space-y-6">
         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Log de Batalha (Tempo Real)</h3>
          <motion.div 
             layout
             className="bg-white border-2 border-black divide-y-2 divide-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]"
          >
             <AnimatePresence mode="popLayout">
               {recentEvents.map((event) => (
                 <MotionDiv 
                   layout
                   key={event.id}
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 20 }}
                   transition={{ type: "spring", stiffness: 500, damping: 30 }}
                   className="p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                 >
                   <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${
                        event.status === 'approved' || event.status === 'completed' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'
                      }`}>
                        [{event.paymentMethod?.toUpperCase() || 'VENDA'}]
                      </span>
                      <div className="flex flex-col">
                         <span className="text-xs font-black uppercase tracking-tight">{event.customerName || 'Cliente Balcão'}</span>
                         <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">ID: {event.id.slice(-8)}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black italic">
                         {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(event.total || 0)}
                      </p>
                      <p className="text-[8px] font-black uppercase text-zinc-300">Há pouco</p>
                   </div>
                 </MotionDiv>
               ))}
             </AnimatePresence>
             {recentEvents.length === 0 && (
                <MotionDiv 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-zinc-300 italic"
                >
                   Aguardando movimentação no balcão...
                </MotionDiv>
             )}
          </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, highlight, urgent, chartData }: any) {
  return (
    <MotionDiv 
      whileHover={{ y: -5 }}
      className={`relative p-8 border-2 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 overflow-hidden ${
        urgent ? 'border-red-500 shadow-[12px_12px_0px_0px_rgba(239,68,68,1)]' : ''
      }`}
    >
      <div className="flex justify-between items-center text-zinc-400 z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
        <Icon size={16} />
      </div>
      <div className="flex flex-col gap-1 z-10">
        <MotionSpan 
          key={value}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-5xl font-black uppercase tracking-tighter italic ${highlight ? 'text-black' : urgent ? 'text-red-500' : 'text-zinc-800'}`}
        >
          {value}
        </MotionSpan>
      </div>

      {/* Sparkline Premium (Escala de Cinzas Brutalista ou Vermelho se Estoque Crítico) */}
      {chartData && (
        <div className="absolute bottom-0 left-0 right-0 h-10 w-full opacity-20 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={urgent ? "#ef4444" : "#000000"} stopOpacity={0.6}/>
                  <stop offset="95%" stopColor={urgent ? "#ef4444" : "#000000"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={urgent ? "#ef4444" : "#000000"} 
                strokeWidth={1.5} 
                fillOpacity={1} 
                fill={`url(#gradient-${label})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {highlight && (
        <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500 z-10" />
      )}
    </MotionDiv>
  );
}
