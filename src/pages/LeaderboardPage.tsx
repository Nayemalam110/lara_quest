import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Zap,
  GraduationCap,
  Search,
  Medal,
  Award,
  ChevronUp,
  Sparkles,
  Users,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";
import {
  getRankedLearners,
  LeaderboardSortOption,
  LeaderboardUser,
} from "@/data/leaderboardData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function LeaderboardPage() {
  const { profile } = useAuthStore();
  const { getStats } = useProgressStore();
  const stats = getStats();

  const [sortOption, setSortOption] = useState<LeaderboardSortOption>("xp");
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserData = useMemo(
    () => ({
      id: profile?.id,
      displayName: profile?.displayName,
      avatarUrl: profile?.avatarUrl,
      totalXp: stats.xp,
      currentStreak: stats.streak,
      currentLevel: stats.levelInfo?.level || 1,
      completedLessonIds: stats.completedLessonIds,
    }),
    [profile, stats]
  );

  const { rankedList, podium, currentUserStanding } = useMemo(
    () => getRankedLearners(sortOption, searchQuery, currentUserData),
    [sortOption, searchQuery, currentUserData]
  );

  const rankBadges: Record<number, { bg: string; text: string; icon: string }> = {
    1: { bg: "bg-amber-500/20 border-amber-500/40", text: "text-amber-300", icon: "🥇" },
    2: { bg: "bg-slate-300/20 border-slate-300/40", text: "text-slate-200", icon: "🥈" },
    3: { bg: "bg-amber-700/20 border-amber-700/40", text: "text-amber-500", icon: "🥉" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 pb-20"
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-transparent blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
              <Trophy size={14} /> LaraQuest Guild Rankings
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Community Leaderboard
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              Mobile developers mastering backend architecture. Compare your streak, XP, and
              curriculum progress with fellow Flutter-to-Laravel engineers worldwide.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30">
              #{currentUserStanding.rank}
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">
                Your Global Standing
              </div>
              <div className="text-xs text-slate-200">
                Top <strong className="text-amber-400 font-bold">{currentUserStanding.percentile}%</strong> of learners
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 Top 3 Podium Highlights */}
      {!searchQuery && podium.length >= 3 && (
        <div>
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles size={14} className="text-amber-400" />
            <span>Top Tier Full-Stack Pioneers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Rank 2 - Silver (Left) */}
            <div className="order-2 md:order-1">
              <PodiumCard
                user={podium[1]}
                place={2}
                metricLabel={
                  sortOption === "streak"
                    ? `${podium[1].streak}d Streak`
                    : sortOption === "modules"
                    ? `${podium[1].completedModules}/24 Modules`
                    : `${podium[1].xp.toLocaleString()} XP`
                }
              />
            </div>

            {/* Rank 1 - Gold (Center, Elevated) */}
            <div className="order-1 md:order-2 -mt-2">
              <PodiumCard
                user={podium[0]}
                place={1}
                isGold
                metricLabel={
                  sortOption === "streak"
                    ? `${podium[0].streak}d Streak`
                    : sortOption === "modules"
                    ? `${podium[0].completedModules}/24 Modules`
                    : `${podium[0].xp.toLocaleString()} XP`
                }
              />
            </div>

            {/* Rank 3 - Bronze (Right) */}
            <div className="order-3">
              <PodiumCard
                user={podium[2]}
                place={3}
                metricLabel={
                  sortOption === "streak"
                    ? `${podium[2].streak}d Streak`
                    : sortOption === "modules"
                    ? `${podium[2].completedModules}/24 Modules`
                    : `${podium[2].xp.toLocaleString()} XP`
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Sort Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-[#111827] p-1 shadow-sm">
          <button
            onClick={() => setSortOption("xp")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
              sortOption === "xp"
                ? "bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap size={14} className={sortOption === "xp" ? "text-amber-400" : ""} />
            <span>All-Time XP</span>
          </button>
          <button
            onClick={() => setSortOption("streak")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
              sortOption === "streak"
                ? "bg-rose-500/20 text-rose-300 shadow-sm border border-rose-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Flame size={14} className={sortOption === "streak" ? "text-rose-400" : ""} />
            <span>Top Streaks</span>
          </button>
          <button
            onClick={() => setSortOption("modules")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
              sortOption === "modules"
                ? "bg-sky-500/20 text-sky-300 shadow-sm border border-sky-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <GraduationCap size={14} className={sortOption === "modules" ? "text-sky-400" : ""} />
            <span>Curriculum Mastery</span>
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learners by name or handle..."
            className="w-full rounded-2xl border border-slate-800 bg-[#111827] pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition shadow-sm"
          />
        </div>
      </div>

      {/* 📋 Complete Standings Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]/80 shadow-xl">
        <div className="grid grid-cols-12 gap-3 border-b border-slate-800 px-5 py-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5 sm:col-span-4">Learner</div>
          <div className="hidden sm:block sm:col-span-3">Role & Guild Level</div>
          <div className="col-span-3 sm:col-span-2 text-center">Streak & Modules</div>
          <div className="col-span-3 sm:col-span-2 text-right">XP</div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {rankedList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No learners matched your search query "{searchQuery}".
            </div>
          ) : (
            rankedList.map((learner) => {
              const isTop3 = learner.rank <= 3;
              const isCurrent = learner.isCurrentUser;

              return (
                <div
                  key={learner.id}
                  className={`grid grid-cols-12 items-center gap-3 px-5 py-3.5 transition-colors ${
                    isCurrent
                      ? "bg-sky-500/10 border-l-4 border-sky-400"
                      : "hover:bg-slate-800/40"
                  }`}
                >
                  {/* Rank Column */}
                  <div className="col-span-1 text-center">
                    {isTop3 ? (
                      <span className="text-lg">
                        {learner.rank === 1 ? "🥇" : learner.rank === 2 ? "🥈" : "🥉"}
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        #{learner.rank}
                      </span>
                    )}
                  </div>

                  {/* Learner Info */}
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0">
                    <img
                      src={learner.avatarUrl}
                      alt={learner.displayName}
                      className="h-9 w-9 shrink-0 rounded-full border border-slate-700 bg-slate-800 object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-display text-sm font-bold text-white truncate">
                          {learner.displayName}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-sky-500/20 px-1.5 py-0.2 font-mono text-[9.5px] font-bold text-sky-400">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 truncate">
                        {learner.username}
                      </div>
                    </div>
                  </div>

                  {/* Role & Level */}
                  <div className="hidden sm:block sm:col-span-3 min-w-0">
                    <div className="text-xs text-slate-200 truncate font-medium">
                      {learner.role}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="font-mono text-amber-400 font-semibold">
                        Lvl {learner.level}
                      </span>
                      <span>•</span>
                      <span className="truncate">{learner.levelName}</span>
                    </div>
                  </div>

                  {/* Streak & Modules */}
                  <div className="col-span-3 sm:col-span-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="flex items-center gap-1 font-mono text-xs font-bold text-rose-400">
                        <Flame size={13} className="fill-current" />
                        <span>{learner.streak}d</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-xs text-sky-300">
                        <GraduationCap size={13} />
                        <span>{learner.completedModules}/24</span>
                      </span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="col-span-3 sm:col-span-2 text-right">
                    <div className="font-mono text-sm font-bold text-amber-400">
                      {learner.xp.toLocaleString()}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">XP</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 📌 Sticky Current User Standing Banner */}
      <div className="sticky bottom-4 z-20 overflow-hidden rounded-2xl border border-sky-500/40 bg-[#0d1424]/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-sky-500/40 bg-sky-500/20 text-sky-300 font-bold font-mono">
              #{currentUserStanding.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-white">
                  {profile?.displayName || "Your Current Standing"}
                </span>
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] text-sky-400">
                  {currentUserStanding.percentile}th Percentile
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUserStanding.distanceToNextRank > 0 ? (
                  <>
                    <strong className="text-amber-400 font-mono">
                      {currentUserStanding.distanceToNextRank} XP
                    </strong>{" "}
                    needed to reach Rank #{currentUserStanding.rank - 1} (
                    {currentUserStanding.nextRankUser?.displayName})
                  </>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    👑 You are currently in 1st Place on the Leaderboard!
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-mono text-base font-bold text-amber-400">
                {stats.xp.toLocaleString()} XP
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                {stats.streak}d streak • {Math.floor((stats.completedLessonIds || []).length / 4)}/24 modules
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface PodiumCardProps {
  user: LeaderboardUser;
  place: number;
  isGold?: boolean;
  metricLabel: string;
}

function PodiumCard({ user, place, isGold, metricLabel }: PodiumCardProps) {
  const badgeMap: Record<number, { border: string; bg: string; icon: string; title: string }> = {
    1: {
      border: "border-amber-500/60 shadow-[0_0_25px_rgba(251,191,36,0.25)]",
      bg: "bg-gradient-to-b from-amber-500/15 via-[#111827] to-[#111827]",
      icon: "🥇",
      title: "Gold Podium",
    },
    2: {
      border: "border-slate-400/40 shadow-lg",
      bg: "bg-gradient-to-b from-slate-400/10 via-[#111827] to-[#111827]",
      icon: "🥈",
      title: "Silver Podium",
    },
    3: {
      border: "border-amber-700/40 shadow-lg",
      bg: "bg-gradient-to-b from-amber-700/15 via-[#111827] to-[#111827]",
      icon: "🥉",
      title: "Bronze Podium",
    },
  };

  const style = badgeMap[place];

  return (
    <div
      className={`relative rounded-3xl border ${style.border} ${style.bg} p-5 text-center transition-transform hover:-translate-y-1`}
    >
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md">
        {style.icon}
      </div>

      <div className="mt-2 flex flex-col items-center">
        <div className="relative mt-2">
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className={`h-16 w-16 rounded-full border-2 ${
              isGold ? "border-amber-400" : "border-slate-600"
            } bg-slate-800 object-cover`}
          />
          <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-slate-900 border border-slate-700 text-xs">
            {user.badge}
          </span>
        </div>

        <h3 className="mt-3 font-display text-base font-bold text-white truncate max-w-[180px]">
          {user.displayName}
        </h3>
        <span className="font-mono text-xs text-slate-400">{user.username}</span>

        <div className="mt-2.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 font-mono text-xs font-bold text-amber-400">
          {metricLabel}
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <Flame size={12} className="fill-current" /> {user.streak}d
          </span>
          <span>•</span>
          <span className="text-sky-300">{user.completedModules} mods</span>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
