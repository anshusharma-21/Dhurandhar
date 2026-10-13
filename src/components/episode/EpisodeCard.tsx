import React from "react";
import { Episode } from "@/lib/types/episode";
import { formatDate } from "@/lib/utils/formatters";
import { Calendar, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const publishedDate = episode.published_at 
    ? formatDate(episode.published_at) 
    : formatDate(episode.created_at);

  return (
    <article className="group relative overflow-hidden bg-white/90 dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#121824] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-amber-400/60 rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-6px_rgba(245,158,11,0.22)] flex flex-col justify-between shadow-sm dark:shadow-card">
      {/* Golden top accent bar on hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Top Content / Day Badge */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold tracking-wide">
            <span>Day {episode.day_number}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={episode.published_at || episode.created_at}>
              {publishedDate}
            </time>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2 mb-2.5">
          <a href={`/episodes/${episode.slug}`}>
            {episode.title}
          </a>
        </h3>

        {/* Summary Excerpt */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {episode.summary}
        </p>

        {/* Tags */}
        {episode.tags && episode.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {episode.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#171e2c] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/5"
              >
                #{tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-[#090d14] border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center space-x-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{episode.comments_count || 0}</span>
          </span>

          {episode.summary_status === "approved" && (
            <span className="inline-flex items-center space-x-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Verified Log</span>
            </span>
          )}
        </div>

        <a
          href={`/episodes/${episode.slug}`}
          className="inline-flex items-center space-x-1 text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 font-bold group-hover:translate-x-0.5 transition-all"
        >
          <span>Read vlog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
