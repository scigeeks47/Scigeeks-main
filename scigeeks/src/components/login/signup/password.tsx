"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./progressindicator";
import { supabase } from "@/lib/supabaseClient";


interface SignupPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
  email: string;
}

export default function SignupPassword({ onBack, onSuccess, email }: SignupPasswordProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Validation conditions
  const isNameValid = name.trim().length > 0;
  const isMinLength = password.length >= 8;
  const isMaxLength = password.length <= 72;
  const doPasswordsMatch = password === confirmPassword && confirmPassword !== "";

  // Button is enabled if validations pass
  const isFormValid = isNameValid && isMinLength && isMaxLength && doPasswordsMatch;

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!isFormValid) {
      if (!isNameValid) {
        setErrorMsg("Please enter your name.");
      } else if (!isMinLength) {
        setErrorMsg("Password must be at least 8 characters long.");
      } else if (!isMaxLength) {
        setErrorMsg("Password must be 72 characters or fewer.");
      } else if (!doPasswordsMatch) {
        setErrorMsg("Passwords do not match.");
      }
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const {
        data: authData,
        error: authError,
      } = await supabase.auth.updateUser({
        password,
        data: {
          name,
        },
      });
      console.log("AUTH DATA:", authData);
      console.log("AUTH ERROR:", authError);

      if (authError) {
        throw authError;
      }


      // Retrieve access token for authorization
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Call backend create-account endpoint directly (handles existence checks internally)
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/auth/create-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          email,
          id: authData.user?.id,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.message || "Failed to create database account");
      }

      console.log(
        "SignUp successful:",
        authData.user
      );

      onSuccess();

  } catch (error: any) {
    console.error(error);
    setErrorMsg(
      error.message ||
      "Failed to create account"
    );
  } finally {
    setSubmitting(false);
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
            Create your password 3 / 3
          </h2>
          {/* Invisible spacer to balance the header */}
          <div className="w-10 h-10" />
        </div>

        {/* Progress Indicator - Green color, all 3 active */}
        <ProgressIndicator currentStep={3} totalSteps={3} activeColor="bg-[#0da651]" />

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col mt-8">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-[14px] font-medium text-center">
              {errorMsg}
            </div>
          )}
          {/* Name Label */}
          <label
            htmlFor="name"
            className="text-gray-800 text-[14.5px] font-semibold tracking-wide mb-2 pl-0.5"
          >
            Name
          </label>
          <div className="relative w-full mb-6">
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[48px] pl-4 pr-4 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-[#0da651] focus-visible:ring-[#0da651]/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
              required
            />
          </div>

          {/* Password Label */}
          <label
            htmlFor="password"
            className="text-gray-800 text-[14.5px] font-semibold tracking-wide mb-2 pl-0.5"
          >
            Password
          </label>
          <div className="relative w-full mb-6">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              maxLength={72}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[48px] pl-4 pr-12 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-[#0da651] focus-visible:ring-[#0da651]/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
              required
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

          {/* Confirm Password Label */}
          <label
            htmlFor="confirm-password"
            className="text-gray-800 text-[14.5px] font-semibold tracking-wide mb-2 pl-0.5"
          >
            Confirm Password
          </label>
          <div className="relative w-full mb-6">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              maxLength={72}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[48px] pl-4 pr-12 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-[#0da651] focus-visible:ring-[#0da651]/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-500" strokeWidth={2} />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" strokeWidth={2} />
              )}
            </button>
          </div>

          {/* Validation Guidelines */}
          <div className="flex flex-col gap-2.5 mt-2 pl-1 mb-8">
            {/* Requirement 1: 8 characters minimum */}
            <div className="flex items-center text-gray-600 text-[14.5px] font-medium transition-colors">
              {isMinLength ? (
                <div className="w-5 h-5 flex items-center justify-center shrink-0 mr-2 text-[#0da651]">
                  <Check className="w-4.5 h-4.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300 shrink-0 mr-2.5" />
              )}
              <span className={isMinLength ? "text-[#0da651] font-semibold" : "text-gray-500"}>
                8 characters minimum
              </span>
            </div>

            {/* Requirement 2: Passwords match */}
            <div className="flex items-center text-gray-600 text-[14.5px] font-medium transition-colors">
              {doPasswordsMatch ? (
                <div className="w-5 h-5 flex items-center justify-center shrink-0 mr-2 text-[#0da651]">
                  <Check className="w-4.5 h-4.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300 shrink-0 mr-2.5" />
              )}
              <span className={doPasswordsMatch ? "text-[#0da651] font-semibold" : "text-gray-500"}>
                Passwords match
              </span>
            </div>
          </div>
        </form>
      </div>

      {/* Bottom CTA and Footer */}
      <div className="w-full flex flex-col mt-auto">
        {/* Continue Button */}
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
          className={`w-full h-[52px] bg-[#0da651] text-white rounded-[16px] font-semibold text-[16px] transition-all duration-200 cursor-pointer flex items-center justify-center ${
            isFormValid && !submitting
              ? "hover:bg-[#0b8a43] active:translate-y-px shadow-[0_4px_20px_rgba(13,166,81,0.15)]"
              : "opacity-40 cursor-not-allowed bg-[#0da651]"
          }`}
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : null}
          Continue
        </Button>

        {/* Legal Footer */}
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

          {/* iPhone Home Bar Indicator */}
          <div className="mt-6 flex justify-center w-full">
            <div className="h-[5px] w-36 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
