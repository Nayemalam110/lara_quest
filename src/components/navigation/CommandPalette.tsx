import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  ArrowRight,
  Terminal,
  Database,
  Send,
  Bug,
  Layers,
  Sparkles,
  Command,
  X,
  Code2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INITIAL_MODULES } from "@/lib/constants";
import { useProgressStore } from "@/store/useProgressStore";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterCategory = "all" | "lessons" | "bridges" | "tools";

interface SearchResultItem {
  id: string;
  type: "lesson" | "bridge" | "tool";
  title: string;
  subtitle: string;
  category: string;
  path: string;
  icon: any;
  xp?: number;
  highlightText?: string;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { getStats } = useProgressStore();
  const { completedLessonIds } = getStats();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Index all search items across modules, lessons, and bridges
  const allItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // Tools entries
    items.push({
      id: "tool-playground",
      type: "tool",
      title: "Interactive Relational Schema Playground",
      subtitle: "Drag-and-drop visual database canvas with PK/FK cables",
      category: "Interactive Tools",
      path: "/playground",
      icon: Database,
    });
    items.push({
      id: "tool-artisan",
      type: "tool",
      title: "Artisan CLI Terminal Shell",
      subtitle: "Interactive PHP 8 bash terminal with route:list and make:model",
      category: "Interactive Tools",
      path: "/lesson/m7l1",
      icon: Terminal,
      xp: 35,
    });
    items.push({
      id: "tool-migration",
      type: "tool",
      title: "Visual Migration Builder",
      subtitle: "Design tables and generate Laravel Blueprint PHP in real-time",
      category: "Interactive Tools",
      path: "/lesson/m4l1",
      icon: Layers,
      xp: 35,
    });
    items.push({
      id: "tool-api",
      type: "tool",
      title: "API Request / Response Simulator",
      subtitle: "Postman-style HTTP client with Bearer auth and 201 Created inspector",
      category: "Interactive Tools",
      path: "/lesson/m8l1",
      icon: Send,
      xp: 35,
    });
    items.push({
      id: "tool-sql",
      type: "tool",
      title: "SQL Query Writer & SQLite Engine",
      subtitle: "Write live SQL queries with instant result table execution",
      category: "Interactive Tools",
      path: "/lesson/m1l1",
      icon: Database,
      xp: 35,
    });
    items.push({
      id: "tool-debugger",
      type: "tool",
      title: "Production Stack Trace Debugger",
      subtitle: "Diagnose Laravel logs and apply unified code diff fixes",
      category: "Interactive Tools",
      path: "/lesson/m6l3",
      icon: Bug,
      xp: 35,
    });

    // Modules and Lessons
    INITIAL_MODULES.forEach((mod) => {
      (mod.lessons || []).forEach((les) => {
        // Lesson item
        items.push({
          id: `lesson-${les.id}`,
          type: "lesson",
          title: les.title,
          subtitle: `${mod.title} • ${les.readTime}`,
          category: `Module ${mod.id?.toString().toUpperCase() || ""}`,
          path: `/lesson/${les.id}`,
          icon: BookOpen,
          xp: les.xp,
          highlightText: les.summary,
        });

        // Flutter parallel item if available
        if (les.flutterParallel) {
          items.push({
            id: `bridge-${les.id}`,
            type: "bridge",
            title: les.flutterParallel.concept,
            subtitle: `Dart: ${les.flutterParallel.flutterFile || "lib/"} ↔ Laravel: ${les.flutterParallel.laravelFile || "app/"}`,
            category: "Flutter ↔ Laravel Bridge",
            path: `/lesson/${les.id}`,
            icon: Code2,
            highlightText: les.flutterParallel.explanation,
          });
        }
      });
    });

    return items;
  }, []);

  // Filter based on search query and category
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter((item) => {
      // Category filter
      if (activeCategory === "lessons" && item.type !== "lesson") return false;
      if (activeCategory === "bridges" && item.type !== "bridge") return false;
      if (activeCategory === "tools" && item.type !== "tool") return false;

      // Query filter
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.highlightText && item.highlightText.toLowerCase().includes(q))
      );
    });
  }, [allItems, query, activeCategory]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    navigate(item.path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl animate-in zoom-in-95 duration-150"
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search lessons, Flutter ↔ Laravel concepts, SQL, Sanctum, N+1..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 border-b border-slate-800/80 bg-slate-900/40 px-4 py-2 text-xs">
          {(
            [
              { id: "all", label: "All Results" },
              { id: "lessons", label: "Lessons (65)" },
              { id: "bridges", label: "Dart ↔ PHP Bridges" },
              { id: "tools", label: "Interactive Tools (5)" },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={cn(
                "rounded-md px-2.5 py-1 transition font-medium text-xs",
                activeCategory === cat.id
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-800/40"
        >
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              <Search className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p>No results found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for "Sanctum", "Dio", "Migrations", or "N+1"
              </p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              const isLessonCompleted =
                item.type === "lesson" && completedLessonIds.includes(item.id.replace("lesson-", ""));

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-xs transition cursor-pointer",
                    isSelected
                      ? "bg-gradient-to-r from-sky-500/15 to-indigo-500/10 text-white border border-sky-500/30"
                      : "text-slate-300 hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                        item.type === "tool"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : item.type === "bridge"
                          ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                          : "border-sky-500/30 bg-sky-500/10 text-sky-400"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 truncate">
                          {item.title}
                        </span>
                        {isLessonCompleted && (
                          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400">
                            ✓ Solved
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 truncate text-[11px]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.xp && (
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                        +{item.xp} XP
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-mono text-slate-500 hidden sm:inline">
                      {item.category}
                    </span>
                    <ArrowRight
                      className={cn(
                        "h-3.5 w-3.5 transition",
                        isSelected ? "text-sky-400 translate-x-0.5" : "text-slate-600"
                      )}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-4 py-2.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 mr-1">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span>
              <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 mr-1">
                ↵
              </kbd>
              Select
            </span>
          </div>
          <span className="text-slate-400">
            {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"}
          </span>
        </div>
      </div>
    </div>
  );
}
