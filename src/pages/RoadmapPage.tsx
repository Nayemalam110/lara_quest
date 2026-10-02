import React, { useState } from "react";
import { motion } from "framer-motion";
import { Map, Filter } from "lucide-react";
import { modules, totalLessons } from "@/data/mockData";
import { useProgressStore } from "@/store/useProgressStore";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { moduleProgress, isModuleUnlocked } from "@/data/mockData";

export function RoadmapPage() {
  const { getStats } = useProgressStore();
  const [statusFilter, setStatusFilter] = useState<"all" | "unlocked" | "completed">("all");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const stats = getStats();
  const completedLessonIds = (stats.completedLessonIds || []).map(String);

  const percent = Math.round((completedLessonIds.length / (totalLessons || 1)) * 100);

  const filteredModules = modules.filter((mod) => {
    if (trackFilter !== "all" && mod.trackId !== trackFilter) {
      return false;
    }
    const p = moduleProgress(mod, completedLessonIds);
    const unlocked = isModuleUnlocked(mod.id, completedLessonIds);
    const isCompleted = p.done === p.total && p.total > 0;

    if (statusFilter === "unlocked") return unlocked && !isCompleted;
    if (statusFilter === "completed") return isCompleted;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Header Banner */}
      <div className="card-sheen relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-sm">
            <Map size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Curriculum Roadmap
            </h1>
            <p className="text-xs font-mono text-slate-300">
              Structured 6-track, 24-module journey from database schema to full REST API mastery
            </p>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          Each module bridges backend engineering into the mobile and Flutter concepts you already understand.
          Follow the spine sequentially or filter by curriculum track.
        </p>

        <div className="mt-6 max-w-md">
          <div className="mb-2 flex items-center justify-between text-xs font-mono text-slate-300 font-medium">
            <span>Curriculum Progress</span>
            <span className="font-bold text-white">
              {completedLessonIds.length}/{totalLessons} lessons ({percent}%)
            </span>
          </div>
          <ProgressBar progress={percent} height={8} />
        </div>
      </div>

      {/* Filter Tabs: Tracks & Status */}
      <div className="space-y-3 border-b border-slate-800 pb-5">
        {/* Track Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate-400 uppercase tracking-wider mr-1 font-semibold">
            Track:
          </span>
          {[
            { id: "all", label: "All Tracks", color: "#38bdf8" },
            { id: "track-1", label: "Track 1: Foundations", color: "#38bdf8" },
            { id: "track-2", label: "Track 2: Eloquent Engine", color: "#a78bfa" },
            { id: "track-3", label: "Track 3: REST API Mastery", color: "#f43f5e" },
            { id: "track-4", label: "Track 4: Advanced & Capstone", color: "#34d399" },
            { id: "track-5", label: "Track 5: Real-World Architecture", color: "#fbbf24" },
            { id: "track-6", label: "Track 6: Database Mastery & Performance", color: "#06b6d4" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTrackFilter(t.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                trackFilter === t.id
                  ? "border text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
              style={
                trackFilter === t.id
                  ? {
                      borderColor: `${t.color}50`,
                      backgroundColor: `${t.color}18`,
                    }
                  : undefined
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 pt-1">
          <Filter size={14} className="text-slate-500" />
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider mr-1 font-semibold">
            Status:
          </span>
          {(
            [
              { id: "all", label: `Showing ${filteredModules.length} Modules` },
              { id: "unlocked", label: "Active & Ready" },
              { id: "completed", label: "Completed" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "border border-slate-700 bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Spine Road */}
      <div className="relative pl-2 sm:pl-4">
        <div className="absolute bottom-10 left-[25.5px] top-8 w-px bg-gradient-to-b from-sky-500/50 via-slate-700 to-rose-500/50 sm:left-[29.5px]" />
        <div className="flex flex-col gap-6">
          {filteredModules.map((mod, i) => (
            <ModuleCard key={mod.id} module={mod} idx={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
