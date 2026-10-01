import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "flutter" | "laravel" | "gold" | "mint" | "viol" | "success" | "warning" | "danger" | "ghost";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  default: "bg-slate-800 text-slate-300 border border-slate-700",
  flutter: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
  laravel: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  gold: "bg-amber-400/15 text-amber-400 border border-amber-400/30",
  mint: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
  viol: "bg-violet-400/15 text-violet-400 border border-violet-400/30",
  success: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
  warning: "bg-amber-400/15 text-amber-400 border border-amber-400/30",
  danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  ghost: "bg-transparent text-slate-400 border border-transparent",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
};

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-mono font-medium tracking-tight",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
