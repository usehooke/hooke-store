/**
 * HOOKE ELITE: HAPTIC ENGINE
 * Fornece feedback tátil nativo para elevar a percepção de qualidade do PWA.
 */

export const triggerHaptic = (type = 'light') => {
  try {
    if (typeof window !== 'undefined' && navigator && navigator.vibrate) {
      switch (type) {
        case 'heavy':
          navigator.vibrate([50, 20, 50]);
          break;
        case 'success':
          navigator.vibrate([30, 10, 30, 10, 100]);
          break;
        case 'light':
        default:
          navigator.vibrate(15);
          break;
      }
    }
  } catch (err) {
    // Silenciar erros em browsers Desktop/Safari
  }
};
