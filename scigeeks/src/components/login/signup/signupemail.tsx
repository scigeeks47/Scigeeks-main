"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./progressindicator";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface SignupEmailProps {
  onBack: () => void;
  onSubmit?: (email: string, nextStep?: "verify_email" | "complete_profile") => void;
}

export default function SignupEmail({ onBack, onSubmit }: SignupEmailProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const email = inputRef.current?.value;

    if (!email) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${apiBase}/api/auth/check-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (data.nextStep === "complete_profile") {
          // Smoothly advance flow to Complete Profile step
          if (onSubmit) {
            onSubmit(email, "complete_profile");
          }
        } else if (data.nextStep === "verify_email") {
          if (data.state === "NEW_USER") {
            const tempPassword = `Temp_${window.crypto.randomUUID()}!`;
            const { error: signUpError } = await supabase.auth.signUp({
              email,
              password: tempPassword,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?email=${encodeURIComponent(email)}`,
              },
            });
            if (signUpError) throw signUpError;
          } else {
            const { error: resendError } = await supabase.auth.resend({
              type: "signup",
              email,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?email=${encodeURIComponent(email)}`,
              },
            });
            if (resendError) throw resendError;
          }

          if (onSubmit) {
            onSubmit(email, "verify_email");
          }
        }
      } else {
        if (data.nextStep === "login") {
          setIsRegistered(true);
        } else {
          setErrorMsg(data.message || "Failed to check email availability");
        }
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="w-full flex-1 flex flex-col justify-start px-6 pb-6 pt-2 select-none antialiased bg-white text-black h-full">
        {/* Top Header */}
        <div className="relative flex items-center justify-between w-full pt-4 pb-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRegistered(false)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center text-black"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </motion.button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-bold text-black tracking-tight font-sans">
             Sign up
          </h2>
          <div className="w-10 h-10" />
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-8">
          <h3 className="text-xl font-bold mb-2">Already Registered</h3>
          <p className="text-gray-600 mb-6 text-sm">It looks like you already have an account.</p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] hover:bg-[#022718] transition-colors cursor-pointer flex items-center justify-center"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col justify-start px-6 pb-6 pt-2 select-none antialiased bg-white text-black h-full">
      {/* Top Header */}
      <div className="relative flex items-center justify-between w-full pt-4 pb-1">
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-black" strokeWidth={2.5} />
        </motion.button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-bold text-black tracking-tight font-sans">
           your email
        </h2>
        {/* Invisible spacer to balance the header */}
        <div className="w-10 h-10" />
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={1} totalSteps={3} />

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col mt-6">
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-[14px] font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Email Label */}
        <label
          htmlFor="email-input"
          className="text-gray-800 text-[14px] font-semibold tracking-wide mb-2 pl-0.5 select-none"
        >
          Email
        </label>

        {/* Input field with rounded corners, custom height and placeholder */}
        <Input
          id="email-input"
          ref={inputRef}
          type="email"
          required
          placeholder="example@example.com"
          className="w-full h-[48px] px-4 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
        />

        {/* Action Button: Create an account */}
        <Button
          type="submit"
          disabled={submitting}
          className={`w-full h-[52px] mt-4 bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : null}
          Create an account
        </Button>
      </form>
    </div>
  );
}
