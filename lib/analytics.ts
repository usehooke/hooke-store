/**
 * analytics.ts - Utilitários para rastreamento de eventos (Conversion API / Client Side)
 * Suporta Meta Pixel e Google Analytics 4.
 */

import { brandConfig } from "@/config/brandConfig";

type EventName = 
  | 'PageView' 
  | 'AddToCart' 
  | 'InitiateCheckout' 
  | 'Purchase' 
  | 'ViewContent' 
  | 'Search';

interface EventData {
  content_name?: string;
  content_category?: string;
content_ids?: string[] | number[];
  content_type?: string;
  value?: number;
  currency?: string;
  search_string?: string;
  [key: string]: unknown;
}

/**
 * Dispara um evento para o Meta Pixel e CAPI (Server-side)
 */
export const trackMetaEvent = async (event: EventName, data?: EventData) => {
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 1. Browser Pixel
  if (typeof window !== 'undefined' && (window as unknown as { fbq: (t: string, e: string, d?: object, opt?: object) => void }).fbq) {
    (window as unknown as { fbq: (t: string, e: string, d?: object, opt?: object) => void }).fbq('track', event, data || {}, { eventID: eventId });
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] Event: ${event} (ID: ${eventId})`, data);
    }
  }

  // 2. Server Side (CAPI) - Chamada via proxy para proteger o token
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/analytics/capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: event,
          event_id: eventId,
          event_source_url: window.location.href,
          customData: data
        }),
      });
    } catch (e) {
      console.error('CAPI Fetch Error:', e);
    }
  }
};

/**
 * Dispara um evento para o Google Analytics 4
 */
export const trackGAEvent = (event: string, data?: EventData) => {
  if (typeof window !== 'undefined' && (window as unknown as { gtag: (t: string, e: string, d?: object) => void }).gtag) {
    (window as unknown as { gtag: (t: string, e: string, d?: object) => void }).gtag('event', event, data || {});
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GA4] Event: ${event}`, data);
    }
  }
};

/**
 * Helper para disparar em todas as plataformas configuradas
 */
export const trackEvent = (event: EventName, data?: EventData) => {
  const defaultData = {
    currency: brandConfig.shop.currency,
    ...data
  };

  trackMetaEvent(event, defaultData);
  
  // Mapeamento de nomes de eventos para GA4
  const gaEventName = event === 'PageView' ? 'page_view' : 
                     event === 'AddToCart' ? 'add_to_cart' :
                     event === 'InitiateCheckout' ? 'begin_checkout' :
                     event === 'Purchase' ? 'purchase' :
                     event === 'ViewContent' ? 'view_item' : event.toLowerCase();

  trackGAEvent(gaEventName, defaultData);
};
