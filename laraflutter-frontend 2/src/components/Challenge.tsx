import { useMemo, useRef, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { Lesson } from "@/data/mockData";
import { useProgress } from "@/store/progressStore";
import { highlight } from "@/lib/highlight";
import { popBurst } from "@/lib/fx";

const TYPE_META = {
  mcq: { label: "Quiz", icon: MousePointerClick, color: "#54c5f8" },
  "drag-drop": { label: "Fix the pipeline", icon: ListOrdered, color: "#a78bfa" },
  "fill-blank": { label: "Fix the code", icon: PenLine, color: "#fbbf24" },
};

export function Challenge({ lesson }: { lesson: Lesson }) {
  const c = lesson.challenge;
  const xp = c.xp ?? 25;
  const solved = useProgress((s) => s.completedChallenges.includes(lesson.id));
  const meta = TYPE_META[c.type];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-colors duration-500",
        solved ? "border-mint/25 bg-mint/[0.03]" : "border-white/[0.09] bg-panel"
      )}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: `${meta.color}1a`, color: meta.color }}>
          <Icon size={14} />
        </span>
        <span className="text-[14px] font-semibold text-ink">Challenge</span>
        <span
          className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
          style={{ color: meta.color, borderColor: `${meta.color}3a`, background: `${meta.color}10` }}
        >
          {meta.label}
        </span>
        <span className="ml-auto flex items-center gap-1 rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-gold">
          <Zap size={11} /> +{xp} XP
        </span>
        {solved && (
          <span className="flex items-center gap-1 rounded-full border border-mint/30 bg-mint/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-mint">
            <BadgeCheck size={12} /> solved
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="mb-4 text-[15px] font-medium leading-snug text-ink">
          <Target size={14} className="mr-1.5 inline-block -translate-y-px text-mut" />
          {c.question}
        </p>

        {c.type === "mcq" && <Mcq lesson={lesson} solved={solved} />}
        {c.type === "drag-drop" && <DragDrop lesson={lesson} solved={solved} />}
        {c.type === "fill-blank" && <FillBlank lesson={lesson} solved={solved} />}
      </div>
    </div>
  );
}

/* ------------------------------ MCQ ------------------------------- */

function Mcq({ lesson, solved }: { lesson: Lesson; solved: boolean }) {
  const c = lesson.challenge;
  const complete = useProgress((s) => s.completeChallenge);
  const [wrong, setWrong] = useState<number | null>(null);
  const [justSolved, setJustSolved] = useState(false);
  const letters = ["A", "B", "C", "D", "E"];
  const correct = Number(c.correctAnswer);

  const pick = (i: number) => {
    if (solved || wrong !== null) return;
    if (i === correct) {
      setJustSolved(true);
      complete(lesson.id, c.xp ?? 25);
      popBurst();
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
                "group flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200",
                isRight
                  ? "border-mint/40 bg-mint/[0.08]"
                  : isWrong
                    ? "animate-shake border-laravel/50 bg-laravel/[0.08]"
                    : solved
                      ? "border-white/[0.06] opacity-50"
                      : "border-white/[0.09] bg-white/[0.02] hover:-translate-y-px hover:border-flutter/40 hover:bg-flutter/[0.05] hover:shadow-[0_8px_30px_-12px_rgba(84,197,248,0.35)]"
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-md border font-mono text-[11px] font-bold",
                  isRight ? "border-mint/50 text-mint" : isWrong ? "border-laravel/50 text-laravel" : "border-white/15 text-mut group-hover:border-flutter/50 group-hover:text-flutter"
                )}
              >
                {isRight ? <Check size={12} /> : isWrong ? <X size={12} /> : letters[i]}
              </span>
              <span className={cn("text-[13.5px] leading-snug", isRight ? "text-ink" : "text-mut group-hover:text-ink")}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>
      {wrong !== null && (
        <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-laravel">
          <X size={13} /> Not quite — trace the mental model again and retry.
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

function DragDrop({ lesson, solved }: { lesson: Lesson; solved: boolean }) {
  const c = lesson.challenge;
  const complete = useProgress((s) => s.completeChallenge);
  const correctOrder = useMemo(
    () => String(c.correctAnswer).split("→").map((s) => s.trim()),
    [c.correctAnswer]
  );
  const [order, setOrder] = useState<string[]>(() => [...(c.options ?? [])]);
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
      complete(lesson.id, c.xp ?? 25);
      popBurst();
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
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
          Drag the steps — or use the arrows — into the correct order
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
              if (dragIdx.current !== null && dragIdx.current !== i) move(dragIdx.current, i);
              dragIdx.current = null;
            }}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
              solved ? "border-mint/25 bg-mint/[0.05]" : "cursor-grab border-white/[0.09] bg-white/[0.02] active:cursor-grabbing hover:border-viol/40 hover:bg-viol/[0.05]"
            )}
          >
            {solved ? (
              <CheckCircle2 size={15} className="shrink-0 text-mint" />
            ) : (
              <GripVertical size={15} className="shrink-0 text-dim" />
            )}
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.03] font-mono text-[11px] font-bold text-mut">
              {i + 1}
            </span>
            <span className={cn("flex-1 text-[13.5px] leading-snug", solved ? "text-ink" : "text-ink/85")}>
              {item}
            </span>
            {!solved && (
              <span className="flex shrink-0 flex-col">
                <button onClick={() => move(i, i - 1)} className="rounded p-0.5 text-dim transition-colors hover:text-ink" aria-label="Move up">
                  <ArrowUp size={13} />
                </button>
                <button onClick={() => move(i, i + 1)} className="rounded p-0.5 text-dim transition-colors hover:text-ink" aria-label="Move down">
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
            className="rounded-full bg-ink px-5 py-2 text-[13px] font-semibold text-bg transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_-8px_rgba(255,255,255,0.4)] active:scale-95"
          >
            Check order
          </button>
          <button
            onClick={shuffle}
            className="flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2 text-[12.5px] font-medium text-mut transition-colors hover:border-white/25 hover:text-ink"
          >
            <Shuffle size={13} /> Shuffle
          </button>
        </div>
      )}
      <Explanation lesson={lesson} solved={solved} justSolved={justSolved} wrongHint={shake ? "Order isn't right yet — think: where does a request begin, and what must happen before your logic runs?" : undefined} />
    </div>
  );
}

