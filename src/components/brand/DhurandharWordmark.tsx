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
  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <DhurandharLogo size={size} />
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-black tracking-widest uppercase text-[15px] leading-tight flex items-center space-x-1 ${
            inverted ? "text-white" : "text-slate-900 dark:text-white"
          }`}>
            <span>DHURANDHAR</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm" />
          </span>
          <span className={`text-[9px] uppercase tracking-widest font-bold font-mono ${
            inverted ? "text-amber-400" : "text-amber-600 dark:text-amber-400"
          }`}>
            ROAD TO ₹30CR
          </span>
        </div>
      )}
    </div>
  );
}
