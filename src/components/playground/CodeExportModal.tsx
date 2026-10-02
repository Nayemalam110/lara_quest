import React, { useState } from "react";
import { Copy, Check, Download, X, Code2, Database, Layers } from "lucide-react";
import type { PgTable } from "./SchemaPlayground";
import {
  generateLaravelMigrations,
  generatePostgreSqlDdl,
  generateFlutterDartModels,
} from "./codeGenerators";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: PgTable[];
}

type ExportTab = "laravel" | "postgres" | "dart";

export function CodeExportModal({ isOpen, onClose, tables }: CodeExportModalProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>("laravel");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCodeAndFile = () => {
    switch (activeTab) {
      case "laravel":
        return {
          code: generateLaravelMigrations(tables),
          lang: "php",
          filename: "2026_10_02_000000_create_playground_tables.php",
          label: "Laravel 11 Migration",
          icon: Code2,
          color: "#f43f5e",
        };
      case "postgres":
        return {
          code: generatePostgreSqlDdl(tables),
          lang: "sql",
          filename: "schema.sql",
          label: "PostgreSQL DDL",
          icon: Database,
          color: "#38bdf8",
        };
      case "dart":
        return {
          code: generateFlutterDartModels(tables),
          lang: "dart",
          filename: "models.dart",
          label: "Flutter / Dart Models",
          icon: Layers,
          color: "#06b6d4",
        };
    }
  };

  const { code, lang, filename, label, color } = getCodeAndFile();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-sky-950/40 backdrop-blur-xl animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span
              className="grid h-8 w-8 place-items-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-sm"
            >
              <Code2 size={18} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white sm:text-base">
                Multi-Target Code Exporter
              </h2>
              <p className="font-mono text-[11px] text-slate-400">
                Generated from {tables.length} schema table{tables.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/60 px-5 py-2.5">
          {/* Target Tabs */}
          <div className="flex items-center gap-1.5">
            {(
              [
                { id: "laravel", label: "Laravel 11 Migration", color: "#f43f5e" },
                { id: "postgres", label: "PostgreSQL DDL", color: "#38bdf8" },
                { id: "dart", label: "Flutter / Dart Models", color: "#06b6d4" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === t.id
                    ? "border text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
                style={
                  activeTab === t.id
                    ? {
                        borderColor: `${t.color}60`,
                        backgroundColor: `${t.color}1c`,
                        color: t.color,
                      }
                    : undefined
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/15 px-3.5 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/25 cursor-pointer shadow-sm"
            >
              <Download size={13} />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
          <CodeBlock
            code={code}
            lang={lang}
            title={filename}
            className="max-h-[58vh] overflow-auto shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}
