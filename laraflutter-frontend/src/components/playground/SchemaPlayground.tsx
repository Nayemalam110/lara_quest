"use client";
import { useState, useCallback } from "react";
import { Plus, Trash2, Table2, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Column {
  id: string;
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  fkTarget?: string;
}

interface PlaygroundTable {
  id: string;
  name: string;
  color: string;
  columns: Column[];
}

const COLUMN_TYPES = ["BIGINT", "VARCHAR(255)", "TEXT", "BOOLEAN", "TIMESTAMP", "DECIMAL(10,2)", "INTEGER", "DATE"];

const TABLE_COLORS = [
  "from-violet-600 to-purple-700",
  "from-blue-600 to-cyan-600",
  "from-emerald-600 to-teal-600",
  "from-rose-600 to-pink-600",
  "from-amber-600 to-orange-600",
];

const STARTER_TABLES: PlaygroundTable[] = [
  {
    id: "tbl-users",
    name: "users",
    color: "from-violet-600 to-purple-700",
    columns: [
      { id: "c1", name: "id", type: "BIGINT", isPK: true },
      { id: "c2", name: "name", type: "VARCHAR(255)" },
      { id: "c3", name: "email", type: "VARCHAR(255)" },
      { id: "c4", name: "created_at", type: "TIMESTAMP" },
    ],
  },
  {
    id: "tbl-posts",
    name: "posts",
    color: "from-blue-600 to-cyan-600",
    columns: [
      { id: "c5", name: "id", type: "BIGINT", isPK: true },
      { id: "c6", name: "user_id", type: "BIGINT", isFK: true, fkTarget: "tbl-users" },
      { id: "c7", name: "title", type: "VARCHAR(255)" },
      { id: "c8", name: "body", type: "TEXT" },
    ],
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function SchemaPlayground() {
  const [tables, setTables] = useState<PlaygroundTable[]>(STARTER_TABLES);
  const [selectedTable, setSelectedTable] = useState<string | null>("tbl-users");
  const [newTableName, setNewTableName] = useState("");
  const [showAddTable, setShowAddTable] = useState(false);

  const selectedT = tables.find((t) => t.id === selectedTable);

  const addTable = useCallback(() => {
    if (!newTableName.trim()) return;
    const newTable: PlaygroundTable = {
      id: `tbl-${uid()}`,
      name: newTableName.trim().toLowerCase().replace(/\s+/g, "_"),
      color: TABLE_COLORS[tables.length % TABLE_COLORS.length],
      columns: [{ id: uid(), name: "id", type: "BIGINT", isPK: true }],
    };
    setTables((prev) => [...prev, newTable]);
    setSelectedTable(newTable.id);
    setNewTableName("");
    setShowAddTable(false);
  }, [newTableName, tables.length]);

  const removeTable = useCallback((tblId: string) => {
    setTables((prev) => prev.filter((t) => t.id !== tblId));
    if (selectedTable === tblId) setSelectedTable(tables[0]?.id ?? null);
  }, [selectedTable, tables]);

  const addColumn = useCallback((tblId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tblId
          ? { ...t, columns: [...t.columns, { id: uid(), name: "new_column", type: "VARCHAR(255)" }] }
          : t
      )
    );
  }, []);

  const updateColumn = useCallback(
    (tblId: string, colId: string, field: keyof Column, value: string | boolean) => {
      setTables((prev) =>
        prev.map((t) =>
          t.id === tblId
            ? {
                ...t,
                columns: t.columns.map((c) =>
                  c.id === colId ? { ...c, [field]: value } : c
                ),
              }
            : t
        )
      );
    },
    []
  );

  const removeColumn = useCallback((tblId: string, colId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tblId
          ? { ...t, columns: t.columns.filter((c) => c.id !== colId) }
          : t
      )
    );
  }, []);

  // Generate SQL preview
  const generateSQL = () => {
    return tables
      .map((t) => {
        const cols = t.columns
          .map((c) => {
            let def = `  ${c.name} ${c.type}`;
            if (c.isPK) def += " PRIMARY KEY AUTO_INCREMENT";
            return def;
          })
          .join(",\n");
        const fks = t.columns
          .filter((c) => c.isFK && c.fkTarget)
          .map((c) => {
            const target = tables.find((tt) => tt.id === c.fkTarget);
            return target
              ? `  FOREIGN KEY (${c.name}) REFERENCES ${target.name}(id) ON DELETE CASCADE`
              : "";
          })
          .filter(Boolean)
          .join(",\n");

        return `CREATE TABLE ${t.name} (\n${cols}${fks ? ",\n" + fks : ""}\n);`;
      })
      .join("\n\n");
  };

  const [showSQL, setShowSQL] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-800/60">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-white">Visual Schema Sandbox</span>
          <span className="text-xs text-slate-500">— Design your database schema interactively</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setTables(STARTER_TABLES); setSelectedTable("tbl-users"); }}
          >
            <RefreshCw size={12} /> Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSQL(!showSQL)}
          >
            {showSQL ? "Hide SQL" : "Show SQL"}
          </Button>
        </div>
      </div>

      <div className="flex min-h-[500px]">
        {/* Table List Sidebar */}
        <div className="w-48 border-r border-white/10 bg-slate-950/30 flex flex-col">
          <div className="p-3 border-b border-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Tables</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {tables.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTable(t.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group transition-all",
                  selectedTable === t.id
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn("w-2 h-2 rounded-full bg-gradient-to-r shrink-0", t.color)} />
                  <span className="font-mono truncate text-xs">{t.name}</span>
                </div>
                {tables.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTable(t.id); }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </button>
            ))}
          </div>

          {/* Add Table */}
          <div className="p-2 border-t border-white/5">
            {showAddTable ? (
              <div className="space-y-1.5">
                <input
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTable()}
                  placeholder="table_name"
                  autoFocus
                  className="w-full text-xs px-2 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 font-mono outline-none focus:border-violet-500"
                />
                <div className="flex gap-1">
                  <button
                    onClick={addTable}
                    className="flex-1 text-xs py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-md transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setShowAddTable(false); setNewTableName(""); }}
                    className="text-xs py-1 px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddTable(true)}
                className="w-full text-xs py-2 flex items-center justify-center gap-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/5 rounded-lg transition-all border border-dashed border-white/10 hover:border-violet-500/30"
              >
                <Plus size={12} /> Add Table
              </button>
            )}
          </div>
        </div>

        {/* Column Editor */}
        <div className="flex-1 flex flex-col">
          {selectedT ? (
            <>
              {/* Table Header */}
              <div className={cn("px-4 py-3 border-b border-white/10 bg-gradient-to-r", selectedT.color, "bg-opacity-20")}>
                <div className="flex items-center gap-2">
                  <Table2 size={16} className="text-white" />
                  <span className="text-white font-bold font-mono">{selectedT.name}</span>
                  <span className="text-white/60 text-xs">({selectedT.columns.length} columns)</span>
                </div>
              </div>

              {/* Column rows */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-2 px-3 mb-1">
                  {["Column Name", "Data Type", "PK", "FK", ""].map((h, i) => (
                    <span key={i} className="text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</span>
                  ))}
                </div>

                {selectedT.columns.map((col) => (
                  <div
                    key={col.id}
                    className={cn(
                      "grid grid-cols-[1fr_1fr_auto_auto_auto] gap-2 items-center px-3 py-2 rounded-xl border transition-all",
                      col.isPK
                        ? "border-amber-500/30 bg-amber-500/5"
                        : col.isFK
                        ? "border-blue-500/30 bg-blue-500/5"
                        : "border-white/5 bg-slate-800/30 hover:border-white/10"
                    )}
                  >
                    <input
                      value={col.name}
                      onChange={(e) => updateColumn(selectedT.id, col.id, "name", e.target.value)}
                      className="text-xs font-mono bg-transparent text-slate-200 outline-none border-b border-transparent focus:border-violet-500 pb-0.5 min-w-0"
                    />
                    <select
                      value={col.type}
                      onChange={(e) => updateColumn(selectedT.id, col.id, "type", e.target.value)}
                      className="text-xs bg-slate-800/80 border border-white/10 rounded-md px-2 py-1 text-slate-300 outline-none focus:border-violet-500"
                    >
                      {COLUMN_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    {/* PK toggle */}
                    <button
                      onClick={() => updateColumn(selectedT.id, col.id, "isPK", !col.isPK)}
                      className={cn(
                        "text-[10px] px-2 py-1 rounded-md border font-medium transition-all",
                        col.isPK
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                          : "bg-slate-700/50 border-white/10 text-slate-500 hover:text-slate-300"
                      )}
                    >
                      PK
                    </button>

                    {/* FK toggle */}
                    <div className="relative">
                      {col.isFK ? (
                        <select
                          value={col.fkTarget ?? ""}
                          onChange={(e) => {
                            updateColumn(selectedT.id, col.id, "isFK", true);
                            updateColumn(selectedT.id, col.id, "fkTarget", e.target.value);
                          }}
                          className="text-[10px] bg-blue-500/20 border border-blue-500/40 rounded-md px-2 py-1 text-blue-400 outline-none"
                        >
                          <option value="">→ ?</option>
                          {tables.filter((t) => t.id !== selectedT.id).map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => updateColumn(selectedT.id, col.id, "isFK", !col.isFK)}
                          className="text-[10px] px-2 py-1 rounded-md border bg-slate-700/50 border-white/10 text-slate-500 hover:text-slate-300 font-medium transition-all"
                        >
                          FK
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => removeColumn(selectedT.id, col.id)}
                      disabled={col.isPK}
                      className="text-slate-600 hover:text-red-400 transition-colors disabled:opacity-20"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addColumn(selectedT.id)}
                  className="w-full mt-2 py-2.5 border border-dashed border-white/10 hover:border-violet-500/40 text-slate-500 hover:text-violet-400 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus size={12} /> Add Column
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Select a table to edit its columns
            </div>
          )}
        </div>

        {/* Relation View */}
        <div className="hidden xl:flex w-64 border-l border-white/10 flex-col bg-slate-950/20">
          <div className="p-3 border-b border-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Relations</p>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {tables.flatMap((t) =>
              t.columns
                .filter((c) => c.isFK && c.fkTarget)
                .map((c) => {
                  const target = tables.find((tt) => tt.id === c.fkTarget);
                  if (!target) return null;
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/20 rounded-xl"
                    >
                      <div className="text-center">
                        <div className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gradient-to-r text-white", t.color)}>
                          {t.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{c.name}</div>
                      </div>
                      <ArrowRight size={12} className="text-blue-400 shrink-0" />
                      <div className="text-center">
                        <div className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gradient-to-r text-white", target.color)}>
                          {target.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">id</div>
                      </div>
                    </div>
                  );
                })
                .filter(Boolean)
            )}
            {tables.every((t) => t.columns.every((c) => !c.isFK)) && (
              <p className="text-xs text-slate-600 text-center mt-4">
                Enable FK on a column to see relations here
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SQL Preview */}
      {showSQL && (
        <div className="border-t border-white/10">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/60 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs text-slate-500 font-mono">Generated SQL Preview</span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 bg-slate-950/40 overflow-x-auto leading-relaxed max-h-48">
            {generateSQL()}
          </pre>
        </div>
      )}
    </div>
  );
}
