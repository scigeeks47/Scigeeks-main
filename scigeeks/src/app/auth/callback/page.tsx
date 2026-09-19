"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      let session = null;
      let user = null;

      // 1. Try to exchange the code if it exists in the URL
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }
          session = data.session;
          user = data.user;
        } catch (err: any) {
          console.warn("Code exchange failed, trying fallback to active session:", err);
          // If code exchange failed (e.g. link expired or clicked multiple times),
          // let's check if we already have an active session.
          const { data: { session: activeSession } } = await supabase.auth.getSession();
          if (activeSession) {
            session = activeSession;
            user = activeSession.user;
          } else {
            // No active session and exchange failed -> throw the original error
            const displayError = err.message?.includes("expired") || err.message?.includes("flow state")
              ? "The verification link has expired or is invalid. Please request a new one."
              : (err.message || "Authentication failed.");
            setErrorMsg(displayError);
            setLoading(false);
            return;
          }
        }
      } else {
        // No code in URL, check if there's an active session
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        if (activeSession) {
          session = activeSession;
          user = activeSession.user;
        } else {
          router.push("/");
          return;
        }
      }

      // 2. We have a session and user, process authentication
      if (user) {
        try {
          const email = user.email;
          const provider = user.app_metadata?.provider;
          const isOAuth = provider && provider !== "email";
          
          // Determine if they already have a name (OAuth, phone, or completed signup)
          const name = user.user_metadata?.full_name || user.user_metadata?.name || (isOAuth ? (user.email?.split("@")[0] || "User") : null);

          // Always notify the original signup tab that verification succeeded
          localStorage.setItem("scigeeks_signup_verified", "true");

          if (name) {
            const intent = searchParams.get("intent") || "login";
            const type = searchParams.get("type");
            const token = session?.access_token;

            let userRole = type === "teacher" ? "teacher" : null;

            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

            if (intent !== "signup" && type !== "teacher") {
              // Verify profile exists on backend
              const profileRes = await fetch(`${apiBase}/api/profile`, {
                headers: {
                  ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                },
              });
              if (!profileRes.ok) {
                await supabase.auth.signOut();
                router.push("/login?error=profile_not_found");
                return;
              }
              const profileData = await profileRes.json();
              if (profileData.success && profileData.user?.role) {
                userRole = profileData.user.role;
              }
            } else {
              // Sync account creation on the backend
              const endpoint = type === "teacher"
                ? `${apiBase}/api/auth/create-teacher-account`
                : `${apiBase}/api/auth/create-account`;


              const payload = { name, email, id: user.id };

              const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
              });
              
              const resData = await res.json();
              if (!res.ok || !resData.success) {
                throw new Error(resData.message || "Failed to create database account");
              }
              if (type === "teacher") {
                userRole = "teacher";
              }
            }
            
            if (userRole === "teacher" || type === "teacher") {
              router.push("/teacher/dashboard");
            } else {
              router.push("/dashboard");
            }
            return;
          } else {
            // New email signup: user has no name yet.
            // Redirect the user directly to the password creation view on the active tab/device.
            router.push(`/?view=password&email=${encodeURIComponent(email || "")}`);
            return;
          }
        } catch (err: any) {
          console.error("Auth callback process error:", err);
          setErrorMsg(err.message || "An error occurred during authentication.");
          setLoading(false);
          return;
        }
      }
    };

    handleAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0b0b0b] text-white font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4" />
        <p className="text-[16px] font-semibold text-gray-300">Setting up your secure session...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0b0b0b] text-white font-sans px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 font-bold text-2xl font-sans">
          !
        </div>
        <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
        <p className="text-gray-400 max-w-[320px] mb-6">{errorMsg}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all text-sm cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0b0b0b] text-white font-sans px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 font-bold text-2xl font-sans">
          ✓
        </div>
        <h1 className="text-xl font-bold mb-2">Email Verified</h1>
        <p className="text-gray-400 max-w-[320px]">Email verified successfully. You may return to the previous tab.</p>
      </div>
    );
  }

  return null;
}