"use client";
import { type SchemaTable } from "@/data/mockData";
import { Key, Link, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SchemaVisualizerProps {
  tables: SchemaTable[];
}

function getConstraintStyle(constraint: string) {
  if (constraint.includes("PK") || constraint.includes("PRIMARY")) {
    return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  }
  if (constraint.includes("FK") || constraint.includes("→")) {
    return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
  }
  if (constraint.includes("UNIQUE")) {
    return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
  }
  if (constraint.includes("NOT NULL")) {
    return "bg-red-500/20 text-red-400 border border-red-500/30";
  }
  return "bg-slate-600/30 text-slate-400 border border-slate-600/30";
}

function getTypeColor(type: string) {
  if (type.includes("BIGINT") || type.includes("INT")) return "text-sky-400";
  if (type.includes("VARCHAR") || type.includes("TEXT")) return "text-emerald-400";
  if (type.includes("BOOLEAN")) return "text-purple-400";
  if (type.includes("TIMESTAMP") || type.includes("DATE")) return "text-amber-400";
  return "text-slate-300";
}

export function SchemaVisualizer({ tables }: SchemaVisualizerProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-slate-800/60">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-xs text-slate-400 font-mono ml-2">schema_visualizer.sql</span>
      </div>

      <div className="p-4">
        <div className={cn(
          "flex gap-6 flex-wrap",
          tables.length === 1 ? "justify-center" : "justify-start"
        )}>
          {tables.map((table, tableIdx) => (
            <div key={table.name} className="flex items-start gap-3">
              {/* Table Card */}
              <div className="min-w-[220px] rounded-xl overflow-hidden border border-white/10 bg-slate-800/80 shadow-xl">
                {/* Table Header */}
                <div className="px-3 py-2.5 bg-gradient-to-r from-slate-700 to-slate-700/50 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white font-mono">{table.name}</span>
                    <span className="text-xs text-slate-400 px-1.5 py-0.5 bg-slate-900/50 rounded">
                      TABLE
                    </span>
                  </div>
                </div>

                {/* Columns */}
                <div className="divide-y divide-white/5">
                  {table.columns.map((col) => {
                    const isPK = col.constraints?.some(c => c.includes("PK") || c.includes("PRIMARY"));
                    const isFK = col.constraints?.some(c => c.includes("FK") || c.includes("→"));
                    return (
                      <div
                        key={col.name}
                        className={cn(
                          "px-3 py-2 flex items-start justify-between gap-2 group hover:bg-white/5 transition-colors",
                          isPK && "bg-amber-500/5",
                          isFK && "bg-blue-500/5"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isPK && <Key size={11} className="text-amber-400 shrink-0" />}
                          {isFK && !isPK && <Link size={11} className="text-blue-400 shrink-0" />}
                          {!isPK && !isFK && <div className="w-[11px] h-[11px]" />}
                          <span className={cn(
                            "text-xs font-mono truncate",
                            isPK ? "text-amber-300" : isFK ? "text-blue-300" : "text-slate-200"
                          )}>
                            {col.name}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={cn("text-[10px] font-mono", getTypeColor(col.type))}>
                            {col.type}
                          </span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {col.constraints?.slice(0, 2).map((c) => (
                              <span
                                key={c}
                                className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded font-medium",
                                  getConstraintStyle(c)
                                )}
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Relation arrow */}
              {table.relations && table.relations.length > 0 && tableIdx < tables.length - 1 && (
                <div className="flex flex-col items-center justify-center mt-12 gap-1">
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400" />
                    <ArrowRight size={14} className="text-blue-400" />
                  </div>
                  {table.relations.map((rel) => (
                    <div key={rel.table} className="text-center">
                      <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {rel.via}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Key size={11} className="text-amber-400" />
            <span className="text-[10px] text-slate-400">Primary Key</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link size={11} className="text-blue-400" />
            <span className="text-[10px] text-slate-400">Foreign Key</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-emerald-400/80" />
            <span className="text-[10px] text-slate-400">String</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-sky-400/80" />
            <span className="text-[10px] text-slate-400">Integer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
