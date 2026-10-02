import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Code2,
  Terminal,
  Globe,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  ROSETTA_CONCEPTS,
  STATUS_CODE_GUIDES,
  ARTISAN_COMMANDS,
  type RosettaConcept,
} from "@/data/rosettaStoneData";
import { ApiSimulatorSandbox } from "@/components/cheatsheet/ApiSimulatorSandbox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export function CheatsheetPage() {
  const [activeMainTab, setActiveMainTab] = useState<
    "rosetta" | "status" | "artisan" | "sandbox"
  >("rosetta");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const categories = [
    "All",
    "Architecture & State",
    "Networking & HTTP",
    "Database & Models",
    "Security & Storage",
    "Async & Workers",
  ];

  // Filter Rosetta concepts by search query and category
  const filteredConcepts = useMemo(() => {
    return ROSETTA_CONCEPTS.filter((c) => {
      const matchesCategory =
        selectedCategory === "All" || c.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.flutterParallel.toLowerCase().includes(q) ||
        c.laravelParallel.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.proTip.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(cmd);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 pb-20"
    >
      {/* Header Banner */}
      <div className="card-sheen relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-sm">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Flutter ↔ Laravel Rosetta Stone
            </h1>
            <p className="text-xs font-mono text-slate-300">
              Developer Quick Reference Hub & Interactive Client Sandbox
            </p>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          The ultimate cheat sheet for mobile engineers interacting with Laravel backends.
          Translate Flutter idioms into server-side equivalents, understand HTTP envelopes, copy Artisan commands, and test simulated endpoints.
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[280px] max-w-md flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts (Dio, BLoC, SQFlite, SharedPreferences, Sanctum)..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "rosetta", label: "Rosetta Syntax Bridge", icon: Code2, count: filteredConcepts.length },
          { id: "sandbox", label: "Interactive API Sandbox", icon: Terminal },
          { id: "status", label: "HTTP Status Codes & Envelopes", icon: Globe, count: STATUS_CODE_GUIDES.length },
          { id: "artisan", label: "Artisan CLI Cheatsheet", icon: Sparkles, count: ARTISAN_COMMANDS.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "border border-sky-500/40 bg-sky-500/15 text-white shadow-sm font-bold"
                  : "border border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon size={14} className={isActive ? "text-sky-400" : "text-slate-400"} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                    isActive
                      ? "bg-sky-500/25 text-sky-300 font-bold"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ROSETTA SYNTAX BRIDGE */}
      {activeMainTab === "rosetta" && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider mr-1 font-semibold">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "border border-slate-600 bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Concepts Grid */}
          {filteredConcepts.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <Search size={28} className="mx-auto text-slate-500" />
              <p className="mt-2 text-sm text-slate-300">
                No matching concepts found for &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-3 text-xs text-sky-400 hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredConcepts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-5 sm:p-6 backdrop-blur-xl shadow-lg"
                >
                  {/* Item Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-bold">
                        {item.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-sky-300 font-semibold">
                        🎯 Flutter: {item.flutterParallel}
                      </span>
                      <span className="text-slate-400">↔</span>
                      <span className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-rose-300 font-semibold">
                        🐘 Laravel: {item.laravelParallel}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Side-by-Side Code Comparison */}
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-sky-400 font-bold">
                        <span>Flutter (Dart)</span>
                        <span className="text-slate-400">Client Side</span>
                      </div>
                      <CodeBlock
                        code={item.flutterSnippet}
                        lang="dart"
                        compact
                        className="shadow-sm"
                      />
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-rose-400 font-bold">
                        <span>Laravel 11 (PHP)</span>
                        <span className="text-slate-400">Server Side</span>
                      </div>
                      <CodeBlock
                        code={item.laravelSnippet}
                        lang="php"
                        compact
                        className="shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Pro Tip Callout */}
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-200">
                    <Sparkles size={14} className="mt-0.5 shrink-0 text-amber-400" />
                    <span>
                      <strong className="text-amber-300 font-semibold">Architect Pro-Tip:</strong>{" "}
                      {item.proTip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERACTIVE API SANDBOX */}
      {activeMainTab === "sandbox" && (
        <ApiSimulatorSandbox />
      )}

      {/* TAB 3: HTTP STATUS CODES & ENVELOPES */}
      {activeMainTab === "status" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STATUS_CODE_GUIDES.map((sc) => {
              const badgeStyle =
                sc.code < 300
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : sc.code < 500
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-400";

              return (
                <div
                  key={sc.code}
                  className="flex flex-col rounded-2xl border border-slate-800 bg-[#111827]/90 p-5 shadow-lg backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-lg border px-2 py-0.5 font-mono text-sm font-bold ${badgeStyle}`}>
                        {sc.code}
                      </span>
                      <span className="font-bold text-white text-sm">{sc.phrase}</span>
                    </div>
                    <span className="font-mono text-[10px] uppercase text-slate-400">
                      {sc.category}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {sc.description}
                  </p>

                  <div className="mt-3">
                    <span className="font-mono text-[10.5px] text-sky-400 font-bold block mb-1">
                      📱 Flutter Handling:
                    </span>
                    <p className="font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                      {sc.flutterHandling}
                    </p>
                  </div>

                  <div className="mt-3 flex-1 flex flex-col justify-end">
                    <span className="font-mono text-[10.5px] text-rose-400 font-bold block mb-1">
                      🐘 Server JSON Envelope:
                    </span>
                    <CodeBlock
                      code={sc.laravelEnvelope}
                      lang="json"
                      compact
                      className="text-[11px]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ESSENTIAL ARTISAN CLI CHEATSHEET */}
      {activeMainTab === "artisan" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {ARTISAN_COMMANDS.map((ac, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#111827]/90 p-4 shadow-lg backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span className="text-sky-400 font-semibold">{ac.category}</span>
                    <button
                      onClick={() => handleCopyCommand(ac.command)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 transition hover:bg-slate-700 cursor-pointer"
                    >
                      {copiedCommand === ac.command ? (
                        <>
                          <Check size={11} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs font-bold text-amber-300">
                    $ {ac.command}
                  </div>

                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                    {ac.description}
                  </p>
                </div>

                <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                  💡 {ac.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
