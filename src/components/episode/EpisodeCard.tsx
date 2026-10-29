"use client";

import React, { useState } from "react";
import { Episode } from "@/lib/types/episode";
import { MessageSquare, ArrowRight, Play, Film } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
  layout?: "horizontal" | "vertical";
}

export function EpisodeCard({ episode, layout = "horizontal" }: EpisodeCardProps) {
  const [thumbError, setThumbError] = useState(false);

  const defaultSummary =
    episode.summary ||
    `Day ${episode.day_number} chronicle documenting enterprise operations, daily decisions, and strategic revenue milestones on Project Dhurandhar.`;

  const thumbnailUrl = episode.instagram_url
    ? `/api/instagram/thumbnail?url=${encodeURIComponent(episode.instagram_url)}`
    : "";

  // =========================================================================
  // VERTICAL LAYOUT (Dedicated for Homepage 2-Column Equal-Height Feed)
  // =========================================================================
  if (layout === "vertical") {
    return (
      <article className="group relative overflow-hidden bg-gradient-to-br from-[#161f32] via-[#111726] to-[#0a0f1a] border border-slate-700/80 hover:border-amber-400/60 rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between shadow-md h-full">
        {/* Golden top hairline accent on hover */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Ambient background glow inside card */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-400/20 transition-all pointer-events-none" />

        {/* Main Content Area */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Top Metadata Row */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Day {episode.day_number}</span>
              </div>
            </div>

            {/* Episode Title */}
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug tracking-tight mb-2">
              <a href={`/episodes/${episode.slug}`} className="hover:underline focus:outline-none">
                {episode.title}
              </a>
            </h3>

            {/* Summary Excerpt */}
            <p className="text-xs text-slate-300/85 leading-relaxed line-clamp-2 mb-3 font-normal">
              {defaultSummary}
            </p>
          </div>

          {/* Tags / Topics Row */}
          {episode.tags && episode.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
              {episode.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.08] text-amber-300/85 border border-white/10 transition-colors"
                >
                  #{tag.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Action Footer Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#080d16]/95 border-t border-white/10 flex items-center justify-between text-xs backdrop-blur-xs">
          <div className="flex items-center space-x-2.5 text-slate-400">
            <span className="inline-flex items-center space-x-1.5 text-[11px] font-medium">
              <MessageSquare className="w-3 h-3 text-amber-400" />
              <span>{episode.comments_count || 0} discussion</span>
            </span>
          </div>

          <a
            href={`/episodes/${episode.slug}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] uppercase tracking-wider transition-all border border-amber-500/30 group-hover:border-amber-400 shadow-xs"
          >
            <span>Watch Vlog</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </article>
    );
  }

  // =========================================================================
  // HORIZONTAL LAYOUT (Dedicated for Episodes Archive Feed)
  // =========================================================================
  return (
    <article className="group relative overflow-hidden bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-400/50 rounded-2xl p-4 sm:p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg shadow-sm">
      {/* Top golden hairline accent on hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch">
        {/* =========================================================================
            LEFT: ROUNDED THUMBNAIL WITH PLAY OVERLAY & BADGE
            ========================================================================= */}
        <div className="relative w-full sm:w-56 md:w-64 shrink-0 rounded-xl overflow-hidden bg-slate-950 aspect-[16/10] sm:aspect-[4/3] flex items-center justify-center group/thumb shadow-xs">
          {thumbnailUrl && !thumbError ? (
            <img
              src={thumbnailUrl}
              alt={`Day ${episode.day_number}: ${episode.title}`}
              className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform duration-500"
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

          {/* Gradient dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />

          {/* Play Button Overlay */}
          <a
            href={`/episodes/${episode.slug}`}
            className="absolute inset-0 flex items-center justify-center z-10"
            aria-label={`Watch Day ${episode.day_number}: ${episode.title}`}
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-[2px] shadow-[0_0_16px_rgba(245,158,11,0.55)] group-hover/thumb:scale-110 transition-all duration-300">
              <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center pl-0.5">
                <Play className="w-4 h-4 text-amber-400 fill-amber-400 group-hover/thumb:text-amber-300 transition-colors" />
              </div>
            </div>
          </a>

          {/* Bottom Badge on Thumbnail */}
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded bg-black/75 text-amber-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
              Watch Vlog
            </span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT: DAY BADGE, TITLE, SUMMARY, HASHTAGS, COMMENTS, CTA
            ========================================================================= */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Top Row: DAY Pill */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-700 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Day {episode.day_number}</span>
              </div>
            </div>

            {/* Episode Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug tracking-tight mb-2">
              <a href={`/episodes/${episode.slug}`} className="hover:underline focus:outline-none">
                {episode.title}
              </a>
            </h3>

            {/* Summary Excerpt */}
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 font-normal">
              {defaultSummary}
            </p>
          </div>

          {/* Bottom Meta Bar: Tags, Comments & Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {episode.tags && episode.tags.length > 0 ? (
                episode.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-amber-300/85 border border-slate-200 dark:border-white/10"
                  >
                    #{tag.label}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400">#ProjectDhurandhar</span>
              )}
            </div>

            {/* Comments Counter & CTA */}
            <div className="flex items-center space-x-3 ml-auto sm:ml-0">
              <span className="inline-flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>{episode.comments_count || 0} discussion</span>
              </span>

              <a
                href={`/episodes/${episode.slug}`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] uppercase tracking-wider transition-all shadow-xs"
              >
                <span>Watch Vlog</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
