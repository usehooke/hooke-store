"use client";
import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Componente OfficeAmbience:
 * Gerencia o áudio ambiental do HQ com transições suaves (fade-in/out)
 * e persistência offline-first via localStorage.
 */
export function OfficeAmbience() {
    // Carregamento inicial persistente (Offline-First)
    const [isMuted, setIsMuted] = useState(true);
    
    // Sincronização segura com o estado do cliente
    useEffect(() => {
        const saved = localStorage.getItem("hooke-ambience-muted");
        if (saved !== null) {
            setIsMuted(saved === "true");
        }
    }, []);
    
    const audioRef = useRef<HTMLAudioElement>(null);

    // Persistindo preferência do usuário
    useEffect(() => {
        localStorage.setItem("hooke-ambience-muted", String(isMuted));
    }, [isMuted]);

    // Lógica Sênior de Fade-in / Fade-out
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!isMuted) {
            audio.volume = 0; 
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Fade-in suave até 25% (Zen volume)
                    let vol = 0;
                    const interval = setInterval(() => {
                        if (vol < 0.25) { 
                            vol += 0.01;
                            audio.volume = Math.min(vol, 0.25);
                        } else {
                            clearInterval(interval);
                        }
                    }, 50);
                }).catch(() => {
                    console.warn("Autoplay bloqueado pelo navegador.");
                    setIsMuted(true);
                });
            }
        } else {
            // Fade-out antes de pausar para evitar estalos
            let vol = audio.volume;
            const interval = setInterval(() => {
                if (vol > 0.02) {
                    vol -= 0.02;
                    audio.volume = Math.max(vol, 0);
                } else {
                    audio.pause();
                    clearInterval(interval);
                }
            }, 30);
        }
    }, [isMuted]);

    return (
        <div className="absolute bottom-24 right-20 z-40">
            <button 
                onClick={() => setIsMuted(!isMuted)}
                className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                    "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
                    "hover:scale-110 active:scale-95 group",
                    !isMuted ? "text-emerald-400 border-emerald-500/30" : "text-stone-400"
                )}
                aria-label={isMuted ? "Ativar som ambiente" : "Desativar som ambiente"}
            >
                {/* Indicador de Pulsação quando ativo */}
                {!isMuted && (
                    <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
                )}
                
                {isMuted ? (
                    <VolumeX size={18} strokeWidth={1.5} />
                ) : (
                    <Volume2 size={18} strokeWidth={1.5} />
                )}
                
                <span className="absolute right-16 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-stone-900/90 text-white text-[9px] px-3 py-1.5 rounded-lg pointer-events-none uppercase tracking-[0.2em] font-black border border-white/10 backdrop-blur-md">
                    {isMuted ? "Ativar Atmosfera" : "Silenciar QG"}
                </span>
            </button>

            {/* Áudio loopando local com low-gain preferencialmente */}
            <audio 
                ref={audioRef} 
                loop 
                src="/sounds/office-low-gain.mp3" 
            />
        </div>
    );
}
