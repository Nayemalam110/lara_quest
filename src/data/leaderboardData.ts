// ==============================================================================
// 🏆 LaraQuest Community Leaderboard Dataset & Helpers
// Provides ranked community learner profiles for both live and offline/demo modes
// ==============================================================================

export interface LeaderboardUser {
  id: string;
  rank: number;
  displayName: string;
  username: string;
  avatarUrl: string;
  role: string;
  level: number;
  levelName: string;
  xp: number;
  streak: number;
  completedModules: number;
  completedLessons: number;
  badgeCount: number;
  badge: string;
  isCurrentUser?: boolean;
}

export const MOCK_LEADERBOARD_USERS: Omit<LeaderboardUser, "rank">[] = [
  {
    id: "lq-u01",
    displayName: "Mateo Silva",
    username: "@mateo_flutter",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=MateoSilva&backgroundColor=3b82f6",
    role: "Senior Flutter Dev ➔ API Architect",
    level: 10,
    levelName: "Full-Stack Falcon",
    xp: 5940,
    streak: 28,
    completedModules: 24,
    completedLessons: 92,
    badgeCount: 16,
    badge: "🦅",
  },
  {
    id: "lq-u02",
    displayName: "Aoi Takahashi",
    username: "@aoi_mobile",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=AoiTakahashi&backgroundColor=ec4899",
    role: "iOS / Flutter Guild Lead",
    level: 10,
    levelName: "Full-Stack Falcon",
    xp: 5620,
    streak: 24,
    completedModules: 24,
    completedLessons: 90,
    badgeCount: 15,
    badge: "🥇",
  },
  {
    id: "lq-u03",
    displayName: "Liam O'Connor",
    username: "@liam_dart",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=LiamOConnor&backgroundColor=10b981",
    role: "Mobile Solutions Architect",
    level: 9,
    levelName: "Testing Titan",
    xp: 4410,
    streak: 19,
    completedModules: 22,
    completedLessons: 82,
    badgeCount: 13,
    badge: "🥈",
  },
  {
    id: "lq-u04",
    displayName: "Fatima Al-Mansoor",
    username: "@fatima_dev",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=FatimaAlMansoor&backgroundColor=f59e0b",
    role: "Flutter & Backend Engineer",
    level: 9,
    levelName: "Testing Titan",
    xp: 4180,
    streak: 17,
    completedModules: 21,
    completedLessons: 79,
    badgeCount: 12,
    badge: "🥉",
  },
  {
    id: "lq-u05",
    displayName: "Julian Vance",
    username: "@julian_code",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=JulianVance&backgroundColor=8b5cf6",
    role: "Cross-Platform Engineer",
    level: 8,
    levelName: "API Artisan",
    xp: 3520,
    streak: 15,
    completedModules: 19,
    completedLessons: 71,
    badgeCount: 11,
    badge: "🌐",
  },
  {
    id: "lq-u06",
    displayName: "Elena Rostova",
    username: "@elena_flutter",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ElenaRostova&backgroundColor=06b6d4",
    role: "Mobile App Consultant",
    level: 8,
    levelName: "API Artisan",
    xp: 3340,
    streak: 22,
    completedModules: 18,
    completedLessons: 68,
    badgeCount: 10,
    badge: "✨",
  },
  {
    id: "lq-u07",
    displayName: "Kofi Boateng",
    username: "@kofi_tech",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=KofiBoateng&backgroundColor=ef4444",
    role: "Flutter / Riverpod Enthusiast",
    level: 7,
    levelName: "Auth Architect",
    xp: 2750,
    streak: 12,
    completedModules: 15,
    completedLessons: 58,
    badgeCount: 9,
    badge: "🔐",
  },
  {
    id: "lq-u08",
    displayName: "Sarah Jenkins",
    username: "@sarah_j",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=SarahJenkins&backgroundColor=6366f1",
    role: "Frontend Engineer (Dart/React)",
    level: 7,
    levelName: "Auth Architect",
    xp: 2610,
    streak: 14,
    completedModules: 14,
    completedLessons: 55,
    badgeCount: 8,
    badge: "🛡️",
  },
  {
    id: "lq-u09",
    displayName: "Carlos Mendez",
    username: "@carlos_m",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=CarlosMendez&backgroundColor=14b8a6",
    role: "Full-Stack Aspiring Mobile Dev",
    level: 6,
    levelName: "Middleware Maven",
    xp: 1980,
    streak: 11,
    completedModules: 12,
    completedLessons: 46,
    badgeCount: 7,
    badge: "⚡",
  },
  {
    id: "lq-u10",
    displayName: "Priya Sharma",
    username: "@priya_sharma",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=PriyaSharma&backgroundColor=f43f5e",
    role: "Mobile Engineer @ FinTech",
    level: 6,
    levelName: "Middleware Maven",
    xp: 1850,
    streak: 9,
    completedModules: 11,
    completedLessons: 42,
    badgeCount: 7,
    badge: "🎯",
  },
  {
    id: "lq-u11",
    displayName: "Noah Lindqvist",
    username: "@noah_nordic",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=NoahLindqvist&backgroundColor=3b82f6",
    role: "Flutter Contractor",
    level: 5,
    levelName: "Eloquent Explorer",
    xp: 1420,
    streak: 8,
    completedModules: 9,
    completedLessons: 35,
    badgeCount: 6,
    badge: "🗄️",
  },
  {
    id: "lq-u12",
    displayName: "Zhenya Chen",
    username: "@zhenya_c",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ZhenyaChen&backgroundColor=a855f7",
    role: "Cross-Platform Mobile Dev",
    level: 5,
    levelName: "Eloquent Explorer",
    xp: 1280,
    streak: 7,
    completedModules: 8,
    completedLessons: 31,
    badgeCount: 5,
    badge: "🎮",
  },
  {
    id: "lq-u13",
    displayName: "Hassan Al-Husseini",
    username: "@hassan_h",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=HassanHusseini&backgroundColor=10b981",
    role: "Flutter UI Designer & Dev",
    level: 4,
    levelName: "Migration Master",
    xp: 950,
    streak: 6,
    completedModules: 6,
    completedLessons: 24,
    badgeCount: 5,
    badge: "🌱",
  },
  {
    id: "lq-u14",
    displayName: "Maya Dupont",
    username: "@maya_dupont",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=MayaDupont&backgroundColor=eab308",
    role: "Junior Mobile Engineer",
    level: 4,
    levelName: "Migration Master",
    xp: 820,
    streak: 5,
    completedModules: 5,
    completedLessons: 20,
    badgeCount: 4,
    badge: "🧭",
  },
  {
    id: "lq-u15",
    displayName: "Benjamin Scott",
    username: "@ben_scott",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=BenjaminScott&backgroundColor=06b6d4",
    role: "Flutter Indie Hacker",
    level: 3,
    levelName: "Controller Cadet",
    xp: 540,
    streak: 4,
    completedModules: 4,
    completedLessons: 16,
    badgeCount: 3,
    badge: "🌱",
  },
];

