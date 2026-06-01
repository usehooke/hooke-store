"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "../ui/WhatsAppButton";
import DynamicCart from "./DynamicCart";
import BottomNav from "./BottomNav";
import DepartmentFAB from "./DepartmentFAB";

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
      
      <main className="flex-grow w-full pt-20">
        {children}
      </main>

      <WhatsAppButton />
      <DepartmentFAB />
      <BottomNav />
      <Footer />
    </>
  );
}
