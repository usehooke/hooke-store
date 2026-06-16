"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { toast } from "sonner";
import TopBar from "./TopBar";
import Navbar from "./Navbar";

const DynamicCart = dynamic(() => import("./DynamicCart"), { ssr: false });


// 🚀 EXTREME PERFORMANCE: Code Splitting & Lazy Loading
const Footer = dynamic(() => import("./Footer"));
const WhatsAppButton = dynamic(() => import("../ui/WhatsAppButton"), { ssr: false });
const InstagramPopup = dynamic(() => import("../ui/InstagramPopup"), { ssr: false });
const DepartmentFAB = dynamic(() => import("./DepartmentFAB"), { ssr: false });
// O BottomNav é crucial para o Hooke Style (âncora visual), então separamos o bundle mas permitimos SSR
const BottomNav = dynamic(() => import("./BottomNav"), { ssr: true });

interface ShopLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ShopLayoutWrapper({ children }: ShopLayoutWrapperProps) {
  const pathname = usePathname() || "";

  // Captura do referrer do Social Club (MGM)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      if (ref) {
        localStorage.setItem("hooke_referrer", ref);
        const hasNotified = sessionStorage.getItem("hooke_notified_ref");
        if (!hasNotified) {
          toast.success("Bem-vindo ao Hooke Social Club! Seu desconto de 15% será validado no checkout.", {
            duration: 6000,
            style: { borderRadius: 0, background: "#000", color: "#fff", border: "none" }
          });
          sessionStorage.setItem("hooke_notified_ref", "true");
        }
      }
    }
  }, []);
  
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
      <InstagramPopup />
      <DepartmentFAB />
      <BottomNav />
      <Footer />
    </>
  );
}
