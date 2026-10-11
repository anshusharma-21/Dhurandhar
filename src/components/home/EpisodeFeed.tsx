import React from "react";
import { Episode } from "@/lib/types/episode";
import { EpisodeCard } from "../episode/EpisodeCard";
import { ArrowRight, Tv } from "lucide-react";

interface EpisodeFeedProps {
  episodes: Episode[];
}

export function EpisodeFeed({ episodes }: EpisodeFeedProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" aria-labelledby="episodes-feed-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2">
            <Tv className="w-4 h-4 text-brand-gold" />
            <span>Chronological Vlog Journal</span>
          </div>
          <h2 id="episodes-feed-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Daily Episodes & Documentation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Each day chronicles real client wins, engineering obstacles, AI agent architectures, and business operations.
          </p>
        </div>

        <a
          href="/episodes"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-slate-200 hover:text-white border border-navy-700 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <span>View All Episodes Archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Grid of Cards */}
      {episodes.length === 0 ? (
        <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-12 text-center text-xs text-slate-400">
          No published episodes found yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      )}
    </section>
  );
}
