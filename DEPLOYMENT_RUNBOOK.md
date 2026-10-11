# PROJECT DHURANDHAR — DEPLOYMENT & ROLLBACK RUNBOOK
**Production Canonical Hostname:** `https://projectdhurandhar.automationlabs.online`  
**Parent Domain:** `automationlabs.online` (Hosts AI Automation Labs LLP corporate site)  
**Hosting Platforms:** Vercel (Next.js 14 App Router) & Supabase (PostgreSQL 15+ & Auth)  

---

## 1. Strict Parent Domain DNS Preservation Rules

> [!CAUTION]
> **MANDATORY DNS SAFETY DIRECTIVE (Specification Section 15.2 & AC-24):**
> 1. The DNS change must be strictly scoped to the `projectdhurandhar` subdomain host record only.
> 2. **NEVER change nameservers** as a shortcut.
> 3. **DO NOT MODIFY** the root `@` record, `www` record, MX records, SPF, DKIM, DMARC, or unrelated TXT records on `automationlabs.online`.
> 4. Verify that `automationlabs.online` continues to resolve cleanly to its existing corporate website after applying DNS changes.

---

## 2. Step-by-Step Deployment Procedure

### Step 1: Pre-Deployment Audit
1. Query current authoritative DNS records for `automationlabs.online` using `dig` or DNS tools:
   ```bash
   dig automationlabs.online ANY
   dig automationlabs.online MX
   ```
2. Confirm the existing corporate site at `https://automationlabs.online` and email delivery remain operational.

### Step 2: Supabase Production Project Provisioning
1. Log into your Supabase Dashboard at `https://supabase.com/dashboard`.
2. Create a new organization/project named: `project-dhurandhar-production`.
3. Choose the geographic region closest to your target audience (e.g. `ap-south-1` Mumbai, India or `ap-southeast-1` Singapore).
4. Navigate to the **SQL Editor** and run the initial migration:
   - Apply `supabase/migrations/001_initial_schema.sql`.
   - Apply `supabase/seed.sql`.
5. Under **Authentication > URL Configuration**:
   - Set **Site URL** to: `https://projectdhurandhar.automationlabs.online`.
   - Set **Redirect URLs** to:
     - `https://projectdhurandhar.automationlabs.online/**`
     - `https://projectdhurandhar.automationlabs.online/auth/callback`
6. Under **Project Settings > API**, securely copy:
   - `Project URL`
   - `anon public key`
   - `service_role secret key` (Keep private; never expose to client!)

### Step 3: Vercel Project Provisioning & Environment Variables
1. In Vercel (`https://vercel.com`), click **Add New > Project** and import the Git repository.
2. Framework Preset: **Next.js**.
3. Root Directory: `./`.
4. Configure the following Environment Variables under **Settings > Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` = `https://projectdhurandhar.automationlabs.online`
   - `NEXT_PUBLIC_SITE_NAME` = `Project Dhurandhar — Road to ₹30CR Revenue`
   - `NEXT_PUBLIC_TIMEZONE` = `Asia/Kolkata`
   - `NEXT_PUBLIC_SUPABASE_URL` = `<Your Supabase Project URL>`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<Your Supabase Anon Key>`
   - `SUPABASE_SERVICE_ROLE_KEY` = `<Your Supabase Service Role Key>`
   - `AI_PROVIDER` = `gemini`
   - `AI_API_KEY` = `<Your Google Gemini API Key>`
   - `AI_MODEL` = `gemini-1.5-flash`
   - `AI_MONTHLY_BUDGET_USD` = `25.00`
   - `EMAIL_PROVIDER` = `resend`
   - `RESEND_API_KEY` = `<Your Resend API Key>`
   - `EMAIL_FROM` = `Project Dhurandhar <updates@automationlabs.online>`
5. Click **Deploy** and verify that the build succeeds on the `.vercel.app` preview domain.

### Step 4: Subdomain DNS Delegation
1. In your Vercel Project, go to **Settings > Domains**.
2. Add custom domain: `projectdhurandhar.automationlabs.online`.
3. Read the required DNS target provided by Vercel (typically `cname.vercel-dns.com`).
4. In your DNS registrar control panel for `automationlabs.online`:
   - Add a **CNAME Record**:
     - **Name / Host:** `projectdhurandhar`
     - **Value / Target:** `cname.vercel-dns.com`
     - **TTL:** `3600` (or 1 hour)
   - If Vercel displays a TXT verification requirement, add the exact TXT record (Host: `_vercel`, Value: `<verification-token>`).
5. Wait for Vercel managed SSL certificate issuance (typically 5 to 15 minutes).

### Step 5: Post-Deployment Smoke Test
Verify the following endpoints over HTTPS:
1. `https://projectdhurandhar.automationlabs.online/` (Homepage renders with latest vlog and revenue snapshot).
2. `https://projectdhurandhar.automationlabs.online/episodes` (Search and topic filters work).
3. `https://projectdhurandhar.automationlabs.online/revenue` (Interactive Recharts dashboard & calculations).
4. `https://projectdhurandhar.automationlabs.online/sitemap.xml` (Valid XML sitemap returned).
5. `https://projectdhurandhar.automationlabs.online/admin` (Admin control console accessible).
6. Verify `https://automationlabs.online` is completely unaffected.

---

## 3. Rollback Runbook

If a critical issue occurs post-launch:
1. **Immediate Frontend Rollback:**
   - In Vercel **Deployments**, locate the last known-good deployment commit.
   - Click the three dots `...` and select **Promote to Production**. Instant zero-downtime rollback is completed in seconds.
2. **Database Rollback:**
   - If a schema issue occurs, restore the point-in-time backup from the Supabase dashboard (**Settings > Backups > Restore**).
   - Alternatively, execute the documented migration rollback script.
3. **DNS Emergency Decoupling:**
   - If the subdomain needs immediate suspension without touching the parent domain, remove or pause only the `projectdhurandhar` CNAME record in your registrar. The parent website remains 100% operational.
