# PROJECT DHURANDHAR — OWNER CONFIGURATION CHECKLIST
**Project:** Project Dhurandhar — Road to ₹30CR Revenue  
**Owner:** Dr. Ajay Kumar & AI Automation Labs LLP  
**Document Purpose:** Complete inventory of intentionally configurable items, environment variables, credentials, and settings requiring owner input.  

> [!IMPORTANT]
> The developer has **never invented** revenue actuals, financial periods, AI budgets, contact emails, Instagram URLs, or legal notices. The application is pre-configured with safe, production-grade defaults and clear empty states until the owner enters these values in `/admin/settings` or in the deployment environment.

---

## 1. Environment Variables & Secret Credentials

Configure these variables in your Vercel Project Settings (`Settings > Environment Variables`) and locally in `.env.local`:

| Variable Name | Required / Optional | Description | Default / Example Value |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | **Required** | Canonical production site URL | `https://projectdhurandhar.automationlabs.online` |
| `NEXT_PUBLIC_SUPABASE_URL` | **Required** | Supabase Project URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Required** | Supabase Anonymous Client Key (Public) | `eyJh...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Required** | Supabase Service Role Key (**Strictly Server-Only**) | `eyJh...` |
| `AI_PROVIDER` | **Configurable** | AI Summary Provider (`gemini`, `openai`, `anthropic`, `groq`) | `gemini` (or `mock` for local dev) |
| `AI_API_KEY` | **Configurable** | Secret API key for the chosen AI provider | `AIzaSy...` (Server-only secret) |
| `AI_MODEL` | **Configurable** | Model identifier | `gemini-1.5-flash` or `gpt-4o-mini` |
| `AI_MONTHLY_BUDGET_USD` | **Optional** | Safety spending cap for AI summaries | `25.00` |
| `EMAIL_PROVIDER` | **Configurable** | Transactional email provider (`resend`, `sendgrid`, `smtp`) | `resend` (or `mock` for local dev) |
| `RESEND_API_KEY` | **Optional** | API key for transactional emails | `re_...` |
| `EMAIL_FROM` | **Configurable** | Verified sender email address | `updates@automationlabs.online` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`| **Optional** | Google Analytics ID | `G-XXXXXXXXXX` |

---

## 2. Owner-Controlled Revenue Configuration

Configure these via `/admin/revenue` once logged in as Administrator:

- [ ] **Target Amount:** Initial default is set to `₹30,00,00,000` (₹30 Crore INR).
- [ ] **Target Period Basis:**
  - `cumulative`: Cumulative revenue since journey start date.
  - `financial_year`: Annual financial year target (e.g. FY 2026-27).
- [ ] **Revenue Accounting Definition:**
  - `recognised`: Accounting revenue recognised in period.
  - `invoiced`: Total invoiced revenue raised.
  - `cash_collected`: Actual bank cash receipts.
- [ ] **GST Treatment:**
  - `excluded`: Figures represent net revenue exclusive of 18% GST.
  - `included`: Figures represent gross collections inclusive of GST.
- [ ] **Public Dashboard Visibility:**
  - `public_detailed`: Full monthly target vs actual, charts, milestones, and variance.
  - `public_summary`: Aggregated target, progress, and percentage only.
  - `private`: Public dashboard hidden; accessible only in `/admin`.
- [ ] **Monthly Historical Actuals:** Enter monthly actuals for completed months. Unentered months will gracefully display *"Not entered"*.

---

## 3. Brand Assets & Founder Media Checklist

- [ ] **Official Founder Portrait:** Upload Dr. Ajay Kumar's approved high-resolution portrait for the About page and author attribution.
- [ ] **AI Automation Labs Logo:** Provide SVG or PNG wordmark for the header and favicon.
- [ ] **Instagram Handle:** Confirm official handle (e.g., `@drajaykumar_` or `@aiautomationlabs`).
- [ ] **Contact & Support Email:** Provide public contact email (e.g., `contact@automationlabs.online`) for general inquiries.
- [ ] **Privacy / DPO Email:** Provide dedicated privacy contact for account deletion requests (e.g., `privacy@automationlabs.online`).

---

## 4. Subdomain & DNS Delegation Runbook

> [!CAUTION]
> **Strict DNS Preservation:** Do not change nameservers. Do not modify root `@`, `www`, MX, SPF, DKIM, or DMARC records for `automationlabs.online`.

Follow these steps with your domain registrar:
1. Open the DNS Manager for `automationlabs.online`.
2. Add a new **CNAME record**:
   - **Host / Name:** `projectdhurandhar`
   - **Points to / Target:** `cname.vercel-dns.com` (or the specific CNAME target shown in your Vercel Project Custom Domains tab).
   - **TTL:** 3600 (or Automatic).
3. If Vercel requires TXT ownership verification, add the provided TXT record for `_vercel` host.
4. Wait 5–15 minutes for DNS propagation and automatic SSL/TLS certificate issuance.

---

## 5. Verification & Acceptance Sign-off

Before public launch, the owner can log into `/admin` and execute the following checks:
1. Verify episode creation and Instagram URL embed.
2. Generate an AI summary using sample video transcript/notes.
3. Review and edit the draft summary and publish Episode 1.
4. Submit a test comment as a verified user and approve it in `/admin/comments`.
5. Enter the first month's revenue figure and verify the progress bar and charts.
