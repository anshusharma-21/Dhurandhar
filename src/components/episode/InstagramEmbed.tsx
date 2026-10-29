"use client";

import React, { useState, useRef } from "react";
import { ExternalLink, Play, RotateCcw } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { getInstagramEmbedUrl } from "@/lib/utils/instagram";

interface InstagramEmbedProps {
  url: string;
  videoUrl?: string;
  dayNumber: number;
  title: string;
  className?: string;
}

export function InstagramEmbed({
  url,
  videoUrl,
  dayNumber,
  title,
  className = "",
}: InstagramEmbedProps) {
  const [thumbnailError, setThumbnailError] = useState(false);
  const [useNativeVideo, setUseNativeVideo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Resolved direct video from Supabase Storage or prop
  const defaultStorageVideo =
    dayNumber > 0
      ? `https://cswqqbyvrqyclcnikiuu.supabase.co/storage/v1/object/public/media/videos/day-${dayNumber}.mp4`
      : null;
  const resolvedVideo = videoUrl || defaultStorageVideo;

  const embedUrl = getInstagramEmbedUrl(url);
  const thumbnailUrl = url ? `/api/instagram/thumbnail?url=${encodeURIComponent(url)}` : "";

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasEnded(false);
        })
        .catch((err) => {
          console.warn("Autoplay blocked or playback error:", err);
          setIsPlaying(true);
        });
    }
  };

  const handleReplay = () => {
    if (useNativeVideo && resolvedVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasEnded(false);
        })
        .catch(() => {});
    } else {
      setIframeKey((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`w-full flex flex-col justify-between bg-slate-900/95 dark:bg-[#0c1017] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-300 relative group ${className}`}
    >
      {/* Top Gold Sheen Accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 z-20" />

      {/* Embed Top Bar */}
      <div className="px-4 sm:px-5 py-3 bg-slate-100/90 dark:bg-[#080b11] border-b border-slate-200/90 dark:border-white/10 flex items-center justify-between text-xs relative z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Daily Vlog</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-amber-700 dark:text-amber-400 font-extrabold uppercase tracking-wider">
            Day {dayNumber}
          </span>
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            title="Open original Reel on Instagram"
          >
            <span>Instagram Post</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Video Player Stage: Full height, proper 9:16 proportions */}
      <div className="relative flex-1 w-full min-h-[480px] sm:min-h-[540px] max-h-[640px] bg-black overflow-hidden flex items-center justify-center">
        {/* Ambient Blurred Backdrop Glow */}
        {thumbnailUrl && !thumbnailError && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 filter blur-3xl scale-125">
            <img
              src={thumbnailUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setThumbnailError(true)}
            />
          </div>
        )}

        {useNativeVideo && resolvedVideo ? (
          /* =========================================================================
             1. NATIVE IN-PLACE HIGH DEFINITION VIDEO PLAYER
             - Directly plays inline upon clicking the play button
             - NEVER redirects to Instagram
             - Replays cleanly in-place without any "Watch again on Instagram" screen
             ========================================================================= */
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={resolvedVideo}
              controls={isPlaying}
              playsInline
              preload="metadata"
              className="w-full h-full max-h-[620px] object-contain relative z-10"
              poster={thumbnailUrl && !thumbnailError ? thumbnailUrl : undefined}
              onPlay={() => {
                setIsPlaying(true);
                setHasEnded(false);
              }}
              onPause={() => {
                if (videoRef.current && videoRef.current.ended) {
                  setHasEnded(true);
                }
              }}
              onEnded={() => {
                setHasEnded(true);
                setIsPlaying(false);
              }}
              onError={() => {
                console.warn(`Direct MP4 failed for Day ${dayNumber}, falling back to iframe embed`);
                setUseNativeVideo(false);
              }}
            />

            {/* Poster / Initial Play Overlay */}
            {!isPlaying && !hasEnded && (
              <button
                type="button"
                onClick={handlePlay}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 hover:bg-black/30 transition-all group/btn cursor-pointer"
                aria-label={`Play Day ${dayNumber} Video`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-[2px] shadow-[0_0_35px_rgba(245,158,11,0.55)] group-hover/btn:scale-110 group-hover/btn:shadow-[0_0_45px_rgba(245,158,11,0.85)] transition-all duration-300">
                  <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center pl-1">
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400 fill-amber-400 group-hover/btn:text-amber-300 group-hover/btn:fill-amber-300 transition-colors" />
                  </div>
                </div>
                <span className="mt-3.5 px-3.5 py-1 rounded-full bg-black/75 border border-white/15 text-white text-xs font-bold tracking-wide backdrop-blur-md shadow-lg">
                  Play Episode Video
                </span>
              </button>
            )}

            {/* Watch Again / Replay Overlay when video reaches end */}
            {hasEnded && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="flex flex-col items-center justify-center group/replay cursor-pointer"
                  aria-label="Watch video again"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-[2px] shadow-[0_0_35px_rgba(245,158,11,0.65)] group-hover/replay:scale-110 transition-all duration-300">
                    <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center">
                      <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 group-hover/replay:text-amber-300 transition-transform duration-300 group-hover/replay:-rotate-45" />
                    </div>
                  </div>
                  <span className="mt-3.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold tracking-wider uppercase shadow-lg">
                    Watch Again
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : embedUrl ? (
          /* =========================================================================
             2. FALLBACK INSTAGRAM IFRAME PLAYER
             - Clean, responsive frame without negative-margin cropping
             ========================================================================= */
          <div className="relative w-full h-full min-h-[520px] flex items-center justify-center overflow-hidden bg-black">
            <iframe
              key={iframeKey}
              src={embedUrl}
              className="w-full h-full min-h-[520px] max-h-[620px] border-0 z-10"
              frameBorder="0"
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              title={`Day ${dayNumber}: ${title}`}
            />
          </div>
        ) : thumbnailUrl && !thumbnailError ? (
          /* Fallback Poster */
          <img
            src={thumbnailUrl}
            alt={`Day ${dayNumber} Video`}
            className="w-full h-full object-cover relative z-10"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs relative z-10">
            <InstagramIcon className="w-8 h-8 mb-2 opacity-50" />
            <span>Video not available</span>
          </div>
        )}
      </div>

      {/* Bottom Bar: Clean Direct Actions */}
      <div className="relative z-10 px-4 py-3 bg-slate-900/90 dark:bg-[#080b11] border-t border-slate-200/90 dark:border-white/10 flex items-center justify-between gap-2.5">
        <span className="text-xs text-slate-400 font-medium truncate">
          {title}
        </span>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
            title="Replay video directly on page"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Watch Again</span>
          </button>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all"
              title="Open original Reel on Instagram"
            >
              <InstagramIcon className="w-3 h-3 text-pink-500" />
              <span>Open Reel</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
