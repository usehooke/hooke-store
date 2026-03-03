'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
    title: string;
    text: string;
    url: string;
    className?: string;
}

export default function ShareButton({ title, text, url, className }: ShareButtonProps) {
    const handleShare = async () => {
        const shareData = {
            title,
            text,
            url,
        };

        try {
            if (navigator.share) {
                // Dispara o painel de compartilhamento nativo do iOS / Android / Win
                await navigator.share(shareData);
            } else {
                // Fallback para computadores antigos que não suportam a Web Share API
                await navigator.clipboard.writeText(`${title} - ${url}`);
                toast.success("Link copiado para compartilhar!");
            }
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                console.error("Erro ao compartilhar", err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-hooke-900 border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center rounded-none ${className}`}
            title="Compartilhar Produto"
        >
            <Share2 size={16} />
            <span>Compartilhar</span>
        </button>
    );
}
