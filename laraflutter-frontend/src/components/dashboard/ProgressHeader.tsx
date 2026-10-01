"use client";
import { Flame, Zap, Star, TrendingUp } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { modules } from "@/data/mockData";
import { ProgressBar } from "@/components/ui/ProgressBar";

const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

export function ProgressHeader() {
  const { xp, streak, completedLessons, getTotalCompletionPercent } = useProgressStore();
  const percent = getTotalCompletionPercent(totalLessons);

  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const xpToNextLevel = 500;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 p-6 backdrop-blur-sm">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-purple-900/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Title + Progress */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
              Your Progress
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {percent === 0
              ? "Start Your Journey 🚀"
              : percent < 50
              ? "Building Momentum! 💪"
              : percent < 100
              ? "Almost There! 🔥"
              : "LaraFlutter Master! 🏆"}
          </h2>

          {/* Overall progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {completedLessons.length} of {totalLessons} lessons completed
              </span>
              <span className="text-violet-400 font-bold">{percent}%</span>
            </div>
            <ProgressBar
              value={percent}
              size="lg"
              gradient="from-violet-500 via-purple-500 to-pink-500"
            />
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex gap-4 flex-wrap lg:flex-nowrap">
          {/* Streak */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-2xl px-5 py-4 min-w-[90px]">
            <Flame size={28} className="text-orange-400 mb-1" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-white leading-none">{streak}</span>
            <span className="text-[10px] text-orange-400/80 mt-0.5 uppercase tracking-wider font-medium">
              Day Streak
            </span>
          </div>

          {/* XP */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 rounded-2xl px-5 py-4 min-w-[90px]">
            <Zap size={28} className="text-amber-400 mb-1" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-white leading-none">{xp.toLocaleString()}</span>
            <span className="text-[10px] text-amber-400/80 mt-0.5 uppercase tracking-wider font-medium">
              Total XP
            </span>
          </div>

          {/* Level */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 rounded-2xl px-5 py-4 min-w-[90px]">
            <Star size={28} className="text-violet-400 mb-1" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-white leading-none">Lv.{level}</span>
            <span className="text-[10px] text-violet-400/80 mt-0.5 uppercase tracking-wider font-medium">
              Level
            </span>
          </div>

          {/* Rank */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl px-5 py-4 min-w-[90px]">
            <TrendingUp size={28} className="text-emerald-400 mb-1" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-white leading-none">
              {percent < 25 ? "Novice" : percent < 50 ? "Learner" : percent < 75 ? "Builder" : "Expert"}
            </span>
            <span className="text-[10px] text-emerald-400/80 mt-0.5 uppercase tracking-wider font-medium">
              Rank
            </span>
          </div>
        </div>
      </div>

      {/* Level progress bar */}
      <div className="relative mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400">Level {level} Progress</span>
          <span className="text-slate-400">
            {xpInLevel} / {xpToNextLevel} XP to Level {level + 1}
          </span>
        </div>
        <ProgressBar
          value={(xpInLevel / xpToNextLevel) * 100}
          size="sm"
          gradient="from-amber-500 to-orange-500"
        />
      </div>
    </div>
  );
}
