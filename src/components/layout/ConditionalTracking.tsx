"use client";

import { usePathname } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import MetaPixel from "@/components/ui/MetaPixel";
import { GoogleAnalytics } from "@next/third-parties/google";

interface ConditionalTrackingProps {
  gaId?: string;
}

export default function ConditionalTracking({ gaId }: ConditionalTrackingProps) {
  const pathname = usePathname() || "";

  // Rotas preparadas para ultra-velocidade (sem scripts pesados)
  const isUltraFastRoute = pathname?.startsWith("/oferta-direta");

  if (isUltraFastRoute) {
    return null;
  }

  return (
    <>
      <MetaPixel />
      <SpeedInsights />
      <Analytics />
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  );
}
