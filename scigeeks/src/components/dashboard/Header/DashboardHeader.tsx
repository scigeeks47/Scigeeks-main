"use client";

import React from "react";
import Greeting from "./Greeting";
import NotificationButton from "./NotificationButton";
import ProfileAvatar from "./ProfileAvatar";
import { User } from "@/types/dashboard";

interface DashboardHeaderProps {
  user: User;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onNotificationClick,
  onProfileClick,
}) => {
  return (
    <header className="flex flex-col gap-3 pt-2 pb-1">
      <div className="flex items-start justify-between">
        <Greeting name={user.name} />

        <div className="flex items-center gap-3">
          <NotificationButton
            hasUnread={user.hasUnreadNotifications}
            onClick={onNotificationClick}
          />
          <ProfileAvatar
            name={user.name}
            email={user.email}
            avatarUrl={user.avatarUrl}
            onClick={onProfileClick}
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
