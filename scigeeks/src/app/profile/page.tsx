"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Shield, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/shared/AuthProvider";
import BottomNavigation from "@/components/dashboard/Navigation/BottomNavigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user: currentUser, loading } = useAuth();

  const initials = useMemo(() => {
    if (!currentUser?.name) return "U";
    const parts = currentUser.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  }, [currentUser]);

  const joinedDate = useMemo(() => {
    const dateField = currentUser?.createdAt || currentUser?.created_at;
    if (!dateField) return null;
    try {
      const date = new Date(dateField);
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-white font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4" />
        <p className="text-[16px] font-semibold text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center selection:bg-[#00E676]/30 selection:text-[#00E676]">
      {/* Mobile Shell Container */}
      <main className="w-full max-w-md px-5 pt-6 pb-28 flex flex-col gap-6 relative">
        
        {/* Header */}
        <header className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all duration-200"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Profile
          </h1>
        </header>

        {/* Profile Card Workspace */}
        <div className="flex flex-col items-center gap-6 mt-4">
          {/* Large Avatar */}
          <div className="w-24 h-24 rounded-3xl bg-[#00E676] text-black font-extrabold text-3xl flex items-center justify-center shadow-[0_0_30px_rgba(0,230,118,0.25)] overflow-hidden shrink-0">
            {currentUser?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="flex flex-col items-center text-center gap-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {currentUser?.name}
            </h2>
            {currentUser?.email && (
              <span className="text-sm text-neutral-400 font-medium">
                {currentUser.email}
              </span>
            )}
          </div>

          {/* User Meta Information Grid */}
          <div className="w-full flex flex-col gap-3.5 bg-neutral-900/40 border border-neutral-800/50 rounded-3xl p-5 mt-2">
            {currentUser?.role && (
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#00E676]" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Role</span>
                  <span className="text-sm font-semibold text-white capitalize">{currentUser.role}</span>
                </div>
              </div>
            )}

            {joinedDate && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#00E676]" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Joined</span>
                  <span className="text-sm font-semibold text-white">{joinedDate}</span>
                </div>
              </div>
            )}
          </div>

          {/* ==================================================== */}
          {/* Future Profile Extension Integration Starts Here   */}
          {/* ==================================================== */}
          {/* Developers can append edit forms, change password,   */}
          {/* or active subscriptions controls right here.        */}
          {/* ==================================================== */}
          
          {/* ==================================================== */}
          {/* Future Profile Extension Integration Ends Here     */}
          {/* ==================================================== */}
        </div>

        {/* Persistent Bottom Navigation */}
        <BottomNavigation currentTab="profile" />
        
      </main>
    </div>
  );
}
