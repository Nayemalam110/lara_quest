import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  gradient?: string;
}

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  className,
  barClassName,
  showLabel = false,
  size = "md",
  gradient = "from-violet-500 to-purple-500",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full bg-slate-700/60 rounded-full overflow-hidden", sizeMap[size])}>
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
            gradient,
            barClassName
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-400 mt-1 text-right">{clamped}%</p>
      )}
    </div>
  );
}
