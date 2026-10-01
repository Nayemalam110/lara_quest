"use client";
import { useState, useEffect, useRef } from "react";
import { type Challenge } from "@/data/mockData";
import { CheckCircle, XCircle, Trophy, GripVertical, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ChallengeRunnerProps {
  challenge: Challenge;
  xp: number;
  onComplete: () => void;
  isCompleted: boolean;
}

// --- MCQ Challenge ---
function MCQChallenge({
  challenge,
  onResult,
}: {
  challenge: Challenge;
  onResult: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = challenge.correctAnswer as number;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    onResult(selected === correct);
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-2.5">
        {challenge.options?.map((option, idx) => {
          let state: "idle" | "selected" | "correct" | "wrong" = "idle";
          if (submitted) {
            if (idx === correct) state = "correct";
            else if (idx === selected && selected !== correct) state = "wrong";
          } else if (selected === idx) {
            state = "selected";
          }

          return (
            <button
              key={idx}
              onClick={() => !submitted && setSelected(idx)}
              disabled={submitted}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200",
                state === "idle" &&
                  "border-white/10 bg-slate-800/60 text-slate-300 hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-white",
                state === "selected" &&
                  "border-violet-500 bg-violet-500/15 text-white",
                state === "correct" &&
                  "border-emerald-500 bg-emerald-500/15 text-emerald-300",
                state === "wrong" &&
                  "border-red-500 bg-red-500/15 text-red-300"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-6 h-6 rounded-full border text-xs flex items-center justify-center font-bold shrink-0",
                    state === "idle" && "border-slate-600 text-slate-400",
                    state === "selected" && "border-violet-500 text-violet-400",
                    state === "correct" && "border-emerald-500 bg-emerald-500 text-white",
                    state === "wrong" && "border-red-500 bg-red-500 text-white"
                  )}
                >
                  {state === "correct" ? "✓" : state === "wrong" ? "✗" : String.fromCharCode(65 + idx)}
                </span>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full mt-2"
          size="lg"
        >
          Submit Answer <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
}

// --- Drag & Drop Challenge ---
function DragDropChallenge({
  challenge,
  onResult,
}: {
  challenge: Challenge;
  onResult: (correct: boolean) => void;
}) {
  const items = challenge.items ?? challenge.options ?? [];
  const [order, setOrder] = useState<number[]>(
    Array.from({ length: items.length }, (_, i) => i)
  );
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const handleDragStart = (idx: number) => setDragging(idx);
  const handleDragEnter = (idx: number) => { dragOver.current = idx; };
  const handleDragEnd = () => {
    if (dragging === null || dragOver.current === null) return;
    const newOrder = [...order];
    const from = dragging;
    const to = dragOver.current;
    const [moved] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, moved);
    setOrder(newOrder);
    setDragging(null);
    dragOver.current = null;
  };

  const handleSubmit = () => {
    const correctOrder = (challenge.correctAnswer as string).split(",").map(Number);
    const isCorrect = order.join(",") === correctOrder.join(",");
    setSubmitted(true);
    onResult(isCorrect);
  };

  const correctOrder = (challenge.correctAnswer as string).split(",").map(Number);
  const isCorrect = submitted && order.join(",") === correctOrder.join(",");

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">Drag items to reorder them correctly:</p>
      <div className="space-y-2">
        {order.map((itemIdx, displayIdx) => (
          <div
            key={itemIdx}
            draggable={!submitted}
            onDragStart={() => handleDragStart(displayIdx)}
            onDragEnter={() => handleDragEnter(displayIdx)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all",
              submitted
                ? isCorrect
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : correctOrder[displayIdx] === itemIdx
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/50 bg-red-500/10 text-red-300"
                : dragging === displayIdx
                ? "border-violet-500 bg-violet-500/20 opacity-60 cursor-grabbing"
                : "border-white/10 bg-slate-800/60 text-slate-300 cursor-grab hover:border-violet-500/30"
            )}
          >
            <GripVertical size={14} className="text-slate-500 shrink-0" />
            <span className="w-6 h-6 rounded-full bg-slate-700/80 border border-white/10 text-xs flex items-center justify-center text-slate-400 font-bold shrink-0">
              {displayIdx + 1}
            </span>
            {items[itemIdx]}
          </div>
        ))}
      </div>
      {!submitted && (
        <Button onClick={handleSubmit} className="w-full" size="lg">
          Check Order <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
}

// --- Fill in the Blank Challenge ---
function FillBlankChallenge({
  challenge,
  onResult,
}: {
  challenge: Challenge;
  onResult: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const correct = (challenge.correctAnswer as string).toLowerCase().trim();

  const handleSubmit = () => {
    setSubmitted(true);
    onResult(value.toLowerCase().trim() === correct);
  };

  const isCorrect = submitted && value.toLowerCase().trim() === correct;

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => !submitted && setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && handleSubmit()}
          placeholder="Type your answer..."
          disabled={submitted}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-slate-800/60 text-sm transition-all outline-none",
            !submitted && "border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30",
            submitted && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-300",
            submitted && !isCorrect && "border-red-500 bg-red-500/10 text-red-300"
          )}
        />
        {submitted && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isCorrect ? (
              <CheckCircle size={18} className="text-emerald-400" />
            ) : (
              <XCircle size={18} className="text-red-400" />
            )}
          </div>
        )}
      </div>

      {submitted && !isCorrect && (
        <p className="text-sm text-slate-300">
          Correct answer: <span className="text-emerald-400 font-mono font-bold">{challenge.correctAnswer as string}</span>
        </p>
      )}

      {!submitted && (
        <Button onClick={handleSubmit} disabled={!value.trim()} className="w-full" size="lg">
          Check Answer <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
}

// --- Main ChallengeRunner ---
export function ChallengeRunner({ challenge, xp, onComplete, isCompleted }: ChallengeRunnerProps) {
  const [result, setResult] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (result !== null) {
      setShowExplanation(true);
      if (result && !isCompleted) {
        setTimeout(() => onComplete(), 600);
      }
    }
  }, [result, isCompleted, onComplete]);

  const handleResult = (correct: boolean) => setResult(correct);

  const typeLabel = {
    mcq: "Multiple Choice",
    "drag-drop": "Sequence Ordering",
    "fill-blank": "Fill in the Blank",
  }[challenge.type];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/40 overflow-hidden">
      {/* Challenge Header */}
      <div className="p-4 border-b border-white/10 bg-slate-900/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Trophy size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest">
                {typeLabel} Challenge
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full">
            <Zap size={12} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-400">+{xp} XP</span>
          </div>
        </div>
        <p className="text-white font-medium leading-relaxed text-sm">{challenge.question}</p>
      </div>

      {/* Challenge Body */}
      <div className="p-4">
        {isCompleted && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <CheckCircle size={16} className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Challenge completed! You earned {xp} XP.</span>
          </div>
        )}

        {!isCompleted && (
          <>
            {challenge.type === "mcq" && (
              <MCQChallenge challenge={challenge} onResult={handleResult} />
            )}
            {challenge.type === "drag-drop" && (
              <DragDropChallenge challenge={challenge} onResult={handleResult} />
            )}
            {challenge.type === "fill-blank" && (
              <FillBlankChallenge challenge={challenge} onResult={handleResult} />
            )}
          </>
        )}

        {/* Result feedback */}
        {result !== null && !isCompleted && (
          <div
            className={cn(
              "mt-4 p-4 rounded-xl border",
              result
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-red-500/10 border-red-500/30"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {result ? (
                <CheckCircle size={16} className="text-emerald-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className={cn("font-semibold text-sm", result ? "text-emerald-400" : "text-red-400")}>
                {result ? "Correct! 🎉" : "Not quite — here's why:"}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{challenge.explanation}</p>
          </div>
        )}

        {/* Completed explanation */}
        {isCompleted && (
          <div className="p-4 rounded-xl bg-slate-700/30 border border-white/5">
            <p className="text-xs text-slate-400 font-medium mb-1">Explanation</p>
            <p className="text-sm text-slate-300 leading-relaxed">{challenge.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
