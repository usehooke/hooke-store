import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface BazarGridProps {
  products: (Product & { bazarStock: number })[];
}

export function BazarGrid({ products }: BazarGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
      {products.map((product) => (
        <Link 
          href={`/shop/${product.slug}`} 
          key={product.id}
          className="group relative flex flex-col bg-neutral-900 border border-neutral-800 rounded-none overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
        >
          {/* Badge: ÚLTIMA PEÇA */}
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-[#ff0000] text-white px-2 py-1 md:px-3 md:py-1.5 rounded-sm font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,0,0.8)] border border-red-400">
              Última Peça
            </span>
          </div>

          <div className="absolute top-3 right-3 z-20">
            <span className="bg-black/80 backdrop-blur-md text-white px-2 py-1 rounded-sm font-bold text-[10px] uppercase">
              Restam {product.bazarStock}
            </span>
          </div>

          {/* Imagem do Produto */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-800">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover object-top transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Overlay gradiente escuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
          </div>

          {/* Informações do Produto */}
          <div className="p-4 flex flex-col justify-between flex-grow z-10 -mt-12">
             <h3 className="font-bold text-white text-sm md:text-base leading-tight mb-2 drop-shadow-md">
              {product.name}
             </h3>
             <div className="flex items-center justify-between">
                <span className="text-xl font-black text-white">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] font-bold text-neutral-400 line-through">
                  R$ {(product.price * 1.4).toFixed(2).replace('.', ',')}
                </span>
             </div>
             
             <button className="w-full mt-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm py-2 rounded-lg transition-colors">
               RESGATAR AGORA
             </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
