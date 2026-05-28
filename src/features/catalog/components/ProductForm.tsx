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

// Helper para normalização e conversão de cores para sigla
function getColorCode(color: string): string {
  const normalized = color.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (normalized.includes("preta") || normalized.includes("preto")) return "PTO";
  if (normalized.includes("branca") || normalized.includes("branco")) return "BRC";
  if (normalized.includes("cinza")) return "CNZ";
  if (normalized.includes("salvia") || normalized.includes("verde")) return "VDE";
  if (normalized.includes("azul")) return "AZL";
  if (normalized.includes("vermelha") || normalized.includes("vermelho")) return "VMH";
  if (normalized.includes("amarela") || normalized.includes("amarelo")) return "AML";
  if (normalized.includes("rosa")) return "ROS";
  if (normalized.includes("bege")) return "BGE";
  if (normalized.includes("marrom")) return "MRM";
  if (normalized.includes("kombi")) return "KMB";
  if (normalized.includes("fusca")) return "FSC";
  
  const noVowels = normalized.replace(/[aeiou]/g, "").toUpperCase();
  if (noVowels.length >= 3) return noVowels.slice(0, 3);
  return normalized.slice(0, 3).toUpperCase().padEnd(3, 'X');
}

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
      id: '',
      name: '',
      price: undefined,
      category: '',
      description: '',
      imageUrl: '/hero-preta.avif',
      images: [],
      sizes: [],
      featured: false,
      isNew: true,
      department: Department.MASCULINO,
      seo: {
        altText: '',
        metaDescription: ''
      },
      modelId: '',
      color: '',
      stock: {},
      skus: {}
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
      refinedDesc = `Camiseta de caimento estruturado e amplo desenvolvida em algodão nobre de gramatura robusta de 260g, garantindo conforto térmico ideal e caimento impecável. Possui gola encorpada de 3cm de costuras reforçadas que não deforma com o uso e etiqueta em alta definição aplicada na barra como assinatura visual. Uma peça essencial de apelo minimalista e máxima longevidade.`;
      refinedMeta = `Compre a ${name} Hooke. Camiseta de algodão premium de alta gramatura e caimento impecável. Conforto e sofisticação minimalista.`;
    } else if (cleanCategory.includes('regata')) {
      refinedDesc = `Regata desenvolvida em malha de algodão premium com toque aveludado e caimento anatômico perfeito. Possui costuras duplas e acabamento em viés de alta qualidade para máximo conforto durante o uso. Apresenta assinatura sutil e design contemporâneo focado na alta durabilidade e estilo minimalista elegante.`;
      refinedMeta = `Compre a ${name} Hooke. Regata premium de caimento anatômico e tecido extremamente macio. Durabilidade e elegância no dia a dia.`;
    } else {
      refinedDesc = `Peça exclusiva da coleção Hooke, produzida a partir de fibras nobres selecionadas de algodão com toque de alto padrão. O design apresenta linhas limpas e estrutura contemporânea com acabamentos internos e costuras reforçadas em viés. Uma expressão pura de sofisticação essencial que valoriza o caimento natural no corpo.`;
      refinedMeta = `Equipamento Premium Hooke: ${name}. Tecido nobre de caimento impecável, toque suave e acabamento de altíssimo nível.`;
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
    
    // Normalização e geração inteligente do SKU
    const colorVal = data.color || '';
    const modelIdVal = (data.modelId || '').trim().toUpperCase();
    
    let generatedId = data.id;
    let generatedSlug = data.slug;
    
    if (modelIdVal && colorVal) {
      const colorSigla = getColorCode(colorVal);
      generatedId = `${modelIdVal}-${colorSigla}`;
      
      if (!generatedSlug) {
        generatedSlug = generatedId.toLowerCase();
      }
    } else {
      generatedId = data.id || data.slug || `prod-${Date.now()}`;
      if (!generatedSlug) {
        generatedSlug = generatedId.toLowerCase();
      }
    }
    
    // Autogerar SKUs por tamanho
    const generatedSkus: Record<string, string> = {};
    if (modelIdVal && colorVal && data.sizes && data.sizes.length > 0) {
      const colorSigla = getColorCode(colorVal);
      data.sizes.forEach((size: string) => {
        generatedSkus[size] = `${modelIdVal}-${colorSigla}-${size}`;
      });
    }

    // Filtrar estoque órfão
    const filteredStock: Record<string, number> = {};
    let totalStock = 0;
    if (data.sizes && data.stock) {
      data.sizes.forEach((size: string) => {
        const qty = data.stock[size] ?? 0;
        filteredStock[size] = qty;
        totalStock += qty;
      });
    }

    try {
      const finalData = {
        ...data,
        id: generatedId,
        slug: generatedSlug,
        skus: generatedSkus,
        stock: filteredStock,
        totalStock: totalStock,
        isActive: true,
      };

      if (externalOnSubmit) {
        await (externalOnSubmit as any)(finalData);
        return;
      }

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

  const handleFormError = (errors: any) => {
    console.error("[ProductForm] Validação Zod falhou:", errors);
    toast.error("Validação falhou! Corrija os campos obrigatórios destacados.");
    
    // Toasts dinâmicos detalhados
    Object.keys(errors).forEach((key) => {
      const error = errors[key];
      if (error?.message) {
        toast.error(`${error.message}`);
      } else if (typeof error === 'object') {
        Object.keys(error).forEach((subKey) => {
          const subError = error[subKey];
          if (subError?.message) {
            toast.error(`${subError.message}`);
          }
        });
      }
    });
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

      <form id="product-form" onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="space-y-10">
        <input type="hidden" {...register('id')} />
        <input type="hidden" {...register('imageUrl')} />
        <input type="hidden" {...register('isHeroBanner')} />
        <input type="hidden" {...register('heroImageUrl')} />
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* ID DO MODELO */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">ID do Modelo (Model ID)</label>
            </div>
            <Input 
              {...register('modelId')} 
              variant="brutalist" 
              placeholder="Ex: CAM-VINT-FUSCA"
              className={`${errors.modelId ? 'border-red-500' : ''}`}
            />
            {errors.modelId && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.modelId.message}</p>}
          </div>

          {/* COR */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Cor do Anúncio</label>
            <Input 
              {...register('color')} 
              variant="brutalist" 
              placeholder="Ex: Preta"
              className={`${errors.color ? 'border-red-500' : ''}`}
            />
            {errors.color && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.color.message}</p>}
          </div>
          
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
            {errors.price && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.price.message}</p>}
          </div>

          {/* DEPARTAMENTO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Departamento</label>
            <select
              {...register('department')}
              className={`w-full h-[50px] px-4 border-2 border-black font-mono text-xs uppercase tracking-widest bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none ${errors.department ? 'border-red-500' : ''}`}
            >
              <option value={Department.MASCULINO}>Masculino</option>
              <option value={Department.FEMININO}>Feminino</option>
              <option value={Department.UNISSEX}>Unissex</option>
            </select>
            {errors.department && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.department.message}</p>}
          </div>

          {/* CATEGORIA — select com valores válidos do enum */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Categoria</label>
            <select
              {...register('category')}
              className={`w-full h-[50px] px-4 border-2 border-black font-mono text-xs uppercase tracking-widest bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none ${
                errors.category ? 'border-red-500' : ''
              } ${
                aiGlowFields.has('category') ? glowStyles : ''
              }`}
            >
              <option value="">— Selecione a categoria —</option>
              {VALID_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.category.message}</p>}
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
            {errors.sizes && (
              <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.sizes.message}</p>
            )}
            {(watch('sizes') || []).length === 0 && !errors.sizes && (
              <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">⚠ Selecione ao menos 1 tamanho para publicar</p>
            )}
          </div>

          {/* GERENCIAMENTO DE ESTOQUE GRANULAR (OTIMIZADO PARA TOUCH) */}
          {(watch('sizes') || []).length > 0 && (
            <div className="col-span-1 md:col-span-2 space-y-4 p-5 border-2 border-black bg-zinc-50 shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-fadeIn">
              <div>
                <h3 className="text-[10px] font-black tracking-widest uppercase">Estoque por Variante</h3>
                <p className="text-[8px] uppercase font-bold text-zinc-400 tracking-wider">Ajuste o estoque numérico de cada tamanho (Confortável para dedão)</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(watch('sizes') || []).map((size) => {
                  const currentStock = watch(`stock.${size}`) ?? 0;
                  return (
                    <div key={size} className="flex items-center justify-between border-2 border-black bg-white p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <span className="text-xs font-black w-8 text-center">{size}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.max(0, currentStock - 1);
                            setValue(`stock.${size}`, val, { shouldDirty: true });
                          }}
                          className="w-12 h-12 flex items-center justify-center border-2 border-black bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-base font-black transition-all shadow-[1px_1px_0px_rgba(0,0,0,1)] select-none"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={currentStock}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setValue(`stock.${size}`, Math.max(0, val), { shouldDirty: true });
                          }}
                          className="w-16 h-12 border-2 border-black text-center font-mono text-xs font-bold focus:outline-none bg-white text-black"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = currentStock + 1;
                            setValue(`stock.${size}`, val, { shouldDirty: true });
                          }}
                          className="w-12 h-12 flex items-center justify-center border-2 border-black bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-base font-black transition-all shadow-[1px_1px_0px_rgba(0,0,0,1)] select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                errors.description ? 'border-red-500' : ''
              } ${
                aiGlowFields.has('description') ? glowStyles : ''
              }`}
              placeholder="Escreva sobre o caimento estruturado, tecidos e diferencial da peça..."
            />
          </motion.div>
          {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.description.message}</p>}
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
          {errors.images && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest my-2">{errors.images.message}</p>
          )}
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
