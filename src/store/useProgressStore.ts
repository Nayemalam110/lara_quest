// ==============================================================================
// 🏆 Progress & Gamification Store (Zustand)
// Manages XP, Streaks, Levels, Modules, Lessons, Cloud Sync & Badges
// ==============================================================================

import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { INITIAL_MODULES, ACHIEVEMENTS, calculateLevel } from '@/lib/constants';
import { useAuthStore } from './useAuthStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
    completedLessonIds: string[];
    unlockedModuleIds: (string | number)[];
    earnedAchievementKeys: string[];
    totalLessons: number;
    completedCount: number;
    overallProgressPercent: number;
    streakFreezes: number;
    bookmarkedLessonIds: string[];
    lessonNotes: Record<string, string>;
    flashcardMastery: Record<string, 'learning' | 'mastered'>;
  };
  addXp: (amount: number, reason?: string) => void;
  completeLesson: (moduleId: string | number, lessonId: string | number, xpReward?: number) => void;
  toggleBookmark: (lessonId: string) => void;
  saveLessonNote: (lessonId: string, note: string) => void;
  rateFlashcard: (cardId: string, isMastered: boolean) => void;
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
    const completedLessonIds = (profile?.completedLessonIds || []).map(String);
    const unlockedModuleIds = profile?.unlockedModuleIds || ['m1'];
    const earnedAchievementKeys = profile?.earnedAchievementKeys || ['first_steps'];
    const bookmarkedLessonIds = profile?.bookmarkedLessonIds || [];
    const lessonNotes = profile?.lessonNotes || {};
    const flashcardMastery = profile?.flashcardMastery || {};

    // Calculate total completed lessons count across modules
    const totalLessons = INITIAL_MODULES.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    const completedCount = completedLessonIds.length;
    const overallProgressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

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
      bookmarkedLessonIds,
      lessonNotes,
      flashcardMastery,
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

  // Complete a lesson & Sync with Cloud + Local Storage
  completeLesson: (moduleId: string | number, lessonId: string | number, xpReward = 25) => {
    const authState = useAuthStore.getState();
    const profile = authState.profile;
    if (!profile) return;

    const lessonIdStr = String(lessonId);
    const completedLessonIds = new Set((profile.completedLessonIds || []).map(String));
    const wasAlreadyCompleted = completedLessonIds.has(lessonIdStr);

    if (!wasAlreadyCompleted) {
      completedLessonIds.add(lessonIdStr);

      // Check if target module is now finished
      const modIdStr = String(moduleId);
      const targetModule = INITIAL_MODULES.find((m) => String(m.id) === modIdStr);
      const unlockedModuleIds = new Set((profile.unlockedModuleIds || ['m1']).map(String));

      let moduleCompleted = false;
      if (targetModule && targetModule.lessons) {
        const allModuleLessonsDone = targetModule.lessons.every((l) =>
          completedLessonIds.has(String(l.id))
        );

        if (allModuleLessonsDone) {
          moduleCompleted = true;
          // Unlock the next module!
          const nextModule = INITIAL_MODULES.find(
            (m) => m.orderIndex === targetModule.orderIndex + 1
          );
          if (nextModule) {
            unlockedModuleIds.add(String(nextModule.id));
          }
          triggerConfetti();
        }
      }

      // Check achievement triggers
      const earnedAchievements = new Set(profile.earnedAchievementKeys || ['first_steps']);
      if (completedLessonIds.size >= 1) earnedAchievements.add('first_steps');
      if (completedLessonIds.size >= 3) earnedAchievements.add('quick_learner');
      if (lessonIdStr === 'm4l1') earnedAchievements.add('db_architect');
      if (lessonIdStr === 'm6l3') earnedAchievements.add('query_ninja');
      if (lessonIdStr === 'm8l1') earnedAchievements.add('api_builder');

      const todayStr = new Date().toISOString().split('T')[0];

      // Calculate streak locally as well
      let currentStreak = profile.currentStreak || 0;
      let longestStreak = profile.longestStreak || 0;
      if (profile.lastActivityDate !== todayStr) {
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      }

      const updatedProfile = {
        ...profile,
        completedLessonIds: Array.from(completedLessonIds),
        unlockedModuleIds: Array.from(unlockedModuleIds),
        earnedAchievementKeys: Array.from(earnedAchievements),
        lastActivityDate: todayStr,
        currentStreak,
        longestStreak,
      };

      // 1. Update Auth Store & LocalStorage / Supabase Profile
      authState.updateProfile(updatedProfile);

      // 2. Award XP
      get().addXp(xpReward, `Completed lesson: ${lessonIdStr}`);

      // 3. Persist to Supabase if live user
      if (isSupabaseConfigured && supabase && !authState.isDemoMode && authState.user) {
        try {
          // Sync module progress
          const completedCount = targetModule?.lessons
            ? targetModule.lessons.filter((l) => completedLessonIds.has(String(l.id))).length
            : 1;

          supabase
            .from('user_module_progress')
            .upsert(
              {
                user_id: authState.user.id,
                module_id: modIdStr,
                lessons_completed: completedCount,
                is_unlocked: true,
                is_completed: moduleCompleted,
                completed_at: moduleCompleted ? new Date().toISOString() : null,
              },
              { onConflict: 'user_id,module_id' }
            )
            .then(() => {});

          // Call RPC record_activity if present
          supabase.rpc('record_activity', { p_user_id: authState.user.id }).catch(() => {});
        } catch (e) {
          console.warn('[LaraQuest] Supabase progress sync notice:', e);
        }
      }
    }
  },

  // Toggle lesson bookmark
  toggleBookmark: (lessonId: string) => {
    const authState = useAuthStore.getState();
    const profile = authState.profile;
    if (!profile) return;

    const current = new Set(profile.bookmarkedLessonIds || []);
    let added = false;
    if (current.has(lessonId)) {
      current.delete(lessonId);
    } else {
      current.add(lessonId);
      added = true;
    }

    authState.updateProfile({
      bookmarkedLessonIds: Array.from(current),
    });

    if (added) {
      set({
        recentNotification: {
          type: 'xp',
          title: 'Lesson Bookmarked ⭐️',
          message: 'Saved to your Study Notebook',
        },
      });
      setTimeout(() => set({ recentNotification: null }), 2500);
    }
  },

  // Save personal study note for a lesson
  saveLessonNote: (lessonId: string, note: string) => {
    const authState = useAuthStore.getState();
    const profile = authState.profile;
    if (!profile) return;

    const currentNotes = { ...(profile.lessonNotes || {}) };
    if (!note.trim()) {
      delete currentNotes[lessonId];
    } else {
      currentNotes[lessonId] = note.trim();
    }

    authState.updateProfile({
      lessonNotes: currentNotes,
    });
  },

  // Rate a concept flashcard (spaced repetition)
  rateFlashcard: (cardId: string, isMastered: boolean) => {
    const authState = useAuthStore.getState();
    const profile = authState.profile;
    if (!profile) return;

    const current = { ...(profile.flashcardMastery || {}) };
    current[cardId] = isMastered ? 'mastered' : 'learning';

    authState.updateProfile({
      flashcardMastery: current,
    });

    if (isMastered) {
      get().addXp(15, 'Mastered Concept Flashcard 🧠');
    }
  },

  // Clear notification toast
  clearNotification: () => set({ recentNotification: null }),
}));
