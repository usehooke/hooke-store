import { NextResponse } from "next/server";

const VALID_COUPONS = {
  "MAVERICK10": { discount: 0.1, type: "percent" },
  "VIP15": { discount: 0.15, type: "percent" },
};

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ valid: false, message: "Cupom não fornecido" }, { status: 400 });
    }

    const upperCode = code.toUpperCase();
    const couponData = VALID_COUPONS[upperCode as keyof typeof VALID_COUPONS];

    if (couponData) {
      return NextResponse.json({ 
        valid: true, 
        discount: couponData.discount, 
        type: couponData.type,
        message: "Cupom aplicado com sucesso"
      }, { status: 200 });
    }

    return NextResponse.json({ valid: false, message: "Cupom inválido ou expirado" }, { status: 404 });
    
  } catch {
    return NextResponse.json({ valid: false, message: "Erro ao processar cupom" }, { status: 500 });
  }
}
