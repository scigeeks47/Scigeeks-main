"use client";

import React from "react";
import { Star, Dna, Atom } from "lucide-react";
import { Course } from "@/types/dashboard";

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const isBiology = course.thumbnail === "biology";
  
  // Custom diagonal stripe background styles depending on subject
  const thumbnailBg = isBiology
    ? "bg-gradient-to-br from-[#0c1f15] to-[#070e0a]"
    : "bg-gradient-to-br from-[#0c1324] to-[#07090e]";

  const stripeStyle = isBiology
    ? {
        backgroundImage: "repeating-linear-gradient(-45deg, #091710, #091710 10px, #0c2016 10px, #0c2016 20px)",
      }
    : {
        backgroundImage: "repeating-linear-gradient(-45deg, #0b111e, #0b111e 10px, #111a2e 10px, #111a2e 20px)",
      };

  // Badge styles based on difficulty
  const difficultyBadgeStyle =
    course.difficulty.toLowerCase() === "advanced"
      ? "text-rose-400 bg-rose-500/10 border border-rose-500/25"
      : "text-[#00E676] bg-[#00E676]/10 border border-[#00E676]/20";

  return (
    <div
      onClick={onClick}
      className="flex-1 flex flex-col rounded-[24px] bg-[#121212] border border-neutral-800/80 overflow-hidden shadow-lg hover:border-neutral-700/80 active:scale-[0.98] transition-all duration-200 cursor-pointer group"
    >
      {/* Thumbnail Area with stripes and icon */}
      <div className={`relative h-[110px] w-full ${thumbnailBg} flex items-center justify-center overflow-hidden`}>
        {/* Diagonal Stripes Overlay */}
        <div className="absolute inset-0 opacity-70" style={stripeStyle} />
        
        {/* Difficulty Badge floating at top left */}
        <div className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight z-10 ${difficultyBadgeStyle}`}>
          {course.difficulty}
        </div>

        {/* Icon representation */}
        <div className="relative z-10 flex items-center justify-center">
          {isBiology ? (
            <div className="relative">
              <Dna className="w-10 h-10 text-cyan-400 transform -rotate-12 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]" />
              <Dna className="w-10 h-10 text-pink-500 absolute top-0.5 left-0.5 transform rotate-12 opacity-80 mix-blend-screen drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <Atom className="w-6 h-6 text-purple-400 animate-spin-slow" />
            </div>
          )}
        </div>
      </div>

      {/* Info Content */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-1.5">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-[14px] font-bold text-white leading-snug group-hover:text-[#00E676] transition-colors duration-150 line-clamp-2 min-h-[40px]">
            {course.title}
          </h4>
          <span className="text-[11px] font-medium text-[#00E676] tracking-wide">
            Coming Soon
          </span>
        </div>

        {/* Bottom stats row */}
        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 pt-1.5 border-t border-neutral-900">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white">{course.rating.toFixed(1)}</span>
          </div>
          <span>{course.students}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
