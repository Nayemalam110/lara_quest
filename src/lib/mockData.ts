// ==============================================================================
// 💾 LaraQuest Mock/Local Storage Engine
// Provides full persistence in LocalStorage when Supabase is not connected.
// ==============================================================================

import { INITIAL_MODULES, ACHIEVEMENTS, calculateLevel } from './constants';

const STORAGE_KEY_AUTH = 'laraquest_auth_session';
const STORAGE_KEY_DATA = 'laraquest_user_data';

// Default mock user profile
export const DEFAULT_MOCK_USER = {
  id: 'mock-user-flutter-01',
  email: 'alex.flutter@example.com',
  displayName: 'Alex Flutterer',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=FlutterChampion&backgroundColor=6366f1',
  role: 'Mobile Dev -> Full-Stack',
  totalXp: 350,
  currentLevel: 3,
  currentStreak: 5,
  longestStreak: 5,
  lastActivityDate: new Date().toISOString().split('T')[0],
  streakFreezes: 1,
  completedLessonIds: [101, 102],
  unlockedModuleIds: [1, 2],
  earnedAchievementKeys: ['first_steps', 'quick_learner'],
  createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
};

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed reading auth storage:', err);
    return null;
  }
};

export const setStoredAuth = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  } catch (err) {
    console.error('Failed writing auth storage:', err);
  }
};

export const getStoredUserData = (userId = 'mock-user-flutter-01') => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_DATA}_${userId}`);
    if (raw) return JSON.parse(raw);

    // Initial seed for this user
    const initial = { ...DEFAULT_MOCK_USER, id: userId };
    localStorage.setItem(`${STORAGE_KEY_DATA}_${userId}`, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error('Failed reading user data:', err);
    return DEFAULT_MOCK_USER;
  }
};

export const saveStoredUserData = (userId, data) => {
  try {
    localStorage.setItem(`${STORAGE_KEY_DATA}_${userId}`, JSON.stringify(data));
  } catch (err) {
    console.error('Failed saving user data:', err);
  }
};

export const addXpToUser = (userId, amount) => {
  const current = getStoredUserData(userId);
  const newXp = (current.totalXp || 0) + amount;
  const levelInfo = calculateLevel(newXp);
  const updated = {
    ...current,
    totalXp: newXp,
    currentLevel: levelInfo.level,
  };
  saveStoredUserData(userId, updated);
  return { updated, levelInfo };
};
