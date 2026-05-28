"use client";

import React, { useImperativeHandle, forwardRef, useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductSchema } from '../schemas';
import { Input, Button } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { AIProductAnalysis } from '@/lib/ai/visionService';
import { toast } from "sonner";
import { 
  Undo2, Sparkles, AlertTriangle, CheckCircle2, ShieldCheck, 
  Plus, Trash2, HelpCircle, Star, LayoutGrid, Package, 
  Upload, FileText, ChevronRight, Eye, Ruler, Zap 
} from "lucide-react";
import { Department, Size } from '@/types/enums';
import { saveProduct } from '@/app/admin/actions/products';
import { QRCodeSVG } from 'qrcode.react';

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

// Tabela de medidas para o guia do preview
const SIZE_GUIDE_PREVIEW: Record<string, { peito: string; comprimento: string }> = {
  'P':  { peito: '96cm', comprimento: '68cm' },
  'M':  { peito: '102cm', comprimento: '70cm' },
  'G':  { peito: '108cm', comprimento: '72cm' },
  'GG': { peito: '116cm', comprimento: '74cm' },
};

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isIdManuallyEdited, setIsIdManuallyEdited] = useState(false);

  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dnzplmjfo";
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rsjrcxrg";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Falha ao se comunicar com o servidor do Cloudinary.");
      }

      const result = await res.json();
      if (result.error) {
        throw new Error(result.error.message || "Erro no upload do Cloudinary.");
      }

      if (result.secure_url) {
        const currentImages = getValues("images") || [];
        const updatedImages = [...currentImages, result.secure_url];
        setValue("images", updatedImages, { shouldDirty: true });

        // Se for a primeira imagem, define também como capa (imageUrl)
        if (updatedImages.length === 1) {
          setValue("imageUrl", result.secure_url, { shouldDirty: true });
        }

        toast.success("Imagem enviada com sucesso para o Cloudinary e adicionada à galeria!");
      }
    } catch (err: any) {
      console.error("Erro no upload para o Cloudinary:", err);
      toast.error(err.message || "Erro ao carregar foto.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  // Controle de Abas Operacionais (Painel Atelier)
  const [activeTab, setActiveTab] = useState<'identidade' | 'grade' | 'midia' | 'seo'>('identidade');
  
  // Controle de Visualização do Preview (Painel Vitrine)
  const [previewMode, setPreviewMode] = useState<'vitrine' | 'detalhes' | 'seo' | 'etiqueta'>('vitrine');

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
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
      details: {
        fabric: '',
        model: '',
        wash: 'Padrão Hooke'
      },
      modelId: '',
      color: '',
      stock: {},
      skus: {}
    }
  });

  // Watchers em tempo real para sincronização do Live Preview
  const watchedName = watch('name') || '';
  const watchedPrice = watch('price');
  const watchedCategory = watch('category') || '';
  const watchedDepartment = watch('department') || Department.MASCULINO;
  const watchedColor = watch('color') || '';
  const watchedModelId = watch('modelId') || '';
  const watchedSizes = watch('sizes') || [];
  const watchedStock = watch('stock') || {};
  const watchedDescription = watch('description') || '';
  const watchedMetaDesc = watch('seo.metaDescription') || '';
  const watchedImages = watch('images') || [];
  const watchedImageUrl = watch('imageUrl') || '/hero-preta.avif';
  const watchedIsHero = watch('isHeroBanner');
  const watchedHeroUrl = watch('heroImageUrl');

  // Geração do SKU Base e Slug em Tempo Real para a etiqueta e formulário (Feedback Reativo)
  const [computedSku, setComputedSku] = useState('');
  useEffect(() => {
    if (watchedModelId && watchedColor) {
      const colorSigla = getColorCode(watchedColor);
      const sku = `${watchedModelId.trim().toUpperCase()}-${colorSigla}`;
      setComputedSku(sku);
      
      if (!isIdManuallyEdited) {
        // Auto-sincroniza o ID e Slug reativamente no formulário para feedback visual em tempo real!
        setValue('id', sku, { shouldDirty: true });
        setValue('slug', sku.toLowerCase(), { shouldDirty: true });
      }
    } else {
      setComputedSku('');
      if (!watchedModelId || !watchedColor) {
        setIsIdManuallyEdited(false);
      }
    }
  }, [watchedModelId, watchedColor, setValue, isIdManuallyEdited]);

  // Auto-sincroniza Alt Text, Meta Description, Tecido e Corte de forma inteligente e reativa se contiver termos genéricos/defasados
  useEffect(() => {
    if (watchedName) {
      setValue('seo.altText', watchedName, { shouldDirty: true });
      
      const currentMeta = getValues('seo.metaDescription') || '';
      const cat = (watchedCategory || '').toLowerCase();
      const currentFabric = getValues('details.fabric') || '';
      const currentModel = getValues('details.model') || '';
      
      let generatedMeta = `Equipamento premium Hooke: ${watchedName}. Design de alto padrão`;
      let suggestedFabric = '';
      let suggestedModel = '';
      
      const nameLower = watchedName.toLowerCase();
      if (cat.includes('conjunto') || nameLower.includes('conjunto')) {
        generatedMeta = `Conjunto exclusivo Hooke: ${watchedName}. Modelagem refinada de caimento impecável e toque extremamente sofisticado no corpo.`;
        suggestedFabric = 'Viscose nobre de alta gramatura com toque frio';
        suggestedModel = 'Relaxed Elegant Fit';
      } else if (cat.includes('camiseta') || cat.includes('oversized') || nameLower.includes('camiseta')) {
        generatedMeta = `Camiseta premium Hooke: ${watchedName}. Algodão nobre de alta gramatura com caimento estruturado perfeito e longevidade superior.`;
        suggestedFabric = 'Algodão Premium 260g (Heavyweight)';
        suggestedModel = 'Boxy Oversized Fit';
      } else if (cat.includes('regata') || nameLower.includes('regata')) {
        generatedMeta = `Regata nobre Hooke: ${watchedName}. Toque macio de alta durabilidade e caimento anatômico elegante para o dia a dia.`;
        suggestedFabric = 'Algodão Penteado Nobre Fio 30.1';
        suggestedModel = 'Anatomic Fit';
      }

      // Detecção de divergências de termos genéricos (se contiver Pima, Classic Navy, etc. mas o nome for outro)
      const hasMismatchedTerms = 
        currentMeta.includes('T-Shirt Pima') || 
        currentMeta.includes('Classic Navy') ||
        currentMeta.includes('algodão robusto') ||
        currentMeta.trim() === '' ||
        (cat.includes('conjunto') && currentMeta.toLowerCase().includes('camiseta')) ||
        (watchedName && !currentMeta.includes(watchedName.slice(0, 15)));

      if (hasMismatchedTerms) {
        setValue('seo.metaDescription', generatedMeta, { shouldDirty: true });
      }

      // Se o tecido ou corte estiverem vazios ou contiverem dados de outros tecidos
      const hasMismatchedFabric = 
        currentFabric.trim() === '' || 
        currentFabric === '100% Algodão Pima Peruano' ||
        (cat.includes('conjunto') && currentFabric.toLowerCase().includes('algodão'));
        
      if (hasMismatchedFabric && suggestedFabric) {
        setValue('details.fabric', suggestedFabric, { shouldDirty: true });
      }

      const hasMismatchedModel = 
        currentModel.trim() === '' || 
        currentModel === 'Structured Fit' ||
        (cat.includes('conjunto') && currentModel.toLowerCase().includes('structured'));

      if (hasMismatchedModel && suggestedModel) {
        setValue('details.model', suggestedModel, { shouldDirty: true });
      }
    }
  }, [watchedName, watchedCategory, setValue]);

  // Auditoria de Qualidade em tempo real (Fórmula Padrão Elite)
  const issues: string[] = [];
  if (!watchedDepartment) issues.push("Sem departamento");
  if (!watchedImages || watchedImages.length < 4) {
    issues.push(`Poucas fotos na galeria (${watchedImages.length}/4)`);
  }
  if (!watchedDescription || watchedDescription.length < 100) {
    issues.push(`Narrativa muito curta (${watchedDescription.length}/100 crt)`);
  }
  if (!watchedMetaDesc || watchedMetaDesc.length < 50) {
    issues.push(`Meta Description Google curta (${watchedMetaDesc.length}/50 crt)`);
  }
  if (!watchedModelId) issues.push("ID do Modelo ausente");
  if (!watchedColor) issues.push("Cor do anúncio ausente");

  const isElite = issues.length === 0;
  const qualityScore = Math.max(0, Math.round(((6 - issues.length) / 6) * 100));

  // Limpeza de glows após alguns segundos
  useEffect(() => {
    if (aiGlowFields.size > 0) {
      const timer = setTimeout(() => setAiGlowFields(new Set()), 4000);
      return () => clearTimeout(timer);
    }
  }, [aiGlowFields]);

  useImperativeHandle(ref, () => ({
    setValuesFromAI: (data: AIProductAnalysis) => {
      console.log("[ProductForm] Criando snapshot para rollback...");
      setSnapshot(getValues()); 
      
      const newGlow = new Set(['name', 'category', 'price', 'description', 'seo.metaDescription']);
      setAiGlowFields(newGlow);

      setValue('name', data.title, { shouldDirty: true });
      setValue('category', data.category, { shouldDirty: true });
      setValue('price', data.suggestedPrice, { shouldDirty: true });
      setValue('description', data.luxuryDescription, { shouldDirty: true });
      setValue('imageUrl', data.imageUrl || '/hero-preta.avif', { shouldDirty: true });
      setValue('slug', data.title.toLowerCase().replace(/ /g, '-'), { shouldDirty: true });
      
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
      setValue('seo.metaDescription', `Equipamento premium Hooke: ${data.title}. Design de alto padrão em algodão robusto com caimento impecável.`, { shouldDirty: true });
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

  // Motor Semântico Elite Local (Em português robusto, sem estrangeirismos)
  const handleSemanticRefine = () => {
    const name = getValues('name');
    const category = getValues('category') || '';

    if (!name || name.trim().length < 2) {
      toast.error("Preencha a Designação (Nome) do produto antes de refinar.");
      return;
    }

    setSnapshot(getValues());
    const glow = new Set(['description', 'seo.metaDescription']);
    setAiGlowFields(glow);

    let refinedDesc = "";
    let refinedMeta = "";

    const cleanCategory = category.toLowerCase();
    const cleanName = name.toLowerCase();

    if (cleanCategory.includes('conjunto') || cleanName.includes('conjunto') || cleanName.includes('viscose')) {
      refinedDesc = `Conjunto de alta costura contemporânea desenvolvido em viscose nobre de alta gramatura, proporcionando caimento fluido impecável, toque frio incomparável e excelente conforto térmico. Composto por peças minimalistas de design atemporal e costuras internas reforçadas em viés, é o equipamento perfeito que combina sofisticação brutalista e máxima usabilidade diária.`;
      refinedMeta = `Compre o ${name} Hooke. Conjunto contemporâneo em tecido nobre com toque frio e caimento fluido extremamente sofisticado.`;
    } else if (cleanCategory.includes('oversized') || cleanCategory.includes('camiseta') || cleanName.includes('camiseta')) {
      refinedDesc = `Camiseta de caimento estruturado e amplo desenvolvida em algodão nobre de gramatura robusta de 260g, garantindo conforto térmico ideal e caimento impecável. Possui gola encorpada de 3cm de costuras reforçadas que não deforma com o uso e etiqueta em alta definição aplicada na barra como assinatura visual. Uma peça essencial de apelo minimalista e máxima longevidade.`;
      refinedMeta = `Compre a ${name} Hooke. Camiseta de algodão premium de alta gramatura e caimento impecável. Conforto e sofisticação minimalista.`;
    } else if (cleanCategory.includes('regata') || cleanName.includes('regata')) {
      refinedDesc = `Regata desenvolvida em malha de algodão premium com toque aveludado e caimento anatômico perfeito. Possui costuras duplas e acabamento em viés de alta qualidade para máximo conforto durante o uso. Apresenta assinatura sutil e design contemporâneo focado na alta durabilidade e estilo minimalista elegante.`;
      refinedMeta = `Compre a ${name} Hooke. Regata premium de caimento anatômico e tecido extremamente macio. Durabilidade e elegância no dia a dia.`;
    } else {
      refinedDesc = `Peça exclusiva da coleção Hooke, produzida a partir de fibras nobres selecionadas com toque de alto padrão. O design apresenta linhas limpas e estrutura contemporânea com acabamentos internos e costuras reforçadas em viés. Uma expressão pura de sofisticação essencial que valoriza o caimento natural no corpo.`;
      refinedMeta = `Equipamento Premium Hooke: ${name}. Tecido nobre de caimento impecável, toque suave e acabamento de altíssimo nível.`;
    }

    setValue('description', refinedDesc, { shouldDirty: true });
    setValue('seo.metaDescription', refinedMeta, { shouldDirty: true });
    setValue('seo.altText', name, { shouldDirty: true });

    // Auto-preencher galeria se vazia
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

    toast.success("Descrições refinadas com sucesso puramente em português!");
  };

  const handleQuickStockFill = (amount: number) => {
    if (watchedSizes.length === 0) {
      toast.warning("Selecione pelo menos um tamanho na grade primeiro.");
      return;
    }
    watchedSizes.forEach((size) => {
      setValue(`stock.${size}`, amount, { shouldDirty: true });
    });
    toast.success(`Estoque em lote (${amount} unidades) injetado com sucesso!`);
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
    const colorVal = data.color || '';
    const modelIdVal = (data.modelId || '').trim().toUpperCase();
    
    // Se o ID foi preenchido (gerado ou customizado manualmente), nós priorizamos!
    let generatedId = (data.id || '').trim().toUpperCase();
    if (!generatedId && modelIdVal && colorVal) {
      const colorSigla = getColorCode(colorVal);
      generatedId = `${modelIdVal}-${colorSigla}`;
    }
    if (!generatedId) {
      generatedId = `PROD-${Date.now()}`;
    }
    
    let generatedSlug = (data.slug || '').trim().toLowerCase();
    if (!generatedSlug) {
      generatedSlug = generatedId.toLowerCase();
    }
    
    // Coleta blindada e infalível diretamente do getValues()
    const selectedSizes = getValues("sizes") || [];
    const currentStock = getValues("stock") || {};

    // Gerar SKUs por tamanho baseados no ID final de verdade
    const generatedSkus: Record<string, string> = {};
    if (selectedSizes.length > 0) {
      selectedSizes.forEach((size: string) => {
        generatedSkus[size] = `${generatedId}-${size}`;
      });
    }

    // Filtrar estoque órfão e calcular total de unidades
    const filteredStock: Record<string, number> = {};
    let totalStock = 0;
    selectedSizes.forEach((size: string) => {
      const qty = parseInt(String(currentStock[size] ?? 0), 10) || 0;
      filteredStock[size] = qty;
      totalStock += qty;
    });

    try {
      const finalData = {
        ...data,
        id: generatedId,
        slug: generatedSlug,
        sizes: selectedSizes,
        skus: generatedSkus,
        stock: filteredStock,
        totalStock: totalStock,
        isActive: true,
      };

      if (externalOnSubmit) {
        await (externalOnSubmit as any)(finalData);
        return;
      }

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
    toast.error("Validação falhou! Corrija os campos obrigatórios destacados nas abas.");
    
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

  const glowStyles = "ring-2 ring-amber-400/50 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-1000";

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)] w-full gap-8 relative select-none">
      
      {/* IMPRESSÃO DE ETIQUETA - PRINT CSS DINÂMICO */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-tag, #printable-tag * {
            visibility: visible;
          }
          #printable-tag {
            position: absolute;
            left: 50%;
            top: 10%;
            transform: translateX(-50%);
            width: 70mm !important;
            height: 100mm !important;
            border: 2px solid black !important;
            padding: 20px !important;
            background: white !important;
            box-shadow: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* ROLLBACK FLOATING BANNER */}
      <AnimatePresence>
        {snapshot && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[-50px] left-0 right-0 z-50 flex items-center justify-between p-4 bg-amber-50 border-2 border-amber-200 text-amber-900 shadow-sharp"
          >
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-amber-600 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest">Estado original salvo antes da refinação semântica.</p>
            </div>
            <button 
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-2 px-4 py-2 bg-amber-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-black transition-colors"
            >
              <Undo2 size={14} /> Desfazer Refinação
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP 2px QUALITY PROGRESS INDICATOR */}
      <div className="absolute top-[-16px] left-0 right-0 h-1 bg-zinc-200">
        <div 
          className="h-full bg-black transition-all duration-700 ease-out" 
          style={{ width: `${qualityScore}%`, backgroundColor: qualityScore === 100 ? '#10b981' : '#000000' }}
        />
      </div>

      {/* COLUNA ESQUERDA: O ATELIER (FORMULÁRIO POR ETAPAS) */}
      <div className="w-full lg:w-[55%] bg-white border border-black/10 flex flex-col justify-between shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
        <div>
          {/* ABAS OPERACIONAIS BRUTALISTAS */}
          <div className="flex border-b border-black/10 bg-zinc-50 select-none">
            <button 
              type="button"
              onClick={() => setActiveTab('identidade')}
              className={`flex-1 py-4 px-2 text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border-r border-black/5 transition-all ${
                activeTab === 'identidade' ? 'bg-white border-b-2 border-b-black text-black' : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <LayoutGrid size={12} />
              Identidade
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('grade')}
              className={`flex-1 py-4 px-2 text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border-r border-black/5 transition-all ${
                activeTab === 'grade' ? 'bg-white border-b-2 border-b-black text-black' : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <Package size={12} />
              Grade & Estoque
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('midia')}
              className={`flex-1 py-4 px-2 text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border-r border-black/5 transition-all ${
                activeTab === 'midia' ? 'bg-white border-b-2 border-b-black text-black' : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <Upload size={12} />
              Mídia
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`flex-1 py-4 px-2 text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'seo' ? 'bg-white border-b-2 border-b-black text-black' : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <FileText size={12} />
              Editorial & SEO
            </button>
          </div>

          {/* FORMULÁRIO */}
          <form id="product-form" onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="p-8 md:p-10 space-y-8">
            <input type="hidden" {...register('imageUrl')} />
            <input type="hidden" {...register('isHeroBanner')} />
            <input type="hidden" {...register('heroImageUrl')} />
            
            <AnimatePresence mode="wait">
              {activeTab === 'identidade' && (
                <motion.div
                  key="identidade"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* MODEL ID */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">ID do Modelo (Model ID)</label>
                      <input 
                        type="text" 
                        placeholder="Ex: CAM-VINT-FUSCA" 
                        {...register('modelId')}
                        className={`w-full h-11 border border-zinc-200 focus:border-black px-4 font-mono text-xs focus:outline-none transition-colors uppercase ${errors.modelId ? 'border-red-500' : ''}`}
                      />
                      {errors.modelId && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.modelId.message}</p>}
                    </div>

                    {/* COR */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Cor do Anúncio</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Preta" 
                        {...register('color')}
                        className={`w-full h-11 border border-zinc-200 focus:border-black px-4 font-sans text-xs focus:outline-none transition-colors ${errors.color ? 'border-red-500' : ''}`}
                      />
                      {errors.color && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.color.message}</p>}
                    </div>
                  </div>

                  {/* SKU BASE EDITÁVEL */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">SKU Base (ID Físico)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: CAM-VINT-FUSCA-PTO" 
                      {...register('id')}
                      onChange={(e) => {
                        setIsIdManuallyEdited(true);
                        const val = e.target.value.toUpperCase().replace(/\s/g, '');
                        setValue('id', val, { shouldDirty: true });
                        setValue('slug', val.toLowerCase(), { shouldDirty: true });
                      }}
                      className={`w-full h-11 border border-zinc-200 focus:border-black px-4 font-mono text-xs focus:outline-none transition-colors uppercase ${errors.id ? 'border-red-500' : ''}`}
                    />
                    {errors.id && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.id.message}</p>}
                    <p className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest leading-normal">
                      ID Físico único do produto. É gerado reativamente a partir de Model ID e Cor do anúncio, mas permite qualquer edição manual pelo lojista.
                    </p>
                  </div>

                  {/* NOME */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Designação (Nome do Produto)</label>
                    <motion.div animate={aiGlowFields.has('name') ? { scale: [1, 1.01, 1] } : {}}>
                      <input 
                        type="text" 
                        placeholder="Ex: Camiseta Vintage Fusca" 
                        {...register('name')}
                        className={`w-full h-11 border border-zinc-200 focus:border-black px-4 text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors ${
                          errors.name ? 'border-red-500' : ''
                        } ${aiGlowFields.has('name') ? glowStyles : ''}`}
                      />
                    </motion.div>
                    {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PREÇO */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Valor em BRL</label>
                      <motion.div animate={aiGlowFields.has('price') ? { scale: [1, 1.01, 1] } : {}}>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="199.90" 
                          {...register('price', { valueAsNumber: true })}
                          className={`w-full h-11 border border-zinc-200 focus:border-black px-4 font-mono text-xs focus:outline-none transition-colors ${
                            errors.price ? 'border-red-500' : ''
                          } ${aiGlowFields.has('price') ? glowStyles : ''}`}
                        />
                      </motion.div>
                      {errors.price && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.price.message}</p>}
                    </div>

                    {/* DEPARTAMENTO */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Departamento</label>
                      <select 
                        {...register('department')}
                        className="w-full h-11 border border-zinc-200 focus:border-black px-4 font-mono text-xs focus:outline-none transition-colors bg-white uppercase tracking-widest"
                      >
                        <option value={Department.MASCULINO}>Masculino</option>
                        <option value={Department.FEMININO}>Feminino</option>
                        <option value={Department.UNISSEX}>Unissex</option>
                      </select>
                    </div>
                  </div>

                  {/* CATEGORIA */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Categoria</label>
                    <select 
                      {...register('category')}
                      className={`w-full h-11 border border-zinc-200 focus:border-black px-4 font-mono text-xs focus:outline-none transition-colors bg-white uppercase tracking-widest ${
                        errors.category ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Selecione...</option>
                      {VALID_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.category.message}</p>}
                  </div>

                  {/* SLUG */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Slug (URL)</label>
                    <input 
                      type="text" 
                      placeholder="slug-do-produto" 
                      {...register('slug')}
                      className="w-full h-11 border border-zinc-200 focus:border-black px-4 font-mono text-xs focus:outline-none transition-colors bg-zinc-50"
                    />
                  </div>

                  {/* DETALHES DE TECIDO E MODELAGEM */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* TECIDO / COMPOSIÇÃO */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Tecido / Composição</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Viscose nobre de alta gramatura" 
                        {...register('details.fabric')}
                        className="w-full h-11 border border-zinc-200 focus:border-black px-4 font-sans text-xs focus:outline-none transition-colors uppercase tracking-wider font-bold"
                      />
                    </div>

                    {/* CORTE / MODELAGEM */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Corte / Modelagem</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Relaxed Elegant Fit" 
                        {...register('details.model')}
                        className="w-full h-11 border border-zinc-200 focus:border-black px-4 font-sans text-xs focus:outline-none transition-colors uppercase tracking-wider font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('grade')}
                      className="px-6 py-3 bg-black hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"
                    >
                      Grade & Estoque <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'grade' && (
                <motion.div
                  key="grade"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* GRADE DE TAMANHOS */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Tamanhos Disponíveis na Grade</label>
                    <div className="flex flex-wrap gap-2">
                      {(watchedDepartment === Department.FEMININO ? SIZES_FEM : SIZES_MASC).map(size => {
                        const isSelected = watchedSizes.includes(size);
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
                            className={`w-12 h-12 text-xs font-black border transition-all ${
                              isSelected
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-zinc-200 hover:border-black'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                    {errors.sizes && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.sizes.message}</p>}
                  </div>

                  {/* ESTOQUE GRANULAR OTIMIZADO PARA MOBILE */}
                  {watchedSizes.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-black/5 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-wider">Inventário de Unidades</h4>
                          <p className="text-[8px] text-zinc-400 uppercase tracking-widest font-mono font-bold">Ajustes tácteis confortáveis</p>
                        </div>

                        {/* DISTRIBUIÇÃO RÁPIDA */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-mono font-black uppercase text-zinc-400 mr-1.5">Preencher Grade:</span>
                          <button 
                            type="button"
                            onClick={() => handleQuickStockFill(5)}
                            className="px-3 py-1.5 border border-zinc-200 hover:border-black text-[9px] font-mono bg-white active:bg-zinc-50"
                          >
                            +5 un
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleQuickStockFill(10)}
                            className="px-3 py-1.5 border border-zinc-200 hover:border-black text-[9px] font-mono bg-white active:bg-zinc-50"
                          >
                            +10 un
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {watchedSizes.map(size => {
                          const currentQty = watchedStock[size] ?? 0;
                          return (
                            <div key={size} className="flex items-center justify-between border border-zinc-200 p-3 bg-zinc-50/50">
                              <span className="text-xs font-mono font-black w-8 text-center">{size}</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const val = Math.max(0, currentQty - 1);
                                    setValue(`stock.${size}`, val, { shouldDirty: true });
                                  }}
                                  className="w-12 h-12 flex items-center justify-center border border-zinc-200 bg-white hover:border-black font-black text-sm active:bg-zinc-150 transition-colors"
                                >
                                  -
                                </button>
                                <input 
                                  type="number" 
                                  min="0"
                                  value={currentQty}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setValue(`stock.${size}`, Math.max(0, val), { shouldDirty: true });
                                  }}
                                  className="w-16 h-12 border border-zinc-200 text-center font-mono text-xs focus:outline-none bg-white text-black"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const val = currentQty + 1;
                                    setValue(`stock.${size}`, val, { shouldDirty: true });
                                  }}
                                  className="w-12 h-12 flex items-center justify-center border border-zinc-200 bg-white hover:border-black font-black text-sm active:bg-zinc-150 transition-colors"
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

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('identidade')}
                      className="px-5 py-3 border border-zinc-200 hover:border-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('midia')}
                      className="px-6 py-3 bg-black hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"
                    >
                      Mídia <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'midia' && (
                <motion.div
                  key="midia"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* ESTÚDIO DE IMAGENS */}
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Estúdio de Imagens (Galeria)</label>
                    
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <div className="flex-1 w-full flex gap-2">
                        <input 
                          type="text" 
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Cole a URL da foto ou arquivo aqui..."
                          className="flex-1 h-11 px-4 border border-zinc-200 text-xs font-mono focus:border-black focus:outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={addImage}
                          className="px-5 py-3 bg-black text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
                        >
                          <Plus size={12} /> Injetar
                        </button>
                      </div>
                      
                      <div className="w-full sm:w-auto flex items-center gap-2">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleCloudinaryUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full sm:w-auto px-5 py-3 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"
                        >
                          {isUploading ? (
                            <>
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Carregando...
                            </>
                          ) : (
                            <>
                              <Upload size={12} />
                              Carregar Foto (Cloudinary)
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {errors.images && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.images.message}</p>}

                    {watchedImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {watchedImages.map((url, i) => {
                          const isHero = watchedIsHero && watchedHeroUrl === url;
                          return (
                            <div 
                              key={i} 
                              className={`relative group aspect-[3/4] border bg-white overflow-hidden transition-all ${
                                isHero ? "border-amber-400 ring-2 ring-amber-400/30" : "border-zinc-200"
                              }`}
                            >
                              <img src={url} alt={`Galeria ${i+1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isHero) {
                                      setValue('isHeroBanner', false, { shouldDirty: true });
                                      setValue('heroImageUrl', '', { shouldDirty: true });
                                    } else {
                                      setValue('isHeroBanner', true, { shouldDirty: true });
                                      setValue('heroImageUrl', url, { shouldDirty: true });
                                    }
                                  }}
                                  className={`p-1.5 border border-black text-white transition-colors ${
                                    isHero ? "bg-amber-500" : "bg-black/85 hover:bg-black"
                                  }`}
                                  title="Marcar como Hero Banner Home"
                                >
                                  <Star size={12} className={isHero ? "fill-white" : ""} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeImage(i)}
                                  className="p-1.5 bg-red-600 border border-black hover:bg-red-700 text-white"
                                  title="Excluir do Arsenal"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <span className="absolute bottom-1 left-1 bg-black text-white text-[7px] font-black px-1.5 uppercase tracking-widest">
                                {i === 0 ? "CAPA" : `FOTO ${i+1}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-zinc-400 text-[9px] uppercase tracking-widest font-black border border-dashed border-zinc-200 bg-zinc-50/30">
                        Galeria de fotos vazia
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('grade')}
                      className="px-5 py-3 border border-zinc-200 hover:border-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('seo')}
                      className="px-6 py-3 bg-black hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"
                    >
                      Editorial & SEO <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'seo' && (
                <motion.div
                  key="seo"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* NARRATIVA PREMIUM */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Narrativa Premium (Descrição)</label>
                      <span className="text-[8px] font-mono text-zinc-400">{watchedDescription.length}/100 crt min</span>
                    </div>
                    <motion.div animate={aiGlowFields.has('description') ? { scale: [1, 1.01, 1] } : {}}>
                      <textarea 
                        {...register('description')}
                        className={`w-full h-32 p-4 border border-zinc-200 focus:border-black text-xs font-mono focus:outline-none transition-colors leading-relaxed ${
                          errors.description ? 'border-red-500' : ''
                        } ${aiGlowFields.has('description') ? glowStyles : ''}`}
                        placeholder="Descreva o caimento, as costuras refinadas e a gramatura em português elegante..."
                      />
                    </motion.div>
                    {errors.description && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.description.message}</p>}
                  </div>

                  {/* GOOGLE META DESCRIPTION */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Google Meta Description (SEO)</label>
                      <span className="text-[8px] font-mono text-zinc-400">{watchedMetaDesc.length}/50 crt min</span>
                    </div>
                    <motion.div animate={aiGlowFields.has('seo.metaDescription') ? { scale: [1, 1.01, 1] } : {}}>
                      <textarea 
                        {...register('seo.metaDescription')}
                        className={`w-full h-20 p-4 border border-zinc-200 focus:border-black text-xs font-mono focus:outline-none transition-colors leading-relaxed ${
                          aiGlowFields.has('seo.metaDescription') ? glowStyles : ''
                        }`}
                        placeholder="Resumo chamativo em português de alto padrão para buscas orgânicas no Google..."
                      />
                    </motion.div>
                  </div>

                  {/* REFINADOR SEMÂNTICO LOCAL */}
                  <div className="p-4 border border-black/5 bg-zinc-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Sparkles size={14} className="text-amber-500" />
                      <span className="text-[9px] font-black uppercase tracking-wider">Refinar Editorial & SEO em Português Puro</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSemanticRefine}
                      className="px-4 py-2 border border-black bg-amber-100 hover:bg-amber-200 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles size={10} /> Executar IA
                    </button>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('midia')}
                      className="px-5 py-3 border border-zinc-200 hover:border-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                      Voltar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* RODAPÉ DO FORMULÁRIO BRUTALISTA COM BOTAO DE SUBMIT */}
        <div className="p-8 border-t border-black/10 bg-white">
          <Button 
            type="submit"
            form="product-form"
            variant="brutalist" 
            className="w-full py-7 text-xs font-black uppercase tracking-[0.4em] bg-black text-white hover:bg-zinc-900 disabled:opacity-50 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Sincronizando no Arsenal...</span>
            ) : (
              <>
                <ShieldCheck size={15} />
                Publicar no Catálogo
              </>
            )}
          </Button>
        </div>
      </div>

      {/* COLUNA DIREITA: A VITRINE (LIVE PREVIEW PERSISTENTE & ETIQUETADOR COM QR CODE) */}
      <div className="w-full lg:w-[45%] bg-[#f4f4f5] border border-black/10 p-8 flex flex-col justify-between shadow-[4px_4px_0px_rgba(0,0,0,0.05)] overflow-y-auto max-h-[calc(100vh-140px)] select-none">
        <div className="space-y-6">
          
          {/* ABAS DO PREVIEW */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-4">
            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">VITRINE CONCEITUAL</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setPreviewMode('vitrine')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                  previewMode === 'vitrine' ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-200 hover:border-black'
                }`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('detalhes')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                  previewMode === 'detalhes' ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-200 hover:border-black'
                }`}
              >
                PDP
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('seo')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                  previewMode === 'seo' ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-200 hover:border-black'
                }`}
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('etiqueta')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-1 ${
                  previewMode === 'etiqueta' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-black border-zinc-200 hover:border-black'
                }`}
              >
                <Zap size={9} /> Etiqueta
              </button>
            </div>
          </div>

          {/* RENDERIZADOR DOS PREVIEWS */}
          <div className="flex justify-center items-center py-6 min-h-[420px]">
            <AnimatePresence mode="wait">
              
              {/* CARD PREVIEW */}
              {previewMode === 'vitrine' && (
                <motion.div
                  key="vitrine-prev"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-[280px] bg-white border-2 border-black p-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-3"
                >
                  <div className="aspect-[3/4] bg-zinc-150 border border-black overflow-hidden relative">
                    <img 
                      src={watchedImageUrl} 
                      alt="Capa Preview" 
                      className="w-full h-full object-cover grayscale contrast-[1.1]"
                    />
                    {watchedCategory && (
                      <span className="absolute top-2 left-2 bg-black text-white text-[7px] font-black px-2 py-0.5 tracking-widest uppercase">
                        {watchedCategory}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-black tracking-tight uppercase leading-none truncate">
                      {watchedName || 'DESIGN DESIGNATION'}
                    </h4>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      CROMO: {watchedColor || 'COR'}
                    </p>
                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-zinc-100">
                      <span className="text-[11px] font-black uppercase tracking-wider">
                        {watchedPrice ? `R$ ${parseFloat(watchedPrice.toString()).toFixed(2)}` : 'R$ 0.00'}
                      </span>
                      <span className="text-[7px] font-mono text-zinc-400">HOOKE</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PDP PREVIEW */}
              {previewMode === 'detalhes' && (
                <motion.div
                  key="detalhes-prev"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="w-full bg-white border border-black p-6 flex flex-col md:flex-row gap-5 max-w-[520px] shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
                >
                  <div className="w-full md:w-1/2 aspect-[3/4] bg-zinc-100 border border-zinc-200 overflow-hidden">
                    <img 
                      src={watchedImageUrl} 
                      alt="Capa PDP Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col justify-between gap-4">
                    <div className="space-y-3.5">
                      <div className="space-y-0.5">
                        <p className="text-[7px] font-mono font-bold text-zinc-400 uppercase tracking-widest leading-none">
                          {watchedDepartment} // {watchedCategory || 'Coleção'}
                        </p>
                        <h3 className="text-sm font-black uppercase tracking-tight leading-tight">
                          {watchedName || 'EQUIPAMENTO HOOKE'}
                        </h3>
                        <p className="text-[9px] font-mono text-zinc-500">
                          CROMO: {watchedColor || 'Não definido'}
                        </p>
                      </div>

                      <div className="text-xs font-black">
                        {watchedPrice ? `R$ ${parseFloat(watchedPrice.toString()).toFixed(2)}` : 'R$ 0.00'}
                      </div>

                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Tamanho Selecionado</p>
                        <div className="flex flex-wrap gap-1">
                          {watchedSizes.length > 0 ? watchedSizes.map(s => (
                            <span key={s} className="w-6 h-6 text-[8px] font-mono font-black flex items-center justify-center border border-black bg-white">
                              {s}
                            </span>
                          )) : (
                            <span className="text-[8px] font-mono text-red-500 font-bold uppercase tracking-widest">Nenhum</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Editorial</p>
                        <p className="text-[8px] font-mono text-zinc-500 leading-normal line-clamp-4">
                          {watchedDescription || 'Aguardando preenchimento da narrativa conceitual em português brasileiro no painel.'}
                        </p>
                      </div>
                    </div>
                    
                    <button type="button" disabled className="w-full py-2.5 bg-black text-white text-[8px] font-black uppercase tracking-widest border border-black mt-2">
                      Adicionar à Sacola
                    </button>
                  </div>
                </motion.div>
              )}

              {/* GOOGLE PREVIEW */}
              {previewMode === 'seo' && (
                <motion.div
                  key="seo-prev"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-[420px] bg-white border border-zinc-200 p-5 flex flex-col gap-1 font-sans shadow-[2px_2px_10px_rgba(0,0,0,0.03)]"
                >
                  <div className="text-[10px] text-zinc-500 font-mono tracking-widest truncate leading-none">
                    https://usehooke.com.br/produto/{computedSku.toLowerCase() || 'slug-do-equipamento'}
                  </div>
                  <h3 className="text-sm text-[#1a0dab] font-sans font-medium hover:underline leading-tight mt-0.5">
                    {watchedName || 'Nova Peça'} • Arsenal Hooke Elite
                  </h3>
                  <p className="text-[11px] text-[#4d5156] font-normal leading-normal mt-0.5">
                    {watchedMetaDesc || 'Aguardando preenchimento do resumo editorial de SEO no painel. Otimize o CTR visualizando o comportamento orgânico da busca em tempo real.'}
                  </p>
                </motion.div>
              )}

              {/* ETIQUETA ELITE BRUTALISTA COM QR CODE */}
              {previewMode === 'etiqueta' && (
                <motion.div
                  key="etiqueta-prev"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-[280px] bg-white border-2 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col gap-5 items-center print:border-none print:shadow-none print:p-0"
                  id="printable-tag"
                >
                  {/* Logotipo da Hooke */}
                  <div className="text-center space-y-0.5">
                    <h3 className="text-xs font-black tracking-[0.45em] uppercase leading-none">HOOKE</h3>
                    <p className="text-[6.5px] font-mono tracking-widest text-zinc-400 font-bold">ATELIER CONCEITUAL</p>
                  </div>

                  {/* Divisor brutalista */}
                  <div className="w-full border-t border-dashed border-black" />

                  {/* Detalhes do Produto */}
                  <div className="w-full text-center space-y-0.5">
                    <p className="text-[8.5px] font-black uppercase tracking-wider truncate px-1">{watchedName || 'Nome do Anúncio'}</p>
                    <p className="text-[9.5px] font-mono font-bold tracking-widest text-zinc-500">{computedSku || 'AGUARDANDO-SKU'}</p>
                    <p className="text-sm font-black mt-1.5">{watchedPrice ? `R$ ${parseFloat(watchedPrice.toString()).toFixed(2)}` : 'R$ 0.00'}</p>
                  </div>

                  {/* QR Code Real Gerado */}
                  <div className="p-2 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
                    {computedSku ? (
                      <QRCodeSVG value={computedSku} size={110} level="H" includeMargin={false} />
                    ) : (
                      <div className="w-[110px] h-[110px] bg-zinc-50 flex items-center justify-center text-center p-2 text-[7.5px] font-mono uppercase text-zinc-400">
                        Preencha ID e Cor
                      </div>
                    )}
                  </div>

                  {/* Footer de Instrução */}
                  <div className="text-center space-y-0.5 pt-1">
                    <p className="text-[6.5px] font-mono font-bold uppercase tracking-widest text-black flex items-center justify-center gap-1 animate-pulse">
                      <Zap size={7} className="fill-black" /> Leitura Imediata no PDV
                    </p>
                    <p className="text-[5.5px] text-zinc-400 uppercase tracking-widest leading-none">Aponte a câmera do celular no balcão</p>
                  </div>

                  {/* Botão de Impressão */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!computedSku) {
                        toast.error("Preencha o Model ID e a Cor para gerar o SKU antes de imprimir.");
                        return;
                      }
                      window.print();
                    }}
                    className="w-full py-2 bg-black hover:bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all print:hidden"
                  >
                    Imprimir Etiqueta
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* BOX DE DIRETRIZES PENDENTES */}
        <div className="bg-white p-5 border border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">MÉTRICAS DE QUALIDADE PENDENTES ({issues.length})</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {issues.length > 0 ? issues.slice(0, 3).map((issue, idx) => (
                <span key={idx} className="text-[8px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 uppercase tracking-wide">
                  ⚠ {issue}
                </span>
              )) : (
                <span className="text-[8px] font-mono font-bold bg-green-50 text-green-800 border border-green-200 px-2 py-0.5 uppercase tracking-wide flex items-center gap-1">
                  ✓ PADRÃO ELITE CONCLUÍDO
                </span>
              )}
              {issues.length > 3 && (
                <span className="text-[8px] font-mono font-bold bg-zinc-100 text-zinc-500 border border-zinc-200 px-2 py-0.5 uppercase">
                  +{issues.length - 3} itens
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-[9px] font-mono font-bold uppercase text-zinc-400 block tracking-widest">Nível de Conversão</span>
            <span className={`text-sm font-black font-mono ${qualityScore === 100 ? 'text-emerald-500' : 'text-black'}`}>
              {qualityScore}%
            </span>
          </div>
        </div>

      </div>

    </div>
  );
});

ProductForm.displayName = "ProductForm";

export { ProductForm };
