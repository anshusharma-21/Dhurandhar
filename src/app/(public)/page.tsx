import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { calculateRevenueMetrics } from "@/lib/revenue/calculator";
import { Hero } from "@/components/home/Hero";
import { RevenueSnapshot } from "@/components/home/RevenueSnapshot";
import { LatestEpisodeFeature } from "@/components/home/LatestEpisodeFeature";
import { EpisodeFeed } from "@/components/home/EpisodeFeed";
import { MilestonesTimeline } from "@/components/home/MilestonesTimeline";
import { JourneyTopics } from "@/components/home/JourneyTopics";
import { CommunityCTA } from "@/components/home/CommunityCTA";

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  // Fetch authoritative data from repository
  const { episodes } = await dbRepository.getPublishedEpisodes({ limit: 6, sort: "newest" });
  const latestEpisode = episodes.length > 0 ? episodes[0] : null;

  const revenueSettings = await dbRepository.getRevenueSettings();
  const revenueMonths = await dbRepository.getRevenueMonths(false);
  const revenueMetrics = revenueSettings.visibility !== "private"
    ? calculateRevenueMetrics(revenueSettings, revenueMonths)
    : null;

  const milestones = await dbRepository.getMilestones();

  return (
    <div className="space-y-4">
      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Revenue Progress Snapshot */}
      <RevenueSnapshot metrics={revenueMetrics} settings={revenueSettings} />

      {/* 4. Latest Featured Vlog */}
      <LatestEpisodeFeature episode={latestEpisode} />

      {/* 5. Chronological Episode Feed */}
      <EpisodeFeed episodes={episodes} />

      {/* 6. Milestones Timeline */}
      <MilestonesTimeline milestones={milestones} />

      {/* 7. Curriculum / What This Journey Covers */}
      <JourneyTopics />

      {/* 8. Community Invitation CTA */}
      <CommunityCTA />
    </div>
  );
}
