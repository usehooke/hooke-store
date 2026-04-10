"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AgentCharacter } from "./AgentCharacter";
import { SuggestionBoxModal } from "./SuggestionBoxModal";
import { OfficeAmbience } from "./OfficeAmbience";
import { useAgentLife, WAYPOINTS } from "@/hooks/useAgentLife";
import { Inbox } from "lucide-react";

export function OfficeMap() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const mapRef = useRef<HTMLDivElement>(null);

    // Definição inicial dos Agentes de Elite (Diretoria)
    const initialAgents = [
        { id: "1", name: "Alpha", role: "CTO", avatar: "/assets/hq/agents/techlead.png", position: WAYPOINTS.EXECUTIVE_DESK[0] },
        { id: "2", name: "Beta", role: "CGO & Creative", avatar: "/assets/hq/agents/growth.png", position: WAYPOINTS.EXECUTIVE_DESK[1] },
        { id: "3", name: "Gamma", role: "CXO & UX Guardian", avatar: "/assets/hq/agents/concierge.png", position: WAYPOINTS.EXECUTIVE_DESK[2] },
        { id: "4", name: "Delta", role: "Head of AI Strategy", avatar: "/assets/hq/agents/seo.png", position: WAYPOINTS.EXECUTIVE_DESK[3] },
        { id: "5", name: "The Voice", role: "Narrative Authority", avatar: "/assets/hq/agents/techlead.png", position: WAYPOINTS.CREATIVE_WORKSHOP[2] } // Placeholder avatar por enquanto
    ];

    const agentStates = useAgentLife(initialAgents);

    // Centralizar mapa ao carregar
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
            className="w-full h-full overflow-auto hide-scrollbar cursor-grab active:cursor-grabbing bg-[#1a1a1a]"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        >
           <div className="relative w-[1200px] h-[1200px] bg-[#f5f5f5] mx-auto overflow-hidden shadow-2xl border-[10px] border-stone-800/20">
              
              <Image 
                src="/assets/hq/map_v3.png"
                alt="Hooke Elite Virtual HQ v4 - Living Studio Garage"
                fill
                className="object-cover pointer-events-none select-none opacity-40 grayscale-[0.3]"
                priority
              />

              {/* Camadas de Estrutura: Paredes e Sombras (Sensação de Portas e Salas) */}
              <div className="absolute inset-0 pointer-events-none">
                 {/* War Room Glass Walls Effect */}
                 <div className="absolute top-[20px] left-[500px] w-[320px] h-[360px] border-[2px] border-emerald-500/10 bg-emerald-500/[0.02] backdrop-blur-[1px] shadow-inner" />
                 
                 {/* Creative Section Shadow */}
                 <div className="absolute top-[120px] left-[130px] w-[350px] h-[350px] bg-stone-900/[0.03] border-b border-stone-300/30" />

                 {/* Portas Virtuais (Visual markers) */}
                 <div className="absolute top-[380px] left-[180px] w-12 h-1 bg-stone-400/50" />
                 <div className="absolute top-[320px] left-[500px] w-1 h-12 bg-emerald-400/30 shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
              </div>

              {/* Botão de Feedback */}
              <div 
                 onClick={() => setIsModalOpen(true)}
                 className="absolute bottom-20 left-20 w-[60px] h-[60px] bg-stone-900 border border-stone-800 text-white rounded-full shadow-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-all group z-30 pointer-events-auto"
              >
                 <Inbox size={20} className="text-stone-300 group-hover:text-emerald-400 transition-colors" />
                 <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-stone-900 text-white text-[8px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap tracking-widest transition-all pointer-events-none uppercase">
                    Feedback Direto
                 </div>
              </div>

              {/* Componente de Atmosfera Sonora */}
              <OfficeAmbience />

              {/* Status Global do QG */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-none z-30 pointer-events-none">
                 <p className="text-[9px] text-white/60 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Hooke Elite Operations Room <span className="text-white/20">|</span> Zen Simulation Active
                 </p>
              </div>

              {/* Renderização dos Agentes de Elite Dinâmicos */}
              {initialAgents.map((agent, idx) => (
                 <AgentCharacter 
                    key={agent.id} 
                    {...agent} 
                    position={agentStates[idx].position}
                    thought={agentStates[idx].thought}
                 />
              ))}

           </div>

           <SuggestionBoxModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

           <style jsx>{`
               .hide-scrollbar::-webkit-scrollbar { display: none; }
               .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
           `}</style>
        </div>
    );
}
