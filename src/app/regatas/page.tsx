import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, Shirt, Wind, Star, ChevronDown, ShieldCheck, Dumbbell, Layers, Sun } from "lucide-react";
import { getProducts } from "@/lib/productServiceServer";

export const metadata = {
 title: `Regatas | Valorize o Shape.`,
 description: "A Regata Canelada Americana que se ajusta ao corpo sem apertar. Corte Machão que destaca os ombros.",
};


export default async function LandingPage() {
 const PRODUTOS = await getProducts();

 // Fallback de segurança para build-time
 if (!PRODUTOS || PRODUTOS.length === 0) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-white">
 <p className="text-gray-500 font-bold tracking-widest text-xs">Carregando catálogo...</p>
 </div>
 );
 }

 // 1. Buscando Produtos Dinamicamente da Store
 const produtoUnitario = PRODUTOS.find(p => p.id === "regata-verde") || PRODUTOS[0];
 const produtoKit3 = PRODUTOS.find(p => p.id === "kit-3-regatas-caneladas") || PRODUTOS[0];
 const produtoKit5 = PRODUTOS.find(p => p.id === "kit-5-regatas-caneladas") || PRODUTOS[0];

 // 2. Formatadores
 const formatarMoeda = (valor: number) => valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00';

 // 3. Cálculos Dinâmicos
 const precoUnitario = produtoUnitario?.price || 0;
 const precoKit3 = produtoKit3?.price || 0;
 const precoKit5 = produtoKit5?.price || 0;

 const precoAntigoKit3 = precoUnitario * 3;
 const economiaKit3 = precoAntigoKit3 - precoKit3;
 const precoPorPecaKit3 = precoKit3 / 3;

 const precoAntigoKit5 = precoUnitario * 5;
 const precoPorPecaKit5 = precoKit5 / 5;

 const CONFIG = {
 // 1. HERO (Topo da Página)
 hero: {
 titulo_principal: "Valorize o Shape.",
 subtitulo: "A Regata Canelada Americana que se ajusta ao corpo sem apertar. Corte Machão que destaca os ombros.",
 nota_social_proof: "4.9/5 - Padrão Internacional",
 imagens_destaque: [
 "/produtos/camiseta-Regata-canelada-verde-1.jpg",
 "/produtos/camiseta-Regata-canelada-areia-1.jpg"
 ], // Agora Array de 2 fotos
 },

 // 2. FAIXA CORRENDO (Marquee)
 faixa_movimento: [
 "Malha Canelada",
 "Ajuste Atlético",
 "Não Deforma",
 "Algodão Premium",
 "Estilo Americano"
 ],

 // 3. COMPARATIVO (Barras) -> Adaptado para Regatas vs Comuns (Opcional, mantendo estrutura)
 comparativo: {
 titulo: "Elasticidade e Retorno",
 meu_produto: { nome: "Hooke Canelada", nivel: "Alta Elasticidade (Ribana)" },
 concorrente_1: { nome: "Algodão Comum", nivel: "Baixa/Deforma" },
 concorrente_2: { nome: "Regata Promocional", nivel: "Fina/Transparente" }
 },

 // 4. PROCESSO (Imagens Lifestyle - Opcional, mantendo estrutura mas com imagens de Regatas)
 processo: [
 { passo: "01", titulo: "Malha Ribana", img: "/produtos/camiseta-Regata-canelada-verde-1.jpg" },
 { passo: "02", titulo: "Corte Machão", img: "/produtos/camiseta-Regata-canelada-marrom-1.jpg" },
 { passo: "03", titulo: "Gola Reforçada", img: "/produtos/camiseta-Regata-canelada-areia-1.jpg" },
 { passo: "04", titulo: "Acabamento Premium", img: "/produtos/regata-lifestyle-bege.jpg" }
 ],

 // 5. BENEFÍCIOS (Bento Grid / 4 Blocos)
 beneficios: [
 {
 titulo: "Fit Atlético",
 texto: "Corte estratégico que valoriza os ombros e dorsais. O ajuste certo para quem treina.",
 icone: Dumbbell
 },
 {
 titulo: "Textura Premium",
 texto: "Malha ribana com elastano que estica e volta ao formato original. Não deforma com o uso.",
 icone: Layers
 },
 {
 titulo: "Frescor Total",
 texto: "Algodão respirável que deixa a pele transpirar. Ideal para treinos intensos ou dias quentes.",
 icone: Wind
 },
 {
 titulo: "Versatilidade",
 texto: "Design limpo que vai do treino pesado ao churrasco de fim de semana com estilo.",
 icone: Sun // Usando Sun para ideia de dia a dia/verão
 }
 ],

 // 6. GALERIA LIFESTYLE (4 Fotos no final)
 galeria: [
 "/produtos/camiseta-Regata-canelada-verde-2.jpg",
 "/produtos/camiseta-Regata-canelada-marrom-2.jpg",
 "/produtos/camiseta-Regata-canelada-areia-2.jpg",
 "/produtos/regata-lifestyle-bege.jpg" // Reutilizando a imagem lifestyle
 ],

 // 7. OFERTA (KITS DE VENDA)
 ofertas: {
 titulo: "Escolha seu Arsenal",
 subtitulo: "Envio Imediato para todo o Brasil",

 // CARD 1 (ESQUERDA - UNITÁRIO)
 basico: {
 nome: "Unitário",
 descricao: "Para conhecer a qualidade.",
 preco_por_peca: formatarMoeda(precoUnitario),
 link_compra: "/colecao",
 frete_texto: "A calcular"
 },

 // CARD 2 (CENTRO - DESTAQUE KIT 3)
 destaque: {
 badge: "Mais Vendido",
 nome: "Kit 3 Regatas",
 descricao: "As 3 cores essenciais.",
 preco_antigo: formatarMoeda(precoAntigoKit3),
 preco_atual: formatarMoeda(precoKit3),
 economia: `Economize ${formatarMoeda(economiaKit3)}`,
 preco_por_peca: formatarMoeda(precoPorPecaKit3),
 frete_texto: "Grátis",
 link_compra: "/colecao"
 },

 // CARD 3 (DIREITA - KIT 5)
 pro: {
 nome: "Kit Semana",
 descricao: "5 Peças para o dia a dia.",
 preco_antigo: formatarMoeda(precoAntigoKit5),
 preco_atual: formatarMoeda(precoKit5),
 tag_extra: `Melhor Preço: ${formatarMoeda(precoPorPecaKit5)}/peça`,
 frete_texto: "Grátis",
 link_compra: "/colecao"
 }
 },

 // 8. FAQ (PERGUNTAS FREQUENTES)
 faq: [
 { q: "A regata encolhe?", a: "Não. Nossa malha passa por pré-encolhimento industrial. O tamanho que você compra é o que fica." },
 { q: "É muito cavada?", a: "Não. O corte 'Machão' é equilibrado: valoriza os ombros sem expor demais o peitoral." },
 { q: "Qual o tecido?", a: "Malha Canelada (Ribana) de alta qualidade com elastano para conforto e durabilidade." },
 { q: "Posso trocar se não servir?", a: "Claro! A primeira troca é grátis e o processo é super rápido." }
 ]
 };

 return (
 <main className="w-full bg-white min-h-screen font-sans scroll-smooth" >

 {/* 1. HERO SECTION */}
 < section className="w-full pt-20 pb-0 text-center bg-white overflow-hidden" >
 <div className="max-w-4xl mx-auto px-6 mb-12 animate-in slide-in-from-bottom-8 duration-1000">
 <div className="w-12 h-12 mx-auto bg-hooke-900 text-white flex items-center justify-center mb-6 rounded-none shadow-lg">
 <Shirt size={24} strokeWidth={1} />
 </div>
 <h1 className="text-5xl md:text-7xl font-black text-hooke-900 tracking-tighter leading-tight mb-6" dangerouslySetInnerHTML={{ __html: CONFIG.hero.titulo_principal.replace('\n', '<br/>') }}>
 </h1>
 <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto">
 {CONFIG.hero.subtitulo}
 </p>

 <div className="mt-8 flex justify-center gap-1 items-center">
 <div className="flex text-hooke-900">
 {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
 </div>
 <span className="text-xs font-bold tracking-widest ml-3 text-gray-400 border-l border-gray-300 pl-3">
 {CONFIG.hero.nota_social_proof}
 </span>
 </div>
 </div>

 {/* HELO SECTION COM DUAS FOTOS */}
 <div className="grid grid-cols-1 md:grid-cols-2 h-[60vh] md:h-[80vh] w-full" >
 {
 CONFIG.hero.imagens_destaque.map((img, i) => (
 <div key={i} className="relative w-full h-full bg-gray-50 group overflow-hidden">
 <Image
 src={img}
 alt={`Hero Image ${i + 1}`}
 fill
 className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
 priority={i === 0}
 />
 <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/50 to-transparent md:bg-none" />
 </div>
 ))
 }
 </div >
 </section >

 {/* 2. MARQUEE */}
 < div className="bg-hooke-900 py-4 overflow-hidden border-y border-black" >
 <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
 {Array(4).fill(CONFIG.faixa_movimento).flat().map((texto, i) => (
 <div key={i} className="flex items-center gap-4 opacity-80">
 <span className="text-white text-xs font-black tracking-[0.2em]">{texto}</span>
 <div className="w-1 h-1 bg-gray-500 rounded-none" />
 </div>
 ))}
 </div>
 </div >

 {/* 3. GRÁFICO COMPARATIVO */}
 < section className="w-full py-24 px-6 md:px-12 bg-white hidden md:block" > {/* Oculto em mobile se quiser simplificar, mas mantendo a estrutura */}
 < div className="max-w-3xl mx-auto" >
 <h2 className="text-3xl font-black text-center tracking-tighter mb-16">
 {CONFIG.comparativo.titulo}
 </h2>

 <div className="space-y-12">
 <div className="group cursor-default">
 <div className="flex justify-between text-sm font-bold tracking-widest mb-2">
 <span className="text-hooke-900 group-hover:scale-105 transition-transform origin-left">{CONFIG.comparativo.meu_produto.nome}</span>
 <span className="text-green-600 font-black">{CONFIG.comparativo.meu_produto.nivel}</span>
 </div>
 <div className="w-full h-4 bg-gray-100 rounded-none overflow-hidden">
 <div className="h-full bg-hooke-900 w-full animate-[width_1.5s_ease-out]"></div>
 </div>
 </div>

 <div className="opacity-60">
 <div className="flex justify-between text-sm font-medium tracking-widest mb-2">
 <span className="text-gray-500">{CONFIG.comparativo.concorrente_1.nome}</span>
 <span className="text-gray-400">{CONFIG.comparativo.concorrente_1.nivel}</span>
 </div>
 <div className="w-full h-4 bg-gray-100 rounded-none">
 <div className="h-full bg-gray-400 w-[70%]"></div>
 </div>
 </div>

 <div className="opacity-40">
 <div className="flex justify-between text-sm font-medium tracking-widest mb-2">
 <span className="text-gray-500">{CONFIG.comparativo.concorrente_2.nome}</span>
 <span className="text-gray-400">{CONFIG.comparativo.concorrente_2.nivel}</span>
 </div>
 <div className="w-full h-4 bg-gray-100 rounded-none">
 <div className="h-full bg-gray-300 w-[40%]"></div>
 </div>
 </div>
 </div>
 </div >
 </section >

 {/* 4. PROCESSO DE PRODUÇÃO */}
 < section className="w-full" >
 <div className="grid grid-cols-2 md:grid-cols-4 h-64 md:h-80">
 {CONFIG.processo.map((item, idx) => (
 <div key={idx} className="relative group border-r border-white/10 overflow-hidden">
 <Image priority src={item.img} alt={item.titulo} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
 <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center text-white text-center p-4">
 <span className="text-[10px] font-bold tracking-widest mb-2 border border-white/30 px-2 py-1">Step {item.passo}</span>
 <h3 className="text-lg md:text-xl font-black tracking-tight">{item.titulo}</h3>
 </div>
 </div>
 ))}
 </div>
 </section >

 {/* 5. BENEFÍCIOS (Bento Grid Style) */}
 < section className="w-full bg-gray-50 py-24 px-6" >
 <div className="max-w-4xl mx-auto space-y-24">
 <h2 className="text-3xl font-black text-center tracking-tighter mb-16">Destaques</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
 {CONFIG.beneficios.map((item, i) => (
 <div key={i} className="text-center group p-6 border border-transparent hover:border-gray-200 transition-all hover:bg-white hover:shadow-sm">
 <div className="w-20 h-20 mx-auto bg-white border border-gray-200 flex items-center justify-center mb-6 rounded-none group-hover:bg-hooke-900 group-hover:text-white transition-colors duration-500 shadow-sm">
 <item.icone size={32} strokeWidth={1} />
 </div>
 <h3 className="text-2xl font-black tracking-tighter mb-4">{item.titulo}</h3>
 <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{item.texto}</p>
 </div>
 ))}
 </div>
 </div>
 </section >

 {/* 6. GALERIA LIFESTYLE */}
 < section className="w-full" >
 <div className="grid grid-cols-2 md:grid-cols-4 h-[50vh] md:h-[60vh]">
 {CONFIG.galeria.map((src, idx) => (
 <div key={idx} className="relative border-r border-white/20 overflow-hidden group">
 <Image priority src={src} alt="Lifestyle" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
 </div>
 ))}
 </div>
 </section >

 {/* 7. CTA / KITS */}
 < section id="comprar" className="w-full px-6 md:px-12 py-24 bg-white" >
 <h2 className="text-4xl md:text-6xl font-black text-center tracking-tighter mb-6">
 {CONFIG.ofertas.titulo}
 </h2>
 <p className="text-center text-gray-400 text-xs font-bold tracking-widest mb-16">
 <span className="inline-flex items-center gap-2"><ShieldCheck size={14} /> {CONFIG.ofertas.subtitulo}</span>
 </p>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">

 {/* CARD BÁSICO */}
 <div className="bg-white border border-gray-200 p-10 flex flex-col items-center hover:border-black transition-all duration-300 h-auto">
 <h3 className="text-sm font-bold tracking-widest text-hooke-900 mb-4">{CONFIG.ofertas.basico.nome}</h3>
 <p className="text-[10px] text-gray-400 font-medium mb-8">{CONFIG.ofertas.basico.descricao}</p>
 <div className="mb-10 text-center">
 <span className="text-4xl font-black text-hooke-900 tracking-tight">{CONFIG.ofertas.basico.preco_por_peca}</span>
 <span className="block text-[10px] text-gray-400 font-bold mt-2">/peça</span>
 </div>
 <div className="w-full border-t border-gray-100 pt-6 mb-8">
 <div className="flex justify-between text-xs text-gray-500 mb-2">
 <span>Frete</span> <span className="font-bold">{CONFIG.ofertas.basico.frete_texto}</span>
 </div>
 </div>
 <Link href={CONFIG.ofertas.basico.link_compra} className="w-full py-4 border border-gray-200 text-xs font-bold tracking-widest hover:border-black hover:bg-black hover:text-white transition-all text-center">
 Comprar 1 Peça
 </Link>
 </div>

 {/* CARD DESTAQUE */}
 <div className="bg-black text-white p-12 flex flex-col items-center relative shadow-2xl transform md:scale-110 z-10 border border-black">
 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-1 text-[10px] font-bold tracking-widest shadow-sm">
 {CONFIG.ofertas.destaque.badge}
 </div>
 <h3 className="text-lg font-bold tracking-widest mb-4 mt-2">{CONFIG.ofertas.destaque.nome}</h3>
 <p className="text-[10px] text-gray-400 font-medium mb-8">{CONFIG.ofertas.destaque.descricao}</p>
 <div className="mb-8 text-center flex flex-col items-center">
 <span className="text-xs text-gray-500 line-through mb-1">{CONFIG.ofertas.destaque.preco_antigo}</span>
 <span className="text-6xl font-black text-white tracking-tight">{CONFIG.ofertas.destaque.preco_atual}</span>
 <span className="bg-green-600 text-white text-[10px] font-bold px-3 py-1 mt-4 tracking-widest">
 {CONFIG.ofertas.destaque.economia}
 </span>
 </div>
 <div className="w-full border-t border-gray-800 pt-6 mb-8">
 <div className="flex justify-between text-xs text-gray-400 mb-2">
 <span className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Frete</span>
 <span className="font-bold text-white">{CONFIG.ofertas.destaque.frete_texto}</span>
 </div>
 <div className="flex justify-between text-xs text-gray-400">
 <span className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Preço/Peça</span>
 <span className="font-bold text-white">{CONFIG.ofertas.destaque.preco_por_peca}</span>
 </div>
 </div>
 <Link href={CONFIG.ofertas.destaque.link_compra} className="flex items-center justify-center gap-2 w-full py-5 bg-white text-black text-xs font-bold tracking-widest hover:bg-gray-200 transition-colors">
 Comprar Kit de 3 <ArrowRight size={14} />
 </Link>
 </div>

 {/* CARD PRO */}
 <div className="bg-white border border-gray-200 p-10 flex flex-col items-center hover:border-black transition-all duration-300 h-auto">
 <h3 className="text-sm font-bold tracking-widest text-hooke-900 mb-4">{CONFIG.ofertas.pro.nome}</h3>
 <p className="text-[10px] text-gray-400 font-medium mb-8">{CONFIG.ofertas.pro.descricao}</p>
 <div className="mb-10 text-center flex flex-col items-center">
 <span className="text-xs text-gray-400 line-through mb-1">{CONFIG.ofertas.pro.preco_antigo}</span>
 <span className="text-4xl font-black text-hooke-900 tracking-tight">{CONFIG.ofertas.pro.preco_atual}</span>
 <span className="text-green-600 text-[10px] font-bold tracking-widest mt-2">
 {CONFIG.ofertas.pro.tag_extra}
 </span>
 </div>
 <div className="w-full border-t border-gray-100 pt-6 mb-8">
 <div className="flex justify-between text-xs text-gray-500 mb-2">
 <span>Frete</span> <span className="font-bold">{CONFIG.ofertas.pro.frete_texto}</span>
 </div>
 </div>
 <Link href={CONFIG.ofertas.pro.link_compra} className="w-full py-4 border border-gray-200 text-xs font-bold tracking-widest hover:border-black hover:bg-black hover:text-white transition-all text-center">
 Montar Kit de 5
 </Link>
 </div>

 </div>
 </section >

 {/* 8. FAQ */}
 < section className="w-full px-6 md:px-12 py-24 bg-gray-50" >
 <div className="max-w-3xl mx-auto">
 <h2 className="text-2xl font-black text-center tracking-tighter mb-12">Dúvidas Frequentes</h2>
 <div className="space-y-4">
 {CONFIG.faq.map((faq, idx) => (
 <div key={idx} className="bg-white border border-gray-200 p-6 hover:border-gray-400 transition-colors cursor-pointer group">
 <h3 className="text-xs font-bold tracking-widest mb-2 flex justify-between items-center text-hooke-900 group-hover:text-black">
 {faq.q} <ChevronDown size={14} />
 </h3>
 <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
 </div>
 ))}
 </div>
 </div>
 </section >

 {/* Sticky Bar Mobile */}
 < div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 md:hidden z-50 flex items-center justify-between shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]" >
 <div className="flex flex-col">
 <span className="text-[10px] font-bold text-gray-400">Kit 3 Regatas</span>
 <span className="text-lg font-black text-hooke-900">{formatarMoeda(precoKit3)}</span>
 </div>
 <a href="#comprar" className="bg-hooke-900 text-white px-8 py-3 text-xs font-bold tracking-widest shadow-lg">
 Comprar Agora
 </a>
 </div >

 </main >
 );
}
