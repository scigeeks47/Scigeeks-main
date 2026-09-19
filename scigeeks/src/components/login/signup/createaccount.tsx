"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SignupOptions from "./signupoptions";
import SignupEmail from "./signupemail";
import SignupVerification from "./verification";
import SignupPassword from "./password";
import ProgressIndicator from "./progressindicator";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/shared/AuthProvider";

// Predetermined star patterns to avoid SSR hydration mismatches
interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

const STATIC_STARS: Star[] = Array.from({ length: 80 }, (_, i) => {
  // Use a pseudo-random generator with seed to ensure same values on server and client
  const seed = i * 1483.57;
  const left = Math.floor((Math.sin(seed) * 0.5 + 0.5) * 100);
  const top = Math.floor((Math.cos(seed) * 0.5 + 0.5) * 100);
  const size = (i % 3 === 0) ? 3 : (i % 2 === 0) ? 2 : 1;
  const opacity = parseFloat((0.2 + (i % 8) * 0.1).toFixed(2));
  const delay = parseFloat(((i % 5) * 0.8).toFixed(2));
  const duration = parseFloat((1.5 + (i % 4) * 0.5).toFixed(2));
  return { id: i, left, top, size, opacity, delay, duration };
});

const SINE_WAVE_PATH = (() => {
  const points = [];
  const startX = 100;
  const endX = 400;
  const centerY = 100;
  const amplitude = 35;
  const frequency = (2 * Math.PI) / 300;
  for (let x = startX; x <= endX; x += 1) {
    const y = centerY - amplitude * Math.sin(frequency * (x - startX));
    points.push(`${x},${y.toFixed(2)}`);
  }
  return `M ${startX},${centerY} L ${points.join(" ")}`;
})();

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CreateAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const emailParam = searchParams.get("email");

  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<
    "welcome" |
    "options" |
    "email" |
    "verification" |
    "password" |
    "success"
  >(
    viewParam === "password" || viewParam === "welcome" || viewParam === "options" || viewParam === "email" || viewParam === "verification" || viewParam === "success"
      ? (viewParam as any)
      : "welcome"
  );
  const [email, setEmail] = useState<string>(emailParam || "");
  const [toast, setToast] = useState<string | null>(null);

  const { user, loading } = useAuth();

  useEffect(() => {
    if (viewParam === "password") return;
    if (!loading && user) {
      if (user.role === "teacher") {
        router.replace("/teacher/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router, viewParam]);

  const showToast = (msg: string) => {
    setToast(msg);

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  const handleLinkedInLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?intent=signup`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("LinkedIn OAuth error:", err);
      alert(err.message || "Failed to initiate LinkedIn signup");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?intent=signup`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      alert(err.message || "Failed to initiate Google signup");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`relative min-h-screen w-full text-white flex items-center justify-center overflow-x-hidden overflow-y-auto py-0 md:py-8 font-sans select-none antialiased transition-colors duration-300 ${
      view === "welcome" ? "bg-black" : "bg-white"
    }`}>
      {view === "welcome" && (
        <>
          {/* Background Gradients (Enhanced glow) */}
          <div className="absolute inset-0 bg-[#000000] z-0" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-[#00ff88]/12 blur-[130px] pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-[#00ff88]/20 blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#00ff88]/8 blur-[100px] pointer-events-none z-0" />
          <div className="absolute top-[45%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#00ff88]/8 blur-[100px] pointer-events-none z-0" />
        </>
      )}

      {/* Tweaked Phone Container mockup on large screens, standard full-viewport on mobile (with scroll support) */}
      <div className={`relative w-full max-w-[420px] min-h-screen md:min-h-0 md:h-[900px] md:rounded-[48px] overflow-x-hidden overflow-y-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between z-10 transition-all duration-300 ${
        view === "welcome"
          ? "bg-black md:border md:border-emerald-950/40 md:shadow-[0_0_80px_rgba(0,255,136,0.08)]"
          : "bg-white md:border md:border-gray-200 md:shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
      }`}>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-6 left-6 right-6 z-50 bg-[#0da651] text-white px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgba(13,166,81,0.25)] flex items-center gap-3 text-[14px] font-semibold"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-left leading-snug">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {view === "welcome" && (
          <>
            {/* Twinkling Stars */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {STATIC_STARS.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: star.size > 1 ? "0 0 6px rgba(0, 255, 136, 0.6)" : "none",
              }}
              animate={{
                opacity: [star.opacity * 0.2, star.opacity, star.opacity * 0.2],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Hexagonal Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-screen pointer-events-none z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hex-grid" width="40" height="69.28" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 20 11.54 L 0 0 L 0 23.09 L 20 34.64 L 40 23.09 Z M 0 34.64 L 20 46.18 L 0 57.73 L 0 80.82 L 20 92.37 L 40 80.82 L 40 57.73 L 20 46.18 Z"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex-grid)" />
          </svg>
        </div>

        {/* Large Curved Energy Wave Overlay crossing the lower section */}
        <div className="absolute bottom-[240px] left-[-20%] right-[-20%] h-[300px] pointer-events-none z-0 mix-blend-screen">
          <svg className="w-full h-full" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="energyGlow" x1="0" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00A85A" stopOpacity="0" />
                <stop offset="30%" stopColor="#00A85A" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#00A85A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00A85A" stopOpacity="0" />
              </linearGradient>
              <filter id="sineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* X-axis */}
            <motion.path
              d="M 40,100 L 460,100"
              stroke="#00A85A"
              strokeWidth="0.8"
              opacity="0.22"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 0.25,
                duration: 0.7,
                ease: "easeOut",
              }}
            />
            {/* X-axis Arrowhead */}
            <motion.path
              d="M 453,96 L 460,100 L 453,104"
              stroke="#00A85A"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.22"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 0.25,
                duration: 0.7,
                ease: "easeOut",
              }}
            />

            {/* Y-axis */}
            <motion.path
              d="M 100,170 L 100,30"
              stroke="#00A85A"
              strokeWidth="0.8"
              opacity="0.22"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 0.25,
                duration: 0.7,
                ease: "easeOut",
              }}
            />
            {/* Y-axis Arrowhead */}
            <motion.path
              d="M 96,37 L 100,30 L 104,37"
              stroke="#00A85A"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.22"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 0.25,
                duration: 0.7,
                ease: "easeOut",
              }}
            />

            {/* Tick marks (X-axis) */}
            {[100, 175, 250, 325, 400].map((xVal, idx) => (
              <motion.path
                key={`xtick-${idx}`}
                d={`M ${xVal},97 L ${xVal},103`}
                stroke="#00A85A"
                strokeWidth="0.8"
                opacity="0.22"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.95,
                  duration: 0.2,
                }}
              />
            ))}

            {/* Tick marks (Y-axis: 1 and -1) */}
            {[65, 135].map((yVal, idx) => (
              <motion.path
                key={`ytick-${idx}`}
                d={`M 97,${yVal} L 103,${yVal}`}
                stroke="#00A85A"
                strokeWidth="0.8"
                opacity="0.22"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.95,
                  duration: 0.2,
                }}
              />
            ))}

            {/* Axis Labels (X - Axis, Y - Axis) */}
            <motion.text
              x="450"
              y="88"
              fill="#00A85A"
              fontSize="8.5"
              fontFamily="monospace"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 1.15, duration: 0.2 }}
            >
              X - Axis
            </motion.text>
            <motion.text
              x="110"
              y="34"
              fill="#00A85A"
              fontSize="8.5"
              fontFamily="monospace"
              textAnchor="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 1.15, duration: 0.2 }}
            >
              Y - Axis
            </motion.text>

            {/* Origin label "0" */}
            <motion.text
              x="92"
              y="112"
              fill="#00A85A"
              fontSize="8.5"
              fontFamily="monospace"
              fontStyle="italic"
              textAnchor="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 1.35, duration: 0.2 }}
            >
              0
            </motion.text>

            {/* Y-axis value labels (1 and -1) */}
            <motion.text
              x="92"
              y="68"
              fill="#00A85A"
              fontSize="8"
              fontFamily="monospace"
              fontStyle="italic"
              textAnchor="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 1.35, duration: 0.2 }}
            >
              1
            </motion.text>
            <motion.text
              x="92"
              y="138"
              fill="#00A85A"
              fontSize="8"
              fontFamily="monospace"
              fontStyle="italic"
              textAnchor="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 1.35, duration: 0.2 }}
            >
              -1
            </motion.text>

            {/* X-axis simple math labels */}
            <motion.text
              x="250"
              y="114"
              fill="#00A85A"
              fontSize="8"
              fontFamily="monospace"
              fontStyle="italic"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 1.35, duration: 0.2 }}
            >
              π
            </motion.text>
            <motion.text
              x="400"
              y="114"
              fill="#00A85A"
              fontSize="8"
              fontFamily="monospace"
              fontStyle="italic"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 1.35, duration: 0.2 }}
            >
              2π
            </motion.text>

            {/* X-axis fraction label: π/2 */}
            <g>
              {/* Numerator */}
              <motion.text
                x="175"
                y="114"
                fill="#00A85A"
                fontSize="8"
                fontFamily="monospace"
                fontStyle="italic"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ delay: 1.35, duration: 0.2 }}
              >
                π
              </motion.text>
              {/* Divider */}
              <motion.path
                d="M 170,117 L 180,117"
                stroke="#00A85A"
                strokeWidth="0.8"
                opacity="0.35"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.35, duration: 0.2 }}
              />
              {/* Denominator */}
              <motion.text
                x="175"
                y="126"
                fill="#00A85A"
                fontSize="8"
                fontFamily="monospace"
                fontStyle="italic"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ delay: 1.35, duration: 0.2 }}
              >
                2
              </motion.text>
            </g>

            {/* X-axis fraction label: 3π/2 */}
            <g>
              {/* Numerator */}
              <motion.text
                x="325"
                y="114"
                fill="#00A85A"
                fontSize="8"
                fontFamily="monospace"
                fontStyle="italic"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ delay: 1.35, duration: 0.2 }}
              >
                3π
              </motion.text>
              {/* Divider */}
              <motion.path
                d="M 319,117 L 331,117"
                stroke="#00A85A"
                strokeWidth="0.8"
                opacity="0.35"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.35, duration: 0.2 }}
              />
              {/* Denominator */}
              <motion.text
                x="325"
                y="126"
                fill="#00A85A"
                fontSize="8"
                fontFamily="monospace"
                fontStyle="italic"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ delay: 1.35, duration: 0.2 }}
              >
                2
              </motion.text>
            </g>

            {/* Dot Nodes on the Sine Wave */}
            {[
              { cx: 100, cy: 100 },
              { cx: 175, cy: 65 },
              { cx: 250, cy: 100 },
              { cx: 325, cy: 135 },
              { cx: 400, cy: 100 }
            ].map((pt, idx) => (
              <motion.circle
                key={`dot-${idx}`}
                cx={pt.cx}
                cy={pt.cy}
                r="2.5"
                fill="#00A85A"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ delay: 1.35, duration: 0.2 }}
              />
            ))}

            {/* Sine wave */}
            <motion.path
              d={SINE_WAVE_PATH}
              stroke="url(#energyGlow)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              filter="url(#sineGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 1.55,
                duration: 1.1,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>

        {/* Top Spacer to replace status bar */}
        <div className="h-6" />

        {/* Floating Science Background Elements */}
        {mounted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Top Left: Hexagonal chemistry structure */}
            <motion.div
              initial={{ x: 0, y: 0 }}
              animate={{ y: [-4, 4, -4], x: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute top-14 left-8 text-[#00ff88]/25 filter blur-[0.4px]"
            >
              <svg width="64" height="64" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20,10 L40,21.5 L40,45 L20,56.5 L0,45 L0,21.5 Z M40,21.5 L60,10 L80,21.5 L80,45 L60,56.5 L40,45" />
                <circle cx="20" cy="33" r="8" strokeDasharray="2 2" />
              </svg>
            </motion.div>

            {/* Upper Left: DNA double helix */}
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ y: [-3, 3, -3], rotate: [-18, -22, -18] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="absolute top-32 left-3 text-[#00ff88]/20 filter blur-[0.3px]"
            >
              <svg width="90" height="40" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M10,25 C25,5 35,45 50,25 C65,5 75,45 90,25" />
                <path d="M10,25 C25,45 35,5 50,25 C65,45 75,5 90,25" strokeDasharray="1.5 1.5" />
                <line x1="20" y1="16" x2="20" y2="34" />
                <line x1="32" y1="13" x2="32" y2="37" />
                <line x1="44" y1="18" x2="44" y2="32" />
                <line x1="56" y1="32" x2="56" y2="18" />
                <line x1="68" y1="37" x2="68" y2="13" />
                <line x1="80" y1="34" x2="80" y2="16" />
              </svg>
            </motion.div>

            {/* Upper Center: Constellation/star network */}
            <motion.div
              animate={{ opacity: [0.25, 0.45, 0.25] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-16 right-[120px] text-[#00ff88]/25"
            >
              <svg width="65" height="50" viewBox="0 0 70 60" fill="none" stroke="currentColor" strokeWidth="0.8">
                <circle cx="15" cy="45" r="2.5" fill="currentColor" />
                <circle cx="35" cy="15" r="2" fill="currentColor" />
                <circle cx="58" cy="28" r="2.5" fill="currentColor" />
                <circle cx="48" cy="52" r="2.5" fill="currentColor" />
                <line x1="15" y1="45" x2="35" y2="15" />
                <line x1="35" y1="15" x2="58" y2="28" />
                <line x1="58" y1="28" x2="48" y2="52" />
                <line x1="48" y1="52" x2="15" y2="45" />
              </svg>
            </motion.div>

            {/* Upper Right: Atomic orbit illustration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="absolute top-24 right-4 text-[#00ff88]/30 filter blur-[0.2px]"
            >
              <svg width="85" height="85" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(30 50 50)" />
                <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(110 50 50)" />
                <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(-50 50 50)" />
                <circle cx="50" cy="50" r="5" fill="#00ff88" />
              </svg>
            </motion.div>

            {/* Middle Left: Formula "E = mc²" */}
            <motion.div
              animate={{ y: [-2, 2, -2], x: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
              className="absolute top-[28%] left-8 text-emerald-400/35 font-mono text-[14px] font-bold tracking-widest filter blur-[0.2px]"
            >
              E = mc²
            </motion.div>

            {/* Middle Left Lower: Mathematical graph with x/y axis */}
            <motion.div
              animate={{ opacity: [0.25, 0.4, 0.25] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute top-[41%] left-5 text-[#00ff88]/20 filter blur-[0.3px]"
            >
              <svg width="90" height="70" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 5 L12 70 L95 70" />
                <path d="M9 12 L12 5 L15 12" />
                <path d="M88 67 L95 70 L88 73" />
                <text x="5" y="14" fill="currentColor" fontSize="8" fontStyle="italic">y</text>
                <text x="90" y="78" fill="currentColor" fontSize="8" fontStyle="italic">x</text>
                <path d="M12 55 Q 35 15, 55 50 T 90 25" strokeWidth="1.5" />
              </svg>
            </motion.div>

            {/* Middle Right: Formula "C₆H₁₂O₆" */}
            <motion.div
              animate={{ y: [2, -2, 2] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
              className="absolute top-[43%] right-5 text-emerald-400/35 font-mono text-[12px] font-bold tracking-widest"
            >
              C₆H₁₂O₆
            </motion.div>

            {/* Lower Right: Laboratory flask */}
            <motion.div
              animate={{ y: [4, -4, 4], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-[50%] right-8 text-[#00ff88]/25 filter blur-[0.2px]"
            >
              <svg width="55" height="65" viewBox="0 0 60 70" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M25 8 L35 8 M27 8 L27 22 L46 56 C49 61, 46 65, 40 65 L20 65 C14 65, 11 61, 14 56 L33 22 L33 8" />
                <path d="M16 52 Q 30 48, 44 52" strokeWidth="0.8" />
                <circle cx="24" cy="44" r="1.5" fill="currentColor" />
                <circle cx="36" cy="38" r="1" fill="currentColor" />
              </svg>
            </motion.div>

            {/* Bottom Left: Open glowing book */}
            <motion.div
              animate={{ rotate: [-8, -11, -8], y: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="absolute bottom-[24%] left-[-15px] text-[#00ff88]/25 filter blur-[0.4px]"
            >
              <svg width="115" height="85" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M50 70 C 35 60, 15 65, 5 70 L5 20 C 15 15, 35 10, 50 25 C 65 10, 85 15, 95 20 L95 70 C 85 65, 65 60, 50 70 Z" />
                <path d="M50 25 L50 70" />
                <path d="M12 28 C22 25, 42 23, 47 30 M12 38 C22 35, 42 33, 47 40 M12 48 C22 45, 42 43, 47 50" />
                <path d="M88 28 C78 25, 58 23, 53 30 M88 38 C78 35, 58 33, 53 40 M88 48 C78 45, 58 43, 53 50" />
              </svg>
            </motion.div>

            {/* Bottom Right: Stack of books */}
            <motion.div
              animate={{ y: [3, -3, 3], rotate: [2, -2, 2] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute bottom-[25%] right-[-10px] text-[#00ff88]/25 filter blur-[0.4px]"
            >
              <svg width="110" height="90" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1">
                {/* Top tilted book */}
                <path d="M15 15 L75 10 L85 20 L25 25 Z" />
                <path d="M85 20 L80 25 L25 30 L25 25" />
                {/* Middle book */}
                <rect x="10" y="28" width="70" height="12" rx="1.5" />
                <line x1="10" y1="34" x2="80" y2="34" />
                {/* Bottom book */}
                <rect x="5" y="44" width="80" height="14" rx="2" />
                <line x1="5" y1="51" x2="85" y2="51" />
              </svg>
            </motion.div>
          </div>
        )}
          </>
        )}

        {view === "welcome" && (
          <div className="h-6" />
        )}

        {view === "welcome" ? (
          <div className="relative flex-1 flex flex-col justify-between px-6 pb-6 pt-2 z-10">
          
          {/* Logo Centerpiece */}
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[350px]">
            {/* orbit rings */}
            <div className="absolute w-[280px] h-[280px] border border-emerald-400/5 rounded-full flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                className="absolute w-[280px] h-[280px] border border-dashed border-[#00ff88]/15 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute w-[240px] h-[240px] border border-dotted border-[#00ff88]/20 rounded-full"
              />
              <div className="absolute w-[200px] h-[200px] border border-emerald-400/10 rounded-full" />
            </div>

            {/* Glowing atmosphere backing (increased glow by 40%+) */}
            <div className="absolute w-[240px] h-[240px] rounded-full bg-emerald-400/30 blur-3xl pointer-events-none opacity-90 animate-[pulse_4s_ease-in-out_infinite]" />
            <div className="absolute w-[180px] h-[180px] rounded-full bg-emerald-500/35 blur-2xl pointer-events-none opacity-85" />

            {/* Central Badge */}
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 flex h-[135px] w-[135px] items-center justify-center rounded-full bg-black border border-emerald-400/40 shadow-[0_0_35px_rgba(0,255,136,0.3)] overflow-hidden"
            >
              <Image
                src="/scigeeks icon on black.png"
                alt="SciGeeks Logo"
                width={135}
                height={135}
                className="object-cover scale-110 filter drop-shadow-[0_0_20px_#00ff88]"
                priority
              />
            </motion.div>
          </div>

          {/* Typography and Actions */}
          <div className="flex flex-col items-center text-center mt-auto w-full px-2">
            {/* Title */}
            <h1 className="text-white text-[44px] font-black tracking-tight leading-tight select-none">
              Welcome to SciGeeks
            </h1>
            
            {/* Subtitle */}
            <div className="mt-5 mb-5 flex flex-col items-center gap-y-4 select-none">
              {/* Line 1: India's */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-[20px] font-bold text-white text-center leading-snug tracking-tight max-w-[320px]"
              >
                India's
              </motion.span>

              {/* Line 2: No.1 Badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut", delay: 0.2 }}
                className="inline-flex items-center justify-center px-[16px] py-[6px] rounded-full border border-[#00ff88]/30 bg-black/40 shadow-[0_0_12px_rgba(0,255,136,0.12)]"
              >
                <span className="text-[15px] font-semibold text-white tracking-wide text-center">
                  No.1
                </span>
              </motion.div>

              {/* Line 3: AI-Driven Science Platform */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut", delay: 0.4 }}
                className="text-[20px] font-bold text-white text-center leading-snug tracking-tight max-w-[320px]"
              >
                AI-Driven Science Platform
              </motion.span>
            </div>

            {/* Create Account Action (Students) */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setView("options")}
              className="mt-6 h-[60px] w-full bg-white text-black rounded-[18px] font-bold text-[17px] shadow-[0_4px_25px_rgba(255,255,255,0.12)] hover:bg-white/95 transition-all duration-200 cursor-pointer"
            >
              Create Student Account
            </motion.button>

            {/* Teacher Sign Up / Log In Section */}
            <div className="w-full mt-3 p-3 rounded-[18px] bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between shadow-[0_4px_20px_rgba(0,255,136,0.06)]">
              <div className="flex flex-col items-start pl-1 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Teacher Portal</span>
                <span className="text-[13px] font-semibold text-white/90">Educator Account</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/teacher/signup"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[12.5px] rounded-xl transition-all shadow-sm"
                >
                  Teacher Sign Up
                </Link>
                <Link
                  href="/teacher/login"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-[12.5px] rounded-xl border border-white/20 transition-all"
                >
                  Log In
                </Link>
              </div>
            </div>

            {/* Footer Sign in info */}
            <p className="mt-4 text-[14px] text-white/70 select-none">
              Already have a student account?{" "}
              <Link href="/login" className="font-bold text-white hover:underline transition-all">
                Student Log in
              </Link>
            </p>

            {/* iPhone Home Bar Indicator */}
            <div className="mt-6 flex justify-center w-full">
              <div className="h-[5px] w-36 rounded-full bg-white/40" />
            </div>
          </div>

        </div>
        ) : view === "options" ? (
          <SignupOptions
            onBack={() => setView("welcome")}
            onEmailClick={() => setView("email")}
            onLinkedInLogin={handleLinkedInLogin}
            onGoogleLogin={handleGoogleLogin}
            onPhoneClick={() => router.push("/login?view=phone&intent=signup")}
          />

        ) : view === "email" ? (
          <SignupEmail
            onBack={() => setView("options")}
            onSubmit={(emailStr, nextStep) => {
              setEmail(emailStr);
              if (nextStep === "complete_profile") {
                setView("password");
              } else {
                showToast("Verification link has been sent to your email.");
                setView("verification");
              }
            }}
          />
        ) : view === "verification" ? (
          <SignupVerification
            email={email}
            onBack={() => setView("email")}
            onSuccess={() => setView("password")}
          />
        ) : view === "password" ? (
          <SignupPassword
            email={email}
            onBack={() => setView("verification")}
            onSuccess={() => setView("success")}
          />
        ) : (
          /* Step 3 - Welcome / Profile Setup Screen */
          <div className="w-full flex-1 flex flex-col justify-between px-6 pb-6 pt-2 select-none antialiased bg-white text-black h-full">
            <div className="w-full flex flex-col">
              {/* Top Header */}
              <div className="relative flex items-center justify-between w-full pt-4 pb-1">
                <div className="w-10 h-10" />
                <h2 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-bold text-black tracking-tight font-sans whitespace-nowrap">
                  Registration Complete
                </h2>
                <div className="w-10 h-10" />
              </div>

              {/* Progress Indicator showing Step 3 */}
              <ProgressIndicator currentStep={3} totalSteps={3} activeColor="bg-[#0da651]" />

              {/* Step 3 Content */}
              <div className="w-full flex flex-col items-center mt-12 text-center px-2">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 relative shadow-lg shadow-emerald-100/50"
                >
                  <PartyPopper className="w-10 h-10" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute -inset-2 rounded-full border border-dashed border-emerald-400/30"
                  />
                </motion.div>

                <h1 className="text-black text-[28px] font-extrabold tracking-tight font-sans mb-3">
                  You are all set!
                </h1>

                <p className="text-gray-600 text-[15px] leading-relaxed font-medium mb-8 max-w-[280px]">
                  Your email has been verified successfully. Welcome to SciGeeks! Let&apos;s get started on your learning journey.
                </p>
              </div>
            </div>

            {/* Bottom Actions and Footer */}
            <div className="w-full flex flex-col mt-auto">
              <Button
                onClick={() => {
                  router.push("/dashboard");
                }}
                className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                Go to Dashboard
              </Button>

              {/* Legal Footer */}
              <div className="flex flex-col items-center mt-8">
                <p className="text-[13px] text-gray-500 text-center max-w-[285px] leading-relaxed font-medium select-none">
                  By using SciGeeks, you agree to the{" "}
                  <br className="xs:hidden" />
                  <a href="#terms" className="font-bold text-gray-800 hover:underline transition-all">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#privacy" className="font-bold text-gray-800 hover:underline transition-all">
                    Privacy Policy
                  </a>
                  .
                </p>

                {/* iPhone Home Bar Indicator */}
                <div className="mt-6 flex justify-center w-full">
                  <div className="h-[5px] w-36 rounded-full bg-gray-300" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CreateAccount() {
  return (
    <Suspense fallback={null}>
      <CreateAccountContent />
    </Suspense>
  );
}