import React from "react";
import { ArrowRight, Tv, MessageSquare } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";

export function CommunityCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24" aria-labelledby="closing-cta-heading">
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-400/10 dark:via-transparent dark:to-transparent bg-white/90 dark:bg-[#0e131d] border border-amber-500/30 dark:border-amber-400/20 rounded-3xl p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Subtle Decorative Gold Ambient Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">
            <span>THE PUBLIC INVITATION</span>
          </div>

          <h2 id="closing-cta-heading" className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.14]">
            Follow the journey as it happens.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Watch each daily episode, critique the business decisions in the community discussion, and track our financial progress towards <span className="whitespace-nowrap">₹30 crore</span> in revenue.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="/episodes"
              className="inline-flex items-center space-x-2.5 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-200"
            >
              <Tv className="w-4 h-4 text-slate-950" />
              <span>Explore All Episodes</span>
              <ArrowRight className="w-4 h-4 text-slate-950 ml-0.5" />
            </a>

            <a
              href="/register"
              className="inline-flex items-center space-x-2.5 px-8 py-4 bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider border border-slate-300/80 dark:border-white/15 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Join Discussion</span>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-4 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram Vlogs</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
