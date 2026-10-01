import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number | string;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  color = "linear-gradient(90deg, #38bdf8, #a78bfa, #f43f5e)",
  height = 6,
  showLabel = false,
  className,
}: ProgressBarProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full", className)}>
      <div
        className="w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700/50"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${safeProgress}%`,
            background: color,
          }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Progress</span>
          <span className="font-semibold text-white">{safeProgress}%</span>
        </div>
      )}
    </div>
  );
}
