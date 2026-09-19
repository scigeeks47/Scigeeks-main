"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Phone, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

interface LoginPhoneProps {
  onBack: () => void;
  onSuccess: () => void;
  intent?: string;
}

type PhoneStep = "phone" | "otp";

export default function LoginPhone({ onBack, onSuccess, intent = "login" }: LoginPhoneProps) {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<PhoneStep>("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(30);

  // Focus inputs automatically
  useEffect(() => {
    if (step === "phone" && phoneInputRef.current) {
      phoneInputRef.current.focus();
    } else if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    // Validate international format E.164 (must start with +)
    if (!phone.trim().startsWith("+")) {
      setErrorMsg("Please enter phone in international format starting with '+' (e.g. +919876543210)");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.trim(),
      });

      if (error) {
        throw error;
      }

      setStep("otp");
      setTimer(30);
    } catch (err: any) {
      console.error("SMS OTP error:", err);
      setErrorMsg(err.message || "Failed to send OTP code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit OTP code.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone.trim(),
        token: otpCode.trim(),
        type: "sms",
      });

      if (error) {
        throw error;
      }

      const user = data.user;
      if (!user) {
        throw new Error("Could not retrieve authenticated user session");
      }

      // Check whether user profile already exists in public.users using synthetic email
      const syntheticEmail = `${phone.trim()}@phone.scigeeks.internal`;

      // Retrieve access token for authorization
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (intent !== "signup") {
        // Verify profile exists on backend
        const profileRes = await fetch("http://localhost:5000/api/profile", {
          headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
        });
        if (!profileRes.ok) {
          await supabase.auth.signOut();
          throw new Error("Your account profile could not be found. Please contact support or create a new account.");
        }
      } else {
        // Call backend create-account endpoint directly
        const res = await fetch("http://localhost:5000/api/auth/create-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: "New User",
            email: syntheticEmail,
            id: user.id,
            role: "student",
          }),
        });

        const resData = await res.json();
        if (!res.ok || !resData.success) {
          throw new Error(resData.message || "Failed to create database account");
        }
      }

      console.log("Phone verification successful!");
      onSuccess();
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setErrorMsg(err.message || "Invalid OTP code. Please verify and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || submitting) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.trim(),
      });

      if (error) {
        throw error;
      }

      setTimer(30);
      setOtpCode("");
    } catch (err: any) {
      console.error("OTP resend error:", err);
      setErrorMsg(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStepBack = () => {
    if (step === "otp") {
      setStep("phone");
      setErrorMsg("");
    } else {
      onBack();
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
          onClick={handleStepBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center text-black"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
        </motion.button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-bold text-black tracking-tight font-sans whitespace-nowrap">
          {step === "phone" ? "Continue with phone" : "Verify OTP"}
        </h2>
        <div className="w-10 h-10" />
      </div>

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="w-full flex flex-col mt-8">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-[14px] font-medium text-center">
              {errorMsg}
            </div>
          )}

          <label
            htmlFor="phone-input"
            className="text-gray-800 text-[14.5px] font-semibold tracking-wide mb-2 pl-0.5"
          >
            Phone Number
          </label>
          <div className="relative w-full mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone className="w-5 h-5" />
            </div>
            <Input
              id="phone-input"
              ref={phoneInputRef}
              type="tel"
              required
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-[48px] pl-12 pr-4 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium bg-transparent text-black"
            />
          </div>

          <p className="text-gray-500 text-[13.5px] leading-relaxed mb-6 pl-0.5 font-medium">
            Make sure to include your country code starting with &apos;+&apos; (e.g. +91 for India, +1 for USA) so we can send you a secure login code via SMS.
          </p>

          <Button
            type="submit"
            disabled={submitting || !phone}
            className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="w-full flex flex-col mt-8">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-[14px] font-medium text-center">
              {errorMsg}
            </div>
          )}

          <label
            htmlFor="otp-input"
            className="text-gray-800 text-[14.5px] font-semibold tracking-wide mb-2 pl-0.5"
          >
            OTP Code
          </label>
          <div className="relative w-full mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <Input
              id="otp-input"
              ref={otpInputRef}
              type="text"
              required
              maxLength={6}
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              className="w-full h-[48px] pl-12 pr-4 rounded-[14px] border border-gray-300 text-[15px] focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 placeholder:text-gray-400 font-medium tracking-[0.25em] text-center bg-transparent text-black"
            />
          </div>

          <div className="flex flex-col items-center gap-3 mb-6 pl-0.5 text-center">
            <p className="text-gray-600 text-[14px] font-medium">
              We sent a 6-digit confirmation code to: <span className="font-semibold text-black">{phone}</span>
            </p>
            
            {timer > 0 ? (
              <p className="text-gray-500 text-[13px] font-medium">
                Resend code in <span className="font-semibold text-emerald-600">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={submitting}
                className="text-[13px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all cursor-pointer"
              >
                Resend code via SMS
              </button>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting || otpCode.length !== 6}
            className="w-full h-[52px] bg-[#032e1d] text-white rounded-[16px] font-semibold text-[16px] shadow-[0_4px_20px_rgba(3,46,29,0.15)] hover:bg-[#022718] active:translate-y-px transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Verify &amp; Login
          </Button>
        </form>
      )}
    </div>
  );
}
