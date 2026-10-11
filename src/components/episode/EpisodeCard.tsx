import React from "react";
import { Episode } from "@/lib/types/episode";
import { formatDate } from "@/lib/utils/formatters";
import { Calendar, MessageSquare, ArrowRight, Play, Sparkles } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const publishedDate = episode.published_at 
    ? formatDate(episode.published_at) 
    : formatDate(episode.created_at);

  return (
    <article className="group bg-navy-900/90 hover:bg-navy-850 border border-navy-800 hover:border-navy-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-subtle hover:shadow-card">
      {/* Top Banner / Day Badge */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold tracking-wide">
            <span>Day {episode.day_number}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <time dateTime={episode.published_at || episode.created_at}>
              {publishedDate}
            </time>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors leading-snug line-clamp-2 mb-2.5">
          <a href={`/episodes/${episode.slug}`}>
            {episode.title}
          </a>
        </h3>

        {/* Summary Excerpt (2-3 lines) */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {episode.summary}
        </p>

        {/* Tags */}
        {episode.tags && episode.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {episode.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-[11px] px-2 py-0.5 rounded-md bg-navy-950 text-slate-400 border border-navy-800"
              >
                #{tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3.5 bg-navy-950/60 border-t border-navy-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="inline-flex items-center space-x-1 text-slate-400">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{episode.comments_count || 0}</span>
          </span>

          {episode.summary_status === "approved" && (
            <span className="inline-flex items-center space-x-1 text-[11px] text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-800/40">
              <Sparkles className="w-3 h-3" />
              <span>Summary Verified</span>
            </span>
          )}
        </div>

        <a
          href={`/episodes/${episode.slug}`}
          className="inline-flex items-center space-x-1 text-brand-sky group-hover:text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-all"
        >
          <span>Read vlog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
