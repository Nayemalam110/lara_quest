import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { BackgroundFX } from "./BackgroundFX";
import { Sidebar } from "./Sidebar";
import { MobileTopBar, MobileBottomNav } from "./MobileNav";
import { Toast } from "../ui/Toast";
import { CommandPalette } from "../navigation/CommandPalette";
import { ConceptFlashcardsModal } from "../study/ConceptFlashcardsModal";
import { LessonNotesDrawer } from "../study/LessonNotesDrawer";
import { useStudyToolsStore } from "@/store/useStudyToolsStore";

export function Layout() {
  const {
    isSearchOpen,
    closeSearch,
    openSearch,
    isFlashcardsOpen,
    closeFlashcards,
    openFlashcards,
    isNotesOpen,
    closeNotes,
    activeLessonIdForNotes,
  } = useStudyToolsStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + K or Ctrl + K: Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isSearchOpen) closeSearch();
        else openSearch();
      }
      // Cmd + J or Ctrl + J: Flashcards
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        if (isFlashcardsOpen) closeFlashcards();
        else openFlashcards();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, isFlashcardsOpen, openSearch, closeSearch, openFlashcards, closeFlashcards]);

  return (
    <div className="relative min-h-screen font-display text-slate-100">
      {/* Dynamic atmospheric canvas */}
      <BackgroundFX />

      {/* Desktop fixed sidebar */}
      <Sidebar />

      {/* Mobile top bar */}
      <MobileTopBar />

      {/* Main app viewport */}
      <div className="relative z-10 lg:pl-[264px]">
        <main className="min-h-screen px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 pb-24 lg:pb-12 max-w-[1440px] mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation tabs */}
      <MobileBottomNav />

      {/* Study Modals & Tools */}
      <CommandPalette isOpen={isSearchOpen} onClose={closeSearch} />
      <ConceptFlashcardsModal isOpen={isFlashcardsOpen} onClose={closeFlashcards} />
      <LessonNotesDrawer
        isOpen={isNotesOpen}
        onClose={closeNotes}
        activeLessonId={activeLessonIdForNotes}
      />

      {/* Floating level up & XP toasts */}
      <Toast />
    </div>
  );
}
