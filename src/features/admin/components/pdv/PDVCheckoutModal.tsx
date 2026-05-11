"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, QrCode, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { generatePixPayment } from '@/actions/payments';
import { usePDVStore, selectPDVTotal } from '@/store/pdv-store';

interface PDVCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PDVCheckoutModal({ isOpen, onClose }: PDVCheckoutModalProps) {
  const [step, setStep] = useState<'decision' | 'processing' | 'pix_pending' | 'success'>('decision');
  const [paymentMethod, setPaymentMethod] = useState<'maquininha' | 'pix' | null>(null);
  const [pixData, setPixData] = useState<{ image: string, code: string } | null>(null);
  
  const total = usePDVStore(selectPDVTotal);
  const items = usePDVStore(state => state.items);
  const addToQueue = usePDVStore(state => state.addToQueue);
  const clearCart = usePDVStore(state => state.clearCart);

  const handlePayment = async (method: 'maquininha' | 'pix') => {
    setPaymentMethod(method);
    setStep('processing');

    try {
        if (method === 'maquininha') {
            // Fluxo Maquininha: Baixa direta
            addToQueue({
                items,
                customerName: 'Cliente Balcão',
                total,
                paymentMethod: 'cartao',
                timestamp: Date.now(),
                isWholesale: items.length >= 5
            });
            setTimeout(() => setStep('success'), 1500);
        } else {
            // Fluxo PIX: Integração Real
            const data = await generatePixPayment(total, 'Venda Balcão Hooke');
            setPixData({ image: data.qr_code_base64, code: data.qr_code });
            setStep('pix_pending');
        }
    } catch (error: any) {
        alert("Erro no Pagamento: " + error.message);
        setStep('decision');
    }
  };

  const handleConfirmPix = () => {
    addToQueue({
        items,
        customerName: 'Cliente Balcão (PIX)',
        total,
        paymentMethod: 'pix',
        timestamp: Date.now(),
        isWholesale: items.length >= 5
    });
    setStep('success');
  };

  const handleFinalize = () => {
    clearCart();
    setStep('decision');
    setPaymentMethod(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          {step === 'decision' && (
            <div className="flex-1 flex flex-col md:flex-row">
              {/* Lado A: Maquininha */}
              <button 
                onClick={() => handlePayment('maquininha')}
                className="flex-1 bg-black text-white flex flex-col items-center justify-center gap-6 active:bg-zinc-900 transition-colors border-b-2 md:border-b-0 md:border-r-2 border-white/10"
              >
                <CreditCard size={80} strokeWidth={1} />
                <span className="text-4xl font-black uppercase tracking-tighter">Máquina da Loja</span>
                <span className="text-sm opacity-50 uppercase tracking-widest font-bold">Cartão Débito/Crédito</span>
              </button>

              {/* Lado B: PIX */}
              <button 
                onClick={() => handlePayment('pix')}
                className="flex-1 bg-white text-black flex flex-col items-center justify-center gap-6 active:bg-zinc-50 transition-colors"
              >
                <QrCode size={80} strokeWidth={1} />
                <span className="text-4xl font-black uppercase tracking-tighter text-emerald-600">Gerar PIX</span>
                <span className="text-sm opacity-50 uppercase tracking-widest font-bold">QR Code no Tablet</span>
              </button>

              {/* Barra de Rodapé: Voltar */}
              <button 
                onClick={onClose}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-10 py-5 bg-zinc-100 hover:bg-zinc-200 text-black border-2 border-black font-black uppercase tracking-widest text-xs transition-all active:scale-95"
              >
                <ArrowLeft size={16} />
                Cancelar / Voltar ao Carrinho
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-white">
               <Loader2 size={64} className="animate-spin text-black" />
               <div className="text-center">
                 <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Processando {paymentMethod === 'pix' ? 'PIX' : 'Venda'}</h2>
                 <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.4em]">Iniciando Protocolo de Baixa no Estoque...</p>
               </div>
            </div>
          )}

          {step === 'pix_pending' && pixData && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 bg-white overflow-y-auto">
               <div className="text-center mb-4">
                 <h2 className="text-4xl font-black uppercase tracking-tighter">Aguardando PIX</h2>
                 <p className="text-xl font-bold text-emerald-600">Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</p>
               </div>

               <div className="border-[6px] border-black p-4 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,0.05)]">
                 <img 
                    src={`data:image/png;base64,${pixData.image}`} 
                    alt="QR Code PIX" 
                    className="w-64 h-64 md:w-80 md:h-80 object-contain"
                 />
               </div>

               <button 
                onClick={() => {
                  navigator.clipboard.writeText(pixData.code);
                  alert("Código PIX copiado!");
                }}
                className="px-6 py-3 bg-zinc-100 border-2 border-black font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
               >
                 Copiar Código PIX (Copia e Cola)
               </button>

               <div className="w-full max-w-md flex flex-col gap-3 mt-4">
                 <button 
                  onClick={handleConfirmPix}
                  className="w-full bg-black text-white py-8 font-black uppercase tracking-[0.2em] text-xl active:bg-zinc-900 shadow-[0_4px_0px_0px_rgba(0,0,0,0.2)]"
                 >
                   Confirmar Recebimento
                 </button>
                 <button 
                  onClick={() => setStep('decision')}
                  className="w-full py-4 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:text-black"
                 >
                   Voltar / Mudar Forma
                 </button>
               </div>
            </div>
          )}

          {step === 'success' && (
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center gap-10 bg-emerald-500 text-white p-10"
            >
               <CheckCircle2 size={120} strokeWidth={1} />
               <div className="text-center">
                 <h2 className="text-6xl font-black uppercase tracking-tighter mb-4">Venda Concluída</h2>
                 <p className="text-xl font-bold opacity-80 uppercase tracking-widest mb-10">Pode entregar a sacola!</p>
                 
                 <div className="bg-black/10 backdrop-blur-md p-6 border border-white/20 inline-block">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black">Total Transacionado</p>
                    <p className="text-4xl font-black mt-2">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                    </p>
                 </div>
               </div>

               <button 
                onClick={handleFinalize}
                className="mt-10 px-20 py-8 bg-black text-white font-black uppercase tracking-[0.3em] text-xl hover:bg-zinc-900 transition-all active:scale-95"
               >
                 Próximo Cliente
               </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
