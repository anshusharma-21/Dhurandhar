import React from "react";
import Image from "next/image";
import { ArrowRight, TrendingUp, Tv, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-slate-200/80 dark:border-white/10">
      {/* 1. Cinematic Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-cinematic.jpg"
          alt="Cinematic studio and architectural workspace of AI Automation Labs at dusk, symbolizing ambition and execution"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02] transform transition-transform duration-1000"
        />
        {/* Multilayered Cinematic Overlays for Text Legibility & Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfbf7] via-[#fcfbf7]/80 to-[#fcfbf7]/30 dark:from-[#07090e] dark:via-[#07090e]/85 dark:to-[#07090e]/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 dark:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fcfbf7]/90 via-[#fcfbf7]/60 to-transparent dark:from-[#07090e]/95 dark:via-[#07090e]/70 dark:to-transparent" />
      </div>

      {/* 2. Hero Content Foreground */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 w-full">
        <div className="max-w-3xl space-y-8">
          {/* Eyebrow Mission Pill */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-black/60 border border-amber-500/30 dark:border-amber-400/30 text-amber-800 dark:text-amber-400 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
            <span>PROJECT DHURANDHAR • PUBLIC ACCOUNTABILITY</span>
          </div>

          {/* Master Headline (Exact Requirement) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            ₹30 CRORE.{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 dark:from-amber-200 dark:via-amber-400 dark:to-amber-500">
              BUILT ONE DAY AT A TIME.
            </span>
          </h1>

          {/* Supporting Copy (Exact Requirement) */}
          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
            An open account of the ambition, execution, setbacks and lessons behind building a ₹30 crore business. Follow the work, understand the decisions, and see the progress as it happens.
          </p>

          {/* Action CTAs (Exact Requirement) */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="/episodes"
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all duration-200"
            >
              <Tv className="w-4 h-4 text-slate-950" />
              <span>FOLLOW THE JOURNEY</span>
              <ArrowRight className="w-4 h-4 text-slate-950 ml-1" />
            </a>

            <a
              href="/revenue"
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-xl bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider border border-slate-300/80 dark:border-white/15 backdrop-blur-md shadow-sm transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>EXPLORE THE NUMBERS</span>
            </a>
          </div>

          {/* Editorial Trust Badges */}
          <div className="pt-8 border-t border-slate-300/60 dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Radical Transparency</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Daily Unfiltered Vlogs</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
              <span>Verified AI Summaries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
