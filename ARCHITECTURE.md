# PROJECT DHURANDHAR — FULL-STACK ARCHITECTURE SPECIFICATION
**Document Version:** 1.0.0  
**Date:** 11 October 2026  
**Application Title:** Project Dhurandhar — Road to ₹30CR Revenue  
**Owner / Entity:** Dr. Ajay Kumar & AI Automation Labs LLP  
**Canonical Production URL:** `https://projectdhurandhar.automationlabs.online`  
**Reference Specification:** `Project_Dhurandhar_Road_to_30CR_Custom_Website_Developer_Specification.pdf` (Version 2.0)

---

## 1. System Overview & Technology Stack

The application is a custom-engineered web application combining an editorial documentary publication, a daily vlog hub, an AI-assisted publishing pipeline, community engagement with first-time comment moderation, and an owner-governed ₹30 crore financial accountability engine.

```
+-----------------------------------------------------------------------------------+
|                           CLIENT BROWSER (Mobile & Desktop)                       |
|   +--------------------------+  +--------------------------+  +-----------------+ |
|   | Public Journal & Revenue |  | Authenticated Community  |  | /admin Portal   | |
|   +--------------------------+  +--------------------------+  +-----------------+ |
+-----------------------------------------------------------------------------------+
                                        | (HTTPS)
+-----------------------------------------------------------------------------------+
|                           NEXT.JS 14 APP ROUTER (Vercel)                          |
|   - Server-Side Rendering (SSR) for public episode SEO & crawlers                 |
|   - Client Components for interactive filters, charts & dialogs                   |
|   - Route Handlers (/api/episodes, /api/ai/summarize, /api/comments, /api/revenue)|
|   - Middleware: Auth protection, Subdomain header checks, Security headers        |
|   - Server-side AI Provider Abstraction (Gemini / OpenAI / Anthropic / Local mock)|
+-----------------------------------------------------------------------------------+
                       | (Service Role & Authenticated Tokens)
+-----------------------------------------------------------------------------------+
|                           SUPABASE MANAGED POSTGRESQL                             |
|   - 14 Relational Tables with strict foreign keys & check constraints            |
|   - Row Level Security (RLS) enforcing Anonymous, Member & Admin scopes           |
|   - Full-text search indexes (tsvector & trigram)                                 |
|   - Supabase Auth (Email/Password, Email Verification, JWT sessions)              |
+-----------------------------------------------------------------------------------+
```

---

## 2. Information Architecture & Routing

### 2.1 Public Routes
| Route | Component / Path | Rendering Mode | Security / Access |
| :--- | :--- | :--- | :--- |
| `/` | `src/app/(public)/page.tsx` | SSR with ISR / Revalidate | Public (Published data only) |
| `/episodes` | `src/app/(public)/episodes/page.tsx` | SSR + Client Filter State | Public |
| `/episodes/[slug]` | `src/app/(public)/episodes/[slug]/page.tsx`| SSR with Article Schema | Public |
| `/revenue` | `src/app/(public)/revenue/page.tsx` | SSR + Interactive Recharts | Public (Respects visibility modes) |
| `/about` | `src/app/(public)/about/page.tsx` | Static / SSR | Public |
| `/community-guidelines`| `src/app/(public)/community-guidelines/page.tsx`| Static | Public |
| `/privacy` | `src/app/(public)/privacy/page.tsx` | Static | Public |
| `/terms` | `src/app/(public)/terms/page.tsx` | Static | Public |
| `/sign-in` | `src/app/(auth)/sign-in/page.tsx` | Client Auth Component | Anonymous / Logged out |
| `/register`| `src/app/(auth)/register/page.tsx`| Client Auth Component | Anonymous / Logged out |
| `/people` | `src/app/(public)/people/page.tsx` | SSR (Optional/Configurable) | Public (If populated & enabled) |
| `/people/[slug]` | `src/app/(public)/people/[slug]/page.tsx` | SSR | Public |

