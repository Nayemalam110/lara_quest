import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  GripHorizontal,
  KeyRound,
  Link2,
  MousePointer,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionLines, type LinePair } from "@/components/visualizers/ConnectionLines";

export interface PgColumn {
  id: string;
  name: string;
  type: string;
  key: "" | "PK" | "FK";
  refTableId?: string;
  refColumnId?: string;
}

export interface PgTable {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  columns: PgColumn[];
}

const TYPES = [
  "bigint",
  "varchar(255)",
  "text",
  "integer",
  "boolean",
  "timestamp",
  "date",
  "json",
  "decimal(8,2)",
];
const COLORS = [
  "#38bdf8",
  "#f43f5e",
  "#fbbf24",
  "#34d399",
  "#a78bfa",
  "#fb7185",
  "#22d3ee",
];

const uid = () => Math.random().toString(36).slice(2, 9);
let colorIdx = 0;
const nextColor = () => COLORS[colorIdx++ % COLORS.length];

export function presetOneToMany(): PgTable[] {
  const usersId = uid();
  const postsId = uid();
  const userPk = uid();
  return [
    {
      id: usersId,
      name: "users",
      color: "#38bdf8",
      x: 60,
      y: 70,
      columns: [
        { id: userPk, name: "id", type: "bigint", key: "PK" },
        { id: uid(), name: "email", type: "varchar(255)", key: "" },
        { id: uid(), name: "created_at", type: "timestamp", key: "" },
      ],
    },
    {
      id: postsId,
      name: "posts",
      color: "#f43f5e",
      x: 480,
      y: 150,
      columns: [
        { id: uid(), name: "id", type: "bigint", key: "PK" },
        {
          id: uid(),
          name: "user_id",
          type: "bigint",
          key: "FK",
          refTableId: usersId,
          refColumnId: userPk,
        },
        { id: uid(), name: "title", type: "varchar(255)", key: "" },
      ],
    },
  ];
}

export function presetManyToMany(): PgTable[] {
  const postsId = uid();
  const tagsId = uid();
  const pivotId = uid();
  const postPk = uid();
  const tagPk = uid();
  return [
    {
      id: postsId,
      name: "posts",
      color: "#f43f5e",
      x: 40,
      y: 80,
      columns: [
        { id: postPk, name: "id", type: "bigint", key: "PK" },
        { id: uid(), name: "title", type: "varchar(255)", key: "" },
      ],
    },
    {
      id: pivotId,
      name: "post_tag",
      color: "#a78bfa",
      x: 390,
      y: 200,
      columns: [
        { id: uid(), name: "id", type: "bigint", key: "PK" },
        {
          id: uid(),
          name: "post_id",
          type: "bigint",
          key: "FK",
          refTableId: postsId,
          refColumnId: postPk,
        },
        {
          id: uid(),
          name: "tag_id",
          type: "bigint",
          key: "FK",
          refTableId: tagsId,
          refColumnId: tagPk,
        },
      ],
    },
    {
      id: tagsId,
      name: "tags",
      color: "#fbbf24",
      x: 750,
      y: 80,
      columns: [
        { id: tagPk, name: "id", type: "bigint", key: "PK" },
        { id: uid(), name: "label", type: "varchar(255)", key: "" },
      ],
    },
  ];
}

