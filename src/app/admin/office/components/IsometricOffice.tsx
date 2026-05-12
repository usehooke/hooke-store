"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, Layout, Smartphone, 
  Aperture, ShieldCheck, Zap, Orbit,
  Monitor
} from "lucide-react";
import { AgentThought } from "./AgentThought";

const agents = [
  {
    id: "agent-growth",
    name: "Agent-Growth",
    role: "Director of Strategy",
    icon: TrendingUp,
    pos: { x: 1, y: 1 }, // Ilha 1 Superior
    color: "bg-black",
    thoughts: [
      "Auditando narrativa da marca...",
      "Conversão do carrinho subiu 12%.",
      "Projetando campanha de Verão 26.",
      "SEO: Hooke em 1º lugar."
    ]
  },
  {
    id: "tech-auditor",
    name: "Tech Auditor",
    role: "Security & QA",
    icon: ShieldCheck,
    pos: { x: 1, y: 2 }, // Ilha 1 Inferior (Frente a frente com Growth)
    color: "bg-amber-500",
    thoughts: [
      "Nenhum vazamento detectado.",
      "Build em Washington estável.",
      "Segurança Firebase reforçada.",
      "Linting Elite passivo."
    ]
  },
  {
    id: "ux-guardian",
    name: "UX Guardian",
    role: "Experiência de Luxo",
    icon: Layout,
    pos: { x: 3, y: 1 }, // Ilha 2 Superior
    color: "bg-blue-600",
    thoughts: [
      "Refinando espaçamentos.",
      "Acessibilidade garantida.",
      "Mapa de calor analisado.",
      "Otimizando Drawer."
    ]
  },
  {
    id: "fullstack-dev",
    name: "Admin Architect",
    role: "Fullstack Senior",
    icon: Zap,
    pos: { x: 3, y: 2 }, // Ilha 2 Inferior
    color: "bg-orange-500",
    thoughts: [
      "Tiny ERP sync ok.",
      "Refatorando backend Stripe.",
      "Webhook de pedidos ativo.",
      "LGPD Audit completo."
    ]
  },
  {
    id: "art-director",
    name: "Art Director",
    role: "Visual & IA Lead",
    icon: Aperture,
    pos: { x: 5, y: 1 }, // Ilha 3 Superior
    color: "bg-green-500",
    thoughts: [
      "Processando Musa 001 v2...",
      "Curadoria de cores concluída.",
      "Geração 4K ativa.",
      "Ajustando iluminação."
    ]
  },
  {
    id: "eng-mobile",
    name: "Mobile Architect",
    role: "Performance Lead",
    icon: Smartphone,
    pos: { x: 5, y: 2 }, // Ilha 3 Inferior
    color: "bg-cyan-500",
    thoughts: [
      "Next.js 15: Edge Runtime ok.",
      "PWA offline mode verificado.",
      "LCP em 0.8s.",
      "Sync Omnichannel ativo."
    ]
  },
  {
    id: "antigravity",
    name: "Antigravity",
    role: "Supreme Orchestrator",
    icon: Orbit,
    pos: { x: 3, y: 4 }, // Mesa Central / Comando
    color: "bg-purple-600",
    thoughts: [
      "Orquestrando fluxos.",
      "Requisição processada.",
      "Sistema em harmonia.",
      "Fase 9: Growth iniciada."
    ]
  }
];

export function IsometricOffice() {
  return (
    <div className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden bg-[#F8F8F8] font-sans">
      {/* Background Grid Layer (Flat) */}
      <style>{`
        .isometric-grid {
          backgroundImage: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px);
          backgroundSize: 100px 100px;
        }
      `}</style>
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none isometric-grid" />

      {/* Main 2D Container */}
      <div className="relative w-full max-w-[1000px] h-full flex items-center justify-center">
        
        {/* Sector Labels (Floor) */}
        <div className="absolute top-[20%] left-[10%] opacity-20 text-[60px] font-black text-gray-200 pointer-events-none uppercase tracking-tighter">Strategic</div>
        <div className="absolute top-[20%] left-[50%] opacity-20 text-[60px] font-black text-gray-200 pointer-events-none uppercase tracking-tighter">Visual Hub</div>
        <div className="absolute bottom-[20%] left-[30%] opacity-20 text-[60px] font-black text-gray-200 pointer-events-none uppercase tracking-tighter">Core Lab</div>

        {/* Agents Grid (Flat 2D) */}
        <div className="relative grid grid-cols-6 grid-rows-5 gap-0 w-[900px] h-[750px]">
          {agents.map((agent) => (
            // eslint-disable-next-line react/no-unknown-property
            <div 
              key={agent.id}
              className=\"relative flex items-center justify-center\"
              style={{ gridColumnStart: agent.pos.x + 1, gridRowStart: agent.pos.y + 1 }}
            >
              {/* Desk (Mesa de TI) - Estilo Tibia / Isométrico Top-Down */}
              <div className="absolute w-[160px] h-[100px] translate-y-4 -z-10 group">
                 {/* Mesa Top */}
                 <div className="absolute inset-0 bg-white border-2 border-gray-100 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] rounded-sm flex flex-col items-center justify-center gap-2 p-2">
                    {/* Keyboard / Laptop Mockup */}
                    <div className="w-12 h-8 bg-gray-50 border border-gray-100 rounded-[2px]" />
                 </div>
                 {/* Desk Legs (Simulated 2D) */}
                 <div className="absolute -bottom-2 left-2 w-1 h-3 bg-gray-200" />
                 <div className="absolute -bottom-2 right-2 w-1 h-3 bg-gray-200" />
              </div>

              {/* Agent Entity */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer group"
              >
                  {/* Thought Balloon */}
                  <AgentThought thoughts={agent.thoughts} isActive={true} />

                  {/* Visual Node with Idle Animation */}
                  <motion.div 
                    animate={{ 
                      y: [0, -4, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3 + Math.random() * 2,
                      ease: "easeInOut" 
                    }}
                    className={`w-14 h-14 ${agent.color} text-white flex items-center justify-center shadow-lg relative rounded-none group-hover:shadow-2xl transition-all border-4 border-white`}
                  >
                    <agent.icon size={24} strokeWidth={1.5} />
                  </motion.div>

                  {/* Label */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center w-32">
                    <p className="text-[9px] font-black tracking-tighter text-hooke-900 uppercase bg-white/90 px-2 py-0.5 inline-block border border-gray-100">
                      {agent.name}
                    </p>
                    <p className="text-[7px] font-bold text-gray-400 uppercase mt-0.5 tracking-[0.2em] leading-none">
                      {agent.role}
                    </p>
                  </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend / Overlay UI */}
      <div className="absolute top-8 right-8 p-6 border border-hooke-900 bg-white z-50 max-w-xs shadow-2xl">
        <h4 className="text-[10px] font-black tracking-[0.3em] text-hooke-900 uppercase flex items-center gap-2 mb-3">
          <Monitor size={12} /> HQ Virtual Command
        </h4>
        <div className="space-y-2">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-none bg-green-500 animate-pulse" />
             <span className="text-[9px] font-bold text-gray-900 uppercase tracking-widest italic">Operação 2D Ativa</span>
           </div>
           <p className="text-[9px] font-medium text-gray-500 leading-relaxed uppercase">
             Ambiente otimizado para monitoramento em tempo real dos agentes.
           </p>
        </div>
      </div>
    </div>
  );
}
