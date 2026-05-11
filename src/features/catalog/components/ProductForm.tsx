"use client";

import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductSchema } from '../schemas';
import { Input, Button } from '@/components/ui';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { AIProductAnalysis } from '@/lib/ai/visionService';
import { toast } from "sonner";
import { Undo2, Sparkles } from "lucide-react";

export interface ProductFormHandle {
  setValuesFromAI: (data: AIProductAnalysis) => void;
  setValues: (data: any) => void;
}

export interface ProductFormProps {
  onSubmit?: (data: ProductSchema) => Promise<void>;
}

const ProductForm = forwardRef<ProductFormHandle, ProductFormProps>((props, ref) => {
  const { onSubmit: externalOnSubmit } = props;
  const [snapshot, setSnapshot] = useState<ProductSchema | null>(null);
  const [aiGlowFields, setAiGlowFields] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, dirtyFields },
    reset
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      images: [],
      sizes: [],
      featured: false,
      isNew: true,
      department: 'Masculino' as any,
    }
  });

  // Função para limpar o glow após alguns segundos
  useEffect(() => {
    if (aiGlowFields.size > 0) {
      const timer = setTimeout(() => setAiGlowFields(new Set()), 4000);
      return () => clearTimeout(timer);
    }
  }, [aiGlowFields]);

  useImperativeHandle(ref, () => ({
    setValuesFromAI: (data: AIProductAnalysis) => {
      console.log("[ProductForm] Criando snapshot para rollback...");
      setSnapshot(getValues()); // Salva estado atual antes da IA
      
      const newGlow = new Set(['name', 'category', 'price', 'description']);
      setAiGlowFields(newGlow);

      setValue('name', data.name, { shouldDirty: true });
      setValue('category', data.category, { shouldDirty: true });
      setValue('price', data.price, { shouldDirty: true });
      setValue('description', data.description, { shouldDirty: true });
      setValue('slug', data.name.toLowerCase().replace(/ /g, '-'), { shouldDirty: true });
      
      setValue('details', {
        fabric: data.fabric,
        model: data.model,
        wash: 'Padrão Hooke'
      }, { shouldDirty: true });
      
      toast.info("Campos atualizados pela Hook Vision. Verifique os destaques dourados.");
    },
    setValues: (data: any) => {
      Object.keys(data).forEach((key) => {
        setValue(key as any, data[key]);
      });
    }
  }));

  const handleUndo = () => {
    if (snapshot) {
      reset(snapshot);
      setSnapshot(null);
      setAiGlowFields(new Set());
      toast.success("Restaurado ao estado original.");
    }
  };

  const handleFormSubmit: SubmitHandler<any> = async (data) => {
    const productData = data as ProductSchema;
    if (externalOnSubmit) {
      await (externalOnSubmit as any)(productData);
      return;
    }

    try {
      if (!db) throw new Error("Firebase não inicializado");
      await addDoc(collection(db, 'produtos'), data);
      toast.success("Equipamento incorporado ao arsenal com sucesso!");
      reset();
      setSnapshot(null);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Falha técnica na incorporação.");
    }
  };

  const glowStyles = "ring-2 ring-amber-400/50 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-1000";

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {snapshot && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between p-4 bg-amber-50 border-2 border-amber-200 text-amber-900"
          >
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-amber-600" />
              <p className="text-[10px] font-black uppercase tracking-widest">IA modificou este formulário</p>
            </div>
            <button 
              onClick={handleUndo}
              className="flex items-center gap-2 px-4 py-2 bg-amber-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-black transition-colors"
            >
              <Undo2 size={14} /> Desfazer Magia
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NOME */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Designação (Nome)</label>
            <motion.div animate={aiGlowFields.has('name') ? { scale: [1, 1.02, 1] } : {}}>
              <Input 
                {...register('name')} 
                variant="brutalist" 
                placeholder="Ex: T-Shirt Boxy Alpha"
                className={`${errors.name ? 'border-red-500' : ''} ${aiGlowFields.has('name') ? glowStyles : ''}`}
              />
            </motion.div>
            {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
          </div>

          {/* PREÇO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Valor (BRL)</label>
            <motion.div animate={aiGlowFields.has('price') ? { scale: [1, 1.02, 1] } : {}}>
              <Input 
                {...register('price', { valueAsNumber: true })} 
                variant="brutalist" 
                type="number" 
                step="0.01"
                className={`${errors.price ? 'border-red-500' : ''} ${aiGlowFields.has('price') ? glowStyles : ''}`}
              />
            </motion.div>
          </div>

          {/* CATEGORIA */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Categoria</label>
            <Input 
              {...register('category')} 
              variant="brutalist" 
              className={aiGlowFields.has('category') ? glowStyles : ''}
            />
          </div>

          {/* SLUG */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Slug (URL)</label>
            <Input {...register('slug')} variant="luxury" className="bg-zinc-50" />
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Narrativa SEO (Descrição)</label>
          <motion.div animate={aiGlowFields.has('description') ? { scale: [1, 1.01, 1] } : {}}>
            <textarea 
              {...register('description')}
              className={`w-full min-h-[120px] p-6 border-2 border-black bg-white focus:outline-none text-sm font-medium leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                aiGlowFields.has('description') ? glowStyles : ''
              }`}
              placeholder="A IA escreverá isto para você..."
            />
          </motion.div>
        </div>

        <Button 
          type="submit" 
          variant="brutalist" 
          className="w-full py-8 text-sm font-black uppercase tracking-[0.5em] bg-black text-white hover:bg-zinc-900 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sincronizando...' : 'Publicar no Catálogo'}
        </Button>
      </form>
    </div>
  );
});

ProductForm.displayName = "ProductForm";

export { ProductForm };

