import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowLeftRight, Lightbulb, Smartphone, Server, ChevronDown, ChevronUp } from "lucide-react";
import type { FlutterParallel } from "@/types";
import { CodeBlock } from "@/components/ui/CodeBlock";

export interface CodeComparisonProps {
  data: FlutterParallel;
}

export function CodeComparison({ data }: CodeComparisonProps) {
  const [showExplanation, setShowExplanation] = useState(true);

  const flutterBlock = (
    <CodeBlock
      code={data.flutterCode}
      lang="dart"
      accent="flutter"
      title={data.flutterFile ?? "app.dart"}
    />
  );

  const laravelBlock = (
    <CodeBlock
      code={data.laravelCode}
      lang="php"
      accent="laravel"
      title={data.laravelFile ?? "app.php"}
    />
  );

  return (
    <div className="space-y-4">
      {/* Concept Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <span className="font-mono text-xs uppercase tracking-wider text-sky-400 font-semibold">
            Mental Model Bridge
          </span>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 font-mono text-xs text-slate-300">
          {data.concept}
        </span>
      </div>

      {/* Desktop: Side-by-Side View */}
      <div className="relative hidden gap-5 lg:grid lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 pl-1 font-mono text-xs font-semibold text-sky-400">
            <Smartphone size={14} />
            <span>Flutter / Dart · Client Logic</span>
          </div>
          {flutterBlock}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 pl-1 font-mono text-xs font-semibold text-rose-400">
            <Server size={14} />
            <span>Laravel / PHP · Server Enforcement</span>
          </div>
          {laravelBlock}
        </div>

        {/* Central Bridge Icon */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-slate-700 bg-slate-900 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
            <ArrowLeftRight size={17} className="text-sky-400" />
          </div>
        </div>
      </div>

      {/* Mobile / Tablet: Tab Switcher */}
      <Tabs.Root defaultValue="flutter" className="lg:hidden">
        <Tabs.List className="mb-3 grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          <Tabs.Trigger
            value="flutter"
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors data-[state=active]:bg-sky-500/15 data-[state=active]:text-sky-400"
          >
            <Smartphone size={14} />
            Flutter / Dart
          </Tabs.Trigger>
          <Tabs.Trigger
            value="laravel"
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors data-[state=active]:bg-rose-500/15 data-[state=active]:text-rose-400"
          >
            <Server size={14} />
            Laravel / PHP
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="flutter">{flutterBlock}</Tabs.Content>
        <Tabs.Content value="laravel">{laravelBlock}</Tabs.Content>
      </Tabs.Root>

      {/* Why This Matters Explainer */}
      <div className="overflow-hidden rounded-2xl border border-amber-400/25 bg-amber-400/5">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-800/40 cursor-pointer"
        >
          <div className="flex items-center gap-2.5 font-semibold text-xs text-amber-400">
            <Lightbulb size={16} />
            <span>Why This Mental Model Matters</span>
          </div>
          {showExplanation ? (
            <ChevronUp size={15} className="text-amber-400" />
          ) : (
            <ChevronDown size={15} className="text-amber-400" />
          )}
        </button>

        {showExplanation && (
          <div className="border-t border-amber-400/20 px-4 pb-4 pt-2 text-[13.5px] leading-relaxed text-slate-200">
            {data.explanation}
          </div>
        )}
      </div>
    </div>
  );
}
