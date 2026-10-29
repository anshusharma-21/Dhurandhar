"use client";

import React, { useState } from "react";
import { Episode } from "@/lib/types/episode";
import { MessageSquare, ArrowRight, Play, Film } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const [thumbError, setThumbError] = useState(false);

  const defaultSummary =
    episode.summary ||
    `Day ${episode.day_number} chronicle documenting enterprise operations, daily decisions, and strategic revenue milestones on Project Dhurandhar.`;

  const thumbnailUrl = episode.instagram_url
    ? `/api/instagram/thumbnail?url=${encodeURIComponent(episode.instagram_url)}`
    : "";

  return (
    <article className="group relative overflow-hidden bg-gradient-to-br from-[#161f32] via-[#111726] to-[#0a0f1a] border border-slate-700/80 hover:border-amber-400/60 rounded-2xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl shadow-md">
      {/* Top golden hairline accent on hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Ambient background glow inside card */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-stretch">
        {/* =========================================================================
            LEFT COLUMN: THUMBNAIL & WATCH VLOG
            ========================================================================= */}
        <div className="relative w-full sm:w-56 md:w-64 lg:w-72 shrink-0 bg-slate-950 flex flex-col justify-between overflow-hidden border-b sm:border-b-0 sm:border-r border-slate-700/60 group/thumb">
          {/* Aspect-ratio container for the video thumbnail */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
            {thumbnailUrl && !thumbError ? (
              <img
                src={thumbnailUrl}
                alt={`Day ${episode.day_number}: ${episode.title}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setThumbError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-500">
                <Film className="w-8 h-8 text-amber-500/60 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Day {episode.day_number}
                </span>
              </div>
            )}

            {/* Play Button Overlay */}
            <a
              href={`/episodes/${episode.slug}`}
              className="absolute inset-0 bg-black/35 hover:bg-black/20 flex items-center justify-center transition-all group-hover/thumb:bg-black/15 z-10"
              aria-label={`Watch Day ${episode.day_number}: ${episode.title}`}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-[2px] shadow-[0_0_20px_rgba(245,158,11,0.55)] group-hover/thumb:scale-110 transition-all duration-300">
                <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center pl-0.5">
                  <Play className="w-5 h-5 text-amber-400 fill-amber-400 group-hover/thumb:text-amber-300 transition-colors" />
                </div>
              </div>
            </a>
          </div>

          {/* Watch Vlog Action Bar under thumbnail */}
          <a
            href={`/episodes/${episode.slug}`}
            className="hidden sm:inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-[#0a0f1a] hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] uppercase tracking-wider border-t border-slate-700/60 transition-colors z-10"
          >
            <span>Watch Vlog</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DAY, TITLE, DESCRIPTION, HASHTAGS, COMMENTS
            ========================================================================= */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Top Row: Day Badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Day {episode.day_number}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug tracking-tight mb-2.5">
              <a href={`/episodes/${episode.slug}`} className="hover:underline focus:outline-none">
                {episode.title}
              </a>
            </h3>

            {/* Description / Summary */}
            <p className="text-xs sm:text-[13px] text-slate-300/85 leading-relaxed line-clamp-3 mb-4 font-normal">
              {defaultSummary}
            </p>
          </div>

          {/* Bottom Meta: Hashtags & Comments Count */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {episode.tags && episode.tags.length > 0 ? (
                episode.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.08] text-amber-300/85 border border-white/10 transition-colors"
                  >
                    #{tag.label}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-500">#ProjectDhurandhar</span>
              )}
            </div>

            {/* Comments Counter */}
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>{episode.comments_count || 0} discussion</span>
              </span>

              {/* Mobile Watch Button */}
              <a
                href={`/episodes/${episode.slug}`}
                className="sm:hidden inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-[11px] uppercase"
              >
                <span>Watch</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
