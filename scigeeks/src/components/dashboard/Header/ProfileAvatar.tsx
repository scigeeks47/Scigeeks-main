"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileAvatarProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  onClick?: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  email,
  avatarUrl,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initial = useMemo(() => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  }, [name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (onClick) {
      onClick();
    }
  };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (err: any) {
      console.error("Logout error details:", err);
      setToast("Unable to log out. Please try again.");
      setTimeout(() => {
        setToast(null);
      }, 4000);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Profile menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#00E676] text-black font-bold text-base shadow-[0_0_20px_rgba(0,230,118,0.35)] hover:shadow-[0_0_25px_rgba(0,230,118,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden shrink-0"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 bg-[#0c130f] border border-[#1b3d29]/60 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
          >
            {/* User Info Header Section */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00E676] text-black font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate leading-none mb-1">
                  {name}
                </span>
                <span className="text-[10px] text-neutral-400 truncate leading-none">
                  {email}
                </span>
              </div>
            </div>

            {/* Menu Options */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/profile");
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors font-medium"
                aria-label="View Profile"
              >
                View Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors font-semibold border-t border-white/5"
                aria-label="Log out"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 left-6 right-6 z-[100] md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[380px] bg-[#d32f2f] text-white px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgba(211,47,47,0.3)] flex items-center gap-3 text-[14px] font-semibold"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-left leading-snug">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileAvatar;
