import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 border border-violet-500/30",
  secondary:
    "bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 border border-slate-600/50",
  ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent",
  danger: "bg-red-600/80 hover:bg-red-500/80 text-white border border-red-500/30",
  success:
    "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 border border-emerald-500/30",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
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
