"use client";

import { useState, useEffect } from "react";
import { X, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brandConfig } from "@/config/brandConfig";

export default function InstagramPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o visitante já visualizou ou dispensou o convite
    const hasSeen = localStorage.getItem("hooke-instagram-popup-seen");
    if (hasSeen === "true") return;

    // Apresenta após 8 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hooke-instagram-popup-seen", "true");
  };

  const handleFollow = () => {
    setIsVisible(false);
    localStorage.setItem("hooke-instagram-popup-seen", "true");
    window.open(brandConfig.social.instagram, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-sm bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] relative text-black"
          >
            {/* Fechar */}
            <button
              onClick={handleClose}
              aria-label="Fechar convite"
              className="absolute top-4 right-4 p-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              <X size={14} />
            </button>

            {/* Conteúdo */}
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <Instagram size={36} />
              </div>

              <span className="text-[9px] font-black tracking-[0.4em] uppercase text-zinc-400 mb-2">
                Hooke Social Club
              </span>
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-3">
                Faça Parte do Club
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed mb-6 max-w-xs">
                Siga a <strong className="text-black">{brandConfig.social.instagramHandle}</strong> no Instagram para acompanhar nossos bastidores, lançamentos e drops semanais exclusivos.
              </p>

              {/* Ações */}
              <div className="flex flex-col gap-2.5 w-full">
                <button
                  onClick={handleFollow}
                  className="w-full py-4 text-[10px] font-black tracking-[0.2em] bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-y-px transition-all uppercase"
                >
                  Seguir no Instagram
                </button>
                <button
                  onClick={handleClose}
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black mt-2 underline underline-offset-4"
                >
                  Talvez mais tarde
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
