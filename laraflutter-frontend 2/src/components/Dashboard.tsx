import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  FileJson,
  Flame,
  Layers,
  Lock,
  Play,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  firstIncompleteLesson,
  isLessonUnlocked,
  isModuleUnlocked,
  moduleProgress,
  modules,
  totalLessons,
  totalXp,
  type Module,
  type ModuleIcon,
} from "@/data/mockData";
import { useProgress, useDailyTaskDone } from "@/store/progressStore";
import { useView } from "@/store/viewStore";

const MODULE_ICONS: Record<ModuleIcon, typeof Database> = {
  database: Database,
  server: Server,
  orm: Layers,
  controller: Cpu,
  json: FileJson,
  shield: ShieldCheck,
};

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

function ProgressRing({ pct, size = 84, stroke = 7 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnim(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
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
          <stop offset="0%" stopColor="#54c5f8" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#ff4438" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------ banner ----------------------------- */

function StreakBanner() {
  const done = useDailyTaskDone();
  const streak = useProgress((s) => s.streak);
  const next = firstIncompleteLesson(useProgress((s) => s.completedLessons));
  const go = useView((s) => s.go);

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-mint/25 bg-gradient-to-r from-mint/[0.1] to-transparent px-4 py-3">
        <CheckCircle2 size={17} className="shrink-0 text-mint" />
        <p className="text-[13.5px] text-ink">
          <span className="font-semibold text-mint">{streak}-day streak secured.</span>{" "}
          <span className="text-mut">Come back tomorrow to keep it burning.</span>
        </p>
      </div>
    );
  }
  return (
    <button
      onClick={() => go({ name: "lesson", lessonId: next.id })}
      className="group flex w-full items-center gap-3 rounded-2xl border border-gold/25 bg-gradient-to-r from-gold/[0.12] via-gold/[0.05] to-transparent px-4 py-3 text-left transition-all hover:border-gold/40 hover:shadow-[0_0_30px_-8px_rgba(251,191,36,0.35)]"
    >
      <Flame size={17} className="shrink-0 text-gold" fill="currentColor" strokeWidth={1} />
      <p className="flex-1 text-[13.5px] text-ink">
        <span className="font-semibold text-gold">Streak at risk.</span>{" "}
        <span className="text-mut">
          Complete today's 5-minute task to preserve your {streak}-day streak.
        </span>
      </p>
      <ArrowUpRight size={15} className="shrink-0 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}

/* --------------------------- module card --------------------------- */

function ModuleCard({ module, idx }: { module: Module; idx: number }) {
  const completed = useProgress((s) => s.completedLessons);
  const go = useView((s) => s.go);
  const p = moduleProgress(module, completed);
  const unlocked = isModuleUnlocked(module.id, completed);
  const doneAll = p.done === p.total;
  const Icon = MODULE_ICONS[module.icon];
  const nextLesson =
    module.lessons.find((l) => !completed.includes(l.id)) ?? module.lessons[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-12 sm:pl-16"
    >
      {/* spine node */}
      <div
        className={cn(
          "absolute left-0 top-7 grid h-9 w-9 place-items-center rounded-xl border transition-all sm:h-11 sm:w-11",
          doneAll
            ? "border-mint/40 bg-mint/15 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            : unlocked
              ? "border-white/15 bg-panel2"
              : "border-white/[0.07] bg-panel2/60"
        )}
        style={unlocked && !doneAll ? { boxShadow: `0 0 22px ${module.color}33`, borderColor: `${module.color}55` } : undefined}
      >
        {doneAll ? (
          <Check size={17} className="text-mint" strokeWidth={3} />
        ) : unlocked ? (
          <Icon size={17} style={{ color: module.color }} />
        ) : (
          <Lock size={15} className="text-dim" />
        )}
      </div>

      <div
        className={cn(
          "card-sheen relative overflow-hidden rounded-2xl border transition-all duration-300",
          unlocked
            ? "border-white/[0.09] bg-panel hover:border-white/[0.16]"
            : "border-white/[0.05] bg-panel/50 opacity-70"
        )}
        style={unlocked && !doneAll && module.id === modules.find((m) => !isModuleFinished(m, completed))?.id ? { borderColor: `${module.color}2e` } : undefined}
      >
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${module.color}, transparent 65%)`, opacity: unlocked ? 0.9 : 0.25 }} />
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-semibold tracking-[0.18em]" style={{ color: unlocked ? module.color : "#5c6072" }}>
              MODULE {String(module.index).padStart(2, "0")}
            </span>
            <span className={cn(
              "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
              doneAll ? "border-mint/30 bg-mint/10 text-mint" : unlocked ? "border-flutter/25 bg-flutter/10 text-flutter" : "border-white/10 bg-white/[0.03] text-dim"
            )}>
              {doneAll ? "completed" : unlocked ? (p.done > 0 ? "in progress" : "ready") : "locked"}
            </span>
            <span className="ml-auto flex items-center gap-1 font-mono text-[11px] text-gold/90">
              <Zap size={11} />
              {module.lessons.reduce((s, l) => s + l.xp + (l.challenge.xp ?? 25), 0)} XP
            </span>
          </div>

          <h3 className="mt-2.5 max-w-[30ch] font-display text-[19px] font-bold leading-tight tracking-tight text-ink sm:text-[21px]">
            {module.title}
          </h3>
          <p className="mt-1.5 max-w-[62ch] text-[13.5px] leading-relaxed text-mut">
            {module.description}
          </p>

          {/* lessons */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {module.lessons.map((l) => {
              const lessonDone = completed.includes(l.id);
              const lessonOpen = unlocked && isLessonUnlocked(l.id, completed);
              return (
                <button
                  key={l.id}
                  disabled={!lessonOpen}
                  onClick={() => go({ name: "lesson", lessonId: l.id })}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
                    lessonDone
                      ? "border-mint/25 bg-mint/[0.07] text-mint"
                      : lessonOpen
                        ? "border-white/[0.1] bg-white/[0.03] text-ink/85 hover:-translate-y-px hover:border-flutter/40 hover:text-ink"
                        : "border-white/[0.05] text-dim"
                  )}
                >
                  {lessonDone ? <CheckCircle2 size={12} /> : lessonOpen ? <Play size={10} /> : <Lock size={10} />}
                  {l.title}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${p.pct}%`, background: module.color, boxShadow: p.pct > 0 ? `0 0 10px ${module.color}66` : undefined }}
              />
            </div>
            <span className="shrink-0 font-mono text-[11px] text-dim">
              {p.done}/{p.total} lessons
            </span>
            {unlocked && !doneAll && (
              <button
                onClick={() => go({ name: "lesson", lessonId: nextLesson.id })}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-semibold text-bg transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_-6px_rgba(255,255,255,0.45)] active:scale-95"
              >
                {p.done > 0 ? "Continue" : "Start"} <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function isModuleFinished(m: Module, completed: string[]) {
  return m.lessons.every((l) => completed.includes(l.id));
}

/* ----------------------------- dashboard --------------------------- */

export function Dashboard() {
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const completed = useProgress((s) => s.completedLessons);
  const go = useView((s) => s.go);

  const pct = Math.round((completed.length / totalLessons) * 100);
  const minutes = allMinutesRemaining(completed);

  const xpAnim = useCountUp(xp);
  const streakAnim = useCountUp(streak, 600);
  const doneAnim = useCountUp(completed.length, 600);

  return (
    <div className="relative">
      {/* hero */}
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-flutter/[0.09] blur-[110px]" />
      <div className="pointer-events-none absolute -top-10 right-[12%] h-64 w-64 rounded-full bg-laravel/[0.08] blur-[110px]" />

      <div className="relative px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-flutter/25 bg-flutter/[0.08] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-flutter">
                Backend track
              </span>
              <span className="rounded-full border border-laravel/25 bg-laravel/[0.08] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-laravel">
                Laravel for Flutter devs
              </span>
            </div>

            <h1 className="mt-5 max-w-[16ch] font-display text-[38px] font-bold leading-[1.04] tracking-[-0.03em] text-ink sm:text-[54px]">
              Learn the{" "}
              <span className="font-serif font-normal italic text-gradient-brand">
                other half
              </span>{" "}
              of your app.
            </h1>
            <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-mut">
              You already build beautiful clients. LaraFlutter teaches you the server side —
              databases, routing, ORM, validation and auth — by mapping every Laravel concept
              onto the Dart you already think in.
            </p>
          </motion.div>

          {/* floating request-trace card */}
          <motion.div
            initial={{ opacity: 0, y: 26, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute right-4 top-16 hidden w-[330px] animate-float xl:block"
          >
            <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a0c13]/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
                <span className="flex gap-1.5">
                  <i className="h-2 w-2 rounded-full bg-flutter/80" />
                  <i className="h-2 w-2 rounded-full bg-viol/80" />
                  <i className="h-2 w-2 rounded-full bg-laravel/80" />
                </span>
                <span className="font-mono text-[10px] text-dim">request_trace.log</span>
                <span className="ml-auto h-1.5 w-1.5 animate-pulse-glow rounded-full bg-mint" />
              </div>
              <div className="space-y-2 px-4 py-4 font-mono text-[11.5px] leading-relaxed">
                <div className="text-flutter">→ GET /api/posts/42</div>
                <div className="text-dim">middleware: auth:sanctum <span className="text-mint">pass</span></div>
                <div className="text-viol">Post::with(&apos;user&apos;)-&gt;find(42)</div>
                <div className="text-dim">select * from posts where id = 42 <span className="text-gold">(1 query)</span></div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-mint/15 px-1.5 py-0.5 text-[10px] font-bold text-mint">200 OK</span>
                  <span className="text-dim">14ms · JSON</span>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 text-[10.5px] text-mut">
                  {'{ "id": 42, "title": "Ship it",'}
                  <br />
                  {'  "author": { "name": "Ada" } }'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* stats */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-panel p-4">
              <div className="flex items-center justify-between">
                <Flame size={17} className="text-laravel" fill="currentColor" strokeWidth={1.2} />
                <span className="font-mono text-[10px] uppercase tracking-wider text-dim">streak</span>
              </div>
              <div className="mt-2.5 font-display text-[30px] font-bold leading-none text-ink">
                {streakAnim}
                <span className="ml-1 text-[13px] font-medium text-mut">days</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-panel p-4">
              <div className="flex items-center justify-between">
                <Zap size={17} className="text-gold" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-dim">total xp</span>
              </div>
              <div className="mt-2.5 font-display text-[30px] font-bold leading-none text-ink">
                {xpAnim.toLocaleString()}
              </div>
              <div className="mt-1 font-mono text-[10.5px] text-dim">of {totalXp.toLocaleString()} possible</div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-panel p-4">
              <div className="flex items-center justify-between">
                <CheckCircle2 size={17} className="text-mint" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-dim">lessons</span>
              </div>
              <div className="mt-2.5 font-display text-[30px] font-bold leading-none text-ink">
                {doneAnim}
                <span className="text-[15px] font-medium text-mut">/{totalLessons}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-panel p-4">
              <div className="relative">
                <ProgressRing pct={pct} />
                <span className="absolute inset-0 grid place-items-center font-mono text-[14px] font-bold text-ink">
                  {pct}%
                </span>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-dim">track progress</div>
                <div className="mt-1 flex items-center gap-1 text-[12px] text-mut">
                  <Clock size={12} /> ~{minutes} min left
                </div>
              </div>
            </div>
          </motion.div>

          {/* streak banner */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 flex flex-col gap-3"
          >
            <StreakBanner />
            {pct === 100 && (
              <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-gradient-to-r from-flutter/15 via-viol/15 to-laravel/15 px-4 py-3">
                <CheckCircle2 size={17} className="shrink-0 text-mint" />
                <p className="text-[13.5px] text-ink">
                  <span className="font-serif italic text-gradient-brand">Track mastered.</span>{" "}
                  <span className="text-mut">
                    Schema to Sanctum — you have the full backend mental model. Revisit any lesson, or keep experimenting in the playground.
                  </span>
                </p>
              </div>
            )}
          </motion.div>

          {/* roadmap */}
          <div className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
                  <Sparkles size={12} className="text-flutter" /> Module roadmap
                </div>
                <h2 className="mt-1.5 font-display text-[24px] font-bold tracking-tight text-ink">
                  Six modules. Zero backend fear.
                </h2>
              </div>
              <button
                onClick={() => go({ name: "playground" })}
                className="hidden items-center gap-1.5 rounded-full border border-white/12 px-4 py-2 text-[12.5px] font-medium text-mut transition-all hover:border-white/25 hover:text-ink sm:flex"
              >
                Open schema playground <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="relative">
              {/* spine */}
              <div className="absolute bottom-10 left-[17.5px] top-8 w-px bg-gradient-to-b from-flutter/50 via-white/[0.12] to-laravel/40 sm:left-[21.5px]" />
              <div className="flex flex-col gap-5">
                {modules.map((m, i) => (
                  <ModuleCard key={m.id} module={m} idx={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function allMinutesRemaining(completed: string[]): number {
  return modules
    .flatMap((m) => m.lessons)
    .filter((l) => !completed.includes(l.id))
    .reduce((s, l) => s + parseInt(l.readTime), 0);
}
