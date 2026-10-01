import React, { useEffect, useState } from "react";

export function ProgressRing({
  pct,
  size = 84,
  stroke = 7,
}: {
  pct: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnim(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(148, 163, 184, 0.15)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * anim) / 100}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
    </svg>
  );
}
