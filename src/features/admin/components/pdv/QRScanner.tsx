"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X, Scan } from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Inicializa o scanner quando o componente é montado
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Sucesso na leitura
        triggerHaptic("success");
        onScanSuccess(decodedText);
        scanner.clear();
      },
      (errorMessage) => {
        // Ignora erros contínuos de "não encontrado" (comum enquanto a câmera procura)
        if (!errorMessage.includes("NotFound")) {
          console.warn(errorMessage);
        }
      }
    );

    return () => {
      // Limpa ao desmontar
      scanner.clear().catch(console.error);
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[120] bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 border-2 border-black flex flex-col gap-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-zinc-500"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <Scan size={32} className="mx-auto mb-2 text-black" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-black">Scanner Ativado</h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase mt-1">Aponte para o QR Code da Etiqueta</p>
        </div>

        <div id="qr-reader" className="w-full bg-black aspect-square overflow-hidden border-2 border-black"></div>

        {error && <p className="text-xs text-red-500 font-bold text-center uppercase">{error}</p>}
      </div>
    </div>
  );
}
