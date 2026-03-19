import { Product, SITE_CONFIG } from "@/data/catalogo"; // IMPORTAÇÃO CORRIGIDA
import Image from "next/image";
import Link from 'next/link';
import { ShoppingBag, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Lógica de Parcelamento Global
  const parcelas = SITE_CONFIG.max_parcelas;
  const valorParcela = (product.price / parcelas).toFixed(2).replace('.', ',');
  const precoFormatado = product.price.toFixed(2).replace('.', ',');

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group relative block w-full aspect-[3/4] overflow-hidden rounded-md bg-hooke-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
    >

      {/* 1. IMAGEM */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          priority src={product.imageUrl}
          alt={product.seoAltText || product.name}
          fill
          className="object-cover object-center transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      </div>

      {/* 2. BADGES */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {product.isNew && (
          <span className="bg-hooke-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-lg rounded-sm">
            Novo
          </span>
        )}
        {product.featured && (
          <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-lg animate-pulse rounded-sm">
            Destaque
          </span>
        )}
      </div>

      {/* 3. INFO + CTA */}
      <div className="absolute inset-0 z-20 p-4 flex flex-col justify-end">
        {/* Avaliação */}
        <div className="flex items-center gap-1 mb-1 opacity-90 transform transition-transform duration-500 group-hover:-translate-y-4">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
          </div>
          <span className="text-[10px] text-gray-300 font-medium">(27)</span>
        </div>

        {/* Título */}
        <h3 className="text-white font-bold text-base leading-tight mb-1 drop-shadow-md truncate pr-4 uppercase tracking-wide transform transition-transform duration-500 group-hover:-translate-y-4">
          {product.name}
        </h3>

        {/* Preço */}
        <div className="flex flex-col mb-2 transform transition-transform duration-500 group-hover:-translate-y-4">
          <span className="text-xl font-bold text-white drop-shadow-md">R$ {precoFormatado}</span>
          <span className="text-[10px] text-gray-300 font-light drop-shadow-sm">
            3x de R$ {valorParcela} sem juros
          </span>
        </div>

        {/* Botão de Compra - Oculto e aparece on hover */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <div className="w-full bg-white text-hooke-900 font-bold uppercase tracking-widest text-[11px] py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white hover:scale-[1.02] active:scale-95 transition-all shadow-xl cursor-pointer">
            <ShoppingBag size={14} />
            EU QUERO
          </div>
        </div>
      </div>
    </Link>
  );
}