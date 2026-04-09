"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AgentCharacter } from "./AgentCharacter";
import { SuggestionBoxModal } from "./SuggestionBoxModal";
import { Inbox } from "lucide-react";

export function OfficeMap() {
    const [isMeeting, setIsMeeting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const mapRef = useRef<HTMLDivElement>(null);

    // Center map on load
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

    // Ajuste de posições de acordo com a perspectiva do render gerado
    const agents = [
        { id: "1", name: "Alpha", role: "Tech Lead", avatar: "/assets/hq/agents/techlead.png", position: { top: 560, left: 420 }, meetingPosition: { top: 320, left: 630 } },
        { id: "2", name: "Beta", role: "Growth", avatar: "/assets/hq/agents/growth.png", position: { top: 560, left: 780 }, meetingPosition: { top: 320, left: 720 } },
        { id: "3", name: "Gamma", role: "Concierge", avatar: "/assets/hq/agents/concierge.png", position: { top: 760, left: 420 }, meetingPosition: { top: 400, left: 630 } },
        { id: "4", name: "Delta", role: "SEO", avatar: "/assets/hq/agents/seo.png", position: { top: 760, left: 780 }, meetingPosition: { top: 400, left: 720 } }
    ];

    return (
        <div 
            ref={mapRef}
            className="w-full h-full overflow-auto hide-scrollbar cursor-grab active:cursor-grabbing bg-stone-900"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        >
           {/* The Image fills this 1200x1200 container, which allows panning */}
           <div className="relative w-[1200px] h-[1200px] bg-stone-100 mx-auto overflow-hidden shadow-2xl">
              
              <Image 
                src="/assets/hq/map.png"
                alt="Hooke Elite Virtual HQ"
                fill
                className="object-cover pointer-events-none select-none opacity-95"
                priority
              />

              {/* Botão de reunião no novo mapa */}
              <button 
                 onClick={(e) => { e.stopPropagation(); setIsMeeting(!isMeeting); }}
                 className="absolute top-20 right-20 text-[10px] bg-white/90 backdrop-blur text-stone-700 px-4 py-2 border border-stone-200/50 shadow-lg hover:shadow-xl rounded-none uppercase tracking-widest font-bold hover:bg-stone-50 transition-all z-30 flex items-center gap-2 pointer-events-auto"
              >
                 <span className={`w-2 h-2 rounded-full \${isMeeting ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                 {isMeeting ? "Encerrar Reunião" : "Convocar Reunião"}
              </button>

              {/* Caixinha de Ideias Minimalista no mapa texturizado */}
              <div 
                 onClick={() => setIsModalOpen(true)}
                 className="absolute bottom-20 right-20 w-[70px] h-[70px] bg-stone-900 border-[3px] border-stone-800 backdrop-blur text-white rounded-full shadow-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-all group z-30 pointer-events-auto"
              >
                 <Inbox size={24} className="text-stone-300 group-hover:text-amber-400 transition-colors" />
                 
                 {/* Tooltip */}
                 <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-stone-900 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-xl whitespace-nowrap tracking-widest transition-all duration-300 pointer-events-none">
                    DEIXAR FEEDBACK
                 </div>
              </div>

              {/* Renderização dos Avatares Premium */}
              {agents.map(agent => (
                 <AgentCharacter key={agent.id} {...agent} isMeeting={isMeeting} />
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
