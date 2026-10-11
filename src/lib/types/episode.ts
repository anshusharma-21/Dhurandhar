export type EpisodeStatus = 
  | "draft" 
  | "pending_review" 
  | "scheduled" 
  | "published" 
  | "archived" 
  | "ai_failed";

export type AISummaryStatus = 
  | "not_generated" 
  | "processing" 
  | "generated" 
  | "failed" 
  | "approved";

export interface Tag {
  id: string;
  label: string;
  slug: string;
}

export interface Episode {
  id: string;
  day_number: number;
  title: string;
  slug: string;
  instagram_url: string;
  caption?: string;
  context_notes?: string;
  transcript_text?: string;
  summary: string;
  takeaways: string[];
  summary_status: AISummaryStatus;
  summary_source?: "transcript" | "caption" | "notes" | "transcription" | "none";
  published_at?: string;
  status: EpisodeStatus;
  comments_enabled: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  comments_count?: number;
}

export interface EpisodeFilterParams {
  query?: string;
  tag?: string;
  sort?: "newest" | "oldest" | "day_asc" | "day_desc";
  page?: number;
  limit?: number;
}
