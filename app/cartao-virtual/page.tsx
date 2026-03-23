"use client";

import React, { useState } from 'react';
import VirtualCard from '@/components/shop/VirtualCard';
import { brandConfig } from '@/config/brandConfig';
import { Download, Share2, Printer, ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import { toast } from 'react-hot-toast';

export default function VirtualCardPage() {
 const [isExporting, setIsExporting] = useState(false);
 const [hasShared, setHasShared] = useState(false);
 
 const handleDownload = async () => {
 const element = document.getElementById('hooke-card-capture');
 if (!element) return;

 try {
 setIsExporting(true);
 toast.loading("Gerando imagem premium...", { id: 'export' });
 
 // Pequeno delay para garantir que o DOM está pronto e animações paradas
 await new Promise(resolve => setTimeout(resolve, 500));
 
 const dataUrl = await toPng(element, {
 quality: 1.0,
 pixelRatio: 3, // Alta resolução para impressão
 backgroundColor: '#000000',
 });

 const link = document.createElement('a');
 link.download = `cartao-hooke-vip.png`;
 link.href = dataUrl;
 link.click();
 
 toast.success("Cartão baixado com sucesso!", { id: 'export' });
 } catch (err) {
 console.error('Erro ao exportar:', err);
 toast.error("Erro ao gerar imagem. Tente novamente.", { id: 'export' });
 } finally {
 setIsExporting(false);
 }
 };

 const handleShare = () => {
 const shareText = `Fala! Olha meu cartão VIP da Hooke. Dá uma olhada no site deles: ${brandConfig.shop.baseUrl}`;
 const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
 window.open(whatsappUrl, '_blank');
 setHasShared(true);
 setTimeout(() => setHasShared(false), 3000);
 };

 const handlePrint = () => {
 window.print();
 };

 return (
 <main className="min-h-screen bg-white">
 {/* Botão Voltar */}
 <div className="w-full px-6 py-8 border-b border-gray-100 flex items-center justify-between">
 <Link 
 href="/" 
 className="flex items-center gap-2 text-xs font-bold tracking-widest text-hooke-900 hover:opacity-60 transition-opacity"
 >
 <ChevronLeft size={16} /> Voltar ao Shop
 </Link>
 <span className="text-[10px] font-black tracking-tighter text-gray-300">Hooke Virtual Card</span>
 </div>

 <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 lg:grid lg:grid-cols-2 lg:gap-16 items-center">
 
 {/* Lado Esquerdo: O Cartão */}
 <div className="mb-12 lg:mb-0 print:m-0 print:p-0">
 <VirtualCard />
 <p className="text-center text-[10px] text-gray-400 mt-4 tracking-widest animate-pulse print:hidden">
 Toque no cartão para girar
 </p>
 </div>

 {/* Lado Direito: Ações e Texto */}
 <div className="space-y-10 print:hidden">
 <div className="space-y-4">
 <h1 className="text-4xl md:text-5xl font-black text-hooke-900 tracking-tighter leading-none">
 Seu Cartão <br/> Hooke VIP
 </h1>
 <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
 O minimalismo que você veste agora no seu bolso. Use para compras online ou apresente nas nossas lojas físicas do Brás.
 </p>
 </div>

 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
 {/* Download */}
 <button 
 onClick={handleDownload}
 disabled={isExporting}
 className="group relative flex items-center justify-center gap-3 bg-black text-white px-8 py-5 text-xs font-bold tracking-widest hover:bg-zinc-900 transition-all disabled:opacity-50"
 >
 {isExporting ? (
 <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
 ) : (
 <Download size={18} className="group-hover:scale-110 transition-transform" />
 )}
 {isExporting ? "Gerando..." : "Baixar Cartão"}
 </button>

 {/* Share WhatsApp */}
 <button 
 onClick={handleShare}
 className="flex items-center justify-center gap-3 border-2 border-black text-black px-8 py-5 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
 >
 {hasShared ? <Check size={18} /> : <Share2 size={18} />}
 {hasShared ? "Compartilhado!" : "Encaminhar no WhatsApp"}
 </button>

 {/* Print */}
 <button 
 onClick={handlePrint}
 className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest text-gray-400 hover:text-black transition-colors"
 >
 <Printer size={16} /> Imprimir Cópia Identica
 </button>
 </div>

 <div className="pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
 <div>
 <h4 className="text-[10px] font-black tracking-widest text-hooke-900 mb-2">Lojas Físicas</h4>
 <p className="text-[11px] text-gray-500 leading-relaxed ">
 Vautier Premium (Loja 148)<br/>
 Shopping Porto (Loja 1598)
 </p>
 </div>
 <div>
 <h4 className="text-[10px] font-black tracking-widest text-hooke-900 mb-2">Suporte Direto</h4>
 <p className="text-[11px] text-gray-500 leading-relaxed">
 Seg a Sex: 08h às 18h<br/>
 WhatsApp: (11) 97590-2528
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Regras de Impressão */}
 <style jsx global>{`
 @media print {
 body * {
 visibility: hidden;
 }
 #hooke-card-capture, #hooke-card-capture * {
 visibility: visible;
 }
 #hooke-card-capture {
 position: absolute;
 left: 50% !important;
 top: 50% !important;
 transform: translate(-50%, -50%) !important;
 width: 85.6mm !important; /* Tamanho padrão cartão crédito */
 height: 135mm !important; /* Proporção 1:1.58 */
 box-shadow: none !important;
 border: 1px solid #efefef !important;
 }
 nav, footer, .print-hide {
 display: none !important;
 }
 }
 `}</style>
 </main>
 );
}
