"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Play, AlertCircle } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { getInstagramEmbedUrl } from "@/lib/utils/instagram";

interface InstagramEmbedProps {
  url: string;
  dayNumber: number;
  title: string;
}

export function InstagramEmbed({ url, dayNumber, title }: InstagramEmbedProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const embedUrl = getInstagramEmbedUrl(url);

  useEffect(() => {
    // Only inject Instagram embed script once
    if (typeof window !== "undefined") {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };
      script.onerror = () => {
        setLoadError(true);
      };
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div className="w-full bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-card">
      {/* Embed Top Bar */}
      <div className="px-4 py-3 bg-navy-950/80 border-b border-navy-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <Instagram className="w-4 h-4 text-pink-500" />
          <span className="font-semibold text-white">Instagram Daily Vlog</span>
          <span className="text-slate-500">•</span>
          <span className="text-brand-gold font-medium">Day {dayNumber}</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-brand-sky hover:text-white transition-colors"
        >
          <span>Open on Instagram</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Embed Container / Fallback */}
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[380px] bg-navy-950/40">
        {/* If valid embed URL, render responsive iframe container */}
        {embedUrl ? (
          <div className="w-full max-w-[500px] flex flex-col items-center">
            <iframe
              src={embedUrl}
              className="w-full min-h-[460px] sm:min-h-[520px] rounded-xl border border-navy-800 bg-navy-900"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
              title={`Day ${dayNumber}: ${title}`}
            />
            {/* Fallback persistent link (AC-03, AC-04) */}
            <div className="mt-4 text-center">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-navy-700 transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Watch on Instagram (Direct Link)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-slate-500 mt-1.5">
                If the video above is slow or age-restricted, tap the direct link to open in the Instagram app.
              </p>
            </div>
          </div>
        ) : (
          /* Graceful Fallback for missing/invalid link (AC-04) */
          <div className="text-center py-12 px-4 max-w-md">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7 text-brand-gold" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">
              Instagram Media Fallback
            </h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              This episode&apos;s video embed is currently unavailable or requires viewing directly on the Instagram platform.
            </p>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-subtle transition-all"
              >
                <Instagram className="w-4 h-4" />
                <span>Watch on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
