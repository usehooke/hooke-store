import { Product } from "@/types";
import { getProductBySlug } from "@/lib/productService";
import { notFound } from "next/navigation";
import ProductTracker from "@/components/shop/ProductTracker";

// Componentes da Loja (Certifique-se que eles existem e não usam tipos antigos)
// Se der erro de tipo neles, me avise que ajustamos os componentes também.
import AddToCartSection from "@/components/shop/AddToCartSection";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductFeatures from "@/components/shop/ProductFeatures";
import RelatedProducts from "@/components/shop/RelatedProducts"; // Este precisará de ajuste leve
import ProductDetailsBento from "@/components/shop/ProductDetailsBento";
import KitPromoCard from "@/components/shop/KitPromoCard";
import ShareButton from "@/components/ui/ShareButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductReviews from "@/components/shop/ProductReviews";
import { Star } from "lucide-react"; 
import { brandConfig } from "@/config/brandConfig";

// Tipagem correta para Next.js 15+ (params como Promise)
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // BUSCA NO NOVO CÉREBRO (FIREBASE)
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductView product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl,
    "description": product.description.replace(/<[^>]*>?/gm, ''),
    "brand": {
      "@type": "Brand",
      "name": brandConfig.name
    },
    "offers": {
      "@type": "Offer",
      "url": `${brandConfig.shop.baseUrl}/produto/${product.slug}`,
      "priceCurrency": "BRL",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    },
    // Estes dados serão dinâmicos vindo do catalogo.ts em breve
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  };

  return (
    <main className="w-full px-6 md:px-12 py-8 md:py-12 mb-20 animate-in fade-in duration-500">
      {/* Injeção de SEO Estruturado (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ProductTracker product={product} />

      {/* Breadcrumbs - Premium Hooke Navigation */}
      <Breadcrumbs 
        items={[
          { label: product.category, href: "/colecao" },
          { label: product.name }
        ]} 
      />

      {/* Grid Assimétrico: 60% Foto (Esq) / 40% Texto (Dir) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-16 items-start mt-4">

        {/* Lado Esquerdo: Galeria (Maior destaque visual) */}
        <div className="w-full md:col-span-3">
          <ProductGallery product={product} />
        </div>

        {/* Lado Direito: Informações e Compra (Sticky - Fixo na rolagem) */}
        <div className="w-full md:col-span-2 flex flex-col gap-6 md:sticky md:top-28">

          {/* Cabeçalho do Produto */}
          <div className="border-b border-gray-100 pb-4">
            {/* Gatilhos de Conversão (v1.5) */}
            <div className="flex flex-wrap gap-2 mb-2">
              {product.isNew && (
                <span className="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 inline-block">
                  Novo
                </span>
              )}
              {product.isPremiumCollection && (
                <span className="bg-hooke-100 text-hooke-900 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 inline-flex items-center gap-1 font-outfit border border-hooke-200">
                  Qualidade Premium
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-hooke-900 uppercase tracking-tighter mb-1.5 leading-[0.9] font-heading">
              {product.name}
            </h1>
            
            {/* Rating Summary (Social Proof Imediato) */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {[1, 2, 3].map(i => <Star key={i} size={10} fill="currentColor" stroke="none" />)}
              </div>
              <span className="text-[9px] font-bold text-hooke-900 uppercase tracking-widest">
                4.9 <span className="text-gray-400 font-normal">(127 Avaliações)</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xl md:text-2xl text-gray-900 font-black tracking-tighter">
                {formatter.format(product.price)}
              </p>
              <ShareButton
                title={product.name}
                text={`Saca só essa peça da Hooke Store: ${product.name}`}
                url={`https://www.usehooke.com.br/produto/${product.slug}`}
                className="border-none w-auto py-1 text-hooke-400 hover:text-black hover:bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Descrição Curta/Rica */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-hooke-400 mb-1.5">Descrição</h3>
              <p className="text-gray-600 leading-relaxed text-[13px] line-clamp-3">
                {product.description.replace(/<[^>]*>?/gm, '')}
              </p>
            </div>

            {/* Grid de Especificações Técnicas (Bento Compacto) */}
            <ProductDetailsBento details={product.details} />
          </div>

          {/* Seção de Escolha de Tamanho e Botão de Compra - O coração da conversão */}
          <div className="mt-2">
            <AddToCartSection product={product} />
          </div>

          {/* Card Promocional de Kit (Compacto) */}
          <div className="animate-in slide-in-from-bottom-2 duration-700">
            <KitPromoCard product={product} />
          </div>

          {/* Ícones de Diferenciais */}
          <div className="hidden lg:block opacity-60">
            <ProductFeatures />
          </div>

        </div>
      </div>

      {/* Seção de Avaliações (Social Proof Élite) */}
      <ProductReviews />

      {/* Seção Inferior: Produtos Relacionados */}
      <div className="mt-24 border-t border-gray-100 pt-16">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-12 text-center md:text-left">
          Você também pode gostar
        </h2>
        <RelatedProducts currentSlug={product.slug} category={product.category} />
      </div>

    </main>
  );
}

// --- GERAÇÃO DE METADADOS (SEO) ---
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: 'Produto não encontrado' };

  return {
    title: `${product.name} | Hooke Moda Masculina`,
    description: product.seo?.metaDescription || `Compre ${product.name} online. ${product.description.replace(/<[^>]*>?/gm, '').substring(0, 100)}... Frete para todo o Brasil.`,
    openGraph: {
      images: [product.imageUrl],
      title: product.name,
      description: product.seo?.metaDescription || `Compre ${product.name} online. ${product.description.replace(/<[^>]*>?/gm, '').substring(0, 100)}...`,
      type: 'website',
    }
  };
}