GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON ROUTINES TO anon, authenticated, service_role;


CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Singleton record
    canonical_hostname TEXT NOT NULL DEFAULT 'https://projectdhurandhar.automationlabs.online',
    display_timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    contact_email TEXT NOT NULL DEFAULT 'contact@automationlabs.online',
    ai_provider TEXT NOT NULL DEFAULT 'gemini',
    email_provider TEXT NOT NULL DEFAULT 'resend',
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.site_settings (id, canonical_hostname, display_timezone, contact_email, ai_provider, email_provider)
VALUES (1, 'https://projectdhurandhar.automationlabs.online', 'Asia/Kolkata', 'contact@automationlabs.online', 'gemini', 'resend')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings readable by everyone" ON public.site_settings;
CREATE POLICY "Site settings readable by everyone"
    ON public.site_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Site settings manageable by admins" ON public.site_settings;
CREATE POLICY "Site settings manageable by admins"
    ON public.site_settings FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;


INSERT INTO public.revenue_settings (id, goal_label, target_amount, target_basis, revenue_definition, gst_treatment, visibility)
VALUES (1, 'Road to ₹30 crore revenue', 300000000.00, 'cumulative', 'recognised', 'excluded', 'public_detailed')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;



DROP POLICY IF EXISTS "Public Access Media" ON storage.objects;
CREATE POLICY "Public Access Media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');


DROP POLICY IF EXISTS "Authenticated Users Upload Media" ON storage.objects;
CREATE POLICY "Authenticated Users Upload Media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 5. COMMENT INSERT POLICY REFINEMENT (NORMAL USER COMMENTING)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Verified members can insert comments" ON public.comments;
CREATE POLICY "Verified members can insert comments" 
    ON public.comments FOR INSERT 
    WITH CHECK (
        auth.uid() = author_profile_id
        AND status = 'pending'
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND status = 'active'
        )
    );

    
UPDATE public.profiles
SET email_verified_at = COALESCE(email_verified_at, created_at, NOW())
WHERE status = 'active' AND email_verified_at IS NULL;
