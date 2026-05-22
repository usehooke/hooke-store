import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { GoogleNativeOrderSchema } from '@/lib/schemas/google-native-checkout';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    // 1. Autenticação Brutal via Bearer Token
    const authHeader = request.headers.get('Authorization');
    const secret = process.env.GOOGLE_NATIVE_WEBHOOK_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
      console.warn("Unauthorized Webhook Attempt: Invalid or missing Bearer token.");
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Parse e Validação do Payload via Zod
    const body = await request.json();
    const parsedData = GoogleNativeOrderSchema.parse(body);

    if (!adminDb) {
      throw new Error("Admin Database is offline.");
    }

    // 3. Persistência Nativa (Gemini-First) no Firestore
    const orderRef = adminDb.collection('pedidos').doc();
    
    await orderRef.set({
      ...parsedData,
      status: 'paid', // Assumimos que o gateway nativo já processou o pagamento
      origin: 'gemini_omni_native',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      shippingZipcode: parsedData.shippingAddress.zipcode,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Ordem nativa processada e registrada.',
      orderId: orderRef.id
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validação de Payload Falhou', 
        details: error.errors 
      }, { status: 400 });
    }

    console.error("Webhook Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro Interno do Servidor' 
    }, { status: 500 });
  }
}
