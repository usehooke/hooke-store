'use client';

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface LPHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
}

export default function LPHero({ title, subtitle, ctaText }: LPHeroProps) {
  return (
    <div className="relative z-10 text-center px-4 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <Link 
          href="#ofertas" 
          className="bg-white text-hooke-900 px-10 py-6 text-sm font-bold uppercase tracking-[0.2em] hover:bg-hooke-900 hover:text-white transition-all inline-flex items-center gap-3 active:scale-95 shadow-2xl"
        >
          {ctaText} <ArrowRight size={20} />
        </Link>
      </motion.div>
    </div>
  );
}
