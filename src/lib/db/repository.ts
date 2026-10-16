import { Episode, EpisodeFilterParams, Tag } from "../types/episode";
import { RevenueSettings, RevenueMonth, RevenueMilestone } from "../types/revenue";
import { Comment, CommentStatus } from "../types/comment";
import { UserProfile, UserRole } from "../types/profile";
import { AuditLogEntry } from "../types/audit";
import { Company, Person, FounderProfile } from "../types/people";
import { SiteSettings } from "../types/settings";
import { sanitizePlainText } from "../security/sanitize";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

function isValidUuid(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// Safe, non-cookie database client for server-level queries & operations
function getDbClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("your-project") || key.includes("your-supabase")) {
    return null;
  }

  try {
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch {
    return null;
  }
}

// ==============================================================================
// INITIAL IN-MEMORY STORE (Fallback & Baseline Seed Data)
// ==============================================================================

const INITIAL_TAGS: Tag[] = [
  { id: "a0000001-0000-0000-0000-000000000001", label: "Vision & Strategy", slug: "vision-strategy" },
  { id: "a0000001-0000-0000-0000-000000000002", label: "Sales & Marketing", slug: "sales-marketing" },
  { id: "a0000001-0000-0000-0000-000000000003", label: "Product & Technology", slug: "product-technology" },
  { id: "a0000001-0000-0000-0000-000000000004", label: "AI & Automation", slug: "ai-automation" },
  { id: "a0000001-0000-0000-0000-000000000005", label: "Operations & Delivery", slug: "operations-delivery" },
  { id: "a0000001-0000-0000-0000-000000000006", label: "Hiring & Team", slug: "hiring-team" },
  { id: "a0000001-0000-0000-0000-000000000007", label: "Finance & Revenue", slug: "finance-revenue" },
  { id: "a0000001-0000-0000-0000-000000000008", label: "Customers", slug: "customers" },
  { id: "a0000001-0000-0000-0000-000000000009", label: "Partnerships", slug: "partnerships" },
  { id: "a0000001-0000-0000-0000-000000000010", label: "Setbacks & Lessons", slug: "setbacks-lessons" },
  { id: "a0000001-0000-0000-0000-000000000011", label: "Milestones", slug: "milestones" },
  { id: "a0000001-0000-0000-0000-000000000012", label: "Founder Reflections", slug: "founder-reflections" },
];

let episodesStore: Episode[] = [
  {
    id: "ep-1",
    day_number: 1,
    title: "Getting Started: The ₹30 Crore Mission",
    slug: "day-001-getting-started",
    instagram_url: "https://www.instagram.com/reel/C7y1abcdEFG/",
    caption: "Day 1 of Project Dhurandhar. Announcing our goal to build AI Automation Labs into a ₹30CR enterprise company. Everything public, every day.",
    context_notes: "Initial launch announcement recorded at AI Automation Labs HQ.",
    transcript_text: "Welcome to Day 1 of Project Dhurandhar. Today we commit publicly to building AI Automation Labs into a ₹30 crore enterprise company. We are laying down the foundation, selecting our initial automation stacks, and holding ourselves transparently accountable.",
    summary: "Dr. Ajay Kumar introduces Project Dhurandhar, publicly committing AI Automation Labs to reach ₹30 Crore in revenue. The daily vlog documents operational choices, business models, and enterprise AI workflows with radical transparency.",
    takeaways: [
      "Public commitment to the ₹30 Crore revenue target establishes total transparency.",
      "Focusing on high-value enterprise automation rather than fragmented agency services.",
      "Every operational decision, win, and roadblock will be documented daily."
    ],
    summary_status: "approved",
    summary_source: "transcript",
    published_at: "2026-10-01T10:00:00+05:30",
    status: "published",
    comments_enabled: true,
    created_at: "2026-10-01T09:00:00+05:30",
    updated_at: "2026-10-01T10:00:00+05:30",
    tags: [INITIAL_TAGS[0], INITIAL_TAGS[3]],
    comments_count: 2,
  },
  {
    id: "ep-2",
    day_number: 2,
    title: "Building the Core Delivery Engine",
    slug: "day-002-building-the-core-delivery-engine",
    instagram_url: "https://www.instagram.com/reel/C7z2bcdeFGH/",
    caption: "Day 2: Streamlining automation delivery systems to serve 20 enterprise clients concurrently without sacrificing quality.",
    context_notes: "Deep dive into our internal agentic dispatch pipeline.",
    transcript_text: "On Day 2 we tackled engineering delivery bottlenecks. To hit 30CR, delivery margins must stay above 65%. We mapped out our standard operating protocols and automated initial client onboarding using custom AI pipelines.",
    summary: "Episode 2 explores the operational architecture necessary to scale to ₹30 Crore. The founder details how AI Automation Labs designs autonomous client delivery systems, safeguarding gross margins above 65%.",
    takeaways: [
      "Targeting 65%+ delivery gross margins to sustain aggressive expansion.",
      "Standardizing client onboarding through structured agentic pipelines.",
      "Automating repetitive tasks before onboarding additional delivery personnel."
    ],
    summary_status: "approved",
    summary_source: "transcript",
    published_at: "2026-10-02T10:00:00+05:30",
    status: "published",
    comments_enabled: true,
    created_at: "2026-10-02T09:00:00+05:30",
    updated_at: "2026-10-02T10:00:00+05:30",
    tags: [INITIAL_TAGS[2], INITIAL_TAGS[4]],
    comments_count: 1,
  },
];

let revenueSettingsStore: RevenueSettings = {
  id: 1,
  goal_label: "Road to ₹30 crore revenue",
  target_amount: 300000000,
  target_start: "2026-04-01",
  target_end: "2027-03-31",
  target_basis: "cumulative",
  revenue_definition: "recognised",
  gst_treatment: "excluded",
  visibility: "public_detailed",
  public_summary_mode: "standard",
  notes: "Figures represent verified net enterprise revenue recognised across client contracts.",
  updated_at: "2026-10-10T12:00:00+05:30",
};

let revenueMonthsStore: RevenueMonth[] = [
  {
    id: "rm-1",
    month_start: "2026-04-01",
    actual_amount: 8500000,
    target_amount: 10000000,
    note: "Q1 Launch month; initial recurring enterprise retainers established.",
    public_visibility: true,
    updated_at: "2026-05-05T12:00:00+05:30",
  },
  {
    id: "rm-2",
    month_start: "2026-05-01",
    actual_amount: 12500000,
    target_amount: 12000000,
    note: "Exceeded monthly target via expanded scope on logistics automation contracts.",
    public_visibility: true,
    updated_at: "2026-06-05T12:00:00+05:30",
  },
  {
    id: "rm-3",
    month_start: "2026-06-01",
    actual_amount: 16000000,
    target_amount: 15000000,
    note: "End of Q1; 3 new annual enterprise agreements locked.",
    public_visibility: true,
    updated_at: "2026-07-05T12:00:00+05:30",
  },
  {
    id: "rm-4",
    month_start: "2026-07-01",
    actual_amount: 21000000,
    target_amount: 20000000,
    note: "Expansion into US healthcare AI solutions.",
    public_visibility: true,
    updated_at: "2026-08-05T12:00:00+05:30",
  },
  {
    id: "rm-5",
    month_start: "2026-08-01",
    actual_amount: 24500000,
    target_amount: 25000000,
    note: "Slight delivery delay due to API vendor rate-limits; contract active.",
    public_visibility: true,
    updated_at: "2026-09-05T12:00:00+05:30",
  },
  {
    id: "rm-6",
    month_start: "2026-09-01",
    actual_amount: 29000000,
    target_amount: 28000000,
    note: "Crossed ₹11 Crore cumulative revenue milestone.",
    public_visibility: true,
    updated_at: "2026-10-05T12:00:00+05:30",
  },
];

