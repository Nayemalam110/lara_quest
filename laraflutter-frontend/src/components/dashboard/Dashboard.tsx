"use client";
import { useState, useCallback } from "react";
import { modules } from "@/data/mockData";
import { useProgressStore } from "@/store/useProgressStore";
import { ProgressHeader } from "./ProgressHeader";
import { StreakBanner } from "./StreakBanner";
import { ModuleCard } from "./ModuleCard";
import { SchemaPlayground } from "@/components/playground/SchemaPlayground";
import { Sparkles, Map, Database } from "lucide-react";
import { cn } from "@/lib/utils";

type DashTab = "roadmap" | "playground";

interface DashboardProps {
  onSelectLesson: (lessonId: string) => void;
}

export function Dashboard({ onSelectLesson }: DashboardProps) {
  const [tab, setTab] = useState<DashTab>("roadmap");
  const { completedLessons } = useProgressStore();

  const isModuleUnlocked = useCallback(
    (idx: number) => {
      if (idx === 0) return true;
      // Previous module must have at least 1 lesson completed
      const prevModule = modules[idx - 1];
      return prevModule.lessons.some((l) => completedLessons.includes(l.id));
    },
    [completedLessons]
  );

  const tabs = [
    { id: "roadmap" as DashTab, label: "Learning Roadmap", icon: Map },
    { id: "playground" as DashTab, label: "Schema Playground", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Streak Banner */}
      <StreakBanner />

      {/* Progress Header */}
      <ProgressHeader />

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-white/10 pb-0">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl border-b-2 transition-all",
                tab === t.id
                  ? "text-violet-300 border-violet-500 bg-violet-500/10"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Roadmap */}
      {tab === "roadmap" && (
        <div>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" />
              <h2 className="text-lg font-bold text-white">Curriculum Roadmap</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/30 to-transparent" />
            <span className="text-xs text-slate-500">
              {modules.length} modules · {modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
            </span>
          </div>

          {/* Module grid */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((mod, idx) => (
              <div key={mod.id} className="relative">
                {/* Connector line between modules */}
                {idx < modules.length - 1 && (
                  <div className="hidden xl:block absolute -right-2 top-1/2 w-4 h-0.5 bg-gradient-to-r from-slate-700 to-transparent z-10" />
                )}
                <ModuleCard
                  module={mod}
                  index={idx}
                  isUnlocked={isModuleUnlocked(idx)}
                  onSelectLesson={onSelectLesson}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schema Playground */}
      {tab === "playground" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-violet-400" />
              <h2 className="text-lg font-bold text-white">Interactive Schema Sandbox</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/30 to-transparent" />
          </div>
          <p className="text-sm text-slate-400 mb-4 max-w-2xl">
            Design and connect database tables visually. Add columns, toggle primary/foreign keys, and see the generated SQL — all without touching a real database.
          </p>
          <SchemaPlayground />
        </div>
      )}
    </div>
  );
}
