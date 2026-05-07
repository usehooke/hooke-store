"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { get, set } from "idb-keyval";

interface SocialPost {
 id: string | number;
 imageUrl: string;
 link: string;
 alt: string;
}

// Fallback Mock (Usando imagens reais do catalogo para evitar 404/400)
const SOCIAL_POSTS: SocialPost[] = [
 {
 id: 1,
 imageUrl: "/produtos/hk_prod_ov_black_03.avif",
 link: "/produto/camiseta-oversized-preta-premium",
 alt: "Homem usando camiseta oversized preta Hooke",
 },
 {
 id: 2,
 imageUrl: "/produtos/hk_prod_re_military_hero.avif",
 link: "/produto/regata-canelada-verde",
 alt: "Homem usando regata canelada verde Hooke",
 },
 {
 id: 3,
 imageUrl: "/produtos/hk_prod_re_lifestyle_bege_01.jpg",
 link: "/produto/regata-lifestyle-bege",
 alt: "Homem usando regata lifestyle bege Hooke",
 },
 {
 id: 4,
 imageUrl: "/produtos/hk_prod_vi_fusca_editorial_01.png",
 link: "/produto/camiseta-vintage-fusca-preta",
 alt: "Homem usando camiseta vintage fusca preta",
 },
 {
 id: 5,
 imageUrl: "/produtos/hk_prod_ov_offwhite_01.avif",
 link: "/produto/camiseta-oversized-offwhite-premium",
 alt: "Homem usando camiseta oversized off-white Hooke",
 },
];

const CACHE_KEY = 'hooke_instagram_feed_v2'; // Nova chave para IDB
const OLD_CACHE_KEY = 'hooke_instagram_feed';
const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 horas

export default function SocialFeed() {
 const [feedPhotos, setFeedPhotos] = useState<SocialPost[]>(SOCIAL_POSTS);

 useEffect(() => {
 const fetchFeed = async () => {
  // ⚡ ARQUEOLOGIA: Limpeza do localStorage antigo (Limpa tudo!)
  if (typeof window !== 'undefined' && localStorage.getItem(OLD_CACHE_KEY)) {
    localStorage.removeItem(OLD_CACHE_KEY);
  }

  // 1. Tenta carregar do IndexedDB (Offline-First)
  try {
    const cached: any = await get(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = cached;
      if (Date.now() - timestamp < CACHE_DURATION) {
        setFeedPhotos(data);
        return; 
      }
    }
  } catch (e) {
    console.warn("IDB fetch error:", e);
  }

  // 2. Busca da nossa API interna
  try {
  const res = await fetch('/api/instagram');
  if (!res.ok) throw new Error("API Error");
  const json = await res.json();
  const data = json.feed;
  
  if (data && data.length > 0) {
  setFeedPhotos(data);
  // 3. Salva no IndexedDB
  await set(CACHE_KEY, {
    data,
    timestamp: Date.now()
  });
  }
  } catch (error) {
  console.error("Instagram Feed Local Error:", error);
  }
 };

 fetchFeed();
 }, []);

 return (
 <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
 {/* Cabeçalho da Seção */}
 <div className="flex flex-col items-center justify-center mb-12 px-6 text-center">
 <motion.a
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 href="https://instagram.com/use.hooke"
 target="_blank"
 rel="noopener noreferrer"
 className="group flex flex-col items-center gap-3"
 >
 <div className="bg-gray-50 p-4 rounded-none text-hooke-900 group-hover:bg-hooke-900 group-hover:text-white transition-colors duration-300">
 <Instagram size={28} strokeWidth={1.5} />
 </div>
 <div>
 <span className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-1 block">
 Siga os Bastidores
 </span>
 <h2 className="text-2xl md:text-3xl font-black text-hooke-900 tracking-tighter hover:opacity-80 transition-opacity">
 @use.hooke
 </h2>
 </div>
 </motion.a>
 </div>

 {/* Grid de Fotos / Carousel Imersivo (v1.5) */}
 <div className="w-full relative px-0 md:px-6">
 <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-0 md:gap-4 pb-0 md:pb-0 snap-x snap-mandatory hide-scrollbar">
 {feedPhotos.map((post: SocialPost, index: number) => (
 <motion.div
 key={post.id}
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="min-w-full md:min-w-0"
 >
 <Link
 href={post.link}
 className="relative w-full h-[100dvh] md:h-auto md:aspect-[4/5] bg-gray-100 block group overflow-hidden snap-center flex-shrink-0"
 >
 <Image
 src={post.imageUrl}
 alt={post.alt}
 fill
 className="object-cover transition-transform duration-700 md:group-hover:scale-110"
 sizes="(max-width: 768px) 100vw, 20vw"
 priority={index === 0}
 />

 {/* Overlay On Hover (Desktop Only) */}
 <div className="absolute inset-0 bg-black/40 md:bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end md:items-center justify-start md:justify-center p-8 md:p-0">
 <div className="md:transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300 text-white flex flex-col items-start md:items-center gap-2">
 <div className="flex items-center gap-2">
 <Instagram size={24} strokeWidth={1.5} className="md:hidden" />
 <Instagram size={32} strokeWidth={1.5} className="hidden md:block" />
 <span className="text-[10px] md:text-[12px] tracking-[0.3em] font-black">
 Comprar Look
 </span>
 </div>
 </div>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}
