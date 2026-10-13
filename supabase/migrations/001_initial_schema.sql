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

-- Helper function: Check if current user has active admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
        AND status = 'active'
    );
END;
$$;

-- Helper function: Check if current user has active admin or editor role
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'editor')
        AND status = 'active'
    );
END;
$$;

-- ==============================================================================
-- DATABASE-SIDE INTEGRITY TRIGGERS & WORKFLOW ENFORCEMENT
-- ==============================================================================

-- 1. Profile Security Trigger: Prevent privilege escalation by non-admins
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- If caller is authenticated and not an active admin, guard sensitive columns
    IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
        IF NEW.role IS DISTINCT FROM OLD.role THEN
            RAISE EXCEPTION 'Only administrators can modify user roles';
        END IF;
        IF NEW.status IS DISTINCT FROM OLD.status THEN
            RAISE EXCEPTION 'Only administrators can modify account status';
        END IF;
        IF NEW.email_verified_at IS DISTINCT FROM OLD.email_verified_at THEN
            RAISE EXCEPTION 'Cannot manually alter email verification timestamp';
        END IF;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
CREATE TRIGGER on_profile_update
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_update();

-- 2. Comment Moderation Trigger: Force re-moderation on author edit and stamp moderator action
CREATE OR REPLACE FUNCTION public.handle_comment_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    actor_is_moderator BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'moderator', 'editor')
        AND status = 'active'
    ) INTO actor_is_moderator;

    IF auth.uid() IS NOT NULL AND NOT actor_is_moderator THEN
        -- Prevent reassigning author ownership or episode target
        IF NEW.author_profile_id IS DISTINCT FROM OLD.author_profile_id 
           OR NEW.episode_id IS DISTINCT FROM OLD.episode_id THEN
            RAISE EXCEPTION 'Cannot reassign comment ownership or episode';
        END IF;

        -- If body was modified by author, reset status to pending for re-moderation
        IF NEW.body IS DISTINCT FROM OLD.body THEN
            NEW.status := 'pending';
            NEW.moderated_by := NULL;
            NEW.moderated_at := NULL;
        ELSE
            -- Author cannot alter status directly if body was not changed
            NEW.status := OLD.status;
        END IF;
    ELSIF actor_is_moderator THEN
        -- If moderator/admin is updating status, stamp moderator info
        IF NEW.status IS DISTINCT FROM OLD.status THEN
            NEW.moderated_by := auth.uid();
            NEW.moderated_at := NOW();
        END IF;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_comment_update ON public.comments;
CREATE TRIGGER on_comment_update
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_comment_update();

-- 3. Automatic Profile Creation Trigger on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    user_display_name TEXT;
    user_avatar_url TEXT;
