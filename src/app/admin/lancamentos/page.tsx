import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Rocket, Camera, ExternalLink, Image as ImageIcon, Send } from "lucide-react";
import { getProducts } from "@/lib/productService";

export default async function AdminLancamentos() {
 const products = await getProducts();
 const lancamentos = products.filter(p => p.isNew && (!p.launchExpiry || p.launchExpiry > Date.now()));

 return (
 <div className="min-h-screen bg-white font-sans p-6 md:p-12">
 <div className="max-w-6xl mx-auto">
 
 {/* Header */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 pb-8 border-b border-zinc-100">
 <div>
 <Link href="/admin" className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors text-xs font-bold tracking-widest mb-4">
 <ArrowLeft size={14} /> Voltar ao Painel
 </Link>
 <h1 className="text-4xl font-black tracking-tighter ">Gestão de Lançamentos</h1>
 <p className="text-zinc-500 text-sm mt-2">Crie páginas prêmium para seus novos produtos em segundos.</p>
 </div>
 <div className="flex gap-4">
 <a 
 href="https://gemini.google.com/app" 
 target="_blank" 
 rel="noopener noreferrer"
 className="flex items-center gap-2 px-6 py-4 bg-zinc-100 text-black text-[10px] font-bold tracking-widest hover:bg-zinc-200 transition-all shadow-sm"
 >
 <Camera size={14} /> Abrir Gemini (Gem)
 </a>
 </div>
 </div>

 {/* Workflow Guide */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
 <div className="bg-zinc-50 p-8 border border-zinc-100 relative overflow-hidden group">
 <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <Camera size={120} strokeWidth={1}/>
 </div>
 <span className="text-4xl font-black text-zinc-200 block mb-4">01</span>
 <h3 className="text-sm font-bold tracking-widest mb-4">Gere as Imagens</h3>
 <p className="text-xs text-zinc-500 leading-relaxed">
 Use o seu &quot;Gem Fotografia Hooke Store&quot; no Google Advanced para criar as 5 fotos do catálogo e o banner hero (16:9).
 </p>
 </div>

 <div className="bg-zinc-50 p-8 border border-zinc-100 relative overflow-hidden group">
 <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <ImageIcon size={120} strokeWidth={1}/>
 </div>
 <span className="text-4xl font-black text-zinc-200 block mb-4">02</span>
 <h3 className="text-sm font-bold tracking-widest mb-4">Cadastre no Catálogo</h3>
 <p className="text-xs text-zinc-500 leading-relaxed">
 No Tiny (ou `catalogo.ts`), cadastre o produto com a tag `isNew: true` e adicione as 5 URLs das fotos na galeria (`images`).
 </p>
 </div>

 <div className="bg-zinc-50 p-8 border border-zinc-100 relative overflow-hidden group">
 <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <Send size={120} strokeWidth={1}/>
 </div>
 <span className="text-4xl font-black text-zinc-200 block mb-4">03</span>
 <h3 className="text-sm font-bold tracking-widest mb-4">Divulgue o Link</h3>
 <p className="text-xs text-zinc-500 leading-relaxed">
 Acesse o link do produto abaixo. O site já montou a Landing Page automaticamente seguindo o padrão de luxo.
 </p>
 </div>
 </div>

 {/* Product List */}
 <div className="bg-white">
 <div className="flex items-center gap-3 mb-8">
 <Rocket size={20} className="text-zinc-300" />
 <h2 className="text-xl font-bold tracking-[0.2em]">Lançamentos Ativos</h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {lancamentos.length > 0 ? lancamentos.map(p => (
 <div key={p.id} className="border border-zinc-100 p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-black transition-all">
 <div className="relative w-24 h-24 bg-zinc-100 flex-shrink-0">
 <Image priority src={p.imageUrl} alt={p.name} fill className="object-cover" />
 </div>
 <div className="flex-grow text-center md:text-left">
 <h4 className="text-xs font-bold tracking-widest text-zinc-400 mb-1">{p.category}</h4>
 <h3 className="text-lg font-black tracking-tight mb-4">{p.name}</h3>
 <div className="flex flex-wrap gap-2 justify-center md:justify-start">
 <Link 
 href={`/lancamento/${p.slug}`}
 target="_blank"
 className="inline-flex items-center gap-2 px-4 py-2 border border-black text-[10px] font-bold tracking-widest hover:bg-black hover:text-white transition-all"
 >
 Ver Landing Page <ExternalLink size={12} />
 </Link>
 <Link 
 href={`/produto/${p.slug}`}
 target="_blank"
 className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-500 text-[10px] font-bold tracking-widest hover:bg-zinc-200 transition-all"
 >
 Página da Loja
 </Link>
 </div>
 </div>
 </div>
 )) : (
 <div className="col-span-2 py-20 border border-dashed border-zinc-200 text-center">
 <p className="text-zinc-400 text-xs font-bold tracking-widest">Nenhum lançamento ativo no momento.</p>
 <p className="text-zinc-300 text-[10px] mt-2">Marque um produto como `isNew: true` para vê-lo aqui por 30 dias.</p>
 </div>
 )}
 </div>
 </div>

 </div>
 </div>
 );
}
