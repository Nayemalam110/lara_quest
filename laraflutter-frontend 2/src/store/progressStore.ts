import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  xp: number;
  streak: number;
  completedLessons: string[];
  completedChallenges: string[];
  /** ISO date (YYYY-MM-DD) of the last completed daily task. null = today not done. */
  lastTaskDate: string | null;
  completeChallenge: (lessonId: string, xp: number) => void;
  completeLesson: (lessonId: string, xp: number) => void;
  reset: () => void;
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

const INITIAL = {
  xp: 180,
  streak: 4,
  completedLessons: [] as string[],
  completedChallenges: [] as string[],
  lastTaskDate: null as string | null,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      completeChallenge: (lessonId, xp) => {
        const s = get();
        if (s.completedChallenges.includes(lessonId)) return;
        const today = todayKey();
        set({
          completedChallenges: [...s.completedChallenges, lessonId],
          xp: s.xp + xp,
          streak: s.lastTaskDate === today ? s.streak : s.streak + 1,
          lastTaskDate: today,
        });
      },
      completeLesson: (lessonId, xp) => {
        const s = get();
        if (s.completedLessons.includes(lessonId)) return;
        const today = todayKey();
        set({
          completedLessons: [...s.completedLessons, lessonId],
          xp: s.xp + xp,
          streak: s.lastTaskDate === today ? s.streak : s.streak + 1,
          lastTaskDate: today,
        });
      },
      reset: () => set({ ...INITIAL, streak: 4, xp: 180, lastTaskDate: null }),
    }),
    { name: "laraflutter-progress" }
  )
);

export function useDailyTaskDone(): boolean {
  return useProgress((s) => s.lastTaskDate) === todayKey();
}