export type LeaderboardSortOption = "xp" | "streak" | "modules";

export function getRankedLearners(
  sortBy: LeaderboardSortOption = "xp",
  searchQuery = "",
  currentUser?: {
    id?: string;
    displayName?: string;
    avatarUrl?: string;
    totalXp?: number;
    currentStreak?: number;
    currentLevel?: number;
    completedLessonIds?: string[];
  }
): {
  rankedList: LeaderboardUser[];
  podium: LeaderboardUser[];
  currentUserStanding: {
    rank: number;
    totalLearners: number;
    percentile: number;
    distanceToNextRank: number;
    nextRankUser?: LeaderboardUser;
  };
} {
  // Combine mock community with current user
  const learners: LeaderboardUser[] = MOCK_LEADERBOARD_USERS.map((u, i) => ({
    ...u,
    rank: i + 1,
    isCurrentUser: false,
  }));

  if (currentUser) {
    const userCompletedLessons = (currentUser.completedLessonIds || []).length;
    const userCompletedModules = Math.floor(userCompletedLessons / 4);
    const existingIdx = learners.findIndex((l) => l.id === currentUser.id);

    const currentUserEntry: LeaderboardUser = {
      id: currentUser.id || "current-user",
      rank: 0,
      displayName: currentUser.displayName || "You (Learner)",
      username: "@you",
      avatarUrl:
        currentUser.avatarUrl ||
        "https://api.dicebear.com/7.x/bottts/svg?seed=FlutterChampion&backgroundColor=6366f1",
      role: "Mobile Dev ➔ Full-Stack",
      level: currentUser.currentLevel || 1,
      levelName: "Active Learner",
      xp: currentUser.totalXp || 0,
      streak: currentUser.currentStreak || 0,
      completedModules: userCompletedModules,
      completedLessons: userCompletedLessons,
      badgeCount: Math.min(12, Math.max(2, Math.floor(userCompletedLessons / 6) + 1)),
      badge: "⚡",
      isCurrentUser: true,
    };

    if (existingIdx >= 0) {
      learners[existingIdx] = currentUserEntry;
    } else {
      learners.push(currentUserEntry);
    }
  }

  // Sort by requested criterion
  learners.sort((a, b) => {
    if (sortBy === "xp") return b.xp - a.xp;
    if (sortBy === "streak") return b.streak - a.streak;
    if (sortBy === "modules") return b.completedModules - a.completedModules;
    return b.xp - a.xp;
  });

  // Assign 1-indexed ranks
  learners.forEach((l, index) => {
    l.rank = index + 1;
  });

  // Find current user standing
  const userRankIdx = learners.findIndex((l) => l.isCurrentUser);
  const userRank = userRankIdx >= 0 ? userRankIdx + 1 : learners.length;
  const percentile = Math.max(
    1,
    Math.round(((learners.length - userRank + 1) / learners.length) * 100)
  );
  const nextRankUser = userRankIdx > 0 ? learners[userRankIdx - 1] : undefined;
  const currentUserXp = currentUser?.totalXp || 0;
  const distanceToNextRank = nextRankUser ? Math.max(0, nextRankUser.xp - currentUserXp) : 0;

  // Filter list if search query is provided
  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? learners.filter(
        (l) =>
          l.displayName.toLowerCase().includes(query) ||
          l.username.toLowerCase().includes(query) ||
          l.role.toLowerCase().includes(query)
      )
    : learners;

  // Podium is top 3 from unfiltered sorted list
  const podium = learners.slice(0, 3);

  return {
    rankedList: filtered,
    podium,
    currentUserStanding: {
      rank: userRank,
      totalLearners: learners.length,
      percentile,
      distanceToNextRank,
      nextRankUser,
    },
  };
}
