"use client";
import { useCallback } from "react";

export function useConfetti() {
  const fire = useCallback(async () => {
    if (typeof window === "undefined") return;
    const confetti = (await import("canvas-confetti")).default;
    const count = 200;
    const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

    function fireParticles(particleRatio: number, opts: Record<string, unknown>) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fireParticles(0.25, { spread: 26, startVelocity: 55 });
    fireParticles(0.2, { spread: 60 });
    fireParticles(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fireParticles(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fireParticles(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return { fire };
}
