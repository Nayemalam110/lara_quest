"use client";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { type FlutterParallel } from "@/data/mockData";
import { Smartphone, Server, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeComparisonProps {
  data: FlutterParallel;
}

export function CodeComparison({ data }: CodeComparisonProps) {
  const [activeTab, setActiveTab] = useState<"flutter" | "laravel">("flutter");
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-800/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
            Mental Model Bridge
          </span>
        </div>
        <h3 className="text-white font-semibold text-base">{data.concept}</h3>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("flutter")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200",
            activeTab === "flutter"
              ? "bg-sky-500/20 text-sky-400 border-b-2 border-sky-400"
              : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
          )}
        >
          <Smartphone size={14} />
          Flutter / Dart
        </button>
        <button
          onClick={() => setActiveTab("laravel")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200",
            activeTab === "laravel"
              ? "bg-red-500/20 text-red-400 border-b-2 border-red-400"
              : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
          )}
        >
          <Server size={14} />
          Laravel / PHP
        </button>
      </div>

      {/* Code Block */}
      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-md font-mono",
              activeTab === "flutter"
                ? "bg-sky-500/20 text-sky-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {activeTab === "flutter" ? "dart" : "php"}
          </span>
        </div>
        <div className="text-sm overflow-x-auto max-h-80">
          <SyntaxHighlighter
            language={activeTab === "flutter" ? "dart" : "php"}
            style={atomOneDark}
            customStyle={{
              margin: 0,
              padding: "1.25rem",
              background: "transparent",
              fontSize: "0.8rem",
              lineHeight: "1.6",
            }}
            showLineNumbers
            lineNumberStyle={{ color: "#4b5563", fontSize: "0.7rem", minWidth: "2rem" }}
          >
            {activeTab === "flutter" ? data.flutterCode : data.laravelCode}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Side-by-side view on larger screens */}
      <div className="hidden lg:block border-t border-white/10">
        <div className="grid grid-cols-2 divide-x divide-white/10">
          <div>
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-sky-500/5">
              <Smartphone size={12} className="text-sky-400" />
              <span className="text-xs text-sky-400 font-medium">Flutter / Dart</span>
            </div>
            <div className="text-xs overflow-x-auto max-h-64">
              <SyntaxHighlighter
                language="dart"
                style={atomOneDark}
                customStyle={{ margin: 0, padding: "1rem", background: "transparent", fontSize: "0.72rem", lineHeight: "1.6" }}
                showLineNumbers
                lineNumberStyle={{ color: "#374151", fontSize: "0.65rem", minWidth: "1.8rem" }}
              >
                {data.flutterCode}
              </SyntaxHighlighter>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-red-500/5">
              <Server size={12} className="text-red-400" />
              <span className="text-xs text-red-400 font-medium">Laravel / PHP</span>
            </div>
            <div className="text-xs overflow-x-auto max-h-64">
              <SyntaxHighlighter
                language="php"
                style={atomOneDark}
                customStyle={{ margin: 0, padding: "1rem", background: "transparent", fontSize: "0.72rem", lineHeight: "1.6" }}
                showLineNumbers
                lineNumberStyle={{ color: "#374151", fontSize: "0.65rem", minWidth: "1.8rem" }}
              >
                {data.laravelCode}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation toggle */}
      <div className="border-t border-white/10">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-amber-400 hover:bg-amber-500/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lightbulb size={14} />
            <span className="font-medium">Why This Matters</span>
          </div>
          {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showExplanation && (
          <div className="px-4 pb-4">
            <p className="text-sm text-slate-300 leading-relaxed bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              {data.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
