// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "@/components/layout/Footer"; // <--- Importamos o Footer

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Hooke | Moda Masculina",
  description: "Vista a sua essência. Moda masculina minimalista e atemporal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased bg-hooke-50 text-hooke-900 flex flex-col min-h-screen`}>
        {/* O children é o conteúdo da página (Home, Sobre, etc) */}
        <div className="flex-grow">
          {children}
        </div>
        
        {/* O Footer fica fixo aqui embaixo */}
        <Footer />
        
        <SpeedInsights />
      </body>
    </html>
  );
}