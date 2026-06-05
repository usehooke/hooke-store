"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DynamicSizeGuideProps {
  show: boolean;
  onClose: () => void;
  selectedSize: string | null;
  sizeGuideData: Record<string, { peito: string; comprimento: string; ombro: string }>;
}

export default function DynamicSizeGuide({ show, onClose, selectedSize, sizeGuideData }: DynamicSizeGuideProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 w-full max-w-lg mx-auto bg-white p-6 shadow-2xl rounded-t-2xl md:relative md:max-w-sm md:rounded-none md:bottom-auto md:left-auto md:right-auto md:mt-10"
          >
            {/* Puxador para fechar (Mobile Bottom Sheet) */}
            <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6 md:hidden"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black md:hidden"
              aria-label="Fechar Guia"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-heading text-lg font-black tracking-widest uppercase mb-6">Guia de Medidas</h3>
            
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left font-black uppercase pb-3">Tam</th>
                  <th className="font-black uppercase pb-3">Peito</th>
                  <th className="font-black uppercase pb-3">Comp.</th>
                  <th className="font-black uppercase pb-3">Ombro</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(sizeGuideData).map(([sz, m]) => (
                  <tr key={sz} className={`border-b border-zinc-100 ${selectedSize === sz ? 'bg-zinc-50' : ''}`}>
                    <td className="font-black py-4">{sz}</td>
                    <td className="text-center py-4 text-zinc-600">{m.peito}</td>
                    <td className="text-center py-4 text-zinc-600">{m.comprimento}</td>
                    <td className="text-center py-4 text-zinc-600">{m.ombro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-zinc-400 mt-6 text-center italic">
              As medidas podem variar em até 2cm devido ao processo de lavagem e encolhimento natural do algodão.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
