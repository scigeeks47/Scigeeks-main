import { User, DashboardState } from "@/types/dashboard";

export const mockUser: User = {
  id: "usr_101",
  name: "Arpan",
  email: "arpan@scigeeks.com",
  role: "student",
  hasUnreadNotifications: true,
};

export const dashboardState: DashboardState = {
  user: mockUser,
  streak: {
    data: {
      currentStreak: 14,
      weeklyXP: 1240,
      weeklyGoal: 72,
      quote: "Success is the sum of small efforts repeated daily.",
    },
    comingSoon: true,
  },
  continueLearning: {
    data: {
      courseId: "org-chem-101",
      title: "Organic Chemistry",
      chapter: "Chapter 6 · Reaction Mechanisms",
      progress: 72,
    },
    comingSoon: true,
  },
  quickActions: [
    {
      id: "ask-ai",
      title: "Ask AI",
      iconName: "Sparkles",
      actionKey: "ask_ai",
    },
    {
      id: "browse-courses",
      title: "Browse Courses",
      iconName: "Compass",
      actionKey: "browse_courses",
    },
  ],
  featuredCourses: [
    {
      id: "neet-bio-master",
      title: "NEET Biology Masterclass",
      difficulty: "Intermediate",
      rating: 4.9,
      students: "18.5k",
      thumbnail: "biology",
    },
    {
      id: "jee-phys-master",
      title: "JEE Physics",
      difficulty: "Advanced",
      rating: 4.8,
      students: "12.1k",
      thumbnail: "physics",
    },
  ],
  upcomingClasses: [
    {
      id: "live-phys-1",
      title: "Physics Numericals",
      teacher: "Dr. Rao",
      startTime: "Coming Soon",
      status: "soon",
    },
    {
      id: "live-bio-1",
      title: "Biology Revision",
      teacher: "Dr. Sharma",
      startTime: "Coming Soon",
      status: "soon",
    },
  ],
  trendingCommunities: [
    {
      id: "comm-jee",
      name: "JEE Warriors",
      iconName: "Swords",
      memberCount: "42k",
      category: "JEE",
      status: "coming_soon",
    },
    {
      id: "comm-neet",
      name: "NEET Aspirants",
      iconName: "Stethoscope",
      memberCount: "38k",
      category: "NEET",
      status: "coming_soon",
    },
    {
      id: "comm-lounge",
      name: "SciGeeks Lounge",
      iconName: "Rocket",
      memberCount: "15k",
      category: "General",
      status: "coming_soon",
    },
  ],
};