BEGIN
    user_display_name := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
        NULLIF(SPLIT_PART(NEW.email, '@', 1), ''),
        'Member'
    );

    user_avatar_url := NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), '');

    INSERT INTO public.profiles (
        id,
        display_name,
        avatar_url,
        role,
        email_verified_at,
        status,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        user_display_name,
        user_avatar_url,
        'member', -- Defaults strictly to member; privileged roles can only be granted by admins
        CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN NEW.email_confirmed_at ELSE NULL END,
        'active',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET
        display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        email_verified_at = COALESCE(EXCLUDED.email_verified_at, profiles.email_verified_at),
        updated_at = NOW();

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Sync email verification timestamp from auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
        UPDATE public.profiles
        SET email_verified_at = NEW.email_confirmed_at,
            updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_email_confirmed();

-- Optional backfill for existing auth users if any exist prior to migration
INSERT INTO public.profiles (id, display_name, role, status, email_verified_at)
SELECT 
    u.id,
    COALESCE(
        NULLIF(TRIM(u.raw_user_meta_data->>'display_name'), ''),
        NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
        NULLIF(SPLIT_PART(u.email, '@', 1), ''),
        'Member'
    ),
    'member',
    'active',
    u.email_confirmed_at
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — IDEMPOTENT & HARDENED
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (status = 'active');

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (id = auth.uid() OR public.is_admin())
    WITH CHECK (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles" 
    ON public.profiles FOR ALL 
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 2. EPISODES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published episodes" ON public.episodes;
CREATE POLICY "Public can view published episodes" 
    ON public.episodes FOR SELECT 
    USING (status = 'published' AND published_at <= NOW());

DROP POLICY IF EXISTS "Admins and editors have full access to episodes" ON public.episodes;
CREATE POLICY "Admins and editors have full access to episodes" 
    ON public.episodes FOR ALL 
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

-- ------------------------------------------------------------------------------
-- 3. TAGS & EPISODE_TAGS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON public.tags;
CREATE POLICY "Tags are viewable by everyone" 
    ON public.tags FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Admins and editors can manage tags" ON public.tags;
CREATE POLICY "Admins and editors can manage tags" 
    ON public.tags FOR ALL 
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Episode tags viewable by everyone" ON public.episode_tags;
CREATE POLICY "Episode tags viewable by everyone" 
    ON public.episode_tags FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Episode tags managed by editors/admins" ON public.episode_tags;
CREATE POLICY "Episode tags managed by editors/admins" 
    ON public.episode_tags FOR ALL 
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

-- ------------------------------------------------------------------------------
-- 4. COMPANIES & PEOPLE POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view public companies" ON public.companies;
CREATE POLICY "Public can view public companies" 
    ON public.companies FOR SELECT 
    USING (visibility = 'public' OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admins and editors can manage companies" ON public.companies;
CREATE POLICY "Admins and editors can manage companies" 
    ON public.companies FOR ALL 
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Public can view public people" ON public.people;
CREATE POLICY "Public can view public people" 
    ON public.people FOR SELECT 
    USING (visibility = 'public' OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admins and editors can manage people" ON public.people;
CREATE POLICY "Admins and editors can manage people" 
    ON public.people FOR ALL 
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Public can view published episode people" ON public.episode_people;
CREATE POLICY "Public can view published episode people" 
    ON public.episode_people FOR SELECT 
    USING (
        public.is_admin_or_editor()
        OR (
            EXISTS (
                SELECT 1 FROM public.episodes e 
                WHERE e.id = episode_people.episode_id 
                AND e.status = 'published' 
                AND e.published_at <= NOW()
            )
            AND EXISTS (
                SELECT 1 FROM public.people p 
                WHERE p.id = episode_people.person_id 
                AND p.visibility = 'public'
            )
        )
    );

DROP POLICY IF EXISTS "Admins and editors can manage episode people" ON public.episode_people;
CREATE POLICY "Admins and editors can manage episode people" 
    ON public.episode_people FOR ALL 
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Public can view published episode companies" ON public.episode_companies;
CREATE POLICY "Public can view published episode companies" 
    ON public.episode_companies FOR SELECT 
    USING (
        public.is_admin_or_editor()
        OR (
            EXISTS (
                SELECT 1 FROM public.episodes e 
                WHERE e.id = episode_companies.episode_id 
                AND e.status = 'published' 
                AND e.published_at <= NOW()
            )
            AND EXISTS (
                SELECT 1 FROM public.companies c 
                WHERE c.id = episode_companies.company_id 
                AND c.visibility = 'public'
            )
        )
    );

DROP POLICY IF EXISTS "Admins and editors can manage episode companies" ON public.episode_companies;
CREATE POLICY "Admins and editors can manage episode companies" 
    ON public.episode_companies FOR ALL 
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

-- ------------------------------------------------------------------------------
-- 5. COMMUNITY COMMENTS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
CREATE POLICY "Public can view approved comments" 
    ON public.comments FOR SELECT 
    USING (
        status = 'approved' 
        OR author_profile_id = auth.uid() 
        OR public.is_admin_or_editor()
    );

DROP POLICY IF EXISTS "Verified members can insert comments" ON public.comments;
CREATE POLICY "Verified members can insert comments" 
    ON public.comments FOR INSERT 
    WITH CHECK (
        auth.uid() = author_profile_id
        AND status = 'pending'
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND email_verified_at IS NOT NULL 
            AND status = 'active'
        )
    );

DROP POLICY IF EXISTS "Authors can edit own comment within 10 minutes" ON public.comments;
CREATE POLICY "Authors can edit own comment within 10 minutes" 
    ON public.comments FOR UPDATE 
    USING (
        auth.uid() = author_profile_id 
        AND created_at >= NOW() - INTERVAL '10 minutes'
    )
    WITH CHECK (
        auth.uid() = author_profile_id
    );

DROP POLICY IF EXISTS "Admins and moderators can moderate comments" ON public.comments;
CREATE POLICY "Admins and moderators can moderate comments" 
    ON public.comments FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'moderator', 'editor')
            AND status = 'active'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'moderator', 'editor')
            AND status = 'active'
        )
    );

