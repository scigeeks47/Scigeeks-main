"use client";

import React from "react";

interface GreetingProps {
  name: string;
}

export const Greeting: React.FC<GreetingProps> = ({ name }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[26px] leading-[1.2] font-bold text-white tracking-tight max-w-[280px]">
        Welcome back, {name}
      </span>
      <h1 className="text-[26px] leading-[1.2] font-medium text-neutral-300">
        What would you like to learn today?
      </h1>
    </div>
  );
};

export default Greeting;
