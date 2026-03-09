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
 * Dispara um evento para o Meta Pixel
 */
export const trackMetaEvent = (event: EventName, data?: EventData) => {
  if (typeof window !== 'undefined' && (window as unknown as { fbq: Function }).fbq) {
    (window as unknown as { fbq: Function }).fbq('track', event, data);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta Pixel] Event: ${event}`, data);
    }
  }
};

/**
 * Dispara um evento para o Google Analytics 4
 */
export const trackGAEvent = (event: string, data?: EventData) => {
  if (typeof window !== 'undefined' && (window as unknown as { gtag: Function }).gtag) {
    (window as unknown as { gtag: Function }).gtag('event', event, data);
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
  
  // Mapeamento de nomes de eventos para GA4 se necessário
  const gaEventName = event === 'PageView' ? 'page_view' : 
                     event === 'AddToCart' ? 'add_to_cart' :
                     event === 'InitiateCheckout' ? 'begin_checkout' :
                     event === 'Purchase' ? 'purchase' :
                     event === 'ViewContent' ? 'view_item' : event.toLowerCase();

  trackGAEvent(gaEventName, defaultData);
};
