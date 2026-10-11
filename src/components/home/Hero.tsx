import React from "react";
import { Tv, TrendingUp, ShieldCheck, ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-sky/10 via-cyan-500/5 to-amber-500/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-navy-700/80 text-brand-gold text-xs font-semibold mb-6 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <span>PROJECT DHURANDHAR • PUBLIC ACCOUNTABILITY JOURNAL</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
            Building towards <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">₹30 crore</span>. One day at a time.
          </h1>

          {/* Supporting Copy from Specification Section 3.3 */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Follow Dr. Ajay Kumar and the AI Automation Labs team as we build, learn, solve problems and grow. Daily vlogs document the decisions, wins, setbacks and lessons behind the journey.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/episodes"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-sky via-cyan-500 to-sky-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-subtle hover:shadow-cyan-500/20 transition-all"
            >
              <Tv className="w-4 h-4 text-slate-950" />
              <span>Watch the Latest Day</span>
              <ArrowRight className="w-4 h-4 text-slate-950 ml-1" />
            </a>

            <a
              href="/revenue"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 hover:text-white font-semibold text-sm border border-navy-700 hover:border-navy-600 transition-all shadow-subtle"
            >
              <TrendingUp className="w-4 h-4 text-brand-gold" />
              <span>Explore Revenue Progress</span>
            </a>
          </div>

          {/* Meta Trust Badges */}
          <div className="mt-10 pt-6 border-t border-navy-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Self-Reported Transparency</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Daily Instagram Vlogs</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Verified AI Summaries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
