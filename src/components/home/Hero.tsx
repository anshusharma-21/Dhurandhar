import React from "react";
import { ArrowRight, TrendingUp, Tv, ShieldCheck, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[54vh] sm:min-h-[58vh] lg:min-h-[64vh] flex items-center justify-center overflow-hidden border-b border-slate-200/90 dark:border-white/10 bg-slate-50 dark:bg-[#07090e] transition-colors duration-200">
      {/* 1. Bespoke High-Tech Abstract Ambient Background (Zero Stock People) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Ambient Radial Lights */}
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-24 -left-24 w-[450px] h-[450px] bg-sky-500/10 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-amber-600/5 dark:bg-amber-400/5 rounded-full blur-[90px]" />

        {/* High-Tech Trajectory Grid & Financial Roadmap Geometry */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.45] dark:opacity-[0.25]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="heroGridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-300 dark:text-slate-700"
                strokeDasharray="2 4"
              />
              <circle cx="0" cy="0" r="1.5" className="fill-amber-500/40" />
            </pattern>

            <linearGradient id="curveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Precision Grid Layer */}
          <rect width="100%" height="100%" fill="url(#heroGridPattern)" />

          {/* ₹30 Crore Ascending Trajectory Vector Paths */}
          <path
            d="M -100,550 Q 300,520 600,420 T 1200,180 T 1800,60"
            fill="none"
            stroke="url(#curveGrad)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          <path
            d="M -100,580 Q 350,560 700,430 T 1300,160 T 1900,40"
            fill="none"
            stroke="url(#curveGrad)"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          {/* Node Milestones along the curve */}
          <circle cx="600" cy="420" r="4" className="fill-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <circle cx="1200" cy="180" r="5" className="fill-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
          <circle cx="1500" cy="120" r="6" className="fill-amber-400 animate-pulse shadow-[0_0_12px_rgba(245,158,11,1)]" />
        </svg>

        {/* Soft Vignette Overlay for Crisp Text Focus */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/90 via-transparent to-transparent dark:from-[#07090e]/95 dark:via-transparent dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 via-slate-50/40 to-transparent dark:from-[#07090e]/90 dark:via-[#07090e]/40 dark:to-transparent" />
      </div>

      {/* 2. Hero Content Foreground */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 w-full">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow Mission Pill */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/60 border border-amber-500/40 dark:border-amber-400/40 text-amber-800 dark:text-amber-400 text-xs font-bold tracking-[0.18em] uppercase backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
            <span>PROJECT DHURANDHAR • PUBLIC ACCOUNTABILITY</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.14]">
            Building towards <span className="whitespace-nowrap">₹30 crore</span>.{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 dark:from-amber-200 dark:via-amber-400 dark:to-amber-500 font-extrabold">
              One day at a time.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
            Follow Dr. Ajay Kumar and the AI Automation Labs team as we build, learn, solve problems, and grow. Daily vlogs document the decisions, wins, setbacks, and lessons behind the journey.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <a
              href="/episodes"
              className="inline-flex items-center space-x-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-200"
            >
              <Tv className="w-4 h-4 text-slate-950" />
              <span>Watch the Latest Day</span>
              <ArrowRight className="w-4 h-4 text-slate-950 ml-0.5" />
            </a>

            <a
              href="/revenue"
              className="inline-flex items-center space-x-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-slate-300 dark:border-white/15 backdrop-blur-md shadow-sm transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Explore Revenue Progress</span>
            </a>
          </div>

          {/* Editorial Trust Badges (Enhanced Legibility & Proportions) */}
          <div className="pt-6 border-t border-slate-300/80 dark:border-white/10 flex flex-wrap items-center gap-5 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <div className="inline-flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Radical Transparency</span>
            </div>
            <div className="inline-flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              <span>Daily Unfiltered Vlogs</span>
            </div>
            <div className="inline-flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Verified AI Summaries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
