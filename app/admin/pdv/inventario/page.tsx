"use client";

import { useState } from "react";
import { Camera, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner"; // Unificado com Sonner

interface AuditItem {
 sku: string;
 name: string;
 expected: number;
 actual: number;
}

export default function InventoryModePage() {
 const [auditList, setAuditList] = useState<AuditItem[]>([]);
 const [manualSku, setManualSku] = useState("");

 // Bipar um produto
 const handleBip = (sku: string) => {
 // Simulação de busca no banco/Tiny
 const mockExpected = Math.floor(Math.random() * 10) + 1;
 
 setAuditList(prev => {
 const existing = prev.find(i => i.sku === sku);
 if (existing) {
 return prev.map(i => i.sku === sku ? { ...i, actual: i.actual + 1 } : i);
 }
 return [...prev, { 
 sku, 
 name: `Produto ${sku.split('-')[1] || sku}`, 
 expected: mockExpected, 
 actual: 1 
 }];
 });

 toast.success(`Bip detectado: ${sku}`, {
   description: "Item adicionado à lista de auditoria."
 });
 };

 return (
 <div className="min-h-screen bg-hooke-paper text-hooke-900 font-sans p-8 overflow-x-hidden selection:bg-black selection:text-white">
 <Toaster position="top-right" richColors />
 <div className="max-w-4xl mx-auto">
 <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-black/10 pb-8 gap-6">
 <div className="flex items-center gap-6">
 <Link href="/admin/pdv" className="p-3 border border-black/10 hover:bg-black hover:text-white transition-all">
 <ArrowLeft className="h-5 w-5" />
 </Link>
 <div>
 <h1 className="text-3xl font-black tracking-tighter uppercase">Inventário Rápido</h1>
 <p className="text-[10px] font-bold tracking-[0.3em] text-black/40 uppercase">Audit Mode 2026</p>
 </div>
 </div>
 <button className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase border border-black/10 px-6 py-3 hover:bg-black hover:text-white transition-all">
 <RefreshCw className="h-3 w-3" />
 Resincronizar Tiny
 </button>
 </header>

 {/* Scanner Section (Elite Style) */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
 <div className="md:col-span-1 bg-black text-white p-8 border border-black flex flex-col items-center justify-center space-y-6">
 <div className="h-20 w-20 border border-white/20 flex items-center justify-center relative overflow-hidden group">
 <Camera className="h-8 w-8 text-white relative z-10" strokeWidth={1} />
 <div className="absolute inset-0 bg-white/10 animate-pulse" />
 <div className="absolute inset-x-0 top-1/2 h-[1px] bg-red-500/50 shadow-[0_0_10px_red] animate-scan" />
 </div>
 
 <div className="w-full text-center">
 <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40 mb-4 italic text-white/60">Aguardando Laser / Bip</p>
 <input 
 type="text" 
 value={manualSku}
 onChange={(e) => setManualSku(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleBip(manualSku)}
 placeholder="DIGITAR SKU"
 className="w-full bg-white/5 p-4 text-xs border border-white/10 outline-none text-center font-mono focus:border-white/40 transition-all uppercase placeholder:opacity-30"
 />
 </div>
 </div>

 <div className="md:col-span-2 bg-white p-8 border border-black/5 flex flex-col justify-between">
 <div>
 <h3 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 mb-6 ">Resumo Estratégico</h3>
 <div className="grid grid-cols-3 gap-8">
 <div className="font-black">
 <p className="text-[9px] tracking-widest text-black/40 uppercase mb-1">Auditados</p>
 <p className="text-3xl tracking-tighter">{auditList.length}</p>
 </div>
 <div className="font-black">
 <p className="text-[9px] tracking-widest text-black/40 uppercase mb-1">Divergentes</p>
 <p className="text-3xl tracking-tighter text-red-500">{auditList.filter(i => i.actual !== i.expected).length}</p>
 </div>
 <div className="font-black">
 <p className="text-[9px] tracking-widest text-black/40 uppercase mb-1">Total Peças</p>
 <p className="text-3xl tracking-tighter">{auditList.reduce((acc, i) => acc + i.actual, 0)}</p>
 </div>
 </div>
 </div>
 <div className="mt-8 pt-6 border-t border-black/5">
 <p className="text-[10px] font-medium text-black/40 leading-relaxed italic">
 Certifique-se de realizar a leitura completa de cada rack antes de sincronizar o ajuste final com o Tiny ERP.
 </p>
 </div>
 </div>
 </div>

 {/* Audit Table (Brutalist/Sharp Style) */}
 <div className="bg-white border border-black overflow-hidden mb-12">
 <table className="w-full text-left">
 <thead className="bg-black text-white text-[10px] font-bold tracking-widest uppercase">
 <tr>
 <th className="p-5">SKU / Identificação</th>
 <th className="p-5 text-center">Expectativa</th>
 <th className="p-5 text-center">Auditado</th>
 <th className="p-5 text-center">Status Final</th>
 </tr>
 </thead>
 <tbody className="text-xs font-medium divide-y divide-black/5">
 {auditList.length === 0 ? (
 <tr>
 <td colSpan={4} className="p-20 text-center text-black/20 italic tracking-widest text-[10px] font-black uppercase">
 Pressione Enter ou Bipe um produto para iniciar auditoria
 </td>
 </tr>
 ) : (
 auditList.map((item) => (
 <tr key={item.sku} className="hover:bg-black/5 transition-colors group">
 <td className="p-5">
 <p className="font-black tracking-tight text-sm ">{item.name}</p>
 <p className="text-[10px] opacity-40 font-mono mt-1">{item.sku}</p>
 </td>
 <td className="p-5 text-center text-lg font-light">{item.expected}</td>
 <td className="p-5 text-center text-lg font-black">{item.actual}</td>
 <td className="p-5 text-center">
 {item.actual === item.expected ? (
 <div className="flex items-center justify-center text-green-600 gap-2">
 <CheckCircle2 className="h-3 w-3" />
 <span className="text-[9px] font-black tracking-widest ">COMPATÍVEL</span>
 </div>
 ) : (
 <div className="flex items-center justify-center text-red-500 gap-2">
 <AlertTriangle className="h-3 w-3" />
 <span className="text-[9px] font-black tracking-widest ">
 {item.expected - item.actual > 0 ? `FALTA ${item.expected - item.actual}` : `EXCESSO ${Math.abs(item.expected - item.actual)}`}
 </span>
 </div>
 )}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
 <button 
 onClick={() => {
 if (window.confirm("Limpar lista de auditoria?")) setAuditList([]);
 }}
 className="p-8 border border-black text-[10px] font-black tracking-[0.3em] uppercase hover:bg-red-500 hover:text-white transition-all active:scale-95"
 >
 Limpar lista de auditoria
 </button>
 <button 
 className={`p-8 bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase hover:opacity-80 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3`}
 disabled={auditList.length === 0}
 >
 <CheckCircle2 size={16} /> Finalizar Ajuste Tiny ERP
 </button>
 </div>
 </div>
 </div>
 );
}
