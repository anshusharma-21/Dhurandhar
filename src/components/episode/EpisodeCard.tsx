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
    <article className="group relative overflow-hidden bg-[#0c121e] hover:bg-[#101726] border border-slate-800/90 hover:border-amber-400/50 rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 shadow-lg">
      {/* Top golden hairline accent on hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Subtle ambient corner glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/5 group-hover:bg-amber-400/15 rounded-full blur-3xl pointer-events-none transition-all duration-500" />

      <div className="flex flex-col sm:flex-row items-stretch">
        {/* =========================================================================
            LEFT COLUMN: THUMBNAIL & WATCH VLOG (Reel Portrait Aspect Ratio)
            ========================================================================= */}
        <div className="relative w-full sm:w-52 md:w-60 lg:w-64 shrink-0 bg-slate-950 flex flex-col justify-between overflow-hidden border-b sm:border-b-0 sm:border-r border-slate-800/80 group/thumb">
          {/* Reel aspect ratio with object-top to keep faces perfectly visible */}
          <div className="relative w-full aspect-[4/5] sm:aspect-auto sm:h-full min-h-[220px] bg-slate-950 overflow-hidden flex items-center justify-center">
            {thumbnailUrl && !thumbError ? (
              <img
                src={thumbnailUrl}
                alt={`Day ${episode.day_number}: ${episode.title}`}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                onError={() => setThumbError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-500 p-4">
                <Film className="w-10 h-10 text-amber-500/50 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Day {episode.day_number}
                </span>
              </div>
            )}

            {/* Gradient vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Interactive Play Button */}
            <a
              href={`/episodes/${episode.slug}`}
              className="absolute inset-0 flex items-center justify-center transition-all z-10"
              aria-label={`Watch Day ${episode.day_number}: ${episode.title}`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-[2px] shadow-[0_0_24px_rgba(245,158,11,0.55)] group-hover/thumb:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-xs flex items-center justify-center pl-0.5">
                  <Play className="w-5 h-5 text-amber-400 fill-amber-400 group-hover/thumb:text-amber-300 transition-colors" />
                </div>
              </div>
            </a>
          </div>

          {/* Watch Vlog Action Bar under thumbnail */}
          <a
            href={`/episodes/${episode.slug}`}
            className="hidden sm:inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-slate-900/95 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold text-xs uppercase tracking-wider border-t border-slate-800 transition-colors z-10"
          >
            <span>Watch Vlog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DAY BADGE, TITLE, SUMMARY, TAGS, COMMENTS
            ========================================================================= */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            {/* Top Row: DAY Pill */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>DAY {episode.day_number}</span>
              </span>

              {episode.instagram_url && (
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                  Daily Reel
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug tracking-tight">
              <a href={`/episodes/${episode.slug}`} className="hover:underline focus:outline-none">
                {episode.title}
              </a>
            </h3>

            {/* Description / Summary */}
            <p className="text-xs sm:text-[13px] text-slate-300/80 leading-relaxed line-clamp-3 font-normal">
              {defaultSummary}
            </p>
          </div>

          {/* Bottom Meta Bar: Tags, Comments, and CTA */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {episode.tags && episode.tags.length > 0 ? (
                episode.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700/80 text-amber-300/90 border border-slate-700/60 transition-colors"
                  >
                    #{tag.label}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-500">#ProjectDhurandhar</span>
              )}
            </div>

            {/* Comments Counter & Action */}
            <div className="flex items-center space-x-3 ml-auto sm:ml-0">
              <span className="inline-flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>{episode.comments_count || 0} discussion</span>
              </span>

              {/* Mobile Watch Button */}
              <a
                href={`/episodes/${episode.slug}`}
                className="sm:hidden inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase"
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
