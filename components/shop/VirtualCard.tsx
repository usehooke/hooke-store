"use client";

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { brandConfig } from '@/config/brandConfig';
import { Instagram, MessageCircle, Globe, MapPin, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VirtualCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  const qrUrl = `${brandConfig.shop.baseUrl}/contato?utm_source=cartao_virtual&utm_medium=physical`;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto p-4 perspect-1000">
      {/* Container do Cartão com Animação de Giro */}
      <div 
        className={cn(
          "relative w-full aspect-[1/1.58] transition-all duration-700 select-none preserve-3d cursor-pointer shadow-2xl rounded-2xl overflow-hidden",
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={() => setIsFlipped(!isFlipped)}
        id="hooke-card-capture"
      >
        {/* FRENTE DO CARTÃO */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-black text-white p-8 flex flex-col justify-between overflow-hidden">
          {/* Ruído de fundo sutil */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          {/* Logo Hooke */}
          <div className="relative z-10 text-center pt-4">
            <h2 className="font-sans text-3xl font-medium tracking-[0.25em] ml-[0.25em] uppercase leading-none">
              HOOKE
            </h2>
          </div>

          {/* QR Code */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <QRCodeSVG 
                value={qrUrl} 
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Membro VIP
            </p>
          </div>

          {/* Informações da Loja */}
          <div className="relative z-10 space-y-4 pb-4">
            <div className="space-y-2">
              {brandConfig.contact.addresses.map((addr, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <MapPin size={12} className="mt-0.5 text-gray-500 shrink-0" />
                  <p className="text-[9px] leading-tight text-gray-300">
                    <span className="font-bold text-white uppercase">{addr.name}:</span> {addr.street}, {addr.neighborhood}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-px bg-white/10 w-full" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MessageCircle size={12} className="text-gray-500" />
                <p className="text-[9px] text-gray-300 font-medium">(11) 97590-2528</p>
              </div>
              <div className="flex items-center gap-2">
                <Instagram size={12} className="text-gray-500" />
                <p className="text-[9px] text-gray-300 font-medium">@use.hooke</p>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Globe size={12} className="text-gray-500" />
                <p className="text-[9px] text-gray-300 font-medium">www.usehooke.com.br</p>
              </div>
            </div>
          </div>
        </div>

        {/* VERSO DO CARTÃO */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white text-black p-8 flex flex-col justify-between border border-gray-100">
          {/* Grid de Pontos Sutil */}
          <div className="absolute inset-x-8 inset-y-24 pointer-events-none opacity-[0.2]" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
                 backgroundSize: '20px 20px' 
               }}>
          </div>

          {/* Cabeçalho do Verso */}
          <div className="relative z-10 flex justify-between items-center border-b border-black/5 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Notas / Pedidos</span>
            <span className="text-[10px] font-bold text-black/20 italic">Hooke Premium</span>
          </div>

          {/* Espaço em Branco (Post-it Style) */}
          <div className="flex-grow my-4 flex items-center justify-center opacity-[0.03] select-none">
             <h2 className="text-7xl font-medium uppercase tracking-[0.25em] ml-[0.25em] rotate-[-15deg]">HOOKE</h2>
          </div>

          {/* Rodapé do Verso */}
          <div className="relative z-10 pt-4 border-t border-black/5 flex flex-col items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-hooke-900 border border-black/10 px-4 py-1.5 rounded-full">
               Anotações
            </p>
            <p className="text-[8px] font-medium text-black/40 uppercase tracking-widest mt-2">
              {brandConfig.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Botão para Virar (Apenas explicativo) */}
      <button 
        onClick={() => setIsFlipped(!isFlipped)}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
      >
        <RefreshCcw size={14} />
        {isFlipped ? "Ver Frente" : "Ver Verso"}
      </button>

      {/* CSS Necessário para o Flip 3D */}
      <style jsx global>{`
        .perspect-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
