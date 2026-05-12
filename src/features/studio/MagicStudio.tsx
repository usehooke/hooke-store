"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Loader2, CheckCircle2, ChevronRight, Package, Tag, Layers } from 'lucide-react';
import { analyzeProductImage, AIProductAnalysis } from '@/lib/ai/visionService';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductSchema } from '@/features/catalog/schemas';
import { Button, Input } from '@/components/ui';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

import { Department, Size } from '@/types';
import { MotionDiv, MotionForm, MotionSpan } from '@/components/admin/MotionComponents';

/**
 * HOOKE HQ: MAGIC STUDIO WORKSPACE
 * O Santuário de Criação da Hooke V15.0.
 * Focado em eliminar o data-entry através de Visão Computacional.
 */
export function MagicStudio() {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'curating'>('upload');
  const [preview, setPreview] = useState<string | null>(null);
  const [aiGlowFields, setAiGlowFields] = useState<Set<string>>(new Set());

  // Limpa o glow após 4 segundos
  React.useEffect(() => {
    if (aiGlowFields.size > 0) {
      const timer = setTimeout(() => setAiGlowFields(new Set()), 4000);
      return () => clearTimeout(timer);
    }
  }, [aiGlowFields]);

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      id: '',
      name: '',
      slug: '',
      price: 0,
      description: '',
      category: '',
      sizes: [Size.P, Size.M, Size.G, Size.GG],
      department: Department.MASCULINO,
      imageUrl: '',
      images: [],
      featured: false,
      details: { fabric: '', model: '', wash: 'Lavagem suave' }
    }
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setStep('analyzing');

      try {
        const analysis = await analyzeProductImage(base64);
        if (analysis) {
          const id = `hooke-${Date.now()}`;
          setAiGlowFields(new Set(['name', 'price', 'category', 'description']));
          form.reset({
            id,
            name: analysis.title,
            slug: analysis.title.toLowerCase().replace(/ /g, '-'),
            price: analysis.suggestedPrice,
            description: analysis.luxuryDescription,
            category: analysis.category,
            sizes: [Size.P, Size.M, Size.G, Size.GG],
            department: Department.MASCULINO,
            imageUrl: base64 as string, 
            images: [base64 as string],
            featured: false,
            details: {
              fabric: analysis.fabric,
              model: analysis.model,
              wash: 'Lavagem padrão Hooke'
            }
          });
          setStep('curating');
        } else {
          toast.error("A IA retornou um formato inesperado. Tente outra foto.");
          setStep('upload');
        }
      } catch (error: any) {
        toast.error(`Falha: ${error?.message || "Erro desconhecido na IA."}`);
        setStep('upload');
      }
    };
    reader.readAsDataURL(file);
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    multiple: false 
  });

  const onSubmit = async (data: any) => {
    const validData = data as ProductSchema;
    try {
      if (!db) throw new Error("Database not initialized");
      const docRef = doc(db, "produtos", validData.id);
      await setDoc(docRef, { ...validData, createdAt: Date.now() });
      toast.success("Produto Publicado com Sucesso!");
      setStep('upload');
      setPreview(null);
      form.reset();
    } catch (error) {
      toast.error("Erro ao publicar no catálogo.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-2">Estúdio Mágico</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Ambiente de Criação V15.0</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <MotionDiv 
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...getRootProps()}
            className={`group relative h-[500px] border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${
              isDragActive ? 'border-emerald-500 bg-emerald-50/30' : 'border-zinc-200 bg-zinc-50 hover:border-black'
            }`}
          >
            <input {...getInputProps()} />
            <div className="p-8 bg-white border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] flex flex-col items-center gap-6 group-hover:shadow-[15px_15px_0px_0px_rgba(0,0,0,0.1)] transition-all">
              <Upload size={48} strokeWidth={1} />
              <div className="text-center">
                <p className="text-xl font-black uppercase tracking-widest">Arraste a Arte</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Ou clique para selecionar fotos</p>
              </div>
            </div>
            {isDragActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                <Sparkles size={64} className="text-emerald-500 animate-pulse" />
              </div>
            )}
          </MotionDiv>
        )}

        {step === 'analyzing' && (
          <MotionDiv 
            key="analyzing"
            className="h-[500px] flex flex-col items-center justify-center gap-8 bg-black text-white"
          >
            <div className="relative">
               <Loader2 size={64} className="animate-spin opacity-20" />
               <Sparkles size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-4">Analisando Arquitetura Têxtil</h2>
              <div className="flex gap-4 justify-center opacity-30 text-[8px] font-black uppercase tracking-widest">
                <span>Modelagem...</span>
                <span>Trama...</span>
                <span>Cromatismo...</span>
              </div>
            </div>
          </MotionDiv>
        )}

        {step === 'curating' && (
          <MotionForm 
            key="curating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-12 pb-32"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Preview da Imagem */}
               <div className="relative aspect-[3/4] border-2 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                 {preview && <img src={preview} alt="Preview" className="w-full h-full object-cover" />}
                 <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest">
                    Visão de IA Ativa
                 </div>
               </div>

               {/* Campos Principais */}
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nome do Produto</label>
                    <MotionDiv animate={aiGlowFields.has('name') ? { scale: [1, 1.02, 1] } : {}}>
                      <Input {...form.register('name')} variant="brutalist" className="text-xl" />
                    </MotionDiv>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Preço (R$)</label>
                        <Input type="number" {...form.register('price', { valueAsNumber: true })} variant="brutalist" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Categoria</label>
                        <Input {...form.register('category')} variant="brutalist" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Descrição Narrativa</label>
                    <textarea 
                        {...form.register('description')}
                        className="w-full min-h-[120px] bg-white border-2 border-black p-4 text-xs font-bold focus:outline-none"
                    />
                  </div>
               </div>
            </div>

            {/* Ficha Técnica */}
            <div className="bg-zinc-50 border-2 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Layers size={14} /> Ficha Técnica Sugerida
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Tecido</label>
                    <Input {...form.register('details.fabric')} variant="brutalist" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Modelagem</label>
                    <Input {...form.register('details.model')} variant="brutalist" className="bg-white" />
                  </div>
               </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t-2 border-black z-50 flex items-center justify-center">
               <button 
                type="submit"
                className="w-full max-w-2xl bg-black text-white py-6 flex items-center justify-center gap-4 hover:bg-zinc-900 transition-all active:scale-95 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)]"
               >
                 <CheckCircle2 size={20} />
                 <span className="text-xl font-black uppercase tracking-[0.2em]">Publicar Catálogo</span>
               </button>
            </div>
          </MotionForm>
        )}
      </AnimatePresence>
    </div>
  );
}