-- ------------------------------------------------------------------------------
-- 6. REVENUE DASHBOARD POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Revenue settings public access conditioned on visibility" ON public.revenue_settings;
CREATE POLICY "Revenue settings public access conditioned on visibility"
    ON public.revenue_settings FOR SELECT
    USING (visibility != 'private' OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admins can manage revenue settings" ON public.revenue_settings;
CREATE POLICY "Admins can manage revenue settings"
    ON public.revenue_settings FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Revenue months public access when detailed" ON public.revenue_months;
CREATE POLICY "Revenue months public access when detailed"
    ON public.revenue_months FOR SELECT
    USING (
        (public_visibility = true AND EXISTS (
            SELECT 1 FROM public.revenue_settings 
            WHERE id = 1 AND visibility = 'public_detailed'
        )) 
        OR public.is_admin_or_editor()
    );

DROP POLICY IF EXISTS "Admins can manage revenue months" ON public.revenue_months;
CREATE POLICY "Admins can manage revenue months"
    ON public.revenue_months FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Milestones viewable when public" ON public.revenue_milestones;
CREATE POLICY "Milestones viewable when public"
    ON public.revenue_milestones FOR SELECT
    USING (visibility = true OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Milestones managed by admins" ON public.revenue_milestones;
CREATE POLICY "Milestones managed by admins"
    ON public.revenue_milestones FOR ALL
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

-- ------------------------------------------------------------------------------
-- 7. AUDIT LOG & AI JOBS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Audit logs strictly admin only" ON public.audit_log;
CREATE POLICY "Audit logs strictly admin only" 
    ON public.audit_log FOR SELECT 
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.audit_log;
CREATE POLICY "Admins can insert audit logs" 
    ON public.audit_log FOR INSERT 
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins and editors can view and manage ai jobs" ON public.ai_jobs;
CREATE POLICY "Admins and editors can view and manage ai jobs" 
    ON public.ai_jobs FOR ALL 
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

-- ------------------------------------------------------------------------------
-- 8. SLUG REDIRECTS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Slug redirects readable by all" ON public.slug_redirects;
CREATE POLICY "Slug redirects readable by all"
    ON public.slug_redirects FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins and editors can manage slug redirects" ON public.slug_redirects;
CREATE POLICY "Admins and editors can manage slug redirects"
    ON public.slug_redirects FOR ALL 
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

-- ==============================================================================
-- POSTGREST LEAST-PRIVILEGE ROLE PERMISSIONS (SEC 13.1, SECURITY HARDENING)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 1. Anonymous role: Read-only on public records strictly governed by RLS policies
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- 2. Authenticated role: CRUD operations strictly governed by RLS policies
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- 3. Service role: Full administrative access for server-side background operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 4. Sequences & Routines
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Future tables default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON ROUTINES TO anon, authenticated, service_role;


