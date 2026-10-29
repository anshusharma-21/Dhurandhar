import React from "react";
import { Episode } from "@/lib/types/episode";
import { formatDate } from "@/lib/utils/formatters";
import { InstagramEmbed } from "../episode/InstagramEmbed";
import { Sparkles, ArrowRight, Calendar, MessageSquare, Tv, ShieldCheck } from "lucide-react";

interface LatestEpisodeFeatureProps {
  episode: Episode | null;
}

export function LatestEpisodeFeature({ episode }: LatestEpisodeFeatureProps) {
  // If no published episode exists, show a polished empty state
  if (!episode || episode.status !== "published") {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-labelledby="latest-episode-heading">
        <div className="bg-[#121826] border border-slate-700/70 rounded-2xl p-8 text-center max-w-md mx-auto space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Tv className="w-5 h-5" />
          </div>
          <h2 id="latest-episode-heading" className="text-lg font-bold text-white">
            Upcoming Daily Episode
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The editorial desk is currently recording the next daily log. Published episodes will appear here automatically.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" aria-labelledby="latest-episode-heading">
      {/* Header Label & Date */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2.5">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>FEATURED BRIEFING</span>
          </div>
          <h2 id="latest-episode-heading" className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Day {episode.day_number}: The Latest Briefing
          </h2>
        </div>
      </div>

      {/* Main Feature Container - Titanium Slate-Navy Palette (Neither Plain White Nor Pure Black) */}
      <div className="bg-gradient-to-br from-[#161f30] via-[#121826] to-[#0d121c] border border-slate-700/80 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Gold Hairline & Accent Glow */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          
          {/* Left Column: Media Player (Compact 9:16 frame inside 5 cols) */}
          <div className="lg:col-span-5 flex flex-col w-full h-full">
            <InstagramEmbed
              url={episode.instagram_url}
              dayNumber={episode.day_number}
              title={episode.title}
              className="h-full"
            />
          </div>

          {/* Right Column: Briefing & High-Impact Takeaways (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              {/* Badges & Tags Row */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/35 text-[10px] font-black uppercase tracking-wider">
                  Day {episode.day_number} Record
                </span>
                {episode.tags && episode.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    {episode.tags.map((t) => (
                      <span
                        key={t.id || t.slug}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300"
                      >
                        #{t.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {episode.title}
              </h3>

              {/* Executive Briefing Memo Box */}
              {episode.summary && (
                <div className="bg-[#0e1422]/90 border-l-4 border-amber-400 border-y border-r border-slate-800/90 rounded-r-xl p-3.5 sm:p-4 shadow-sm">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
                      Executive Briefing
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
                    {episode.summary}
                  </p>
                </div>
              )}

              {/* Key Decisions & Takeaways - High-Impact Luxury Cards */}
              {episode.takeaways && episode.takeaways.length > 0 && (
                <div className="space-y-2 pt-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                      <span>Key Strategic Decisions & Takeaways</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-400">
                      {episode.takeaways.length} Key Decisions
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {episode.takeaways.map((takeaway, idx) => (
                      <div
                        key={idx}
                        className="group flex flex-col justify-between p-3 rounded-xl bg-[#162033]/90 border border-slate-700/60 hover:border-amber-400/50 hover:bg-[#1c2940] transition-all duration-200 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-black tracking-wider border border-amber-500/30 flex items-center space-x-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                            <span>DECISION {String(idx + 1).padStart(2, "0")}</span>
                          </span>
                          <ShieldCheck className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium group-hover:text-white transition-colors">
                          {takeaway}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Footer */}
            <div className="pt-3.5 border-t border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-400 flex items-center space-x-2">
                <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
                  <MessageSquare className="w-3 h-3" />
                </div>
                <span className="font-semibold text-slate-300 text-[11px]">{episode.comments_count || 0} Community Discussions</span>
              </span>

              <a
                href={`/episodes/${episode.slug}`}
                className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <span>Read Full Log & Discussion</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
