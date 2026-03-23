"use client";

import { useState } from "react";
import { Camera, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

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

 toast.success(`Bip: ${sku}`, {
 style: { background: '#000', color: '#fff', fontSize: '10px' }
 });
 };

 return (
 <div className="min-h-screen bg-hooke-50 text-hooke-900 font-sans p-6 overflow-x-hidden">
 <div className="max-w-4xl mx-auto">
 <header className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-4">
 <Link href="/admin/pdv" className="p-3 shadow-neumorph rounded-full">
 <ArrowLeft className="h-5 w-5" />
 </Link>
 <h1 className="text-2xl font-black tracking-tighter ">Inventário Rápido</h1>
 </div>
 <button className="flex items-center gap-2 text-[10px] font-black text-hooke-500 shadow-neumorph px-4 py-2">
 <RefreshCw className="h-3 w-3" />
 Resincronizar Tiny
 </button>
 </header>

 {/* Scanner Mockup Section */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 <div className="md:col-span-1 bg-hooke-900 text-white p-6 shadow-neumorph flex flex-col items-center justify-center space-y-4">
 <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
 <Camera className="h-8 w-8 text-white" />
 </div>
 <p className="text-[10px] font-black tracking-widest text-center">Aguardando Bip / Câmera Ativa</p>
 <input 
 type="text" 
 value={manualSku}
 onChange={(e) => setManualSku(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleBip(manualSku)}
 placeholder="Bipar ou Digitar SKU"
 className="w-full bg-white/10 p-3 text-xs border border-white/20 outline-none "
 />
 </div>

 <div className="md:col-span-2 bg-hooke-50 p-6 shadow-neumorph overflow-hidden">
 <h3 className="text-xs font-black tracking-widest mb-4">Resumo da Auditoria</h3>
 <div className="grid grid-cols-3 gap-4">
 <div className="text-center font-black">
 <p className="text-[10px] text-hooke-500 ">Auditados</p>
 <p className="text-2xl">{auditList.length}</p>
 </div>
 <div className="text-center font-black">
 <p className="text-[10px] text-hooke-500 ">Divergentes</p>
 <p className="text-2xl text-red-500">{auditList.filter(i => i.actual !== i.expected).length}</p>
 </div>
 <div className="text-center font-black">
 <p className="text-[10px] text-hooke-500 ">Peças Totais</p>
 <p className="text-2xl">{auditList.reduce((acc, i) => acc + i.actual, 0)}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Audit List */}
 <div className="bg-hooke-50 shadow-neumorph overflow-hidden">
 <table className="w-full text-left">
 <thead className="bg-hooke-900/5 text-[10px] font-black tracking-widest">
 <tr>
 <th className="p-4">SKU / Produto</th>
 <th className="p-4 text-center">No Tiny</th>
 <th className="p-4 text-center">Auditado</th>
 <th className="p-4 text-center">Status</th>
 </tr>
 </thead>
 <tbody className="text-xs font-bold divide-y divide-hooke-200">
 {auditList.length === 0 ? (
 <tr>
 <td colSpan={4} className="p-12 text-center text-hooke-300 ">Inicie o bipagem das peças...</td>
 </tr>
 ) : (
 auditList.map((item) => (
 <tr key={item.sku} className="hover:bg-hooke-100/30 transition-colors">
 <td className="p-4">
 <p className="font-black truncate ">{item.name}</p>
 <p className="text-[10px] opacity-50">{item.sku}</p>
 </td>
 <td className="p-4 text-center text-lg">{item.expected}</td>
 <td className="p-4 text-center text-lg">{item.actual}</td>
 <td className="p-4 text-center">
 {item.actual === item.expected ? (
 <div className="flex items-center justify-center text-green-600 gap-1">
 <CheckCircle2 className="h-4 w-4" />
 <span className="text-[10px] font-black ">OK</span>
 </div>
 ) : (
 <div className="flex items-center justify-center text-red-500 gap-1">
 <AlertTriangle className="h-4 w-4" />
 <span className="text-[10px] font-black ">FALTA {item.expected - item.actual}</span>
 </div>
 )}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 <div className="mt-8 flex gap-4">
 <button 
 onClick={() => {
 if (window.confirm("Limpar lista de auditoria?")) setAuditList([]);
 }}
 className="flex-1 bg-white p-6 shadow-neumorph font-black tracking-widest text-xs active:shadow-neumorph-inset"
 >
 Limpar Lista
 </button>
 <button 
 className="flex-1 bg-hooke-900 text-white p-6 shadow-neumorph font-black tracking-widest text-xs active:scale-95 transition-all disabled:opacity-50"
 disabled={auditList.length === 0}
 >
 Finalizar Ajuste no Tiny
 </button>
 </div>
 </div>
 </div>
 );
}
