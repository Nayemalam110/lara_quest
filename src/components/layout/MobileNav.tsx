import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Flame, Zap, Boxes, GraduationCap, Trophy, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";

export function MobileTopBar() {
  const { profile } = useAuthStore();
  const { getStats } = useProgressStore();
  const stats = getStats();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur-xl lg:hidden">
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="relative grid h-8 w-8 place-items-center rounded-xl border border-slate-700 bg-gradient-to-br from-sky-400/20 via-slate-900 to-rose-500/20 shadow-sm">
          <span className="text-sm">⚡</span>
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        </span>
        <span className="font-mono text-sm font-bold tracking-tight text-white">
          <span className="text-rose-500">Lara</span>
          <span className="text-sky-400">Quest</span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {/* Streak */}
        <span className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rose-400">
          <Flame size={12} className="fill-current" /> {stats.streak}d
        </span>

        {/* XP */}
        <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-amber-400">
          <Zap size={11} className="fill-current" /> {stats.xp}
        </span>

        {/* Profile Avatar */}
        <Link to="/profile" className="ml-1">
          <img
            src={profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=LaraQuest`}
            alt="Profile"
            className="h-7 w-7 rounded-full border border-slate-700 bg-slate-800 object-cover"
          />
        </Link>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { label: "Learn", path: "/dashboard", icon: GraduationCap },
    { label: "Roadmap", path: "/roadmap", icon: Map },
    { label: "Playground", path: "/playground", icon: Boxes },
    { label: "Profile", path: "/profile", icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch justify-around border-t border-slate-800 bg-slate-900/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === "/dashboard"
            ? location.pathname === "/dashboard" || location.pathname.startsWith("/lesson")
            : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors",
              isActive ? "text-white font-semibold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Icon size={18} className={isActive ? "text-sky-400" : "text-slate-400"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
