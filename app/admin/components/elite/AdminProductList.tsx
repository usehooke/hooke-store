"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Eye, EyeOff, Edit3, Trash2, 
  Search, Plus, 
  CheckCircle2, RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { QualityBadge } from "./QualityBadge";

interface AdminProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onSync: (product: Product) => void;
}

export function AdminProductList({ 
  products, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onSync 
}: AdminProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"todos" | "masculino" | "feminino">("todos");

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "todos" || p.department === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-10">
      {/* Controles Superiores de Alta Precisão */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between pb-8">
        <div className="flex bg-zinc-100 p-1 rounded-none border border-black/[0.05]">
          {(["todos", "masculino", "feminino"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                activeTab === tab 
                ? "bg-white text-black shadow-sm" 
                : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-black/[0.05] text-xs font-bold focus:outline-none focus:ring-1 focus:ring-black transition-all rounded-none uppercase tracking-widest placeholder:text-zinc-300"
          />
        </div>
      </div>

      {/* Visual Gallery Grid - Atelier Edition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {filteredProducts.map((p) => (
          <motion.div 
            layout
            key={p.id} 
            className={`group bg-white border border-black/[0.05] flex flex-col hover:border-black/20 transition-all ${!p.isActive ? "opacity-40 grayscale" : ""}`}
          >
            {/* Image Section - Touch Target Primário */}
            <div 
              onClick={() => onEdit(p)}
              className="relative aspect-[3/4] bg-zinc-50 overflow-hidden cursor-pointer"
            >
              {p.imageUrl ? (
                <Image 
                  src={p.imageUrl} 
                  alt={p.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-200">
                  <Plus size={32} strokeWidth={1} />
                </div>
              )}
              
              {/* Quick Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 border ${
                  p.department === 'feminino' ? 'border-pink-200 text-pink-600 bg-white/90' : 'border-zinc-200 text-zinc-600 bg-white/90'
                }`}>
                  {p.department || 'Elite'}
                </span>
              </div>

              {/* Hover Actions Float Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleActive(p.id, p.isActive !== false); }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
                    title={p.isActive ? "Ocultar" : "Mostrar"}
                  >
                    {p.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
                    title="Editar"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(p.id, p.name); }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-5 flex-1 flex flex-col justify-between border-t border-black/[0.05]">
              <div>
                <h3 className="text-[10px] font-black text-zinc-900 tracking-tight leading-tight uppercase mb-1 truncate">{p.name}</h3>
                <p className="text-[8px] font-mono text-zinc-400 uppercase tracking-tighter">{p.id}</p>
              </div>
              
              <div className="mt-4 flex items-end justify-between">
                <span className="text-sm font-serif text-zinc-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                </span>
                
                <button 
                  onClick={() => onSync(p)}
                  className="p-2 border border-black/[0.05] hover:bg-zinc-50 transition-colors"
                >
                  {(p as Product & { syncStatus?: string }).syncStatus === 'synced' ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : (
                    <RefreshCw size={14} className={`text-zinc-300 ${(p as Product & { syncStatus?: string }).syncStatus === 'pending' ? 'animate-spin text-amber-500' : ''}`} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-40 text-center border-2 border-dashed border-black/[0.05] bg-zinc-50">
          <p className="text-[10px] font-black tracking-[0.4em] text-zinc-300 uppercase">Nenhum produto encontrado neste filtro</p>
        </div>
      )}
    </div>
  );
}
