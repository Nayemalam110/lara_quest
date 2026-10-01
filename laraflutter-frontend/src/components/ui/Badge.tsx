import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "ghost";
  className?: string;
}

const variantStyles = {
  default: "bg-slate-700 text-slate-200 border border-slate-600",
  success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  danger: "bg-red-500/20 text-red-400 border border-red-500/30",
  info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  ghost: "bg-white/5 text-slate-400 border border-white/10",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
