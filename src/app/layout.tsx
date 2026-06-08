import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Jost } from "next/font/google";
import "@/app/globals.css"; // Importação absoluta para garantir carregamento

// Importações para Análise de Dados e Performance
import ConditionalTracking from "@/components/layout/ConditionalTracking";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Importações dos Componentes de Layout Globais
import ClientToaster from "@/components/layout/ClientToaster";
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
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// 2. Metadata (Omitido para focar na substituição do Toaster)
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${brandConfig.name} | ${brandConfig.tagline}`,
    template: `%s | ${brandConfig.name} Store`,
  },
  description: brandConfig.description,
  keywords: [
    "moda masculina", "camisetas masculinas", "hooke", "minimalismo masculino", "algodão egípcio", "oversized premium",
    "Camiseta Básica Premium", "Algodão Sustentável", "Direto de Fábrica"
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
  alternates: {
    canonical: baseUrl,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#111827',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jost.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <Script
          id="unregister-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(registrations => {
                for (const registration of registrations) { registration.unregister(); }
              });
              if ('caches' in window) {
                caches.keys().then(names => {
                  for (const name of names) caches.delete(name);
                });
              }
            }
          `}}
        />
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
        
        {/* Gemini-First: Organization Schema Global */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Hooke Elite",
              "url": baseUrl,
              "logo": `${baseUrl}/pdv-icon.png`,
              "sameAs": [
                "https://instagram.com/usehooke"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-11-97590-2528",
                "contactType": "Customer Service"
              }
            })
          }}
        />
      </head>
      <body className="font-jost antialiased bg-hooke-paper text-hooke-900 flex flex-col min-h-screen">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Providers>
          <Suspense fallback={<div className="min-h-screen bg-hooke-paper" />}>
            <ShopLayoutWrapper>
              <TransitionProvider>
                {children}
              </TransitionProvider>
            </ShopLayoutWrapper>
          </Suspense>

          <ClientToaster />

          <Suspense fallback={null}>
            <ConditionalTracking gaId={GA_MEASUREMENT_ID} />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
