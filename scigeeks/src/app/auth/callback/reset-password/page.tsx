"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main reset-password page, preserving any query or hash parameters
    const hash = window.location.hash;
    const search = window.location.search;
    router.replace(`/auth/reset-password${search}${hash}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0b0b0b] text-white font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium">Redirecting to password reset...</p>
      </div>
    </div>
  );
}
