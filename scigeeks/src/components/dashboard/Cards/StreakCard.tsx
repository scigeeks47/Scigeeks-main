"use client";

import React from "react";
import { Flame, FlaskConical, Sparkles } from "lucide-react";
import { StreakData } from "@/types/dashboard";

interface StreakCardProps {
  streak?: StreakData;
  comingSoon?: boolean;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streak,
  comingSoon = true,
}) => {
  return (
    <div className="relative w-full p-5 rounded-[28px] bg-gradient-to-br from-[#0c1f15] via-[#09150e] to-[#070e0a] border border-[#1b3d29]/60 overflow-hidden shadow-lg my-2 group">
      {/* Background Radial Soft Green Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#00E676]/15 blur-3xl pointer-events-none group-hover:bg-[#00E676]/20 transition-all duration-500" />

      {/* Header Section */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#00E676] fill-[#00E676]/20" />
            {comingSoon ? (
              <span className="text-xl font-bold text-white tracking-tight">
                Daily Streak
              </span>
            ) : (
              <>
                <span className="text-2xl font-bold text-white tracking-tight">
                  {streak?.currentStreak ?? 0}
                </span>
                <span className="text-sm font-medium text-neutral-300">
                  Day Streak
                </span>
              </>
            )}
          </div>

          {comingSoon ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00E676]/15 border border-[#00E676]/30 text-[#00E676] text-xs font-semibold w-fit mt-0.5">
              <Sparkles className="w-3 h-3" />
              <span>Coming Soon</span>
            </div>
          ) : (
            <p className="text-xs font-semibold text-[#00E676] tracking-wide ml-0.5">
              {(streak?.weeklyXP ?? 0).toLocaleString()} XP this week
            </p>
          )}
        </div>

        {/* Floating Flask Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#142c1e]/90 border border-[#1f472e]/60 shadow-inner text-[#00E676] transform rotate-[-8deg] group-hover:rotate-0 transition-transform duration-300">
          <FlaskConical className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>

      {/* Body Content */}
      {comingSoon ? (
        <div className="mt-4 p-3.5 rounded-xl bg-[#09180f]/80 border border-[#153421]/50 relative z-10 backdrop-blur-sm">
          <p className="text-xs text-neutral-300/90 leading-relaxed font-normal">
            Track your learning consistency and earn streak rewards.
          </p>
        </div>
      ) : (
        <>
          {/* Active Weekly Goal Progress */}
          <div className="mt-5 relative z-10">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-neutral-400">Weekly Goal</span>
              <span className="text-white font-bold">
                {streak?.weeklyGoal ?? 0}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#0e2115] rounded-full overflow-hidden p-0.5 border border-[#193a26]">
              <div
                className="h-full bg-gradient-to-r from-[#00E676] to-[#40ff9f] rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_#00E676]"
                style={{
                  width: `${Math.min(
                    Math.max(streak?.weeklyGoal ?? 0, 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Motivational Quote */}
          {streak?.quote && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#09180f]/80 border border-[#153421]/50 relative z-10 backdrop-blur-sm">
              <p className="text-xs italic text-neutral-300/90 leading-relaxed font-normal">
                &quot;{streak.quote}&quot;
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StreakCard;
