import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { EpisodeForm } from "@/components/admin/EpisodeForm";

export const revalidate = 0;

export default async function NewEpisodePage() {
  const episodes = await dbRepository.getAllEpisodesAdmin();
  const tags = await dbRepository.getAllTags();

  const highestDay = episodes.reduce((max, ep) => Math.max(max, ep.day_number), 0);
  const nextDay = highestDay + 1;

  return (
    <div>
      <EpisodeForm
        availableTags={tags}
        initialEpisode={{
          id: "",
          day_number: nextDay,
          title: "",
          slug: "",
          instagram_url: "",
          summary: "",
          takeaways: [],
          summary_status: "not_generated",
          status: "draft",
          comments_enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }}
      />
    </div>
  );
}
