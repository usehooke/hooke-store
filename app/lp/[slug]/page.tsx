import { getProducts } from "@/lib/productService";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { lpConfig } from "@/config/lpConfig";
import ProductCard from "@/components/shop/ProductCard";
import LPHero from "@/components/shop/LPHero";
import { Star, ShieldCheck, Zap, Wind, Heart, Award, Palette, Briefcase } from "lucide-react";

interface LPPageProps {
  params: Promise<{ slug: string }>;
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  ShieldCheck,
  Wind,
  Heart,
  Award,
  Palette,
  Briefcase,
  Check: Star
};

export default async function LandingPage({ params }: LPPageProps) {
  const { slug } = await params;
  const content = lpConfig[slug as keyof typeof lpConfig];

  if (!content) notFound();

  // O serviço getProducts já aceita categoria como filtro
  const products = await getProducts(content.category);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* HERO SECTION */}
      <section className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src={content.heroImage} 
          alt={content.title} 
          fill 
          className="object-cover brightness-[0.4]"
          priority
        />
        <LPHero 
          title={content.title} 
          subtitle={content.subtitle} 
          ctaText={content.ctaText} 
        />
      </section>

      {/* DIFERENCIAIS (SOCIAL PROOF) */}
      <section className="py-24 border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {content.features.map((f, i) => {
              const Icon = iconMap[f.icon] || Star;
              return (
                <div key={i} className="text-center space-y-6">
                  <div className="w-16 h-16 bg-white flex items-center justify-center mx-auto shadow-sm rounded-full">
                     <Icon className="text-hooke-900" size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-2">{f.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase tracking-tight">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GRID DE PRODUTOS */}
      <section id="ofertas" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-hooke-900 mb-4">Escolha sua Armadura</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] ml-1">Lançamento Limitado • 2026 Season</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhum produto encontrado nesta categoria no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER LP SIMPLIFICADO */}
      <section className="bg-hooke-900 py-24 text-center text-white">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Pronto para elevar o nível?</h2>
        <p className="text-xs text-hooke-300 uppercase tracking-[0.3em] mb-12">Entre para o time Hooke Store.</p>
        <Link 
          href="/" 
          className="bg-white text-hooke-900 px-12 py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all inline-block"
        >
          Explorar Loja Completa
        </Link>
      </section>
    </div>
  );
}
