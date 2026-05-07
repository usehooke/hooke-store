"use client";
import React, { useState, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentProps {
  id: string;
  name: string;
  role: string;
  avatar: string;
  position: { top: number; left: number };
  thought?: string;
  status?: "online" | "busy" | "away";
}

// Empregando React.memo para evitar re-renders desnecessários em escala massiva
export const AgentCharacter = memo(function AgentCharacter({ 
  name, 
  role, 
  avatar, 
  position, 
  thought, 
  status = "online" 
}: AgentProps) {
  const [imgError, setImgError] = useState(false);

  // Iniciais para fallback premium
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusColors = {
    online: "bg-emerald-500",
    busy: "bg-amber-500",
    away: "bg-stone-500",
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
          top: position.top, 
          left: position.left,
      }}
      transition={{ 
          duration: 8, // Movimento Zen sincronizado
          ease: [0.4, 0, 0.2, 1] 
      }}
      className="absolute flex flex-col items-center group cursor-default z-20 pointer-events-auto"
      style={{ transform: 'translate(-50%, -50%)' }}
      role="img"
      aria-label={`Agente ${name} - ${role}`}
    >
       {/* Thought Bubble com Layout Prop para transições suaves */}
       <AnimatePresence mode="wait">
         {thought && (
           <motion.div
             layout
             initial={{ opacity: 0, y: 10, x: "-50%" }}
             animate={{ opacity: 1, y: 0, x: "-50%" }}
             exit={{ opacity: 0, y: 5, x: "-50%" }}
             className="absolute -top-16 left-1/2 bg-white border border-black px-5 py-3 shadow-sharp text-[10px] font-black text-black uppercase tracking-widest whitespace-nowrap z-50"
           >
              {thought}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-black rotate-45" />
           </motion.div>
         )}
       </AnimatePresence>

       {/* Thematic Avatar Container - Sharp Brutalism */}
       <motion.div 
         whileHover={{ scale: 1.05 }}
         className={cn(
           "relative w-[85px] h-[85px] overflow-hidden transition-all duration-500 group",
           "bg-zinc-900 shadow-sharp", 
           "border border-white/20"
         )}
       >
          {/* Camada de brilho gloss premium */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-20 pointer-events-none" />
          
          {/* Badge de Status em tempo real */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
             <div className={cn("w-2 h-2 rounded-none shadow-[0_0_8px_rgba(0,0,0,0.5)]", statusColors[status])}>
                <div className={cn("w-full h-full rounded-none animate-ping opacity-40", statusColors[status])} />
             </div>
          </div>

          {/* VIP Badge sutil */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 opacity-40 group-hover:opacity-100 transition-opacity">
             <span className="text-[6px] font-black tracking-[0.3em] text-white/50 uppercase">Elite</span>
          </div>

          {!imgError ? (
            <Image 
               src={avatar}
               alt={name}
               fill
               sizes="85px"
               className="object-cover scale-[1.1] grayscale hover:grayscale-0 transition-all duration-1000" 
               onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-black text-xl tracking-tighter italic">
              {initials}
            </div>
          )}
       </motion.div>

       {/* Premium Elite Label */}
       <div className="absolute -bottom-14 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 flex flex-col items-center">
          <div className="bg-black text-white text-[9px] px-4 py-2 shadow-sharp uppercase tracking-[0.3em] font-black whitespace-nowrap border border-white/10">
             {name}
          </div>
          <div className="text-[7px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-2">
             {role.split('/')[0].trim()}
          </div>
       </div>
    </motion.div>
  );
});
