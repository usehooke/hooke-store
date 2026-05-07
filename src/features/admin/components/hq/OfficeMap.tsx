"use client";
import React, { useState, useRef, useEffect } from "react";
import { AgentCharacter } from "./AgentCharacter";
import { SuggestionBoxModal } from "./SuggestionBoxModal";
import { OfficeAmbience } from "./OfficeAmbience";
import { useAgentLife, WAYPOINTS } from "@/hooks/useAgentLife";
import { Inbox, Shield, Cpu, Zap, Coffee, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Componente OfficeMap:
 * O coração do Virtual HQ. Gerencia o layout dinâmico em canvas 1500x1500px,
 * navegação por drag e renderização de agentes autônomos.
 */
export function OfficeMap() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const mapRef = useRef<HTMLDivElement>(null);

    const initialAgents = [
        { id: "1", name: "Alpha", role: "CTO / Robot Blue", avatar: "/assets/hq/agents/techlead.png", position: WAYPOINTS.EXECUTIVE_DESK[0] },
        { id: "2", name: "Beta", role: "CGO / Woman Blonde", avatar: "/assets/hq/agents/growth.png", position: WAYPOINTS.EXECUTIVE_DESK[1] },
        { id: "3", name: "Gamma", role: "Creative / Hooded", avatar: "/assets/hq/agents/concierge.png", position: WAYPOINTS.CREATIVE_WORKSHOP[0] },
        { id: "4", name: "Delta", role: "Tactical / Robot White", avatar: "/assets/hq/agents/seo.png", position: WAYPOINTS.WAR_ROOM[0] },
        { id: "5", name: "Epsilon", role: "Strategist / Robot Green", avatar: "/assets/hq/agents/growth.png", position: WAYPOINTS.EXECUTIVE_DESK[2] },
        { id: "6", name: "Zeta", role: "Ambassador / Redcap", avatar: "/assets/hq/agents/concierge.png", position: WAYPOINTS.LOUNGE[0] }
    ];

    const agentStates = useAgentLife(initialAgents);

    useEffect(() => {
        if (mapRef.current) {
            const el = mapRef.current;
            el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
            el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
        }
    }, []);

    // Handlers para Panning (Arrastar Mapa)
    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (!mapRef.current) return;
        setStartX(e.pageX - mapRef.current.offsetLeft);
        setStartY(e.pageY - mapRef.current.offsetTop);
        setScrollLeft(mapRef.current.scrollLeft);
        setScrollTop(mapRef.current.scrollTop);
    };

    const onMouseLeave = () => setIsDragging(false);
    const onMouseUp = () => setIsDragging(false);

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !mapRef.current) return;
        e.preventDefault();
        const x = e.pageX - mapRef.current.offsetLeft;
        const y = e.pageY - mapRef.current.offsetTop;
        const walkX = (x - startX) * 1.5; 
        const walkY = (y - startY) * 1.5;
        mapRef.current.scrollLeft = scrollLeft - walkX;
        mapRef.current.scrollTop = scrollTop - walkY;
    };

    return (
        <div 
            ref={mapRef}
            className="w-full h-full overflow-auto hide-scrollbar cursor-grab active:cursor-grabbing bg-[#0a0a0a]"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        >
            <div className={cn(
                "relative w-[1500px] h-[1500px] bg-[#0d0d0d] mx-auto overflow-hidden",
                "shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border-[1px] border-white/5"
            )}>
                
                {/* Refined Dynamic Grid Background */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                     style={{ 
                        backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                        backgroundSize: '80px 80px' 
                     }} 
                />

                {/* THE WAR ROOM */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-[80px] left-[450px] w-[600px] h-[350px] bg-emerald-500/[0.02] border border-emerald-500/10 shadow-alabastro flex flex-col items-center justify-start py-8"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <Shield size={16} className="text-emerald-500/50" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/70 italic">The War Room</h2>
                    </div>
                    <div className="w-[70%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                </motion.div>

                {/* EXECUTIVE SUITE */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="absolute top-[500px] left-[450px] w-[600px] h-[450px] bg-zinc-900/50 border border-white/5 shadow-sharp flex flex-col items-center justify-center p-1"
                >
                    <div className="bg-black/20 w-full h-full border border-white/5 flex flex-col items-center justify-center">
                        <div className="flex items-center gap-4 mb-2">
                            <Cpu size={20} className="text-white/10" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">Executive Suite</h2>
                        </div>
                        <p className="text-[8px] text-white/10 uppercase tracking-widest font-black">Core Intelligence</p>
                        
                        <div className="mt-16 w-[450px] h-[150px] border border-white/5 bg-white/[0.01] flex items-center justify-center">
                            <div className="w-[80%] h-[1px] bg-white/5" />
                        </div>
                    </div>
                </motion.div>

                {/* CREATIVE WORKSHOP */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-[300px] left-[80px] w-[320px] h-[550px] bg-zinc-900/20 border border-white/5 shadow-sharp p-8"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <Zap size={16} className="text-zinc-500" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Creative Lab</h2>
                    </div>
                    <div className="w-full h-full border-t border-white/5 pt-8">
                        <div className="w-full h-[300px] border border-dashed border-white/5" />
                    </div>
                </motion.div>

                {/* LOUNGE VIP */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-[1000px] left-[550px] w-[500px] h-[350px] bg-zinc-900/40 border border-white/5 p-12 flex flex-col items-end shadow-sharp"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Elite Lounge</h2>
                        <Coffee size={18} className="text-white/10" />
                    </div>
                    <div className="w-[200px] h-[120px] border border-white/5 mt-auto ml-auto bg-black/20" />
                </motion.div>

                {/* ZEN GARDEN */}
                <motion.div 
                    className="absolute top-[800px] left-[1110px] w-[300px] h-[450px] bg-blue-500/[0.01] border border-blue-500/10 flex flex-col items-center justify-center shadow-sharp"
                >
                   <Sparkles size={20} className="text-blue-500/10 mb-6" />
                   <span className="text-[8px] font-black uppercase tracking-[0.8em] text-blue-500/20 vertical-rl">Recovery Area</span>
                </motion.div>

                {/* HUD: Feedback Button */}
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-20 left-20 w-[80px] h-[80px] bg-white text-black shadow-sharp flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-200 active:scale-95 transition-all group z-40 pointer-events-auto border border-black"
                >
                    <Inbox size={28} className="group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-widest mt-2">Inbox</span>
                </div>

                {/* Ambience Component */}
                <OfficeAmbience />

                {/* Global HQ Status HUD */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-8 py-3 shadow-sharp z-40 pointer-events-none">
                    <p className="text-[9px] text-white font-black uppercase tracking-[0.5em] flex items-center gap-4">
                        <span className="w-2 h-2 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                        Hooke Elite Virtual HQ <span className="text-white/20">|</span> v15.0 Active
                    </p>
                </div>

                {/* Render Dynamic Agents */}
                {agentStates.map((agentState, idx) => (
                    <AgentCharacter 
                        key={initialAgents[idx].id} 
                        {...initialAgents[idx]} 
                        position={agentState.position}
                        thought={agentState.thought}
                        status={agentState.status}
                    />
                ))}

            </div>

            <SuggestionBoxModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .vertical-rl { writing-mode: vertical-rl; }
            `}</style>
        </div>
    );
}
