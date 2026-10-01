"use client";
import { useState, useCallback } from "react";
import { modules, type Lesson, type Module } from "@/data/mockData";
import { Dashboard } from "./dashboard/Dashboard";
import { LessonView } from "./lesson/LessonView";
import { Sidebar } from "./layout/Sidebar";
import { MobileNav } from "./layout/MobileNav";

type View = "dashboard" | "lesson";

interface ActiveLesson {
  lesson: Lesson;
  module: Module;
}

export function AppShell() {
  const [view, setView] = useState<View>("dashboard");
  const [active, setActive] = useState<ActiveLesson | null>(null);

  const handleSelectLesson = useCallback((lessonId: string) => {
    let found: ActiveLesson | null = null;
    for (const mod of modules) {
      const lesson = mod.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        found = { lesson, module: mod };
        break;
      }
    }
    if (found) {
      setActive(found);
      setView("lesson");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleNavigateDashboard = useCallback(() => {
    setView("dashboard");
    setActive(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar — hidden on mobile */}
      <Sidebar
        currentView={view}
        onNavigateDashboard={handleNavigateDashboard}
        className="hidden lg:flex shrink-0 sticky top-0 h-screen overflow-y-auto"
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <MobileNav
          currentView={view}
          onNavigateDashboard={handleNavigateDashboard}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {view === "dashboard" && (
            <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
              <Dashboard onSelectLesson={handleSelectLesson} />
            </div>
          )}

          {view === "lesson" && active && (
            <LessonView
              lesson={active.lesson}
              module={active.module}
              onBack={handleNavigateDashboard}
              onNavigate={handleSelectLesson}
            />
          )}
        </main>
      </div>
    </div>
  );
}
