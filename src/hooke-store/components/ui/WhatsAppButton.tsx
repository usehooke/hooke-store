"use client";

import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/data/catalogo";
import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Efeito de entrada suave após montar
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500); // Aparece após 1.5s
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp_number}?text=${encodeURIComponent(SITE_CONFIG.whatsapp_message)}`;

  if (!isVisible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      {/* Tooltip que aparece no hover */}
      <span className="absolute right-16 bg-white text-hooke-900 text-xs font-bold px-3 py-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Fale Conosco
      </span>

      <div className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 hover:-translate-y-1 transition-all duration-300">
        <MessageCircle size={28} fill="white" className="relative z-10" />
        
        {/* Bolinha de notificação pulsante */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white z-20">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
        </span>
      </div>
    </a>
  );
}