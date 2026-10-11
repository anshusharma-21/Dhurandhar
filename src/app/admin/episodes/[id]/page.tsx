import React from "react";
import { notFound } from "next/navigation";
import { dbRepository } from "@/lib/db/repository";
import { EpisodeForm } from "@/components/admin/EpisodeForm";

export const revalidate = 0;

interface EditEpisodePageProps {
  params: { id: string };
}

export default async function EditEpisodePage({ params }: EditEpisodePageProps) {
  const episode = await dbRepository.getEpisodeById(params.id);
  const tags = await dbRepository.getAllTags();

  if (!episode) {
    notFound();
  }

  return (
    <div>
      <EpisodeForm initialEpisode={episode} availableTags={tags} />
    </div>
  );
}
