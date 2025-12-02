import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- ESTA LINHA É OBRIGATÓRIA PARA O ESTILO FUNCIONAR
import { SpeedInsights } from "@vercel/speed-insights/next"

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
      <body className={`${inter.variable} font-sans antialiased bg-hooke-50 text-hooke-900`}>
        {children}
      </body>
    </html>
  );
}