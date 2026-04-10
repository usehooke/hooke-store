"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentProps {
  id: string;
  name: string;
  role: string;
  avatar: string;
  position: { top: number; left: number };
  thought?: string;
}

export function AgentCharacter({ name, role, avatar, position, thought }: AgentProps) {
  return (
    <motion.div 
      initial={false}
      animate={{ 
          top: position.top, 
          left: position.left,
      }}
      transition={{ 
          duration: 5, // Movimento Zen e suave
          ease: [0.4, 0, 0.2, 1] 
      }}
      className="absolute flex flex-col items-center group cursor-pointer z-20 pointer-events-auto"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
       {/* Speech Bubble / Thought */}
       <div className={cn(
          "absolute -top-16 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-stone-200/50 text-[10px] font-bold text-stone-700 whitespace-nowrap transition-all duration-500 pointer-events-none z-50",
          thought ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
       )}>
          {thought}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-t-[6px] border-t-white" />
       </div>

       {/* High Fidelity Token Avatar */}
       <div className="relative w-[75px] h-[75px] rounded-full overflow-hidden shadow-2xl border-[3px] border-white group-hover:scale-110 group-hover:border-stone-200 transition-all duration-300 bg-white">
          <Image 
             src={avatar}
             alt={name}
             fill
             className="object-cover scale-[1.3] origin-center" 
          />
       </div>

       {/* Label on hover - Elite Titles */}
       <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/90 backdrop-blur text-white text-[9px] px-3 py-1.5 rounded-none shadow-xl uppercase tracking-widest font-black whitespace-nowrap z-50">
          {name} <span className="opacity-50 mx-1 font-normal">•</span> {role}
       </div>

       {/* Pequena aura de atividade */}
       <div className="absolute -inset-1 bg-emerald-500/10 rounded-full blur-md animate-pulse -z-10" />
    </motion.div>
  );
}
