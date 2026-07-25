"use client";

import { motion } from "framer-motion";

export function AnnouncementMarquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-black text-white py-2 border-b border-zinc-800 flex items-center z-50 relative pointer-events-none">
      <motion.div
        className="flex gap-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 25,
          ease: "linear",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="font-heading text-[10px] tracking-[0.25em] uppercase font-bold flex items-center gap-10 text-zinc-300">
            <span>NOVA COLEÇÃO ESSENTIALS DISPONÍVEL</span>
            <span className="text-zinc-600">•</span>
            <span>ENGENHARIA TÊXTIL & ALTA COSTURA</span>
            <span className="text-zinc-600">•</span>
            <span>FRETE GRÁTIS EM COMPRAS SELECIONADAS</span>
            <span className="text-zinc-600">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export { AnnouncementMarquee as WorldCupMarquee };
