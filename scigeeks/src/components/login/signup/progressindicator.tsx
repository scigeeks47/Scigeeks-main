"use client";

import React from "react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  activeColor?: string;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  activeColor,
}: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center items-center gap-1.5 py-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;

        return (
          <div
            key={index}
            className={`h-[4.5px] w-8 rounded-full transition-all duration-300 ${
              isActive ? (activeColor || "bg-[#b08bf8]") : "bg-[#e4e4e7]"
            }`}
          />
        );
      })}
    </div>
  );
}