let milestonesStore: RevenueMilestone[] = [
  {
    id: "b0000001-0000-0000-0000-000000000001",
    title: "Official Journey Launch",
    description: "Public pledge of Project Dhurandhar: Road to ₹30CR Revenue.",
    milestone_date: "2026-04-01",
    visibility: true,
    sort_order: 1,
    created_at: "2026-04-01T10:00:00+05:30",
  },
  {
    id: "b0000001-0000-0000-0000-000000000002",
    title: "First ₹5 Crore Cumulative Revenue",
    description: "Milestone crossed at Day 45 with 14 active enterprise retainers.",
    milestone_date: "2026-06-15",
    visibility: true,
    sort_order: 2,
    created_at: "2026-06-15T10:00:00+05:30",
  },
  {
    id: "b0000001-0000-0000-0000-000000000003",
    title: "₹10 Crore Run-rate Crossed",
    description: "Achieved during Q2 close with 98% gross retention.",
    milestone_date: "2026-09-20",
    visibility: true,
    sort_order: 3,
    created_at: "2026-09-20T10:00:00+05:30",
  },
  {
    id: "b0000001-0000-0000-0000-000000000004",
    title: "Midpoint: ₹15 Crore Target",
    description: "Projected target for end of Q3.",
    milestone_date: "2026-12-31",
    visibility: true,
    sort_order: 4,
    created_at: "2026-10-01T10:00:00+05:30",
  },
  {
    id: "b0000001-0000-0000-0000-000000000005",
    title: "The ₹30 Crore Goal Line",
    description: "Final target milestone for FY 2026-27.",
    milestone_date: "2027-03-31",
    visibility: true,
    sort_order: 5,
    created_at: "2026-10-01T10:00:00+05:30",
  },
];

let commentsStore: Comment[] = [
  {
    id: "com-1",
    episode_id: "ep-1",
    author_profile_id: "user-1",
    author: {
      id: "user-1",
      display_name: "Rahul Verma",
      role: "member",
    },
    body: "Incredible ambition Dr. Ajay! Documenting this daily is going to inspire so many Indian tech founders.",
    status: "approved",
    created_at: "2026-10-01T11:20:00+05:30",
    updated_at: "2026-10-01T11:20:00+05:30",
  },
  {
    id: "com-2",
    episode_id: "ep-1",
    author_profile_id: "user-2",
    author: {
      id: "user-2",
      display_name: "Priya Sundaram",
      role: "member",
    },
    body: "Which enterprise automation use case are you seeing the highest demand for currently?",
    status: "approved",
    created_at: "2026-10-01T14:45:00+05:30",
    updated_at: "2026-10-01T14:45:00+05:30",
  },
  {
    id: "com-3",
    episode_id: "ep-2",
    author_profile_id: "user-3",
    author: {
      id: "user-3",
      display_name: "Amitabh Sen",
      role: "member",
    },
    body: "Standardizing delivery protocols early is the only way to protect margin. Great insight on Day 2.",
    status: "approved",
    created_at: "2026-10-02T11:05:00+05:30",
    updated_at: "2026-10-02T11:05:00+05:30",
  },
];

let membersStore: UserProfile[] = [
  {
    id: "e901392d-2c36-413c-b99c-e2bc5bab85ed",
    display_name: "Dr. Ajay Kumar",
    role: "admin",
    email_verified_at: "2026-04-01T00:00:00Z",
    status: "active",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "admin-1",
    display_name: "Dr. Ajay Kumar",
    role: "admin",
    email_verified_at: "2026-04-01T00:00:00Z",
    status: "active",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "editor-1",
    display_name: "Editorial Team",
    role: "editor",
    email_verified_at: "2026-04-02T00:00:00Z",
    status: "active",
    created_at: "2026-04-02T00:00:00Z",
    updated_at: "2026-04-02T00:00:00Z",
  },
  {
    id: "user-1",
    display_name: "Rahul Verma",
    role: "member",
    email_verified_at: "2026-10-01T10:00:00Z",
    status: "active",
    created_at: "2026-10-01T10:00:00Z",
    updated_at: "2026-10-01T10:00:00Z",
  },
];

let slugRedirectsStore: Record<string, string> = {};
let auditLogsStore: AuditLogEntry[] = [
  {
    id: "aud-1",
    actor_id: "e901392d-2c36-413c-b99c-e2bc5bab85ed",
    actor_name: "Dr. Ajay Kumar",
    action: "UPDATE_REVENUE_SETTINGS",
    entity_type: "revenue",
    entity_id: "1",
    diff: { target_amount: 300000000, visibility: "public_detailed" },
    created_at: "2026-10-10T12:00:00+05:30",
  },
];

let companiesStore: Company[] = [
  {
    id: "c0000001-0000-0000-0000-000000000001",
    name: "AI Automation Labs LLP",
    slug: "ai-automation-labs",
    description: "Enterprise AI and agentic workflow automation lab.",
    website_url: "https://automationlabs.online",
    visibility: "public",
    created_at: "2026-04-01T00:00:00Z",
  },
];

let peopleStore: Person[] = [
  {
    id: "d0000001-0000-0000-0000-000000000001",
    name: "Dr. Ajay Kumar",
    slug: "dr-ajay-kumar",
    role: "Founder & Managing Partner",
    company_name: "AI Automation Labs LLP",
    company_id: "c0000001-0000-0000-0000-000000000001",
    biography: "Founder of AI Automation Labs documenting the journey to ₹30 Crore revenue.",
    visibility: "public",
    created_at: "2026-04-01T00:00:00Z",
  },
];

let founderProfileStore: FounderProfile = {
  name: "Dr. Ajay Kumar",
  title: "Founder & Managing Partner • AI Automation Labs LLP",
  company_name: "AI Automation Labs LLP",
  company_url: "https://automationlabs.online",
  bio: "Dr. Ajay Kumar is leading AI Automation Labs LLP on a mission to build a ₹30 Crore enterprise automation firm. Chronicling the journey daily on Project Dhurandhar, he shares operational decisions, client delivery frameworks, and business lessons with total candor.",
  photo_url: "",
  initials: "AK",
  updated_at: "2026-10-10T12:00:00Z",
};

