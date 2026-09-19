"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import Link from "next/link";

interface LoginEntryProps {
  onBack: () => void;
  onEmailClick: () => void;
  onLinkedInLogin?: () => void;
  onGoogleLogin?: () => void;
  onPhoneLogin?: () => void;
}

export default function LoginEntry({
  onBack,
  onEmailClick,
  onLinkedInLogin,
  onGoogleLogin,
  onPhoneLogin,
}: LoginEntryProps) {
  return (
    <div className="w-full flex-1 flex flex-col justify-between px-6 pb-6 pt-2 select-none antialiased bg-white text-black h-full">
      {/* Top Header */}
      <div className="relative flex items-center justify-between w-full pt-4 pb-2">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-black" strokeWidth={2.5} />
        </motion.button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-bold text-black tracking-tight font-sans whitespace-nowrap">
          Log into account
        </h2>
        {/* Invisible spacer to balance the header */}
        <div className="w-10 h-10" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start mt-8">
        {/* Title & Subtitle */}
        <div className="text-center mb-10">
          <h1 className="text-[26px] font-bold text-black tracking-tight font-sans leading-tight">
            Welcome back!
          </h1>
          <p className="text-gray-600 text-[16px] font-medium mt-1">
            Let&apos;s continue learning
          </p>
        </div>

        {/* Buttons List */}
        <div className="w-full space-y-4 px-1">
          {/* Primary CTA: Continue with Email */}
          <motion.button
            whileHover={{ scale: 1.015, backgroundColor: "#022417" }}
            whileTap={{ scale: 0.985 }}
            onClick={onEmailClick}
            className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            Continue with email
          </motion.button>

          {/* Centered Divider */}
          <div className="flex justify-center items-center py-2">
            <span className="text-gray-500 font-medium text-[15px]">or</span>
          </div>

          {/* Phone Button */}
          <motion.button
            whileHover={{ scale: 1.015, borderColor: "#a1a1aa", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)" }}
            whileTap={{ scale: 0.985 }}
            onClick={onPhoneLogin}
            className="w-full h-[52px] bg-white text-gray-800 border border-gray-200 rounded-[16px] font-semibold text-[15.5px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 relative"
          >
            {/* Phone SVG Logo on Left */}
            <div className="absolute left-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-icon lucide-phone text-black">
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
              </svg>
            </div>
            <span className="w-full text-center">Continue with phone</span>
          </motion.button>

          {/* LinkedIn Button */}
          <motion.button
            whileHover={{ scale: 1.015, borderColor: "#a1a1aa", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)" }}
            whileTap={{ scale: 0.985 }}
            onClick={onLinkedInLogin}
            className="w-full h-[52px] bg-white text-gray-800 border border-gray-200 rounded-[16px] font-semibold text-[15.5px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 relative"
          >
            {/* LinkedIn SVG Logo on Left */}
            <div className="absolute left-6 flex items-center">
              <svg className="w-[18px] h-[18px] text-[#0077b5] fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <span className="w-full text-center">Continue with LinkedIn</span>
          </motion.button>

          {/* Google Button */}
          <motion.button
            whileHover={{ scale: 1.015, borderColor: "#a1a1aa", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)" }}
            whileTap={{ scale: 0.985 }}
            onClick={onGoogleLogin}
            className="w-full h-[52px] bg-white text-gray-800 border border-gray-200 rounded-[16px] font-semibold text-[15.5px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 relative"
          >
            {/* Google official SVG Logo on Left */}
            <div className="absolute left-6 flex items-center">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.47-1.11 2.72-2.36 3.56v2.96h3.8c2.23-2.05 3.7-5.07 3.7-8.37z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.8-2.96c-1.05.7-2.4 1.12-4.16 1.12-3.2 0-5.91-2.16-6.87-5.07H1.18v3.06C3.15 21.16 7.28 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.13 14.18A7.17 7.17 0 0 1 4.75 12c0-.76.13-1.5.38-2.18V6.76H1.18A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.18 5.39l3.95-3.21z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.15 2.84 1.18 6.76l3.95 3.21c.96-2.91 3.67-5.22 6.87-5.22z"
                />
              </svg>
            </div>
            <span className="w-full text-center">Continue with Google</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Area: Disclaimer & Teacher Link */}
      <div className="mt-auto pt-6 flex flex-col items-center">
        {/* Teacher Portal Link */}
        <p className="text-[13.5px] text-gray-600 font-medium mb-3 select-none">
          Are you a teacher?{" "}
          <Link href="/teacher/login" className="font-bold text-emerald-700 hover:underline">
            Teacher Log in
          </Link>
        </p>

        {/* Legal Text */}
        <p className="text-[13px] text-gray-500 text-center max-w-[285px] leading-relaxed font-medium select-none">
          By using Scigeeks, you agree to the{" "}
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
  );
}
