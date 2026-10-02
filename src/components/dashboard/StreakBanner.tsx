import React from "react";
import { useNavigate } from "react-router-dom";
import { Flame, CheckCircle2, ArrowUpRight } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { firstIncompleteLesson } from "@/data/mockData";

import { useAuthStore } from "@/store/useAuthStore";

export function StreakBanner() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { getStats } = useProgressStore();
  const stats = getStats();
  const completedLessonIds = (stats.completedLessonIds || []).map(String);
  const nextLesson = firstIncompleteLesson(completedLessonIds);

  const todayStr = new Date().toISOString().split("T")[0];
  const isDoneToday =
    profile?.lastActivityDate === todayStr || stats.isDailyQuestClaimed;
  const freezes = stats.streakFreezes ?? 1;

  if (isDoneToday) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-slate-900/60 to-transparent px-4 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          <p className="text-[13.5px] text-slate-200">
            <span className="font-semibold text-emerald-400">
              {stats.streak}-day streak secured!
            </span>{" "}
            <span className="text-slate-300">
              Your streak flame is safe for today. Come back tomorrow to continue.
            </span>
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-[11px] font-bold text-sky-400">
          🧊 {freezes} Freeze{freezes === 1 ? "" : "s"} Ready
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => navigate(`/lesson/${nextLesson.id}`)}
      className="group flex w-full items-center gap-3.5 rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/15 via-slate-900/80 to-slate-900/40 px-4 py-3.5 text-left transition-all hover:border-amber-500/50 hover:shadow-[0_0_30px_-8px_rgba(251,191,36,0.3)] cursor-pointer shadow-lg"
    >
      <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30">
        <Flame size={18} className="fill-current" />
      </div>
      <p className="flex-1 text-[13.5px] text-white">
        <span className="font-bold text-amber-400">Daily goal at risk:</span>{" "}
        <span className="text-slate-300">
          Complete a quick 5-minute task today to preserve your {stats.streak}-day streak.
        </span>{" "}
        {freezes > 0 && (
          <span className="text-sky-400 font-mono text-xs">
            (🧊 {freezes} Freeze shield available)
          </span>
        )}
      </p>
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
        <span>Continue Next</span>
        <ArrowUpRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
