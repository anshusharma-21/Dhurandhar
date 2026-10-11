import React from "react";

interface DhurandharWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DhurandharWordmark({ className = "", size = "md" }: DhurandharWordmarkProps) {
  const sizeClasses = {
    sm: "text-sm tracking-[0.22em]",
    md: "text-base sm:text-lg tracking-[0.26em]",
    lg: "text-xl sm:text-2xl tracking-[0.3em]",
  };

  return (
    <span
      className={`inline-flex items-center font-black uppercase select-none transition-colors duration-200 ${sizeClasses[size]} ${className}`}
      style={{ letterSpacing: size === "sm" ? "0.22em" : size === "lg" ? "0.3em" : "0.26em" }}
      aria-label="DHURANDHAR"
    >
      <span className="text-slate-900 dark:text-white font-extrabold group-hover:text-amber-500 transition-colors">
        DHURANDHAR
      </span>
      <span
        className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 ml-1.5 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
        aria-hidden="true"
      />
    </span>
  );
}
