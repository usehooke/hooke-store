import FashionSheet from '@/components/lookbook/FashionSheet';
import { notFound } from 'next/navigation';

interface LookbookPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LookbookPage({ params }: LookbookPageProps) {
  const { slug } = await params;

  // Lógica simples para o demo "Max Power"
  if (slug !== 'conjunto-offwhite') {
    notFound();
  }

  const lookbookData = {
    title: "Conjunto\nOff-white", // Newline for editorial effect
    subtitle: "Coleção Resort 2026",
    imageSrc: "/lookbook/founder-1.png", // ACTUAL FOUNDER PHOTO
    price: "R$ 449,90",
    description: "Algodão Egípcio de gramatura pesada. Menos excesso, mais qualidade em cada fibra.",
    tag: "HOOKE ELITE FOUNDER"
  };

  return (
    <main className="min-h-screen bg-hooke-paper flex items-center justify-center p-0 md:p-8">
      <FashionSheet 
        title={lookbookData.title}
        subtitle={lookbookData.subtitle}
        imageSrc={lookbookData.imageSrc}
        price={lookbookData.price}
        description={lookbookData.description}
        tag={lookbookData.tag}
      />
    </main>
  );
}
