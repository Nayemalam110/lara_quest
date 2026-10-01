import { useMemo } from "react";
import { cn } from "@/utils/cn";
import { highlight, lineCount } from "@/lib/highlight";

interface CodeBlockProps {
  code: string;
  lang: string;
  title?: string;
  accent?: "flutter" | "laravel" | "neutral";
  className?: string;
  compact?: boolean;
}

const ACCENT_DOT: Record<string, string> = {
  flutter: "#54c5f8",
  laravel: "#ff4438",
  neutral: "#8f94a8",
};

export function CodeBlock({ code, lang, title, accent = "neutral", className, compact }: CodeBlockProps) {
  const html = useMemo(() => highlight(code, lang), [code, lang]);
  const lines = lineCount(code);
  const dot = ACCENT_DOT[accent];

  return (
    <div
      className={cn(
        "code-block group/code relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#090b11]",
        className
      )}
    >
      {/* editor chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        {title && (
          <span className="ml-1 truncate font-mono text-[11px] text-mut">{title}</span>
        )}
        <span
          className="ml-auto rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
          style={{ color: dot, borderColor: `${dot}44`, background: `${dot}11` }}
        >
          {lang}
        </span>
      </div>

      <div className={cn("flex overflow-x-auto", compact ? "text-[12px]" : "text-[13px]")}>
        <div
          aria-hidden
          className="select-none border-r border-white/[0.05] py-4 pl-3.5 pr-3 text-right font-mono leading-[1.7] text-dim/60"
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
