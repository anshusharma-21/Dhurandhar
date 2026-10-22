import React from "react";

interface DhurandharLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function DhurandharLogo({
  className = "",
  size = "md",
}: DhurandharLogoProps) {
  // Sizing with generous, prominent proportions
  const sizeClasses = {
    sm: "w-10 h-10 sm:w-12 sm:h-12 max-w-[48px] max-h-[48px]",
    md: "w-14 h-14 sm:w-16 sm:h-16 max-w-[64px] max-h-[64px]",
    lg: "w-20 h-20 sm:w-24 sm:h-24 max-w-[96px] max-h-[96px]",
    xl: "w-28 h-28 sm:w-32 sm:h-32 max-w-[128px] max-h-[128px]",
  };

  const pixelDimensions = {
    sm: 44,
    md: 56,
    lg: 80,
    xl: 120,
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none group relative shrink-0 ${className}`}
      aria-label="Project Dhurandhar Logo"
      title="Project Dhurandhar — The ₹30 Crore Mission"
    >
      {/* Subtle organic radial halo (circular, NO box, NO borders) */}
      <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl group-hover:bg-amber-400/40 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

      {/* Official 30 Crores Dhurandhar Golden Seal Emblem — Open, Standalone, Seamless */}
      <img
        src="/images/dhurandhar-emblem.png"
        alt="Project Dhurandhar — Road to ₹30CR"
        width={pixelDimensions[size]}
        height={pixelDimensions[size]}
        className={`${sizeClasses[size]} object-contain relative transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_14px_rgba(245,158,11,0.35)] dark:drop-shadow-[0_4px_18px_rgba(245,158,11,0.5)]`}
      />
    </div>
  );
}
