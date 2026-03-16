import { getProductBySlug } from "@/lib/productService";
import { Product } from "@/data/catalogo";
import { notFound } from "next/navigation";
import ProductTracker from "@/components/shop/ProductTracker";

// Componentes da Loja (Certifique-se que eles existem e não usam tipos antigos)
// Se der erro de tipo neles, me avise que ajustamos os componentes também.
import AddToCartSection from "@/components/shop/AddToCartSection";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductFeatures from "@/components/shop/ProductFeatures";
import RelatedProducts from "@/components/shop/RelatedProducts"; // Este precisará de ajuste leve
import ProductDetailsBento from "@/components/shop/ProductDetailsBento"; // Este também
import KitPromoCard from "@/components/shop/KitPromoCard";
import ShareButton from "@/components/ui/ShareButton";

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

  return (
    <main className="w-full px-6 md:px-12 py-12 md:py-16 mb-20 animate-in fade-in duration-500">
      <ProductTracker product={product} />

      {/* Grid Assimétrico: 60% Foto (Esq) / 40% Texto (Dir) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-24 items-start">

        {/* Lado Esquerdo: Galeria (Maior destaque visual) */}
        <div className="w-full md:col-span-3">
          <ProductGallery product={product} />
        </div>

        {/* Lado Direito: Informações e Compra (Sticky - Fixo na rolagem) */}
        <div className="w-full md:col-span-2 flex flex-col gap-8 sticky top-24">

          {/* Cabeçalho do Produto */}
          <div className="border-b border-gray-100 pb-6">
            {/* Gatilhos de Conversão (v1.5) */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isNew && (
                <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 inline-block">
                  Novo Lançamento
                </span>
              )}
              {product.isPremiumCollection && (
                <span className="bg-hooke-100 text-hooke-900 text-[10px] font-bold uppercase tracking-widest px-2 py-1 inline-flex items-center gap-1.5 font-outfit border border-hooke-200 shadow-sm animate-in fade-in slide-in-from-left-2 duration-700">
                  <span className="w-1.5 h-1.5 bg-hooke-900 rounded-full animate-pulse" />
                  Qualidade Premium Hooke
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-hooke-900 uppercase tracking-tight mb-3 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-xl md:text-2xl text-gray-500 font-medium">
                {formatter.format(product.price)}
              </p>
              <ShareButton
                title={product.name}
                text={`Saca só essa peça da Hooke Store: ${product.name}`}
                url={`https://www.usehooke.com.br/produto/${product.slug}`}
                className="border-none w-auto py-2 text-hooke-500 hover:text-black hover:bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Descrição Rica */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-hooke-900 mb-2">Detalhes</h3>
              {product.description.includes('<') ? (
                <div
                  className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed font-sans prose-p:mb-2 prose-ul:my-2 prose-li:my-0.5"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed text-sm">
                  {product.description}
                </p>
              )}
            </div>

            {/* Grid de Especificações Técnicas (Bento) */}
            {/* Passando os detalhes do produto novo */}
            <ProductDetailsBento details={product.details} />
          </div>

          {/* Seção de Escolha de Tamanho e Botão de Compra */}
          <AddToCartSection product={product} />

          {/* Card Promocional de Kit (Aparece se for elegível) */}
          <div className="animate-in slide-in-from-bottom-2 duration-700 delay-300">
            <KitPromoCard product={product} />
          </div>

          {/* Ícones de Diferenciais (Frete, Troca, etc) */}
          <ProductFeatures />

        </div>
      </div>

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