### 2.2 Protected Admin Routes
| Route | Component / Path | Access Control | Purpose |
| :--- | :--- | :--- | :--- |
| `/admin` | `src/app/admin/page.tsx` | Admin, Editor, Moderator | Executive dashboard & quick actions |
| `/admin/episodes` | `src/app/admin/episodes/page.tsx` | Admin, Editor | Episode catalog & search |
| `/admin/episodes/new` | `src/app/admin/episodes/new/page.tsx`| Admin, Editor | Create episode & AI summary generator |
| `/admin/episodes/[id]` | `src/app/admin/episodes/[id]/page.tsx` | Admin, Editor | Edit episode, preview & publish |
| `/admin/ai-summaries`| `src/app/admin/ai-summaries/page.tsx` | Admin, Editor | AI jobs monitor & prompt tuner |
| `/admin/comments` | `src/app/admin/comments/page.tsx` | Admin, Moderator | Moderation queue (Pending, Spam, Flagged) |
| `/admin/revenue` | `src/app/admin/revenue/page.tsx` | Admin / Owner strictly | Revenue settings, actuals, audit trail |
| `/admin/people` | `src/app/admin/people/page.tsx` | Admin, Editor | People profiles management |
| `/admin/companies` | `src/app/admin/companies/page.tsx` | Admin, Editor | Partner & client company management |
| `/admin/members` | `src/app/admin/members/page.tsx` | Admin / Owner | Member list, role delegation, bans |
| `/admin/roles` | `src/app/admin/roles/page.tsx` | Admin / Owner | RBAC permission matrix |
| `/admin/settings` | `src/app/admin/settings/page.tsx` | Admin / Owner | Timezone, AI keys, metadata |
| `/admin/analytics` | `src/app/admin/analytics/page.tsx` | Admin, Editor | Privacy-safe engagement metrics |
| `/admin/audit-logs` | `src/app/admin/audit-logs/page.tsx` | Admin / Owner strictly | Immutable chronological audit trail |

---

## 3. Database Schema & RLS Security Model

### 3.1 Relational Schema
1. **`profiles`**: User accounts linking `auth.users.id`.
   - Fields: `id (uuid, PK)`, `display_name`, `avatar_url`, `role (enum: member, moderator, editor, admin)`, `email_verified_at`, `status (active, suspended)`, `created_at`.
   - Security: Email is NEVER stored or exposed in public profile fields.
2. **`episodes`**: Core daily content entity.
   - Fields: `id (uuid, PK)`, `day_number (int, unique)`, `title (text)`, `slug (text, unique)`, `instagram_url (text)`, `caption (text)`, `context_notes (text)`, `transcript_text (text)`, `summary (text)`, `takeaways (jsonb)`, `summary_status (enum: not_generated, processing, generated, failed, approved)`, `summary_source (text)`, `published_at (timestamptz)`, `status (enum: draft, pending_review, scheduled, published, archived, ai_failed)`, `comments_enabled (boolean)`, `created_by (uuid)`, `updated_at (timestamptz)`.
3. **`tags` & `episode_tags`**: Controlled content taxonomy.
   - 12 standard tags pre-seeded (Vision, Sales, Product, AI & Automation, etc.).
4. **`people` & `companies`** + `episode_people` & `episode_companies`:
   - Profiles for Dr. Ajay Kumar, team members, and enterprise partners with draft/public visibility.
5. **`comments`**: Community interaction.
   - Fields: `id (uuid, PK)`, `episode_id (uuid, FK)`, `author_profile_id (uuid, FK)`, `parent_comment_id (uuid, FK, nullable)`, `body (text)`, `status (enum: pending, approved, rejected, spam, removed)`, `created_at`, `moderated_by (uuid)`, `moderated_at`.
6. **`revenue_settings`**: Singleton table governing financial configuration.
   - Fields: `id (int, PK)`, `target_amount (numeric)`, `target_start (date)`, `target_end (date)`, `target_basis (enum: cumulative, financial_year)`, `revenue_definition (enum: recognised, invoiced, cash_collected)`, `gst_treatment (enum: included, excluded)`, `visibility (enum: public_detailed, public_summary, private)`, `notes (text)`, `updated_by`, `updated_at`.
7. **`revenue_months`**: Monthly actuals and targets.
   - Fields: `id (uuid, PK)`, `month_start (date, unique)`, `actual_amount (numeric)`, `target_amount (numeric)`, `note (text)`, `public_visibility (boolean)`, `updated_by`, `updated_at`.
8. **`revenue_milestones`**: Key checkpoints (e.g. ₹1Cr, ₹5Cr, ₹10Cr, ₹30Cr).
   - Fields: `id (uuid, PK)`, `title (text)`, `description (text)`, `milestone_date (date)`, `visibility (boolean)`, `sort_order (int)`.
