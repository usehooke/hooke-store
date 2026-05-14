"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Camera } from 'lucide-react';
import { planCampaign, CampaignPlan } from '../actions/campaignDirector';
import { generateAndAuditMagicImage } from '@/app/admin/actions/studioOrchestrator';
import { toast } from 'sonner';

type SceneStatus = 'pending' | 'rendering' | 'auditing' | 'recalibrating' | 'approved' | 'failed';

interface SceneState {
  id: string;
  angle: string;
  prompt: string;
  status: SceneStatus;
  retryCount: number;
  imageUrl?: string;
  score?: number;
  reasoning?: string;
}

export function CampaignMonitor() {
  const [theme, setTheme] = useState("");
  const [status, setStatus] = useState<'idle' | 'planning' | 'monitoring'>('idle');
  const [campaignTitle, setCampaignTitle] = useState("");
  const [scenes, setScenes] = useState<SceneState[]>([]);

  const startCampaign = async () => {
    if (!theme) return toast.error("Defina o tema do ensaio.");
    
    setStatus('planning');
    try {
      const result = await planCampaign(theme);
      if (result.success && result.plan) {
        setCampaignTitle(result.plan.campaignTitle);
        const initialScenes: SceneState[] = result.plan.scenes.map((s: any) => ({
          id: s.id,
          angle: s.angleName,
          prompt: s.scenePrompt,
          status: 'pending',
          retryCount: 0
        }));
        setScenes(initialScenes);
        setStatus('monitoring');
        
        // Inicia a geração em lote
        executeBatch(initialScenes);
      } else {
        toast.error(result.error || "Falha ao planejar campanha.");
        setStatus('idle');
      }
    } catch (error: any) {
      toast.error(error.message || "Erro no Diretor de Campanha.");
      setStatus('idle');
    }
  };

  const executeBatch = (initialScenes: SceneState[]) => {
    initialScenes.forEach(scene => {
      processScene(scene.id, scene.prompt);
    });
  };

  const processScene = async (id: string, prompt: string) => {
    updateScene(id, { status: 'rendering' });

    try {
      // Nota: O orchestrator interno já faz até 3 retries.
      // Aqui simulamos a visibilidade desses estados se tivéssemos streaming,
      // mas como é uma action única, vamos mostrar 'auditing' após a renderização fake.
      
      const result = await generateAndAuditMagicImage(prompt);
      
      if (result.success) {
        updateScene(id, { 
          status: 'approved', 
          imageUrl: result.image, 
          score: result.evaluation?.score 
        });
      } else {
        updateScene(id, { 
          status: 'failed', 
          reasoning: result.error 
        });
      }
    } catch (error) {
      updateScene(id, { status: 'failed' });
    }
  };

  const updateScene = (id: string, patch: Partial<SceneState>) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const allApproved = scenes.length > 0 && scenes.every(s => s.status === 'approved');

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans pb-40">
      <div className="max-w-6xl mx-auto px-8 pt-20">
        
        {/* Header Minimalista */}
        <header className="mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-[2px] bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Monitor de Campanha V15.0</span>
          </motion.div>
          <h1 className="text-6xl font-black uppercase tracking-tighter italic">
            {campaignTitle || "Novo Ensaio Elite"}
          </h1>
        </header>

        {status === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl space-y-8"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tema do Ensaio</label>
              <input 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: Essencialismo Urbano Inverno"
                className="w-full bg-transparent border-b-2 border-black py-4 text-2xl font-bold focus:outline-none placeholder:opacity-20"
              />
            </div>
            <button 
              onClick={startCampaign}
              className="group flex items-center gap-4 bg-black text-white px-8 py-6 font-black uppercase tracking-widest hover:bg-zinc-900 transition-all active:scale-95 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)]"
            >
              Iniciar Orquestração <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}

        {status === 'planning' && (
          <div className="h-[400px] flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-zinc-200" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Diretor de Arte Decupando Tema...</p>
          </div>
        )}

        {status === 'monitoring' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence>
              {scenes.map((scene, idx) => (
                <motion.div 
                  key={scene.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Moldura Sharp Edges */}
                  <div className="aspect-[3/4] bg-zinc-100 border border-zinc-200 overflow-hidden relative">
                    {scene.status === 'approved' ? (
                      <motion.img 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={scene.imageUrl} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                        <motion.div 
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-full h-full bg-zinc-100"
                        />
                        <Camera className="absolute text-zinc-200" size={48} strokeWidth={1} />
                      </div>
                    )}

                    {/* Tags VIP de Telemetria */}
                    <div className="absolute top-0 right-0">
                      <StatusTag status={scene.status} retryCount={scene.retryCount} />
                    </div>

                    {/* Overlay de Carga */}
                    {(scene.status === 'rendering' || scene.status === 'auditing') && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                        <Loader2 className="animate-spin" size={32} />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Ângulo {idx + 1}</p>
                      <h3 className="text-xs font-black uppercase tracking-tight">{scene.angle}</h3>
                    </div>
                    {scene.score && (
                      <span className="text-[10px] font-black italic">ELITE {scene.score}/10</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FAB: Publicar Ensaio */}
      <AnimatePresence>
        {status === 'monitoring' && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50"
          >
            <button 
              disabled={!allApproved}
              className={`flex items-center gap-4 px-12 py-8 font-black uppercase tracking-[0.3em] shadow-[20px_20px_0px_0px_rgba(0,0,0,0.15)] transition-all ${
                allApproved 
                ? 'bg-black text-white active:scale-95 hover:shadow-[15px_15px_0px_0px_rgba(0,0,0,0.2)]' 
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {allApproved ? <CheckCircle2 /> : <Loader2 className="animate-spin" />}
              Publicar Ensaio
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusTag({ status, retryCount }: { status: SceneStatus, retryCount: number }) {
  const configs: Record<SceneStatus, { label: string, color: string, pulse?: boolean }> = {
    pending: { label: 'AGUARDANDO', color: 'bg-zinc-100 text-zinc-400' },
    rendering: { label: 'RENDERIZANDO CENA', color: 'bg-zinc-200 text-zinc-500', pulse: true },
    auditing: { label: 'AUDITORIA EM CURSO', color: 'bg-black text-white' },
    recalibrating: { label: `RECALIBRANDO ${retryCount}/3`, color: 'bg-amber-500 text-white', pulse: true },
    approved: { label: 'APROVADO: 10/10', color: 'bg-emerald-950 text-emerald-400' },
    failed: { label: 'FALHA TÉCNICA', color: 'bg-red-600 text-white' }
  };

  const config = configs[status];

  return (
    <motion.div 
      animate={config.pulse ? { opacity: [1, 0.5, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`px-3 py-2 text-[8px] font-black uppercase tracking-widest ${config.color}`}
    >
      [ {config.label} ]
    </motion.div>
  );
}
