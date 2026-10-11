export interface AISummaryRequest {
  episodeTitle: string;
  dayNumber: number;
  transcriptText?: string;
  captionText?: string;
  contextNotes?: string;
  tags?: string[];
}

export interface AISummaryResponse {
  summary: string;
  takeaways: string[];
  suggestedTags: string[];
  seoMetaDescription: string;
  sourceType: "transcript" | "caption" | "notes" | "transcription";
  tokensUsed?: number;
  model: string;
}
