"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { Product } from "@/types";

const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Foca o input ao abrir
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Fecha com ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setTotal(0); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setTotal(data.total || 0);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce 300ms
  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar produtos"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Campo de Busca */}
        <form onSubmit={handleSubmit} className="flex items-center border-b-2 border-black">
          <div className="pl-5 shrink-0" aria-hidden="true">
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-zinc-400" />
            ) : (
              <Search size={18} className="text-zinc-400" />
            )}
          </div>
          <label htmlFor="search-input-modal" className="sr-only">
            Buscar peças
          </label>
          <input
            id="search-input-modal"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar camisetas, cores, tamanhos..."
            className="flex-1 px-4 py-4 text-base font-medium text-black bg-transparent focus:outline-none placeholder-zinc-300"
          />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-4 text-zinc-400 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
            aria-label="Fechar busca"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </form>

        {/* Resultados */}
        <AnimatePresence>
          {query.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden max-h-[60vh] overflow-y-auto"
            >
              {results.length === 0 && !isLoading ? (
                <div className="p-8 text-center">
                  <p className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-300 mb-2">SEM RESULTADOS</p>
                  <p className="text-sm text-zinc-500">Nenhuma peça encontrada para "{query}".</p>
                </div>
              ) : (
                <div>
                  {/* Lista de Resultados */}
                  <div className="divide-y divide-black/5">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/produto/${product.slug || product.id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                      >
                        {/* Thumb */}
                        <div className="relative w-12 h-16 bg-zinc-100 shrink-0 overflow-hidden">
                          {product.imageUrl ? (
                            <CldImage
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover object-top"
                              deliveryType="fetch"
                              format="avif"
                              quality="auto"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-200" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-tight truncate">{product.name}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{product.category}</p>
                        </div>

                        {/* Preço */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[12px] font-black">{formatter.format(product.price)}</span>
                          <ArrowRight size={13} className="text-zinc-300 group-hover:text-black transition-colors group-hover:translate-x-0.5 transform" aria-hidden="true" />
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Ver Todos */}
                  {total > results.length && (
                    <div className="border-t-2 border-black">
                      <Link
                        href={`/busca?q=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="flex items-center justify-between px-5 py-3.5 bg-black text-white hover:bg-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hooke-900 focus-visible:ring-offset-2"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Ver todos os {total} resultados para "{query}"
                        </span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
