import React, { useState } from "react";
import {
  Terminal,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Check,
  X,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson, DebuggerFixOption } from "@/types";
import { useProgressStore } from "@/store/useProgressStore";
import { popBurst } from "@/lib/fx";

interface ErrorDebuggerChallengeProps {
  lesson: Lesson;
  solved: boolean;
  onSuccess?: () => void;
}

export function ErrorDebuggerChallenge({
  lesson,
  solved,
  onSuccess,
}: ErrorDebuggerChallengeProps) {
  const c = lesson.challenge;
  const { completeLesson } = useProgressStore();
  const xp = c.xp ?? lesson.xp ?? 35;

  const defaultErrorLog =
    c.errorLog ??
    `[2026-10-01 08:30:15] production.ERROR: Illuminate\\Database\\QueryException: SQLSTATE[42S22]: Column not found: 1054 Unknown column 'user_id' in 'where clause' (Connection: mysql, SQL: select * from \`posts\` where \`user_id\` = 42)`;

  const defaultBuggyCode =
    c.buggyCode ??
    `public function index(Request $request) {
    // ⚠️ Buggy line: Column name mismatch with foreign key!
    $posts = Post::where('user_id', $request->user()->id)->get();
    return PostResource::collection($posts);
}`;

  const defaultOptions: DebuggerFixOption[] = c.fixOptions ?? [
    {
      id: "opt-1",
      label: "Use the defined author_id column or relationship",
      codeDiff: `- $posts = Post::where('user_id', $request->user()->id)->get();\n+ $posts = $request->user()->posts; // Uses author_id relationship`,
      isCorrect: true,
      explanation:
        "The posts migration uses 'author_id' instead of 'user_id'. Accessing $user->posts automatically queries via the configured Eloquent relationship key.",
    },
    {
      id: "opt-2",
      label: "Disable SQL strict mode in database.php",
      codeDiff: `- 'strict' => true,\n+ 'strict' => false,`,
      isCorrect: false,
      explanation:
        "Disabling strict mode does not fix missing database columns and creates severe silent data corruption risks in production.",
    },
    {
      id: "opt-3",
      label: "Cast user ID to string",
      codeDiff: `- $posts = Post::where('user_id', $request->user()->id)->get();\n+ $posts = Post::where('user_id', (string) $request->user()->id)->get();`,
      isCorrect: false,
      explanation:
        "The error is caused by a non-existent column name in the database schema, not by variable type casting.",
    },
  ];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    solved
      ? defaultOptions.find((o) => o.isCorrect)?.id ?? defaultOptions[0].id
      : null
  );
  const [wrongOptionId, setWrongOptionId] = useState<string | null>(null);
  const [justSolved, setJustSolved] = useState(false);

  const handleSelect = (opt: DebuggerFixOption) => {
    if (solved || wrongOptionId !== null) return;

    if (opt.isCorrect) {
      setSelectedOptionId(opt.id);
      setJustSolved(true);
      completeLesson(lesson.moduleId, lesson.id, xp);
      popBurst();
      if (onSuccess) setTimeout(onSuccess, 600);
    } else {
      setWrongOptionId(opt.id);
      setTimeout(() => setWrongOptionId(null), 1000);
    }
  };

  const selectedOpt = defaultOptions.find((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-4">
      {/* Terminal Stack Trace Box */}
      <div className="overflow-hidden rounded-xl border border-rose-500/30 bg-slate-950">
        <div className="flex items-center justify-between border-b border-rose-500/20 bg-rose-500/10 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
              <i className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <i className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            </span>
            <span className="ml-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold text-rose-300">
              <Terminal size={13} className="text-rose-400" />
              storage/logs/laravel.log
            </span>
          </div>
          <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-rose-300">
            {c.errorType ?? "CRITICAL EXCEPTION"}
          </span>
        </div>

        <div className="p-3.5 font-mono text-[12px] leading-relaxed text-rose-200">
          <pre className="whitespace-pre-wrap">{defaultErrorLog}</pre>
        </div>
      </div>

      {/* Source Code Context with Error Line */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 text-xs text-slate-400 font-mono">
          <FileCode size={13} className="text-sky-400" />
          <span>{c.errorFile ?? "app/Http/Controllers/PostController.php"}</span>
          {c.errorLine && (
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-amber-300">
              Line {c.errorLine}
            </span>
          )}
        </div>

        <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-slate-300">
          <code>{defaultBuggyCode}</code>
        </pre>
      </div>

      {/* Select Fix Options */}
      <div className="space-y-2.5">
        <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Bug size={14} className="text-amber-400" />
          Select the correct diagnostic patch to fix this crash:
        </p>

        <div className="grid gap-2.5 sm:grid-cols-1">
          {defaultOptions.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isWrong = wrongOptionId === opt.id;
            const isRight = solved && opt.isCorrect;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={cn(
                  "group relative rounded-xl border p-3.5 transition-all cursor-pointer select-none",
                  isRight || (isSelected && opt.isCorrect)
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : isWrong
                    ? "animate-shake border-rose-500/50 bg-rose-500/10"
                    : solved
                    ? "border-slate-800 opacity-60 cursor-default"
                    : "border-slate-800 bg-slate-900/60 hover:-translate-y-0.5 hover:border-sky-500/40 hover:bg-slate-900"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-bold",
                        isRight || (isSelected && opt.isCorrect)
                          ? "border-emerald-500 bg-emerald-500 text-slate-950"
                          : isWrong
                          ? "border-rose-500 bg-rose-500 text-white"
                          : "border-slate-700 text-slate-400 group-hover:border-sky-400 group-hover:text-sky-400"
                      )}
                    >
                      {isRight || (isSelected && opt.isCorrect) ? (
                        <Check size={11} />
                      ) : isWrong ? (
                        <X size={11} />
                      ) : (
                        <Code2 size={11} />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[13.5px] font-medium",
                        isRight || (isSelected && opt.isCorrect)
                          ? "text-emerald-300 font-semibold"
                          : "text-slate-200 group-hover:text-white"
                      )}
                    >
                      {opt.label}
                    </span>
                  </div>
                </div>

                {/* Code Diff Preview inside Option */}
                {opt.codeDiff && (
                  <div className="mt-2.5 overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/80 p-2.5 font-mono text-[11.5px] leading-relaxed">
                    {opt.codeDiff.split("\n").map((line, lIdx) => (
                      <div
                        key={lIdx}
                        className={cn(
                          line.startsWith("+")
                            ? "text-emerald-400 font-semibold"
                            : line.startsWith("-")
                            ? "text-rose-400 line-through opacity-80"
                            : "text-slate-400"
                        )}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wrong Feedback Hint */}
      {wrongOptionId && (
        <div className="animate-shake flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-[13px] text-rose-300">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-400" />
          <p>
            That fix does not address the underlying schema or relational contract mismatch. Review the error message carefully.
          </p>
        </div>
      )}

      {/* Explanation Banner */}
      {(selectedOpt?.isCorrect || solved) && (
        <div className="animate-fade-up rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="mb-1.5 flex items-center gap-2 font-semibold text-emerald-400 text-[13px]">
            <CheckCircle2 size={15} />
            <span>
              {justSolved
                ? `Bug Diagnosed & Resolved! +${xp} XP Awarded 🎉`
                : "Issue Resolved"}
            </span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-slate-200">
            {c.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
