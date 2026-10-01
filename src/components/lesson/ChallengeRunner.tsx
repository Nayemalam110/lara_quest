import React, { useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Check,
  CheckCircle2,
  GripVertical,
  ListOrdered,
  MousePointerClick,
  PenLine,
  Shuffle,
  Target,
  X,
  Zap,
  Database,
  Send,
  Bug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Challenge, Lesson } from "@/types";
import { useProgressStore } from "@/store/useProgressStore";
import { highlight } from "@/lib/highlight";
import { popBurst } from "@/lib/fx";
import { SqlWriterChallenge } from "../challenges/SqlWriterChallenge";
import { ApiSimulatorChallenge } from "../challenges/ApiSimulatorChallenge";
import { ErrorDebuggerChallenge } from "../challenges/ErrorDebuggerChallenge";

const TYPE_META = {
  mcq: { label: "Multiple Choice Quiz", icon: MousePointerClick, color: "#38bdf8" },
  "drag-drop": { label: "Sequence Pipeline", icon: ListOrdered, color: "#a78bfa" },
  "fill-blank": { label: "Fix The Code", icon: PenLine, color: "#fbbf24" },
  "sql-writer": { label: "SQL Query Writer", icon: Database, color: "#34d399" },
  "api-simulator": { label: "API Request Simulator", icon: Send, color: "#818cf8" },
  "error-debugger": { label: "Production Error Debugger", icon: Bug, color: "#f43f5e" },
};

export interface ChallengeRunnerProps {
  lesson: Lesson;
  onSuccess?: () => void;
}

