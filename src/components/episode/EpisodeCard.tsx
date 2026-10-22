import React from "react";
import { Episode } from "@/lib/types/episode";
import { formatDate } from "@/lib/utils/formatters";
import { Calendar, MessageSquare, ArrowRight, Sparkles, Play, ShieldCheck } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const publishedDate = episode.published_at 
    ? formatDate(episode.published_at) 
    : formatDate(episode.created_at);

  const defaultSummary = episode.summary || 
    `Day ${episode.day_number} chronicle documenting enterprise operations, daily decisions, and strategic revenue milestones on Project Dhurandhar.`;

  return (
    <article className="group relative overflow-hidden bg-gradient-to-br from-[#161f32] via-[#111726] to-[#0a0f1a] border border-slate-700/80 hover:border-amber-400/60 rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between shadow-md">
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

            <div className="flex items-center space-x-1.5 text-[11px] font-medium text-slate-400 font-mono">
              <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
              <time dateTime={episode.published_at || episode.created_at}>
                {publishedDate}
              </time>
            </div>
          </div>

          {/* Episode Title */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug tracking-tight mb-2">
            <a href={`/episodes/${episode.slug}`} className="hover:underline focus:outline-none">
              {episode.title}
            </a>
          </h3>

          {/* Summary Excerpt (Compact 2 Lines) */}
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

          {episode.summary_status === "approved" && (
            <span className="inline-flex items-center space-x-1 text-[10px] text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
              <Sparkles className="w-2.5 h-2.5 text-teal-400" />
              <span>Verified Log</span>
            </span>
          )}
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
