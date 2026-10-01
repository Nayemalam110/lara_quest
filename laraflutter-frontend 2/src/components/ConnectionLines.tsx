import { useLayoutEffect, useState, type RefObject } from "react";

export interface LinePair {
  /** anchor id — an element `[data-anchor="id"]`, or dots `[data-anchor="id#L"]/[data-anchor="id#R"]` */
  from: string;
  to: string;
  color?: string;
  dashed?: boolean;
  glow?: boolean;
}

interface DrawnPath {
  d: string;
  color: string;
  dashed?: boolean;
  glow?: boolean;
  mid: { x: number; y: number };
}

/**
 * Draws bezier connectors between anchored elements inside the referenced
 * container. When an anchor id exposes `#L` / `#R` port dots, the two ports
 * facing each other are connected automatically. Re-measures on resize + deps.
 */
export function ConnectionLines({
  containerRef,
  pairs,
  deps = [],
}: {
  containerRef: RefObject<HTMLElement | null>;
  pairs: LinePair[];
  deps?: unknown[];
}) {
  const [paths, setPaths] = useState<DrawnPath[]>([]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const center = (q: Element, c: DOMRect) => {
      const r = q.getBoundingClientRect();
      return { x: r.left + r.width / 2 - c.left, y: r.top + r.height / 2 - c.top };
    };

    const compute = () => {
      const c = el.getBoundingClientRect();
      const next: DrawnPath[] = [];
      for (const p of pairs) {
        const aL = el.querySelector(`[data-anchor="${p.from}#L"]`);
        const aR = el.querySelector(`[data-anchor="${p.from}#R"]`);
        const bL = el.querySelector(`[data-anchor="${p.to}#L"]`);
        const bR = el.querySelector(`[data-anchor="${p.to}#R"]`);
        const aPlain = el.querySelector(`[data-anchor="${p.from}"]`);
        const bPlain = el.querySelector(`[data-anchor="${p.to}"]`);
        const aLeft = aL ?? aPlain;
        const aRight = aR ?? aPlain;
        const bLeft = bL ?? bPlain;
        const bRight = bR ?? bPlain;
        if (!aLeft || !aRight || !bLeft || !bRight) continue;

        const aLc = center(aLeft, c);
        const aRc = center(aRight, c);
        const bLc = center(bLeft, c);
        const bRc = center(bRight, c);

        let p1: { x: number; y: number };
        let p2: { x: number; y: number };
        const aCx = (aLc.x + aRc.x) / 2;
        const bCx = (bLc.x + bRc.x) / 2;
        if (bCx >= aCx) {
          p1 = aRc;
          p2 = bLc;
        } else {
          p1 = aLc;
          p2 = bRc;
        }
        const dir = p2.x >= p1.x ? 1 : -1;
        const dx = Math.max(34, Math.min(150, Math.abs(p2.x - p1.x) / 2));
        next.push({
          d: `M ${p1.x} ${p1.y} C ${p1.x + dir * dx} ${p1.y}, ${p2.x - dir * dx} ${p2.y}, ${p2.x} ${p2.y}`,
          color: p.color ?? "#64748b",
          dashed: p.dashed,
          glow: p.glow,
          mid: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
        });
      }
      setPaths(next);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    const t1 = setTimeout(compute, 300);
    const t2 = setTimeout(compute, 900);
    document.fonts?.ready.then(compute).catch(() => {});
    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {paths.map((p, i) => (
        <g key={i}>
          {p.glow && <path d={p.d} fill="none" stroke={p.color} strokeWidth={5} opacity={0.16} />}
          <path
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={1.6}
            strokeDasharray={p.dashed ? "5 5" : undefined}
            className={p.dashed ? "animate-dash-flow" : undefined}
            strokeLinecap="round"
          />
          <circle cx={p.mid.x} cy={p.mid.y} r={2.4} fill={p.color} />
        </g>
      ))}
    </svg>
  );
}
