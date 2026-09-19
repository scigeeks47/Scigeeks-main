"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface LoginEmailProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function LoginEmail({ onBack, onSuccess }: LoginEmailProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-focus email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  const email =
    emailInputRef.current?.value;

  if (!email || !password)
    return;

  setSubmitting(true);
  setErrorMsg("");

  try {
    const {
      data,
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    console.log("Login successful:", data.user);
    onSuccess();

  } catch (error: any) {
    console.error(error);
    setErrorMsg(
      error.message ||
      "Invalid email or password"
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="w-full flex-1 flex flex-col justify-start px-6 pb-6 pt-2 select-none antialiased bg-white text-black h-full">
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
          Log in with email
        </h2>
        {/* Invisible spacer to balance the header */}
        <div className="w-10 h-10" />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col mt-8">
        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-[14px] font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Email Input */}
        <label
          htmlFor="login-email-input"
          className="text-gray-800 text-[14px] font-semibold tracking-wide mb-2 pl-0.5"
        >
          Email
        </label>
        <Input
          id="login-email-input"
          ref={emailInputRef}
          type="email"
          required
          placeholder="example@example.com"
          className="w-full h-[48px] px-4 mb-6 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
        />

        {/* Password Input */}
        <div className="flex justify-between items-center mb-2 pl-0.5">
          <label
            htmlFor="login-password-input"
            className="text-gray-800 text-[14px] font-semibold tracking-wide"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative w-full mb-8">
          <Input
            id="login-password-input"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full h-[48px] pl-4 pr-12 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" strokeWidth={2} />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Action Button: Log in */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : null}
          Log in
        </Button>
      </form>
    </div>
  );
}
