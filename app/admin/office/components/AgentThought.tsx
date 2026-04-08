"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface AgentThoughtProps {
  thoughts: string[];
  isActive: boolean;
}

export function AgentThought({ thoughts, isActive }: AgentThoughtProps) {
  const [currentThought, setCurrentThought] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const showRandomThought = () => {
      const randomDelay = Math.random() * 10000 + 5000; // 5-15 segundos
      
      setTimeout(() => {
        const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
        setCurrentThought(thought);
        
        // Esconde após 4 segundos
        setTimeout(() => {
          setCurrentThought(null);
          showRandomThought(); // Agenda a próxima
        }, 4000);
      }, randomDelay);
    };

    showRandomThought();
  }, [isActive, thoughts]);

  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 z-50 pointer-events-none">
      <AnimatePresence>
        {currentThought && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white border-2 border-hooke-900 p-3 shadow-xl relative"
          >
            <p className="text-[10px] font-black tracking-tight leading-tight text-hooke-900 uppercase">
              {currentThought}
            </p>
            {/* Balloon Tail */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-hooke-900 rotate-45 -mt-1.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
