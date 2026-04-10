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
             initial={{ opacity: 0, scale: 0.5, y: 20, x: "-50%" }}
             animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
             exit={{ opacity: 0, scale: 0.5, y: 10, x: "-50%" }}
             className="absolute -top-16 left-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-stone-200/50 text-[11px] font-bold text-stone-800 whitespace-nowrap z-50"
           >
              {thought}
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-stone-200 rotate-45" 
              />
           </motion.div>
         )}
       </AnimatePresence>

       {/* Thematic Avatar Container - Neumorfismo Suave & Gloss */}
       <motion.div 
         whileHover={{ scale: 1.05, y: -5 }}
         className={cn(
           "relative w-[85px] h-[85px] rounded-[2.2rem] overflow-hidden transition-all duration-500 group",
           "bg-stone-100 shadow-[10px_10px_30px_#00000040,-5px_-5px_30px_#ffffff10]", // Dark Neumorphism adaptado
           "border-[1px] border-white/20 backdrop-blur-sm shadow-2xl"
         )}
       >
          {/* Camada de brilho gloss premium */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-20 pointer-events-none" />
          
          {/* Badge de Status em tempo real */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
             <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", statusColors[status])}>
                <div className={cn("w-full h-full rounded-full animate-ping opacity-40", statusColors[status])} />
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
               priority={false}
               className="object-cover scale-[1.1] grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-125 transition-all duration-700" 
               onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900 text-stone-400 font-black text-xl tracking-tighter">
              {initials}
            </div>
          )}
       </motion.div>

       {/* Premium Elite Label */}
       <div className="absolute -bottom-12 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex flex-col items-center">
          <div className="bg-stone-900 text-white text-[8px] px-3 py-1 rounded-full shadow-2xl uppercase tracking-[0.2em] font-black whitespace-nowrap border border-white/10">
             {name}
          </div>
          <div className="text-[7px] text-stone-400 font-bold uppercase tracking-widest mt-1">
             {role.split('/')[0].trim()}
          </div>
       </div>

       {/* Subtle status aura */}
       <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
    </motion.div>
  );
});
