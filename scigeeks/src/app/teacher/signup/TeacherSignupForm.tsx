"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Check, Loader2, PartyPopper, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function TeacherSignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [viewState, setViewState] = useState<"form" | "verification_sent" | "complete">("form");

  // Client-side validations
  const isNameValid = name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isMinLength = password.length >= 8;
  const isMaxLength = password.length <= 72;
  const doPasswordsMatch = password === confirmPassword && confirmPassword !== "";

  const isFormValid = isNameValid && isEmailValid && isMinLength && isMaxLength && doPasswordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      if (!isNameValid) {
        setErrorMsg("Please enter your full name.");
      } else if (!isEmailValid) {
        setErrorMsg("Please enter a valid email address.");
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
      // 1. Check if email is already registered via backend
      const checkRes = await fetch("http://localhost:5000/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.nextStep === "login") {
          setErrorMsg("A user with this email address has already been registered. Please log in instead.");
          setSubmitting(false);
          return;
        }
      }

      // 2. Sign up user via Supabase Auth
      const redirectUrl = `${window.location.origin}/auth/callback?type=teacher`;
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
          throw new Error("A user with this email address has already been registered.");
        } else if (signUpError.message.includes("rate limit") || signUpError.status === 429) {
          throw new Error("Too many sign up attempts. Please wait a few minutes and try again.");
        } else {
          throw signUpError;
        }
      }

      // 3. Handle active session or email verification required
      if (authData?.session && authData?.user) {
        // Session active immediately (e.g. email confirmation auto-completed)
        const token = authData.session.access_token;

        // Call backend POST /api/auth/create-teacher-account
        // Note: Frontend does NOT send role in request body
        const backendRes = await fetch("http://localhost:5000/api/auth/create-teacher-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            id: authData.user.id,
          }),
        });

        const backendData = await backendRes.json();

        if (!backendRes.ok || !backendData.success) {
          throw new Error(backendData.message || "Failed to complete teacher account creation.");
        }

        setViewState("complete");
      } else if (authData?.user) {
        // Email verification required
        setViewState("verification_sent");
      } else {
        throw new Error("Unable to initialize account creation. Please try again.");
      }
    } catch (err: any) {
      console.error("Teacher signup error:", err);
      setErrorMsg(err.message || "Something went wrong during sign up. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden overflow-y-auto py-0 md:py-8 font-sans select-none antialiased bg-[#0b0b0b]">
      {/* Phone Mockup / Card Container */}
      <div className="relative w-full max-w-[420px] min-h-screen md:min-h-0 md:h-[900px] md:rounded-[48px] overflow-hidden flex flex-col justify-between z-10 bg-white md:border md:border-gray-200 md:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        
        {/* Top Spacer */}
        <div className="h-4 bg-white" />

        <AnimatePresence mode="wait">
          {viewState === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex-1 flex flex-col justify-between px-6 pb-6 pt-2 select-none antialiased bg-white text-black h-full"
            >
              <div className="w-full flex flex-col">
                {/* Header */}
                <div className="relative flex items-center justify-between w-full pt-4 pb-1">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/")}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center text-black"
                    aria-label="Go home"
                  >
                    <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
                  </motion.button>
                  <h2 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-bold text-black tracking-tight font-sans whitespace-nowrap">
                    Teacher Sign Up
                  </h2>
                  <div className="w-10 h-10" />
                </div>

                {/* Subtitle / Badge */}
                <div className="flex flex-col items-center mt-3 mb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[12px] font-bold rounded-full uppercase tracking-wider">
                    Teacher Portal
                  </span>
                  <p className="text-gray-500 text-[14px] mt-2 text-center font-medium">
                    Create your educator account to get started
                  </p>
                </div>

                {/* Error Alert */}
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-[14px] font-medium text-center">
                    {errorMsg}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col mt-2">
                  {/* Name Input */}
                  <label htmlFor="teacher-name" className="text-gray-800 text-[14px] font-semibold tracking-wide mb-1 pl-0.5">
                    Full Name
                  </label>
                  <Input
                    id="teacher-name"
                    type="text"
                    required
                    placeholder="Dr. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-[48px] px-4 mb-4 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
                  />

                  {/* Email Input */}
                  <label htmlFor="teacher-email" className="text-gray-800 text-[14px] font-semibold tracking-wide mb-1 pl-0.5">
                    Email Address
                  </label>
                  <Input
                    id="teacher-email"
                    type="email"
                    required
                    placeholder="teacher@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[48px] px-4 mb-4 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
                  />

                  {/* Password Input */}
                  <label htmlFor="teacher-password" className="text-gray-800 text-[14px] font-semibold tracking-wide mb-1 pl-0.5">
                    Password
                  </label>
                  <div className="relative w-full mb-4">
                    <Input
                      id="teacher-password"
                      type={showPassword ? "text" : "password"}
                      required
                      maxLength={72}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-[48px] pl-4 pr-12 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                    </button>
                  </div>

                  {/* Confirm Password Input */}
                  <label htmlFor="teacher-confirm-password" className="text-gray-800 text-[14px] font-semibold tracking-wide mb-1 pl-0.5">
                    Confirm Password
                  </label>
                  <div className="relative w-full mb-4">
                    <Input
                      id="teacher-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      maxLength={72}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-[48px] pl-4 pr-12 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                    </button>
                  </div>

                  {/* Requirements List */}
                  <div className="flex flex-col gap-2 mb-6 pl-1">
                    <div className="flex items-center text-[13.5px]">
                      {isMinLength ? (
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3] mr-2" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 mr-2 shrink-0" />
                      )}
                      <span className={isMinLength ? "text-emerald-600 font-medium" : "text-gray-500"}>
                        8 characters minimum
                      </span>
                    </div>

                    <div className="flex items-center text-[13.5px]">
                      {doPasswordsMatch ? (
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3] mr-2" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 mr-2 shrink-0" />
                      )}
                      <span className={doPasswordsMatch ? "text-emerald-600 font-medium" : "text-gray-500"}>
                        Passwords match
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || submitting}
                    className={`w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      !isFormValid || submitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                    Create Teacher Account
                  </Button>
                </form>
              </div>

              {/* Footer */}
              <div className="flex flex-col items-center mt-6">
                <p className="text-[14px] text-gray-600">
                  Already have a teacher account?{" "}
                  <Link href="/teacher/login" className="font-bold text-gray-900 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {viewState === "verification_sent" && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col justify-between px-6 pb-6 pt-2 bg-white text-black h-full"
            >
              <div className="w-full flex flex-col items-center mt-16 text-center px-2">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-lg shadow-emerald-100/50">
                  <Mail className="w-10 h-10" />
                </div>

                <h1 className="text-black text-[26px] font-extrabold tracking-tight font-sans mb-3">
                  Check Your Email
                </h1>

                <p className="text-gray-600 text-[15px] leading-relaxed font-medium mb-6 max-w-[300px]">
                  We have sent a verification link to <strong className="text-black">{email}</strong>. Please check your inbox and click the link to activate your teacher account.
                </p>
              </div>

              <div className="w-full flex flex-col mt-auto">
                <Button
                  onClick={() => router.push("/teacher/login")}
                  className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] hover:bg-[#022718] cursor-pointer flex items-center justify-center"
                >
                  Go to Login
                </Button>
              </div>
            </motion.div>
          )}

          {viewState === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col justify-between px-6 pb-6 pt-2 bg-white text-black h-full"
            >
              <div className="w-full flex flex-col items-center mt-16 text-center px-2">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-lg shadow-emerald-100/50">
                  <PartyPopper className="w-10 h-10" />
                </div>

                <h1 className="text-black text-[26px] font-extrabold tracking-tight font-sans mb-3">
                  Teacher Account Created!
                </h1>

                <p className="text-gray-600 text-[15px] leading-relaxed font-medium mb-6 max-w-[300px]">
                  Welcome to SciGeeks! Your educator account has been created successfully.
                </p>
              </div>

              <div className="w-full flex flex-col mt-auto">
                <Button
                  onClick={() => router.push("/teacher/dashboard")}
                  className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] hover:bg-[#022718] cursor-pointer flex items-center justify-center"
                >
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Spacer */}
        <div className="h-4 bg-white" />
      </div>
    </div>
  );
}
