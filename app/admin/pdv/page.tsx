"use client";

import { LogOut, Package, RefreshCw, AlertTriangle, Tags, ClipboardList, BarChart3, FileText } from "lucide-react";
import Link from "next/link";
import { useSyncOfflineSales } from "@/hooks/useSyncOfflineSales";
import PDVProductGrid from "@/components/pdv/sections/PDVProductGrid";
import PDVCartSidebar from "@/components/pdv/sections/PDVCartSidebar";
import { cn } from "@/lib/utils";

export default function PDVPage() {
  const { isSyncing, pendingCount, exhaustedCount, isContingencyMode } = useSyncOfflineSales();

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-white selection:text-black">
      {/* Top Bar Elite PDV */}
      <header className="flex h-20 items-center justify-between px-8 border-b border-white/[0.05] bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex h-10 w-10 items-center justify-center bg-white/5 border border-white/10 rounded-none">
            <Package className="h-5 w-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-[0.4em] uppercase text-white leading-none">Hooke PDV Elite</h1>
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1.5 font-bold italic">Unidade HQ • 2026</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden xl:flex items-center gap-1">
            <Link href="/admin/pdv/etiquetas" className="p-3 text-zinc-500 hover:text-white transition-all" title="Gerar Etiquetas">
              <Tags className="h-4 w-4" />
            </Link>
            <Link href="/admin/pdv/inventario" className="p-3 text-zinc-500 hover:text-white transition-all" title="Inventário Rápido">
              <ClipboardList className="h-4 w-4" />
            </Link>
            <Link href="/admin/pdv/folha-skus" className="p-3 text-zinc-500 hover:text-white transition-all" title="Guia de SKUs">
              <FileText className="h-4 w-4" />
            </Link>
          </nav>

          {/* Status Sync Indicator (Arqueologia de Rede) */}
          <div className="flex items-center">
            {isContingencyMode ? (
              <div className="flex items-center gap-3 text-[9px] font-black text-red-500 bg-red-500/10 px-4 py-2 border border-red-500/20">
                <AlertTriangle className="h-3 w-3 animate-pulse" />
                CONTINGÊNCIA (ERP OFFLINE)
              </div>
            ) : exhaustedCount > 0 ? (
              <div className="flex items-center gap-3 text-[9px] font-black text-white bg-red-600 px-4 py-2 border border-red-700">
                <AlertTriangle className="h-3 w-3 animate-bounce" />
                {exhaustedCount} FALHAS CRÍTICAS
              </div>
            ) : pendingCount > 0 ? (
              <div className="flex items-center gap-3 text-[9px] font-black text-yellow-500 bg-yellow-500/5 px-4 py-2 border border-yellow-500/10">
                <RefreshCw className={cn("h-3 w-3", isSyncing && "animate-spin")} />
                {pendingCount} SINCRONIZANDO...
              </div>
            ) : (
              <div className="flex items-center gap-3 text-[9px] font-black text-emerald-500 bg-emerald-500/5 px-4 py-2 border border-emerald-500/10">
                <div className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse" />
                TERMINAL ONLINE
              </div>
            )}
          </div>
          
          <button className="p-3 text-zinc-500 hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[calc(100vh-80px)]">
        {/* Área de Venda Principal - Foco Atacado */}
        <section className="lg:col-span-8 p-6 lg:p-10 border-r border-white/[0.05] overflow-y-auto custom-scrollbar bg-[#080808]">
          <PDVCartSidebar />
        </section>

        {/* Catálogo de Produtos Lateral - Seleção Rápida */}
        <aside className="lg:col-span-4 p-4 lg:p-6 bg-black/40 backdrop-blur-md sticky top-20 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
          <PDVProductGrid />
        </aside>
      </main>
    </div>
  );
}
