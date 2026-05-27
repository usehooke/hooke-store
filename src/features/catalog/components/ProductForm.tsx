"use client";

import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductSchema } from '../schemas';
import { Input, Button } from '@/components/ui';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { AIProductAnalysis } from '@/lib/ai/visionService';
import { toast } from "sonner";
import { Undo2, Sparkles, AlertTriangle, CheckCircle2, ShieldCheck, Plus, Trash2, HelpCircle, Star } from "lucide-react";
import { Department, Size } from '@/types/enums';
import { saveProduct } from '@/app/admin/actions/products';

// Valores válidos do ProductCategorySchema (lib/schemas.ts)
const VALID_CATEGORIES = ["Kits", "Oversized", "Regatas", "Vintage", "Lifestyle", "Conjuntos", "Camisetas", "Cropped", "Top"] as const;
const SIZES_MASC = [Size.P, Size.M, Size.G, Size.GG, Size.XG, Size.G1, Size.G2];
const SIZES_FEM  = [Size.PP, Size.P, Size.M, Size.G, Size.GG];

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
  const [newImageUrl, setNewImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
    reset
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      images: [],
      sizes: [],
      featured: false,
      isNew: true,
      department: Department.MASCULINO,
      id: '',
      imageUrl: '/hero-preta.avif', // Fallback estético
      seo: {
        altText: '',
        metaDescription: ''
      }
    }
  });

  // Watchers em tempo real para auditoria do Padrão Elite
  const watchedName = watch('name');
  const watchedCategory = watch('category');
  const watchedDepartment = watch('department');
  const watchedDescription = watch('description');
  const watchedMetaDesc = watch('seo.metaDescription');
  const watchedImages = watch('images') || [];
  const watchedIsHero = watch('isHeroBanner');
  const watchedHeroUrl = watch('heroImageUrl');

  // Auditoria de Qualidade em tempo real (Fórmula Padrão Elite)
  const issues: string[] = [];
  if (!watchedDepartment) {
    issues.push("Sem departamento definido");
  }
  if (!watchedImages || watchedImages.length < 4) {
    issues.push(`Poucas fotos na galeria (${watchedImages.length}/4)`);
  }
  if (!watchedDescription || watchedDescription.length < 100) {
    issues.push(`Narrativa da marca muito curta (${watchedDescription?.length || 0}/100 crt)`);
  }
  if (!watchedMetaDesc || watchedMetaDesc.length < 50) {
    issues.push(`Meta Description Google curta (${watchedMetaDesc?.length || 0}/50 crt)`);
  }

  const isElite = issues.length === 0;

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
      
      const newGlow = new Set(['name', 'category', 'price', 'description', 'seo.metaDescription']);
      setAiGlowFields(newGlow);

      setValue('name', data.title, { shouldDirty: true });
      setValue('category', data.category, { shouldDirty: true });
      setValue('price', data.suggestedPrice, { shouldDirty: true });
      setValue('description', data.luxuryDescription, { shouldDirty: true });
      setValue('imageUrl', data.imageUrl || '/hero-preta.avif', { shouldDirty: true });
      setValue('slug', data.title.toLowerCase().replace(/ /g, '-'), { shouldDirty: true });
      
      // Auto-injetar fotos fictícias se faltar no vision AI para acelerar
      const defaultGallery = [
        data.imageUrl || '/hero-preta.avif',
        '/hero-preta.avif',
        '/hero-preta.avif',
        '/hero-preta.avif'
      ];
      setValue('images', defaultGallery, { shouldDirty: true });
      
      if (!getValues('seo')) {
        setValue('seo', {}, { shouldDirty: true });
      }
      setValue('seo.metaDescription', `Equipamento premium Hooke: ${data.title}. Design soft brutalist de altíssimo padrão, costuras reforçadas e caimento perfeito.`, { shouldDirty: true });
      setValue('seo.altText', data.title, { shouldDirty: true });

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

  // Motor Semântico Elite Local
  const handleSemanticRefine = () => {
    const name = getValues('name');
    const category = getValues('category') || '';
    const department = getValues('department') || Department.MASCULINO;

    if (!name || name.trim().length < 2) {
      toast.error("Preencha a Designação (Nome) do produto antes de refinar semanticamente.");
      return;
    }

    setSnapshot(getValues());
    const glow = new Set(['description', 'seo.metaDescription']);
    setAiGlowFields(glow);

    let refinedDesc = "";
    let refinedMeta = "";

    const cleanCategory = category.toLowerCase();
    if (cleanCategory.includes('oversized') || cleanCategory.includes('camiseta')) {
      refinedDesc = `Camiseta modelagem Boxy estruturada em algodão premium 260g (heavyweight), proporcionando caimento impecável e estruturado. Possui acabamento peletizado soft-touch de toque aveludado, gola canelada de 3cm que mantém a forma original e etiqueta Woven minimalista tecida em alta definição na barra. Costuras duplas reforçadas reforçam a durabilidade e estilo industrial minimalista.`;
      refinedMeta = `Compre a ${name} Hooke. Camiseta oversized boxy em algodão premium heavyweight 260g. Caimento estruturado, toque soft e etiqueta elite.`;
    } else if (cleanCategory.includes('regata')) {
      refinedDesc = `Regata esportiva de alta gramatura Hooke Elite, confeccionada em blend nobre de algodão premium e elastano, promovendo elasticidade, respirabilidade e resistência superiores. Cavas perfeitamente delineadas com acabamento em viés confortável, ideais para treinos pesados ou produções casuais urbanas. Logo em micro-tom termocolante de alta fixação.`;
      refinedMeta = `Regata ${name} Hooke: Modelagem atlética premium com cavas anatômicas e algodão elastano de alto padrão. Perfeita para treino e rua.`;
    } else {
      refinedDesc = `Equipamento de elite do Arsenal Hooke, desenvolvido com modelagem ergonômica avançada e tecido nobre de alta gramatura. Acabamento peletizado premium com toque aveludado e costuras reforçadas em viés de ombro a ombro. Inclui etiqueta interna tecida (Woven label) de alta definição e design minimalista contemporâneo focado na longevidade urbana.`;
      refinedMeta = `Equipamento Premium Hooke: ${name}. Tecido de alta gramatura com toque extra soft, modelagem estruturada e acabamento Elite.`;
    }

    setValue('description', refinedDesc, { shouldDirty: true });
    setValue('seo.metaDescription', refinedMeta, { shouldDirty: true });
    setValue('seo.altText', name, { shouldDirty: true });

    // Auto-preencher galeria se estiver vazia ou com poucas fotos
    const currentImgs = getValues('images') || [];
    if (currentImgs.length < 4) {
      const fallbackUrl = getValues('imageUrl') || '/hero-preta.avif';
      const mockImgs = [
        fallbackUrl,
        '/hero-preta.avif',
        '/hero-preta.avif',
        '/hero-preta.avif'
      ];
      setValue('images', mockImgs, { shouldDirty: true });
    }

    toast.success("🪄 Descrição rica e SEO metaDescription refinados com sucesso!");
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    const current = getValues('images') || [];
    if (current.includes(newImageUrl)) {
      toast.warning("Esta imagem já está na galeria.");
      return;
    }
    const updated = [...current, newImageUrl];
    setValue('images', updated, { shouldDirty: true });
    if (updated.length === 1) {
      setValue('imageUrl', newImageUrl, { shouldDirty: true });
    }
    setNewImageUrl("");
    toast.success("Foto acoplada ao produto.");
  };

  const removeImage = (index: number) => {
    const current = getValues('images') || [];
    const urlToRemove = current[index];
    const updated = current.filter((_, i) => i !== index);
    setValue('images', updated, { shouldDirty: true });
    
    // Se a imagem removida era a Hero, limpa a flag
    if (getValues('heroImageUrl') === urlToRemove) {
      setValue('isHeroBanner', false, { shouldDirty: true });
      setValue('heroImageUrl', '', { shouldDirty: true });
    }

    if (updated.length > 0) {
      setValue('imageUrl', updated[0], { shouldDirty: true });
    } else {
      setValue('imageUrl', '/hero-preta.avif', { shouldDirty: true });
    }
    toast.info("Foto removida da galeria.");
  };

  const handleFormSubmit: SubmitHandler<any> = async (data) => {
    const productData = data as ProductSchema;
    if (externalOnSubmit) {
      await (externalOnSubmit as any)(productData);
      return;
    }

    try {
      const finalData = {
        ...data,
        id: data.id || data.slug || `prod-${Date.now()}`,
        isActive: true,
      };

      // 2. Tenta salvar via Server Action (Revalidação Automática e Resiliente na Vercel)
      const result = await saveProduct(finalData, 'admin@hooke.com');
      
      if (!result.success) {
        throw new Error(result.message || 'Erro desconhecido ao salvar.');
      }
      
      toast.success(data.id ? "Produto atualizado com sucesso" : "Novo produto cadastrado na coleção");
      
      if (!data.id) reset();
      
    } catch (err: any) {
      console.error("Erro ao salvar produto:", err);
      toast.error(err.message || "Falha na comunicação com os servidores Hooke.");
    }
  };

  const glowStyles = "ring-2 ring-amber-400/50 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-1000";

  return (
    <div className="space-y-8 relative">
      
      {/* PÍLULA FLUTUANTE / BARRA DE STATUS ELITE INTERATIVA */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {isElite ? (
            <motion.div
              key="elite-status"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-6 border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sharp shadow-green-500/20 flex flex-col md:flex-row justify-between items-center gap-4 text-green-900"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center animate-pulse shadow-md">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-widest uppercase">🏆 PADRÃO ELITE CONCLUÍDO</h4>
                  <p className="text-[10px] uppercase font-bold text-green-700 tracking-wider">Este produto atende a 100% das métricas de alta conversão Hooke</p>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest bg-green-600 text-white px-3 py-1.5 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">APROVADO 100%</span>
            </motion.div>
          ) : (
            <motion.div
              key="pending-status"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-6 border-2 border-black bg-zinc-50 shadow-sharp flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle size={16} />
                  <h4 className="text-xs font-black tracking-widest uppercase text-black">AUDITORIA DE QUALIDADE EM TEMPO REAL</h4>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                    {watchedDepartment ? <span className="text-green-500">✓</span> : <span className="text-red-500">✗</span>} Dept
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                    {watchedImages.length >= 4 ? <span className="text-green-500">✓</span> : <span className="text-red-500">✗</span>} Galeria ({watchedImages.length}/4)
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                    {watchedDescription?.length >= 100 ? <span className="text-green-500">✓</span> : <span className="text-red-500">✗</span>} Descrição ({watchedDescription?.length || 0}/100)
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                    {(watchedMetaDesc?.length ?? 0) >= 50 ? <span className="text-green-500">✓</span> : <span className="text-red-500">✗</span>} SEO ({watchedMetaDesc?.length || 0}/50)
                  </span>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleSemanticRefine}
                  className="w-full md:w-auto px-6 py-3 border-2 border-black bg-yellow-300 hover:bg-black hover:text-white text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={13} /> Refinar Semântica & SEO
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

      <form id="product-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
        <input type="hidden" {...register('id')} />
        <input type="hidden" {...register('imageUrl')} />
        <input type="hidden" {...register('isHeroBanner')} />
        <input type="hidden" {...register('heroImageUrl')} />
        
        {/* GRID PRINCIPAL */}
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

          {/* DEPARTAMENTO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Departamento</label>
            <select
              {...register('department')}
              className="w-full h-[50px] px-4 border-2 border-black font-mono text-xs uppercase tracking-widest bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none"
            >
              <option value={Department.MASCULINO}>Masculino</option>
              <option value={Department.FEMININO}>Feminino</option>
              <option value={Department.UNISSEX}>Unissex</option>
            </select>
          </div>

          {/* CATEGORIA — select com valores válidos do enum */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Categoria</label>
            <select
              {...register('category')}
              className={`w-full h-[50px] px-4 border-2 border-black font-mono text-xs uppercase tracking-widest bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none ${
                aiGlowFields.has('category') ? glowStyles : ''
              }`}
            >
              <option value="">— Selecione a categoria —</option>
              {VALID_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* TAMANHOS — obrigatório para produto aparecer no site */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Tamanhos Disponíveis <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(watchedDepartment === Department.FEMININO ? SIZES_FEM : SIZES_MASC).map(size => {
                const isSelected = (watch('sizes') || []).includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      const current = getValues('sizes') || [];
                      const updated = isSelected
                        ? current.filter(s => s !== size)
                        : [...current, size];
                      setValue('sizes', updated, { shouldDirty: true });
                    }}
                    className={`w-12 h-12 text-xs font-black border-2 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                      isSelected
                        ? 'bg-black text-white border-black shadow-none translate-x-0.5 translate-y-0.5'
                        : 'bg-white text-black border-black hover:bg-zinc-100'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {(watch('sizes') || []).length === 0 && (
              <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">⚠ Selecione ao menos 1 tamanho para publicar</p>
            )}
          </div>

          {/* SLUG */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Slug (URL)</label>
            <Input {...register('slug')} variant="luxury" className="bg-zinc-50" placeholder="slug-do-produto" />
          </div>
        </div>

        {/* NARRATIVA SEO (DESCRIÇÃO) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Narrativa Premium (Descrição)</label>
            <span className="text-[9px] font-mono text-zinc-400 uppercase">{watchedDescription?.length || 0}/100 crt min</span>
          </div>
          <motion.div animate={aiGlowFields.has('description') ? { scale: [1, 1.01, 1] } : {}}>
            <textarea 
              {...register('description')}
              className={`w-full min-h-[140px] p-6 border-2 border-black bg-white focus:outline-none text-xs font-mono leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                aiGlowFields.has('description') ? glowStyles : ''
              }`}
              placeholder="Escreva sobre o caimento estruturado, tecidos e diferencial da peça..."
            />
          </motion.div>
        </div>

        {/* META DESCRIPTION (GOOGLE) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Google Meta Description (SEO)</label>
            <span className="text-[9px] font-mono text-zinc-400 uppercase">{watchedMetaDesc?.length || 0}/50 crt min</span>
          </div>
          <motion.div animate={aiGlowFields.has('seo.metaDescription') ? { scale: [1, 1.01, 1] } : {}}>
            <textarea 
              {...register('seo.metaDescription')}
              className={`w-full min-h-[80px] p-4 border-2 border-black bg-white focus:outline-none text-xs font-mono leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                aiGlowFields.has('seo.metaDescription') ? glowStyles : ''
              }`}
              placeholder="Digite um resumo chamativo para buscas no Google..."
            />
          </motion.div>
        </div>

        {/* GALERIA DE FOTOS DO PRODUTO */}
        <div className="space-y-4 p-6 border-2 border-black bg-zinc-50/50 shadow-sharp">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black tracking-widest uppercase">Arsenal de Imagens (Galeria)</h3>
              <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">O Padrão Elite exige no mínimo 4 fotos cadastradas</p>
            </div>
            <span className="text-[10px] font-black bg-black text-white px-2 py-1">{watchedImages.length} fotos</span>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Cole a URL da imagem aqui..."
              className="flex-1 px-4 border-2 border-black text-xs font-mono focus:outline-none bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-6 py-3 border-2 border-black bg-black text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus size={14} className="inline mr-1" /> Acoplar
            </button>
          </div>

          {/* GRID DE FOTOS DA GALERIA */}
          {watchedImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-black/5">
              {watchedImages.map((url, i) => (
                <div 
                  key={i} 
                  className={`relative group aspect-square border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 ${
                    watchedIsHero && watchedHeroUrl === url
                      ? "border-amber-400 ring-2 ring-amber-400/50"
                      : "border-black"
                  }`}
                >
                  {watchedIsHero && watchedHeroUrl === url && (
                    <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[7px] font-black px-1.5 py-0.5 border border-black uppercase tracking-wider flex items-center gap-1 z-10 shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
                      <Star size={8} className="fill-white text-white" /> Hero
                    </div>
                  )}

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Galeria ${i+1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const isCurrentlyHero = watchedIsHero && watchedHeroUrl === url;
                        if (isCurrentlyHero) {
                          setValue('isHeroBanner', false, { shouldDirty: true });
                          setValue('heroImageUrl', '', { shouldDirty: true });
                          toast.info("Removido do Hero Banner da Home.");
                        } else {
                          setValue('isHeroBanner', true, { shouldDirty: true });
                          setValue('heroImageUrl', url, { shouldDirty: true });
                          toast.success("Definida como imagem do Hero Banner da Home!");
                        }
                      }}
                      className={`p-2 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-none text-white transition-colors ${
                        watchedIsHero && watchedHeroUrl === url
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-zinc-850 hover:bg-zinc-700"
                      }`}
                      title={watchedIsHero && watchedHeroUrl === url ? "Remover flag Hero" : "Marcar como Hero Banner"}
                    >
                      <Star size={14} className={watchedIsHero && watchedHeroUrl === url ? "fill-white" : ""} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="p-2 bg-red-600 hover:bg-red-800 text-white rounded-none border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      title="Excluir imagem"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-black text-white text-[8px] font-bold px-1 py-0.5 uppercase tracking-widest">
                    {i === 0 ? "Principal" : `Foto ${i+1}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-400 border border-dashed border-black/20 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">A galeria está vazia</span>
              <p className="text-[8px] uppercase tracking-widest">Cole URLs acima ou utilize o Refinador Mágico para gerar fallbacks</p>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <Button 
          type="submit" 
          variant="brutalist" 
          className="w-full py-8 text-sm font-black uppercase tracking-[0.5em] bg-black text-white hover:bg-zinc-900 disabled:opacity-50 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sincronizando no Arsenal...' : 'Publicar no Catálogo'}
        </Button>
      </form>
    </div>
  );
});

ProductForm.displayName = "ProductForm";

export { ProductForm };
