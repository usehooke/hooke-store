// src/components/shop/ShareButton.tsx
"use client"; // Necessário para usar onClick e window

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  productName: string;
  productDescription: string;
}

export default function ShareButton({ productName, productDescription }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `Hooke | ${productName}`,
      text: productDescription,
      url: window.location.href, // Pega o link atual da página automaticamente
    };

    // 1. Tenta abrir o menu nativo do celular (iPhone/Android)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log("Compartilhamento cancelado pelo usuário");
      }
    } else {
      // 2. Se estiver no PC, copia o link (Fallback)
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Volta ao normal depois de 2s
      } catch (err) {
        console.error("Falha ao copiar", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-hooke-600 bg-hooke-50 hover:bg-hooke-100 hover:text-hooke-900 transition-all rounded-sm border border-hooke-200 w-full md:w-auto"
      aria-label="Compartilhar produto"
    >
      {copied ? (
        <>
          <Check size={18} className="text-green-600" />
          <span className="text-green-600 font-bold">Link Copiado!</span>
        </>
      ) : (
        <>
          <Share2 size={18} />
          <span>Compartilhar</span>
        </>
      )}
    </button>
  );
}