import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Cog,
  Cpu,
  Database,
  FileJson,
  Globe,
  KeyRound,
  Link2,
  Lock,
  OctagonX,
  Play,
  RotateCcw,
  Route,
  ShieldCheck,
  Smartphone,
  Waypoints,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { LessonVisual, SchemaTableDef, LifecycleStep } from "@/data/mockData";
import { ConnectionLines, type LinePair } from "./ConnectionLines";
import { CodeBlock } from "./CodeBlock";

/* ============================ SCHEMA =============================== */

export function SchemaTableCard({ table }: { table: SchemaTableDef }) {
  return (
    <div className="relative w-[248px] shrink-0 overflow-visible rounded-xl border border-white/[0.09] bg-panel2 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 rounded-t-xl border-b border-white/[0.07] bg-white/[0.02] px-3 py-2">
        <span
          className="h-2.5 w-2.5 rounded-[4px]"
          style={{ background: table.color, boxShadow: `0 0 12px ${table.color}88` }}
        />
        <span className="font-mono text-[13px] font-semibold text-ink">{table.name}</span>
        {table.badge && (
          <span
            className="ml-auto rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
            style={{ color: table.color, borderColor: `${table.color}3a`, background: `${table.color}12` }}
          >
            {table.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col py-1">
        {table.columns.map((col) => {
          const id = `${table.name}.${col.name}`;
          return (
            <div
              key={col.name}
              className="group relative flex items-center gap-2 px-3.5 py-[7px] font-mono text-[12px] transition-colors hover:bg-white/[0.04]"
            >
              <span
                data-anchor={`${id}#L`}
                className={cn(
                  "absolute -left-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border",
                  col.key ? "border-current bg-panel2" : "border-transparent"
                )}
                style={{ color: col.key === "PK" ? "#fbbf24" : "#54c5f8" }}
              />
              <span
                data-anchor={`${id}#R`}
                className={cn(
                  "absolute -right-[4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border",
                  col.key ? "border-current bg-panel2" : "border-transparent"
                )}
                style={{ color: col.key === "PK" ? "#fbbf24" : "#54c5f8" }}
              />
              {col.key === "PK" && (
                <span className="flex items-center gap-1 rounded bg-gold/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-gold">
                  <KeyRound size={9} /> PK
                </span>
              )}
              {col.key === "FK" && (
                <span className="flex items-center gap-1 rounded bg-flutter/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-flutter">
                  <Link2 size={9} /> FK
                </span>
              )}
              {!col.key && <span className="w-[38px]" />}
              <span className={cn("text-ink", col.nullable && "text-mut")}>{col.name}</span>
              {col.unique && (
                <span className="rounded border border-viol/30 bg-viol/10 px-1 py-px text-[8.5px] font-semibold tracking-wider text-viol">
                  UNIQUE
                </span>
              )}
              <span className="ml-auto text-[11px] text-dim">{col.type}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SchemaVisualizer({ tables, note }: { tables: SchemaTableDef[]; note?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pairs: LinePair[] = [];
  for (const t of tables) {
    for (const col of t.columns) {
      if (col.ref) {
        pairs.push({
          from: `${t.name}.${col.name}`,
          to: `${col.ref.table}.${col.ref.col}`,
          color: "#54c5f8",
          dashed: true,
          glow: true,
        });
      }
    }
  }
  return (
    <div>
      <div
        ref={ref}
        className="relative flex flex-wrap items-start justify-center gap-6 px-2 py-5 lg:gap-10"
      >
        <ConnectionLines containerRef={ref} pairs={pairs} deps={[tables]} />
        {tables.map((t) => (
          <SchemaTableCard key={t.name} table={t} />
        ))}
      </div>
      {note && (
        <p className="mt-1 flex items-start gap-2 text-[13px] leading-relaxed text-mut">
          <Waypoints size={14} className="mt-0.5 shrink-0 text-flutter" />
          {note}
        </p>
      )}
    </div>
  );
}

/* =========================== LIFECYCLE ============================= */

const STEP_ICONS: Record<string, typeof Globe> = {
  globe: Globe,
  boot: Cog,
  route: Route,
  shield: ShieldCheck,
  controller: Cpu,
  db: Database,
  response: FileJson,
  dart: Smartphone,
  error: OctagonX,
  lock: Lock,
  token: KeyRound,
};

const TONE_COLORS = {
  default: "#a78bfa",
  danger: "#fb7185",
  success: "#34d399",
};

export function LifecycleVisualizer({ steps, note }: { steps: LifecycleStep[]; note?: string }) {
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (active >= steps.length - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setActive((a) => a + 1), active === -1 ? 60 : 620);
    return () => clearTimeout(t);
  }, [running, active, steps.length]);

  const start = () => {
    setActive(-1);
    setRunning(false);
    requestAnimationFrame(() => {
      setActive(-1);
      setRunning(true);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-1 pb-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
          request pipeline
        </span>
        <button
          onClick={start}
          className="flex items-center gap-1.5 rounded-full border border-viol/30 bg-viol/10 px-3.5 py-1.5 text-[12px] font-medium text-viol transition-all hover:bg-viol/20 hover:shadow-[0_0_18px_rgba(167,139,250,0.25)] active:scale-95"
        >
          {active >= steps.length - 1 ? <RotateCcw size={13} /> : <Play size={13} />}
          {active >= steps.length - 1 ? "Replay trace" : "Trace a request"}
        </button>
      </div>

      <div className="flex flex-col gap-1.5 lg:flex-row lg:items-stretch lg:gap-0">
        {steps.map((s, i) => {
          const Icon = STEP_ICONS[s.icon] ?? Cpu;
          const tone = TONE_COLORS[s.tone ?? "default"];
          const state = i < active ? "done" : i === active ? "active" : "idle";
          const color = state === "done" ? "#34d399" : tone;
          return (
            <div key={i} className="flex items-center lg:flex-1">
              <div
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-500 lg:flex-col lg:items-center lg:gap-1.5 lg:px-2 lg:py-3 lg:text-center",
                  state === "active" && "scale-[1.02]",
                  state === "done" ? "border-mint/25 bg-mint/[0.05]" : "border-white/[0.08] bg-panel2"
                )}
                style={
                  state === "active"
                    ? {
                        borderColor: `${tone}66`,
                        background: `${tone}14`,
                        boxShadow: `0 0 24px ${tone}33`,
                      }
                    : undefined
                }
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors duration-500"
                  style={{
                    color: state === "idle" ? "#8f94a8" : color,
                    borderColor: state === "idle" ? "rgba(255,255,255,0.1)" : `${color}55`,
                    background: state === "idle" ? "rgba(255,255,255,0.02)" : `${color}15`,
                  }}
                >
                  {state === "done" ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                </span>
                <div className="min-w-0">
                  <div
                    className={cn(
                      "truncate text-[12.5px] font-semibold leading-tight transition-colors duration-500",
                      state === "idle" ? "text-mut" : "text-ink"
                    )}
                  >
                    {s.title}
                  </div>
                  <div className="truncate font-mono text-[10.5px] text-dim">{s.sub}</div>
                </div>
                {state === "active" && (
                  <span
                    className="ml-auto h-1.5 w-1.5 animate-pulse-glow rounded-full lg:ml-0"
                    style={{ background: tone }}
                  />
                )}
              </div>
              {i < steps.length - 1 && (
                <>
                  <ArrowRight size={14} className="mx-1 hidden shrink-0 text-dim/70 lg:block" />
                  <ArrowDown size={14} className="ml-6 shrink-0 text-dim/50 lg:hidden" />
                </>
              )}
            </div>
          );
        })}
      </div>
      {note && (
        <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-mut">
          <Waypoints size={14} className="mt-0.5 shrink-0 text-viol" />
          {note}
        </p>
      )}
    </div>
  );
}

/* ============================ PIPELINE ============================= */

export function PipelineVisualizer({
  nodes,
  note,
}: {
  nodes: { label: string; lang: string; code: string }[];
  note?: string;
}) {
  return (
    <div>
      <div className="flex flex-col items-stretch gap-2 xl:flex-row xl:items-center">
        {nodes.map((n, i) => (
          <div key={i} className="flex min-w-0 items-center gap-2 xl:flex-1 flex-col xl:flex-row">
            <div className="w-full min-w-0 xl:flex-1">
              <div className="mb-1.5 pl-1 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                {n.label}
              </div>
              <CodeBlock code={n.code} lang={n.lang} compact className="h-full" />
            </div>
            {i < nodes.length - 1 && (
              <>
                <ArrowRight size={16} className="hidden shrink-0 text-flutter/80 xl:block" />
                <ArrowDown size={16} className="shrink-0 self-center text-flutter/60 xl:hidden" />
              </>
            )}
          </div>
        ))}
      </div>
      {note && (
        <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-mut">
          <Waypoints size={14} className="mt-0.5 shrink-0 text-flutter" />
          {note}
        </p>
      )}
    </div>
  );
}

/* ========================== dispatcher ============================= */

export function LessonVisualView({ visual }: { visual: LessonVisual }) {
  if (visual.kind === "schema") return <SchemaVisualizer tables={visual.tables} note={visual.note} />;
  if (visual.kind === "lifecycle") return <LifecycleVisualizer steps={visual.steps} note={visual.note} />;
  return <PipelineVisualizer nodes={visual.nodes} note={visual.note} />;
}