export function SchemaPlayground() {
  const [tables, setTables] = useState<PgTable[]>(presetOneToMany);
  const canvasRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const relations = useMemo(() => {
    const pairs: LinePair[] = [];
    for (const t of tables) {
      for (const c of t.columns) {
        if (c.key === "FK" && c.refColumnId) {
          pairs.push({
            from: c.id,
            to: c.refColumnId,
            color: t.color,
            dashed: true,
            glow: true,
          });
        }
      }
    }
    return pairs;
  }, [tables]);

  const relationCount = relations.length;

  const updateTable = (id: string, fn: (t: PgTable) => PgTable) =>
    setTables((ts) => ts.map((t) => (t.id === id ? fn(t) : t)));

  const addTable = () =>
    setTables((ts) => [
      ...ts,
      {
        id: uid(),
        name: `table_${ts.length + 1}`,
        color: nextColor(),
        x: 60 + (ts.length % 4) * 60,
        y: 60 + (ts.length % 3) * 80,
        columns: [{ id: uid(), name: "id", type: "bigint", key: "PK" }],
      },
    ]);

  const removeTable = (id: string) =>
    setTables((ts) =>
      ts
        .filter((t) => t.id !== id)
        .map((t) => ({
          ...t,
          columns: t.columns.map((c) =>
            c.refTableId === id
              ? {
                  ...c,
                  refTableId: undefined,
                  refColumnId: undefined,
                  key: "" as const,
                }
              : c
          ),
        }))
    );

  const addColumn = (tableId: string) =>
    updateTable(tableId, (t) => ({
      ...t,
      columns: [
        ...t.columns,
        {
          id: uid(),
          name: `column_${t.columns.length}`,
          type: "varchar(255)",
          key: "",
        },
      ],
    }));

  const updateColumn = (
    tableId: string,
    colId: string,
    patch: Partial<PgColumn>
  ) =>
    updateTable(tableId, (t) => ({
      ...t,
      columns: t.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)),
    }));

  const removeColumn = (tableId: string, colId: string) =>
    setTables((ts) =>
      ts.map((t) => ({
        ...t,
        columns: t.columns
          .filter((c) => !(t.id === tableId && c.id === colId))
          .map((c) =>
            c.refColumnId === colId
              ? {
                  ...c,
                  key: "" as const,
                  refTableId: undefined,
                  refColumnId: undefined,
                }
              : c
          ),
      }))
    );

  const onHeaderPointerDown = (e: React.PointerEvent, t: PgTable) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    drag.current = {
      id: t.id,
      dx: e.clientX - rect.left + canvas.scrollLeft - t.x,
      dy: e.clientY - rect.top + canvas.scrollTop - t.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onHeaderPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const canvas = canvasRef.current;
    if (!d || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(4, e.clientX - rect.left + canvas.scrollLeft - d.dx);
    const y = Math.max(4, e.clientY - rect.top + canvas.scrollTop - d.dy);
    updateTable(d.id, (t) => ({ ...t, x, y }));
  };

  const onHeaderPointerUp = () => (drag.current = null);

  return (
    <div className="relative pb-24 pt-4 lg:pt-6">
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400">
            <Boxes size={12} className="text-sky-400" /> Visual DB Sandbox
          </div>
          <h1 className="mt-3 font-display text-[32px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[42px]">
            Schema{" "}
            <span className="font-serif font-normal italic text-gradient-brand">
              playground.
            </span>
          </h1>
          <p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-slate-300">
            Relational databases stop being abstract the moment you can touch them. Drag tables
            around, add typed columns, and link a column as an{" "}
            <span className="font-mono text-[13px] text-sky-400 font-semibold">FK</span> pointing at
            another table&apos;s <span className="font-mono text-[13px] text-amber-400 font-semibold">PK</span> — the
            connecting line <span className="font-serif italic text-white">is</span> the relationship.
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2.5"
        >
          <button
            onClick={addTable}
            className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-slate-950 transition-all hover:-translate-y-px active:scale-95 cursor-pointer"
          >
            <Plus size={14} /> New Table
          </button>
          <button
            onClick={() => setTables(presetOneToMany())}
            className="flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-[12.5px] font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white cursor-pointer"
          >
            <Sparkles size={13} className="text-sky-400" /> Preset: 1-to-Many
          </button>
          <button
            onClick={() => setTables(presetManyToMany())}
            className="flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-[12.5px] font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white cursor-pointer"
          >
            <Sparkles size={13} className="text-violet-400" /> Preset: Many-to-Many
          </button>
          <button
            onClick={() => setTables([])}
            className="flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-[12.5px] font-medium text-slate-300 transition-colors hover:border-rose-500/40 hover:text-rose-400 cursor-pointer"
          >
            <RotateCcw size={13} /> Clear
          </button>

          <span className="ml-auto hidden items-center gap-4 pr-2 font-mono text-[11px] text-slate-400 sm:flex">
            <span>{tables.length} tables</span>
            <span className="flex items-center gap-1">
              <Link2 size={11} className="text-sky-400" /> {relationCount} relations
            </span>
          </span>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"
        >
          <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/60 px-4 py-2.5 font-mono text-[11px] text-slate-400">
            <MousePointer size={12} className="text-sky-400" />
            Drag table by header · edit columns inline · select FK to connect
          </div>

          <div
            ref={canvasRef}
            className="no-scrollbar relative h-[560px] overflow-auto"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          >
            <div className="relative h-[760px] w-[1100px]">
              <ConnectionLines
                containerRef={canvasRef}
                pairs={relations}
                deps={[tables]}
              />

              {tables.length === 0 && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <Boxes size={28} className="mx-auto text-slate-500" />
                    <p className="mt-2 text-xs text-slate-400">
                      Empty canvas — add a table or click a preset above.
                    </p>
                  </div>
                </div>
              )}

              {tables.map((t) => (
                <PlaygroundTableCard
                  key={t.id}
                  table={t}
                  allTables={tables}
                  onHeaderPointerDown={onHeaderPointerDown}
                  onHeaderPointerMove={onHeaderPointerMove}
                  onHeaderPointerUp={onHeaderPointerUp}
                  updateTable={updateTable}
                  removeTable={removeTable}
                  addColumn={addColumn}
                  updateColumn={updateColumn}
                  removeColumn={removeColumn}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Explainer Cards */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: KeyRound,
              color: "#fbbf24",
              title: "PK = Permanent Identity",
              body: "The primary key guarantees a row's address. It can never be null, and every other table holds references to it.",
            },
            {
              icon: Link2,
              color: "#38bdf8",
              title: "FK = Enforced Pointer",
              body: "A foreign key stores another table's PK. The database rejects any write that references a missing row — preventing orphan data.",
            },
            {
              icon: Boxes,
              color: "#a78bfa",
              title: "Pivot = Many-to-Many",
              body: "Two foreign keys in one dedicated intermediate table model Many-to-Many relationships cleanly without comma-separated strings.",
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <c.icon size={16} style={{ color: c.color }} />
              <div className="mt-2 text-[13.5px] font-semibold text-white">
                {c.title}
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-300">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaygroundTableCard({
  table: t,
  allTables,
  onHeaderPointerDown,
  onHeaderPointerMove,
  onHeaderPointerUp,
  updateTable,
  removeTable,
  addColumn,
  updateColumn,
  removeColumn,
}: {
  table: PgTable;
  allTables: PgTable[];
  onHeaderPointerDown: (e: React.PointerEvent, t: PgTable) => void;
  onHeaderPointerMove: (e: React.PointerEvent) => void;
  onHeaderPointerUp: () => void;
  updateTable: (id: string, fn: (t: PgTable) => PgTable) => void;
  removeTable: (id: string) => void;
  addColumn: (tableId: string) => void;
  updateColumn: (tableId: string, colId: string, patch: Partial<PgColumn>) => void;
  removeColumn: (tableId: string, colId: string) => void;
}) {
  return (
    <div
      className="absolute w-[290px] rounded-xl border border-slate-700 bg-slate-900 shadow-2xl z-20"
      style={{ left: t.x, top: t.y }}
    >
      {/* Header — Drag Handle */}
      <div
        onPointerDown={(e) => onHeaderPointerDown(e, t)}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        className="flex cursor-grab touch-none select-none items-center gap-2 rounded-t-xl border-b border-slate-800 px-3 py-2.5 active:cursor-grabbing"
        style={{
          background: `linear-gradient(90deg, ${t.color}20, transparent 75%)`,
        }}
      >
        <GripHorizontal size={13} className="shrink-0 text-slate-400" />
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-[4px]"
          style={{ background: t.color, boxShadow: `0 0 10px ${t.color}88` }}
        />
        <input
          value={t.name}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) =>
            updateTable(t.id, (tb) => ({ ...tb, name: e.target.value }))
          }
          className="min-w-0 flex-1 bg-transparent font-mono text-[13px] font-semibold text-white outline-none"
          spellCheck={false}
        />
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => removeTable(t.id)}
          className="rounded p-1 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
          aria-label="Delete table"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Columns */}
      <div className="flex flex-col py-1.5">
        {t.columns.map((c) => {
          const refTable = allTables.find((x) => x.id === c.refTableId);
          return (
            <div key={c.id} className="group relative px-3 py-1">
              <span
                data-anchor={`${c.id}#L`}
                className={cn(
                  "absolute -left-[5px] top-[13px] h-2.5 w-2.5 rounded-full border-2 bg-slate-900 transition-colors",
                  c.key === "PK"
                    ? "border-amber-400"
                    : c.key === "FK"
                    ? ""
                    : "border-slate-600"
                )}
                style={c.key === "FK" ? { borderColor: t.color } : undefined}
              />
              <span
                data-anchor={`${c.id}#R`}
                className={cn(
                  "absolute -right-[5px] top-[13px] h-2.5 w-2.5 rounded-full border-2 bg-slate-900 transition-colors",
                  c.key === "PK"
                    ? "border-amber-400"
                    : c.key === "FK"
                    ? ""
                    : "border-slate-600"
                )}
                style={c.key === "FK" ? { borderColor: t.color } : undefined}
              />

              <div className="flex items-center gap-1.5">
                <select
                  value={c.key}
                  onChange={(e) => {
                    const key = e.target.value as PgColumn["key"];
                    if (key === "FK") {
                      const target = allTables.find((x) => x.id !== t.id) ?? null;
                      updateColumn(t.id, c.id, {
                        key,
                        refTableId: target?.id,
                        refColumnId:
                          target?.columns.find((cc) => cc.key === "PK")?.id ??
                          target?.columns[0]?.id,
                      });
                    } else {
                      updateColumn(t.id, c.id, {
                        key,
                        refTableId: undefined,
                        refColumnId: undefined,
                      });
                    }
                  }}
                  className={cn(
                    "w-[52px] shrink-0 cursor-pointer rounded border bg-transparent px-1 py-1 font-mono text-[9.5px] font-bold outline-none transition-colors",
                    c.key === "PK"
                      ? "border-amber-400/40 text-amber-400"
                      : c.key === "FK"
                      ? "border-sky-400/40 text-sky-400"
                      : "border-slate-700 text-slate-400"
                  )}
                >
                  <option value="" className="bg-slate-900 text-white">—</option>
                  <option value="PK" className="bg-slate-900 text-amber-400">PK</option>
                  <option value="FK" className="bg-slate-900 text-sky-400">FK</option>
                </select>

                <input
                  value={c.name}
                  onChange={(e) =>
                    updateColumn(t.id, c.id, { name: e.target.value })
                  }
                  className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-slate-200 outline-none"
                  spellCheck={false}
                />

                <select
                  value={c.type}
                  onChange={(e) =>
                    updateColumn(t.id, c.id, { type: e.target.value })
                  }
                  className="w-[104px] shrink-0 cursor-pointer rounded bg-transparent px-1 py-1 text-right font-mono text-[10.5px] text-slate-400 outline-none transition-colors hover:text-slate-200"
                >
                  {TYPES.map((ty) => (
                    <option key={ty} value={ty} className="bg-slate-900 text-white">
                      {ty}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => removeColumn(t.id, c.id)}
                  className="shrink-0 rounded p-0.5 text-slate-400 opacity-0 transition-all hover:text-rose-400 group-hover:opacity-100 cursor-pointer"
                  aria-label="Delete column"
                >
                  <X size={12} />
                </button>
              </div>

              {c.key === "FK" && (
                <div className="mb-1 mt-1.5 flex items-center gap-1.5 pl-[60px]">
                  <Link2 size={10} className="shrink-0 text-sky-400" />
                  <select
                    value={c.refTableId ?? ""}
                    onChange={(e) => {
                      const tt = allTables.find((x) => x.id === e.target.value);
                      updateColumn(t.id, c.id, {
                        refTableId: tt?.id,
                        refColumnId:
                          tt?.columns.find((cc) => cc.key === "PK")?.id ??
                          tt?.columns[0]?.id,
                      });
                    }}
                    className="min-w-0 flex-1 cursor-pointer rounded border border-slate-700 bg-slate-900 px-1.5 py-1 font-mono text-[10.5px] text-slate-300 outline-none"
                  >
                    {allTables.filter((x) => x.id !== t.id).length === 0 && (
                      <option value="" className="bg-slate-900">no target</option>
                    )}
                    {allTables
                      .filter((x) => x.id !== t.id)
                      .map((x) => (
                        <option key={x.id} value={x.id} className="bg-slate-900">
                          {x.name}
                        </option>
                      ))}
                  </select>

                  <select
                    value={c.refColumnId ?? ""}
                    onChange={(e) =>
                      updateColumn(t.id, c.id, { refColumnId: e.target.value })
                    }
                    className="min-w-0 flex-1 cursor-pointer rounded border border-slate-700 bg-slate-900 px-1.5 py-1 font-mono text-[10.5px] text-slate-300 outline-none"
                  >
                    {(refTable?.columns ?? []).map((cc) => (
                      <option key={cc.id} value={cc.id} className="bg-slate-900">
                        .{cc.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => addColumn(t.id)}
        className="flex w-full items-center gap-1.5 rounded-b-xl border-t border-slate-800 px-3 py-2 font-mono text-[11px] text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-sky-400 cursor-pointer"
      >
        <Plus size={11} /> add column
      </button>
    </div>
  );
}
