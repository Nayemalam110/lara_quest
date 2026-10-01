import {
  Boxes,
  Flame,
  GraduationCap,
  RotateCcw,
  TerminalSquare,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { modules, moduleProgress } from "@/data/mockData";
import { useProgress } from "@/store/progressStore";
import { useView } from "@/store/viewStore";

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-flutter/25 via-panel to-laravel/25">
        <TerminalSquare size={17} className="text-ink" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-mint shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
      </span>
      {!compact && (
        <span className="font-mono text-[15px] font-bold tracking-tight">
          <span className="text-laravel">Lara</span>
          <span className="text-flutter">Flutter</span>
        </span>
      )}
    </div>
  );
}

function NavButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Boxes;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all",
        active
          ? "border border-white/10 bg-white/[0.06] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "border border-transparent text-mut hover:bg-white/[0.03] hover:text-ink"
      )}
    >
      <Icon size={16} className={active ? "text-flutter" : "text-dim"} />
      {label}
    </button>
  );
}

function XpChip() {
  const xp = useProgress((s) => s.xp);
  return (
    <span className="flex items-center gap-1 rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 font-mono text-[11.5px] font-bold text-gold">
      <Zap size={11} /> {xp.toLocaleString()}
    </span>
  );
}

function StreakChip() {
  const streak = useProgress((s) => s.streak);
  return (
    <span className="flex items-center gap-1 rounded-full border border-laravel/30 bg-laravel/10 px-2.5 py-1 font-mono text-[11.5px] font-bold text-laravel">
      <Flame size={12} /> {streak}
    </span>
  );
}

export function Sidebar() {
  const { view, go } = useView();
  const completed = useProgress((s) => s.completedLessons);
  const streak = useProgress((s) => s.streak);
  const reset = useProgress((s) => s.reset);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[264px] flex-col border-r border-white/[0.07] bg-[#090b10]/90 p-4 backdrop-blur-xl lg:flex">
      <button onClick={() => go({ name: "dashboard" })} className="px-1.5 pb-5 pt-1.5 text-left">
        <Logo />
      </button>

      <nav className="flex flex-col gap-1">
        <NavButton
          active={view.name === "dashboard" || view.name === "lesson"}
          icon={GraduationCap}
          label="Learn"
          onClick={() => go({ name: "dashboard" })}
        />
        <NavButton
          active={view.name === "playground"}
          icon={Boxes}
          label="Schema Playground"
          onClick={() => go({ name: "playground" })}
        />
      </nav>

      <div className="mt-7 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
        Track progress
      </div>
      <div className="mt-2 flex flex-col gap-1 overflow-y-auto pr-1">
        {modules.map((m) => {
          const p = moduleProgress(m, completed);
          return (
            <button
              key={m.id}
              onClick={() => go({ name: "dashboard" })}
              className="group rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: m.color, opacity: p.done === p.total ? 1 : 0.55 }}
                />
                <span className="truncate text-[12px] text-mut transition-colors group-hover:text-ink">
                  {String(m.index).padStart(2, "0")} · {m.tagline}
                </span>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-dim">
                  {p.done}/{p.total}
                </span>
              </div>
              <div className="ml-3.5 mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${p.pct}%`, background: m.color }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-white/[0.07] pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-laravel/20 bg-gradient-to-br from-laravel/[0.12] to-transparent p-3.5">
          <div className="relative">
            <Flame size={26} className="text-laravel" fill="currentColor" strokeWidth={1} />
            <span className="absolute inset-0 animate-pulse-glow rounded-full" />
          </div>
          <div>
            <div className="text-[15px] font-bold leading-tight text-ink">
              {streak}-day streak
            </div>
            <div className="text-[11px] text-mut">Solve 1 challenge daily</div>
          </div>
          <span className="ml-auto">
            <XpChip />
          </span>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Reset all demo progress?")) reset();
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium text-dim transition-colors hover:text-mut"
        >
          <RotateCcw size={11} /> Reset demo progress
        </button>
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/[0.07] bg-[#090b10]/85 px-4 py-3 backdrop-blur-xl lg:hidden">
      <Logo />
      <span className="ml-auto" />
      <StreakChip />
      <XpChip />
    </header>
  );
}

export function BottomNav() {
  const { view, go } = useView();
  const items = [
    { name: "dashboard" as const, icon: GraduationCap, label: "Learn" },
    { name: "playground" as const, icon: Boxes, label: "Playground" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch gap-1 border-t border-white/[0.08] bg-[#090b10]/92 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      {items.map((it) => {
        const active =
          it.name === "dashboard"
            ? view.name === "dashboard" || view.name === "lesson"
            : view.name === it.name;
        return (
          <button
            key={it.name}
            onClick={() => go({ name: it.name })}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors",
              active ? "text-ink" : "text-dim"
            )}
          >
            <it.icon size={18} className={active ? "text-flutter" : "text-dim"} />
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
