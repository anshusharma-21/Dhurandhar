-- ==============================================================================
-- PROJECT DHURANDHAR: ROAD TO ₹30CR REVENUE
-- MIGRATION 001: INITIAL RELATIONAL SCHEMA, CONSTRAINTS, INDEXES & RLS POLICIES
-- Target URL: https://projectdhurandhar.automationlabs.online
-- Complies with Specification Sections 8, 9, 10, 11, 12, 13, 15, 16
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'editor', 'admin')),
    email_verified_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role-based lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------------------------------------------
-- 2. EPISODES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_number INTEGER NOT NULL UNIQUE CHECK (day_number > 0),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    instagram_url TEXT,
    caption TEXT,
    context_notes TEXT,
    transcript_text TEXT,
    summary TEXT,
    takeaways JSONB DEFAULT '[]'::jsonb,
    summary_status TEXT NOT NULL DEFAULT 'not_generated' 
        CHECK (summary_status IN ('not_generated', 'processing', 'generated', 'failed', 'approved')),
    summary_source TEXT DEFAULT 'none',
    published_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'pending_review', 'scheduled', 'published', 'archived', 'ai_failed')),
    comments_enabled BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast published sorting and slug queries (AC-02, AC-20)
CREATE INDEX IF NOT EXISTS idx_episodes_published ON public.episodes (status, published_at DESC, day_number DESC);
CREATE INDEX IF NOT EXISTS idx_episodes_slug ON public.episodes (slug);
CREATE INDEX IF NOT EXISTS idx_episodes_day_number ON public.episodes (day_number);

