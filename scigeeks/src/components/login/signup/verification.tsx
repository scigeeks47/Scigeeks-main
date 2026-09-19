"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./progressindicator";
import { supabase } from "@/lib/supabaseClient";

interface SignupVerificationProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function SignupVerification({
  email,
  onBack,
  onSuccess,
}: SignupVerificationProps) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    // 1. Initial check
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isActive) {
          localStorage.removeItem("scigeeks_signup_verified");
          onSuccess();
        }
      } catch (err) {
        console.error("Error checking initial session:", err);
      }
    };
    checkInitialSession();

    // 2. Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && isActive) {
        localStorage.removeItem("scigeeks_signup_verified");
        onSuccess();
      }
    });

    // 3. Polling fallback (every 3 seconds)
    const interval = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isActive) {
          localStorage.removeItem("scigeeks_signup_verified");
          onSuccess();
        }
      } catch (err) {
        console.error("Error polling session:", err);
      }
    }, 3000);

    // 4. LocalStorage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "scigeeks_signup_verified" && e.newValue === "true" && isActive) {
        localStorage.removeItem("scigeeks_signup_verified");
        onSuccess();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      isActive = false;
      subscription.unsubscribe();
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [onSuccess]);

  const handleManualCheck = async () => {
    setChecking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        onSuccess();
      } else {
        alert("Verification still pending. Please click the link in your email.");
      }
    } catch (err) {
      console.error(err);
      alert("Error checking status");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-6 pb-6 pt-2 select-none antialiased bg-white text-black h-full">
      
      {/* Top Section */}
      <div className="w-full flex flex-col">
        {/* Top Header */}
        <div className="relative flex items-center justify-between w-full pt-4 pb-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center text-black"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </motion.button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-bold text-black tracking-tight font-sans whitespace-nowrap">
            Verify your email 2 / 3
          </h2>
          {/* Invisible spacer to balance the header */}
          <div className="w-10 h-10" />
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={2} totalSteps={3} />

        {/* Content Section */}
        <div className="w-full flex flex-col items-center mt-8 text-center px-1">
          {/* Headline */}
          <h1 className="text-black text-[28px] font-extrabold tracking-tight font-sans mb-3">
            Check your inbox
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-[14.5px] leading-relaxed font-medium mb-6">
            We have sent a secure sign-in link to:
          </p>

          {/* Email Card */}
          <div className="w-full max-w-[340px] border border-gray-200 rounded-2xl p-4 bg-gray-50/50 flex items-center gap-3 mb-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider">
                Email Address
              </span>
              <a 
                href={`mailto:${email}`}
                className="text-[15px] font-semibold text-emerald-800 hover:underline truncate w-full"
              >
                {email}
              </a>
            </div>
          </div>

          <p className="text-gray-600 text-[14.5px] leading-relaxed font-medium mb-8">
            Please click the link in your email to continue.
          </p>

          {/* Loading Indicator */}
          <div className="flex items-center gap-2 text-gray-500 font-medium text-[14px] bg-gray-100/70 px-4 py-2.5 rounded-full mb-8">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Waiting for email verification...</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions and Footer */}
      <div className="w-full flex flex-col mt-auto">
        {/* Primary Continue Button */}
        <Button
          onClick={handleManualCheck}
          className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center"
        >
          Continue
        </Button>

        {/* Secondary Action Link */}
        <div className="text-center mt-5 mb-8">
          <button
            onClick={onBack}
            className="text-[14.5px] text-gray-600 hover:text-black font-medium transition-colors"
          >
            Wrong email? <span className="font-bold text-gray-900 underline">Use a different email</span>
          </button>
        </div>

        {/* Legal Footer */}
        <div className="flex flex-col items-center">
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

          {/* iPhone Home Bar Indicator */}
          <div className="mt-6 flex justify-center w-full">
            <div className="h-[5px] w-36 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>

    </div>
  );
}
