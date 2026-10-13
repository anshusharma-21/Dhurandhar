import React from "react";

interface DhurandharLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DhurandharLogo({
  className = "",
  size = "md",
}: DhurandharLogoProps) {
  const dimensions = {
    sm: { size: 36, viewBox: "0 0 44 44" },
    md: { size: 44, viewBox: "0 0 44 44" },
    lg: { size: 54, viewBox: "0 0 44 44" },
  };

  const current = dimensions[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none group relative ${className}`}
      aria-label="Project Dhurandhar Logo"
      title="Project Dhurandhar"
    >
      {/* Ambient Radial Backlight Glow */}
      <div className="absolute inset-0 bg-amber-500/25 dark:bg-amber-400/20 rounded-2xl blur-lg group-hover:bg-amber-500/45 transition-all duration-300 pointer-events-none" />

      {/* Standalone Brand Emblem SVG */}
      <svg
        width={current.size}
        height={current.size}
        viewBox={current.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
      >
        <defs>
          {/* Outer Border Gradient */}
          <linearGradient id="dhBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Background Gradient */}
          <linearGradient id="dhBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e2638" />
            <stop offset="100%" stopColor="#0b0f19" />
          </linearGradient>

          {/* Trajectory Arrow Gradient */}
          <linearGradient id="dhArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          {/* D Monogram Stroke Gradient */}
          <linearGradient id="dhLetterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* 1. Emblem Shield Base */}
        <rect
          x="2.5"
          y="2.5"
          width="39"
          height="39"
          rx="12"
          fill="url(#dhBgGrad)"
          stroke="url(#dhBorderGrad)"
          strokeWidth="2"
        />

        {/* 2. Architectural Blueprint Lines */}
        <line x1="2.5" y1="22" x2="41.5" y2="22" stroke="rgba(245, 158, 11, 0.12)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="22" y1="2.5" x2="22" y2="41.5" stroke="rgba(245, 158, 11, 0.12)" strokeWidth="1" strokeDasharray="2 2" />

        {/* 3. Outer Corner Precision Tick Marks */}
        <path d="M7 11V7H11" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M37 11V7H33" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M7 33V37H11" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M37 33V37H33" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

        {/* 4. Bold Architectural 'D' Monogram */}
        <path
          d="M13 12H21.5C26.7467 12 31 16.2533 31 21.5C31 26.7467 26.7467 31 21.5 31H13V12Z"
          stroke="url(#dhLetterGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Integrated Trajectory Arrow (Piercing Through the D to ₹30Cr Target) */}
        <path
          d="M11 30L26 15"
          stroke="url(#dhArrowGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M18.5 15H26V22.5"
          stroke="url(#dhArrowGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 6. Target Milestone Apex Glowing Node */}
        <circle cx="26" cy="15" r="2.5" fill="#fef08a" />
        <circle cx="26" cy="15" r="4.5" stroke="#f59e0b" strokeWidth="1.2" opacity="0.75" />
      </svg>
    </div>
  );
}
