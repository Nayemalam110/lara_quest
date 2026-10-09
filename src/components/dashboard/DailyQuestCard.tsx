import React, { useState } from "react";
import {
  CheckCircle2,
  Gift,
  Shield,
} from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";

interface Quest {
  id: string;
  title: string;
  task: string;
  rewardXp: number;
  icon: string;
  category: "syntax" | "schema" | "api" | "orm" | "devops";
}

const ROTATING_QUESTS: Quest[] = [
  {
    id: "quest-1",
    title: "SQL & Relational Challenge",
    task: "Review the difference between INNER JOIN and LEFT JOIN in Eloquent.",
    rewardXp: 50,
    icon: "🗄️",
    category: "schema",
  },
  {
    id: "quest-2",
    title: "HTTP Status Code Protocol",
    task: "Verify when to return 422 Unprocessable Entity vs 400 Bad Request.",
    rewardXp: 50,
    icon: "🌐",
    category: "api",
  },
  {
    id: "quest-3",
    title: "Dart ↔ Eloquent Model Parallel",
    task: "Map a Flutter factory Model.fromJson() to a Laravel Eloquent Model.",
    rewardXp: 50,
    icon: "⚡",
    category: "orm",
  },
  {
    id: "quest-4",
    title: "Sanctum Token Authentication",
    task: "Review how Bearer tokens are stored in FlutterSecureStorage vs Sanctum personal_access_tokens.",
    rewardXp: 50,
    icon: "🔐",
    category: "api",
  },
  {
    id: "quest-5",
    title: "Spaced Repetition Flashcards",
    task: "Master 3 concept flashcards using the ⌘J study deck.",
    rewardXp: 50,
    icon: "🧠",
    category: "syntax",
  },
  {
    id: "quest-6",
    title: "N+1 Query Prevention",
    task: "Explain why Model::with('relation') eliminates circular N+1 database queries.",
    rewardXp: 50,
    icon: "🚀",
    category: "orm",
  },
  {
    id: "quest-7",
    title: "Zero-Downtime Migration Pattern",
    task: "Review the Expand-and-Contract database schema transition pattern.",
    rewardXp: 50,
    icon: "🛡️",
    category: "devops",
  },
];

export function DailyQuestCard() {
  const { getStats, claimDailyQuest, equipStreakFreeze } = useProgressStore();
  const { profile } = useAuthStore();
  const stats = getStats();
  const [isClaiming, setIsClaiming] = useState(false);

  // Compute daily quest deterministically from today's date
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const currentQuest = ROTATING_QUESTS[dayOfYear % ROTATING_QUESTS.length];

  const isClaimed = stats.isDailyQuestClaimed;
  const streakFreezes = stats.streakFreezes ?? 1;

  const handleClaim = () => {
    if (isClaimed) return;
    setIsClaiming(true);
    setTimeout(() => {
      claimDailyQuest();
      setIsClaiming(false);
    }, 400);
  };

  const handleEquipFreeze = (e: React.MouseEvent) => {
    e.stopPropagation();
    equipStreakFreeze();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]/90 p-4 shadow-xl backdrop-blur-md transition-all hover:border-slate-700">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-transparent blur-2xl" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Quest Details */}
        <div className="flex items-start gap-3.5">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 via-slate-900 to-rose-500/20 text-2xl shadow-md">
            <span>{currentQuest.icon}</span>
            {isClaimed && (
              <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[10px] text-black font-bold">
                ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-amber-400">
                Daily Quest
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                +{currentQuest.rewardXp} XP
              </span>
              {isClaimed && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <CheckCircle2 size={11} /> Completed
                </span>
              )}
            </div>

            <h4 className="mt-1 font-display text-[15px] font-bold text-white">
              {currentQuest.title}
            </h4>
            <p className="mt-0.5 text-[12.5px] leading-snug text-slate-300 max-w-xl">
              {currentQuest.task}
            </p>
          </div>
        </div>

        {/* Right: Actions & Streak Freeze Shield Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
          {/* Streak Freeze Indicator */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300">
            <Shield size={14} className="text-sky-400" />
            <span className="font-mono text-[11px] text-slate-300">
              <strong className="text-white">{streakFreezes}</strong>/2 Shield{streakFreezes === 1 ? "" : "s"}
            </span>
            {streakFreezes < 2 && (
              <button
                onClick={handleEquipFreeze}
                title="Equip an offline streak freeze shield"
                className="ml-1 text-[10px] font-mono font-bold text-sky-400 hover:text-sky-300 cursor-pointer underline underline-offset-2"
              >
                +Add
              </button>
            )}
          </div>

          {/* Claim Button */}
          {isClaimed ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 font-mono text-xs font-bold text-emerald-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Claimed Today</span>
            </div>
          ) : (
            <Button
              variant="brand"
              size="sm"
              onClick={handleClaim}
              disabled={isClaiming}
              className="text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.35)] cursor-pointer"
            >
              <Gift size={13} />
              <span>{isClaiming ? "Claiming..." : "Complete & Claim +50 XP"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export default DailyQuestCard;
