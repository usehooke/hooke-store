"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DynamicSizeGuideProps {
  show: boolean;
  onClose: () => void;
  selectedSize: string | null;
  sizeGuideData: Record<string, { peito: string; comprimento: string; ombro: string }>;
  grammage?: string;
  model?: string;
}

export default function DynamicSizeGuide({ show, onClose, selectedSize, sizeGuideData, grammage, model }: DynamicSizeGuideProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [show, onClose]);

  // Detecção da gramatura para o Silhouette Guide
  let silhouetteTitle = "";
  let silhouetteDesc = "";
  if (grammage) {
    const match = grammage.match(/\d+/);
    const weightNum = match ? parseInt(match[0], 10) : 0;
    if (weightNum > 0) {
      if (weightNum >= 240) {
        silhouetteTitle = "Estruturado e Boxy (Silhueta Firme)";
        silhouetteDesc = "A malha pesada (heavyweight) garante que a peça mantenha sua forma estruturada, com ombros bem definidos e caimento reto que não marca o corpo.";
      } else if (weightNum <= 210) {
        silhouetteTitle = "Caimento Leve e Fluido (Ajuste Macio)";
        silhouetteDesc = "Desenvolvido com malha de gramatura leve, proporcionando alta flexibilidade, toque suave e um caimento fluido que se adapta naturalmente aos movimentos do corpo.";
      } else {
        silhouetteTitle = "Caimento Regular / Balanceado";
        silhouetteDesc = "Equilíbrio perfeito entre estrutura e leveza. Oferece caimento confortável que acompanha a linha dos ombros, ideal para conforto térmico e versatilidade diária.";
      }
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
        >
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
              className="absolute top-4 right-4 text-zinc-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              aria-label="Fechar Guia"
            >
              <X size={20} aria-hidden="true" />
            </button>
            
            <h3 id="size-guide-title" className="font-heading text-lg font-black tracking-widest uppercase mb-6">Guia de Medidas</h3>
            
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

            {/* Silhouette Guide (Caimento) */}
            {silhouetteTitle && (
              <div className="mt-6 border-2 border-black p-3 bg-zinc-50 font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[8px] font-black uppercase tracking-wider text-zinc-400 block mb-1">Silhouette Guide (Caimento)</span>
                <p className="text-[10px] font-black uppercase text-black mb-1">{silhouetteTitle}</p>
                <p className="text-[9px] text-zinc-600 leading-relaxed font-medium">{silhouetteDesc}</p>
              </div>
            )}

            <p className="text-[10px] text-zinc-400 mt-6 text-center italic">
              As medidas podem variar em até 2cm devido ao processo de lavagem e encolhimento natural do algodão.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
