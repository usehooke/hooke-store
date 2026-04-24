"use client";

import { Star, CheckCircle2 } from "lucide-react";

interface Review {
 id: string;
 author: string;
 rating: number;
 date: string;
 comment: string;
 verified: boolean;
 avatar?: string;
}

const mockReviews: Review[] = [
 {
 id: "1",
 author: "Ricardo M.",
 rating: 5,
 date: "2 dias atrás",
 comment: "A qualidade da Suedine é simplesmente surreal. O caimento oversized ficou perfeito, exatamente como nas fotos. Recomendo demais.",
 verified: true,
 },
 {
 id: "2",
 author: "Thiago S.",
 rating: 5,
 date: "1 semana atrás",
 comment: "Comprei o kit de 3 e não me arrependi. O toque do algodão é muito superior ao que encontramos por aí. A gola é bem estruturada.",
 verified: true,
 },
 {
 id: "3",
 author: "Felipe G.",
 rating: 4,
 date: "2 semanas atrás",
 comment: "Gostei bastante da modelagem. Só demorou um pouquinho mais pra chegar aqui no sul, mas valeu a espera pela qualidade.",
 verified: true,
 }
];

export default function ProductReviews() {
 return (
 <div className="mt-24 border-t border-gray-100 pt-16 font-sans">
 <div className="flex flex-col md:flex-row justify-between items-start gap-12">
 <div className="max-w-xs">
 <h2 className="text-2xl font-black text-hooke-900 tracking-tight mb-4 leading-tight">
 O que dizem os Hookes
 </h2>
 <div className="flex items-center gap-3 mb-2">
 <span className="text-5xl font-black text-hooke-900">4.9</span>
 <div>
 <div className="flex text-yellow-400 mb-1">
 {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" stroke="none" />)}
 </div>
 <p className="text-[10px] font-bold text-gray-400 tracking-widest">Baseado em 127 avaliações</p>
 </div>
 </div>
 <p className="text-xs text-gray-500 leading-relaxed mt-4">
 98% dos clientes recomendam este produto pela qualidade do tecido e modelagem exclusiva.
 </p>
 </div>

 <div className="flex-1 space-y-8">
 {mockReviews.map((review) => (
 <div key={review.id} className="border-b border-gray-50 pb-8 last:border-0">
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-gray-100 rounded-none flex items-center justify-center text-hooke-900 font-bold text-xs">
 {review.author.charAt(0)}
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h4 className="font-bold text-sm text-hooke-900">{review.author}</h4>
 {review.verified && (
 <div className="flex items-center gap-1 text-[8px] font-bold text-green-600 tracking-widest bg-green-50 px-1.5 py-0.5 rounded-none">
 <CheckCircle2 size={8} />
 Verificado
 </div>
 )}
 </div>
 <div className="flex text-yellow-400 mt-0.5">
 {[1, 2, 3, 4, 5].map(i => (
 <Star key={i} size={10} fill={i <= review.rating ? "currentColor" : "none"} stroke={i <= review.rating ? "none" : "currentColor"} />
 ))}
 </div>
 </div>
 </div>
 <span className="text-[10px] text-gray-400 font-medium ">{review.date}</span>
 </div>
 <p className="text-sm text-gray-600 leading-relaxed italic">
 &quot;{review.comment}&quot;
 </p>
 </div>
 ))}
 
 <button className="w-full md:w-auto mt-4 px-8 py-3 bg-gray-50 text-hooke-900 text-[10px] font-black tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
 Ver todas as avaliações
 </button>
 </div>
 </div>
 </div>
 );
}
