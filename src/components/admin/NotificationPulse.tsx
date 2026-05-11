"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionDiv } from './MotionComponents';

/**
 * HOOKE HQ: NOTIFICATION PULSE (SUCCESS GLOW)
 * Cria um brilho radial nas bordas da tela para sinalizar faturamento.
 */
export function NotificationPulse() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleSuccess = () => {
      setActive(true);
      setTimeout(() => setActive(false), 3000);
    };

    window.addEventListener('hooke-sale-success', handleSuccess);
    return () => window.removeEventListener('hooke-sale-success', handleSuccess);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] pointer-events-none"
        >
          {/* Brilho Esmeralda/Dourado nas bordas */}
          <div className="absolute inset-0 border-[12px] border-emerald-500/20 shadow-[inset_0_0_100px_rgba(16,185,129,0.2)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(16,185,129,0.05)_100%)]" />
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
