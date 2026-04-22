/**
 * HOOKE ELITE: HAPTIC ENGINE
 * Fornece feedback tátil nativo para elevar a percepção de qualidade do PWA.
 */

export const triggerHaptic = (type = 'light') => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    switch (type) {
      case 'heavy':
        // Padrão de vibração para ações de impacto (ex: Compra)
        navigator.vibrate([20, 10, 20]);
        break;
      case 'medium':
        // Vibração média para interações de UI
        navigator.vibrate(15);
        break;
      case 'light':
      default:
        // Vibração leve para hover/toque simples
        navigator.vibrate(10);
        break;
    }
  }
};
