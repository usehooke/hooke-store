import { BENEFICIOS_MARQUEE } from "@/data/catalogo";

export default function BrandMarquee() {
  return (
    <div className="w-full bg-hooke-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center py-4 gap-4 md:gap-8">
          {BENEFICIOS_MARQUEE.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-hooke-900 opacity-80 hover:opacity-100 transition-opacity group cursor-default">
              {/* Renderiza o ícone dinamicamente */}
              <div className="p-1.5 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <item.icon size={14} strokeWidth={2} className="text-hooke-900" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-hooke-800">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}