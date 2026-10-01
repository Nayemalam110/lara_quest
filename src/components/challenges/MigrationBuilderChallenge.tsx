import React, { useState, useMemo } from "react";
import {
  Database,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Code2,
  FileCode,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson, MigrationColumnDef } from "@/types";
import { useProgressStore } from "@/store/useProgressStore";
import { popBurst } from "@/lib/fx";

interface MigrationBuilderChallengeProps {
  lesson: Lesson;
  solved: boolean;
  onSuccess?: () => void;
}

const COLUMN_TYPES: { value: MigrationColumnDef["type"]; label: string; desc: string }[] = [
  { value: "string", label: "string", desc: "VARCHAR (255 chars)" },
  { value: "text", label: "text", desc: "TEXT unlimited" },
  { value: "integer", label: "integer", desc: "INT 4-byte" },
  { value: "decimal", label: "decimal", desc: "DECIMAL(10,2)" },
  { value: "boolean", label: "boolean", desc: "TINYINT(1)" },
  { value: "foreignId", label: "foreignId", desc: "BIGINT UNSIGNED FK" },
  { value: "timestamp", label: "timestamp", desc: "TIMESTAMP" },
  { value: "json", label: "json", desc: "JSON data type" },
];

export function MigrationBuilderChallenge({
  lesson,
  solved,
  onSuccess,
}: MigrationBuilderChallengeProps) {
  const c = lesson.challenge;
  const target = c.migrationTarget;
  const { completeLesson } = useProgressStore();
  const xp = c.xp ?? lesson.xp ?? 30;

  const tableName = target?.tableName ?? "posts";

  const defaultCols: MigrationColumnDef[] = useMemo(() => {
    if (target?.initialColumns && target.initialColumns.length > 0) {
      return target.initialColumns;
    }
    return [
      { id: "col-id", name: "id", type: "id" },
      { id: "col-ts", name: "timestamps", type: "timestamps" },
    ];
  }, [target]);

  const [columns, setColumns] = useState<MigrationColumnDef[]>(defaultCols);
  const [isRunning, setIsRunning] = useState(false);
  const [migrationOutput, setMigrationOutput] = useState<string | null>(null);

  // Generate real PHP code representation
  const generatedPhpCode = useMemo(() => {
    const lines: string[] = [
      `Schema::create('${tableName}', function (Blueprint $table) {`,
    ];

    columns.forEach((col) => {
      if (col.type === "id") {
        lines.push(`    $table->id();`);
      } else if (col.type === "timestamps") {
        lines.push(`    $table->timestamps();`);
      } else if (col.type === "foreignId") {
        let snippet = `    $table->foreignId('${col.name || "item_id"}')->constrained()`;
        if (col.cascadeDelete) {
          snippet += `->cascadeOnDelete()`;
        }
        if (col.nullable) {
          snippet += `->nullOnDelete()`;
        }
        snippet += `;`;
        lines.push(snippet);
      } else if (col.type === "decimal") {
        let snippet = `    $table->decimal('${col.name || "amount"}', 10, 2)`;
        if (col.nullable) snippet += `->nullable()`;
        if (col.default) snippet += `->default(${col.default})`;
        snippet += `;`;
        lines.push(snippet);
      } else {
        let snippet = `    $table->${col.type}('${col.name || "field"}')`;
        if (col.nullable) snippet += `->nullable()`;
        if (col.unique) snippet += `->unique()`;
        if (col.default) snippet += `->default('${col.default}')`;
        snippet += `;`;
        lines.push(snippet);
      }
    });

    lines.push(`});`);
    return lines.join("\n");
  }, [tableName, columns]);

  // Validation criteria checklist
  const targetChecklist = useMemo(() => {
    if (!target?.targetColumns) return [];
    return target.targetColumns.map((tc) => {
      const match = columns.find(
        (c) =>
          c.name.trim().toLowerCase() === tc.name.trim().toLowerCase() &&
          c.type === tc.type &&
          (tc.nullable === undefined || !!c.nullable === !!tc.nullable) &&
          (tc.cascadeDelete === undefined || !!c.cascadeDelete === !!tc.cascadeDelete) &&
          (tc.unique === undefined || !!c.unique === !!tc.unique)
      );
      return {
        ...tc,
        matched: !!match,
      };
    });
  }, [target, columns]);

  const allCriteriaMet = targetChecklist.every((item) => item.matched);

  const addColumn = () => {
    const newId = `col-${Date.now()}`;
    const newCol: MigrationColumnDef = {
      id: newId,
      name: "",
      type: "string",
      nullable: false,
      unique: false,
    };
    // Insert before timestamps if timestamps exist
    const tsIndex = columns.findIndex((c) => c.type === "timestamps");
    if (tsIndex !== -1) {
      const updated = [...columns];
      updated.splice(tsIndex, 0, newCol);
      setColumns(updated);
    } else {
      setColumns((prev) => [...prev, newCol]);
    }
  };

  const removeColumn = (id: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
  };

  const updateColumn = (id: string, updates: Partial<MigrationColumnDef>) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, ...updates } : col))
    );
  };

  const resetSchema = () => {
    setColumns(defaultCols);
    setMigrationOutput(null);
  };

  const runMigration = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (allCriteriaMet) {
        setMigrationOutput(
          `Migration [database/migrations/xxxx_create_${tableName}_table.php] executed successfully.\nTable '${tableName}' created with ${columns.length} columns.`
        );
        if (!solved) {
          completeLesson(lesson.id, xp);
          popBurst();
          onSuccess?.();
        }
      } else {
        setMigrationOutput(
          `Migration failed: Schema does not yet satisfy all required columns.\nCheck the requirement checklist below.`
        );
      }
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Target Mission Card */}
      <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 to-purple-950/20 p-4 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-400">
                <Database className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Visual Migration Builder
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200">{c.question}</p>
          </div>
          {solved && (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed (+{xp} XP)
            </div>
          )}
        </div>

        {/* Requirements Checklist */}
        <div className="mt-3 rounded-lg bg-slate-900/60 p-3">
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            Target Schema Requirements:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {targetChecklist.map((req, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition border",
                  req.matched
                    ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                    : "border-slate-800 bg-slate-900/40 text-slate-400"
                )}
              >
                {req.matched ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <div className="h-3.5 w-3.5 rounded-full border border-slate-600 shrink-0" />
                )}
                <span>
                  <strong className="text-slate-200">${req.name}</strong>{" "}
                  <code className="text-indigo-400 font-mono text-[11px]">
                    ({req.type}
                    {req.nullable ? ", nullable" : ""}
                    {req.cascadeDelete ? ", cascadeDelete" : ""}
                    {req.unique ? ", unique" : ""})
                  </code>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Builder Grid: Designer on Left, PHP Blueprint on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Designer Pane (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">
                Blueprint Columns
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
                {columns.length} columns
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetSchema}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={addColumn}
                className="flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Column
              </button>
            </div>
          </div>

          {/* Column Rows */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {columns.map((col) => {
              const isLocked = col.type === "id" || col.type === "timestamps";
              return (
                <div
                  key={col.id}
                  className={cn(
                    "rounded-lg border p-3 transition",
                    isLocked
                      ? "border-slate-800/80 bg-slate-900/30 opacity-75"
                      : "border-slate-700/80 bg-slate-900/80 hover:border-slate-600"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Column Name */}
                    <div className="flex-1 min-w-[140px]">
                      {isLocked ? (
                        <div className="font-mono text-xs font-semibold text-slate-300">
                          {col.type === "id" ? "$table->id()" : "$table->timestamps()"}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) => updateColumn(col.id, { name: e.target.value })}
                          placeholder="column_name"
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                      )}
                    </div>

                    {/* Column Type */}
                    {!isLocked && (
                      <div className="w-[130px]">
                        <select
                          value={col.type}
                          onChange={(e) =>
                            updateColumn(col.id, {
                              type: e.target.value as MigrationColumnDef["type"],
                            })
                          }
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-xs text-indigo-300 focus:border-indigo-500 focus:outline-none"
                        >
                          {COLUMN_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Modifiers (Nullable, Unique, Cascade) */}
                    {!isLocked && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateColumn(col.id, { nullable: !col.nullable })}
                          className={cn(
                            "rounded px-2 py-0.5 text-[11px] font-mono transition border",
                            col.nullable
                              ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                              : "border-slate-800 bg-slate-950/60 text-slate-500 hover:text-slate-300"
                          )}
                          title="Nullable modifier"
                        >
                          ?null
                        </button>

                        {col.type === "foreignId" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateColumn(col.id, { cascadeDelete: !col.cascadeDelete })
                            }
                            className={cn(
                              "rounded px-2 py-0.5 text-[11px] font-mono transition border",
                              col.cascadeDelete
                                ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                                : "border-slate-800 bg-slate-950/60 text-slate-500 hover:text-slate-300"
                            )}
                            title="Cascade on delete"
                          >
                            cascade
                          </button>
                        )}

                        {col.type !== "foreignId" && (
                          <button
                            type="button"
                            onClick={() => updateColumn(col.id, { unique: !col.unique })}
                            className={cn(
                              "rounded px-2 py-0.5 text-[11px] font-mono transition border",
                              col.unique
                                ? "border-sky-500/40 bg-sky-500/10 text-sky-300"
                                : "border-slate-800 bg-slate-950/60 text-slate-500 hover:text-slate-300"
                            )}
                            title="Unique index"
                          >
                            unique
                          </button>
                        )}

                        <button
                          onClick={() => removeColumn(col.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Delete column"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live PHP Blueprint Code Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileCode className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">
                Generated Laravel Migration
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">
              database/migrations/xxxx_create_{tableName}_table.php
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-inner">
            <pre className="font-mono text-[11px] leading-relaxed text-emerald-300/90 overflow-x-auto">
              <code>{generatedPhpCode}</code>
            </pre>
          </div>

          {/* Action Button: Run Migration */}
          <button
            onClick={runMigration}
            disabled={isRunning}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition shadow-lg",
              allCriteriaMet
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/50"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            )}
          >
            {isRunning ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            {allCriteriaMet ? "Run Migration (All Criteria Met)" : "Test & Run Migration"}
          </button>

          {/* Migration Output Terminal Box */}
          {migrationOutput && (
            <div
              className={cn(
                "rounded-lg p-3 text-xs font-mono border whitespace-pre-wrap animate-in fade-in",
                migrationOutput.includes("successfully")
                  ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-300"
                  : "border-rose-500/30 bg-rose-950/30 text-rose-300"
              )}
            >
              {migrationOutput}
            </div>
          )}
        </div>
      </div>

      {/* Success banner */}
      {solved && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-emerald-300 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-emerald-200">Schema Successfully Migrated! </span>
            {c.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
