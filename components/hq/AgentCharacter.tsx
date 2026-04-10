"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
          duration: 8, // Zen movement
          ease: [0.4, 0, 0.2, 1] 
      }}
      className="absolute flex flex-col items-center group cursor-default z-20 pointer-events-auto"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
       {/* New Dynamic Thought Bubble */}
       <AnimatePresence>
         {thought && (
           <motion.div
             initial={{ opacity: 0, scale: 0.5, y: 20, x: "-50%" }}
             animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
             exit={{ opacity: 0, scale: 0.5, y: 10, x: "-50%" }}
             className="absolute -top-16 left-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-stone-200/50 text-[11px] font-bold text-stone-800 whitespace-nowrap z-50"
           >
              {thought}
              {/* Animated indicator for "thinking" - Slowed down for Zen experience */}
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-stone-200 rotate-45" 
              />
           </motion.div>
         )}
       </AnimatePresence>

       {/* Thematic Avatar Container */}
       <motion.div 
         whileHover={{ scale: 1.05, y: -5 }}
         className="relative w-[85px] h-[85px] rounded-[2rem] overflow-hidden shadow-2xl border-[3px] border-white/50 group-hover:border-white transition-all duration-500 bg-stone-800"
       >
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/50 to-transparent z-10" />
          <Image 
             src={avatar}
             alt={name}
             fill
             className="object-cover scale-[1.1] origin-center group-hover:scale-125 transition-transform duration-700" 
          />
       </motion.div>

       {/* Premium Elite Label */}
       <div className="absolute -bottom-12 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex flex-col items-center">
          <div className="bg-stone-900 text-white text-[8px] px-3 py-1 rounded-full shadow-2xl uppercase tracking-[0.2em] font-black whitespace-nowrap">
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
}
