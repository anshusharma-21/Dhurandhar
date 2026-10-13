import { Episode, EpisodeFilterParams, Tag } from "../types/episode";
import { RevenueSettings, RevenueMonth, RevenueMilestone } from "../types/revenue";
import { Comment, CommentStatus } from "../types/comment";
import { UserProfile, UserRole } from "../types/profile";
import { AuditLogEntry } from "../types/audit";
import { Company, Person, FounderProfile } from "../types/people";
import { sanitizePlainText } from "../security/sanitize";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Safe, non-cookie database client for server-level queries & background operations
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
  { id: "t-1", label: "Vision & Strategy", slug: "vision-strategy" },
  { id: "t-2", label: "Sales & Marketing", slug: "sales-marketing" },
  { id: "t-3", label: "Product & Technology", slug: "product-technology" },
  { id: "t-4", label: "AI & Automation", slug: "ai-automation" },
  { id: "t-5", label: "Operations & Delivery", slug: "operations-delivery" },
  { id: "t-6", label: "Hiring & Team", slug: "hiring-team" },
  { id: "t-7", label: "Finance & Revenue", slug: "finance-revenue" },
  { id: "t-8", label: "Customers", slug: "customers" },
  { id: "t-9", label: "Partnerships", slug: "partnerships" },
  { id: "t-10", label: "Setbacks & Lessons", slug: "setbacks-lessons" },
  { id: "t-11", label: "Milestones", slug: "milestones" },
  { id: "t-12", label: "Founder Reflections", slug: "founder-reflections" },
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
    actual_amount: 8500000, // ₹85 Lakhs
    target_amount: 10000000, // ₹1.00 Cr
    note: "Q1 Launch month; initial recurring enterprise retainers established.",
    public_visibility: true,
    updated_at: "2026-05-05T12:00:00+05:30",
  },
  {
    id: "rm-2",
    month_start: "2026-05-01",
    actual_amount: 12500000, // ₹1.25 Cr
    target_amount: 12000000, // ₹1.20 Cr
    note: "Exceeded monthly target via expanded scope on logistics automation contracts.",
    public_visibility: true,
    updated_at: "2026-06-05T12:00:00+05:30",
  },
  {
    id: "rm-3",
    month_start: "2026-06-01",
    actual_amount: 16000000, // ₹1.60 Cr
    target_amount: 15000000, // ₹1.50 Cr
    note: "End of Q1; 3 new annual enterprise agreements locked.",
    public_visibility: true,
    updated_at: "2026-07-05T12:00:00+05:30",
  },
  {
    id: "rm-4",
    month_start: "2026-07-01",
    actual_amount: 21000000, // ₹2.10 Cr
    target_amount: 20000000, // ₹2.00 Cr
    note: "Expansion into US healthcare AI solutions.",
    public_visibility: true,
    updated_at: "2026-08-05T12:00:00+05:30",
  },
  {
    id: "rm-5",
    month_start: "2026-08-01",
    actual_amount: 24500000, // ₹2.45 Cr
    target_amount: 25000000, // ₹2.50 Cr
    note: "Slight delivery delay due to API vendor rate-limits; contract active.",
    public_visibility: true,
    updated_at: "2026-09-05T12:00:00+05:30",
  },
  {
    id: "rm-6",
    month_start: "2026-09-01",
    actual_amount: 29000000, // ₹2.90 Cr
    target_amount: 28000000, // ₹2.80 Cr
    note: "Crossed ₹11 Crore cumulative revenue milestone.",
    public_visibility: true,
    updated_at: "2026-10-05T12:00:00+05:30",
  },
];

