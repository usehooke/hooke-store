"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Eye, EyeOff, Edit3, Trash2, 
  Search, Filter, Plus, 
  CheckCircle2, RefreshCw, AlertCircle 
} from "lucide-react";
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
    <div className="space-y-6">
      {/* Controles Superiores */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 border-b border-gray-100">
        <div className="flex bg-gray-100 p-1 rounded-none border border-gray-200">
          {(["todos", "masculino", "feminino"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${
                activeTab === tab 
                ? "bg-white text-hooke-900 shadow-sm" 
                : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-hooke-900 focus:border-hooke-900 transition-all rounded-none"
          />
        </div>
      </div>

      {/* Tabela Ultra-Limpa */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
              <th className="px-4 py-2">Info</th>
              <th className="px-4 py-2">Departamento</th>
              <th className="px-4 py-2">Status Hooke</th>
              <th className="px-4 py-2">Preço</th>
              <th className="px-4 py-2">Sync Tiny</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr 
                key={p.id} 
                className={`group bg-white border border-gray-100 hover:shadow-md transition-all ${!p.isActive ? "opacity-50" : ""}`}
              >
                {/* Info Principal */}
                <td className="px-4 py-4 border-y first:border-l border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-16 bg-gray-50 border border-gray-200 shrink-0 overflow-hidden">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Plus size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-hooke-900 tracking-tight leading-tight uppercase">{p.name}</h3>
                      <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase tracking-tighter">{p.id}</p>
                    </div>
                  </div>
                </td>

                {/* Departamento */}
                <td className="px-4 py-4 border-y border-gray-100">
                   <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 border ${
                     p.department === 'feminino' ? 'border-pink-200 text-pink-600 bg-pink-50' : 'border-blue-200 text-blue-600 bg-blue-50'
                   }`}>
                     {p.department || 'não definido'}
                   </span>
                </td>

                {/* Qualidade Elite */}
                <td className="px-4 py-4 border-y border-gray-100">
                  <QualityBadge product={p} />
                </td>

                {/* Preço */}
                <td className="px-4 py-4 border-y border-gray-100">
                  <span className="text-xs font-bold text-hooke-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                  </span>
                </td>

                {/* Sync Status */}
                <td className="px-4 py-4 border-y border-gray-100">
                   <button 
                    onClick={() => onSync(p)}
                    className="flex flex-col items-center gap-0.5 hover:scale-105 transition-transform"
                   >
                     {(p as any).syncStatus === 'synced' ? (
                       <CheckCircle2 size={16} className="text-green-500" />
                     ) : (
                       <RefreshCw size={16} className={`text-amber-500 ${(p as any).syncStatus === 'pending' ? 'animate-spin' : ''}`} />
                     )}
                     <span className="text-[8px] font-black text-gray-400 uppercase">
                       {(p as any).syncStatus || 'Pendente'}
                     </span>
                   </button>
                </td>

                {/* Ações */}
                <td className="px-4 py-4 border-y last:border-r border-gray-100 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onToggleActive(p.id, p.isActive !== false)}
                      className={`p-2 transition-colors ${p.isActive ? "text-blue-500 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-100"}`}
                      title={p.isActive ? "Ocultar" : "Mostrar"}
                    >
                      {p.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button 
                      onClick={() => onEdit(p)}
                      className="p-2 text-hooke-900 hover:bg-hooke-50 transition-colors"
                      title="Editar"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(p.id, p.name)}
                      className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-gray-100">
            <p className="text-xs font-black tracking-widest text-gray-300 uppercase">Nenhum produto encontrado neste filtro</p>
          </div>
        )}
      </div>
    </div>
  );
}
