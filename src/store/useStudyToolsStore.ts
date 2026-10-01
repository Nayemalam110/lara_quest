import { create } from "zustand";

interface StudyToolsState {
  isSearchOpen: boolean;
  isFlashcardsOpen: boolean;
  isNotesOpen: boolean;
  activeLessonIdForNotes?: string;
  openSearch: () => void;
  closeSearch: () => void;
  openFlashcards: () => void;
  closeFlashcards: () => void;
  openNotes: (lessonId?: string) => void;
  closeNotes: () => void;
}

export const useStudyToolsStore = create<StudyToolsState>((set) => ({
  isSearchOpen: false,
  isFlashcardsOpen: false,
  isNotesOpen: false,
  activeLessonIdForNotes: undefined,

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  openFlashcards: () => set({ isFlashcardsOpen: true }),
  closeFlashcards: () => set({ isFlashcardsOpen: false }),

  openNotes: (lessonId) =>
    set({ isNotesOpen: true, activeLessonIdForNotes: lessonId }),
  closeNotes: () =>
    set({ isNotesOpen: false, activeLessonIdForNotes: undefined }),
}));
