"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "../ui/WhatsAppButton";
import DynamicCart from "./DynamicCart";

interface ShopLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ShopLayoutWrapper({ children }: ShopLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Lista de rotas que não devem exibir o layout padrão da loja
  const isImmersiveRoute = pathname?.startsWith("/treino");

  if (isImmersiveRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <DynamicCart />
      
      <main className="flex-grow w-full">
        {children}
      </main>

      <WhatsAppButton />
      <Footer />
    </>
  );
}
