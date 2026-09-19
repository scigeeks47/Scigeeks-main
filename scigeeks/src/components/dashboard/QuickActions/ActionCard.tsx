"use client";

import React from "react";

interface ActionCardProps {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  icon,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-3.5 w-full p-4 rounded-[24px] bg-[#121212] border border-neutral-800/80 text-left hover:border-neutral-700 hover:bg-[#161616] active:scale-[0.98] transition-all duration-200 shadow-md group ${className}`}
    >
      <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#17221b] border border-[#213829]/60 text-[#00E676] group-hover:scale-105 transition-transform duration-200 shrink-0">
        {icon || <div className="w-5 h-5 rounded-lg bg-[#00E676]/20" />}
      </div>
      <span className="text-sm font-bold text-white tracking-tight leading-snug">
        {title}
      </span>
    </button>
  );
};

export default ActionCard;