9. **`audit_log`**: Immutable record of administrative operations.
   - Fields: `id (uuid, PK)`, `actor_id (uuid)`, `action (text)`, `entity_type (text)`, `entity_id (text)`, `diff (jsonb)`, `created_at (timestamptz)`.
10. **`ai_jobs`**: Telemetry for LLM requests.
    - Fields: `id (uuid, PK)`, `episode_id (uuid)`, `model (text)`, `source_types (text[])`, `status (text)`, `tokens_used (int)`, `cost_estimate (numeric)`, `created_at (timestamptz)`.
11. **`slug_redirects`**: Permanent URL redirects when an editor intentionally renames an episode slug.

### 3.2 Row Level Security (RLS) Policy Specifications
- **`episodes`**:
  - `SELECT`: Allowed for everyone if `status = 'published' AND published_at <= NOW()`.
  - `ALL`: Allowed for authenticated users with role `editor` or `admin`.
- **`comments`**:
  - `SELECT`: Allowed for everyone if `status = 'approved'`. Authenticated users can also view their own submitted comments (`author_profile_id = auth.uid()`).
  - `INSERT`: Allowed for authenticated users whose `profiles.email_verified_at IS NOT NULL`.
  - `UPDATE/DELETE`: Allowed for moderators and admins. Authors may edit only within 10 minutes of creation.
- **`revenue_settings` & `revenue_months`**:
  - `SELECT`: When `revenue_settings.visibility = 'public_detailed'`, anyone can read published monthly rows. When `public_summary`, only aggregate values are exposed via a secured stored procedure or server route. When `private`, RLS strictly denies public reads.
  - `ALL`: Allowed strictly for role `admin`.
- **`audit_log`**:
  - `SELECT`: Strictly restricted to role `admin`. Zero public access.

---

## 4. Integration Specifications

### 4.1 Instagram Video & Embed Engine
- **Validation:** Enforces HTTPS on `instagram.com` permalinks (`/p/[id]/`, `/reel/[id]/`). Strips tracking queries (`utm_*`, `igsh`).
- **Resilient Player:**
  - Injects `https://www.instagram.com/embed.js` script lazily and at most once per page.
  - Detects if Instagram script fails to load, iframe is blocked, or user has third-party cookie restrictions.
  - Automatically displays high-trust fallback container:
    - *"Watch this episode on Instagram"*
    - Verified external link with `rel="noopener noreferrer"`.
    - No broken layout, no white blank space.

### 4.2 AI Summary Integration
- **Server-Side API Route:** `/api/ai/summarize`. API keys remain exclusively server-side.
- **Provider Support:** Multi-provider architecture (Google Gemini, OpenAI, Anthropic, Groq).
- **Quality Safeguard (AC-06):** Verifies that source text (transcript, caption, notes) is at least 30 characters. Returns HTTP 400 with friendly feedback if empty.
- **Output Schema:**
  - Summary: 80–150 words factual overview in neutral editorial voice.
  - Takeaways: Array of 3–7 actionable bullets.
  - Suggested Tags: Up to 5 tags mapped to the taxonomy.
  - SEO Meta Description: 140–160 character description.
- **Draft Safeguard (AC-05):** Always saves as draft; never automatically transitions to `published`.

### 4.3 Revenue Calculation Engine
- All math is executed with numeric precision in `src/lib/revenue/calculator.ts`.
- Handles edge cases:
  - Total Target: ₹30,00,00,000 (₹30 Cr).
  - Target Progress Percentage: `(Current Actual / Target) * 100`.
  - Remaining: `Target - Current Actual`. If `Current Actual > Target`, formats as *"Target Exceeded (+₹X.XX Cr)"*.
  - Missing Months: Displayed with explicit badge *"Not entered"*—never falsified as ₹0 verified revenue.

---

## 5. Security & Boundary Protections
- **Subdomain Protection:** Explicit instructions ensuring zero mutation to `automationlabs.online` parent DNS records.
- **XSS & Injection Protection:** All user submissions (comments, episode fields) undergo rigorous HTML escaping and sanitization.
- **No Secret Leakage:** Strict server-side secret handling; Next.js bundle isolation verified with bundle scanning.
