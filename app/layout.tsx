import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import "@/app/globals.css"; // Importação absoluta para garantir carregamento

// Importações para Análise de Dados e Performance
import ConditionalTracking from "@/components/layout/ConditionalTracking";

// Importações dos Componentes de Layout Globais
import { Toaster } from "sonner";
import { brandConfig } from "@/config/brandConfig";
import TransitionProvider from "@/components/layout/TransitionProvider";
import Providers from "@/components/layout/Providers";
import ShopLayoutWrapper from "@/components/layout/ShopLayoutWrapper";

// ... (fontes e metadata omitidos para brevidade se não mudarem, mas vou manter o padrão de substituição segura)
// 1. Configurando as Fontes (Estilo Suíço + Luxury Retail)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const baseUrl = brandConfig.shop.baseUrl;
const GA_MEASUREMENT_ID = brandConfig.analytics.googleAnalyticsId;

// 2. Metadata (Omitido para focar na substituição do Toaster)
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
    apple: '/pdv-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hooke PDV",
    // startUpImage: "/pdv-icon.png",
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
    <html lang="pt-BR" className={`${inter.variable} ${jost.variable}`}>
      <body className="font-jost antialiased bg-hooke-paper text-hooke-900 flex flex-col min-h-screen">
        <Providers>
          <Suspense fallback={<div className="min-h-screen bg-hooke-paper" />}>
            <ShopLayoutWrapper>
              <TransitionProvider>
                {children}
              </TransitionProvider>
            </ShopLayoutWrapper>
          </Suspense>

          <Toaster
            position="top-center"
            visibleToasts={1}
            theme="dark"
            toastOptions={{
              className: "hooke-toast",
              style: {
                background: '#0a0a0a',
                color: '#fff',
                borderRadius: '0px',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'var(--font-inter)',
                fontSize: '12px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                padding: '12px 20px',
              }
            }}
          />

          <Suspense fallback={null}>
            <ConditionalTracking gaId={GA_MEASUREMENT_ID} />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}