export function ChallengeRunner({ lesson, onSuccess }: ChallengeRunnerProps) {
  const c = lesson.challenge;
  const xp = c.xp ?? lesson.xp ?? 25;
  const { getStats } = useProgressStore();
  const stats = getStats();
  const solved = (stats.completedLessonIds || []).map(String).includes(lesson.id);

  const meta = TYPE_META[c.type] || TYPE_META.mcq;
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-colors duration-500",
        solved ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800 bg-slate-900"
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg"
          style={{ background: `${meta.color}1a`, color: meta.color }}
        >
          <Icon size={14} />
        </span>
        <span className="text-[14px] font-semibold text-white">Interactive Task</span>
        <span
          className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
          style={{
            color: meta.color,
            borderColor: `${meta.color}3a`,
            background: `${meta.color}10`,
          }}
        >
          {meta.label}
        </span>
        <span className="ml-auto flex items-center gap-1 rounded-full border border-[#fbbf24]/25 bg-[#fbbf24]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#fbbf24]">
          <Zap size={11} /> +{xp} XP
        </span>
        {solved && (
          <span className="flex items-center gap-1 rounded-full border border-[#34d399]/30 bg-[#34d399]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#34d399]">
            <BadgeCheck size={12} /> Solved
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="mb-4 text-[15px] font-medium leading-snug text-white">
          <Target size={14} className="mr-1.5 inline-block -translate-y-px text-slate-400" />
          {c.question}
        </p>

        {c.type === "mcq" && (
          <McqChallenge lesson={lesson} solved={solved} onSuccess={onSuccess} />
        )}
        {c.type === "drag-drop" && (
          <DragDropChallenge lesson={lesson} solved={solved} onSuccess={onSuccess} />
        )}
        {c.type === "fill-blank" && (
          <FillBlankChallenge lesson={lesson} solved={solved} onSuccess={onSuccess} />
        )}
        {c.type === "sql-writer" && (
          <SqlWriterChallenge lesson={lesson} solved={solved} onSuccess={onSuccess} />
        )}
        {c.type === "api-simulator" && (
          <ApiSimulatorChallenge lesson={lesson} solved={solved} onSuccess={onSuccess} />
        )}
        {c.type === "error-debugger" && (
          <ErrorDebuggerChallenge lesson={lesson} solved={solved} onSuccess={onSuccess} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------ MCQ ------------------------------- */

function McqChallenge({
  lesson,
  solved,
  onSuccess,
}: {
  lesson: Lesson;
  solved: boolean;
  onSuccess?: () => void;
}) {
  const c = lesson.challenge;
  const { completeLesson } = useProgressStore();
  const [wrong, setWrong] = useState<number | null>(null);
  const [justSolved, setJustSolved] = useState(false);
  const letters = ["A", "B", "C", "D", "E"];
  const correct = Number(c.correctAnswer);

  const pick = (i: number) => {
    if (solved || wrong !== null) return;
    if (i === correct) {
      setJustSolved(true);
      completeLesson(lesson.moduleId, lesson.id, c.xp ?? lesson.xp ?? 25);
      popBurst();
      if (onSuccess) setTimeout(onSuccess, 500);
    } else {
      setWrong(i);
      setTimeout(() => setWrong(null), 900);
    }
  };

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {(c.options ?? []).map((opt, i) => {
          const isRight = solved && i === correct;
          const isWrong = wrong === i;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={solved}
              className={cn(
                "group flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer select-none",
                isRight
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : isWrong
                  ? "animate-shake border-rose-500/50 bg-rose-500/10"
                  : solved
                  ? "border-slate-800 opacity-50 cursor-default"
                  : "border-slate-800 bg-slate-800/40 hover:-translate-y-px hover:border-sky-400/40 hover:bg-sky-400/10"
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-md border font-mono text-[11px] font-bold",
                  isRight
                    ? "border-emerald-500/50 text-emerald-400"
                    : isWrong
                    ? "border-rose-500/50 text-rose-400"
                    : "border-slate-700 text-slate-400 group-hover:border-sky-400/50 group-hover:text-sky-400"
                )}
              >
                {isRight ? <Check size={12} /> : isWrong ? <X size={12} /> : letters[i]}
              </span>
              <span
                className={cn(
                  "text-[13.5px] leading-snug",
                  isRight ? "text-white" : "text-slate-300 group-hover:text-white"
                )}
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>
      {wrong !== null && (
        <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-rose-400">
          <X size={13} /> That option doesn't match the server mental model. Re-check and retry!
        </p>
      )}
      <Explanation lesson={lesson} solved={solved} justSolved={justSolved} />
    </div>
  );
}

/* --------------------------- DRAG & DROP --------------------------- */

function normalizeOrder(arr: string[]): string {
  return arr.map((s) => s.trim().toLowerCase()).join("→");
}

function DragDropChallenge({
  lesson,
  solved,
  onSuccess,
}: {
  lesson: Lesson;
  solved: boolean;
  onSuccess?: () => void;
}) {
  const c = lesson.challenge;
  const { completeLesson } = useProgressStore();
  const correctOrder = useMemo(
    () => String(c.correctAnswer).split("→").map((s) => s.trim()),
    [c.correctAnswer]
  );
  const [order, setOrder] = useState<string[]>(() => [
    ...(c.options ?? c.items ?? []),
  ]);
  const [shake, setShake] = useState(false);
  const [justSolved, setJustSolved] = useState(false);
  const dragIdx = useRef<number | null>(null);

  const display = solved ? correctOrder : order;

  const move = (from: number, to: number) => {
    if (solved || to < 0 || to >= order.length) return;
    setOrder((o) => {
      const next = [...o];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  };

  const check = () => {
    if (normalizeOrder(order) === normalizeOrder(correctOrder)) {
      setJustSolved(true);
      completeLesson(lesson.moduleId, lesson.id, c.xp ?? lesson.xp ?? 25);
      popBurst();
      if (onSuccess) setTimeout(onSuccess, 500);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const shuffle = () => {
    setOrder((o) => {
      const next = [...o];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  return (
    <div>
      {!solved && (
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
          Reorder the steps into the correct execution sequence:
        </p>
      )}
      <div className={cn("flex flex-col gap-2", shake && "animate-shake")}>
        {display.map((item, i) => (
          <div
            key={item}
            draggable={!solved}
            onDragStart={() => (dragIdx.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIdx.current !== null && dragIdx.current !== i)
                move(dragIdx.current, i);
              dragIdx.current = null;
            }}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
              solved
                ? "border-emerald-500/25 bg-emerald-500/5"
                : "cursor-grab border-slate-700/80 bg-slate-800/50 active:cursor-grabbing hover:border-violet-400/40 hover:bg-violet-400/10"
            )}
          >
            {solved ? (
              <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            ) : (
              <GripVertical size={15} className="shrink-0 text-slate-400" />
            )}
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-slate-700 bg-slate-800 font-mono text-[11px] font-bold text-slate-300">
              {i + 1}
            </span>
            <span
              className={cn(
                "flex-1 text-[13.5px] leading-snug",
                solved ? "text-white" : "text-slate-200"
              )}
            >
              {item}
            </span>
            {!solved && (
              <span className="flex shrink-0 flex-col">
                <button
                  onClick={() => move(i, i - 1)}
                  className="rounded p-0.5 text-slate-400 transition-colors hover:text-white"
                  aria-label="Move up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  onClick={() => move(i, i + 1)}
                  className="rounded p-0.5 text-slate-400 transition-colors hover:text-white"
                  aria-label="Move down"
                >
                  <ArrowDown size={13} />
                </button>
              </span>
            )}
          </div>
        ))}
      </div>

      {!solved && (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={check}
            className="rounded-full bg-white px-5 py-2 text-[13px] font-bold text-slate-950 transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_-8px_rgba(255,255,255,0.4)] active:scale-95 cursor-pointer"
          >
            Check Sequence
          </button>
          <button
            onClick={shuffle}
            className="flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-[12.5px] font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white cursor-pointer"
          >
            <Shuffle size={13} /> Shuffle
          </button>
        </div>
      )}

      <Explanation
        lesson={lesson}
        solved={solved}
        justSolved={justSolved}
        wrongHint={
          shake
            ? "The pipeline order isn't correct yet — consider which step occurs first before routing."
            : undefined
        }
      />
    </div>
  );
}

/* ---------------------------- FILL BLANK --------------------------- */

function FillBlankChallenge({
  lesson,
  solved,
  onSuccess,
}: {
  lesson: Lesson;
  solved: boolean;
  onSuccess?: () => void;
}) {
  const c = lesson.challenge;
  const { completeLesson } = useProgressStore();
  const answer = String(c.correctAnswer);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [justSolved, setJustSolved] = useState(false);

  const [pre, post] = useMemo(() => {
    const parts = (c.code ?? "").split("{{blank}}");
    return [parts[0] ?? "", parts[1] ?? ""];
  }, [c.code]);

  const preHtml = useMemo(() => highlight(pre, "php"), [pre]);
  const postHtml = useMemo(() => highlight(post, "php"), [post]);
  const filled = solved ? answer : picked;

  const pick = (opt: string) => {
    if (solved || wrong) return;
    if (opt.trim().toLowerCase() === answer.trim().toLowerCase()) {
      setPicked(opt);
      setJustSolved(true);
      completeLesson(lesson.moduleId, lesson.id, c.xp ?? lesson.xp ?? 25);
      popBurst();
      if (onSuccess) setTimeout(onSuccess, 500);
    } else {
      setWrong(opt);
      setPicked(opt);
      setTimeout(() => {
        setWrong(null);
        setPicked(null);
      }, 900);
    }
  };

  return (
    <div>
      {c.code && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/60 px-3.5 py-2">
            <span className="flex gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </span>
            <span className="ml-1 font-mono text-[11px] text-slate-400">
              complete_the_code.php
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-[1.75]">
            <code>
              <span dangerouslySetInnerHTML={{ __html: preHtml }} />
              <span
                className={cn(
                  "mx-1 inline-block min-w-[92px] -translate-y-px rounded-md border px-2 py-0.5 text-center align-baseline text-[12px] font-semibold transition-all",
                  filled && !wrong
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                    : wrong
                    ? "animate-shake border-rose-500/60 bg-rose-500/15 text-rose-400"
                    : "animate-pulse-glow border-dashed border-amber-400/50 bg-amber-400/10 text-amber-300"
                )}
                style={{ borderStyle: filled && !wrong ? "solid" : "dashed" }}
              >
                {filled ?? "select token below"}
              </span>
              <span dangerouslySetInnerHTML={{ __html: postHtml }} />
            </code>
          </pre>
        </div>
      )}

      {/* Options */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(c.options ?? c.blanks ?? []).map((opt) => {
          const isRight = solved && opt.trim().toLowerCase() === answer.trim().toLowerCase();
          const isWrong = wrong === opt;
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={solved}
              className={cn(
                "rounded-lg border px-3.5 py-2 font-mono text-[13px] transition-all cursor-pointer select-none",
                isRight
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                  : isWrong
                  ? "border-rose-500/60 bg-rose-500/10 text-rose-400"
                  : solved
                  ? "border-slate-800 text-slate-500 opacity-50 cursor-default"
                  : "border-slate-700 bg-slate-800/60 text-slate-200 hover:-translate-y-px hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-300"
              )}
            >
              {isRight && (
                <Check size={12} className="mr-1 inline-block -translate-y-px" />
              )}
              {opt}
            </button>
          );
        })}
      </div>

      {wrong && (
        <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-rose-400">
          <X size={13} /> That syntax doesn't fit the slot. Try another keyword.
        </p>
      )}

      <Explanation lesson={lesson} solved={solved} justSolved={justSolved} />
    </div>
  );
}

/* ---------------------------- FEEDBACK ----------------------------- */

function Explanation({
  lesson,
  solved,
  justSolved,
  wrongHint,
}: {
  lesson: Lesson;
  solved: boolean;
  justSolved: boolean;
  wrongHint?: string;
}) {
  if (wrongHint) {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-rose-400">
        <X size={13} /> {wrongHint}
      </p>
    );
  }
  if (!solved) return null;

  return (
    <div className="mt-4 animate-fade-up rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <CheckCircle2 size={15} className="text-emerald-400" />
        <span className="text-[13px] font-semibold text-emerald-400">
          {justSolved
            ? `Correct! +${lesson.challenge.xp ?? lesson.xp ?? 25} XP awarded 🎉`
            : "Challenge Solved"}
        </span>
      </div>
      <p className="text-[13.5px] leading-relaxed text-slate-200">
        {lesson.challenge.explanation}
      </p>
    </div>
  );
}
