import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Zap,
  Database,
  Server,
  Layers,
  Cpu,
  FileJson,
  ShieldCheck,
  Code2,
  GitMerge,
  Sparkles,
  Link2,
  Globe,
  Package,
  KeyRound,
  Sliders,
  UploadCloud,
  Bell,
  Activity,
  Terminal,
  Bug,
  Workflow,
  HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Module } from "@/data/mockData";
import {
  isLessonUnlocked,
  isModuleUnlocked,
  moduleProgress,
} from "@/data/mockData";
import { useProgressStore } from "@/store/useProgressStore";

const MODULE_ICONS: Record<string, typeof Database> = {
  database: Database,
  code: Code2,
  server: Server,
  "git-merge": GitMerge,
  sparkles: Sparkles,
  link: Link2,
  controller: Cpu,
  globe: Globe,
  "shield-check": ShieldCheck,
  package: Package,
  key: KeyRound,
  sliders: Sliders,
  "upload-cloud": UploadCloud,
  bell: Bell,
  activity: Activity,
  terminal: Terminal,
  layers: Layers,
  workflow: Workflow,
  lock: Lock,
  bug: Bug,
  zap: Zap,
  "hard-drive": HardDrive,
  // legacy aliases
  orm: Layers,
  json: FileJson,
  shield: ShieldCheck,
};

export interface ModuleCardProps {
  module: Module;
  idx: number;
}

export function ModuleCard({ module, idx }: ModuleCardProps) {
  const navigate = useNavigate();
  const { getStats } = useProgressStore();
  const stats = getStats();
  const completed = (stats.completedLessonIds || []).map(String);

  const p = moduleProgress(module, completed);
  const unlocked = isModuleUnlocked(module.id, completed);
  const doneAll = p.done === p.total && p.total > 0;
  const Icon = MODULE_ICONS[module.icon] || Code2;

  const nextLesson =
    module.lessons.find((l) => !completed.includes(l.id)) ?? module.lessons[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-12 sm:pl-16"
    >
      {/* Spine Node */}
      <div
        className={cn(
          "absolute left-0 top-7 grid h-9 w-9 place-items-center rounded-xl border transition-all sm:h-11 sm:w-11 z-10",
          doneAll
            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            : unlocked
            ? "border-slate-700 bg-slate-900 shadow-md"
            : "border-slate-800 bg-slate-900/90 text-slate-500"
        )}
        style={
          unlocked && !doneAll
            ? {
                boxShadow: `0 0 22px ${module.color}33`,
                borderColor: `${module.color}66`,
              }
            : undefined
        }
      >
        {doneAll ? (
          <Check size={18} className="text-emerald-400" strokeWidth={3} />
        ) : unlocked ? (
          <Icon size={18} style={{ color: module.color }} />
        ) : (
          <Lock size={15} className="text-slate-500" />
        )}
      </div>

      {/* Module Card Body */}
      <div
        className={cn(
          "card-sheen relative overflow-hidden rounded-2xl border transition-all duration-300 shadow-xl",
          unlocked
            ? "border-slate-800 bg-[#111827]/90 hover:border-slate-700 backdrop-blur-md"
            : "border-slate-800/70 bg-[#0f172a]/50 backdrop-blur-sm"
        )}
      >
        {/* Accent Color Stripe */}
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, ${module.color}, transparent 65%)`,
            opacity: unlocked ? 0.95 : 0.4,
          }}
        />

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="font-mono text-[11px] font-bold tracking-[0.18em]"
              style={{ color: unlocked ? module.color : "#94a3b8" }}
            >
              MODULE {String(module.index || idx + 1).padStart(2, "0")}
            </span>

            {module.trackName && (
              <span className="rounded-full border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 font-mono text-[9.5px] text-slate-300 font-semibold tracking-wide">
                {module.trackName}
              </span>
            )}

            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                doneAll
                  ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                  : unlocked
                  ? p.done > 0
                    ? "border-sky-500/30 bg-sky-500/15 text-sky-400"
                    : "border-indigo-500/30 bg-indigo-500/15 text-indigo-300"
                  : "border-slate-700 bg-slate-800/60 text-slate-400"
              )}
            >
              {doneAll ? "completed" : unlocked ? (p.done > 0 ? "in progress" : "ready") : "locked"}
            </span>

            <span className="ml-auto flex items-center gap-1 font-mono text-[11.5px] font-semibold text-amber-400">
              <Zap size={12} className="fill-current" />
              {module.lessons.reduce((s, l) => s + l.xp + (l.challenge.xp ?? 25), 0)} XP
            </span>
          </div>

          <h3 className="mt-2.5 max-w-[34ch] font-display text-[20px] font-bold leading-tight tracking-tight text-white sm:text-[22px]">
            {module.title}
          </h3>

          <p className="mt-1.5 max-w-[65ch] text-[14px] leading-relaxed text-slate-300">
            {module.description}
          </p>

          {/* Lessons List Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {module.lessons.map((l) => {
              const lessonDone = completed.includes(l.id);
              const lessonOpen = unlocked && isLessonUnlocked(l.id, completed);

              return (
                <button
                  key={l.id}
                  disabled={!lessonOpen}
                  onClick={() => navigate(`/lesson/${l.id}`)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-[12.5px] font-medium transition-all select-none",
                    lessonDone
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
                      : lessonOpen
                      ? "border-slate-700 bg-slate-800/80 text-slate-200 hover:-translate-y-px hover:border-sky-400 hover:text-white hover:bg-sky-500/10 cursor-pointer shadow-sm"
                      : "border-slate-800/80 bg-slate-900/60 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {lessonDone ? (
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  ) : lessonOpen ? (
                    <Play size={10} className="fill-current text-sky-400 shrink-0" />
                  ) : (
                    <Lock size={11} className="text-slate-500 shrink-0" />
                  )}
                  <span>{l.title}</span>
                </button>
              );
            })}
          </div>

          {/* Module Progress Footer */}
          <div className="mt-5 flex items-center gap-4">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${p.pct}%`,
                  background: module.color,
                  boxShadow: p.pct > 0 ? `0 0 10px ${module.color}88` : undefined,
                }}
              />
            </div>
            <span className="shrink-0 font-mono text-[11px] font-semibold text-slate-400">
              {p.done}/{p.total} lessons
            </span>
            {unlocked && !doneAll && (
              <button
                onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-slate-950 transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_-4px_rgba(255,255,255,0.4)] active:scale-95 cursor-pointer"
              >
                {p.done > 0 ? "Continue" : "Start"} <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
