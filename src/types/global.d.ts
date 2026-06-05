interface Window {
  dataLayer: Record<string, unknown>[];
  webkitAudioContext: typeof AudioContext;
  fbq: (...args: unknown[]) => void;
  _fbq: (...args: unknown[]) => void;
}
