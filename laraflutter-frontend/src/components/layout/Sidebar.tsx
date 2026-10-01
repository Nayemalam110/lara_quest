"use client";
import { Flame, Zap, LayoutDashboard, BookOpen, Database, Trophy, Settings, ChevronRight } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { modules } from "@/data/mockData";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  currentView: "dashboard" | "lesson";
  onNavigateDashboard: () => void;
  className?: string;
}

const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

export function Sidebar({ currentView, onNavigateDashboard, className }: SidebarProps) {
  const { xp, streak, completedLessons } = useProgressStore();
  const percent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: currentView === "dashboard", onClick: onNavigateDashboard },
    { icon: BookOpen, label: "Lessons", active: currentView === "lesson", onClick: onNavigateDashboard },
    { icon: Database, label: "Playground", active: false, onClick: onNavigateDashboard },
    { icon: Trophy, label: "Achievements", active: false, onClick: () => {} },
  ];

  return (
    <aside className={cn(
      "w-60 flex flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur-xl",
      className
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-violet-600 to-red-600 flex items-center justify-center">
          <Image src="/logo.png" alt="LaraFlutter" width={36} height={36} className="object-cover" />
        </div>
        <div>
          <h1 className="text-base font-black text-white tracking-tight leading-none">
            Lara<span className="text-violet-400">Flutter</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-0.5">Backend for Mobile Devs</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="mx-3 mt-4 p-3 rounded-xl bg-gradient-to-br from-violet-600/10 to-purple-700/5 border border-violet-500/20">
        <p className="text-xs text-slate-400 mb-2">Your Progress</p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Flame size={12} className="text-orange-400" />
            <span className="text-orange-400 font-bold">{streak} day streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Zap size={12} className="text-amber-400" />
            <span className="text-amber-400 font-bold">{xp} XP</span>
          </div>
        </div>
        {/* Mini progress bar */}
        <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-1">{percent}% complete · {completedLessons.length}/{totalLessons} lessons</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium px-2 mb-2">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                item.active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <Icon size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.active && <ChevronRight size={13} className="text-violet-400" />}
            </button>
          );
        })}

        {/* Module quick links */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium px-2 mb-2">Modules</p>
          {modules.slice(0, 6).map((mod, idx) => {
            const completedCount = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
            const isComplete = completedCount === mod.lessons.length;
            return (
              <button
                key={mod.id}
                onClick={onNavigateDashboard}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all group"
              >
                <div className={cn(
                  "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold bg-gradient-to-br shrink-0",
                  isComplete ? "from-emerald-600 to-teal-600 text-white" : `${mod.color} opacity-80 text-white`
                )}>
                  {idx + 1}
                </div>
                <span className="truncate text-left leading-tight">{mod.title.split(" ").slice(0, 3).join(" ")}...</span>
                {isComplete && (
                  <span className="shrink-0 text-emerald-400 text-[10px]">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all">
          <Settings size={16} />
          Settings
        </button>
        <p className="text-[10px] text-slate-600 text-center mt-3">LaraFlutter v1.0 · Mock Data Mode</p>
      </div>
    </aside>
  );
}
