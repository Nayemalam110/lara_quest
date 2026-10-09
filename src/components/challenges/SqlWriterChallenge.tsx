import React, { useState } from "react";
import {
  Database,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Table2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";
import { useProgressStore } from "@/store/useProgressStore";
import { popBurst } from "@/lib/fx";

interface SqlWriterChallengeProps {
  lesson: Lesson;
  solved: boolean;
  onSuccess?: () => void;
}

export function SqlWriterChallenge({
  lesson,
  solved,
  onSuccess,
}: SqlWriterChallengeProps) {
  const c = lesson.challenge;
  const { completeLesson } = useProgressStore();
  const xp = c.xp ?? lesson.xp ?? 30;

  const defaultSql = c.initialSql ?? "SELECT * FROM ";
  const [query, setQuery] = useState(defaultSql);
  const [status, setStatus] = useState<"idle" | "running" | "error" | "success">(
    solved ? "success" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [justSolved, setJustSolved] = useState(false);

  const keywords = c.sqlKeywords ?? [
    "SELECT",
    "FROM",
    "WHERE",
    "JOIN",
    "ORDER BY",
    "LIMIT",
    "COUNT(*)",
    "GROUP BY",
  ];

  const insertKeyword = (kw: string) => {
    setQuery((prev) => {
      const trimmed = prev.trimEnd();
      return `${trimmed} ${kw} `;
    });
  };

  const handleReset = () => {
    setQuery(defaultSql);
    setStatus("idle");
    setErrorMessage(null);
  };

  const normalizeSql = (sql: string) =>
    sql
      .trim()
      .toLowerCase()
      .replace(/[\s\n\r\t]+/g, " ")
      .replace(/;\s*$/, "");

  const handleRun = () => {
    if (solved) return;
    setStatus("running");
    setErrorMessage(null);

    setTimeout(() => {
      const userNorm = normalizeSql(query);
      const targetNorm = normalizeSql(String(c.correctAnswer));
      const acceptable = (c.acceptableQueries ?? []).map(normalizeSql);

      const isMatch =
        userNorm === targetNorm ||
        acceptable.includes(userNorm) ||
        ((c as any).targetSqlPattern && new RegExp((c as any).targetSqlPattern, "i").test(query));

      if (isMatch) {
        setStatus("success");
        setJustSolved(true);
        completeLesson(lesson.moduleId, lesson.id, xp);
        popBurst();
        if (onSuccess) setTimeout(onSuccess, 600);
      } else {
        setStatus("error");
        setErrorMessage(
          "Query executed with 0 rows or syntax mismatch. Ensure your table name, selected columns, and WHERE clauses match the problem requirements."
        );
      }
    }, 350);
  };

  const mock = c.mockResult ?? {
    columns: ["id", "title", "status", "created_at"],
    rows: [
      { id: 1, title: "Getting Started with Flutter & Laravel", status: "published", created_at: "2026-09-15" },
      { id: 2, title: "Building High-Throughput REST APIs", status: "published", created_at: "2026-09-22" },
      { id: 3, title: "Sanctum Token Authentication Deep Dive", status: "published", created_at: "2026-09-28" },
    ],
    totalCount: 3,
    executionMs: 1.8,
  };

  return (
    <div className="space-y-4">
      {/* Schema Context Pill */}
      {c.schemaContext && (
        <div className="flex items-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/5 px-3.5 py-2.5 text-[13px] text-sky-200">
          <Database size={15} className="shrink-0 text-sky-400" />
          <span className="font-semibold text-white">Table Context:</span>
          <code className="font-mono text-xs text-sky-300">{c.schemaContext}</code>
        </div>
      )}

      {/* SQL Editor Frame */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        {/* Editor Tab Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <i className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <i className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </span>
            <span className="ml-2 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <Table2 size={13} className="text-sky-400" />
              query_sandbox.sql
            </span>
          </div>

          <button
            onClick={handleReset}
            disabled={solved}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:opacity-40"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>

        {/* Query Input */}
        <div className="p-3">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={solved}
            rows={4}
            spellCheck={false}
            className="w-full resize-none rounded-lg border border-slate-800/80 bg-slate-900/80 p-3 font-mono text-[13.5px] leading-relaxed text-emerald-300 outline-none transition-all placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 disabled:opacity-80"
            placeholder="Write your SQL statement here..."
          />
        </div>

        {/* Quick Keyword Toolbar */}
        {!solved && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-800/60 bg-slate-900/40 px-3 py-2">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Keywords:
            </span>
            {keywords.map((kw) => (
              <button
                key={kw}
                onClick={() => insertKeyword(kw)}
                className="rounded-md border border-slate-700/60 bg-slate-800/50 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-300 transition-colors hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-300"
              >
                +{kw}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      {!solved && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={status === "running"}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-[13px] font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Play size={14} className="fill-slate-950" />
            {status === "running" ? "Executing Query..." : "Run Query"}
          </button>
          <span className="text-xs text-slate-400">
            Press to execute against virtual database
          </span>
        </div>
      )}

      {/* Error Message */}
      {status === "error" && errorMessage && (
        <div className="animate-shake flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-[13px] text-rose-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Result Table Preview */}
      {(status === "success" || solved) && (
        <div className="animate-fade-up overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-950">
          <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5">
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-emerald-400">
              <CheckCircle2 size={13} />
              Query OK — {mock.totalCount ?? mock.rows.length} rows returned ({mock.executionMs ?? 1.8} ms)
            </div>
            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-300/80">
              <Sparkles size={11} /> SQLite Virtual DB
            </span>
          </div>

          <div className="max-h-60 overflow-x-auto">
            <table className="w-full text-left font-mono text-[12px]">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  {mock.columns.map((col) => (
                    <th key={col} className="px-3.5 py-2 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {mock.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="transition-colors hover:bg-slate-900/40"
                  >
                    {mock.columns.map((col) => (
                      <td key={col} className="px-3.5 py-2">
                        {String(row[col] ?? "NULL")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Explanation Box */}
      {(status === "success" || solved) && (
        <div className="animate-fade-up rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="mb-1.5 flex items-center gap-2 font-semibold text-emerald-400 text-[13px]">
            <CheckCircle2 size={15} />
            <span>
              {justSolved
                ? `Query Verified! +${xp} XP Awarded 🎉`
                : "Task Complete"}
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
