import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // Importação absoluta para garantir carregamento

// Importações para Análise de Dados e Performance
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

// Importações dos Componentes de Layout Globais
import MetaPixel from "@/components/ui/MetaPixel";
import { Toaster } from "react-hot-toast";
import { brandConfig } from "@/config/brandConfig";
import TransitionProvider from "@/components/layout/TransitionProvider";
import Providers from "@/components/layout/Providers";
import ShopLayoutWrapper from "@/components/layout/ShopLayoutWrapper";

// 1. Configurando as Fontes (Estilo Suíço + Luxury Retail)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import { Outfit, Playfair_Display } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
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
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-hooke-50 text-hooke-900 flex flex-col min-h-screen" suppressHydrationWarning={true}>
        <Providers>
          <ShopLayoutWrapper>
            <TransitionProvider>
              {children}
            </TransitionProvider>
          </ShopLayoutWrapper>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#000000',
                color: '#fff',
                borderRadius: '0px',
                fontFamily: 'var(--font-inter)',
                fontSize: '13px',
                fontWeight: 500,
                padding: '16px 24px',
              }
            }}
          />

          <MetaPixel />
          <SpeedInsights />
          <Analytics />
          {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
        </Providers>
      </body>
    </html>
  );
}