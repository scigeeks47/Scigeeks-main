"use client";

import React from "react";
import { Bell } from "lucide-react";

interface NotificationButtonProps {
  hasUnread?: boolean;
  onClick?: () => void;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  hasUnread = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notifications"
      className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-[#121212] border border-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all duration-200 backdrop-blur-md group shadow-sm shrink-0"
    >
      <Bell className="w-4 h-4 transition-transform group-hover:scale-110" />
      {hasUnread && (
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]" />
      )}
    </button>
  );
};

export default NotificationButton;
