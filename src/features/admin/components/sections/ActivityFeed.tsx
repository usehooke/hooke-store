import { TrendingUp, Zap, ArrowRight, ShieldCheck, ShoppingBag, MessageSquare, Printer, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ActivityFeedProps {
  conciergeCount: number;
  sessions: any[];
}

export default function ActivityFeed({ conciergeCount, sessions }: ActivityFeedProps) {
  return (
    <div className="space-y-10">
      
      {/* SEÇÃO: CONCIERGE LIVE */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-900 flex items-center gap-3 italic">
             <MessageSquare size={14} className="text-black" /> Concierge Live Sync
          </h2>
        </div>
        
        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session, idx) => (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-black/[0.05] p-6 hover:shadow-lg hover:shadow-black/[0.01] transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Cliente</p>
                    <p className="text-sm font-serif text-zinc-900">{session.customerName || 'Visitante Anônimo'}</p>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 bg-zinc-50 border border-black/[0.05] text-emerald-500 uppercase tracking-tighter">Ativo</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                  <ShoppingBag size={10} />
                  Interesse: {session.lastProduct || 'Navegando'}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-zinc-50 border border-dashed border-black/[0.05] p-10 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">Nenhuma sessão ativa no momento</p>
            </div>
          )}
        </div>
      </div>

      {/* SEÇÃO: AÇÕES RÁPIDAS (LOGÍSTICA) */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-900 flex items-center gap-3 italic">
            <Zap size={14} className="text-zinc-400" /> Ações Rápidas de Elite
          </h2>
        </div>
        
        <div className="bg-[#FDFDFD] border border-black/[0.05] p-8 space-y-6 relative overflow-hidden">
          <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-2 font-mono">Últimos Pedidos Requerendo Atenção</p>
          
          <div className="space-y-4">
            {/* Cards de Ação Rápida */}
            {[1].map((_, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-white border border-black/[0.03] group hover:border-black/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-zinc-50 flex items-center justify-center border border-black/[0.05]">
                      <ShoppingBag size={14} className="text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-900">PEDIDO #2026-X</p>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Aguardando Postagem</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-black border border-transparent hover:border-black/5" title="Imprimir Etiqueta">
                      <Printer size={14} />
                    </button>
                    <button className="p-2 hover:bg-emerald-50 transition-colors text-zinc-400 hover:text-emerald-500 border border-transparent hover:border-emerald-500/10" title="Marcar como Enviado">
                      <CheckCircle2 size={14} />
                    </button>
                  </div>
               </div>
            ))}
          </div>

          <Link 
            href="/admin/pedidos"
            prefetch={false}
            className="flex items-center justify-center w-full py-4 mt-6 border border-black bg-black text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all gap-3"
          >
            Ver Todos os Pedidos
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
}
