"use client";

import { MessageCircle } from "lucide-react";
import { brandConfig } from "@/config/brandConfig";
import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Efeito de entrada suave após montar
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500); // Aparece após 1.5s
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateUrl = () => {
      const defaultNumber = "5511975902528";
      let baseText = "Olá! Estou navegando no site da Hooke e tenho uma dúvida.";
      
      if (typeof window !== 'undefined') {
        const currentProduct = (window as any).__currentProduct;
        if (currentProduct) {
          baseText = `Olá! Estou na página do produto "${currentProduct}" no site da Hooke e gostaria de tirar uma dúvida.`;
        }
      }
      
      setWhatsappUrl(`https://wa.me/${defaultNumber}?text=${encodeURIComponent(baseText)}`);
    };

    updateUrl();

    // Ouvir mudanças de produto nas páginas de produto
    window.addEventListener('hooke-product-changed', updateUrl);
    return () => {
      window.removeEventListener('hooke-product-changed', updateUrl);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-24 md:bottom-6 right-6 z-40 group flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-hooke-900 focus-visible:ring-offset-2"
    >
      {/* Tooltip que aparece no hover ou foco */}
      <span className="absolute right-16 bg-white text-hooke-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-none shadow-sharp border border-black opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Suporte Humano 24h
      </span>

      <div className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:bg-[#20bd5a] hover:scale-105 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-none transition-all duration-300">
        <MessageCircle size={28} fill="white" className="relative z-10" />
        
        {/* Bolinha de notificação pulsante */}
        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black z-20">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
        </span>
      </div>
    </a>
  );
}
