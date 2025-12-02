// src/app/produto/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Check, MessageCircle } from "lucide-react";
import { products } from "../../../data/products"; 
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 1. GERAÇÃO DINÂMICA DE SEO (O Título da aba muda para o nome do produto)
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  return {
    title: `${product.name} | Hooke`,
    description: product.description,
    openGraph: {
      images: [product.imageUrl], // A foto do produto aparece no zap
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // DADOS PARA O GOOGLE (JSON-LD) - A Arma Secreta
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `https://www.usehooke.com.br${product.imageUrl}`,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Hooke',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.usehooke.com.br/produto/${product.slug}`,
      priceCurrency: 'BRL',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  };

  const whatsappNumber = "5511999999999"; 
  const message = `Olá! Vi o produto *${product.name}* no site da Hooke e fiquei interessado.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Injeção dos dados invisíveis para o Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="border-b border-hooke-100 py-4 px-6 mb-8">
        <Link href="/" className="flex items-center text-sm font-medium text-hooke-500 hover:text-hooke-900 transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          Voltar para a Loja
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          <div className="relative aspect-[4/5] bg-hooke-50 rounded-sm overflow-hidden shadow-sm">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority 
            />
          </div>

          <div className="flex flex-col h-full pt-4">
            <span className="text-sm text-hooke-500 uppercase tracking-widest font-semibold mb-2">
              Hooke | Moda Masculina
            </span>
            <h1 className="text-4xl font-bold text-hooke-900 tracking-tight mb-4">
              {product.name}
            </h1>
            <div className="text-2xl font-medium text-hooke-900 mb-8">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </div>
            <div className="prose prose-sm text-hooke-500 mb-8">
              <p>{product.description}</p>
            </div>

            <div className="mb-8">
              <span className="text-sm font-medium text-hooke-900 block mb-2">Tamanhos Disponíveis</span>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <div key={size} className="w-12 h-12 flex items-center justify-center border border-hooke-200 text-hooke-500 rounded-sm font-medium cursor-default">
                    {size}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-hooke-100 my-6"></div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-hooke-600">
                <Check size={18} className="text-green-600 mr-2" />
                Atendimento via WhatsApp
              </li>
              <li className="flex items-center text-sm text-hooke-600">
                <Check size={18} className="text-green-600 mr-2" />
                Envio imediato
              </li>
            </ul>

            <a 
              href={whatsappUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-8 rounded-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MessageCircle size={22} />
              Comprar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}