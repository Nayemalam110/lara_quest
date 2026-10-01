"use client";
import { Flame, X, Clock } from "lucide-react";
import { useState } from "react";
import { useProgressStore } from "@/store/useProgressStore";

export function StreakBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { streak, completedLessons } = useProgressStore();

  const hasCompletedToday = completedLessons.length > 0; // simplified mock

  if (dismissed) return null;
  if (hasCompletedToday && streak > 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 p-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-red-600/10 to-orange-600/5 animate-pulse pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
            <Flame size={22} className="text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-bold text-orange-300">
                🔥 Protect Your {streak}-Day Streak!
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-orange-400/70">
              <Clock size={11} />
              <span>Complete today's 5-minute lesson to keep your streak alive.</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-orange-400/60 hover:text-orange-300 transition-colors p-1"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
