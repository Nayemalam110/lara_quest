// ==============================================================================
// 🔐 Auth Store (Zustand)
// Handles Supabase Auth with Realtime Sync or Local Demo Mode seamlessly
// ==============================================================================

import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  getStoredAuth,
  setStoredAuth,
  DEFAULT_MOCK_USER,
  getStoredUserData,
  saveStoredUserData
} from '@/lib/mockData';

export interface UserSession {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  user_metadata?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName: string;
  avatarUrl?: string;
  role: string;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  streakFreezes: number;
  completedLessonIds: string[];
  unlockedModuleIds: (string | number)[];
  earnedAchievementKeys: string[];
  bookmarkedLessonIds?: string[];
  lessonNotes?: Record<string, string>;
  flashcardMastery?: Record<string, 'learning' | 'mastered'>;
}

export interface AuthState {
  user: UserSession | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  loginAsDemoUser: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

// Convert Supabase database row (snake_case) to client UserProfile (camelCase)
export function normalizeProfile(dbRow: any, userSession?: UserSession | null): UserProfile {
  const localCached = userSession ? getStoredUserData(userSession.id) : null;
  return {
    id: dbRow?.id || userSession?.id || DEFAULT_MOCK_USER.id,
    email: userSession?.email || dbRow?.email || localCached?.email || DEFAULT_MOCK_USER.email,
    displayName:
      dbRow?.display_name ||
      userSession?.displayName ||
      userSession?.user_metadata?.display_name ||
      localCached?.displayName ||
      DEFAULT_MOCK_USER.displayName,
    avatarUrl:
      dbRow?.avatar_url ||
      userSession?.avatarUrl ||
      userSession?.user_metadata?.avatar_url ||
      localCached?.avatarUrl ||
      DEFAULT_MOCK_USER.avatarUrl,
    role: dbRow?.role || localCached?.role || 'flutter_dev',
    totalXp: dbRow?.total_xp ?? localCached?.totalXp ?? DEFAULT_MOCK_USER.totalXp,
    currentLevel: dbRow?.current_level ?? localCached?.currentLevel ?? DEFAULT_MOCK_USER.currentLevel,
    currentStreak: dbRow?.current_streak ?? localCached?.currentStreak ?? DEFAULT_MOCK_USER.currentStreak,
    longestStreak: dbRow?.longest_streak ?? localCached?.longestStreak ?? DEFAULT_MOCK_USER.longestStreak,
    lastActivityDate: dbRow?.last_activity_date || localCached?.lastActivityDate,
    streakFreezes: dbRow?.streak_freezes ?? localCached?.streakFreezes ?? 1,
    completedLessonIds: dbRow?.completed_lesson_ids || localCached?.completedLessonIds || [],
    unlockedModuleIds: dbRow?.unlocked_module_ids || localCached?.unlockedModuleIds || ['m1'],
    earnedAchievementKeys: dbRow?.earned_achievement_keys || localCached?.earnedAchievementKeys || ['first_steps'],
    bookmarkedLessonIds: dbRow?.bookmarked_lesson_ids || localCached?.bookmarkedLessonIds || [],
    lessonNotes: dbRow?.lesson_notes || localCached?.lessonNotes || {},
    flashcardMastery: dbRow?.flashcard_mastery || localCached?.flashcardMastery || {},
  };
}

let realtimeChannel: any = null;

function subscribeToProfileChanges(userId: string, setProfile: (p: UserProfile) => void) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }

    realtimeChannel = supabase
      .channel(`profile-realtime-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            const updated = normalizeProfile(payload.new);
            setProfile(updated);
          }
        }
      )
      .subscribe();
  } catch (err) {
    console.warn('[LaraQuest] Realtime subscription notice:', err);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isDemoMode: !isSupabaseConfigured,
  error: null,

  // Initialize session on mount
  initAuth: async () => {
    set({ isLoading: true, error: null });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userSession: UserSession = {
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.display_name,
            avatarUrl: session.user.user_metadata?.avatar_url,
          };

          const { data: dbProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const clientProfile = normalizeProfile(dbProfile, userSession);

          // Setup real-time listener
          subscribeToProfileChanges(session.user.id, (p) => set({ profile: p }));

          set({
            user: userSession,
            profile: clientProfile,
            isLoading: false,
            isDemoMode: false,
          });

          // Also listen for auth state changes
          supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (event === 'SIGNED_OUT' || !newSession) {
              set({ user: null, profile: null, isDemoMode: false });
            } else if (newSession.user && newSession.user.id !== get().user?.id) {
              const u: UserSession = {
                id: newSession.user.id,
                email: newSession.user.email,
                displayName: newSession.user.user_metadata?.display_name,
                avatarUrl: newSession.user.user_metadata?.avatar_url,
              };
              const { data: p } = await supabase.from('profiles').select('*').eq('id', u.id).single();
              set({ user: u, profile: normalizeProfile(p, u), isDemoMode: false });
            }
          });

          return;
        }
      } catch (err) {
        console.warn('[LaraQuest] Supabase session check notice:', err);
      }
    }

    // Fallback: Check local storage demo session
    const localUser = getStoredAuth();
    if (localUser) {
      const fullProfile = getStoredUserData(localUser.id);
      set({
        user: localUser,
        profile: fullProfile,
        isLoading: false,
        isDemoMode: true,
      });
    } else {
      // Default guest mock user
      set({
        user: null,
        profile: null,
        isLoading: false,
        isDemoMode: true,
      });
    }
  },

  // Login with Email & Password
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const userSession: UserSession = {
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.user_metadata?.display_name,
          avatarUrl: data.user.user_metadata?.avatar_url,
        };

        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const clientProfile = normalizeProfile(dbProfile, userSession);
        subscribeToProfileChanges(data.user.id, (p) => set({ profile: p }));

        set({
          user: userSession,
          profile: clientProfile,
          isLoading: false,
          isDemoMode: false,
          error: null,
        });
        return { success: true };
      } catch (err: any) {
        set({ error: err.message || 'Login failed', isLoading: false });
        return { success: false, error: err.message };
      }
    }

    // Local Demo Login
    await new Promise((r) => setTimeout(r, 300));
    const demoUser = {
      id: 'demo-user-' + email.replace(/[^a-zA-Z0-9]/g, ''),
      email,
      displayName: email.split('@')[0] || 'Flutter Explorer',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}&backgroundColor=6366f1`,
    };

    const profile = getStoredUserData(demoUser.id);
    profile.displayName = demoUser.displayName;
    profile.avatarUrl = demoUser.avatarUrl;
    profile.email = email;
    saveStoredUserData(demoUser.id, profile);

    setStoredAuth(demoUser);
    set({
      user: demoUser,
      profile,
      isLoading: false,
      isDemoMode: true,
      error: null,
    });

    return { success: true };
  },

  // Register with Email & Password
  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}&backgroundColor=6366f1`,
            },
          },
        });

        if (error) throw error;

        if (data?.user && data.session) {
          const userSession: UserSession = {
            id: data.user.id,
            email: data.user.email,
            displayName: displayName,
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}&backgroundColor=6366f1`,
          };

          const initialProfile = normalizeProfile(
            {
              id: data.user.id,
              display_name: displayName,
              total_xp: 50,
              current_level: 1,
            },
            userSession
          );

          subscribeToProfileChanges(data.user.id, (p) => set({ profile: p }));

          set({
            user: userSession,
            profile: initialProfile,
            isLoading: false,
            isDemoMode: false,
            error: null,
          });
          return { success: true };
        } else {
          set({ isLoading: false });
          return {
            success: true,
            message: 'Registration successful! Please check your email to confirm your account.',
          };
        }
      } catch (err: any) {
        set({ error: err.message || 'Registration failed', isLoading: false });
        return { success: false, error: err.message };
      }
    }

    // Local Demo Registration
    await new Promise((r) => setTimeout(r, 300));
    const demoUser = {
      id: 'demo-user-' + Math.random().toString(36).substring(2, 9),
      email,
      displayName: displayName || email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName || email}&backgroundColor=6366f1`,
    };

    const initialProfile: UserProfile = {
      ...DEFAULT_MOCK_USER,
      id: demoUser.id,
      email,
      displayName: demoUser.displayName,
      avatarUrl: demoUser.avatarUrl,
      totalXp: 50, // Welcome XP bonus
      completedLessonIds: [],
      unlockedModuleIds: ['m1'],
      earnedAchievementKeys: ['first_steps'],
    };

    saveStoredUserData(demoUser.id, initialProfile);
    setStoredAuth(demoUser);

    set({
      user: demoUser,
      profile: initialProfile,
      isLoading: false,
      isDemoMode: true,
      error: null,
    });

    return { success: true };
  },

  // Instant 1-Click Demo Login
  loginAsDemoUser: () => {
    const demoUser = {
      id: DEFAULT_MOCK_USER.id,
      email: DEFAULT_MOCK_USER.email,
      displayName: DEFAULT_MOCK_USER.displayName,
      avatarUrl: DEFAULT_MOCK_USER.avatarUrl,
    };
    const profile = getStoredUserData(DEFAULT_MOCK_USER.id);
    setStoredAuth(demoUser);
    set({
      user: demoUser,
      profile,
      isDemoMode: true,
      error: null,
      isLoading: false,
    });
  },

  // Update Profile & Sync with Supabase + Local Cache
  updateProfile: async (updates) => {
    const { user, profile, isDemoMode } = get();
    if (!user) return;

    const updated: UserProfile = {
      ...profile!,
      ...updates,
    };

    // Save to LocalStorage cache immediately for responsive UI
    saveStoredUserData(user.id, updated);
    set({ profile: updated });

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      try {
        const dbPayload: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };

        if (updates.displayName !== undefined) dbPayload.display_name = updates.displayName;
        if (updates.avatarUrl !== undefined) dbPayload.avatar_url = updates.avatarUrl;
        if (updates.role !== undefined) dbPayload.role = updates.role;
        if (updates.totalXp !== undefined) dbPayload.total_xp = updates.totalXp;
        if (updates.currentLevel !== undefined) dbPayload.current_level = updates.currentLevel;
        if (updates.currentStreak !== undefined) dbPayload.current_streak = updates.currentStreak;
        if (updates.longestStreak !== undefined) dbPayload.longest_streak = updates.longestStreak;
        if (updates.lastActivityDate !== undefined) dbPayload.last_activity_date = updates.lastActivityDate;
        if (updates.streakFreezes !== undefined) dbPayload.streak_freezes = updates.streakFreezes;
        if (updates.completedLessonIds !== undefined) dbPayload.completed_lesson_ids = updates.completedLessonIds;
        if (updates.unlockedModuleIds !== undefined) dbPayload.unlocked_module_ids = updates.unlockedModuleIds.map(String);
        if (updates.earnedAchievementKeys !== undefined) dbPayload.earned_achievement_keys = updates.earnedAchievementKeys;
        if (updates.bookmarkedLessonIds !== undefined) dbPayload.bookmarked_lesson_ids = updates.bookmarkedLessonIds;
        if (updates.lessonNotes !== undefined) dbPayload.lesson_notes = updates.lessonNotes;
        if (updates.flashcardMastery !== undefined) dbPayload.flashcard_mastery = updates.flashcardMastery;

        const { error } = await supabase
          .from('profiles')
          .update(dbPayload)
          .eq('id', user.id);

        if (error) {
          // If specific column is missing from older schema, retry without array columns
          if (error.message.includes('column') && (dbPayload.completed_lesson_ids || dbPayload.unlocked_module_ids)) {
            delete dbPayload.completed_lesson_ids;
            delete dbPayload.unlocked_module_ids;
            delete dbPayload.earned_achievement_keys;
            await supabase.from('profiles').update(dbPayload).eq('id', user.id);
          }
        }
      } catch (e) {
        console.warn('[LaraQuest] Cloud sync notice:', e);
      }
    }
  },

  // Logout
  logout: async () => {
    if (realtimeChannel && supabase) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    setStoredAuth(null);
    set({ user: null, profile: null, isLoading: false, error: null });
  },
}));
