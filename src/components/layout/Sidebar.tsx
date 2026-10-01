import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Boxes,
  Map,
  Trophy,
  Flame,
  Zap,
  LogOut,
  ChevronRight,
  Search,
  Brain,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { modules, moduleProgress } from "@/data/mockData";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";
import { useStudyToolsStore } from "@/store/useStudyToolsStore";

export function Sidebar() {
  const navigate = useNavigate();
  const { user, profile, logout, isDemoMode } = useAuthStore();
  const { getStats } = useProgressStore();
  const { openSearch, openFlashcards, openNotes } = useStudyToolsStore();
  const stats = getStats();
  const masteredCardsCount = Object.values(stats.flashcardMastery || {}).filter(
    (v) => v === "mastered"
  ).length;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Learn", path: "/dashboard", icon: GraduationCap },
    { label: "Roadmap", path: "/roadmap", icon: Map },
    { label: "Schema Playground", path: "/playground", icon: Boxes },
    { label: "Profile & Badges", path: "/profile", icon: Trophy },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[264px] flex-col border-r border-slate-800/80 bg-[#0e1424]/95 p-4 backdrop-blur-xl lg:flex shadow-2xl">
      {/* Brand Header */}
      <Link to="/dashboard" className="px-1.5 pb-3 pt-1.5 flex items-center gap-3 group">
        <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-500/25 via-slate-900 to-rose-500/25 shadow-md shadow-sky-500/10 transition-transform group-hover:scale-105">
          <span className="text-lg">⚡</span>
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        </span>
        <div>
          <span className="font-display text-[17px] font-bold tracking-tight text-white block leading-none">
            <span className="text-rose-500">Lara</span>
            <span className="text-sky-400">Quest</span>
          </span>
          <span className="text-[10.5px] text-slate-400 font-mono tracking-wider uppercase font-semibold">
            Laravel for Flutter
          </span>
        </div>
      </Link>

      {/* Quick Search Button */}
      <button
        onClick={openSearch}
        className="mb-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-400 shadow-sm transition hover:border-sky-500/40 hover:bg-slate-800 hover:text-slate-200"
      >
        <span className="flex items-center gap-2">
          <Search size={14} className="text-sky-400" />
          <span>Quick Search...</span>
        </span>
        <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
          ⌘K
        </kbd>
      </button>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1.5">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all",
                  isActive
                    ? "border border-sky-500/30 bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-transparent text-white shadow-sm font-semibold"
                    : "border border-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    className={isActive ? "text-sky-400" : "text-slate-400"}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-sky-400" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Study & Retention Tools */}
      <div className="mt-4 flex flex-col gap-1 border-t border-slate-800/80 pt-3">
        <span className="px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
          Retention Tools
        </span>
        <button
          onClick={openFlashcards}
          className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
        >
          <span className="flex items-center gap-2.5">
            <Brain size={16} className="text-indigo-400" />
            <span>Concept Cards</span>
          </span>
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-300">
            {masteredCardsCount}/12
          </span>
        </button>

        <button
          onClick={() => openNotes()}
          className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
        >
          <span className="flex items-center gap-2.5">
            <Bookmark size={16} className="text-amber-400" />
            <span>Study Notebook</span>
          </span>
          {stats.bookmarkedLessonIds.length > 0 && (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
              {stats.bookmarkedLessonIds.length}
            </span>
          )}
        </button>
      </div>

      {/* Track Progress (Modules List) */}
      <div className="mt-6 px-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-400 font-semibold flex items-center justify-between">
        <span>Curriculum Progress</span>
        <span className="text-slate-500 text-[10px]">
          {stats.completedCount}/{stats.totalLessons}
        </span>
      </div>

      <div className="mt-2.5 flex flex-col gap-1 overflow-y-auto pr-1">
        {modules.map((m) => {
          const completedLessonIds = (stats.completedLessonIds || []).map(String);
          const p = moduleProgress(m, completedLessonIds);
          const isDone = p.done === p.total && p.total > 0;

          return (
            <Link
              key={m.id}
              to="/roadmap"
              className="group rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background: m.color,
                    boxShadow: isDone ? `0 0 8px ${m.color}` : undefined,
                    opacity: isDone ? 1 : 0.6,
                  }}
                />
                <span className="truncate text-[12px] text-slate-300 font-medium transition-colors group-hover:text-white">
                  {String(m.index || 1).padStart(2, "0")} · {m.tagline || m.title}
                </span>
                <span className="ml-auto shrink-0 font-mono text-[10.5px] text-slate-400">
                  {p.done}/{p.total}
                </span>
              </div>
              <div className="ml-4 mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${p.pct}%`,
                    background: m.color,
                    boxShadow: p.pct > 0 ? `0 0 8px ${m.color}88` : undefined,
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer User Info & Streak */}
      <div className="mt-auto flex flex-col gap-2.5 border-t border-slate-800/80 pt-3.5">
        {/* Streak & XP Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-500/15 via-slate-900/60 to-transparent p-3 shadow-sm">
          <div className="relative">
            <Flame size={24} className="text-rose-500 fill-current" />
          </div>
          <div>
            <div className="text-[13px] font-bold leading-tight text-white">
              {stats.streak}-day streak
            </div>
            <div className="text-[10.5px] text-slate-400">1 task daily to hold</div>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-amber-400">
            <Zap size={11} className="fill-current" /> {stats.xp}
          </span>
        </div>

        {/* User Profile Bar */}
        <div className="flex items-center justify-between rounded-xl px-2 py-1.5 hover:bg-slate-800/40 transition-colors">
          <Link to="/profile" className="flex items-center gap-2.5 group min-w-0">
            <img
              src={profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=LaraQuest`}
              alt="Avatar"
              className="h-7 w-7 rounded-full border border-slate-700 bg-slate-900 object-cover shrink-0"
            />
            <div className="truncate text-left">
              <div className="truncate text-xs font-semibold text-white group-hover:text-sky-400 transition-colors">
                {profile?.displayName || user?.email?.split("@")[0] || "Artisan"}
              </div>
              <div className="text-[10px] text-sky-400/90 font-mono">
                {isDemoMode ? "Demo Mode" : "Supabase Connected"}
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/15 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
