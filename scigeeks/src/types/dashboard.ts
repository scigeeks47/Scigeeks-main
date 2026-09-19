export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  hasUnreadNotifications?: boolean;
}

export interface StreakData {
  currentStreak: number;
  weeklyXP: number;
  weeklyGoal: number;
  quote: string;
}

export interface ContinueLearningData {
  courseId: string;
  title: string;
  chapter: string;
  progress: number;
}

export interface QuickActionItem {
  id: string;
  title: string;
  iconName: "Sparkles" | "Compass" | "BookOpen" | string;
  actionKey: string;
}

export interface NavTabItem {
  id: string;
  label: string;
  iconName: "Home" | "Bot" | "Users" | "Briefcase" | "User";
  href?: string;
}

export interface Course {
  id: string;
  title: string;
  thumbnail?: string; // Optional URL/path or fallback subject code
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string;
  rating: number;
  students: string; // e.g. "18.5k"
  duration?: string; // e.g. "2h 30m"
}

export interface LiveClass {
  id: string;
  title: string;
  teacher: string;
  startTime: string; // ISO or human-readable
  thumbnail?: string;
  youtubeLink?: string;
  status: "live" | "soon" | string;
}

export interface Community {
  id: string;
  name: string;
  iconName: string; // e.g. "Swords" or "Stethoscope" or "Rocket"
  memberCount: string; // e.g. "42k"
  category: string;
  status: "coming_soon" | "active" | string;
}

export interface DashboardState {
  user: User;
  streak: {
    data: StreakData;
    comingSoon: boolean;
  };
  continueLearning: {
    data: ContinueLearningData;
    comingSoon: boolean;
  };
  quickActions: QuickActionItem[];
  featuredCourses: Course[];
  upcomingClasses: LiveClass[];
  trendingCommunities: Community[];
}
