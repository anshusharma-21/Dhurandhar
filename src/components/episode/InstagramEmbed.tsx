"use client";

import React, { useState } from "react";
import { ExternalLink, Play, Video, RefreshCw } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { getInstagramEmbedUrl } from "@/lib/utils/instagram";

interface InstagramEmbedProps {
  url: string;
  dayNumber: number;
  title: string;
  className?: string;
}

export function InstagramEmbed({ url, dayNumber, title, className = "" }: InstagramEmbedProps) {
  const [showIframe, setShowIframe] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const embedUrl = getInstagramEmbedUrl(url);
  const thumbnailUrl = url ? `/api/instagram/thumbnail?url=${encodeURIComponent(url)}` : "";

  return (
    <div
      className={`w-full flex flex-col justify-between bg-slate-900/95 dark:bg-[#0c1017] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-300 relative group ${className}`}
    >
      {/* Top Gold Sheen Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 z-20" />

      {/* Embed Top Bar */}
      <div className="px-4 sm:px-5 py-3 bg-slate-100/90 dark:bg-[#080b11] border-b border-slate-200/90 dark:border-white/10 flex items-center justify-between text-xs relative z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Daily Vlog</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-amber-700 dark:text-amber-400 font-extrabold uppercase tracking-wider">
            Day {dayNumber}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {embedUrl && (
            <button
              type="button"
              onClick={() => setShowIframe(!showIframe)}
              className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              {showIframe ? "Video Poster" : "Interactive View"}
            </button>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Video Player Stage */}
      <div className="relative flex-1 w-full bg-slate-950 overflow-hidden flex flex-col justify-between min-h-[380px] sm:min-h-[440px]">
        {showIframe && embedUrl ? (
          /* Live Interactive Iframe View */
          <div className="w-full flex-1 flex flex-col items-center p-3 sm:p-4 bg-[#080b11] overflow-y-auto">
            <div className="w-full rounded-xl overflow-hidden border border-amber-500/20 bg-[#0a0e17] shadow-inner">
              <iframe
                src={embedUrl}
                className="w-full min-h-[500px] sm:min-h-[560px] bg-[#0a0e17]"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                title={`Day ${dayNumber}: ${title}`}
              />
            </div>
            <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Official Instagram Reel Embed</span>
              <button
                type="button"
                onClick={() => setShowIframe(false)}
                className="text-amber-400 hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Return to Video Poster</span>
              </button>
            </div>
          </div>
        ) : (
          /* Clean Cinematic Video Poster Stage */
          <div className="relative flex-1 w-full flex flex-col justify-between overflow-hidden">
            {/* Ambient Blurred Background (adds depth & prevents ugly black borders) */}
            {thumbnailUrl && !thumbnailError ? (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  src={thumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover filter blur-2xl scale-125 opacity-35 brightness-75"
                />
              </div>
            ) : null}

            {/* Main Stage: Cinematic Video Thumbnail with 9:16 / 4:5 Proportion Frame */}
            <div className="relative flex-1 w-full flex items-center justify-center p-4 sm:p-6">
              <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-amber-500/40 transition-all duration-500">
                {thumbnailUrl && !thumbnailError ? (
                  <img
                    src={thumbnailUrl}
                    alt={`Day ${dayNumber} Video`}
                    onError={() => setThumbnailError(true)}
                    className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <img
                    src="/images/hero-cinematic.jpg"
                    alt="Project Dhurandhar Briefing"
                    className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.1] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}

                {/* Ambient Center Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45 pointer-events-none" />

                {/* Floating Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (embedUrl) {
                        setShowIframe(true);
                      } else if (url) {
                        window.open(url, "_blank", "noopener,noreferrer");
                      }
                    }}
                    className="group/btn relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
                    aria-label={`Play Day ${dayNumber} Video`}
                  >
                    <span className="absolute -inset-4 rounded-full bg-amber-500/30 blur-xl animate-pulse pointer-events-none" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.7)] group-hover/btn:shadow-[0_0_55px_rgba(245,158,11,1)] transition-all">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-slate-950 ml-1 text-slate-950" />
                    </div>
                    <span className="mt-3 text-[11px] sm:text-xs font-black uppercase tracking-wider text-white drop-shadow-md">
                      Play Day {dayNumber} Reel
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="relative z-10 p-3.5 sm:p-4 bg-slate-900/90 dark:bg-[#080b11] border-t border-slate-200/90 dark:border-white/10 flex items-center justify-between gap-2.5">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-amber-500/30 transition-all text-center"
              >
                <Instagram className="w-3.5 h-3.5 text-slate-950" />
                <span>Watch on Instagram</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              {embedUrl && (
                <button
                  type="button"
                  onClick={() => setShowIframe(true)}
                  className="inline-flex items-center justify-center space-x-1 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 text-xs font-semibold transition-all cursor-pointer"
                  title="Expand Interactive Instagram Embed"
                >
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Embed</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
