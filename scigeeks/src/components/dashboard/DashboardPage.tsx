"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "./Header/DashboardHeader";
import SearchBar from "./Search/SearchBar";
import StreakCard from "./Cards/StreakCard";
import ContinueLearningCard from "./Cards/ContinueLearningCard";
import QuickActions from "./QuickActions/QuickActions";
import BottomNavigation from "./Navigation/BottomNavigation";
import CourseCard from "./Cards/CourseCard";
import LiveClassCard from "./Cards/LiveClassCard";
import SciGenAICard from "./Cards/SciGenAICard";
import CommunityCard from "./Cards/CommunityCard";
import { useAuth } from "../shared/AuthProvider";
import { DashboardState, User } from "@/types/dashboard";

import { Plus, Users, Calendar, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import * as studentApi from "@/lib/studentApi";
import { ClassItem } from "@/types/classroom";

interface DashboardPageProps {
  data: DashboardState;
  onSearch?: (query: string) => void;
  onVoiceSearch?: () => void;
  onContinueCourse?: () => void;
  onQuickAction?: (actionKey: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onTabChange?: (tabId: string) => void;
}

// Transformer function to map backend user to dashboard user
const mapBackendUserToDashboardUser = (backendUser: any): User | null => {
  if (!backendUser) return null;
  return {
    id: backendUser.id || "",
    name: backendUser.name || "User",
    email: backendUser.email || "",
    role: backendUser.role || "student",
    avatarUrl: backendUser.avatarUrl || undefined,
    hasUnreadNotifications: backendUser.hasUnreadNotifications ?? false,
  };
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  data,
  onSearch,
  onVoiceSearch,
  onContinueCourse,
  onQuickAction,
  onNotificationClick,
  onProfileClick,
  onTabChange,
}) => {
  const router = useRouter();
  const { streak, continueLearning, quickActions } = data;

  const { user: currentUser, loading } = useAuth();
  const [toast, setToast] = useState<string | null>(null);

  // Classroom States
  const [enrolledClasses, setEnrolledClasses] = useState<{ joined_at: string; class: ClassItem }[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [submittingJoin, setSubmittingJoin] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);

  const triggerToast = (message: string) => {
    setToast(message);
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  };

  // Load classes
  const loadStudentClasses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setLoadingClasses(true);
      const res = await studentApi.listClasses(session.access_token);
      if (res.success && res.classes) {
        setEnrolledClasses(res.classes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === "student") {
      loadStudentClasses();
    }
  }, [currentUser]);

  const handleJoinClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) {
      setJoinError("Join code is required.");
      return;
    }

    setSubmittingJoin(true);
    setJoinError("");
    setJoinSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expired. Please log in again.");

      const res = await studentApi.joinClass(session.access_token, joinCodeInput.trim());
      if (res.success) {
        setJoinSuccess(true);
        setJoinCodeInput("");
        await loadStudentClasses();
        setTimeout(() => {
          setShowJoinModal(false);
          setJoinSuccess(false);
        }, 1500);
      } else {
        setJoinError(res.message || "Failed to join class.");
      }
    } catch (err: any) {
      setJoinError(err.message || "An error occurred.");
    } finally {
      setSubmittingJoin(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-white font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4" />
        <p className="text-[16px] font-semibold text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  const userPayload = mapBackendUserToDashboardUser(currentUser);
  if (!userPayload) return null; // Additional fallback safety check

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center selection:bg-[#00E676]/30 selection:text-[#00E676]">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#0c130f]/95 border border-[#1b3d29]/80 backdrop-blur-md text-[#00E676] px-5 py-2.5 rounded-full shadow-[0_8px_30px_rgba(0,230,118,0.15)] flex items-center gap-2 text-sm font-bold whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Shell Container */}
      <main className="w-full max-w-md px-5 pt-4 pb-28 flex flex-col gap-2 relative">
        <AnimatePresence mode="wait">
          {selectedClass ? (
            // Classroom Detail View
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedClass(null)}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>

              <div className="p-6 rounded-[28px] bg-[#121212] border border-neutral-900 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-[#00E676] text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-500/20">
                    Enrolled
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">{selectedClass.name}</h2>
                <p className="text-sm text-neutral-300 font-medium">
                  {selectedClass.description || "No description provided."}
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-500 pt-3 border-t border-neutral-900 mt-2 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Enrolled on {new Date(selectedClass.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            // Standard Dashboard View
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              {/* Header */}
              <DashboardHeader
                user={userPayload}
                onNotificationClick={onNotificationClick}
                onProfileClick={onProfileClick}
              />

              {/* Search Bar */}
              <SearchBar onSearch={onSearch} onVoiceSearch={onVoiceSearch} />

              {/* Streak Card */}
              <StreakCard
                streak={streak.data}
                comingSoon={streak.comingSoon}
              />

              {/* Continue Learning Card */}
              <ContinueLearningCard
                course={continueLearning.data}
                comingSoon={continueLearning.comingSoon}
                onContinue={onContinueCourse}
              />

              {/* Quick Actions */}
              <QuickActions
                actions={quickActions}
                onActionClick={onQuickAction}
              />

              {/* My Enrolled Classes */}
              <div className="flex flex-col gap-3 my-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">My Classes</h3>
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(true)}
                    className="text-xs font-bold text-[#00E676] hover:underline cursor-pointer flex items-center gap-1 transition-all duration-150"
                  >
                    <Plus className="w-3 h-3" />
                    Join Class
                  </button>
                </div>

                {loadingClasses ? (
                  <div className="flex items-center justify-center py-4 bg-[#121212]/30 rounded-2xl border border-neutral-900">
                    <Loader2 className="w-5 h-5 animate-spin text-[#00E676]" />
                  </div>
                ) : enrolledClasses.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-neutral-900 rounded-[24px] bg-neutral-900/10">
                    <p className="text-xs text-neutral-400 font-medium">You are not enrolled in any classes yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {enrolledClasses.map((item) => (
                      <div
                        key={item.class.id}
                        onClick={() => setSelectedClass(item.class)}
                        className="p-4 rounded-[20px] bg-[#121212] border border-neutral-800/80 hover:border-neutral-700/80 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex flex-col gap-1 pr-4">
                          <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">{item.class.name}</h4>
                          <p className="text-xs text-neutral-400 line-clamp-1">{item.class.description || "No description."}</p>
                        </div>
                        <span className="text-[11px] font-black font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded-md border border-neutral-800">
                          {item.class.join_code}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 1. Featured Courses */}
              <div className="flex flex-col gap-3 my-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">Featured Courses</h3>
                  <button
                    type="button"
                    onClick={() => triggerToast("Coming Soon")}
                    className="text-xs font-bold text-[#00E676] hover:underline cursor-pointer transition-all duration-150"
                  >
                    See all
                  </button>
                </div>
                <div className="flex gap-3">
                  {data.featuredCourses?.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => triggerToast("Coming Soon")}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Meet SciGenAI / SciBot */}
              <SciGenAICard />

              {/* 3. Upcoming Live Classes */}
              <div className="flex flex-col gap-3 my-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">Upcoming Live Classes</h3>
                </div>
                <div className="flex gap-3">
                  {data.upcomingClasses?.map((liveClass) => (
                    <LiveClassCard
                      key={liveClass.id}
                      liveClass={liveClass}
                      onClick={() => triggerToast("Coming Soon")}
                    />
                  ))}
                </div>
              </div>

              {/* 4. Trending Communities */}
              <div className="flex flex-col gap-3 my-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">Trending Communities</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                  {data.trendingCommunities?.map((community) => (
                    <CommunityCard
                      key={community.id}
                      community={community}
                      onClick={() => triggerToast("Coming Soon")}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent Floating Bottom Navigation */}
        <BottomNavigation currentTab="home" onTabChange={onTabChange} />
      </main>

      {/* Join Class Dialog Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal card content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-[#121212] border border-neutral-800 rounded-[28px] p-6 shadow-2xl z-10 text-white"
            >
              <div className="flex flex-col mb-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#00E676] flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-black tracking-tight">Enroll in Class</h3>
                <p className="text-[12px] text-neutral-400 mt-1">Enter the join code shared by your teacher</p>
              </div>

              {joinError && (
                <div className="mb-4 p-3 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl text-[12px] font-bold text-center">
                  {joinError}
                </div>
              )}

              {joinSuccess && (
                <div className="mb-4 p-3 bg-emerald-950/20 border border-emerald-900/40 text-[#00E676] rounded-xl text-[12px] font-bold text-center">
                  Enrolled successfully!
                </div>
              )}

              <form onSubmit={handleJoinClassSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="join-code" className="text-[11.5px] font-bold text-neutral-400 pl-0.5 uppercase tracking-wider">
                    Join Code
                  </label>
                  <input
                    id="join-code"
                    required
                    maxLength={8}
                    placeholder="e.g. 7K4P2X9M"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value)}
                    className="h-[48px] px-4 rounded-xl border border-neutral-800 bg-neutral-900/60 focus:border-[#00E676] text-center text-[16px] font-black tracking-wider uppercase placeholder:text-neutral-600 text-white outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 h-[48px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl font-bold text-[14px] border border-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingJoin}
                    className="flex-1 h-[48px] bg-[#00E676] hover:bg-[#00c867] text-black rounded-xl font-black text-[14px] cursor-pointer flex items-center justify-center"
                  >
                    {submittingJoin ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
