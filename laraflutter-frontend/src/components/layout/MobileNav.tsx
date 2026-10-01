"use client";
import { Flame, Zap, Menu, X, LayoutDashboard, BookOpen, Database } from "lucide-react";
import { useState } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onNavigateDashboard: () => void;
  currentView: "dashboard" | "lesson";
}

export function MobileNav({ onNavigateDashboard, currentView }: MobileNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { xp, streak } = useProgressStore();

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl lg:hidden">
        {/* Logo */}
        <button onClick={onNavigateDashboard} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-red-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">LF</span>
          </div>
          <span className="font-black text-white text-base">
            Lara<span className="text-violet-400">Flutter</span>
          </span>
        </button>

        {/* Stats + menu */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-orange-400">
            <Flame size={13} strokeWidth={2.5} />
            <span className="font-bold">{streak}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <Zap size={13} strokeWidth={2.5} />
            <span className="font-bold">{xp}</span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden fixed top-[57px] left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-4 shadow-2xl">
          <div className="space-y-1">
            {[
              { icon: LayoutDashboard, label: "Dashboard", onClick: () => { onNavigateDashboard(); setMenuOpen(false); } },
              { icon: BookOpen, label: "Lessons", onClick: () => { onNavigateDashboard(); setMenuOpen(false); } },
              { icon: Database, label: "Playground", onClick: () => { onNavigateDashboard(); setMenuOpen(false); } },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
