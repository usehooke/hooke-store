"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, Sparkles, HelpCircle, Check, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { toast } from "sonner";
import { saveStory } from "@/app/admin/actions/stories";
import { triggerHaptic } from "@/utils/haptics";

interface StoryComposerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onSuccess: () => void;
}

export function StoryComposer({ isOpen, onClose, selectedProducts, onSuccess }: StoryComposerProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState<number | null>(null);

  // Cada produto selecionado gerará uma lâmina
  const [pages, setPages] = useState<Array<{
    productId: string;
    productName: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    title: string;
    description: string;
    size: "P" | "M" | "G" | "GG";
    ctaText: string;
  }>>([]);

  const posterInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza páginas/lâminas quando a seleção de produtos muda
  useEffect(() => {
    if (selectedProducts.length > 0) {
      setPages(
        selectedProducts.map((p) => ({
          productId: p.id,
          productName: p.name,
          mediaUrl: p.imageUrl || "",
          mediaType: "image",
          title: p.name,
          description: `Descubra a geometria do clássico ${p.name}. O essencial redefinido com maestria.`,
          size: "G", // Tamanho G estatisticamente lidera o volume de vestuário
          ctaText: "ADQUIRIR PEÇA",
        }))
      );
    }
  }, [selectedProducts]);

  // Gera slug automaticamente baseado no título em kebab-case
  useEffect(() => {
    const generated = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
      .trim()
      .replace(/\s+/g, "-") // substitui espaços por -
      .replace(/-+/g, "-"); // evita hifens duplicados
    setSlug(generated);
  }, [title]);

  const handlePosterUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem para a capa.");
      return;
    }

    try {
      setIsUploadingPoster(true);
      triggerHaptic("light");
      toast.loading("Enviando capa do Story para o Cloudinary...", { id: "poster-upload" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rsjrcxrg");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dnzplmjfo";
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro de resposta do Cloudinary");

      const data = await res.json();
      setPosterUrl(data.secure_url);
      toast.success("Capa do Story carregada com sucesso!", { id: "poster-upload" });
      triggerHaptic("medium");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar a imagem. Tente novamente.", { id: "poster-upload" });
    } finally {
      setIsUploadingPoster(false);
    }
  };

  const handlePageFieldChange = (idx: number, field: string, value: any) => {
    setPages((prev) =>
      prev.map((page, i) => (i === idx ? { ...page, [field]: value } : page))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Defina o título do Story.");
      return;
    }
    if (!slug) {
      toast.error("Defina o slug do Story.");
      return;
    }
    if (!posterUrl) {
      toast.error("Faça o upload do pôster/capa (proporção 3:4).");
      return;
    }
    if (pages.length === 0) {
      toast.error("É necessário ter pelo menos uma lâmina ativa.");
      return;
    }

    try {
      setIsSubmitting(true);
      triggerHaptic("light");

      const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://usehooke.com.br";

      const formattedPages = pages.map((page, idx) => {
        const ctaLink = `${siteUrl}/checkout?productId=${page.productId}&size=${page.size}`;
        return {
          id: `page-${idx + 1}`,
          mediaType: page.mediaType,
          mediaUrl: page.mediaUrl,
          title: page.title,
          description: page.description,
          ctaLink: ctaLink,
          ctaText: page.ctaText,
        };
      });

      const payload = {
        title,
        slug,
        poster: posterUrl,
        publisher: "Hooke Atelier",
        publisherLogo: "https://usehooke.com.br/favicon.ico",
        description: `Nova curadoria de Stories Hooke. Geometria minimalista e design imersivo.`,
        pages: formattedPages,
      };

      const result = await saveStory(payload, "admin-user");

      if (result.success) {
        toast.success(`Story "${title}" criada e publicada com sucesso!`, {
          icon: <Check className="text-emerald-500" />,
        });
        triggerHaptic("heavy");
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || "Erro desconhecido ao salvar o Story.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Falha ao processar requisição.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop escuro com desfoque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Painel lateral retrátil - Design Soft Brutalist de Alta Performance */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-white border-l-4 border-black z-50 flex flex-col shadow-[-10px_0px_30px_rgba(0,0,0,0.25)] select-none font-['Inter']"
          >
            {/* Header brutalista */}
            <div className="p-6 border-b-2 border-black flex justify-between items-center bg-black text-white shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-400 w-5 h-5 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] font-mono">Story Composer v4.0</h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors rounded-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulário com rolagem */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
              
              {/* Título & Slug */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black">
                      Título do Story ({title.length}/40)
                    </label>
                    <span className={`text-[10px] font-mono ${title.length > 40 ? "text-red-500 font-bold" : "text-zinc-400"}`}>
                      {40 - title.length} restando
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={40}
                    placeholder="EX: CLÁSSICOS REINVENTADOS"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-black text-xs font-bold focus:outline-none focus:bg-white transition-all uppercase tracking-wider rounded-none min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">
                    URL Slug (Coleção no Firestore /stories/[slug])
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex-classicos-reinventados"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-black text-xs font-mono focus:outline-none focus:bg-white transition-all rounded-none min-h-[48px]"
                  />
                </div>
              </div>

              {/* Capa/Pôster Dropzone (3:4) */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-black">
                  Capa Pôster (Proporção Editorial 3:4)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={posterInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePosterUpload(file);
                  }}
                />

                {posterUrl ? (
                  <div className="relative aspect-[3/4] w-48 mx-auto border-4 border-black group shadow-[4px_4px_0px_#000]">
                    <img src={posterUrl} alt="Capa" className="w-full h-full object-cover grayscale" />
                    <button
                      type="button"
                      onClick={() => setPosterUrl("")}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black tracking-widest transition-opacity uppercase"
                    >
                      Alterar Capa
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => posterInputRef.current?.click()}
                    className="border-2 border-dashed border-black/25 bg-zinc-50 hover:bg-zinc-100 hover:border-black aspect-[3/4] w-48 mx-auto flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 min-h-[120px]"
                  >
                    {isUploadingPoster ? (
                      <Loader2 className="w-8 h-8 animate-spin text-black" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-zinc-400" />
                        <span className="text-[9px] font-black tracking-widest uppercase text-zinc-400 text-center px-4">
                          Fazer Upload 3:4
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Lâminas de Produtos */}
              <div className="space-y-6">
                <div className="border-b-2 border-black pb-2 flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">
                    Lâminas Automáticas ({pages.length})
                  </label>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase italic">
                    1 Lâmina por produto selecionado
                  </span>
                </div>

                <div className="space-y-8">
                  {pages.map((page, idx) => (
                    <div
                      key={page.productId}
                      className="border-2 border-black p-4 bg-zinc-50 flex flex-col gap-4 relative shadow-[4px_4px_0px_rgba(0,0,0,0.15)] rounded-none"
                    >
                      {/* Badge do Produto */}
                      <div className="flex items-center justify-between border-b border-black/10 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-black font-mono">
                          Lâmina #{idx + 1}: {page.productName}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowPreviewModal(idx)}
                            className="flex items-center gap-1 text-[9px] font-black bg-zinc-200 border border-black hover:bg-black hover:text-white px-2 py-1 uppercase transition-all"
                          >
                            <Eye size={10} /> Preview
                          </button>
                        </div>
                      </div>

                      {/* Preview Rápido / Mídia */}
                      <div className="flex gap-4">
                        <div className="w-20 aspect-[3/4] border-2 border-black shrink-0 relative bg-zinc-200">
                          {page.mediaUrl ? (
                            <img src={page.mediaUrl} alt="Mídia" className="w-full h-full object-cover grayscale" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">?</div>
                          )}
                        </div>

                        {/* Campos de Edição */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                                Copy Conceitual da Lâmina ({page.description.length}/150)
                              </label>
                            </div>
                            <textarea
                              maxLength={150}
                              rows={3}
                              placeholder="Escreva a essência conceitual deste produto na lâmina..."
                              value={page.description}
                              onChange={(e) => handlePageFieldChange(idx, "description", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-black text-xs font-medium focus:outline-none focus:border-black rounded-none resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                                Express checkout size
                              </label>
                              <select
                                value={page.size}
                                onChange={(e) => handlePageFieldChange(idx, "size", e.target.value)}
                                className="w-full px-2 py-2 bg-white border border-black text-xs font-black rounded-none focus:outline-none min-h-[40px] cursor-pointer"
                              >
                                <option value="P">P</option>
                                <option value="M">M</option>
                                <option value="G">G (Mais Vendido)</option>
                                <option value="GG">GG</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                                Texto do CTA Swipe up
                              </label>
                              <input
                                type="text"
                                value={page.ctaText}
                                onChange={(e) => handlePageFieldChange(idx, "ctaText", e.target.value)}
                                className="w-full px-2 py-2 bg-white border border-black text-xs font-bold rounded-none focus:outline-none uppercase min-h-[40px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            {/* Barra de Ações Inferior Brutalista */}
            <div className="p-6 border-t-2 border-black bg-zinc-50 flex items-center justify-between shrink-0 absolute bottom-0 left-0 right-0 z-10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-black text-[10px] font-black tracking-widest uppercase hover:bg-zinc-200 transition-colors rounded-none min-h-[48px]"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-black text-white text-[10px] font-black tracking-widest uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-[4px_4px_0px_#fff] border-2 border-black rounded-none min-h-[48px] disabled:opacity-50 active:translate-y-px active:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>PUBLICANDO...</span>
                  </>
                ) : (
                  <>
                    <span>SALVAR E DEPLOY DA WEB STORY</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Modal de Mockup de Preview Real-Time para Smartphones */}
          <AnimatePresence>
            {showPreviewModal !== null && pages[showPreviewModal] && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPreviewModal(null)}
                  className="fixed inset-0 bg-black/80"
                />

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative bg-zinc-900 border-4 border-black w-full max-w-[340px] aspect-[9/16] shadow-[10px_10px_0px_#000] overflow-hidden flex flex-col font-['Inter'] rounded-none"
                >
                  {/* Imagem de Fundo (Simula Story do Celular) */}
                  {pages[showPreviewModal].mediaUrl ? (
                    <img
                      src={pages[showPreviewModal].mediaUrl}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.7]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-500">
                      Sem mídia
                    </div>
                  )}

                  {/* Header do Story */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2">
                    <img
                      src="https://usehooke.com.br/favicon.ico"
                      alt="Logo"
                      className="w-5 h-5 rounded-full border border-white"
                    />
                    <div className="text-[10px] text-white font-black tracking-widest drop-shadow uppercase">
                      Hooke Atelier
                    </div>
                    <div className="text-[8px] text-zinc-400 font-mono ml-auto">1s atrás</div>
                  </div>

                  {/* Fechar Preview */}
                  <button
                    onClick={() => setShowPreviewModal(null)}
                    className="absolute top-4 right-4 z-20 text-white bg-black/40 hover:bg-black/80 w-6 h-6 flex items-center justify-center text-[10px] border border-white/20 font-bold"
                  >
                    X
                  </button>

                  {/* Conteúdo inferior com o Copy e CTA */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent pt-16 flex flex-col gap-4 text-white">
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider font-mono">
                        {pages[showPreviewModal].title}
                      </h4>
                      <p className="text-[10px] leading-relaxed text-zinc-300 font-medium">
                        {pages[showPreviewModal].description}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 pt-4">
                      {/* Efeito de Swipe-up dinâmico */}
                      <motion.div
                        animate={{ y: [-4, 4, -4] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest"
                      >
                        ▲ Arraste para Cima
                      </motion.div>

                      <div className="w-full bg-white text-black py-3 text-[10px] font-black uppercase tracking-widest text-center border-2 border-black active:scale-95 transition-transform">
                        {pages[showPreviewModal].ctaText} (TAM: {pages[showPreviewModal].size})
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