let siteSettingsStore: SiteSettings = {
  id: 1,
  canonical_hostname: "https://projectdhurandhar.automationlabs.online",
  display_timezone: "Asia/Kolkata",
  contact_email: "contact@automationlabs.online",
  ai_provider: "gemini",
  email_provider: "resend",
  updated_at: "2026-10-10T12:00:00Z",
};

let aiJobsStore = [
  {
    id: "ai-1",
    episode_id: "ep-1",
    episode: "Day 1: Getting Started",
    model: "gemini-1.5-flash",
    source_type: "transcript",
    tokens: 284,
    cost: "$0.0001",
    status: "approved",
    created_at: "2026-10-01 10:02",
  },
  {
    id: "ai-2",
    episode_id: "ep-2",
    episode: "Day 2: Core Delivery Engine",
    model: "gemini-1.5-flash",
    source_type: "transcript",
    tokens: 312,
    cost: "$0.0001",
    status: "approved",
    created_at: "2026-10-02 10:01",
  },
];

// Helper to map DB row to Episode model
function mapEpisodeRow(row: any): Episode {
  const tags: Tag[] = Array.isArray(row.episode_tags)
    ? row.episode_tags.map((et: any) => et.tag).filter(Boolean)
    : Array.isArray(row.tags)
    ? row.tags
    : [];

  const comments_count = Array.isArray(row.comments) && row.comments[0]?.count !== undefined
    ? Number(row.comments[0].count)
    : Number(row.comments_count || 0);

  return {
    id: row.id,
    day_number: Number(row.day_number),
    title: row.title,
    slug: row.slug,
    instagram_url: row.instagram_url || "",
    caption: row.caption || "",
    context_notes: row.context_notes || "",
    transcript_text: row.transcript_text || "",
    summary: row.summary || "",
    takeaways: Array.isArray(row.takeaways) ? row.takeaways : [],
    summary_status: row.summary_status || "not_generated",
    summary_source: row.summary_source || "none",
    published_at: row.published_at || undefined,
    status: row.status || "draft",
    comments_enabled: row.comments_enabled ?? true,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    tags,
    comments_count,
  };
}

// ==============================================================================
// REPOSITORY IMPLEMENTATION (SUPABASE POSTGRESQL PRIMARY + FALLBACK CACHE)
// ==============================================================================

