import React from "react";
import { DhurandharLogo } from "./DhurandharLogo";

interface DhurandharWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  inverted?: boolean;
}

export function DhurandharWordmark({
  className = "",
  size = "md",
  showText = true,
  inverted = false,
}: DhurandharWordmarkProps) {
  const textSizes = {
    sm: {
      title: "text-[14px] sm:text-[16px]",
      sub: "text-[9px] sm:text-[10px]",
    },
    md: {
      title: "text-[16px] sm:text-[18px]",
      sub: "text-[10px] sm:text-[11px]",
    },
    lg: {
      title: "text-[20px] sm:text-[24px]",
      sub: "text-[11px] sm:text-[12px]",
    },
  };

  return (
    <div className={`inline-flex items-center space-x-3 ${className}`}>
      <DhurandharLogo size={size} />
      {showText && (
        <div className="flex flex-col text-left justify-center">
          <span className={`font-black tracking-[0.16em] uppercase leading-tight flex items-center space-x-1.5 ${textSizes[size].title} ${
            inverted ? "text-white" : "text-slate-900 dark:text-white"
          }`}>
            <span>DHURANDHAR</span>
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          </span>
          <span className={`uppercase tracking-[0.22em] font-bold font-mono whitespace-nowrap mt-0.5 ${textSizes[size].sub} ${
            inverted ? "text-amber-400" : "text-amber-600 dark:text-amber-400"
          }`}>
            ROAD TO ₹30CR
          </span>
        </div>
      )}
    </div>
  );
}
