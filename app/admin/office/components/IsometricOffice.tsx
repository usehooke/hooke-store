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
    pos: { x: 0, y: 0 },
    sector: "Strategic Tower",
    color: "bg-black",
    thoughts: [
      "Auditando narrativa da marca...",
      "Conversão do carrinho subiu 12%.",
      "Projetando campanha de Verão 26.",
      "SEO: Hooke em 1º lugar para 'Minimalismo Industrial'."
    ]
  },
  {
    id: "ux-guardian",
    name: "UX Guardian",
    role: "Experiência de Luxo",
    icon: Layout,
    pos: { x: 1, y: 0 },
    sector: "Strategic Tower",
    color: "bg-blue-600",
    thoughts: [
      "Refinando espaçamentos do catálogo.",
      "Acessibilidade garantida (A11y).",
      "Mapa de calor analisado.",
      "Otimizando Drawer de edição."
    ]
  },
  {
    id: "art-director",
    name: "Art Director",
    role: "Visual & IA Lead",
    icon: Aperture,
    pos: { x: 0, y: 1 },
    sector: "Visual Hub",
    color: "bg-green-500",
    thoughts: [
      "Processando Musa 001 v2...",
      "Curadoria de cores concluída.",
      "Geração de texturas em 4K.",
      "Ajustando iluminação do Bento Hero."
    ]
  },
  {
    id: "eng-mobile",
    name: "Mobile Architect",
    role: "Performance Lead",
    icon: Smartphone,
    pos: { x: 1, y: 1 },
    sector: "Core Lab",
    color: "bg-cyan-500",
    thoughts: [
      "Next.js 15: Edge Runtime estável.",
      "PWA offline mode verificado.",
      "LCP reduzido para 0.8s.",
      "Sync Omnichannel ativo."
    ]
  },
  {
    id: "fullstack-dev",
    name: "Admin Architect",
    role: "Fullstack Senior",
    icon: Zap,
    pos: { x: 2, y: 1 },
    sector: "Core Lab",
    color: "bg-orange-500",
    thoughts: [
      "Tiny ERP sync ok.",
      "Refatorando backend do Stripe.",
      "Webhook de pedidos ativo.",
      "LGPD Audit completo."
    ]
  },
  {
    id: "tech-auditor",
    name: "Tech Auditor",
    role: "Security & QA",
    icon: ShieldCheck,
    pos: { x: 2, y: 0 },
    sector: "Security Bunker",
    color: "bg-amber-500",
    thoughts: [
      "Nenhum vazamento de dado hardcoded.",
      "Build em Washington estável.",
      "Segurança da API Firebase reforçada.",
      "Linting Elite passivo."
    ]
  },
  {
    id: "antigravity",
    name: "Antigravity",
    role: "Supreme Orchestrator",
    icon: Orbit,
    pos: { x: 1, y: 2 },
    sector: "Nexus",
    color: "bg-purple-600",
    thoughts: [
      "Orquestrando fluxos de agentes.",
      "Requisição do Fernando processada.",
      "Sistema em harmonia total.",
      "Próximo passo: Fase 9 (Growth)."
    ]
  }
];

export function IsometricOffice() {
  return (
    <div className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Grid Layer */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Main Isometric Container */}
      <div className="relative flex items-center justify-center" 
           style={{ transform: 'perspective(1000px) rotateX(60deg) rotateZ(-45deg)', transformStyle: 'preserve-3d' }}>
        
        {/* Floor Plane */}
        <div className="absolute w-[600px] h-[600px] border-[1px] border-black/10 bg-gray-50/50" 
             style={{ transform: 'translateZ(-1px)' }} />

        {/* Sectors / Ghost Rooms */}
        <div className="absolute w-[200px] h-[200px] border border-black/5 left-0 top-0 bg-black/[0.02]" />
        <div className="absolute w-[200px] h-[200px] border border-black/5 left-[200px] top-0 bg-blue-500/[0.02]" />
        <div className="absolute w-[200px] h-[200px] border border-black/5 left-[400px] top-0 bg-amber-500/[0.02]" />
        <div className="absolute w-[200px] h-full border border-black/5 left-[200px] top-[200px] bg-purple-500/[0.02]" />

        {/* Agents Grid */}
        <div className="grid grid-cols-3 grid-rows-3 w-[600px] h-[600px]">
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className="relative w-[200px] h-[200px] flex items-center justify-center"
              style={{ gridColumnStart: agent.pos.x + 1, gridRowStart: agent.pos.y + 1 }}
            >
              {/* Agent Entity */}
              <motion.div
                initial={{ opacity: 0, z: 50 }}
                animate={{ opacity: 1, z: 20 }}
                className="relative cursor-pointer group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Counter-transform to make labels readable */}
                <div style={{ transform: 'rotateZ(45deg) rotateX(-60deg)', transformStyle: 'preserve-3d' }}>
                  
                  {/* Thought Balloon */}
                  <AgentThought thoughts={agent.thoughts} isActive={true} />

                  {/* Visual Node */}
                  <div className={`w-16 h-16 ${agent.color} text-white flex items-center justify-center shadow-2xl relative group-hover:scale-110 transition-transform`}>
                    <agent.icon size={32} strokeWidth={1.5} />
                    
                    {/* Shadow underneath (on the floor) */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-12 h-4 bg-black/10 blur-md -z-10" />
                  </div>

                  {/* Label */}
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center w-32 whitespace-nowrap">
                    <p className="text-[10px] font-black tracking-tighter text-hooke-900 uppercase bg-white/80 backdrop-blur-sm px-2 py-0.5 inline-block">
                      {agent.name}
                    </p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5 tracking-widest leading-none">
                      {agent.role}
                    </p>
                  </div>
                </div>

                {/* Vertical Indicator Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-t from-black/0 via-black/10 to-transparent -z-20" />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend / Overlay UI */}
      <div className="absolute bottom-8 left-8 p-6 border border-hooke-900/10 bg-white/80 backdrop-blur-md z-50 max-w-xs transition-all hover:border-hooke-900">
        <h4 className="text-[10px] font-black tracking-[0.3em] text-hooke-900 uppercase flex items-center gap-2 mb-3">
          <Monitor size={12} /> Live HQ Status
        </h4>
        <div className="space-y-2">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic">Processando Vibe Industrial...</span>
           </div>
           <p className="text-[10px] font-medium text-gray-400">
             Agentes estão sincronizados com o repositório principal em Washington via Vercel Edge.
           </p>
        </div>
      </div>
    </div>
  );
}
