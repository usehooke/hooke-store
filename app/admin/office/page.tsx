"use client";

import { motion } from "framer-motion";
import { 
  Layout, 
  Smartphone, 
  Aperture, 
  ShieldCheck, 
  Orbit, 
  ArrowLeft,
  Activity,
  Zap,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";

const agents = [
  {
    id: "ux-guardian",
    name: "UX/UI Guardian",
    role: "Guardião do Hooke Style",
    status: "Active",
    statusColor: "bg-green-500",
    focus: "Refining 'Ultra-Light' spacing and enforcing Sharp Corners (rounded-none).",
    icon: Layout,
    skills: ["Framer Motion", "Typography", "Minimalism"],
    action: "Polishing transition curves"
  },
  {
    id: "eng-mobile",
    name: "Engineering Mobile",
    role: "O Motor Offline-First",
    status: "Syncing",
    statusColor: "bg-blue-500",
    focus: "Optimizing LocalStorage hydration and Next.js 15 performance.",
    icon: Smartphone,
    skills: ["Next.js 15", "Zustand", "PWA"],
    action: "Syncing cart state"
  },
  {
    id: "art-director",
    name: "Art Director",
    role: "Diretor de Arte de Moda",
    status: "Active",
    statusColor: "bg-green-500",
    focus: "Validating 'Golden Rule' (100% Founder fidelity) in new editorial prompts.",
    icon: Aperture,
    skills: ["AI Prompting", "Visual ID", "Editorial"],
    action: "Generating lookbook"
  },
  {
    id: "tech-auditor",
    name: "Technical Auditor",
    role: "Tech Lead & QA",
    status: "Monitoring",
    statusColor: "bg-amber-500",
    focus: "Monitoring Vercel build stability and Preventing Hardcoded Data leakage.",
    icon: ShieldCheck,
    skills: ["CI/CD", "Firestore", "Build Security"],
    action: "Auditing catalog.ts"
  },
  {
    id: "antigravity",
    name: "Antigravity",
    role: "Supreme Orchestrator",
    status: "Ready",
    statusColor: "bg-purple-500",
    focus: "Orchestrating agent workflows and processing user requests.",
    icon: Orbit,
    skills: ["NLI", "Context Management", "Full-stack"],
    action: "Executing Task Dashboard"
  }
];

const activityLog = [
  { time: "2 min ago", agent: "Tech Auditor", task: "Build lock engaged" },
  { time: "5 min ago", agent: "UX Guardian", task: "Updated globals.css spacing" },
  { time: "12 min ago", agent: "Art Director", task: "Founder likeness verified" },
  { time: "15 min ago", agent: "Eng Mobile", task: "PWA manifest updated" },
];

export default function VirtualOffice() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-20">
      {/* Header */}
      <header className="p-8 border-b border-black/5 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="p-2 hover:bg-black hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Hooke HQ</h1>
            <p className="text-[10px] font-bold tracking-[0.3em] text-black/40 uppercase">Virtual AI Agency Office</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-bold tracking-widest uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            System Online
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {/* Intro Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
            Nosso escritório está <span className="font-black">ativo.</span>
          </h2>
          <p className="max-w-2xl text-black/60 font-light text-lg">
            Acompanhe o status e as prioridades do nosso time de agentes especialistas em tempo real. Cada detalhe da Hooke é orquestrado por uma inteligência dedicada.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`border border-black p-8 flex flex-col justify-between group hover:bg-black hover:text-white transition-all duration-500 rounded-none relative overflow-hidden`}
            >
              {/* Agent Icon (Simbólico/Minimalista) */}
              <div className="mb-8">
                <agent.icon size={40} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black tracking-tighter">{agent.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent.statusColor}`} />
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">{agent.status}</span>
                  </div>
                </div>
                
                <p className="text-[11px] font-black tracking-widest text-black/40 uppercase mb-4 group-hover:text-white/40">
                  {agent.role}
                </p>

                <p className="text-sm font-light leading-relaxed mb-6 group-hover:text-white/80">
                  {agent.focus}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {agent.skills.map(skill => (
                    <span key={skill} className="text-[9px] font-bold tracking-widest border border-current px-2 py-1 uppercase">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Indicator */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Activity size={20} className="animate-pulse" />
              </div>
              
              {/* Current Action Footnote */}
              <div className="mt-8 pt-6 border-t border-current border-opacity-10 flex items-center gap-2">
                <Zap size={14} className="text-yellow-500" />
                <span className="text-[10px] font-bold tracking-widest uppercase italic">{agent.action}...</span>
              </div>
            </motion.div>
          ))}

          {/* Activity Log Card (Bento Style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-2 lg:col-span-1 border border-black p-8 flex flex-col bg-zinc-50"
          >
            <div className="flex items-center gap-3 mb-8">
              <Clock size={24} strokeWidth={1} />
              <h3 className="text-xl font-black tracking-tighter uppercase">Recent Activity</h3>
            </div>

            <div className="space-y-6">
              {activityLog.map((log, i) => (
                <div key={i} className="flex flex-col gap-1 border-l-2 border-black pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest uppercase">{log.agent}</span>
                    <span className="text-[10px] font-medium text-black/40">{log.time}</span>
                  </div>
                  <p className="text-sm font-light">{log.task}</p>
                </div>
              ))}
            </div>

            <button className="mt-auto pt-4 text-[10px] font-black tracking-[0.3em] uppercase hover:underline text-left">
              View Full Logs →
            </button>
          </motion.div>
        </div>

        {/* Global Stats bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border border-black p-6"
        >
          <div className="text-center md:text-left">
            <p className="text-[9px] font-black tracking-widest text-black/40 uppercase mb-1">Active Agents</p>
            <p className="text-2xl font-black tracking-tighter">05 / 05</p>
          </div>
          <div className="text-center md:text-left">
             <p className="text-[9px] font-black tracking-widest text-black/40 uppercase mb-1">Uptime</p>
             <p className="text-2xl font-black tracking-tighter">99.9%</p>
          </div>
          <div className="text-center md:text-left">
             <p className="text-[9px] font-black tracking-widest text-black/40 uppercase mb-1">Tasks Today</p>
             <p className="text-2xl font-black tracking-tighter">42</p>
          </div>
          <div className="text-center md:text-left">
             <p className="text-[9px] font-black tracking-widest text-black/40 uppercase mb-1">Brand Integrity</p>
             <div className="flex items-center justify-center md:justify-start gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <p className="text-sm font-black tracking-tighter">Elite Status</p>
             </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
