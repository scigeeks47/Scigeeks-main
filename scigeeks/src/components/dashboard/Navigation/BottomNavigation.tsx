"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Bot, Users, Briefcase, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavTabItem } from "@/types/dashboard";

const DEFAULT_TABS: NavTabItem[] = [
  { id: "home", label: "Home", iconName: "Home" },
  { id: "ai", label: "AI", iconName: "Bot" },
  { id: "community", label: "Community", iconName: "Users" },
  { id: "jobs", label: "Jobs", iconName: "Briefcase" },
  { id: "profile", label: "Profile", iconName: "User" },
];

interface BottomNavigationProps {
  currentTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab = "home",
  onTabChange,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(currentTab);
  const [toast, setToast] = useState<string | null>(null);

  const handleTabClick = (tabId: string) => {
    if (tabId === "community" || tabId === "jobs") {
      setToast("Coming Soon");
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (tabId === "ai") {
      if (pathname !== "/ai") {
        router.push("/ai");
      }
      return;
    }

    if (tabId === "profile") {
      if (pathname !== "/profile") {
        router.push("/profile");
      }
      return;
    }

    if (tabId === "home") {
      if (pathname !== "/dashboard") {
        router.push("/dashboard");
      } else {
        setActiveTab(tabId);
        onTabChange?.(tabId);
      }
      return;
    }

    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const getIcon = (iconName: string, isActive: boolean) => {
    const iconProps = {
      className: `w-5 h-5 transition-transform duration-200 ${
        isActive ? "text-[#00E676] scale-110" : "text-neutral-400 group-hover:text-neutral-200"
      }`,
    };

    switch (iconName) {
      case "Home":
        return <Home {...iconProps} />;
      case "Bot":
        return <Bot {...iconProps} />;
      case "Users":
        return <Users {...iconProps} />;
      case "Briefcase":
        return <Briefcase {...iconProps} />;
      case "User":
        return <User {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#0c130f]/95 border border-[#1b3d29]/80 backdrop-blur-md text-[#00E676] px-5 py-2.5 rounded-full shadow-[0_8px_30px_rgba(0,230,118,0.15)] flex items-center gap-2 text-sm font-bold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe p-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-around w-full max-w-md px-3 py-3 rounded-[28px] bg-[#121212]/90 border border-neutral-800/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          {DEFAULT_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className="relative flex flex-col items-center justify-center gap-1.5 flex-1 py-1 group transition-all duration-200"
              >
                {/* Active Dot Indicator above tab label */}
                {isActive && (
                  <span className="absolute -top-1.5 w-1.5 h-1.5 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676] animate-pulse" />
                )}
                {getIcon(tab.iconName, isActive)}
                <span
                  className={`text-[11px] font-medium tracking-tight transition-colors duration-200 ${
                    isActive
                      ? "text-[#00E676] font-bold"
                      : "text-neutral-400 group-hover:text-neutral-200"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default BottomNavigation;
