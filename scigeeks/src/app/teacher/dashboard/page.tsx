"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, Users, Eye, ArrowLeft, LogOut, Loader2, Sparkles, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/shared/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import * as classroomApi from "@/lib/classroomApi";
import { ClassItem } from "@/types/classroom";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  
  // Create Class Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [submittingClass, setSubmittingClass] = useState(false);
  const [modalError, setModalError] = useState("");

  const [generalError, setGeneralError] = useState("");

  // Redirect non-teachers or unauthenticated users
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "teacher")) {
      router.push("/teacher/login");
    }
  }, [user, authLoading, router]);

  // Load classes
  const loadClassesList = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setLoadingClasses(true);
      const res = await classroomApi.listClasses(session.access_token);
      if (res.success && res.classes) {
        setClasses(res.classes);
      } else {
        setGeneralError(res.message || "Failed to load classes");
      }
    } catch (err) {
      console.error(err);
      setGeneralError("An unexpected error occurred");
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "teacher") {
      loadClassesList();
    }
  }, [user]);

  const handleCreateClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      setModalError("Class name is required.");
      return;
    }

    setSubmittingClass(true);
    setModalError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication session not found.");

      const res = await classroomApi.createClass(session.access_token, {
        name: className.trim(),
        description: classDescription.trim() || undefined,
      });

      if (res.success && res.class) {
        setClasses((prev) => [res.class!, ...prev]);
        setShowCreateModal(false);
        setClassName("");
        setClassDescription("");
      } else {
        setModalError(res.message || "Failed to create class.");
      }
    } catch (err: any) {
      setModalError(err.message || "Error creating class.");
    } finally {
      setSubmittingClass(false);
    }
  };

  const handleDeleteClassClick = async (classId: string) => {
    if (!window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await classroomApi.deleteClass(session.access_token, classId);
      if (res.success) {
        setClasses((prev) => prev.filter((c) => c.id !== classId));
        setSelectedClass(null);
      } else {
        alert(res.message || "Failed to delete class.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting class.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/teacher/login");
  };

  if (authLoading || !user || user.role !== "teacher") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0b0b0b] text-white font-sans">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
        <p className="text-[16px] font-semibold text-gray-400">Loading your educator portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white font-sans flex flex-col">
      {/* Header bar */}
      <header className="border-b border-neutral-900 bg-black/60 backdrop-blur-md sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight text-white leading-tight">SciGeeks</h1>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">Educator Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/60 border border-neutral-800 rounded-xl">
            <User className="w-4 h-4 text-neutral-400" />
            <span className="text-[13px] font-medium text-neutral-300">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/40 active:scale-95 transition-all cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        <AnimatePresence mode="wait">
          {!selectedClass ? (
            // Classes list view
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[24px] font-black tracking-tight text-white">Your Classes</h2>
                  <p className="text-[14px] text-neutral-400 mt-1">Manage your active student rosters and join codes</p>
                </div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#032e1d] hover:bg-[#022718] text-emerald-400 font-bold text-[14px] px-4 py-2.5 rounded-xl border border-emerald-500/20 flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/25"
                >
                  <Plus className="w-4 h-4" />
                  Create Class
                </Button>
              </div>

              {generalError && (
                <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-2xl text-[14px] font-medium text-center">
                  {generalError}
                </div>
              )}

              {loadingClasses ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
                  <p className="text-[14px] text-neutral-500">Retrieving classroom sections...</p>
                </div>
              ) : classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-neutral-900 rounded-[32px] bg-neutral-900/10 px-6">
                  <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-4">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-[18px] font-bold text-neutral-300">No classes created yet</h3>
                  <p className="text-[14px] text-neutral-500 max-w-[280px] mt-2 mb-6">
                    Create your first classroom section to generate a student join code.
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-[#032e1d] hover:bg-[#022718] text-white px-5 h-[48px] rounded-xl font-bold cursor-pointer"
                  >
                    Create a Class
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => setSelectedClass(cls)}
                      className="p-5 rounded-[24px] bg-[#121212] border border-neutral-800/80 hover:border-neutral-700/80 active:scale-[0.99] transition-all duration-200 cursor-pointer flex flex-col justify-between h-[180px] group shadow-sm"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-500/20">
                            Class
                          </span>
                        </div>
                        <h4 className="text-[16px] font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors duration-150 line-clamp-1">
                          {cls.name}
                        </h4>
                        <p className="text-[13px] text-neutral-400 line-clamp-2 mt-1 font-medium">
                          {cls.description || "No description provided."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-900 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Join Code</span>
                          <span className="text-[14px] font-black font-mono text-white tracking-wide">{cls.join_code}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-neutral-900 text-neutral-400 group-hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            // Single Class details view
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Breadcrumb / Back button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedClass(null)}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white text-[14px] font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Classes
                </button>
                <Button
                  onClick={() => handleDeleteClassClick(selectedClass.id)}
                  className="p-2 bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 text-red-400 hover:text-red-300 rounded-xl transition-all cursor-pointer flex items-center gap-2 text-[13px] font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Class
                </Button>
              </div>

              {/* Class Info card */}
              <div className="p-6 md:p-8 rounded-[32px] bg-[#121212] border border-neutral-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-500/20">
                      Active Class
                    </span>
                  </div>
                  <h3 className="text-[26px] font-black tracking-tight text-white leading-tight">
                    {selectedClass.name}
                  </h3>
                  <p className="text-[15px] text-neutral-300 font-medium max-w-xl">
                    {selectedClass.description || "No description provided."}
                  </p>
                </div>

                {/* Join Code Centerpiece */}
                <div className="p-5 rounded-2xl bg-black/60 border border-neutral-800 flex flex-col items-center justify-center text-center shrink-0 min-w-[200px]">
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 mb-1"> Roster Join Code </span>
                  <span className="text-[28px] font-black font-mono tracking-wider text-white select-all">
                    {selectedClass.join_code}
                  </span>
                  <p className="text-[11px] text-neutral-500 mt-2 font-medium">Share this code with students to enroll them</p>
                </div>
              </div>

              {/* Class statistics placeholder for next phases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-[24px] bg-[#121212]/50 border border-neutral-900 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] text-neutral-500 font-bold uppercase tracking-wider">Student Roster</span>
                    <span className="text-[18px] font-black mt-0.5">0 Active Students</span>
                  </div>
                </div>

                <div className="p-5 rounded-[24px] bg-[#121212]/50 border border-neutral-900 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] text-neutral-500 font-bold uppercase tracking-wider">Created On</span>
                    <span className="text-[15px] font-bold mt-0.5">
                      {new Date(selectedClass.created_at).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Class Modal dialog popup */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal card content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="relative w-full max-w-[440px] bg-[#121212] border border-neutral-800 rounded-[28px] p-6 shadow-2xl z-10 text-white"
            >
              <div className="flex flex-col mb-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-950/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-[20px] font-black tracking-tight">Create Classroom</h3>
                <p className="text-[13px] text-neutral-400 mt-1">Set up a new section and generate a student code</p>
              </div>

              {modalError && (
                <div className="mb-4 p-3 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl text-[13px] font-medium text-center">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleCreateClassSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-class-name" className="text-[12.5px] font-bold text-neutral-300 pl-0.5">
                    Class Name *
                  </label>
                  <Input
                    id="modal-class-name"
                    required
                    maxLength={100}
                    placeholder="e.g. Biology 10A"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="h-[48px] px-4 rounded-xl border border-neutral-800 bg-neutral-900/60 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 text-[14.5px] placeholder:text-neutral-500 text-white font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-class-description" className="text-[12.5px] font-bold text-neutral-300 pl-0.5">
                    Description (Optional)
                  </label>
                  <textarea
                    id="modal-class-description"
                    maxLength={500}
                    placeholder="Brief description of course materials or syllabus..."
                    value={classDescription}
                    onChange={(e) => setClassDescription(e.target.value)}
                    className="h-[100px] p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 focus:border-emerald-500 focus:ring-emerald-500/20 text-[14.5px] placeholder:text-neutral-500 text-white font-medium resize-none outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 h-[48px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl font-bold text-[14.5px] border border-neutral-800/80 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingClass}
                    className="flex-1 h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[14.5px] shadow-md shadow-emerald-950/20 cursor-pointer flex items-center justify-center"
                  >
                    {submittingClass ? <Loader2 className="w-4.5 h-4.5 animate-spin mr-1.5" /> : null}
                    Create Class
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
