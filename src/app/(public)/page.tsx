import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { calculateRevenueMetrics } from "@/lib/revenue/calculator";
import { Hero } from "@/components/home/Hero";
import { RevenueSnapshot } from "@/components/home/RevenueSnapshot";
import { TheJourney } from "@/components/home/TheJourney";
import { LatestEpisodeFeature } from "@/components/home/LatestEpisodeFeature";
import { MilestonesTimeline } from "@/components/home/MilestonesTimeline";
import { EpisodeFeed } from "@/components/home/EpisodeFeed";
import { LessonsAndExecution } from "@/components/home/LessonsAndExecution";
import { CommunityCTA } from "@/components/home/CommunityCTA";

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  // 1. Fetch authoritative published episodes from repository
  const { episodes } = await dbRepository.getPublishedEpisodes({ limit: 6, sort: "newest" });
  const latestEpisode = episodes.length > 0 ? episodes[0] : null;

  // 2. Fetch authoritative revenue settings & historical months
  const revenueSettings = await dbRepository.getRevenueSettings();
  const revenueMonths = await dbRepository.getRevenueMonths(false);
  const revenueMetrics = revenueSettings.visibility !== "private"
    ? calculateRevenueMetrics(revenueSettings, revenueMonths)
    : null;

  // 3. Fetch authoritative roadmap milestones
  const milestones = await dbRepository.getMilestones();

  return (
    <div className="space-y-4">
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Visually Powerful ₹30 Crore Mission Progress */}
      <RevenueSnapshot
        metrics={revenueMetrics}
        settings={revenueSettings}
        milestones={milestones}
      />

      {/* 3. The Journey Manifesto */}
      <TheJourney />

      {/* 4. Latest Featured Published Vlog */}
      <LatestEpisodeFeature episode={latestEpisode} />

      {/* 5. Strategic Roadmap Milestones */}
      <MilestonesTimeline milestones={milestones} />

      {/* 6. Chronological Episode Archive Feed */}
      <EpisodeFeed episodes={episodes} />

      {/* 7. Lessons and Real Execution Pillars */}
      <LessonsAndExecution />

      {/* 8. Final Public Invitation CTA */}
      <CommunityCTA />
    </div>
  );
}
