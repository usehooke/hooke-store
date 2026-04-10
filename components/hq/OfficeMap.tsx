"use client";
import React, { useState, useRef, useEffect } from "react";
import { AgentCharacter } from "./AgentCharacter";
import { SuggestionBoxModal } from "./SuggestionBoxModal";
import { OfficeAmbience } from "./OfficeAmbience";
import { useAgentLife, WAYPOINTS } from "@/hooks/useAgentLife";
import { Inbox, Shield, Cpu, Zap, Coffee, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
            <div className="relative w-[1500px] h-[1500px] bg-stone-900 mx-auto overflow-hidden shadow-2xl border-[20px] border-stone-800/20">
                
                {/* Background Grid Accent */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* THE WAR ROOM */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-[80px] left-[450px] w-[600px] h-[350px] bg-emerald-500/[0.03] backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.05)] flex flex-col items-center justify-start py-8"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Shield size={16} className="text-emerald-500/50" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/70">The War Room</h2>
                    </div>
                    <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                </motion.div>

                {/* EXECUTIVE SUITE */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="absolute top-[500px] left-[450px] w-[600px] h-[450px] bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_rgba(255,255,255,0.02)] flex flex-col items-center justify-center"
                >
                    <div className="flex items-center gap-3 mb-1">
                        <Cpu size={20} className="text-white/20" />
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Executive Suite</h2>
                    </div>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest font-medium">Hooke Core Leadership</p>
                    
                    {/* Mesa Executiva Visual */}
                    <div className="mt-12 w-[400px] h-[120px] border border-white/5 rounded-full bg-white/[0.01] flex items-center justify-center">
                        <div className="w-[60%] h-[1px] bg-white/5" />
                    </div>
                </motion.div>

                {/* CREATIVE WORKSHOP */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-[300px] left-[80px] w-[320px] h-[550px] bg-stone-100/[0.02] backdrop-blur-lg border border-white/5 rounded-[3rem] p-8"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Zap size={16} className="text-amber-500/50" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Creative Workshop</h2>
                    </div>
                    <div className="space-y-4 opacity-10">
                        <div className="h-2 w-full bg-white/20 rounded-full" />
                        <div className="h-2 w-[70%] bg-white/20 rounded-full" />
                        <div className="h-2 w-[90%] bg-white/20 rounded-full" />
                    </div>
                </motion.div>

                {/* LOUNGE VIP */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-[1000px] left-[550px] w-[500px] h-[350px] bg-stone-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-end"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Lounge VIP</h2>
                        <Coffee size={18} className="text-white/20" />
                    </div>
                    <div className="w-[150px] h-[100px] border border-white/5 rounded-2xl mt-auto ml-auto" />
                </motion.div>

                {/* ZEN GARDEN / RECOVERY ZONE */}
                <motion.div 
                    className="absolute top-[800px] left-[1110px] w-[300px] h-[450px] bg-blue-500/[0.02] backdrop-blur-md border border-blue-500/10 rounded-full flex flex-col items-center justify-center"
                >
                   <Sparkles size={20} className="text-blue-500/20 mb-4" />
                   <span className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-500/30 vertical-rl">Zen Zone</span>
                </motion.div>

                {/* Feedback Button */}
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-20 left-20 w-[70px] h-[70px] bg-white text-black rounded-full shadow-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all group z-40 pointer-events-auto"
                >
                    <Inbox size={24} className="group-hover:translate-y-[-2px] transition-transform" />
                    <span className="text-[7px] font-black uppercase tracking-tighter mt-1">Inbox</span>
                </div>

                {/* Ambience Component */}
                <OfficeAmbience />

                {/* Global HQ Status */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full z-40 pointer-events-none shadow-2xl">
                    <p className="text-[9px] text-white font-black uppercase tracking-[0.3em] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                        Hooke Elite Virtual HQ <span className="text-white/20">|</span> v5.0 Active
                    </p>
                </div>

                {/* Render Dynamic Agents */}
                {agentStates.map((agentState, idx) => (
                    <AgentCharacter 
                        key={initialAgents[idx].id} 
                        {...initialAgents[idx]} 
                        position={agentState.position}
                        thought={agentState.thought}
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
