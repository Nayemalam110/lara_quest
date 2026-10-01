// ==============================================================================
// 🔐 Auth Store (Zustand)
// Handles Supabase Auth or Local Demo Mode seamlessly
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

export interface AuthState {
  user: UserSession | any | null;
  profile: any | null;
  isLoading: boolean;
  isDemoMode: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  loginAsDemoUser: () => void;
  updateProfile: (updates: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
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
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({
            user: session.user,
            profile: profile || null,
            isLoading: false,
            isDemoMode: false,
          });
          return;
        }
      } catch (err) {
        console.error('Error fetching Supabase session:', err);
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
      // Default to guest mock user for instant playground experience
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

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          user: data.user,
          profile: profile || null,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } catch (err: any) {
        set({ error: err.message || 'Login failed', isLoading: false });
        return { success: false, error: err.message };
      }
    }

    // Local Demo Login: simulate quick authentication
    await new Promise((r) => setTimeout(r, 400));
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

  // Sign up with Email & Password
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
              avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}`,
            },
          },
        });

        if (error) throw error;

        set({
          user: data.user,
          isLoading: false,
          error: null,
        });
        return { success: true, message: 'Check your email for confirmation link if configured.' };
      } catch (err: any) {
        set({ error: err.message || 'Registration failed', isLoading: false });
        return { success: false, error: err.message };
      }
    }

    // Local Demo Registration
    await new Promise((r) => setTimeout(r, 400));
    const demoUser = {
      id: 'demo-user-' + Math.random().toString(36).substring(2, 9),
      email,
      displayName: displayName || email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName || email}&backgroundColor=6366f1`,
    };

    const initialProfile = {
      ...DEFAULT_MOCK_USER,
      id: demoUser.id,
      email,
      displayName: demoUser.displayName,
      avatarUrl: demoUser.avatarUrl,
      totalXp: 50, // Welcome XP bonus
      completedLessonIds: [],
      unlockedModuleIds: [1],
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

  // Update Profile
  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user) return;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (!error && data) {
        set({ profile: data });
      }
      return;
    }

    // Local update
    const updated = { ...profile, ...updates };
    saveStoredUserData(user.id, updated);
    set({ profile: updated });
  },

  // Logout
  logout: async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setStoredAuth(null);
    set({ user: null, profile: null, isLoading: false, error: null });
  },
}));