/* ---------------------------- FILL BLANK --------------------------- */

function FillBlank({ lesson, solved }: { lesson: Lesson; solved: boolean }) {
  const c = lesson.challenge;
  const complete = useProgress((s) => s.completeChallenge);
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
    if (opt === answer) {
      setPicked(opt);
      setJustSolved(true);
      complete(lesson.id, c.xp ?? 25);
      popBurst();
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
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#090b11]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3.5 py-2">
            <span className="flex gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
            </span>
            <span className="ml-1 font-mono text-[11px] text-mut">fix_the_code.php</span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-[1.75]">
            <code>
              <span dangerouslySetInnerHTML={{ __html: preHtml }} />
              <span
                className={cn(
                  "mx-0.5 inline-block min-w-[92px] -translate-y-px rounded-md border px-2 py-0.5 text-center align-baseline text-[12px] font-semibold transition-all",
                  filled && !wrong
                    ? "border-mint/50 bg-mint/15 text-mint"
                    : wrong
                      ? "animate-shake border-laravel/60 bg-laravel/15 text-laravel"
                      : "animate-pulse-glow border-dashed border-gold/50 bg-gold/10 text-gold/80"
                )}
                style={{ borderStyle: filled && !wrong ? "solid" : "dashed" }}
              >
                {filled ?? "pick below"}
              </span>
              <span dangerouslySetInnerHTML={{ __html: postHtml }} />
            </code>
          </pre>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(c.options ?? []).map((opt) => {
          const isRight = solved && opt === answer;
          const isWrong = wrong === opt;
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={solved}
              className={cn(
                "rounded-lg border px-3.5 py-2 font-mono text-[13px] transition-all",
                isRight
                  ? "border-mint/50 bg-mint/15 text-mint"
                  : isWrong
                    ? "border-laravel/60 bg-laravel/10 text-laravel"
                    : solved
                      ? "border-white/[0.06] text-dim opacity-50"
                      : "border-white/[0.12] bg-white/[0.03] text-ink/85 hover:-translate-y-px hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
              )}
            >
              {isRight && <Check size={12} className="mr-1 inline-block -translate-y-px" />}
              {opt}
            </button>
          );
        })}
      </div>
      {wrong && (
        <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-laravel">
          <X size={13} /> The parser says no — that token doesn't fit. Try another.
        </p>
      )}
      <Explanation lesson={lesson} solved={solved} justSolved={justSolved} />
    </div>
  );
}

/* ---------------------------- feedback ----------------------------- */

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
    return <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-laravel"><X size={13} /> {wrongHint}</p>;
  }
  if (!solved) return null;
  return (
    <div className="mt-4 animate-fade-up rounded-xl border border-mint/25 bg-mint/[0.06] p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <CheckCircle2 size={15} className="text-mint" />
        <span className="text-[13px] font-semibold text-mint">
          {justSolved ? `Correct — +${lesson.challenge.xp ?? 25} XP earned` : "Challenge solved"}
        </span>
      </div>
      <p className="text-[13.5px] leading-relaxed text-ink/85">{lesson.challenge.explanation}</p>
    </div>
  );
}
