import React from "react";

interface DhurandharLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function DhurandharLogo({
  className = "",
  size = "md",
}: DhurandharLogoProps) {
  const dimensions = {
    sm: { size: 36, viewBox: "0 0 48 48" },
    md: { size: 48, viewBox: "0 0 48 48" },
    lg: { size: 60, viewBox: "0 0 48 48" },
    xl: { size: 76, viewBox: "0 0 48 48" },
  };

  const current = dimensions[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none group relative ${className}`}
      aria-label="Project Dhurandhar Logo"
      title="Project Dhurandhar — The ₹30 Crore Mission"
    >
      {/* Dynamic Ambient Golden-Celestial Backlight Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 via-amber-400/20 to-sky-400/20 rounded-2xl blur-xl group-hover:scale-115 group-hover:bg-amber-400/40 transition-all duration-500 pointer-events-none" />

      {/* Sovereign Dhurandhar Emblem SVG */}
      <svg
        width={current.size}
        height={current.size}
        viewBox={current.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative transition-transform duration-300 group-hover:scale-105 drop-shadow-xl"
      >
        <defs>
          {/* 24K Royal Gold Multi-stop Gradient */}
          <linearGradient id="dhGoldPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FBBF24" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Golden Arrowhead Velocity Gradient */}
          <linearGradient id="dhArrowGleam" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Deep Cosmic Shield Background */}
          <linearGradient id="dhShieldDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#181e2b" />
            <stop offset="50%" stopColor="#0c101a" />
            <stop offset="100%" stopColor="#06080d" />
          </linearGradient>

          {/* Subtle Outer Neon Rim */}
          <linearGradient id="dhRimGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0.8" />
          </linearGradient>

          {/* Starburst Sparkle Gradient */}
          <radialGradient id="dhStarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Regal Shield Crest Base (Hexagonal Warrior Silhouette) */}
        <path
          d="M24 3L42 9V24C42 34.5 34.2 41.8 24 45C13.8 41.8 6 34.5 6 24V9L24 3Z"
          fill="url(#dhShieldDark)"
          stroke="url(#dhRimGlow)"
          strokeWidth="1.6"
        />

        {/* 2. Inner Concentric Facet Line */}
        <path
          d="M24 6.5L38.5 11.2V23.5C38.5 32 32.2 38 24 41C15.8 38 9.5 32 9.5 23.5V11.2L24 6.5Z"
          stroke="url(#dhGoldPrimary)"
          strokeWidth="1"
          strokeOpacity="0.35"
          fill="none"
        />

        {/* 3. Dhurandhar 'D' Monogram Wing (Left Pillar + Sweeping Arc) */}
        <path
          d="M17 14V33M17 14H24C29.5 14 33.5 17.5 33.5 23.5C33.5 29.5 29.5 33 24 33H17"
          stroke="url(#dhGoldPrimary)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. The Invincible Soaring Arrowhead (Piercing Upward to ₹30Cr) */}
        <path
          d="M13 34L33 14"
          stroke="url(#dhArrowGleam)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Arrow Tip Barbs */}
        <path
          d="M23 14H33V24"
          stroke="url(#dhArrowGleam)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Center Pivot Diamond (The 'Dhur' - Axis of Mastery) */}
        <polygon
          points="24,20 27,23.5 24,27 21,23.5"
          fill="url(#dhGoldPrimary)"
        />

        {/* 6. Apex Radiant Starburst at the Arrow Tip */}
        <circle cx="33" cy="14" r="5" fill="url(#dhStarGlow)" />
        <path
          d="M33 9V19M28 14H38"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="33" cy="14" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
