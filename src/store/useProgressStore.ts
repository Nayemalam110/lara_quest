// ==============================================================================
// 🏆 Progress & Gamification Store (Zustand)
// Manages XP, Streaks, Levels, Modules, Lessons & Badges
// ==============================================================================

import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { INITIAL_MODULES, ACHIEVEMENTS, calculateLevel } from '@/lib/constants';
import { useAuthStore } from './useAuthStore';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'],
    });
  } catch (e) {
    // Graceful fallback if canvas is not ready
  }
};

export interface ProgressNotification {
  type: 'level_up' | 'xp' | 'achievement';
  title: string;
  message: string;
}

export interface ProgressStoreState {
  modules: typeof INITIAL_MODULES;
  achievements: typeof ACHIEVEMENTS;
  recentNotification: ProgressNotification | null;
  getStats: () => {
    xp: number;
    streak: number;
    levelInfo: any;
    completedLessonIds: (string | number)[];
    unlockedModuleIds: (string | number)[];
    earnedAchievementKeys: string[];
    totalLessons: number;
    completedCount: number;
    overallProgressPercent: number;
    streakFreezes: number;
  };
  addXp: (amount: number, reason?: string) => void;
  completeLesson: (moduleId: string | number, lessonId: string | number, xpReward?: number) => void;
  clearNotification: () => void;
}

export const useProgressStore = create<ProgressStoreState>((set, get) => ({
  modules: INITIAL_MODULES,
  achievements: ACHIEVEMENTS,
  recentNotification: null,

  // Get active user's stats
  getStats: () => {
    const profile = useAuthStore.getState().profile;
    const xp = profile?.totalXp || 0;
    const streak = profile?.currentStreak || 0;
    const levelInfo = calculateLevel(xp);
    const completedLessonIds = profile?.completedLessonIds || [];
    const unlockedModuleIds = profile?.unlockedModuleIds || [1];
    const earnedAchievementKeys = profile?.earnedAchievementKeys || [];

    // Calculate total completed lessons count
    const totalLessons = INITIAL_MODULES.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    const completedCount = completedLessonIds.length;
    const overallProgressPercent = Math.round((completedCount / (totalLessons || 1)) * 100);

    return {
      xp,
      streak,
      levelInfo,
      completedLessonIds,
      unlockedModuleIds,
      earnedAchievementKeys,
      totalLessons,
      completedCount,
      overallProgressPercent,
      streakFreezes: profile?.streakFreezes ?? 1,
    };
  },

  // Award XP with visual feedback
  addXp: (amount: number, reason = 'Lesson completed') => {
    const authState = useAuthStore.getState();
    const profile = authState.profile;
    if (!profile) return;

    const oldXp = profile.totalXp || 0;
    const newXp = oldXp + amount;
    const oldLevel = calculateLevel(oldXp);
    const newLevel = calculateLevel(newXp);

    const updatedProfile = {
      ...profile,
      totalXp: newXp,
      currentLevel: newLevel.level,
    };

    authState.updateProfile(updatedProfile);

    // If leveled up, trigger celebration!
    if (newLevel.level > oldLevel.level) {
      triggerConfetti();
      set({
        recentNotification: {
          type: 'level_up',
          title: `Leveled Up! 🎉`,
          message: `You reached Level ${newLevel.level}: ${newLevel.name}!`,
        },
      });
    } else {
      set({
        recentNotification: {
          type: 'xp',
          title: `+${amount} XP`,
          message: reason,
        },
      });
    }

    setTimeout(() => {
      set({ recentNotification: null });
    }, 4000);
  },

  // Complete a lesson
  completeLesson: (moduleId: string | number, lessonId: string | number, xpReward = 25) => {
    const authState = useAuthStore.getState();
    const profile = authState.profile;
    if (!profile) return;

    const completedLessonIds = new Set(profile.completedLessonIds || []);
    const wasAlreadyCompleted = completedLessonIds.has(lessonId);

    if (!wasAlreadyCompleted) {
      completedLessonIds.add(lessonId);

      // Check if this module is now fully finished
      const targetModule = INITIAL_MODULES.find((m) => m.id === moduleId);
      const unlockedModuleIds = new Set(profile.unlockedModuleIds || [1]);

      if (targetModule) {
        const allModuleLessonsDone = targetModule.lessons.every((l) =>
          completedLessonIds.has(l.id)
        );

        if (allModuleLessonsDone) {
          // Unlock the next module!
          const nextModule = INITIAL_MODULES.find((m) => m.orderIndex === targetModule.orderIndex + 1);
          if (nextModule) {
            unlockedModuleIds.add(nextModule.id);
          }
          triggerConfetti();
        }
      }

      const updatedProfile = {
        ...profile,
        completedLessonIds: Array.from(completedLessonIds),
        unlockedModuleIds: Array.from(unlockedModuleIds),
        lastActivityDate: new Date().toISOString().split('T')[0],
      };

      authState.updateProfile(updatedProfile);
      get().addXp(xpReward, `Completed lesson: ${lessonId}`);
    }
  },

  // Clear notification toast
  clearNotification: () => set({ recentNotification: null }),
}));
