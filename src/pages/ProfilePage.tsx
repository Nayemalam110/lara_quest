import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  Award,
  Zap,
  Flame,
  Shield,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function ProfilePage() {
  const { profile } = useAuthStore();
  const { achievements, getStats } = useProgressStore();

  const stats = getStats();
  const earnedKeys = stats.earnedAchievementKeys || [];

  const handleResetProgress = () => {
    if (window.confirm("Reset local progress back to initial state for testing?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const rarityColors: Record<string, string> = {
    legendary: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    epic: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    rare: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    common: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Profile Header Hero */}
      <div className="card-sheen relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={
                  profile?.avatarUrl ||
                  "https://api.dicebear.com/7.x/bottts/svg?seed=FlutterHero"
                }
                alt="Avatar"
                className="h-20 w-20 rounded-2xl border-2 border-sky-500/40 bg-slate-900 object-cover shadow-[0_0_30px_rgba(56,189,248,0.25)]"
              />
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-lg border border-slate-700 bg-slate-900 text-xs shadow-md">
                {stats.levelInfo?.badge || "🌱"}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {profile?.displayName || "Flutter Artisan"}
                </h1>
                <Badge variant="flutter">
                  Level {stats.levelInfo?.level}: {stats.levelInfo?.name}
                </Badge>
              </div>

              <p className="text-sm text-slate-300 mt-1">
                {profile?.email || "learner@laraquest.dev"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" /> Joined Recently
                </span>
                <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <Shield size={13} /> Mobile to Backend Track
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetProgress}
              className="text-xs"
            >
              <RotateCcw size={13} />
              <span>Reset Local Progress</span>
            </Button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-8 border-t border-slate-800 pt-6 max-w-xl">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-300 font-semibold">Level {stats.levelInfo?.level} Progress</span>
            <span className="text-amber-400 font-bold">
              {stats.levelInfo?.xpNeeded > 0
                ? `${stats.levelInfo?.xpNeeded} XP to Level ${stats.levelInfo?.level + 1}`
                : "Max Level"}
            </span>
          </div>
          <ProgressBar progress={stats.levelInfo?.progressInLevel || 0} height={8} />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-slate-800 bg-[#111827]/90 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase font-semibold">
            <span>Level Tier</span>
            <Award size={16} className="text-violet-400" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-white">
            Level {stats.levelInfo?.level}
          </div>
          <div className="text-xs text-slate-300 mt-1">{stats.levelInfo?.name}</div>
        </Card>

        <Card className="border-slate-800 bg-[#111827]/90 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase font-semibold">
            <span>Total XP</span>
            <Zap size={16} className="text-amber-400 fill-current" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-amber-400">
            {stats.xp}
          </div>
          <div className="text-xs text-slate-300 mt-1">Experience Points</div>
        </Card>

        <Card className="border-slate-800 bg-[#111827]/90 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase font-semibold">
            <span>Daily Streak</span>
            <Flame size={16} className="text-rose-500 fill-current" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-rose-400">
            {stats.streak} Days
          </div>
          <div className="text-xs text-slate-300 mt-1">Keep it burning</div>
        </Card>

        <Card className="border-slate-800 bg-[#111827]/90 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase font-semibold">
            <span>Curriculum</span>
            <Trophy size={16} className="text-emerald-400" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-emerald-400">
            {stats.overallProgressPercent}%
          </div>
          <div className="text-xs text-slate-300 mt-1">
            {stats.completedCount} lessons done
          </div>
        </Card>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="card-sheen relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-wider font-semibold">
              <Sparkles size={14} /> Milestone Badges
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Earned Achievements
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-300 rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1 font-semibold">
            {earnedKeys.length} of {achievements.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((ach: any) => {
            const isUnlocked = earnedKeys.includes(ach.key);
            const rarityStyle = rarityColors[ach.rarity] || rarityColors.common;

            return (
              <div
                key={ach.key}
                className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                  isUnlocked
                    ? "border-slate-700/80 bg-slate-900/90 shadow-md"
                    : "border-slate-800/60 bg-slate-950/40 opacity-50"
                }`}
              >
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border text-2xl ${
                    isUnlocked
                      ? "border-sky-500/30 bg-sky-500/10 shadow-sm"
                      : "border-slate-800 bg-slate-900/60 grayscale"
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`truncate text-sm font-bold ${
                        isUnlocked ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {ach.name}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider border font-semibold ${rarityStyle}`}
                    >
                      {ach.rarity}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs text-slate-300 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
