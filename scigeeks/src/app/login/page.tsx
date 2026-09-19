"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginEntry from "@/components/login/loginentry";
import LoginEmail from "@/components/login/loginemail";
import LoginPhone from "@/components/login/loginphone";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type LoginView = "entry" | "email" | "phone" | "success";

import { supabase } from "@/lib/supabaseClient";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const [view, setView] = useState<LoginView>(
    viewParam === "email" || viewParam === "entry" || viewParam === "phone" || viewParam === "success"
      ? (viewParam as LoginView)
      : "entry"
  );
  const errorParam = searchParams.get("error");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (errorParam === "profile_not_found") {
      setErrorMsg("Your account profile could not be found. Please contact support or create a new account.");
    }
  }, [errorParam]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If profile_not_found error is present in query, don't auto-redirect, sign out.
        if (errorParam === "profile_not_found") {
          await supabase.auth.signOut();
          return;
        }

        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await fetch(`${apiBase}/api/profile`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          if (res.ok) {
            const profileData = await res.json();
            if (profileData.success && profileData.user?.role === "teacher") {
              router.push("/teacher/dashboard");
              return;
            }
          }
        } catch (err) {
          console.error("Login session check profile fetch error:", err);
        }

        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router, errorParam]);

  const handleBack = () => {
    if (view === "entry") {
      router.push("/");
    } else if (view === "email" || view === "phone") {
      setView("entry");
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?intent=login`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("LinkedIn login error:", err);
      alert(err.message || "Failed to initiate LinkedIn login");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?intent=login`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google login error:", err);
      alert(err.message || "Failed to initiate Google login");
    }
  };

  const handleEmailClick = () => {
    setView("email");
  };

  const handleLoginSuccess = () => {
    setView("success");
  };

  const handlePhoneLogin = () => {
    setView("phone");
  };

  const handleGoToDashboard = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBase}/api/profile`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (res.ok) {
          const profileData = await res.json();
          if (profileData.success && profileData.user?.role === "teacher") {
            router.push("/teacher/dashboard");
            return;
          }
        }
      }
    } catch (err) {
      console.error("handleGoToDashboard profile fetch error:", err);
    }
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden overflow-y-auto py-0 md:py-8 font-sans select-none antialiased bg-[#0b0b0b]">
      {/* Background ambient glows for desktop */}
      <div className="absolute inset-0 bg-[#000000] z-0 hidden md:block" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-[#00ff88]/5 blur-[130px] pointer-events-none z-0 hidden md:block" />
      <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-[#00ff88]/8 blur-[120px] pointer-events-none z-0 hidden md:block" />

      {/* Phone Container mockup on large screens, standard full-viewport on mobile */}
      <div className="relative w-full max-w-[420px] min-h-screen md:min-h-0 md:h-[900px] md:rounded-[48px] overflow-hidden flex flex-col justify-between z-10 bg-white md:border md:border-gray-200 md:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        
        {/* Top spacer to align components */}
        <div className="h-4 bg-white" />

        <div className="flex-1 flex flex-col justify-between bg-white relative">
          {errorMsg && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-[14px] font-medium text-center">
              {errorMsg}
            </div>
          )}
          <AnimatePresence mode="wait">
            {view === "entry" && (
              <motion.div
                key="entry"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <LoginEntry
                  onBack={handleBack}
                  onEmailClick={handleEmailClick}
                  onLinkedInLogin={handleLinkedInLogin}
                  onGoogleLogin={handleGoogleLogin}
                  onPhoneLogin={handlePhoneLogin}
                />
              </motion.div>
            )}

            {view === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <LoginEmail
                  onBack={handleBack}
                  onSuccess={handleLoginSuccess}
                />
              </motion.div>
            )}

            {view === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <LoginPhone
                  onBack={handleBack}
                  onSuccess={handleLoginSuccess}
                  intent={searchParams.get("intent") || "login"}
                />
              </motion.div>
            )}

            {view === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full flex-1 flex flex-col justify-between px-6 pb-6 pt-2 bg-white text-black h-full"
              >
                <div className="w-full flex flex-col items-center mt-20 text-center px-2">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 relative shadow-lg shadow-emerald-100/50"
                  >
                    <PartyPopper className="w-10 h-10" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      className="absolute -inset-2 rounded-full border border-dashed border-emerald-400/30"
                    />
                  </motion.div>

                  <h1 className="text-black text-[28px] font-extrabold tracking-tight font-sans mb-3">
                    Welcome Back!
                  </h1>

                  <p className="text-gray-600 text-[15px] leading-relaxed font-medium mb-8 max-w-[280px]">
                    You have successfully logged into your account. Let&apos;s continue your learning journey.
                  </p>
                </div>

                <div className="w-full flex flex-col mt-auto">
                  <Button
                    onClick={handleGoToDashboard}
                    className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center"
                  >
                    Go to Dashboard
                  </Button>

                  <div className="flex flex-col items-center mt-8">
                    <p className="text-[13px] text-gray-500 text-center max-w-[285px] leading-relaxed font-medium select-none">
                      By using SciGeeks, you agree to the{" "}
                      <br className="xs:hidden" />
                      <a href="#terms" className="font-bold text-gray-800 hover:underline transition-all">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="#privacy" className="font-bold text-gray-800 hover:underline transition-all">
                        Privacy Policy
                      </a>
                      .
                    </p>

                    <div className="mt-6 flex justify-center w-full">
                      <div className="h-[5px] w-36 rounded-full bg-gray-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom space to align components */}
        <div className="h-4 bg-white" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
