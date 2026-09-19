"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordContent() {
  const router = useRouter();

  // Recovery verification states
  const [isValidating, setIsValidating] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  // Form states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");

  // Helper to extract tokens from hash or query string
  const getTokensFromUrl = () => {
    let accessToken = "";
    let refreshToken = "";

    if (typeof window !== "undefined") {
      // 1. Try Hash parameters (Supabase default)
      const hash = window.location.hash;
      if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1));
        accessToken = hashParams.get("access_token") || "";
        refreshToken = hashParams.get("refresh_token") || "";
      }

      // 2. Try Query parameters (fallback)
      if (!accessToken || !refreshToken) {
        const search = window.location.search;
        if (search) {
          const searchParams = new URLSearchParams(search);
          accessToken = searchParams.get("access_token") || "";
          refreshToken = searchParams.get("refresh_token") || "";
        }
      }
    }

    return { accessToken, refreshToken };
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const { accessToken, refreshToken } = getTokensFromUrl();

        // If tokens are in URL, set the session manually
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setVerificationError(`Token verification failed: ${error.message}`);
            setIsValidating(false);
            return;
          }
        }

        // Get the active session to verify recovery status
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          setVerificationError(`Session retrieval failed: ${sessionError.message}`);
          setIsValidating(false);
          return;
        }

        if (!session) {
          setVerificationError(
            "No active recovery session found. Please make sure you clicked the link in your password recovery email, or request a new reset link."
          );
          setIsValidating(false);
          return;
        }

        // Recovery session detected and validated
        setIsVerified(true);
      } catch (err: any) {
        console.error("Error verifying recovery session:", err);
        setVerificationError(err.message || "An unexpected error occurred during verification.");
      } finally {
        setIsValidating(false);
      }
    };

    verifySession();
  }, []);

  const handleBack = () => {
    router.push("/login?view=email");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    // Validate inputs
    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setFormError(error.message);
      } else {
        setSuccessMsg("Password successfully reset!");
        setTimeout(() => {
          router.push("/login?view=email");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error updating password:", err);
      setFormError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden overflow-y-auto py-0 md:py-8 font-sans select-none antialiased bg-[#0b0b0b]">
      {/* Background ambient glows for desktop view */}
      <div className="absolute inset-0 bg-[#000000] z-0 hidden md:block" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-[#00ff88]/5 blur-[130px] pointer-events-none z-0 hidden md:block" />
      <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-[#00ff88]/8 blur-[120px] pointer-events-none z-0 hidden md:block" />

      {/* Phone Container mockup on large screens, standard full-viewport on mobile */}
      <div className="relative w-full max-w-[420px] min-h-screen md:min-h-0 md:h-[900px] md:rounded-[48px] overflow-hidden flex flex-col justify-between z-10 bg-white md:border md:border-gray-200 md:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        
        {/* Top spacer */}
        <div className="h-4 bg-white" />

        <div className="flex-1 flex flex-col justify-between bg-white relative">
          
          <div className="w-full flex flex-col">
            {/* Header: Back to Login Button & Title */}
            <div className="relative flex items-center justify-between w-full px-6 pt-4 pb-2 border-b border-gray-100/50">
              <button
                type="button"
                onClick={handleBack}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center text-black"
                aria-label="Back to login"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <h2 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-bold text-black tracking-tight font-sans whitespace-nowrap">
                Reset Password
              </h2>
              {/* Spacer to balance title */}
              <div className="w-10 h-10" />
            </div>

            {/* Validation / Loading States */}
            <AnimatePresence mode="wait">
              {isValidating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center mt-20 px-6 text-center"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
                  <p className="text-gray-600 font-medium text-[15px]">Verifying recovery link...</p>
                </motion.div>
              ) : verificationError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center mt-12 px-6 text-center"
                >
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-[16px] text-[14px] font-medium leading-relaxed">
                    {verificationError}
                  </div>
                  <Button
                    onClick={handleBack}
                    className="mt-4 w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold hover:bg-[#022718] active:translate-y-px transition-all"
                  >
                    Back to Login
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  {/* Title / Description */}
                  <div className="text-center mt-8 mb-6 px-6">
                    <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                      Please enter your new password below.
                    </p>
                  </div>

                  {/* Reset Password Form */}
                  <form onSubmit={handleSubmit} className="w-full flex flex-col px-6 mt-4">
                    {/* Success State */}
                    {successMsg && (
                      <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-[12px] text-[14px] font-medium text-center flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        {successMsg}
                      </div>
                    )}

                    {/* Error State */}
                    {formError && (
                      <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-[14px] font-medium text-center">
                        {formError}
                      </div>
                    )}

                    {/* New Password Field */}
                    <label
                      htmlFor="new-password-input"
                      className="text-gray-800 text-[14px] font-semibold tracking-wide mb-2 pl-0.5"
                    >
                      New Password
                    </label>
                    <div className="relative w-full mb-5">
                      <Input
                        id="new-password-input"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setFormError("");
                        }}
                        required
                        disabled={submitting || !!successMsg}
                        placeholder="Minimum 8 characters"
                        className="w-full h-[48px] pl-4 pr-12 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        disabled={submitting || !!successMsg}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-500" strokeWidth={2} />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-500" strokeWidth={2} />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password Field */}
                    <label
                      htmlFor="confirm-password-input"
                      className="text-gray-800 text-[14px] font-semibold tracking-wide mb-2 pl-0.5"
                    >
                      Confirm Password
                    </label>
                    <div className="relative w-full mb-8">
                      <Input
                        id="confirm-password-input"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setFormError("");
                        }}
                        required
                        disabled={submitting || !!successMsg}
                        placeholder="Re-enter password"
                        className="w-full h-[48px] pl-4 pr-12 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        disabled={submitting || !!successMsg}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-500" strokeWidth={2} />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-500" strokeWidth={2} />
                        )}
                      </button>
                    </div>

                    {/* Primary Button: Update Password */}
                    <Button
                      type="submit"
                      disabled={submitting || !!successMsg}
                      className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center disabled:opacity-75 disabled:pointer-events-none"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      Update Password
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer & iPhone Home Indicator */}
          <div className="mt-auto pb-6 flex flex-col items-center">
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

        {/* Bottom spacer */}
        <div className="h-4 bg-white" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
