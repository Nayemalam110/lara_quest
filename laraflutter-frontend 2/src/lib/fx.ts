import confetti from "canvas-confetti";

const BRAND = ["#54c5f8", "#a78bfa", "#ff4438", "#fbbf24", "#34d399"];

export function popBurst(origin?: { x: number; y: number }) {
  confetti({
    particleCount: 70,
    spread: 75,
    startVelocity: 32,
    scalar: 0.85,
    ticks: 160,
    origin: origin ?? { x: 0.5, y: 0.75 },
    colors: BRAND,
    disableForReducedMotion: true,
  });
}

export function moduleFanfare() {
  const end = Date.now() + 900;
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: BRAND,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: BRAND,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
