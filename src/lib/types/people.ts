export interface Person {
  id: string;
  name: string;
  slug: string;
  role?: string;
  company_name?: string;
  company_id?: string;
  biography?: string;
  portrait_url?: string;
  external_links?: Record<string, string>;
  visibility: "draft" | "public";
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  visibility: "draft" | "public";
  created_at: string;
}

export interface FounderProfile {
  name: string;
  title: string;
  company_name: string;
  company_url: string;
  bio: string;
  photo_url?: string;
  initials?: string;
  updated_at?: string;
}
