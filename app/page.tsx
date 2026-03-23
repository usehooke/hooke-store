import { getFeaturedProducts } from "@/lib/productService";

export const revalidate = 0;

import BentoHero from "@/components/home/BentoHero";
import BrandMarquee from "@/components/ui/BrandMarquee";
import ProductCard from "@/components/shop/ProductCard";
import BrandBento from "@/components/home/BrandBento";
import SocialFeed from "@/components/home/SocialFeed";
import VIPGreeting from "@/components/home/VIPGreeting";
import RecentlyViewed from "@/components/shop/RecentlyViewed";

export default async function Home() {
 // Pega os primeiros 8 produtos em destaque do banco
 const showcaseProducts = await getFeaturedProducts(8);

 return (
 <main className="bg-white min-h-screen">
 <VIPGreeting />

 {/* 1. HERO BENTO (Full Width - Lê do catálogo) */}
 <BentoHero />

 {/* 2. BARRA (Marcas/Conceitos) */}
 <BrandMarquee />

 {/* 3. LISTA DE PRODUTOS (Vitrine Principal) */}
 <section id="colecao" className="py-24 px-6 md:px-12 w-full">
 <div className="flex flex-col md:flex-row justify-between items-end mb-12">
 <div>
 <span className="text-xs font-bold tracking-[0.2em] text-hooke-500 mb-2 block font-sans">
 Shop The Look
 </span>
 <h2 className="text-3xl md:text-4xl font-black text-hooke-900 tracking-tighter mb-4 font-sans">
 Coleção Essencial
 </h2>
 </div>
 {/* Linha decorativa */}
 <div className="h-px bg-gray-200 flex-1 mx-8 hidden md:block mb-6"></div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
 {showcaseProducts.map(product => (
 <ProductCard key={product.id} product={product} />
 ))}
 </div>
 </section>

 {/* 4. VISTOS RECENTEMENTE (VIP EXPERIENCE) */}
 <RecentlyViewed />

 {/* 5. VITRINE SOCIAL (INSTAGRAM) */}
 <SocialFeed />

 {/* 5. AUTORIDADE (Filosofia da Marca) */}
 <div className="bg-hooke-50 border-t border-hooke-100">
 <BrandBento />
 </div>

 </main>
 );
}