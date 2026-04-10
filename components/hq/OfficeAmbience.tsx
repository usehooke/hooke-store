"use client";
import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function OfficeAmbience() {
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            if (!isMuted) {
                audioRef.current.play().catch(_e => {
                    // Silently handle audio block
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isMuted]);

    return (
        <div className="absolute bottom-24 right-20 z-40">
            <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all group"
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="animate-pulse" />}
                
                <span className="absolute right-12 whitespace-nowrap bg-black text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest font-black">
                    {isMuted ? "Ativar Atmosfera" : "Silenciar QG"}
                </span>
            </button>

            {/* Placeholder para som de escritório minimalista (White Noise / Ambient) */}
            <audio 
                ref={audioRef}
                loop
                src="https://www.soundjay.com/ambient/office-ambience-01.mp3" // Exemplo público, Diretor pode trocar depois
            />
        </div>
    );
}
