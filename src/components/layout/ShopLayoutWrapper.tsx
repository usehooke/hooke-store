"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import TopBar from "./TopBar";
import Navbar from "./Navbar";

const DynamicCart = dynamic(() => import("./DynamicCart"), { ssr: false });


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
  const isImmersiveRoute = pathname?.startsWith("/treino") || pathname?.startsWith("/bazar-vip-hooke") || pathname?.startsWith("/b2b") || pathname?.startsWith("/admin") || pathname?.startsWith("/kit-core");

  if (isImmersiveRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:border-2 focus:border-black focus:outline-none font-bold tracking-widest text-[10px] uppercase shadow-sharp"
      >
        Pular para o conteúdo principal
      </a>
      <TopBar />
      <Navbar />
      <DynamicCart />
      
      <main id="main-content" className="flex-grow w-full bg-white outline-none" tabIndex={-1}>
        {children}
      </main>

      <WhatsAppButton />
      <DepartmentFAB />
      <BottomNav />
      <Footer />
    </>
  );
}
