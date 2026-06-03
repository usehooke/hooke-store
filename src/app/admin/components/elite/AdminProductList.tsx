"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { 
  Eye, EyeOff, Edit3, Trash2, 
  Search, Plus, Copy,
  CheckCircle2, RefreshCw,
  LayoutList, Grid3X3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { QualityBadge } from "./QualityBadge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LookbookPDF } from "@/features/admin/components/pdf/LookbookPDF";
import { createLookbook } from "@/actions/lookbook";
import { toast } from "sonner";
import { StoryComposer } from "@/features/admin/produtos/components/StoryComposer";

interface AdminProductListProps {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onSync: (product: Product) => void;
}

export function AdminProductList({ 
  products, 
  isLoading = false,
  onEdit, 
  onDelete, 
  onToggleActive, 
  onSync 
}: AdminProductListProps) {
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState<"todos" | "masculino" | "feminino">("todos");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Seleção em lote para o Lookbook
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleGenerateLink = async () => {
    if (selectedIds.size === 0) return;
    setIsGeneratingLink(true);
    const result = await createLookbook(Array.from(selectedIds));
    setIsGeneratingLink(false);
    
    if (result.success) {
      toast.success("Lookbook gerado!");
      const url = `${window.location.origin}/lookbook/${result.id}`;
      navigator.clipboard.writeText(url);
      toast.info("Link copiado para a área de transferência.");
    } else {
      toast.error(result.error);
    }
  };

  const selectedProductsData = useMemo(() => {
    return products.filter(p => selectedIds.has(p.id));
  }, [products, selectedIds]);

  // Filtragem local instantânea super-otimizada com useMemo (0ms de latência)
  const filteredProducts = useMemo(() => {
    const term = searchInput.toLowerCase().trim();
    return products.filter(p => {
      const matchesSearch = !term || 
                           p.name.toLowerCase().includes(term) || 
                           p.id.toLowerCase().includes(term) ||
                           (p.category && p.category.toLowerCase().includes(term));
      const matchesTab = activeTab === "todos" || p.department === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [products, searchInput, activeTab]);

  const SkeletonItem = ({ mode }: { mode: "list" | "grid" }) => (
    <div className={`bg-white border border-black/[0.03] animate-pulse ${
      mode === "grid" ? "aspect-[3/4]" : "h-20 flex items-center px-6 gap-6"
    }`}>
      {mode === "grid" ? (
        <div className="w-full h-full bg-zinc-50" />
      ) : (
        <>
          <div className="w-12 h-16 bg-zinc-50" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-zinc-50" />
            <div className="h-2 w-1/4 bg-zinc-50" />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Controles Superiores - V3.1 High Efficiency */}
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between pb-8">
        <div className="flex bg-zinc-100 p-1 border border-black/[0.05]">
          {(["todos", "masculino", "feminino"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                activeTab === tab 
                ? "bg-white text-black shadow-sm" 
                : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          {/* Busca Instantânea Real-Time */}
          <div className="relative flex-grow lg:w-80">
            <input
              type="text"
              placeholder="Buscar por nome ou SKU..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-6 pr-12 py-3 bg-zinc-50 border border-black/[0.05] text-xs font-bold focus:outline-none focus:bg-white focus:border-black transition-all uppercase tracking-widest placeholder:text-zinc-300"
            />
            <div className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-zinc-300 pointer-events-none">
              <Search size={18} />
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-200 mx-2" />

          {/* Toggle View Mode */}
          <div className="flex bg-zinc-100 p-1 border border-black/[0.05]">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-all ${viewMode === "list" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
              title="Modo Lista"
            >
              <LayoutList size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-all ${viewMode === "grid" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
              title="Modo Grade"
            >
              <Grid3X3 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* AVISO DE USABILIDADE - AÇÕES EM LOTE ELITE */}
      <div className="p-5 border-2 border-dashed border-black bg-zinc-50 flex items-center justify-between gap-4 rounded-none">
        <div className="flex items-center gap-3">
          <span className="bg-black text-white font-mono text-[9px] font-black px-2.5 py-1.5 uppercase tracking-wider shrink-0 shadow-[2px_2px_0px_#000] border border-white">
            Protocolo Lote
          </span>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
            Selecione produtos abaixo usando as <strong className="text-black underline underline-offset-2">caixas de seleção (checkboxes)</strong> nos cards para ativar a barra preta de ações em lote e liberar os botões <strong className="text-black font-mono">[ GERAR WEB STORY ]</strong> e <strong className="text-black">1. GERAR LINK INTERATIVO</strong>.
          </p>
        </div>
      </div>

      {/* BARRA DE AÇÕES EM LOTE (LOOKBOOK) */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-black text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)] rounded-none"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white text-black font-black w-6 h-6 flex items-center justify-center text-[10px]">
                {selectedIds.size}
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Selecionados para Lookbook</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setIsComposerOpen(true)}
                className="px-4 py-2 bg-black border border-white text-white font-mono text-[10px] uppercase hover:bg-white hover:text-black transition-all"
              >
                [ GERAR WEB STORY ]
              </button>

              <button 
                onClick={handleGenerateLink}
                disabled={isGeneratingLink}
                className="px-4 py-2 bg-white text-black text-[10px] font-black tracking-widest uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {isGeneratingLink ? "GERANDO..." : "1. GERAR LINK INTERATIVO"}
              </button>
              
              <PDFDownloadLink
                document={<LookbookPDF products={selectedProductsData} />}
                fileName={`Hooke_Lookbook_${new Date().getTime()}.pdf`}
                className="px-4 py-2 bg-zinc-800 text-white border border-white/20 text-[10px] font-black tracking-widest uppercase hover:bg-zinc-700 transition-colors"
              >
                {/* @ts-ignore */}
                {({ loading }) => (loading ? "PREPARANDO PDF..." : "2. EXPORTAR PDF")}
              </PDFDownloadLink>

              <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-[10px] uppercase font-bold text-zinc-400 hover:text-white underline underline-offset-4">
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        /* Skeleton View */
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          : "space-y-2"
        }>
          {[...Array(6)].map((_, i) => <SkeletonItem key={i} mode={viewMode} />)}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {viewMode === "grid" ? (
            /* Modo GRID Original Modernizado */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
            >
              {filteredProducts.map((p) => {
                // 🛡️ FAIL-SAFE RENDER: Se o produto não tiver os campos mínimos, ignoramos
                if (!p || !p.id || !p.name) return null;

                try {
                  return (
                    <motion.div 
                      layout
                      key={p.id} 
                      className={`group bg-white border border-black/[0.05] flex flex-col hover:border-black/20 transition-all ${!p.isActive ? "opacity-40 grayscale" : ""}`}
                    >
                      <div onClick={() => onEdit(p)} className="relative aspect-[3/4] bg-zinc-50 overflow-hidden cursor-pointer">
                        {p.imageUrl ? (
                          <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-200"><Plus size={32} strokeWidth={1} /></div>
                        )}
                        {/* Checkbox Brutalista para Lookbook */}
                        <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(p.id)}
                            onChange={() => toggleSelect(p.id)}
                            className="w-6 h-6 border-2 border-black accent-black cursor-pointer bg-white"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                            <button onClick={(e) => { e.stopPropagation(); onToggleActive(p.id, p.isActive !== false); }} className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-black hover:scale-110 transition-transform" title="Visibilidade">{p.isActive ? <Eye size={18} /> : <EyeOff size={18} />}</button>
                            <button onClick={(e) => { e.stopPropagation(); onEdit(p); }} className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-black hover:scale-110 transition-transform" title="Editar"><Edit3 size={18} /></button>
                            <button onClick={(e) => { e.stopPropagation(); window.location.href = `/admin/produtos/novo?copyFrom=${p.id}`; }} className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-black hover:scale-110 transition-transform" title="Duplicar Modelo"><Copy size={18} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(p.id, p.name); }} className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-red-500 hover:scale-110 transition-transform" title="Excluir"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between border-t border-black/[0.05]">
                        <div>
                          <h3 className="text-[10px] font-black text-zinc-900 tracking-tight leading-tight uppercase mb-1 truncate">{p.name}</h3>
                          <p className="text-[8px] font-mono text-zinc-400 uppercase">{p.id}</p>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs font-serif text-zinc-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}</span>
                          <button onClick={() => onSync(p)} className="p-1.5 border border-black/[0.05] hover:bg-zinc-50">
                            {(p as Product & { syncStatus?: string }).syncStatus === 'synced' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <RefreshCw size={12} className={`text-zinc-300 ${(p as Product & { syncStatus?: string }).syncStatus === 'pending' ? 'animate-spin text-amber-500' : ''}`} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                } catch (e) {
                  console.error("🔥 Crash silenciado no item:", p.id, e);
                  return null;
                }
              })}
            </motion.div>
          ) : (
            /* Modo LISTA DENSA (Novo Padrão Operacional 3.1) */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-black/[0.05] bg-white divide-y divide-black/[0.03]"
            >
              {filteredProducts.map((p) => {
                if (!p || !p.id || !p.name) return null;
                
                try {
                  return (
                    <div key={p.id} className={`flex items-center p-3 gap-6 hover:bg-zinc-50 transition-colors group ${!p.isActive ? "opacity-30 grayscale" : ""}`}>
                      <div className="relative h-16 w-12 bg-zinc-50 flex-shrink-0 cursor-pointer overflow-hidden border border-black/[0.05]" onClick={() => onEdit(p)}>
                        {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform" />}
                      </div>
                      
                      {/* Checkbox Brutalista para Lookbook */}
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          className="w-5 h-5 border-2 border-black accent-black cursor-pointer bg-white"
                        />
                      </div>
                      
                      <div className="flex-grow min-w-0 cursor-pointer" onClick={() => onEdit(p)}>
                        <div className="flex items-center gap-3">
                          <h3 className="text-[11px] font-black text-black uppercase tracking-tight truncate">{p.name}</h3>
                          {p.department && (
                            <span className="text-[7px] font-bold px-1.5 py-0.5 border border-black/[0.05] bg-zinc-50 text-zinc-400 uppercase italic">
                              {p.department}
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] font-mono text-zinc-400">SKU: {p.id}</p>
                      </div>

                      <div className="w-32 text-right">
                        <span className="text-xs font-serif text-black font-bold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pr-4 border-l border-black/[0.03] pl-4 ml-4">
                        <button onClick={() => onToggleActive(p.id, p.isActive !== false)} title="Status" className="p-2 text-zinc-300 hover:text-black transition-colors">{p.isActive ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                        <button onClick={() => onEdit(p)} title="Editar" className="p-2 text-zinc-300 hover:text-black transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => window.location.href = `/admin/produtos/novo?copyFrom=${p.id}`} title="Duplicar Modelo" className="p-2 text-zinc-300 hover:text-black transition-colors"><Copy size={14} /></button>
                        <button onClick={() => onSync(p)} title="Sincronizar" className="p-2 text-zinc-300 hover:text-amber-500 transition-colors"><RefreshCw size={14} className={(p as Product & { syncStatus?: string }).syncStatus === 'pending' ? 'animate-spin' : ''} /></button>
                        <button onClick={() => onDelete(p.id, p.name)} title="Excluir" className="p-2 text-zinc-200 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                } catch (e) {
                  return null;
                }
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {filteredProducts.length === 0 && !isLoading && (
        <div className="py-32 text-center border-t border-black/[0.05] bg-zinc-50/30">
          <p className="text-[10px] font-black tracking-[0.4em] text-zinc-300 uppercase">Fim da arqueologia operacional</p>
        </div>
      )}
      <StoryComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        selectedProducts={selectedProductsData}
        onSuccess={() => {
          setSelectedIds(new Set());
        }}
      />
    </div>
  );
}
