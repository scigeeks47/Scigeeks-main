"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

/**
 * Props and state interface definitions for the Forgot Password component.
 */
interface ResetPasswordState {
  email: string;
  submitting: boolean;
  successMsg: string;
  errorMsg: string;
  cooldown: number;
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  // State management for forgot password flow
  const [state, setState] = useState<ResetPasswordState>({
    email: "",
    submitting: false,
    successMsg: "",
    errorMsg: "",
    cooldown: 0,
  });

  // Countdown timer for disabling the "Send" (resend) button
  useEffect(() => {
    if (state.cooldown <= 0) return;
    
    const timer = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        cooldown: prev.cooldown - 1,
      }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.cooldown]);

  const handleBack = () => {
    router.push("/login?view=email");
  };

  /**
   * Helper function to validate email address format.
   */
  const validateEmail = (emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setState((prev) => ({ ...prev, errorMsg: "", successMsg: "" }));
    
    const trimmedEmail = state.email.trim();
    
    // Validation validation checks
    if (!trimmedEmail) {
      setState((prev) => ({ ...prev, errorMsg: "Email address is required." }));
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setState((prev) => ({ ...prev, errorMsg: "Please enter a valid email address." }));
      return;
    }

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      // Supabase logic for reset password
      const redirectToUrl = `${window.location.origin}/auth/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectToUrl,
      });

      if (error) {
        setState((prev) => ({
          ...prev,
          errorMsg: error.message,
          submitting: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          successMsg: "Password reset link sent. Please check your inbox.",
          cooldown: 60,
          submitting: false,
        }));
      }
    } catch (err) {
      console.error("Forgot password submission error:", err);
      setState((prev) => ({
        ...prev,
        errorMsg: "An unexpected error occurred. Please try again.",
        submitting: false,
      }));
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
          
          {/* Main Content Area */}
          <div className="w-full flex flex-col">
            {/* Header: Back Button & Title */}
            <div className="relative flex items-center justify-between w-full px-6 pt-4 pb-2 border-b border-gray-100/50">
              <button
                type="button"
                onClick={handleBack}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center text-black"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <h2 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-bold text-black tracking-tight font-sans whitespace-nowrap">
                Reset password
              </h2>
              {/* Spacer to balance title */}
              <div className="w-10 h-10" />
            </div>

            {/* Description Text */}
            <div className="text-center mt-8 mb-6 px-6">
              <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                We will email you<br />a link to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col px-6 mt-4">
              
              {/* Success State */}
              {state.successMsg && (
                <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-[12px] text-[14px] font-medium text-center">
                  {state.successMsg}
                </div>
              )}

              {/* Error State */}
              {state.errorMsg && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-[14px] font-medium text-center">
                  {state.errorMsg}
                </div>
              )}

              {/* Email Label */}
              <label
                htmlFor="reset-email-input"
                className="text-gray-800 text-[14px] font-semibold tracking-wide mb-2 pl-0.5"
              >
                Email
              </label>

              {/* Email Input */}
              <Input
                id="reset-email-input"
                type="text"
                value={state.email}
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    email: e.target.value,
                    errorMsg: "",
                  }));
                }}
                required
                disabled={state.submitting}
                placeholder="example@example"
                className="w-full h-[48px] px-4 mb-6 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
              />

              {/* Primary Send Button */}
              <Button
                type="submit"
                disabled={state.submitting || state.cooldown > 0}
                className="w-full h-[52px] bg-emerald-600 text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:bg-emerald-700 active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center disabled:opacity-75 disabled:pointer-events-none"
              >
                {state.submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {state.cooldown > 0 ? `Resend in ${state.cooldown}s` : "Send"}
              </Button>
            </form>
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
