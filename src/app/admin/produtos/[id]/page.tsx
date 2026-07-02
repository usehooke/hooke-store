"use client";

import React, { useEffect, useState, useRef, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { saveProduct, deleteProduct } from '../../actions/products';
import { ProductForm, ProductFormHandle } from '@/features/catalog/components/ProductForm';
import { MagicDropzone } from '@/features/catalog/components/MagicDropzone';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditarProdutoPage() {
  const params = useParams();
  const router = useRouter();
  
  // Blindagem contra o bug de useParams do Next.js na Vercel que retorna o placeholder dinâmico '[id]' ou '%5Bid%5D'
  let id = params?.id as string;
  if (id === '[id]' || id === '%5Bid%5D') {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart !== '[id]' && lastPart !== '%5Bid%5D') {
        id = decodeURIComponent(lastPart);
      }
    }
  }

  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isMagicMode, setIsMagicMode] = useState(false);
  const formRef = useRef<ProductFormHandle>(null);

  useEffect(() => {
    async function loadProduct() {
      // Cláusula de guarda para evitar chamadas de API com placeholders antes do ID real estar resolvido
      if (!id || id === '[id]' || id === '%5Bid%5D') {
        return;
      }
      try {
        if (!db) throw new Error("Firebase não inicializado");
        const docRef = doc(db, 'produtos', id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          toast.error(`Equipamento não encontrado (${id}).`);
          router.push('/admin/produtos');
          return;
        }
        
        const product = { id: docSnap.id, ...docSnap.data() };
        
        // Pequeno delay para garantir que o ref do formulário esteja pronto
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.setValues(product);
          }
        }, 100);
      } catch (error) {
        toast.error('Erro ao carregar o equipamento.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        const newId = data.id || id;
        
        let result;
        if (newId !== id) {
          // Lojista alterou o SKU inteligente (ID do produto)
          // 1. Salva com o novo ID
          result = await saveProduct({ ...data, id: newId });
          if (result.success) {
            // 2. Apaga o documento com o ID antigo
            await deleteProduct(id, data.name || "Produto antigo");
            toast.success('Equipamento recodificado com novo SKU!');
            router.push(`/admin/produtos/${newId}`);
            return;
          }
        } else {
          // Salvamento normal (mesmo ID)
          result = await saveProduct({ ...data, id });
        }
        
        if (result.success) {
          toast.success('Equipamento atualizado no arsenal.');
          router.push('/admin/produtos');
        } else {
          toast.error(`Erro na atualização: ${result.message}`);
        }
      } catch (error) {
        toast.error('Erro na atualização.');
      }
    });
  };

  const handleMagicAnalysis = (data: any) => {
    if (formRef.current) {
      formRef.current.setValuesFromAI(data);
      setIsMagicMode(false);
      toast.success("Equipamento refatorado pela IA!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER EDIT */}
      <header className="p-8 md:p-12 border-b-4 border-black bg-zinc-50 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <Link href="/admin/produtos" prefetch={false} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
            <ChevronLeft size={14} />
            Voltar ao Arsenal
          </Link>
          <div className="flex items-center gap-4">
            <span className="w-12 h-1 bg-black" />
            <p className="text-[10px] font-black tracking-[0.5em] uppercase text-black">Modificar Equipamento</p>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black uppercase italic leading-none">
            Reforjar <br /> <span className="opacity-20 font-light not-italic">Item {id?.slice(0, 4)}</span>
          </h1>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={() => setIsMagicMode(!isMagicMode)}
            variant="outline"
            className={`border-2 border-black rounded-none h-16 px-8 font-black uppercase text-[10px] tracking-widest transition-all flex gap-3 ${isMagicMode ? 'bg-black text-white shadow-sharp-sm' : 'bg-white hover:bg-zinc-100'}`}
          >
            <Sparkles size={16} className={isMagicMode ? 'animate-pulse' : ''} />
            {isMagicMode ? 'Modo Vision Ativo' : 'Refactor Mágico'}
          </Button>

          <Button 
            form="product-form"
            className="bg-black text-white rounded-none px-12 py-8 h-auto flex flex-col items-center gap-2 group hover:bg-zinc-800 transition-all shadow-sharp"
          >
            <Save className="group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Salvar Alterações</span>
          </Button>
        </div>
      </header>

      <main className="p-8 md:p-12 max-w-6xl">
        <div className="grid grid-cols-1 gap-12">
          <AnimatePresence>
            {isMagicMode && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="border-4 border-dashed border-black p-8 bg-zinc-50 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                      <h2 className="text-sm font-black uppercase tracking-widest">Hook Vision: Escaneamento de Reprocessamento</h2>
                    </div>
                    <Button variant="ghost" onClick={() => setIsMagicMode(false)} className="text-[10px] font-bold uppercase hover:bg-red-50 text-red-600">Encerrar Modo Mágico</Button>
                  </div>
                  <MagicDropzone onAnalysisComplete={handleMagicAnalysis} />
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest text-center font-bold">
                    Arraste a foto do equipamento para que a IA refatore a descrição, preço e categoria automaticamente.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <section className="bg-white border-2 border-black p-8 shadow-sharp-sm">
             <ProductForm ref={formRef} onSubmit={handleSubmit} />
          </section>
        </div>
      </main>
    </div>
  );
}
