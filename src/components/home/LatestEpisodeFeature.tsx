import React from "react";
import { Episode } from "@/lib/types/episode";
import { formatDate } from "@/lib/utils/formatters";
import { InstagramEmbed } from "../episode/InstagramEmbed";
import { Sparkles, ArrowRight, Calendar, MessageSquare, Play } from "lucide-react";

interface LatestEpisodeFeatureProps {
  episode: Episode | null;
}

export function LatestEpisodeFeature({ episode }: LatestEpisodeFeatureProps) {
  if (!episode) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" aria-labelledby="latest-episode-heading">
      <div className="flex items-center space-x-2 text-xs font-semibold text-brand-sky uppercase tracking-wider mb-3">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span>Featured Latest Daily Vlog</span>
      </div>

      <div className="bg-gradient-to-br from-navy-900 to-navy-950 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Embed / Video Player (lg:col-span-6) */}
          <div className="lg:col-span-6">
            <InstagramEmbed
              url={episode.instagram_url}
              dayNumber={episode.day_number}
              title={episode.title}
            />
          </div>

          {/* Right Column: Episode Insights & Takeaways (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold">
                  Day {episode.day_number}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formatDate(episode.published_at || episode.created_at)}</span>
                </span>
              </div>

              <h2 id="latest-episode-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 leading-snug">
                {episode.title}
              </h2>

              {/* Verified Editorial Summary */}
              <div className="bg-navy-950/80 border border-navy-800 rounded-xl p-4 sm:p-5 mb-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 block mb-2">
                  Episode Summary
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {episode.summary}
                </p>
              </div>

              {/* Key Takeaways */}
              {episode.takeaways && episode.takeaways.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2.5">
                    Core Decisions & Strategic Takeaways:
                  </span>
                  <ul className="space-y-2">
                    {episode.takeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300 leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0 mt-1.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CTA to Full Episode & Comments */}
            <div className="pt-5 border-t border-navy-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>{episode.comments_count || 0} Comments in Discussion</span>
              </span>

              <a
                href={`/episodes/${episode.slug}`}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-sky hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs shadow-subtle transition-all"
              >
                <span>Read Full Episode & Discussion</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
