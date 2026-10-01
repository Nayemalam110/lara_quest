"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProgressState {
  completedLessons: string[];
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  // Actions
  completeLesson: (lessonId: string, xpReward: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getModuleProgress: (moduleId: string, lessonIds: string[]) => number;
  getTotalCompletionPercent: (totalLessons: number) => number;
  updateStreak: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      xp: 0,
      streak: 3, // mock starting streak
      lastActiveDate: null,

      completeLesson: (lessonId, xpReward) => {
        const state = get();
        if (state.completedLessons.includes(lessonId)) return;
        set((s) => ({
          completedLessons: [...s.completedLessons, lessonId],
          xp: s.xp + xpReward,
        }));
        get().updateStreak();
      },

      isLessonCompleted: (lessonId) => {
        return get().completedLessons.includes(lessonId);
      },

      getModuleProgress: (moduleId, lessonIds) => {
        const completed = get().completedLessons;
        const moduleLessons = lessonIds.filter((id) => id.startsWith(moduleId.replace("module-", "lesson-").split("-")[0]) || true);
        const completedCount = lessonIds.filter((id) => completed.includes(id)).length;
        return lessonIds.length > 0 ? Math.round((completedCount / lessonIds.length) * 100) : 0;
      },

      getTotalCompletionPercent: (totalLessons) => {
        const completed = get().completedLessons.length;
        return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const last = get().lastActiveDate;
        if (last === today) return;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        set((s) => ({
          streak: last === yesterday ? s.streak + 1 : s.streak,
          lastActiveDate: today,
        }));
      },
    }),
    {
      name: "laraflutter-progress",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage)
      ),
    }
  )
);