export const dbRepository = {
  // --- EPISODES ---
  async getPublishedEpisodes(params?: EpisodeFilterParams): Promise<{ episodes: Episode[]; total: number }> {
    const db = getDbClient();
    if (db) {
      try {
        let query = db
          .from("episodes")
          .select("*, episode_tags(tag:tags(*)), comments(count)", { count: "exact" })
          .eq("status", "published")
          .lte("published_at", new Date().toISOString())
          .eq("comments.status", "approved");

        if (params?.tag) {
          // Filter by tag slug using inner join
          query = db
            .from("episodes")
            .select("*, episode_tags!inner(tag:tags!inner(*)), comments(count)", { count: "exact" })
            .eq("status", "published")
            .lte("published_at", new Date().toISOString())
            .eq("episode_tags.tag.slug", params.tag)
            .eq("comments.status", "approved");
        }

        if (params?.query) {
          const q = params.query.trim();
          query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%,transcript_text.ilike.%${q}%`);
        }

        const sort = params?.sort || "newest";
        if (sort === "newest") {
          query = query.order("published_at", { ascending: false }).order("day_number", { ascending: false });
        } else if (sort === "oldest") {
          query = query.order("published_at", { ascending: true }).order("day_number", { ascending: true });
        } else if (sort === "day_desc") {
          query = query.order("day_number", { ascending: false });
        } else {
          query = query.order("day_number", { ascending: true });
        }

        const page = params?.page || 1;
        const limit = params?.limit || 12;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;

        if (!error && data && data.length > 0) {
          const episodes = data.map(mapEpisodeRow);
          return { episodes, total: count ?? episodes.length };
        }
      } catch {
        // Fallback to local store
      }
    }

    // In-memory filter fallback
    let list = episodesStore.filter(
      (ep) => ep.status === "published" && ep.published_at && new Date(ep.published_at) <= new Date()
    );

    if (params?.tag) {
      list = list.filter((ep) => ep.tags?.some((t) => t.slug === params.tag));
    }

    if (params?.query) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(
        (ep) =>
          `day ${ep.day_number}`.toLowerCase().includes(q) ||
          ep.title.toLowerCase().includes(q) ||
          ep.summary.toLowerCase().includes(q) ||
          ep.tags?.some((t) => t.label.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q))
      );
    }

    const sort = params?.sort || "newest";
    list.sort((a, b) => {
      if (sort === "newest") {
        const timeA = new Date(a.published_at || a.created_at).getTime();
        const timeB = new Date(b.published_at || b.created_at).getTime();
        return timeB !== timeA ? timeB - timeA : b.day_number - a.day_number;
      }
      if (sort === "oldest") {
        const timeA = new Date(a.published_at || a.created_at).getTime();
        const timeB = new Date(b.published_at || b.created_at).getTime();
        return timeA !== timeB ? timeA - timeB : a.day_number - b.day_number;
      }
      if (sort === "day_desc") return b.day_number - a.day_number;
      return a.day_number - b.day_number;
    });

    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return { episodes: paginated, total: list.length };
  },

  async getEpisodeBySlug(slug: string): Promise<Episode | null> {
    const db = getDbClient();
    if (db) {
      try {
        // Check slug redirect first (AC-22)
        const { data: redirect } = await db
          .from("slug_redirects")
          .select("new_slug")
          .eq("old_slug", slug)
          .maybeSingle();

        const targetSlug = redirect?.new_slug || slug;

        const { data, error } = await db
          .from("episodes")
          .select("*, episode_tags(tag:tags(*)), comments(count)")
          .eq("slug", targetSlug)
          .eq("comments.status", "approved")
          .maybeSingle();

        if (!error && data) {
          return mapEpisodeRow(data);
        }
      } catch {
        // Fallback to local store
      }
    }

    const targetSlug = slugRedirectsStore[slug] || slug;
    const ep = episodesStore.find((e) => e.slug === targetSlug);
    return ep ? { ...ep } : null;
  },

  async getEpisodeById(id: string): Promise<Episode | null> {
    const db = getDbClient();
    if (db && isValidUuid(id)) {
      try {
        const { data, error } = await db
          .from("episodes")
          .select("*, episode_tags(tag:tags(*)), comments(count)")
          .eq("id", id)
          .eq("comments.status", "approved")
          .maybeSingle();

        if (!error && data) {
          return mapEpisodeRow(data);
        }
      } catch {
        // Fallback
      }
    }

    const ep = episodesStore.find((e) => e.id === id);
    return ep ? { ...ep } : null;
  },

  async getAllEpisodesAdmin(): Promise<Episode[]> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db
          .from("episodes")
          .select("*, episode_tags(tag:tags(*)), comments(count)")
          .eq("comments.status", "approved")
          .order("day_number", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapEpisodeRow);
        }
      } catch {
        // Fallback
      }
    }
    return [...episodesStore].sort((a, b) => b.day_number - a.day_number);
  },

  async createEpisode(data: Partial<Episode>): Promise<Episode> {
    const dayNumber = Number(data.day_number);
    if (!dayNumber || dayNumber <= 0) {
      throw new Error("Day Number is required and must be a positive integer.");
    }

    const baseSlug = `day-${String(dayNumber).padStart(3, "0")}-${(data.title || "episode")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`;
    const slug = data.slug || baseSlug;

    const db = getDbClient();
    if (db) {
      // 1. Check duplicate day number in database
      const { data: existingDay, error: dayCheckErr } = await db
        .from("episodes")
        .select("id, day_number")
        .eq("day_number", dayNumber)
        .maybeSingle();

      if (existingDay) {
        throw new Error(`Episode with Day ${dayNumber} already exists in database.`);
      }

      const insertPayload: any = {
        day_number: dayNumber,
        title: data.title || `Day ${dayNumber}`,
        slug,
        instagram_url: data.instagram_url || null,
        caption: data.caption || null,
        context_notes: data.context_notes || null,
        transcript_text: data.transcript_text || null,
        summary: data.summary || "",
        takeaways: Array.isArray(data.takeaways) ? data.takeaways : [],
        summary_status: data.summary_status || "not_generated",
        summary_source: data.summary_source || "none",
        status: data.status || "draft",
        comments_enabled: data.comments_enabled ?? true,
      };

      if (data.status === "published") {
        insertPayload.published_at = data.published_at || new Date().toISOString();
      }

      if (data.created_by && isValidUuid(data.created_by)) {
        insertPayload.created_by = data.created_by;
      }

      const { data: created, error } = await db
        .from("episodes")
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error creating episode (${error.code}): ${error.message}`);
      }

      // Link tags in episode_tags
      if (data.tags && data.tags.length > 0 && created) {
        const tagInserts = data.tags
          .filter((tag) => tag.id && isValidUuid(tag.id))
          .map((tag) => ({ episode_id: created.id, tag_id: tag.id }));
        if (tagInserts.length > 0) {
          await db.from("episode_tags").insert(tagInserts);
        }
      }

      // Also log audit trail
      if (created.created_by) {
        await db.from("audit_log").insert({
          actor_id: created.created_by,
          action: "CREATE_EPISODE",
          entity_type: "episode",
          entity_id: created.id,
          diff: { day_number: created.day_number, title: created.title, status: created.status },
        });
      }

      const episode = mapEpisodeRow({ ...created, tags: data.tags || [] });
      episodesStore.unshift(episode);
      return episode;
    }

    // Offline / unit-test fallback
    if (episodesStore.some((e) => e.day_number === dayNumber)) {
      throw new Error(`Episode with Day ${dayNumber} already exists.`);
    }

    const newEpisode: Episode = {
      id: `ep-${Date.now()}`,
      day_number: dayNumber,
      title: data.title || `Day ${dayNumber}`,
      slug,
      instagram_url: data.instagram_url || "",
      caption: data.caption || "",
      context_notes: data.context_notes || "",
      transcript_text: data.transcript_text || "",
      summary: data.summary || "",
      takeaways: data.takeaways || [],
      summary_status: data.summary_status || "not_generated",
      summary_source: data.summary_source || "none",
      published_at: data.status === "published" ? data.published_at || new Date().toISOString() : undefined,
      status: data.status || "draft",
      comments_enabled: data.comments_enabled ?? true,
      created_by: data.created_by || "admin-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: data.tags || [],
      comments_count: 0,
    };

    episodesStore.push(newEpisode);
    return newEpisode;
  },

  async updateEpisode(id: string, data: Partial<Episode>): Promise<Episode> {
    const db = getDbClient();
    if (db && isValidUuid(id)) {
      const { data: existing, error: fetchErr } = await db
        .from("episodes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (fetchErr) {
        throw new Error(`Database error fetching episode (${fetchErr.code}): ${fetchErr.message}`);
      }
      if (!existing) {
        throw new Error("Episode not found in database.");
      }

      if (data.day_number && data.day_number !== existing.day_number) {
        const { data: dup } = await db
          .from("episodes")
          .select("id")
          .eq("day_number", data.day_number)
          .neq("id", id)
          .maybeSingle();

        if (dup) {
          throw new Error(`Episode with Day ${data.day_number} already exists.`);
        }
      }

      // Slug redirect handling (AC-22)
      if (data.slug && data.slug !== existing.slug) {
        await db.from("slug_redirects").insert({ old_slug: existing.slug, new_slug: data.slug });
        slugRedirectsStore[existing.slug] = data.slug;
      }

      const updatePayload: any = {
        updated_at: new Date().toISOString(),
      };
      if (data.day_number !== undefined) updatePayload.day_number = Number(data.day_number);
      if (data.title !== undefined) updatePayload.title = data.title;
      if (data.slug !== undefined) updatePayload.slug = data.slug;
      if (data.instagram_url !== undefined) updatePayload.instagram_url = data.instagram_url;
      if (data.caption !== undefined) updatePayload.caption = data.caption;
      if (data.context_notes !== undefined) updatePayload.context_notes = data.context_notes;
      if (data.transcript_text !== undefined) updatePayload.transcript_text = data.transcript_text;
      if (data.summary !== undefined) updatePayload.summary = data.summary;
      if (data.takeaways !== undefined) updatePayload.takeaways = data.takeaways;
      if (data.summary_status !== undefined) updatePayload.summary_status = data.summary_status;
      if (data.summary_source !== undefined) updatePayload.summary_source = data.summary_source;
      if (data.status !== undefined) {
        updatePayload.status = data.status;
        if (data.status === "published" && !existing.published_at) {
          updatePayload.published_at = new Date().toISOString();
        }
      }
      if (data.comments_enabled !== undefined) updatePayload.comments_enabled = data.comments_enabled;

      const { data: updated, error } = await db
        .from("episodes")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update episode (${error.code}): ${error.message}`);
      }

      if (data.tags) {
        await db.from("episode_tags").delete().eq("episode_id", id);
        const tagInserts = data.tags
          .filter((t) => t.id && isValidUuid(t.id))
          .map((t) => ({ episode_id: id, tag_id: t.id }));
        if (tagInserts.length > 0) {
          await db.from("episode_tags").insert(tagInserts);
        }
      }

      const result = mapEpisodeRow({ ...updated, tags: data.tags || [] });
      const idx = episodesStore.findIndex((e) => e.id === id);
      if (idx >= 0) episodesStore[idx] = result;
      return result;
    }

    const index = episodesStore.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Episode not found.");

    const existing = episodesStore[index];

    if (data.day_number && data.day_number !== existing.day_number) {
      if (episodesStore.some((e) => e.id !== id && e.day_number === data.day_number)) {
        throw new Error(`Episode with Day ${data.day_number} already exists.`);
      }
    }

    if (data.slug && data.slug !== existing.slug) {
      slugRedirectsStore[existing.slug] = data.slug;
    }

    const updated: Episode = {
      ...existing,
      ...data,
      published_at:
        data.status === "published" && !existing.published_at
          ? new Date().toISOString()
          : data.published_at || existing.published_at,
      updated_at: new Date().toISOString(),
    };

    episodesStore[index] = updated;
    return updated;
  },

  // --- COMMENTS ---
  async getApprovedComments(episodeId: string): Promise<Comment[]> {
    const db = getDbClient();
    if (db) {
      try {
        let epId = episodeId;
        if (!isValidUuid(epId)) {
          const { data: ep } = await db
            .from("episodes")
            .select("id")
            .eq("slug", episodeId)
            .maybeSingle();
          if (ep) epId = ep.id;
        }

        if (isValidUuid(epId)) {
          const { data, error } = await db
            .from("comments")
            .select("*, author:profiles!author_profile_id(id, display_name, role, avatar_url)")
            .eq("episode_id", epId)
            .eq("status", "approved")
            .order("created_at", { ascending: true });

          if (!error && data) {
            return data.map((c: any) => ({
              id: c.id,
              episode_id: c.episode_id,
              author_profile_id: c.author_profile_id,
              author: {
                id: c.author?.id || c.author_profile_id,
                display_name: c.author?.display_name || "Community Member",
                role: c.author?.role || "member",
                avatar_url: c.author?.avatar_url,
              },
              body: c.body,
              status: c.status,
              created_at: c.created_at,
              updated_at: c.updated_at,
            }));
          }
        }
      } catch {
        // Fallback
      }
    }

    return commentsStore
      .filter((c) => (c.episode_id === episodeId || c.episode_id === "ep-1") && c.status === "approved")
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  async getModerationQueue(): Promise<Comment[]> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db
          .from("comments")
          .select("*, author:profiles!author_profile_id(id, display_name, role, avatar_url)")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            episode_id: c.episode_id,
            author_profile_id: c.author_profile_id,
            author: {
              id: c.author?.id || c.author_profile_id,
              display_name: c.author?.display_name || "Community Member",
              role: c.author?.role || "member",
              avatar_url: c.author?.avatar_url,
            },
            body: c.body,
            status: c.status,
            created_at: c.created_at,
            updated_at: c.updated_at,
            moderated_by: c.moderated_by,
            moderated_at: c.moderated_at,
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...commentsStore].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createComment(data: {
    episode_id: string;
    author_profile_id: string;
    author_name: string;
    body: string;
  }): Promise<Comment> {
    const sanitizedBody = sanitizePlainText(data.body);
    if (!sanitizedBody) {
      throw new Error("Comment text cannot be empty or contain only unsafe tags.");
    }

    const db = getDbClient();
    if (db && isValidUuid(data.author_profile_id)) {
      let realEpisodeId = data.episode_id;
      if (!isValidUuid(realEpisodeId)) {
        const { data: ep } = await db
          .from("episodes")
          .select("id")
          .or(`slug.eq.${data.episode_id},day_number.eq.${Number(data.episode_id) || -1}`)
          .maybeSingle();
        if (ep) realEpisodeId = ep.id;
      }

      // Check first-time commenter status (AC-11)
      const { count } = await db
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("author_profile_id", data.author_profile_id)
        .eq("status", "approved");

      const initialStatus: CommentStatus = (count && count > 0) ? "approved" : "pending";

      if (isValidUuid(realEpisodeId)) {
        const { data: inserted, error } = await db
          .from("comments")
          .insert({
            episode_id: realEpisodeId,
            author_profile_id: data.author_profile_id,
            body: sanitizedBody,
            status: initialStatus,
          })
          .select("*, author:profiles!author_profile_id(id, display_name, role, avatar_url)")
          .single();

        if (error) {
          throw new Error(`Failed to save comment in database (${error.code}): ${error.message}`);
        }

        const newComment: Comment = {
          id: inserted.id,
          episode_id: inserted.episode_id,
          author_profile_id: inserted.author_profile_id,
          author: {
            id: inserted.author?.id || data.author_profile_id,
            display_name: inserted.author?.display_name || data.author_name || "Community Member",
            role: inserted.author?.role || "member",
            avatar_url: inserted.author?.avatar_url,
          },
          body: inserted.body,
          status: inserted.status,
          created_at: inserted.created_at,
          updated_at: inserted.updated_at,
        };

        commentsStore.push(newComment);
        return newComment;
      }
    }

    // In-memory fallback
    const priorApproved = commentsStore.filter(
      (c) => c.author_profile_id === data.author_profile_id && c.status === "approved"
    );
    const initialStatus: CommentStatus = priorApproved.length > 0 ? "approved" : "pending";

    const newComment: Comment = {
      id: `com-${Date.now()}`,
      episode_id: data.episode_id,
      author_profile_id: data.author_profile_id,
      author: {
        id: data.author_profile_id,
        display_name: data.author_name || "Community Member",
        role: "member",
      },
      body: sanitizedBody,
      status: initialStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    commentsStore.push(newComment);
    return newComment;
  },

  async moderateComment(id: string, status: CommentStatus, moderatorId: string): Promise<Comment> {
    const db = getDbClient();
    if (db && isValidUuid(id)) {
      const updateData: any = {
        status,
        moderated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (isValidUuid(moderatorId)) {
        updateData.moderated_by = moderatorId;
      }

      const { data: updated, error } = await db
        .from("comments")
        .update(updateData)
        .eq("id", id)
        .select("*, author:profiles!author_profile_id(id, display_name, role, avatar_url)")
        .single();

      if (error) {
        throw new Error(`Failed to moderate comment (${error.code}): ${error.message}`);
      }

      const comment: Comment = {
        id: updated.id,
        episode_id: updated.episode_id,
        author_profile_id: updated.author_profile_id,
        author: {
          id: updated.author?.id || updated.author_profile_id,
          display_name: updated.author?.display_name || "Community Member",
          role: updated.author?.role || "member",
        },
        body: updated.body,
        status: updated.status,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
        moderated_by: updated.moderated_by,
        moderated_at: updated.moderated_at,
      };

      const cIdx = commentsStore.findIndex((c) => c.id === id);
      if (cIdx >= 0) commentsStore[cIdx] = comment;
      return comment;
    }

    const comment = commentsStore.find((c) => c.id === id);
    if (!comment) throw new Error("Comment not found.");

    comment.status = status;
    comment.moderated_by = moderatorId;
    comment.moderated_at = new Date().toISOString();
    return comment;
  },

  // --- REVENUE ---
  async getRevenueSettings(): Promise<RevenueSettings> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db.from("revenue_settings").select("*").eq("id", 1).maybeSingle();
        if (!error && data) {
          revenueSettingsStore = {
            id: data.id,
            goal_label: data.goal_label,
            target_amount: Number(data.target_amount),
            target_start: data.target_start,
            target_end: data.target_end,
            target_basis: data.target_basis,
            revenue_definition: data.revenue_definition,
            gst_treatment: data.gst_treatment,
            visibility: data.visibility,
            public_summary_mode: data.public_summary_mode || "standard",
            notes: data.notes || "",
            updated_at: data.updated_at,
          };
          return { ...revenueSettingsStore };
        }
      } catch {
        // Fallback
      }
    }
    return { ...revenueSettingsStore };
  },

  async updateRevenueSettings(data: Partial<RevenueSettings>, actorId: string): Promise<RevenueSettings> {
    const prev = { ...revenueSettingsStore };
    const db = getDbClient();
    if (db) {
      const updatePayload: any = {
        ...data,
        updated_at: new Date().toISOString(),
      };
      if (isValidUuid(actorId)) {
        updatePayload.updated_by = actorId;
      }

      const { data: updated, error } = await db
        .from("revenue_settings")
        .upsert({ id: 1, ...updatePayload })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save revenue settings (${error.code}): ${error.message}`);
      }

      await db.from("audit_log").insert({
        actor_id: isValidUuid(actorId) ? actorId : null,
        action: "UPDATE_REVENUE_SETTINGS",
        entity_type: "revenue",
        entity_id: "1",
        diff: { before: prev, after: updated },
      });

      revenueSettingsStore = {
        id: updated.id,
        goal_label: updated.goal_label,
        target_amount: Number(updated.target_amount),
        target_start: updated.target_start,
        target_end: updated.target_end,
        target_basis: updated.target_basis,
        revenue_definition: updated.revenue_definition,
        gst_treatment: updated.gst_treatment,
        visibility: updated.visibility,
        public_summary_mode: updated.public_summary_mode || "standard",
        notes: updated.notes || "",
        updated_at: updated.updated_at,
      };

      return { ...revenueSettingsStore };
    }

    revenueSettingsStore = {
      ...revenueSettingsStore,
      ...data,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    };
    return { ...revenueSettingsStore };
  },

  async getRevenueMonths(includePrivate: boolean = false): Promise<RevenueMonth[]> {
    const db = getDbClient();
    if (db) {
      try {
        let query = db.from("revenue_months").select("*").order("month_start", { ascending: true });
        if (!includePrivate) {
          query = query.eq("public_visibility", true);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((m: any) => ({
            id: m.id,
            month_start: m.month_start,
            actual_amount: Number(m.actual_amount),
            target_amount: Number(m.target_amount),
            note: m.note || "",
            public_visibility: m.public_visibility,
            updated_at: m.updated_at,
          }));
        }
      } catch {
        // Fallback
      }
    }

    if (revenueSettingsStore.visibility === "private" && !includePrivate) {
      return [];
    }

    return [...revenueMonthsStore].sort((a, b) => a.month_start.localeCompare(b.month_start));
  },

  async saveRevenueMonth(
    data: { month_start: string; actual_amount: number; target_amount?: number; note?: string },
    actorId: string
  ): Promise<RevenueMonth> {
    const db = getDbClient();
    if (db) {
      const upsertPayload: any = {
        month_start: data.month_start,
        actual_amount: data.actual_amount,
        target_amount: data.target_amount || 0,
        note: data.note || null,
        public_visibility: true,
        updated_at: new Date().toISOString(),
      };
      if (isValidUuid(actorId)) {
        upsertPayload.updated_by = actorId;
      }

      const { data: record, error } = await db
        .from("revenue_months")
        .upsert(upsertPayload, { onConflict: "month_start" })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save revenue month (${error.code}): ${error.message}`);
      }

      await db.from("audit_log").insert({
        actor_id: isValidUuid(actorId) ? actorId : null,
        action: "SAVE_REVENUE_MONTH",
        entity_type: "revenue_month",
        entity_id: record.month_start,
        diff: { record },
      });

      const formatted: RevenueMonth = {
        id: record.id,
        month_start: record.month_start,
        actual_amount: Number(record.actual_amount),
        target_amount: Number(record.target_amount),
        note: record.note || "",
        public_visibility: record.public_visibility,
        updated_at: record.updated_at,
      };

      const mIdx = revenueMonthsStore.findIndex((m) => m.month_start === data.month_start);
      if (mIdx >= 0) revenueMonthsStore[mIdx] = formatted;
      else revenueMonthsStore.push(formatted);

      return formatted;
    }

    const existingIndex = revenueMonthsStore.findIndex((m) => m.month_start === data.month_start);
    let record: RevenueMonth;

    if (existingIndex >= 0) {
      record = {
        ...revenueMonthsStore[existingIndex],
        actual_amount: data.actual_amount,
        target_amount: data.target_amount ?? revenueMonthsStore[existingIndex].target_amount,
        note: data.note ?? revenueMonthsStore[existingIndex].note,
        updated_by: actorId,
        updated_at: new Date().toISOString(),
      };
      revenueMonthsStore[existingIndex] = record;
    } else {
      record = {
        id: `rm-${Date.now()}`,
        month_start: data.month_start,
        actual_amount: data.actual_amount,
        target_amount: data.target_amount || 0,
        note: data.note,
        public_visibility: true,
        updated_by: actorId,
        updated_at: new Date().toISOString(),
      };
      revenueMonthsStore.push(record);
    }

    return record;
  },

  async deleteRevenueMonth(id: string, actorId: string): Promise<boolean> {
    const db = getDbClient();
    if (db) {
      const { error } = await db.from("revenue_months").delete().eq("id", id);
      if (error) {
        throw new Error(`Failed to delete revenue month (${error.code}): ${error.message}`);
      }
      await db.from("audit_log").insert({
        actor_id: isValidUuid(actorId) ? actorId : null,
        action: "DELETE_REVENUE_MONTH",
        entity_type: "revenue_month",
        entity_id: id,
        diff: { id },
      });
    }

    const idx = revenueMonthsStore.findIndex((m) => m.id === id);
    if (idx >= 0) {
      revenueMonthsStore.splice(idx, 1);
    }
    return true;
  },

  async clearAllRevenueMonths(actorId: string): Promise<boolean> {
    const db = getDbClient();
    if (db) {
      const { error } = await db.from("revenue_months").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) {
        throw new Error(`Failed to clear revenue months (${error.code}): ${error.message}`);
      }
      await db.from("audit_log").insert({
        actor_id: isValidUuid(actorId) ? actorId : null,
        action: "CLEAR_REVENUE_MONTHS",
        entity_type: "revenue_month",
        entity_id: "all",
        diff: { action: "cleared_all" },
      });
    }

    revenueMonthsStore = [];
    return true;
  },

  async getMilestones(): Promise<RevenueMilestone[]> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db
          .from("revenue_milestones")
          .select("*")
          .order("sort_order", { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description || "",
            milestone_date: m.milestone_date,
            visibility: m.visibility,
            sort_order: m.sort_order,
            created_at: m.created_at,
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...milestonesStore].sort((a, b) => a.sort_order - b.sort_order);
  },

  async saveMilestone(data: Partial<RevenueMilestone> & { id?: string }, actorId: string): Promise<RevenueMilestone> {
    const db = getDbClient();
    if (db) {
      const payload: any = {
        title: data.title,
        description: data.description || "",
        milestone_date: data.milestone_date,
        visibility: data.visibility !== undefined ? data.visibility : true,
        sort_order: data.sort_order || 1,
      };

      if (data.id && isValidUuid(data.id)) {
        payload.id = data.id;
      }

      const { data: saved, error } = await db
        .from("revenue_milestones")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save milestone (${error.code}): ${error.message}`);
      }

      await db.from("audit_log").insert({
        actor_id: isValidUuid(actorId) ? actorId : null,
        action: "SAVE_MILESTONE",
        entity_type: "revenue_milestone",
        entity_id: saved.id,
        diff: { record: saved },
      });

      const milestone: RevenueMilestone = {
        id: saved.id,
        title: saved.title,
        description: saved.description || "",
        milestone_date: saved.milestone_date,
        visibility: saved.visibility,
        sort_order: saved.sort_order,
        created_at: saved.created_at,
      };

      const mIdx = milestonesStore.findIndex((m) => m.id === milestone.id);
      if (mIdx >= 0) milestonesStore[mIdx] = milestone;
      else milestonesStore.push(milestone);

      return milestone;
    }

    const newMilestone: RevenueMilestone = {
      id: data.id || `ms-${Date.now()}`,
      title: data.title || "Untitled Milestone",
      description: data.description || "",
      milestone_date: data.milestone_date || new Date().toISOString().split("T")[0],
      visibility: data.visibility !== undefined ? data.visibility : true,
      sort_order: data.sort_order || milestonesStore.length + 1,
      created_at: new Date().toISOString(),
    };

    const idx = milestonesStore.findIndex((m) => m.id === newMilestone.id);
    if (idx >= 0) milestonesStore[idx] = newMilestone;
    else milestonesStore.push(newMilestone);

    return newMilestone;
  },

  async deleteMilestone(id: string, actorId: string): Promise<boolean> {
    const db = getDbClient();
    if (db && isValidUuid(id)) {
      const { error } = await db.from("revenue_milestones").delete().eq("id", id);
      if (error) {
        throw new Error(`Failed to delete milestone (${error.code}): ${error.message}`);
      }
      await db.from("audit_log").insert({
        actor_id: isValidUuid(actorId) ? actorId : null,
        action: "DELETE_MILESTONE",
        entity_type: "revenue_milestone",
        entity_id: id,
        diff: { id },
      });
    }

    milestonesStore = milestonesStore.filter((m) => m.id !== id);
    return true;
  },

  // --- TAGS ---
  async getAllTags(): Promise<Tag[]> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db.from("tags").select("*").order("label", { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((t: any) => ({
            id: t.id,
            label: t.label,
            slug: t.slug,
          }));
        } else if (!error && (!data || data.length === 0)) {
          // Auto-seed initial tags to database so foreign key constraints in episode_tags succeed
          await db.from("tags").upsert(INITIAL_TAGS, { onConflict: "slug" });
          const { data: seeded } = await db.from("tags").select("*").order("label", { ascending: true });
          if (seeded && seeded.length > 0) {
            return seeded.map((t: any) => ({
              id: t.id,
              label: t.label,
              slug: t.slug,
            }));
          }
        }
      } catch {
        // Fallback
      }
    }
    return [...INITIAL_TAGS];
  },

  // --- SITE SETTINGS ---
  async getSiteSettings(): Promise<SiteSettings> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (!error && data) {
          siteSettingsStore = {
            id: data.id,
            canonical_hostname: data.canonical_hostname,
            display_timezone: data.display_timezone,
            contact_email: data.contact_email,
            ai_provider: data.ai_provider,
            email_provider: data.email_provider,
            updated_by: data.updated_by,
            updated_at: data.updated_at,
          };
          return { ...siteSettingsStore };
        }
      } catch {
        // Fallback
      }
    }
    return { ...siteSettingsStore };
  },

  async updateSiteSettings(data: Partial<SiteSettings>, actorId: string): Promise<SiteSettings> {
    const prev = { ...siteSettingsStore };
    siteSettingsStore = {
      ...siteSettingsStore,
      ...data,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    };

    const db = getDbClient();
    if (db) {
      const upsertPayload: any = {
        id: 1,
        canonical_hostname: siteSettingsStore.canonical_hostname,
        display_timezone: siteSettingsStore.display_timezone,
        contact_email: siteSettingsStore.contact_email,
        ai_provider: siteSettingsStore.ai_provider,
        email_provider: siteSettingsStore.email_provider,
        updated_at: siteSettingsStore.updated_at,
      };
      if (isValidUuid(actorId)) {
        upsertPayload.updated_by = actorId;
      }

      const { data: updated, error } = await db
        .from("site_settings")
        .upsert(upsertPayload)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save site settings (${error.code}): ${error.message}`);
      }

      await db.from("audit_log").insert({
        actor_id: isValidUuid(actorId) ? actorId : null,
        action: "UPDATE_SITE_SETTINGS",
        entity_type: "settings",
        entity_id: "1",
        diff: { before: prev, after: updated },
      });

      return {
        id: updated.id,
        canonical_hostname: updated.canonical_hostname,
        display_timezone: updated.display_timezone,
        contact_email: updated.contact_email,
        ai_provider: updated.ai_provider,
        email_provider: updated.email_provider,
        updated_by: updated.updated_by,
        updated_at: updated.updated_at,
      };
    }

    return { ...siteSettingsStore };
  },

  // --- AUDIT LOGS ---
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db
          .from("audit_log")
          .select("*, actor:profiles!actor_id(display_name)")
          .order("created_at", { ascending: false })
          .limit(100);

        if (!error && data && data.length > 0) {
          return data.map((l: any) => ({
            id: l.id,
            actor_id: l.actor_id,
            actor_name: l.actor?.display_name || "Administrator",
            action: l.action,
            entity_type: l.entity_type,
            entity_id: l.entity_id,
            diff: l.diff,
            created_at: l.created_at,
            request_id: l.request_id,
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...auditLogsStore];
  },

  // --- MEMBERS ---
  async getMembers(): Promise<UserProfile[]> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((p: any) => ({
            id: p.id,
            display_name: p.display_name,
            avatar_url: p.avatar_url || undefined,
            role: p.role,
            email_verified_at: p.email_verified_at,
            status: p.status,
            created_at: p.created_at,
            updated_at: p.updated_at,
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...membersStore];
  },

  async createMember(data: Partial<UserProfile>): Promise<UserProfile> {
    const db = getDbClient();
    if (db && data.id && isValidUuid(data.id)) {
      try {
        const { data: created, error } = await db
          .from("profiles")
          .upsert({
            id: data.id,
            display_name: data.display_name || "Community Member",
            avatar_url: data.avatar_url || null,
            role: data.role || "member",
            status: data.status || "active",
            email_verified_at: data.email_verified_at || new Date().toISOString(),
          })
          .select()
          .single();

        if (!error && created) {
          return {
            id: created.id,
            display_name: created.display_name,
            avatar_url: created.avatar_url || undefined,
            role: created.role,
            email_verified_at: created.email_verified_at,
            status: created.status,
            created_at: created.created_at,
            updated_at: created.updated_at,
          };
        }
      } catch {
        // Fallback
      }
    }

    const existing = membersStore.find((m) => m.id === data.id);
    if (existing) return existing;

    const newMember: UserProfile = {
      id: data.id || `user-${Date.now()}`,
      display_name: data.display_name || "Community Member",
      avatar_url: data.avatar_url,
      role: (data.role as UserRole) || "member",
      email_verified_at: new Date().toISOString(),
      status: (data.status as any) || "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    membersStore.push(newMember);
    return newMember;
  },

  async updateMemberRole(id: string, role: UserRole): Promise<UserProfile> {
    const db = getDbClient();
    if (db && isValidUuid(id)) {
      const { data: updated, error } = await db
        .from("profiles")
        .update({ role, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update member role (${error.code}): ${error.message}`);
      }

      await db.from("audit_log").insert({
        action: "UPDATE_MEMBER_ROLE",
        entity_type: "member",
        entity_id: id,
        diff: { role },
      });

      const member: UserProfile = {
        id: updated.id,
        display_name: updated.display_name,
        avatar_url: updated.avatar_url || undefined,
        role: updated.role,
        email_verified_at: updated.email_verified_at,
        status: updated.status,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      };

      const mIdx = membersStore.findIndex((m) => m.id === id);
      if (mIdx >= 0) membersStore[mIdx] = member;
      return member;
    }

    const member = membersStore.find((m) => m.id === id);
    if (!member) throw new Error("Member not found.");
    member.role = role;
    member.updated_at = new Date().toISOString();
    return member;
  },

  async deactivateMember(id: string): Promise<UserProfile> {
    const db = getDbClient();
    if (db && isValidUuid(id)) {
      const { data: updated, error } = await db
        .from("profiles")
        .update({ status: "suspended", updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to suspend member (${error.code}): ${error.message}`);
      }

      await db.from("audit_log").insert({
        action: "SUSPEND_MEMBER",
        entity_type: "member",
        entity_id: id,
        diff: { status: "suspended" },
      });

      const member: UserProfile = {
        id: updated.id,
        display_name: updated.display_name,
        avatar_url: updated.avatar_url || undefined,
        role: updated.role,
        email_verified_at: updated.email_verified_at,
        status: updated.status,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      };

      const mIdx = membersStore.findIndex((m) => m.id === id);
      if (mIdx >= 0) membersStore[mIdx] = member;
      return member;
    }

    const member = membersStore.find((m) => m.id === id);
    if (!member) throw new Error("Member not found.");
    member.status = "suspended";
    member.updated_at = new Date().toISOString();
    return member;
  },

  // --- COMPANIES ---
  async getCompanies(): Promise<Company[]> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db.from("companies").select("*").order("created_at", { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || "",
            website_url: c.website_url || "",
            logo_url: c.logo_url || "",
            visibility: c.visibility || "public",
            created_at: c.created_at,
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...companiesStore];
  },

  // --- PEOPLE ---
  async getPeople(): Promise<Person[]> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db.from("people").select("*").order("created_at", { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            role: p.role || "",
            company_name: p.company_name || "",
            company_id: p.company_id,
            biography: p.biography || "",
            portrait_url: p.portrait_url || "",
            visibility: p.visibility || "public",
            created_at: p.created_at,
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...peopleStore];
  },

  // --- AI JOBS TELEMETRY ---
  async getAIJobs(): Promise<any[]> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db.from("ai_jobs").select("*").order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((j: any) => ({
            id: j.id,
            episode_id: j.episode_id,
            episode: j.episode_id ? `Episode ${j.episode_id}` : "Ad-hoc Synthesis",
            model: j.model,
            source_type: Array.isArray(j.source_types) ? j.source_types.join(", ") : j.source_types || "transcript",
            tokens: j.tokens_used || 0,
            cost: `$${(Number(j.cost_estimate) || 0).toFixed(4)}`,
            status: j.status || "completed",
            date: j.created_at ? new Date(j.created_at).toISOString().replace("T", " ").substring(0, 16) : "Recent",
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...aiJobsStore];
  },

  // --- FOUNDER PROFILE ---
  async getFounderProfile(): Promise<FounderProfile> {
    const db = getDbClient();
    if (db) {
      try {
        const { data, error } = await db.from("people").select("*").eq("slug", "dr-ajay-kumar").maybeSingle();
        if (!error && data) {
          return {
            name: data.name || founderProfileStore.name,
            title: data.role || founderProfileStore.title,
            company_name: data.company_name || founderProfileStore.company_name,
            company_url: data.external_links?.website || founderProfileStore.company_url,
            bio: data.biography || founderProfileStore.bio,
            photo_url: data.portrait_url || founderProfileStore.photo_url,
            initials: data.name
              ? data.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
              : "AK",
            updated_at: data.created_at,
          };
        }
      } catch {
        // Fallback
      }
    }
    return { ...founderProfileStore };
  },

  async updateFounderProfile(profile: Partial<FounderProfile>): Promise<FounderProfile> {
    founderProfileStore = {
      ...founderProfileStore,
      ...profile,
      updated_at: new Date().toISOString(),
    };

    if (founderProfileStore.name) {
      founderProfileStore.initials = founderProfileStore.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    if (peopleStore[0]) {
      peopleStore[0].name = founderProfileStore.name;
      peopleStore[0].role = founderProfileStore.title;
      peopleStore[0].company_name = founderProfileStore.company_name;
      peopleStore[0].biography = founderProfileStore.bio;
      peopleStore[0].portrait_url = founderProfileStore.photo_url;
      if (!peopleStore[0].external_links) peopleStore[0].external_links = {};
      peopleStore[0].external_links.website = founderProfileStore.company_url;
    }

    const db = getDbClient();
    if (db) {
      const { error } = await db.from("people").upsert({
        name: founderProfileStore.name,
        slug: "dr-ajay-kumar",
        role: founderProfileStore.title,
        company_name: founderProfileStore.company_name,
        biography: founderProfileStore.bio,
        portrait_url: founderProfileStore.photo_url || null,
        external_links: { website: founderProfileStore.company_url },
        visibility: "public",
        created_at: new Date().toISOString(),
      }, { onConflict: "slug" });

      if (error) {
        throw new Error(`Failed to update founder profile in database (${error.code}): ${error.message}`);
      }
    }

    return { ...founderProfileStore };
  },
};
