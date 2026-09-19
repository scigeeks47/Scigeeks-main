"use client";

import React from "react";
import { Swords, Stethoscope, Rocket, Sparkles, Users } from "lucide-react";
import { Community } from "@/types/dashboard";

interface CommunityCardProps {
  community: Community;
  onClick?: () => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onClick,
}) => {
  const isComingSoon = community.status === "coming_soon";

  // Dynamic Icon selection
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Swords":
        return <Swords className="w-5 h-5 text-indigo-400" />;
      case "Stethoscope":
        return <Stethoscope className="w-5 h-5 text-emerald-400" />;
      case "Rocket":
        return <Rocket className="w-5 h-5 text-rose-400" />;
      default:
        return <Users className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3.5 min-w-[200px] max-w-[240px] p-3.5 rounded-[22px] bg-[#121212] border border-neutral-800/80 hover:border-neutral-700/80 active:scale-[0.98] transition-all duration-200 cursor-pointer shrink-0 group shadow-md"
    >
      {/* Icon Wrapper */}
      <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 group-hover:scale-105 transition-transform duration-200 shrink-0">
        {getIcon(community.iconName)}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 min-w-0">
        {isComingSoon ? (
          <>
            <h4 className="text-[13px] font-bold text-white tracking-tight leading-snug truncate">
              Coming Soon
            </h4>
            <div className="flex items-center gap-1 text-[#00E676] text-[10px] font-bold">
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
              <span>Join Soon</span>
            </div>
          </>
        ) : (
          <>
            <h4 className="text-[13px] font-bold text-white tracking-tight leading-snug truncate">
              {community.name}
            </h4>
            <span className="text-[11px] font-medium text-neutral-400 truncate">
              {community.memberCount} members
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityCard;
