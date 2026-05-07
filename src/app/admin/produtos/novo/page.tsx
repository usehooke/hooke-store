"use client";

import React, { useRef } from 'react';
import { MagicDropzone } from '@/features/catalog/components/MagicDropzone';
import { ProductForm, ProductFormHandle } from '@/features/catalog/components/ProductForm';
import { ShieldCheck, Zap } from 'lucide-react';

export default function NewProductPage() {
  const formRef = useRef<ProductFormHandle>(null);

  const handleAnalysisComplete = (data: any) => {
    if (formRef.current) {
      formRef.current.setValuesFromAI(data);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* HEADER */}
      <header className="p-8 md:p-16 border-b-2 border-black flex flex-col md:flex-row justify-between items-end gap-8 bg-zinc-50">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-12 h-0.5 bg-black" />
            <p className="text-[10px] font-black tracking-[0.5em] uppercase text-black flex items-center gap-2">
              Arsenal Hooke • Cadastro Mágico
              <Zap size={10} className="text-black fill-black" />
            </p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase italic leading-none">
            Novo <br /> <span className="opacity-20 font-light not-italic">Equipamento</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-3 border border-black/10 bg-white">
          <ShieldCheck size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Protocolo Zod Ativo</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 md:p-16 space-y-20">
        {/* FASE 1: O OLHO (IA) */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-light opacity-10">01</span>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Captura de Dados (Vision AI)</h2>
          </div>
          <MagicDropzone onAnalysisComplete={handleAnalysisComplete} />
        </section>

        {/* FASE 2: O CÉREBRO (FORMULÁRIO) */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-light opacity-10">02</span>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Refinamento & Validação</h2>
          </div>
          <div className="bg-zinc-50/30 p-1 border border-black/5">
             <div className="bg-white p-8 md:p-12 border-2 border-black shadow-sharp">
                <ProductForm ref={formRef} />
             </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-8 md:px-16 flex justify-between items-center opacity-10">
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Hooke OS v15.0 // AI Orchestration</span>
      </footer>
    </div>
  );
}
