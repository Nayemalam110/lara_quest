import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  sheen?: boolean;
}

export function Card({
  className,
  glow = false,
  sheen = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md transition-all",
        glow && "shadow-[0_0_30px_rgba(56,189,248,0.1)] hover:border-slate-700",
        sheen && "card-sheen",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
