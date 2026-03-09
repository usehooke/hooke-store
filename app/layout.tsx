import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // Importação absoluta para garantir carregamento

// Importações para Análise de Dados e Performance
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

// Importações dos Componentes de Layout Globais
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import MetaPixel from "@/components/ui/MetaPixel";
import { Toaster } from "react-hot-toast";
import DynamicCart from "@/components/layout/DynamicCart";
import { brandConfig } from "@/config/brandConfig";
import TransitionProvider from "@/components/layout/TransitionProvider";

// 1. Configurando a Fonte Única (Estilo Suíço - Inter)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = brandConfig.shop.baseUrl;
const GA_MEASUREMENT_ID = brandConfig.analytics.googleAnalyticsId;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${brandConfig.name} | ${brandConfig.tagline}`,
    template: `%s | ${brandConfig.name} Store`,
  },
  description: brandConfig.description,
  keywords: [
    "moda masculina", "camisetas masculinas", "hooke", "minimalismo masculino", "algodão egípcio", "oversized premium"
  ],
  verification: {
    google: "F1l-lLTgz0IA50BtjKavSlVt3WTmh3DANMB5gr2bmnk",
  },
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: `${brandConfig.name} | Moda Masculina Premium`,
    description: brandConfig.description,
    url: baseUrl,
    siteName: brandConfig.name,
    locale: brandConfig.shop.locale,
    type: "website",
    images: [
      {
        url: "/banner-home.jpg",
        width: 1200,
        height: 630,
        alt: `${brandConfig.name} - Moda Masculina Premium`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Injetando apenas a variável da Inter
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-hooke-900 flex flex-col min-h-screen" suppressHydrationWarning={true}>

        <TopBar />
        <Navbar />

        {/* Carrinho Lateral */}
        <DynamicCart />

        <main className="flex-grow w-full">
          <TransitionProvider>
            {children}
          </TransitionProvider>
        </main>

        <WhatsAppButton />
        <Footer />

        {/* 3. Toaster Estilizado (Sharp & Black) */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#000000', // Preto Puro
              color: '#fff',
              borderRadius: '0px',   // Cantos 100% retos (Estilo Graphik/Swiss)
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '16px 24px',
            }
          }}
        />

        <SpeedInsights />
        <Analytics />
        <MetaPixel />
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}

      </body>
    </html>
  );
}