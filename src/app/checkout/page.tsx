import React, { Suspense } from "react";
import { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getProductBySlugAdmin } from "@/lib/productServiceAdmin";

export const metadata: Metadata = {
  title: "Finalizar Pedido | Hooke",
  description: "Conclua seu pedido de forma segura. Pagamento via MercadoPago — Pix, cartão de crédito e débito.",
  robots: { index: false, follow: false },
};

interface CheckoutPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function CheckoutShell({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const productId = params.productId as string || params.slug as string || "";
  const size = params.size as string || "G"; // Padrão "G" (líder estatístico)

  let expressProduct: any = null;
  if (productId) {
    // Busca no Firestore por slug primeiro
    expressProduct = await getProductBySlugAdmin(productId);
    
    // Se não achar por slug, tenta direto pelo ID (SKU)
    if (!expressProduct) {
      try {
        const { adminDb } = await import("@/lib/firebase-admin");
        if (adminDb) {
          const docSnap = await adminDb.collection("produtos").doc(productId).get();
          if (docSnap.exists) {
            const data = docSnap.data();
            expressProduct = { id: docSnap.id, slug: data?.slug || docSnap.id, ...data };
          }
        }
      } catch (err) {
        console.error("Falha ao buscar produto por ID no checkout express:", err);
      }
    }
  }

  return <CheckoutForm expressProduct={expressProduct} expressSize={size} />;
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[9px] font-black tracking-[0.4em] uppercase text-zinc-400 mb-4">HOOKE CHECKOUT</p>
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    }>
      <CheckoutShell searchParams={searchParams} />
    </Suspense>
  );
}