-- ------------------------------------------------------------------------------
-- 3. TAXONOMY (TAGS & EPISODE_TAGS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.episode_tags (
    episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_episode_tags_tag_id ON public.episode_tags(tag_id);

-- ------------------------------------------------------------------------------
-- 4. PEOPLE & COMPANIES (OPTIONAL PROFILES - SEC 10)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    visibility TEXT NOT NULL DEFAULT 'draft' CHECK (visibility IN ('draft', 'public')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.people (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    role TEXT,
    company_name TEXT,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    biography TEXT,
    portrait_url TEXT,
    external_links JSONB DEFAULT '{}'::jsonb,
    visibility TEXT NOT NULL DEFAULT 'draft' CHECK (visibility IN ('draft', 'public')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.episode_people (
    episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
    relationship TEXT,
    PRIMARY KEY (episode_id, person_id)
);

CREATE TABLE IF NOT EXISTS public.episode_companies (
    episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    relationship TEXT,
    PRIMARY KEY (episode_id, company_id)
);

-- ------------------------------------------------------------------------------
-- 5. COMMUNITY COMMENTS (SEC 8, AC-09, AC-10, AC-11, AC-12)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
    author_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected', 'spam', 'removed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    moderated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    moderated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_comments_episode_status ON public.comments (episode_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_author ON public.comments (author_profile_id);

-- ------------------------------------------------------------------------------
-- 6. REVENUE DASHBOARD (SEC 9, AC-13, AC-14, AC-15)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.revenue_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Singleton record
    goal_label TEXT NOT NULL DEFAULT 'Road to ₹30 crore revenue',
    target_amount NUMERIC(15, 2) NOT NULL DEFAULT 300000000.00,
    target_start DATE NOT NULL DEFAULT '2026-04-01',
    target_end DATE NOT NULL DEFAULT '2027-03-31',
    target_basis TEXT NOT NULL DEFAULT 'cumulative' CHECK (target_basis IN ('cumulative', 'financial_year')),
    revenue_definition TEXT NOT NULL DEFAULT 'recognised' CHECK (revenue_definition IN ('recognised', 'invoiced', 'cash_collected')),
    gst_treatment TEXT NOT NULL DEFAULT 'excluded' CHECK (gst_treatment IN ('included', 'excluded')),
    visibility TEXT NOT NULL DEFAULT 'public_detailed' CHECK (visibility IN ('public_detailed', 'public_summary', 'private')),
    notes TEXT,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert singleton default if not exists
INSERT INTO public.revenue_settings (id, goal_label, target_amount, target_basis, revenue_definition, gst_treatment, visibility)
VALUES (1, 'Road to ₹30 crore revenue', 300000000.00, 'cumulative', 'recognised', 'excluded', 'public_detailed')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.revenue_months (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month_start DATE NOT NULL UNIQUE, -- e.g. 2026-04-01
    actual_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (actual_amount >= 0),
    target_amount NUMERIC(15, 2) DEFAULT 0.00 CHECK (target_amount >= 0),
    note TEXT,
    public_visibility BOOLEAN NOT NULL DEFAULT true,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenue_months_start ON public.revenue_months(month_start ASC);

CREATE TABLE IF NOT EXISTS public.revenue_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    milestone_date DATE NOT NULL,
    visibility BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. AUDIT LOG (SEC 11, 12.4, 16 AC-25)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    diff JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    request_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- ------------------------------------------------------------------------------
-- 8. AI JOBS TELEMETRY (SEC 6, 12.4)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id UUID REFERENCES public.episodes(id) ON DELETE SET NULL,
    model TEXT NOT NULL,
    source_types TEXT[] NOT NULL,
    status TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    cost_estimate NUMERIC(8, 4) DEFAULT 0.0000,
    error_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 9. SLUG REDIRECTS (SEC 4.1, AC-22)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.slug_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    old_slug TEXT NOT NULL UNIQUE,
    new_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user has admin/editor role
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'editor')
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public can read active profiles (excluding private email)
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (status = 'active');

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (id = auth.uid());

-- Episodes: Public can read published episodes only
CREATE POLICY "Public can view published episodes" 
    ON public.episodes FOR SELECT 
    USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Admins and editors have full access to episodes" 
    ON public.episodes FOR ALL 
    USING (public.is_admin_or_editor());

-- Tags: Viewable by all, managed by editors/admins
CREATE POLICY "Tags are viewable by everyone" 
    ON public.tags FOR SELECT 
    USING (true);

CREATE POLICY "Admins and editors can manage tags" 
    ON public.tags FOR ALL 
    USING (public.is_admin_or_editor());

CREATE POLICY "Episode tags viewable by everyone" 
    ON public.episode_tags FOR SELECT 
    USING (true);

CREATE POLICY "Episode tags managed by editors/admins" 
    ON public.episode_tags FOR ALL 
    USING (public.is_admin_or_editor());

-- Comments: Public can view approved comments
CREATE POLICY "Public can view approved comments" 
    ON public.comments FOR SELECT 
    USING (status = 'approved' OR author_profile_id = auth.uid());

CREATE POLICY "Verified members can insert comments" 
    ON public.comments FOR INSERT 
    WITH CHECK (
        auth.uid() = author_profile_id
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND email_verified_at IS NOT NULL 
            AND status = 'active'
        )
    );

CREATE POLICY "Authors can edit own comment within 10 minutes" 
    ON public.comments FOR UPDATE 
    USING (
        auth.uid() = author_profile_id 
        AND created_at >= NOW() - INTERVAL '10 minutes'
    );

CREATE POLICY "Admins and moderators can moderate comments" 
    ON public.comments FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'moderator', 'editor')
        )
    );

-- Revenue Settings & Months:
CREATE POLICY "Revenue settings public access conditioned on visibility"
    ON public.revenue_settings FOR SELECT
    USING (visibility != 'private' OR public.is_admin_or_editor());

CREATE POLICY "Revenue months public access when detailed"
    ON public.revenue_months FOR SELECT
    USING (
        (public_visibility = true AND EXISTS (
            SELECT 1 FROM public.revenue_settings 
            WHERE id = 1 AND visibility = 'public_detailed'
        )) 
        OR public.is_admin_or_editor()
    );

CREATE POLICY "Admins can manage revenue settings"
    ON public.revenue_settings FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage revenue months"
    ON public.revenue_months FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Milestones viewable when public"
    ON public.revenue_milestones FOR SELECT
    USING (visibility = true OR public.is_admin_or_editor());

CREATE POLICY "Milestones managed by admins"
    ON public.revenue_milestones FOR ALL
    USING (public.is_admin_or_editor());

-- Audit log: Strictly accessible only by Admin role
CREATE POLICY "Audit logs strictly admin only" 
    ON public.audit_log FOR SELECT 
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Slug redirects readable by all"
    ON public.slug_redirects FOR SELECT
    USING (true);
