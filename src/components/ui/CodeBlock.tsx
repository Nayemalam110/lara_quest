import React, { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { highlight, lineCount } from "@/lib/highlight";

export interface CodeBlockProps {
  code: string;
  lang: string;
  title?: string;
  accent?: "flutter" | "laravel" | "neutral" | "viol" | "mint";
  className?: string;
  compact?: boolean;
}

const ACCENT_DOT: Record<string, string> = {
  flutter: "#38bdf8",
  laravel: "#f43f5e",
  viol: "#a78bfa",
  mint: "#34d399",
  neutral: "#94a3b8",
};

export function CodeBlock({
  code,
  lang,
  title,
  accent = "neutral",
  className,
  compact,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => highlight(code, lang), [code, lang]);
  const lines = lineCount(code);
  const dot = ACCENT_DOT[accent] || ACCENT_DOT.neutral;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "code-block group/code relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100",
        className
      )}
    >
      {/* Editor Chrome */}
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/60 px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </span>

        {title && (
          <span className="ml-1 truncate font-mono text-[11px] text-slate-400">
            {title}
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span
            className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
            style={{ color: dot, borderColor: `${dot}44`, background: `${dot}11` }}
          >
            {lang}
          </span>

          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className={cn("flex overflow-x-auto", compact ? "text-[12px]" : "text-[13px]")}>
        <div
          aria-hidden
          className="select-none border-r border-slate-800 py-4 pl-3.5 pr-3 text-right font-mono leading-[1.7] text-slate-600"
        >
          {Array.from({ length: lines }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 py-4 pl-4 pr-5 font-mono leading-[1.7]">
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </div>
  );
}
