"use client";

import { motion } from "framer-motion";

export function WorldCupMarquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-black text-[#E1F522] py-1.5 border-b-2 border-black flex items-center z-50 relative pointer-events-none">
      <motion.div
        className="flex gap-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="font-jost text-[10px] tracking-widest uppercase font-bold flex items-center gap-10">
            <span>🇧🇷 RUMO AO HEXA</span>
            <span>•</span>
            <span>HOOKE NA COPA</span>
            <span>•</span>
            <span>APROVEITE AS CONDIÇÕES ESPECIAIS 🇧🇷</span>
            <span>•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
