"use client";

import React, { useState } from "react";
import { ExternalLink, Play, AlertCircle, Video, ShieldCheck, RefreshCw } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { getInstagramEmbedUrl } from "@/lib/utils/instagram";

interface InstagramEmbedProps {
  url: string;
  dayNumber: number;
  title: string;
}

export function InstagramEmbed({ url, dayNumber, title }: InstagramEmbedProps) {
  const [showIframe, setShowIframe] = useState(false);
  const embedUrl = getInstagramEmbedUrl(url);

  return (
    <div className="w-full bg-slate-900/90 dark:bg-[#0c1017] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-300 relative group">
      {/* Top Gold Sheen Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

      {/* Embed Top Bar */}
      <div className="px-5 py-3.5 bg-slate-100/90 dark:bg-[#080b11] border-b border-slate-200/90 dark:border-white/10 flex items-center justify-between text-xs">
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
              onClick={() => setShowIframe(!showIframe)}
              className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              {showIframe ? "Cinema Theater Mode" : "Load Web Embed"}
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
          /* Wide Iframe View with dark frame */
          <div className="w-full flex flex-col items-center p-3 sm:p-4 bg-[#080b11]">
            <div className="w-full rounded-xl overflow-hidden border border-amber-500/20 bg-[#0a0e17] shadow-inner">
              <iframe
                src={embedUrl}
                className="w-full min-h-[440px] sm:min-h-[480px] bg-[#0a0e17]"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                title={`Day ${dayNumber}: ${title}`}
              />
            </div>
            <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Third-party Instagram embed viewer</span>
              <button
                onClick={() => setShowIframe(false)}
                className="text-amber-400 hover:underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Switch to Wide Cinema Player</span>
              </button>
            </div>
          </div>
        ) : (
          /* Wide Cinematic Theater Stage (Default - Eliminates Stark White Box) */
          <div className="relative w-full min-h-[360px] sm:min-h-[400px] flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-[#121927] via-[#0b0f18] to-[#07090e]">
            {/* Ambient Lighting Mesh */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Stage Badges */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Video className="w-3.5 h-3.5" />
                <span>Executive Vlog • Episode {dayNumber}</span>
              </div>

              <div className="text-[11px] font-mono text-slate-400 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                4K Master • Verified Log
              </div>
            </div>

            {/* Center Play Button & Title */}
            <div className="relative z-10 my-8 sm:my-10 flex flex-col items-center text-center">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative flex items-center justify-center mb-5"
                aria-label={`Watch Day ${dayNumber} on Instagram`}
              >
                {/* Pulsing Glow Rings */}
                <span className="absolute -inset-4 rounded-full bg-amber-500/20 blur-lg animate-pulse pointer-events-none" />
                <span className="absolute -inset-2 rounded-full bg-amber-400/30 blur pointer-events-none" />

                {/* Main Golden Play Button */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.6)] group-hover/btn:scale-110 group-hover/btn:shadow-[0_0_55px_rgba(245,158,11,0.9)] transition-all duration-300">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 ml-1 text-slate-950" />
                </div>
              </a>

              <h4 className="text-base sm:text-xl font-black text-white max-w-lg tracking-tight mb-2">
                Day {dayNumber}: {title}
              </h4>
              <p className="text-xs text-slate-400 max-w-md">
                Streamed on Instagram Reels by Dr. Ajay Kumar documenting live execution at AI Automation Labs LLP.
              </p>
            </div>

            {/* Bottom Actions Bar */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all"
              >
                <Instagram className="w-4 h-4 text-slate-950" />
                <span>Watch on Instagram (Direct Link)</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              {embedUrl && (
                <button
                  onClick={() => setShowIframe(true)}
                  className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
                >
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span>Load Web Embed</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
