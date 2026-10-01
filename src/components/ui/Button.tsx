import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "brand" | "flutter" | "laravel" | "ghost" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-sky-400 via-violet-400 to-rose-500 text-white font-bold shadow-lg shadow-sky-500/20 hover:opacity-95 border border-white/20 active:scale-[0.98]",
  brand:
    "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 border border-violet-500/30 font-semibold",
  flutter:
    "bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 font-semibold",
  laravel:
    "bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 font-semibold",
  secondary:
    "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-sm",
  outline:
    "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700",
  ghost:
    "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white border border-transparent",
  danger:
    "bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40",
  success:
    "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 shadow-sm",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
