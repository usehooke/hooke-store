"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export default function PurchaseTracker() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const eventId = searchParams.get("id"); // ID da compra retornado na URL
  const hasTracked = useRef(false);

  useEffect(() => {
    if (status === "success" && eventId && !hasTracked.current) {
      // Dispara o evento Purchase no Client-Side. 
      // A deduplicação acontece automaticamente porque estamos passando um event_id que 
      // também foi enviado via Webhook para a CAPI.
      trackEvent("Purchase", {
        eventID: `evt_purchase_${eventId}`, // Garante formato de ID idêntico ao gerado no CAPI
        currency: "BRL"
      });
      hasTracked.current = true;
    }
  }, [status, eventId]);

  return null;
}
