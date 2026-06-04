export default function TopBar() {
 return (
 <div suppressHydrationWarning className="bg-hooke-900 text-white overflow-hidden relative z-50 border-b border-gray-800 h-9">
 {/* Container que desliza */}
 <div suppressHydrationWarning className="animate-marquee flex gap-12 min-w-full items-center py-2.5">

 {/* Repetimos o conteúdo para o loop infinito */}
 {Array(10).fill(null).map((_, i) => (
 <div key={i} className="flex items-center gap-12 shrink-0">
 <span className="text-[10px] md:text-xs font-medium tracking-[0.2em] font-sans">
 entregamos para todo o Brasil
 </span>
 <span className="w-0.5 h-0.5 bg-white/40 rounded-none"></span>

 <span className="text-[10px] md:text-xs font-medium tracking-[0.2em] font-sans">
 5% OFF no PIX
 </span>
 <span className="w-0.5 h-0.5 bg-white/40 rounded-none"></span>

 <span className="text-[10px] md:text-xs font-medium tracking-[0.2em] font-sans">
 Envio em 24h
 </span>
 <span className="w-0.5 h-0.5 bg-white/40 rounded-none"></span>
 </div>
 ))}

 </div>
 </div>
 );
}
