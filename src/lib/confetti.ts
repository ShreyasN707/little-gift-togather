export async function triggerConfetti(options?: any) {
  if (typeof window === "undefined") return;
  try {
    const confettiModule = await import("canvas-confetti");
    const confetti = confettiModule.default || (confettiModule as any);
    if (typeof confetti === "function") {
      confetti(options);
    }
  } catch (e) {
    console.warn("Confetti trigger bypassed", e);
  }
}
