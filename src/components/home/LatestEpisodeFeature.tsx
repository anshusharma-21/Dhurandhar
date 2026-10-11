import React from "react";
import { Episode } from "@/lib/types/episode";
import { formatDate } from "@/lib/utils/formatters";
import { InstagramEmbed } from "../episode/InstagramEmbed";
import { Sparkles, ArrowRight, Calendar, MessageSquare, Tv } from "lucide-react";

interface LatestEpisodeFeatureProps {
  episode: Episode | null;
}

export function LatestEpisodeFeature({ episode }: LatestEpisodeFeatureProps) {
  // If no published episode exists, show a polished empty state rather than fake content
  if (!episode || episode.status !== "published") {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="latest-episode-heading">
        <div className="bg-white/80 dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <Tv className="w-6 h-6" />
          </div>
          <h2 id="latest-episode-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            Upcoming Daily Episode
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The editorial desk is currently recording the next daily log. Published episodes will appear here automatically.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24" aria-labelledby="latest-episode-heading">
      <div className="space-y-4 mb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>FEATURED LATEST ENTRY</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 id="latest-episode-heading" className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Day {episode.day_number}: The Latest Briefing
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={episode.published_at || episode.created_at}>
              {formatDate(episode.published_at || episode.created_at)}
            </time>
          </span>
        </div>
      </div>

      <div className="bg-white/90 dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors duration-150">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Embed / Media Preview (lg:col-span-6) */}
          <div className="lg:col-span-6">
            <InstagramEmbed
              url={episode.instagram_url}
              dayNumber={episode.day_number}
              title={episode.title}
            />
          </div>

          {/* Right Column: Episode Context & Verified Takeaways (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <span className="px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/30 text-xs font-extrabold uppercase tracking-wider">
                  Day {episode.day_number} Record
                </span>
                {episode.tags && episode.tags.length > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {episode.tags.map((t) => t.label).join(" • ")}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {episode.title}
              </h3>

              {/* Verified Editorial Summary */}
              {episode.summary && (
                <div className="bg-slate-50/90 dark:bg-[#131824] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400 block mb-2">
                    Executive Briefing
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {episode.summary}
                  </p>
                </div>
              )}

              {/* Key Decisions & Takeaways */}
              {episode.takeaways && episode.takeaways.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider block">
                    Key Decisions & Takeaways:
                  </span>
                  <ul className="space-y-2.5">
                    {episode.takeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>{episode.comments_count || 0} Comments in Community</span>
              </span>

              <a
                href={`/episodes/${episode.slug}`}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
              >
                <span>Read Full Log & Discussion</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