let milestonesStore: RevenueMilestone[] = [
  {
    id: "ms-1",
    title: "Official Journey Launch",
    description: "Public pledge of Project Dhurandhar: Road to ₹30CR Revenue.",
    milestone_date: "2026-04-01",
    visibility: true,
    sort_order: 1,
    created_at: "2026-04-01T10:00:00+05:30",
  },
  {
    id: "ms-2",
    title: "First ₹5 Crore Cumulative Revenue",
    description: "Milestone crossed at Day 45 with 14 active enterprise retainers.",
    milestone_date: "2026-06-15",
    visibility: true,
    sort_order: 2,
    created_at: "2026-06-15T10:00:00+05:30",
  },
  {
    id: "ms-3",
    title: "₹10 Crore Run-rate Crossed",
    description: "Achieved during Q2 close with 98% gross retention.",
    milestone_date: "2026-09-20",
    visibility: true,
    sort_order: 3,
    created_at: "2026-09-20T10:00:00+05:30",
  },
  {
    id: "ms-4",
    title: "Midpoint: ₹15 Crore Target",
    description: "Projected target for end of Q3.",
    milestone_date: "2026-12-31",
    visibility: true,
    sort_order: 4,
    created_at: "2026-10-01T10:00:00+05:30",
  },
  {
    id: "ms-5",
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
    actor_id: "admin-1",
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
    id: "comp-1",
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
    id: "person-1",
    name: "Dr. Ajay Kumar",
    slug: "dr-ajay-kumar",
    role: "Founder & Managing Partner",
    company_name: "AI Automation Labs LLP",
    company_id: "comp-1",
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

// ==============================================================================
// REPOSITORY IMPLEMENTATION
// ==============================================================================

export const dbRepository = {
  // --- EPISODES ---
  async getPublishedEpisodes(params?: EpisodeFilterParams): Promise<{ episodes: Episode[]; total: number }> {
    let list = episodesStore.filter(
      (ep) => ep.status === "published" && ep.published_at && new Date(ep.published_at) <= new Date()
    );

    // Filter by tag
    if (params?.tag) {
      list = list.filter((ep) => ep.tags?.some((t) => t.slug === params.tag));
    }

    // Filter by search query (Day N, title, summary, tag) (AC-08)
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

    // Sort order: default is latest published first, with Day number tie-breaker (AC-02)
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
    // Check if slug redirect exists (AC-22)
    const targetSlug = slugRedirectsStore[slug] || slug;
    const ep = episodesStore.find((e) => e.slug === targetSlug);
    return ep ? { ...ep } : null;
  },

  async getEpisodeById(id: string): Promise<Episode | null> {
    const ep = episodesStore.find((e) => e.id === id);
    return ep ? { ...ep } : null;
  },

  async getAllEpisodesAdmin(): Promise<Episode[]> {
    return [...episodesStore].sort((a, b) => b.day_number - a.day_number);
  },

  async createEpisode(data: Partial<Episode>): Promise<Episode> {
    // Prevent duplicate day number (AC-01)
    if (episodesStore.some((e) => e.day_number === data.day_number)) {
      throw new Error(`Episode with Day ${data.day_number} already exists.`);
    }

    const id = `ep-${Date.now()}`;
    const baseSlug = `day-${String(data.day_number || 1).padStart(3, "0")}-${(data.title || "episode")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`;

    const newEpisode: Episode = {
      id,
      day_number: Number(data.day_number) || 1,
      title: data.title || `Day ${data.day_number}`,
      slug: data.slug || baseSlug,
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
    const index = episodesStore.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Episode not found.");

    const existing = episodesStore[index];

    // If day_number changed, check uniqueness
    if (data.day_number && data.day_number !== existing.day_number) {
      if (episodesStore.some((e) => e.id !== id && e.day_number === data.day_number)) {
        throw new Error(`Episode with Day ${data.day_number} already exists.`);
      }
    }

    // Slug redirect handling (AC-22)
    if (data.slug && data.slug !== existing.slug) {
      slugRedirectsStore[existing.slug] = data.slug;
    }

    const updated: Episode = {
      ...existing,
      ...data,
      // If status changed to published and published_at was empty, set current time
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
    return commentsStore
      .filter((c) => c.episode_id === episodeId && c.status === "approved")
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  async getModerationQueue(): Promise<Comment[]> {
    return [...commentsStore].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createComment(data: {
    episode_id: string;
    author_profile_id: string;
    author_name: string;
    body: string;
  }): Promise<Comment> {
    // Sanitization against XSS (AC-12)
    const sanitizedBody = sanitizePlainText(data.body);
    if (!sanitizedBody) {
      throw new Error("Comment text cannot be empty or contain only unsafe tags.");
    }

    // First-time user moderation check (AC-11)
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

    // Update episode comment count if approved
    if (initialStatus === "approved") {
      const ep = episodesStore.find((e) => e.id === data.episode_id);
      if (ep) ep.comments_count = (ep.comments_count || 0) + 1;
    }

    return newComment;
  },

  async moderateComment(id: string, status: CommentStatus, moderatorId: string): Promise<Comment> {
    const comment = commentsStore.find((c) => c.id === id);
    if (!comment) throw new Error("Comment not found.");

    const prevStatus = comment.status;
    comment.status = status;
    comment.moderated_by = moderatorId;
    comment.moderated_at = new Date().toISOString();

    // Sync count
    const ep = episodesStore.find((e) => e.id === comment.episode_id);
    if (ep) {
      if (status === "approved" && prevStatus !== "approved") {
        ep.comments_count = (ep.comments_count || 0) + 1;
      } else if (prevStatus === "approved" && status !== "approved") {
        ep.comments_count = Math.max(0, (ep.comments_count || 1) - 1);
      }
    }

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
        }
      } catch {
        // Graceful fallback to store
      }
    }
    return { ...revenueSettingsStore };
  },

  async updateRevenueSettings(data: Partial<RevenueSettings>, actorId: string): Promise<RevenueSettings> {
    const prev = { ...revenueSettingsStore };
    revenueSettingsStore = {
      ...revenueSettingsStore,
      ...data,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    };

    const db = getDbClient();
    if (db) {
      try {
        await db.from("revenue_settings").upsert({
          id: 1,
          goal_label: revenueSettingsStore.goal_label,
          target_amount: revenueSettingsStore.target_amount,
          target_start: revenueSettingsStore.target_start,
          target_end: revenueSettingsStore.target_end,
          target_basis: revenueSettingsStore.target_basis,
          revenue_definition: revenueSettingsStore.revenue_definition,
          gst_treatment: revenueSettingsStore.gst_treatment,
          visibility: revenueSettingsStore.visibility,
          notes: revenueSettingsStore.notes,
          updated_at: revenueSettingsStore.updated_at,
        });

        await db.from("audit_log").insert({
          actor_id: actorId && actorId.startsWith("admin-") ? null : actorId,
          action: "UPDATE_REVENUE_SETTINGS",
          entity_type: "revenue",
          entity_id: "1",
          diff: { before: prev, after: revenueSettingsStore },
        });
      } catch {
        // Non-blocking fallback
      }
    }

    // Log to audit trail
    auditLogsStore.unshift({
      id: `aud-${Date.now()}`,
      actor_id: actorId,
      actor_name: "Admin",
      action: "UPDATE_REVENUE_SETTINGS",
      entity_type: "revenue",
      entity_id: "1",
      diff: { before: prev, after: revenueSettingsStore },
      created_at: new Date().toISOString(),
    });

    return revenueSettingsStore;
  },

  async getRevenueMonths(includePrivate: boolean = false): Promise<RevenueMonth[]> {
    if (revenueSettingsStore.visibility === "private" && !includePrivate) {
      return [];
    }

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

    return [...revenueMonthsStore].sort((a, b) => a.month_start.localeCompare(b.month_start));
  },

  async saveRevenueMonth(
    data: { month_start: string; actual_amount: number; target_amount?: number; note?: string },
    actorId: string
  ): Promise<RevenueMonth> {
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

    const db = getDbClient();
    if (db) {
      try {
        await db.from("revenue_months").upsert(
          {
            month_start: record.month_start,
            actual_amount: record.actual_amount,
            target_amount: record.target_amount,
            note: record.note,
            public_visibility: record.public_visibility,
            updated_at: record.updated_at,
          },
          { onConflict: "month_start" }
        );

        await db.from("audit_log").insert({
          actor_id: actorId && actorId.startsWith("admin-") ? null : actorId,
          action: "SAVE_REVENUE_MONTH",
          entity_type: "revenue_month",
          entity_id: record.month_start,
          diff: { record },
        });
      } catch {
        // Non-blocking
      }
    }

    revenueSettingsStore.updated_at = new Date().toISOString();
    return record;
  },

  async getMilestones(): Promise<RevenueMilestone[]> {
    return [...milestonesStore].sort((a, b) => a.sort_order - b.sort_order);
  },

  // --- TAGS ---
  async getAllTags(): Promise<Tag[]> {
    return [...INITIAL_TAGS];
  },

  // --- AUDIT LOGS ---
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return [...auditLogsStore];
  },

  // --- MEMBERS ---
  async getMembers(): Promise<UserProfile[]> {
    return [...membersStore];
  },

  async updateMemberRole(id: string, role: UserRole): Promise<UserProfile> {
    const member = membersStore.find((m) => m.id === id);
    if (!member) throw new Error("Member not found.");
    member.role = role;
    member.updated_at = new Date().toISOString();
    return member;
  },

  async deactivateMember(id: string): Promise<UserProfile> {
    const member = membersStore.find((m) => m.id === id);
    if (!member) throw new Error("Member not found.");
    member.status = "suspended";
    member.updated_at = new Date().toISOString();

    const db = getDbClient();
    if (db) {
      try {
        await db.from("profiles").update({ status: "suspended", updated_at: new Date().toISOString() }).eq("id", id);
      } catch {
        // Non-blocking
      }
    }

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

    // Keep peopleStore in sync
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
      try {
        await db.from("people").upsert({
          id: "person-1",
          name: founderProfileStore.name,
          slug: "dr-ajay-kumar",
          role: founderProfileStore.title,
          company_name: founderProfileStore.company_name,
          biography: founderProfileStore.bio,
          portrait_url: founderProfileStore.photo_url || null,
          external_links: { website: founderProfileStore.company_url },
          visibility: "public",
          created_at: new Date().toISOString(),
        });
      } catch {
        // Safe fallback
      }
    }

    return { ...founderProfileStore };
  },
};
