import React from "react";
import { Metadata } from "next";
import { dbRepository } from "@/lib/db/repository";
import { EpisodeArchiveClient } from "@/components/episode/EpisodeArchiveClient";
import { Tv } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Episode Archive | Project Dhurandhar",
  description:
    "Complete searchable archive of daily Instagram vlogs, AI summaries, and execution takeaways on the Road to ₹30CR Revenue.",
};

export default async function EpisodesArchivePage() {
  const { episodes } = await dbRepository.getPublishedEpisodes({ limit: 100, sort: "newest" });
  const tags = await dbRepository.getAllTags();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em] mb-2">
          <Tv className="w-4 h-4 text-amber-500" />
          <span>Daily Vlog Documentation</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Project Dhurandhar Episode Archive
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          Every single day of the journey to ₹30 Crore is archived here chronologically. Search by day number, explore topics, and review verified AI summaries.
        </p>
      </div>

      <EpisodeArchiveClient initialEpisodes={episodes} availableTags={tags} />
    </div>
  );
}
