import React from "react";
import { Episode } from "@/lib/types/episode";
import { EpisodeCard } from "../episode/EpisodeCard";
import { ArrowRight, Tv } from "lucide-react";

interface EpisodeFeedProps {
  episodes: Episode[];
}

export function EpisodeFeed({ episodes }: EpisodeFeedProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24" aria-labelledby="episodes-feed-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
            <Tv className="w-4 h-4 text-amber-500" />
            <span>THE ARCHIVE RECORD</span>
          </div>
          <h2 id="episodes-feed-heading" className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Daily Episodes & Documentation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Each day chronicles real client delivery, software obstacles, enterprise AI automation architectures, and business operations.
          </p>
        </div>

        <a
          href="/episodes"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-300/80 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0"
        >
          <span>View All Episodes Archive</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      {/* Grid of Lightweight Cards (Preserving AC-20) */}
      {episodes.length === 0 ? (
        <div className="bg-white/80 dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-12 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          No published episodes recorded yet. Check back daily.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      )}
    </section>
  );
}
