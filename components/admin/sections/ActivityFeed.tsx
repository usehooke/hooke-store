"use client";

import { TrendingUp, Zap, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ActivityFeedProps {
  conciergeCount: number;
}

export default function ActivityFeed({ conciergeCount }: ActivityFeedProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
      
      {/* STATUS DA OPERAÇÃO */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#FAFAFA] flex items-center gap-3 italic">
             <ShieldCheck size={14} className="text-emerald-500" /> Protocolo Operacional
          </h2>
        </div>
        
        <div className="bg-white/[0.02] border border-white/[0.05] p-10 space-y-8 relative overflow-hidden group">
          <div className="space-y-6">
            <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform cursor-default">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Sessões Concierge</span>
              <span className="text-[#FAFAFA] font-mono text-xs">{conciergeCount} ATIVAS</span>
            </div>
            <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform cursor-default">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Ticket Médio Est.</span>
              <span className="text-[#FAFAFA] font-mono text-xs">R$ 185,00</span>
            </div>
            <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform cursor-default">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Integridade de Dados</span>
              <span className="text-emerald-500 font-black text-[9px] uppercase italic tracking-tighter bg-emerald-500/10 px-2 py-0.5">Zod Shield Active</span>
            </div>
          </div>

          <Link 
            href="/admin/concierge"
            className="group flex items-center justify-center w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all gap-3"
          >
            Monitor em Tempo Real
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Sutil Background Graphic */}
          <ShoppingBag size={120} className="absolute right-[-30px] bottom-[-30px] opacity-[0.02] -rotate-12 pointer-events-none" />
        </div>
      </div>

      {/* AGENT GROWTH INSIGHTS */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#FAFAFA] flex items-center gap-3 italic">
            <TrendingUp size={14} className="text-zinc-500" /> Growth Intelligence
          </h2>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/50 border border-white/[0.05] p-10 relative overflow-hidden group"
        >
          <div className="flex gap-6 relative z-10">
            <div className="h-10 w-10 bg-yellow-500 text-black flex items-center justify-center rounded-none flex-shrink-0">
               <Zap size={20} fill="currentColor" />
            </div>
            <div className="space-y-3">
              <p className="text-[11px] text-[#FAFAFA] font-black uppercase tracking-[0.2em] italic">Oportunidade Detectada</p>
              <p className="text-[13px] text-zinc-400 leading-relaxed font-serif italic">
                &quot;O fluxo de visitantes no carrinho modularizado subiu 24%. Recomendo monitorar o tempo de fechamento via Mercado Pago.&quot;
              </p>
              <div className="pt-4 flex gap-4">
                <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest transition-colors hover:text-white cursor-pointer">Seguir Sugestão</span>
                <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest transition-colors hover:text-white cursor-pointer">Ignorar</span>
              </div>
            </div>
          </div>
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-[200%] animate-[scanline_8s_linear_infinite] pointer-events-none" />
        </motion.div>
      </div>

    </div>
  );
}
