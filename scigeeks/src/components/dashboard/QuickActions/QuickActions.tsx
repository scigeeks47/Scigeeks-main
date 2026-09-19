"use client";

import React from "react";
import { Sparkles, Compass, BookOpen } from "lucide-react";
import ActionCard from "./ActionCard";
import { QuickActionItem } from "@/types/dashboard";

interface QuickActionsProps {
  actions: QuickActionItem[];
  onActionClick?: (actionKey: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-[#00E676]" />;
      case "Compass":
        return <Compass className="w-5 h-5 text-[#00E676]" />;
      case "BookOpen":
        return <BookOpen className="w-5 h-5 text-[#00E676]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#00E676]" />;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 my-2">
      {actions.map((action) => (
        <ActionCard
          key={action.id}
          title={action.title}
          icon={getIcon(action.iconName)}
          onClick={() => onActionClick?.(action.actionKey)}
        />
      ))}
    </div>
  );
};

export default QuickActions;
