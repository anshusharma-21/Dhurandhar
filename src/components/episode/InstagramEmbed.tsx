"use client";

import React, { useState } from "react";
import { ExternalLink, Play, AlertCircle, Video, RefreshCw } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { getInstagramEmbedUrl } from "@/lib/utils/instagram";

interface InstagramEmbedProps {
  url: string;
  dayNumber: number;
  title: string;
}

export function InstagramEmbed({ url, dayNumber, title }: InstagramEmbedProps) {
  const [showIframe, setShowIframe] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const embedUrl = getInstagramEmbedUrl(url);
  const thumbnailUrl = url ? `/api/instagram/thumbnail?url=${encodeURIComponent(url)}` : "";

  return (
    <div className="w-full bg-slate-900/90 dark:bg-[#0c1017] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-300 relative group">
      {/* Top Gold Sheen Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 z-20" />

      {/* Embed Top Bar */}
      <div className="px-5 py-3.5 bg-slate-100/90 dark:bg-[#080b11] border-b border-slate-200/90 dark:border-white/10 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Instagram Daily Vlog</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-amber-700 dark:text-amber-400 font-extrabold uppercase tracking-wider">
            Day {dayNumber}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {embedUrl && (
            <button
              type="button"
              onClick={() => setShowIframe(!showIframe)}
              className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              {showIframe ? "Video Player Poster" : "Interactive Web Embed"}
            </button>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <span>Open on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Wide Video Player Stage */}
      <div className="relative w-full bg-slate-950 overflow-hidden">
        {showIframe && embedUrl ? (
          /* Live Interactive Iframe View with dark frame */
          <div className="w-full flex flex-col items-center p-3 sm:p-4 bg-[#080b11]">
            <div className="w-full rounded-xl overflow-hidden border border-amber-500/20 bg-[#0a0e17] shadow-inner">
              <iframe
                src={embedUrl}
                className="w-full min-h-[520px] sm:min-h-[580px] bg-[#0a0e17]"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                title={`Day ${dayNumber}: ${title}`}
              />
            </div>
            <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Official Instagram Embed</span>
              <button
                type="button"
                onClick={() => setShowIframe(false)}
                className="text-amber-400 hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Switch to Video Player</span>
              </button>
            </div>
          </div>
        ) : (
          /* Clean Video Player Stage with Actual Video Cover and ONLY the Play Button */
          <div className="relative w-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-[#121927] via-[#0b0f18] to-[#07090e] overflow-hidden">
            {/* Actual Video Thumbnail / Cover from Instagram */}
            {thumbnailUrl && !thumbnailError ? (
              <img
                src={thumbnailUrl}
                alt={`Day ${dayNumber} Video`}
                onError={() => setThumbnailError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : null}

            {/* Ambient Lighting & Subtle Dark Vignette Overlay for Crisp Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/60 pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Center Play Button Only (All clutter text lines removed as requested) */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  if (embedUrl) {
                    setShowIframe(true);
                  } else if (url) {
                    window.open(url, "_blank", "noopener,noreferrer");
                  }
                }}
                className="group/btn relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
                aria-label={`Play Day ${dayNumber} Video`}
              >
                {/* Pulsing Glow Rings */}
                <span className="absolute -inset-4 sm:-inset-6 rounded-full bg-amber-500/30 blur-xl animate-pulse pointer-events-none" />
                <span className="absolute -inset-2 sm:-inset-3 rounded-full bg-amber-400/40 blur-md pointer-events-none" />

                {/* Main Golden Play Button */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.7)] group-hover/btn:shadow-[0_0_60px_rgba(245,158,11,1)] transition-all duration-300">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-1 text-slate-950" />
                </div>
              </button>
            </div>

            {/* Bottom Actions Bar */}
            <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all"
              >
                <Instagram className="w-4 h-4 text-slate-950" />
                <span>Watch on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              {embedUrl && (
                <button
                  type="button"
                  onClick={() => setShowIframe(true)}
                  className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/20 text-xs font-semibold backdrop-blur-sm transition-all cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Web Embed</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
