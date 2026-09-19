"use client";

import React from "react";
import { Radio } from "lucide-react";
import { LiveClass } from "@/types/dashboard";

interface LiveClassCardProps {
  liveClass: LiveClass;
  onClick?: () => void;
}

export const LiveClassCard: React.FC<LiveClassCardProps> = ({
  liveClass,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex-1 flex flex-col p-4 rounded-[24px] bg-[#121212] border border-neutral-800/80 hover:border-neutral-700/80 active:scale-[0.98] transition-all duration-200 cursor-pointer group"
    >
      {/* Live Soon Badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
          Live Soon
        </span>
      </div>

      {/* Class Title */}
      <h4 className="text-[14px] font-bold text-white leading-snug group-hover:text-rose-400 transition-colors duration-150 line-clamp-1 mb-2">
        {liveClass.title}
      </h4>

      {/* Subtext replacement with Clock and "Coming Soon" */}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-neutral-900">
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
          <Radio className="w-3.5 h-3.5" />
        </div>
        <span className="text-[11px] font-bold text-neutral-400">
          Coming Soon
        </span>
      </div>
    </div>
  );
};

export default LiveClassCard;
