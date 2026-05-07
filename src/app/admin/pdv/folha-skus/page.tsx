"use client";

import { MODEL_DICTIONARY, PRINT_DICTIONARY, COLOR_DICTIONARY } from "@/utils/sku-generator";
import { Printer, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function FolhaSKUsPage() {
 return (
 <div className="min-h-screen bg-white text-black font-sans p-8 print:p-0">
 {/* Header - Not shown in print */}
 <header className="flex items-center justify-between mb-8 print:hidden">
 <div className="flex items-center gap-4">
 <Link href="/admin/pdv" className="p-3 border border-black shadow-sharp rounded-none hover:bg-gray-100">
 <ArrowLeft className="h-5 w-5" />
 </Link>
 <h1 className="text-2xl font-black tracking-tighter">Guia de SKUs Hooke 2026</h1>
 </div>
 <button 
 onClick={() => window.print()}
 className="flex items-center gap-2 bg-black text-white px-6 py-3 font-bold tracking-widest text-xs hover:bg-gray-800 transition-all"
 >
 <Printer className="h-4 w-4" />
 Imprimir Guia
 </button>
 </header>

 {/* Printable Area */}
 <div className="max-w-4xl mx-auto border-2 border-black p-10 print:border-0 print:p-0">
 <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-10">
 <div>
 <h2 className="text-4xl font-black tracking-tighter leading-none mb-2">Hooke</h2>
 <p className="text-sm font-bold tracking-widest opacity-60">Dicionário Oficial de SKUs 2026</p>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-black ">Versão 1.0</p>
 <p className="text-[10px] font-black ">Padrão: [MODELO]-[ESTAMPA]-[COR]-[TAMANHO]</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
 {/* Modelagens */}
 <section>
 <h3 className="text-lg font-black border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
 <span className="bg-black text-white px-2 py-0.5 text-xs">01</span>
 Modelagens
 </h3>
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-gray-200">
 <th className="text-left py-2 font-black text-[10px]">Sigla</th>
 <th className="text-left py-2 font-black text-[10px]">Nome</th>
 </tr>
 </thead>
 <tbody>
 {Object.entries(MODEL_DICTIONARY).map(([sigla, info]) => (
 <tr key={sigla} className="border-b border-gray-100 italic">
 <td className="py-2 font-black">{sigla}</td>
 <td className="py-2 font-medium">{info.label}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </section>

 {/* Estampas / Tecidos */}
 <section>
 <h3 className="text-lg font-black border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
 <span className="bg-black text-white px-2 py-0.5 text-xs">02</span>
 Estampas / Tecidos
 </h3>
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-gray-200">
 <th className="text-left py-2 font-black text-[10px]">Sigla</th>
 <th className="text-left py-2 font-black text-[10px]">Nome</th>
 </tr>
 </thead>
 <tbody>
 {Object.entries(PRINT_DICTIONARY).map(([sigla, info]) => (
 <tr key={sigla} className="border-b border-gray-100 italic">
 <td className="py-2 font-black">{sigla}</td>
 <td className="py-2 font-medium">{info.label}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </section>

 {/* Cores */}
 <section className="md:col-span-2">
 <h3 className="text-lg font-black border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
 <span className="bg-black text-white px-2 py-0.5 text-xs">03</span>
 Cores
 </h3>
 <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8">
 <table className="w-full text-sm">
 <tbody>
 {Object.entries(COLOR_DICTIONARY).slice(0, 5).map(([sigla, info]) => (
 <tr key={sigla} className="border-b border-gray-100 italic">
 <td className="py-2 font-black w-16">{sigla}</td>
 <td className="py-2 font-medium">{info.label}</td>
 </tr>
 ))}
 </tbody>
 </table>
 <table className="w-full text-sm">
 <tbody>
 {Object.entries(COLOR_DICTIONARY).slice(5, 10).map(([sigla, info]) => (
 <tr key={sigla} className="border-b border-gray-100 italic">
 <td className="py-2 font-black w-16">{sigla}</td>
 <td className="py-2 font-medium">{info.label}</td>
 </tr>
 ))}
 </tbody>
 </table>
 <table className="w-full text-sm">
 <tbody>
 {Object.entries(COLOR_DICTIONARY).slice(10).map(([sigla, info]) => (
 <tr key={sigla} className="border-b border-gray-100 italic">
 <td className="py-2 font-black w-16">{sigla}</td>
 <td className="py-2 font-medium">{info.label}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </section>

 {/* Tamanhos */}
 <section className="md:col-span-2">
 <h3 className="text-lg font-black border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
 <span className="bg-black text-white px-2 py-0.5 text-xs">04</span>
 Tamanhos
 </h3>
 <div className="flex gap-4">
 {["P", "M", "G", "GG", "G1", "G2"].map(size => (
 <div key={size} className="flex-1 border-2 border-black p-4 text-center">
 <span className="text-2xl font-black">{size}</span>
 </div>
 ))}
 </div>
 </section>
 </div>

 <footer className="mt-16 pt-6 border-t border-black flex justify-between items-center italic opacity-60">
 <p className="text-[10px] font-bold tracking-widest">Hooke Clothing Co. 2026</p>
 <div className="flex items-center gap-2">
 <FileText className="h-4 w-4" />
 <p className="text-[10px] font-bold tracking-widest">Guia de Codificação SKU</p>
 </div>
 </footer>
 </div>

 <style jsx global>{`
 @media print {
 @page {
 margin: 20mm;
 }
 body {
 background: white !important;
 color: black !important;
 }
 }
 `}</style>
 </div>
 );
}
