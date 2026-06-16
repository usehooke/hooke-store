import { Metadata } from "next";
import CamisetasClient from "./CamisetasClient";
import { getProducts } from "@/lib/productServiceServer";

export const metadata: Metadata = {
  title: "Camisetas | Hooke",
  description: "As camisetas definitivas em malha Heavyweight 260g e Algodão Egípcio. Modelagens Oversized e estampas Vintage autorais.",
  alternates: {
    canonical: "https://www.usehooke.com.br/camisetas",
  },
  openGraph: {
    title: "Camisetas | Hooke",
    description: "As camisetas definitivas em malha Heavyweight 260g e Algodão Egípcio. Modelagens Oversized e estampas Vintage autorais.",
    url: "https://www.usehooke.com.br/camisetas",
    siteName: "Hooke",
    images: [{ url: "/banner-home.jpg", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Camisetas | Hooke",
    description: "As camisetas definitivas em malha Heavyweight 260g e Algodão Egípcio. Modelagens Oversized e estampas Vintage autorais.",
    images: ["/banner-home.jpg"],
  },
};

export default async function CamisetasPage() {
  // Busca os produtos direto no servidor com unstable_cache de 1h
  const produtos = await getProducts();

  return (
    <main className="min-h-screen bg-white pb-20">
      <CamisetasClient initialProducts={produtos} />
    </main>
  );
}
