"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import DynamicCart from "./DynamicCart";

// 🚀 EXTREME PERFORMANCE: Code Splitting & Lazy Loading
const Footer = dynamic(() => import("./Footer"));
const WhatsAppButton = dynamic(() => import("../ui/WhatsAppButton"), { ssr: false });
const DepartmentFAB = dynamic(() => import("./DepartmentFAB"), { ssr: false });
// O BottomNav é crucial para o Hooke Style (âncora visual), então separamos o bundle mas permitimos SSR
const BottomNav = dynamic(() => import("./BottomNav"), { ssr: true });

interface ShopLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ShopLayoutWrapper({ children }: ShopLayoutWrapperProps) {
  const pathname = usePathname() || "";
  
  // Lista de rotas que não devem exibir o layout padrão da loja
  const isImmersiveRoute = pathname?.startsWith("/treino") || pathname?.startsWith("/bazar-vip-hooke") || pathname?.startsWith("/b2b") || pathname?.startsWith("/admin");

  if (isImmersiveRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <DynamicCart />
      
      <main className="flex-grow w-full bg-white">
        {children}
      </main>

      <WhatsAppButton />
      <DepartmentFAB />
      <BottomNav />
      <Footer />
    </>
  );
}
