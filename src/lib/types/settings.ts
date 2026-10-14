export interface SiteSettings {
  id: number;
  canonical_hostname: string;
  display_timezone: string;
  contact_email: string;
  ai_provider: "gemini" | "openai" | "anthropic" | "mock";
  email_provider: "resend" | "smtp" | "mock";
  updated_by?: string;
  updated_at: string;
}
