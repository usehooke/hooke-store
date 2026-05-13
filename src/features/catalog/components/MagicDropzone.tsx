"use client";

import React, { useState, useCallback } from 'react';
import { Upload, Sparkles, Loader2 } from "lucide-react";
import { analyzeProductImage, AIProductAnalysis } from '@/lib/ai/visionService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";

interface MagicDropzoneProps {
  onAnalysisComplete: (data: AIProductAnalysis) => void;
}

export function MagicDropzone({ onAnalysisComplete }: MagicDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, envie apenas imagens.");
      return;
    }

    try {
      setIsAnalyzing(true);
      // Feedback visual instantâneo (ObjectURL é imediato)
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      toast.loading("Analisando equipamento via Hook Vision...", { id: "vision-loading" });
      console.log("[MagicDropzone] Iniciando conversão e análise...");
      
      const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };
      
      const base64Image = await getBase64(file);
      const result = await analyzeProductImage(base64Image);
      
      toast.dismiss("vision-loading");
      
      if (result.success) {
        onAnalysisComplete(result.data);
        toast.success("Análise concluída com sucesso!");
      } else {
        toast.error(result.error || "A IA não conseguiu decifrar este equipamento.");
        setPreview(null);
      }
    } catch (error) {
      console.error("[MagicDropzone] Erro no processamento:", error);
      toast.dismiss("vision-loading");
      toast.error("Falha crítica no sistema de visão.");
      setPreview(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  return (
    <div className="relative">
      <input
        id="magic-upload"
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative w-full aspect-video md:aspect-[21/9] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden bg-zinc-50 cursor-pointer ${
          isDragging ? 'border-black bg-zinc-100 scale-[1.01]' : 'border-black/10'
        }`}
      >
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
            >
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-black" />
                <motion.div 
                  animate={{ y: [-20, 20, -20] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-0.5 bg-black/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Analizando Arquitetura Têxtil...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {preview ? (
          <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover grayscale opacity-20" />
        ) : (
          <Upload className={`w-8 h-8 transition-transform duration-500 ${isDragging ? 'scale-125' : ''}`} />
        )}

        <div className="relative z-0 text-center space-y-2">
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Drop do Produto</h3>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Arraste a foto ou clique para selecionar</p>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-30">
          <Sparkles size={12} />
          <span className="text-[8px] font-black uppercase tracking-[0.3em]">AI Magic Onboarding</span>
        </div>
      </div>
    </div>
  );
}

