import React from "react";
import DashboardPage from "@/components/dashboard/DashboardPage";
import { dashboardState } from "@/data/dashboard.mock";

export const metadata = {
  title: "Dashboard | SciGeeks",
  description: "AI-powered EdTech dashboard for SciGeeks.",
};

export default function Page() {
  return <DashboardPage data={dashboardState} />;
}
