import { NextResponse } from "next/server";
export const runtime = 'edge';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { CouponRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = CouponRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
        valid: false, 
        message: "Código de cupom inválido." 
      }, { status: 400 });
    }

    const { code } = validation.data;

    // ⚡ A TRAVA DO TECH LEAD: Blindagem para build e ambiente sem env vars
    const firestore = db;
    if (!firestore) {
      console.warn("🚀 [Hooke System] Coupon validation short-circuit: DB offline.");
      return NextResponse.json({ valid: false, message: "Serviço de cupons temporariamente indisponível" }, { status: 503 });
    }

    const upperCode = code.toUpperCase().trim();
    
    // Tentativa de buscar o cupom no banco de dados (Single Source of Truth)
    const couponRef = doc(firestore, "cupons", upperCode);
    const couponSnap = await getDoc(couponRef);

    if (couponSnap.exists()) {
      const couponData = couponSnap.data();
      
      // Validação de Status Ativo
      if (couponData.isActive === false) {
        return NextResponse.json({ valid: false, message: "Este cupom não está mais ativo" }, { status: 404 });
      }

      return NextResponse.json({ 
        valid: true, 
        discount: couponData.discount || 0, 
        type: couponData.type || "percent",
        message: "Cupom aplicado com sucesso"
      }, { status: 200 });
    }

    return NextResponse.json({ valid: false, message: "Cupom inválido ou expirado" }, { status: 404 });
    
  } catch (error) {
    console.error("Erro na Máquina de Cupons:", error);
    return NextResponse.json({ valid: false, message: "Erro ao processar cupom" }, { status: 500 });
  }
}
