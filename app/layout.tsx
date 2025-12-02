// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// URL OFICIAL DO SEU SITE (Crucial para o Google não se perder)
const baseUrl = "https://www.usehooke.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Hooke | Moda Masculina Minimalista",
    template: "%s | Hooke", // Isso faz as páginas ficarem "Produto X | Hooke"
  },
  description: "Vista a sua essência. Moda masculina minimalista com corte premium e tecidos nobres.",
  keywords: ["moda masculina", "camiseta minimalista", "roupa masculina", "hooke", "algodão egípcio"],
  openGraph: {
    title: "Hooke | Moda Masculina",
    description: "Menos excesso, mais essência. Conheça a nova coleção.",
    url: baseUrl,
    siteName: "Hooke",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/banner-home.jpg", // Sua foto de capa vai aparecer no WhatsApp
        width: 1200,
        height: 630,
        alt: "Hooke Moda Masculina",
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
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased bg-hooke-50 text-hooke-900 flex flex-col min-h-screen`}>
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}