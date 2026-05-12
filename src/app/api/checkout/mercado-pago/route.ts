import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

// Inicializa o cliente com o Access Token do .env.local
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

interface MarketPagoItem {
  id: string;
  name: string;
  selectedSize: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, orderId, customerName } = body as { items: MarketPagoItem[], orderId: string, customerName: string };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    const preference = new Preference(client);
    
    // Criação da preferência no Mercado Pago
    const response = await preference.create({
      body: {
        items: items.map((item) => {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://usehooke.com.br';
          const absoluteImageUrl = item.imageUrl.startsWith('http')
            ? item.imageUrl
            : `${appUrl}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`;
          
          return {
            id: item.id,
            title: `${item.name} (${item.selectedSize}) - Hooke Elite`,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'BRL',
            picture_url: absoluteImageUrl,
          };
        }),
        payer: {
          name: customerName || 'Cliente Hooke',
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/falha`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/pendente`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        external_reference: orderId || `HK_${Date.now()}`,
        statement_descriptor: 'HOOKE STORE',
        metadata: {
          customer_id: orderId,
          customer_name: customerName,
        }
      },
    });

    // Retorna o init_point (link de pagamento) e o ID da preferência
    return NextResponse.json({ 
      id: response.id, 
      init_point: response.init_point 
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro Mercado Pago:', error);
    return NextResponse.json({ 
      error: 'Erro ao gerar link de pagamento',
      details: errorMessage 
    }, { status: 500 });
  }
}
