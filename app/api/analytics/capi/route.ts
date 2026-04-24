import { NextResponse } from 'next/server';
import { brandConfig } from '@/config/brandConfig';



/**
 * Meta Conversions API (CAPI) Proxy
 * Envia eventos diretamente do servidor para o Facebook.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event_name, event_id, event_source_url, userData, customData } = body;

    const pixelId = brandConfig.analytics.metaPixelId;
    const accessToken = brandConfig.analytics.metaCapiToken;
    const testCode = brandConfig.analytics.metaTestEventCode;

    if (!pixelId || !accessToken) {
      // Silenciosamente ignorar se não houver chaves (comum em dev ou sem setup Meta)
      return NextResponse.json({ 
        message: 'Meta CAPI skipped: Missing Pixel ID or Access Token' 
      }, { status: 200 }); // Retornamos 200 para o frontend não tratar como falha de rede
    }

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id, // Importante para deduplicação com o Browser Pixel
          event_source_url,
          user_data: {
            client_ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
            client_user_agent: req.headers.get('user-agent'),
            ...userData
          },
          custom_data: customData,
        },
      ],
      ...(testCode ? { test_event_code: testCode } : {}),
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Meta CAPI Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
