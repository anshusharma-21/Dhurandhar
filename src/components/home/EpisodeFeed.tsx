import React from "react";
import { Episode } from "@/lib/types/episode";
import { EpisodeCard } from "../episode/EpisodeCard";
import { ArrowRight, Tv, Layers } from "lucide-react";

interface EpisodeFeedProps {
  episodes: Episode[];
}

export function EpisodeFeed({ episodes }: EpisodeFeedProps) {
  // Only display the 2 most recent episodes on the homepage (current latest post + 1 day old)
  const displayedEpisodes = episodes.slice(0, 2);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" aria-labelledby="episodes-feed-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">
            <Tv className="w-3.5 h-3.5 text-amber-500" />
            <span>DAILY LOG ARCHIVE</span>
          </div>
          <h2 id="episodes-feed-heading" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Recent Daily Dispatches
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Showing the latest 2 published chronicles. Explore all historical entries in the complete archive.
          </p>
        </div>

        <a
          href="/episodes"
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-300/80 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 shadow-xs hover:border-amber-500/40"
        >
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>View All Episodes ({episodes.length})</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      {/* 2 Sleek Recent Episodes (Latest + 1 Day Old) */}
      {displayedEpisodes.length === 0 ? (
        <div className="bg-[#121824] border border-slate-700/60 rounded-2xl p-8 text-center text-xs text-slate-400">
          No published episodes recorded yet. Check back daily.
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {displayedEpisodes.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      )}
    </section>
  );
}
