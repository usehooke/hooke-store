/**
 * HOOKE HQ: LUXURY CHIME ENGINE
 * Gera um som cristalino e metálico usando síntese sonora (Web Audio API).
 * Sem arquivos externos, latência zero.
 */
export function playSuccessChime() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Configuração para som metálico cristalino (Luxury Ping)
    oscillator.type = 'triangle'; // Suave mas com harmônicos
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Nota Lá (A5)
    oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.05); // Slide rápido para brilho

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);

    // Segundo oscilador para o "brilho" (Overtones)
    const shine = audioCtx.createOscillator();
    shine.type = 'sine';
    shine.frequency.setValueAtTime(2637, audioCtx.currentTime); // Nota Mi (E7)
    
    const shineGain = audioCtx.createGain();
    shineGain.gain.setValueAtTime(0, audioCtx.currentTime);
    shineGain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.02);
    shineGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    shine.connect(shineGain);
    shineGain.connect(audioCtx.destination);
    
    shine.start();
    shine.stop(audioCtx.currentTime + 0.5);

  } catch (e) {
    console.warn("[Hooke Sound] Audio context failed:", e);
  }
}
