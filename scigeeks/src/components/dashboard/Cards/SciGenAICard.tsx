"use client";

import React from "react";
import { useRouter } from "next/navigation";

export const SciGenAICard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative w-full p-5 rounded-[28px] bg-gradient-to-br from-[#0a1b12] via-[#08130e] to-[#050b08] border border-[#143020]/60 overflow-hidden shadow-lg my-2 group flex justify-between items-center">
      {/* Background Radial Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00E676]/10 blur-3xl pointer-events-none group-hover:bg-[#00E676]/15 transition-all duration-500" />

      {/* Content Side */}
      <div className="flex flex-col items-start gap-3 max-w-[62%] relative z-10">
        {/* Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
          <span>Online 24/7</span>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Meet SciGenAI
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Your personal AI tutor available anytime to explain, quiz and guide you.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => router.push("/ai")}
          className="px-5 py-2.5 rounded-2xl bg-[#00E676] text-black font-bold text-xs shadow-[0_0_15px_rgba(0,230,118,0.3)] hover:shadow-[0_0_22px_rgba(0,230,118,0.5)] hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer"
        >
          Start Chatting
        </button>
      </div>

      {/* SciBot Robot Illustration Side */}
      <div className="relative w-28 h-28 shrink-0 flex items-center justify-center z-10">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full transform group-hover:translate-y-[-2px] transition-transform duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antennas / Side Ears (Pink/Magenta) */}
          <rect x="8" y="52" width="6" height="16" rx="3" fill="#ec4899" />
          <circle cx="11" cy="46" r="5" fill="#f472b6" />
          
          <rect x="106" y="52" width="6" height="16" rx="3" fill="#ec4899" />
          <circle cx="109" cy="46" r="5" fill="#f472b6" />
          
          {/* Main Ear connectors */}
          <rect x="14" y="56" width="6" height="8" rx="2" fill="#4b5563" />
          <rect x="100" y="56" width="6" height="8" rx="2" fill="#4b5563" />

          {/* Robot Head Body */}
          <rect x="18" y="24" width="84" height="72" rx="28" fill="#d1d5db" />
          {/* Inner metallic rim */}
          <rect x="22" y="28" width="76" height="64" rx="24" fill="#e5e7eb" />
          
          {/* Screen Face (Dark screen) */}
          <rect x="28" y="38" width="64" height="40" rx="14" fill="#1f2937" />
          
          {/* Eyes (Glowing Light Blue Pills) */}
          <rect x="38" y="50" width="12" height="16" rx="6" fill="#06b6d4" className="animate-pulse" />
          <rect x="70" y="50" width="12" height="16" rx="6" fill="#06b6d4" className="animate-pulse" />

          {/* Mouth (Dark Grey Slot) */}
          <rect x="48" y="82" width="24" height="6" rx="3" fill="#4b5563" />
          
          {/* Neck */}
          <rect x="46" y="96" width="28" height="12" rx="4" fill="#9ca3af" />
          {/* Shoulders / Base */}
          <path d="M30 108 H90 C95 108 100 112 100 118 V120 H20 V118 C20 112 25 108 30 108 Z" fill="#6b7280" />
        </svg>
      </div>
    </div>
  );
};

export default SciGenAICard;
