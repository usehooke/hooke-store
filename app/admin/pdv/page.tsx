"use client";

import { LogOut, Package, RefreshCw, AlertTriangle, Tags, ClipboardList, BarChart3, FileText } from "lucide-react";
import Link from "next/link";
import { useSyncOfflineSales } from "@/hooks/useSyncOfflineSales";
import PDVProductGrid from "@/components/pdv/ProductGrid";
import PDVCartSidebar from "@/components/pdv/CartSidebar";

export default function PDVPage() {
  const { isSyncing, pendingCount, exhaustedCount, isContingencyMode } = useSyncOfflineSales();

 return (
 <div className="min-h-screen bg-hooke-50 text-hooke-900 font-sans">
 {/* Top Bar PDV */}
 <header className="flex h-16 items-center justify-between px-6 shadow-neumorph mb-6">
 <div className="flex items-center gap-4">
 <div className="flex h-10 w-10 items-center justify-center shadow-neumorph rounded-full">
 <Package className="h-5 w-5" />
 </div>
 <h1 className="text-lg font-black tracking-tighter ">Hooke PDV</h1>
 </div>
 
 <div className="flex items-center gap-4">
 <nav className="hidden md:flex items-center gap-2 mr-4">
 <Link href="/admin/pdv/etiquetas" className="p-2 shadow-neumorph rounded-lg hover:shadow-neumorph-inset transition-all" title="Gerar Etiquetas">
 <Tags className="h-4 w-4" />
 </Link>
 <Link href="/admin/pdv/inventario" className="p-2 shadow-neumorph rounded-lg hover:shadow-neumorph-inset transition-all" title="Inventário Rápido">
 <ClipboardList className="h-4 w-4" />
 </Link>
 <Link href="/admin/pdv/folha-skus" className="p-2 shadow-neumorph rounded-lg hover:shadow-neumorph-inset transition-all" title="Guia de SKUs">
 <FileText className="h-4 w-4" />
 </Link>
 <Link href="/admin/pdv/dashboard" className="p-2 shadow-neumorph rounded-lg hover:shadow-neumorph-inset transition-all" title="Dashboard">
 <BarChart3 className="h-4 w-4" />
 </Link>
 </nav>

 {/* Status Sync Indicator */}
 {isContingencyMode ? (
 <div className="flex items-center gap-2 text-[10px] font-black text-red-600 bg-hooke-50 px-3 py-2 shadow-neumorph-inset border border-red-200">
 <AlertTriangle className="h-3 w-3 animate-pulse" />
 MODO CONTINGÊNCIA (ERP OFFLINE)
 </div>
 ) : exhaustedCount > 0 ? (
 <div className="flex items-center gap-2 text-xs font-bold text-white bg-red-600 px-3 py-2 shadow-neumorph-inset border border-red-700">
 <AlertTriangle className="h-3 w-3 animate-bounce" />
 {exhaustedCount} FALHA(S) CRÍTICA(S)
 </div>
 ) : pendingCount > 0 ? (
 <div className="flex items-center gap-2 text-xs font-bold text-yellow-600 bg-hooke-50 px-3 py-2 shadow-neumorph-inset">
 <AlertTriangle className={`h-3 w-3 ${isSyncing ? 'animate-pulse' : ''}`} />
 {pendingCount} PENDENTE(S)
 </div>
 ) : (
 <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-hooke-50 px-3 py-2 shadow-neumorph-inset">
 <RefreshCw className="h-3 w-3" />
 CONECTADO AO TINY
 </div>
 )}
 
 <button className="flex h-10 w-10 items-center justify-center shadow-neumorph rounded-full text-red-500 active:shadow-neumorph-inset">
 <LogOut className="h-4 w-4" />
 </button>
 </div>
 </header>

 <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 pb-24 lg:pb-6">
 {/* Left Side: Product Selection */}
 <section className="lg:col-span-8">
 <PDVProductGrid />
 </section>

 {/* Right Side: Cart Summary */}
 <aside className="lg:col-span-4 bg-hooke-50 p-6 shadow-neumorph-inset lg:shadow-neumorph h-fit sticky top-24">
 <PDVCartSidebar />
 </aside>
 </main>
 </div>
 );
}
