"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Activity,
  Clock,
  CheckCircle2,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { IsometricOffice } from "./components/IsometricOffice";

const activityLog = [
  { time: "2 min ago", agent: "Tech Auditor", task: "Sinalização Elite validada" },
  { time: "5 min ago", agent: "UX Guardian", task: "Refatoração de Drawer lateral" },
  { time: "12 min ago", agent: "Art Director", task: "Feminino Musa 001 v2 em fila" },
  { time: "15 min ago", agent: "Eng Mobile", task: "Update de infraestrutura Vercel" },
];

export default function VirtualOffice() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-10">
      {/* Header Elite */}
      <header className="p-8 border-b border-black/5 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-[100]">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="p-2 hover:bg-black hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Hooke Intelligence HQ</h1>
            <p className="text-[10px] font-bold tracking-[0.3em] text-black/40 uppercase mt-1">Escritório Virtual • Em Tempo Real</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black tracking-widest uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Core Status: Elite
          </div>
        </div>
      </header>

      <main className="w-full">
        {/* Hero Isometric Scene */}
        <section className="relative border-b border-gray-100">
           <IsometricOffice />
           
           {/* Scene Intro Overlay */}
           <div className="absolute top-12 left-12 max-w-sm pointer-events-none z-10">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.5 }}
             >
               <h2 className="text-4xl font-black tracking-tighter text-hooke-900 leading-none mb-4">
                 Agentes em <br />Sincronia.
               </h2>
               <p className="text-[11px] font-bold tracking-widest text-black/50 uppercase leading-relaxed">
                 O coração estratégico da Hooke onde cada agente orquestra uma parte da sua marca.
               </p>
             </motion.div>
           </div>
        </section>

        {/* Bottom Details Grid */}
        <section className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
          
          {/* Recent Activity (Terminal Style) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 border-b border-black pb-4">
              <Terminal size={18} />
              <h3 className="text-xs font-black tracking-[0.3em] uppercase">Eventos Recentes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activityLog.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + (i * 0.1) }}
                  className="p-4 border border-gray-100 bg-gray-50/50 flex flex-col gap-2 group hover:border-black transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black tracking-widest uppercase text-hooke-900">{log.agent}</span>
                    <div className="flex items-center gap-2">
                       <Clock size={10} className="text-gray-400" />
                       <span className="text-[9px] font-bold text-gray-400">{log.time}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-600 line-clamp-1">{log.task}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats / Status Pod */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 border-b border-black pb-4">
              <Activity size={18} />
              <h3 className="text-xs font-black tracking-[0.3em] uppercase">Métricas de Pulsação</h3>
            </div>
            <div className="space-y-3">
               {[
                 { label: "Integridade de Marca", val: "Elite", icon: CheckCircle2, sub: "Checklist 100%" },
                 { label: "Latência de Decisão", val: "0.4ms", icon: Clock, sub: "Edge Computing" },
                 { label: "Sincronização Tiny", val: "Ativa", icon: CheckCircle2, sub: "Intervalo 5min" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 border border-gray-100 italic">
                   <div>
                     <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                     <p className="text-sm font-black tracking-tighter text-hooke-900">{item.val}</p>
                   </div>
                   <item.icon size={20} className="text-green-500" />
                 </div>
               ))}
            </div>
          </div>

        </section>
      </main>

      {/* Final Footer */}
      <footer className="text-center py-10">
         <p className="text-[9px] font-black tracking-[0.4em] text-gray-300 uppercase italic">
           Artificial Intelligence Orchestration Layer • v2.6.0
         </p>
      </footer>
    </div>
  );
}
