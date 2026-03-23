import { getProducts } from "@/lib/productService";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Coleção Completa | Hooke",
 description: "Descubra a coleção completa de camisetas oversized, regatas e kits premium.",
};

export const revalidate = 0;

export default async function CollectionPage() {
 // Pega os dados do Firestore através do Serviço Centralizado
 const collectionProducts = await getProducts();

 return (
 <div className="bg-white min-h-screen pb-20">

 {/* 1. CABEÇALHO (Full Width & Editorial) */}
 <div className="w-full px-6 md:px-12 pt-12 md:pt-24 pb-12">

 {/* Caminho (Breadcrumb) - Alinhado à esquerda */}
 <div className="flex items-center gap-2 text-[10px] tracking-widest text-hooke-400 mb-6 font-sans">
 <Link href="/" className="hover:text-hooke-900 transition-colors border-b border-transparent hover:border-hooke-900 pb-0.5">
 Home
 </Link>
 <ChevronRight size={10} />
 <span className="text-hooke-900 font-bold">Shop</span>
 </div>

 <div className="flex flex-col md:flex-row justify-between items-end gap-8">
 <div className="max-w-2xl">
 {/* Título Impactante (Estilo Suíço) */}
 <h1 className="text-4xl md:text-6xl font-black text-hooke-900 tracking-tighter leading-[0.9] mb-6">
 Coleção <br /> Essencial
 </h1>

 {/* Descrição */}
 <p className="font-sans text-sm text-gray-500 leading-relaxed max-w-lg">
 O básico elevado à perfeição. Camisetas desenvolvidas com Suedine 240g, Algodão Egípcio sustentável e modelagem que valoriza o corpo masculino sem esforço.
 </p>
 </div>
 </div>
 </div>

 {/* 2. BARRA DE FERRAMENTAS (Sticky & Sharp) */}
 <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-t border-b border-gray-100">
 <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center">

 <span className="text-xs font-bold tracking-widest text-hooke-500 font-sans">
 {collectionProducts.length} Produtos
 </span>

 {/* Botão de Filtro (Visual apenas por enquanto, ou funcional se adicionar lógica) */}
 <button className="flex items-center gap-2 text-xs font-bold tracking-widest text-hooke-900 hover:bg-gray-100 px-4 py-2 transition-colors border border-transparent hover:border-gray-200">
 <SlidersHorizontal size={14} />
 <span className="hidden sm:inline">Filtrar</span>
 </button>
 </div>
 </div>

 {/* 3. GRADE DE PRODUTOS (Full Width) */}
 <div className="w-full px-6 md:px-12 py-12">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 animate-in fade-in duration-1000 slide-in-from-bottom-8">
 {collectionProducts.map((product) => (
 <ProductCard key={product.id} product={product} />
 ))}
 </div>
 </div>

 {/* 4. BANNER FINAL (Rodapé da Categoria) */}
 <div className="w-full px-6 md:px-12 mt-12">
 <div className="bg-hooke-50 border border-hooke-100 py-16 text-center">
 <h3 className="text-xl font-bold tracking-tight mb-2 text-hooke-900">
 Qualidade Garantida
 </h3>
 <p className="text-gray-500 text-xs mb-0 tracking-widest">
 Feito no Brasil com Algodão Egípcio Certificado
 </p>
 </div>
 </div>

 </div>
 );
}