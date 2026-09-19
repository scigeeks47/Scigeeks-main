"use client";

import React from "react";
import { Sparkles, BookOpen } from "lucide-react";
import { ContinueLearningData } from "@/types/dashboard";

interface ContinueLearningCardProps {
  course?: ContinueLearningData;
  comingSoon?: boolean;
  onContinue?: () => void;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  course,
  comingSoon = true,
  onContinue,
}) => {
  const progressPercent = course?.progress ?? 0;

  // SVG Circular math
  const radius = 26;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative w-full p-4 rounded-[28px] bg-[#121212] border border-neutral-800/80 my-2 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        {comingSoon ? (
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#17221b] border border-[#213829]/60 text-[#00E676] shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2]" />
          </div>
        ) : (
          /* SVG Circular Progress */
          <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
            <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
              <circle
                stroke="#1e2420"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#00E676"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white tracking-tighter">
              {progressPercent}%
            </span>
          </div>
        )}

        {/* Text Info */}
        <div className="flex flex-col gap-0.5 max-w-[170px]">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Continue Learning
          </span>
          {comingSoon ? (
            <>
              <div className="inline-flex items-center gap-1 text-[#00E676] text-xs font-bold my-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Coming Soon</span>
              </div>
              <p className="text-xs text-neutral-400 leading-snug">
                Resume your courses exactly where you left off.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-white leading-tight truncate">
                {course?.title}
              </h3>
              <p className="text-xs text-neutral-400 truncate">
                {course?.chapter}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={onContinue}
        disabled={comingSoon}
        className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 shrink-0 ${
          comingSoon
            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50"
            : "bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)] hover:shadow-[0_0_22px_rgba(0,230,118,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
        }`}
      >
        {comingSoon ? "Soon" : "Continue"}
      </button>
    </div>
  );
};

export default ContinueLearningCard;
