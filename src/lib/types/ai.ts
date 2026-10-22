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

export interface AutoFillRequest {
  dayNumber: number;
  episodeTitle?: string;
  instagramUrl?: string;
  mediaBase64?: string;
  mimeType?: string;
  captionText?: string;
  transcriptText?: string;
  contextNotes?: string;
  availableTags?: Array<{ id: string; label: string; slug: string }>;
}

export interface AutoFillResponse {
  title: string;
  transcript: string;
  caption: string;
  summary: string;
  takeaways: string[];
  suggestedTags: string[];
  suggestedTagIds: string[];
  seoMetaDescription: string;
  sourceType: "audio" | "video" | "link" | "text";
  model: string;
  tokensUsed?: number;
}

