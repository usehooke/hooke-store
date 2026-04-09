"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AgentProps {
  id: string;
  name: string;
  role: string;
  avatar: string;
  position: { top: number; left: number };
  isMeeting: boolean;
  meetingPosition: { top: number; left: number };
}

// Simple random phrases
const phrases = {
  "Tech Lead": ["Deploys estáveis 🔥", "Escalando servidores", "Otimizando imagens do admin"],
  "Growth": ["Acompanhando KPIs no painel", "LTV subindo muito hoje", "Analisando checkout"],
  "Concierge": ["Preparando pedido premium ☕", "Despachando para entrega VIP", "Escrevendo carta à mão"],
  "SEO": ["Análise de tráfego orgânico", "Hooke na Primeira página!", "Ajustando metadados"]
};

export function AgentCharacter({ name, role, avatar, position, isMeeting, meetingPosition }: AgentProps) {
  const [bubbleText, setBubbleText] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
       if (isMeeting) {
           if(Math.random() > 0.7) {
               setBubbleText("Alinhando métricas de marca...");
               setTimeout(() => setBubbleText(""), 4000);
           }
           return;
       }

       if (Math.random() > 0.6) {
          const rolePhrases = phrases[role as keyof typeof phrases] || ["Focando..."];
           setBubbleText(rolePhrases[Math.floor(Math.random() * rolePhrases.length)]);
           setTimeout(() => setBubbleText(""), 3500);
       }
    }, 6000);
    return () => clearInterval(interval);
  }, [role, isMeeting]);

  const currentPos = isMeeting ? meetingPosition : position;

  return (
    <div 
      className="absolute flex flex-col items-center group cursor-pointer z-20 pointer-events-auto"
      style={{ 
          top: currentPos.top, 
          left: currentPos.left, 
          transform: 'translate(-50%, -50%)',
          transition: 'all 2000ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
       {/* Speech Bubble */}
       <div className={cn(
          "absolute -top-14 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-stone-200/50 text-[10px] font-bold text-stone-700 whitespace-nowrap transition-all duration-300 pointer-events-none z-50",
          bubbleText ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
       )}>
          {bubbleText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-t-[6px] border-t-white" />
       </div>

       {/* High Fidelity Token Avatar */}
       <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden shadow-2xl border-[3px] border-white group-hover:scale-110 group-hover:border-stone-200 transition-all duration-300 bg-white">
          <Image 
             src={avatar}
             alt={name}
             fill
             className="object-cover scale-[1.3] origin-center" // Zoom into the character
          />
       </div>

       {/* Label on hover - More sleek */}
       <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/90 backdrop-blur text-white text-[9px] px-3 py-1.5 rounded shadow-xl uppercase tracking-widest font-black whitespace-nowrap z-50">
          {name} <span className="opacity-50 mx-1 font-normal">•</span> {role}
       </div>
    </div>
  );
}
