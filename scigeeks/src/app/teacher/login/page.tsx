"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function TeacherLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setErrorMsg("Email and password are required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !authData.session) {
        throw new Error(signInError?.message || "Invalid email or password.");
      }

      // 2. Fetch user profile from backend to verify teacher role
      const token = authData.session.access_token;
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        await supabase.auth.signOut();
        throw new Error("Unable to verify user profile.");
      }

      const profileData = await res.json();

      if (!profileData.success || !profileData.user) {
        await supabase.auth.signOut();
        throw new Error("User profile not found.");
      }

      // 3. Strictly verify teacher role
      if (profileData.user.role !== "teacher") {
        await supabase.auth.signOut();
        setErrorMsg("Access denied. This login portal is restricted to teacher accounts only.");
        setSubmitting(false);
        return;
      }

      // Teacher authentication successful
      router.push("/teacher/dashboard");
    } catch (err: any) {
      console.error("Teacher login error:", err);
      setErrorMsg(err.message || "Invalid email or password.");
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

        <div className="w-full flex-1 flex flex-col justify-between px-6 pb-6 pt-2 select-none antialiased bg-white text-black h-full">
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
                Teacher Log In
              </h2>
              <div className="w-10 h-10" />
            </div>

            {/* Subtitle / Badge */}
            <div className="flex flex-col items-center mt-3 mb-6">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[12px] font-bold rounded-full uppercase tracking-wider">
                Teacher Portal
              </span>
              <p className="text-gray-500 text-[14px] mt-2 text-center font-medium">
                Log in to access your teacher portal
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
              {/* Email Input */}
              <label htmlFor="teacher-login-email" className="text-gray-800 text-[14px] font-semibold tracking-wide mb-1 pl-0.5">
                Email Address
              </label>
              <Input
                id="teacher-login-email"
                type="email"
                required
                placeholder="teacher@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[48px] px-4 mb-4 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
              />

              {/* Password Input */}
              <div className="flex justify-between items-center mb-1 pl-0.5">
                <label htmlFor="teacher-login-password" className="text-gray-800 text-[14px] font-semibold tracking-wide">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative w-full mb-6">
                <Input
                  id="teacher-login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  maxLength={72}
                  placeholder="Enter your password"
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                Log in as Teacher
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center mt-6 gap-2">
            <p className="text-[14px] text-gray-600">
              Don&apos;t have a teacher account?{" "}
              <Link href="/teacher/signup" className="font-bold text-gray-900 hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-[13px] text-gray-500">
              Student account?{" "}
              <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-4 bg-white" />
      </div>
    </div>
  );
}
