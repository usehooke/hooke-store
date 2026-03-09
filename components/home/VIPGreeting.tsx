'use client';

import { useVIPStatus } from '@/hooks/useVIPStatus';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { brandConfig } from '@/config/brandConfig';

export default function VIPGreeting() {
  const { isRecurring, isVIP } = useVIPStatus();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Só mostra se for recorrente e não tiver fechado nesta sessão
    if (isRecurring) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isRecurring]);

  if (!isRecurring) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-hooke-900 text-white py-3 px-6 relative z-50 flex items-center justify-center gap-4 text-center"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
              {isVIP 
                ? `Bem-vindo de volta, MEMBRO VIP ${brandConfig.name}` 
                : "Bom te ver de novo! Use o cupom VOLTEI5 para 5% OFF"}
            </span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
