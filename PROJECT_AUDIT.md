# PROJECT DHURANDHAR — AUDIT & REPOSITORY BASELINE
**Document Version:** 1.0.0  
**Date:** 11 October 2026  
**Project:** Project Dhurandhar — Road to ₹30CR Revenue  
**Owner / Entity:** Dr. Ajay Kumar & AI Automation Labs LLP  
**Production Hostname:** `https://projectdhurandhar.automationlabs.online`  
**Reference Specification:** `Project_Dhurandhar_Road_to_30CR_Custom_Website_Developer_Specification.pdf` (Version 2.0, 10 October 2026)

---

## 1. Executive Summary & Repository State

An exhaustive audit of the workspace `c:\Users\Navgurukul\Desktop\JOB PROJECTS\30_D` was conducted prior to making any code modifications.

| Item | Inspected State | Finding / Decision |
| :--- | :--- | :--- |
| **Workspace Origin** | Single file present: `Project_Dhurandhar_Road_to_30CR_Custom_Website_Developer_Specification.pdf` (563,974 bytes) | Greenfield codebase initialization required. No legacy code or deprecated dependencies exist in this directory. |
| **Version Control (Git)** | Not initialized prior to start (`fatal: not a git repository`) | Git repository will be initialized with branch `main`, comprehensive `.gitignore`, versioned migrations, and audit trails. |
| **Runtime Environment** | Node.js `v24.15.0`, npm `11.12.1`, Git `2.52.0.windows.1` on Windows x64 | Supported modern Node.js runtime. Compatible with Next.js 14 App Router, React 18/19, and Supabase JS SDK. |
| **Parent Domain Impact** | Parent domain: `automationlabs.online` hosting company site | **Strict Safety Rule:** Zero modifications to root `@`, `www`, MX, SPF, DKIM, DMARC or unrelated TXT DNS records. Application scoped strictly to `projectdhurandhar.automationlabs.online`. |
| **Architecture Decision** | Specification expressly forbids WordPress or off-the-shelf CMS | Custom full-stack Next.js App Router (TypeScript), Tailwind CSS design tokens, Supabase PostgreSQL with RLS, Lucide icons, Recharts, and server-side AI abstraction. |

---

## 2. Requirement Extraction & Completeness Analysis

The 26-page specification defines 17 mandatory sections, 27 acceptance criteria (AC-01 through AC-27), role-based access control, secure revenue accounting with 3 visibility levels, and human-in-the-loop AI summary workflows.

### 2.1 Core Subsystems Audited

1. **Information Architecture & Public Discovery:**
   - Routes: `/`, `/episodes/`, `/episodes/[slug]/`, `/revenue/`, `/about/`, `/community-guidelines/`, `/privacy/`, `/terms/`, `/sign-in/`, `/register/`, plus optional `/people/` and `/people/[slug]/`.
   - Header with bold brand identity, mobile-friendly navigation, "Watch Latest" CTA.
   - Server-rendered HTML for search-engine discoverability (AC-27).
   - Dedicated XML sitemap, canonical links, robots rules, and Open Graph cards.

2. **Daily Episode Engine & Instagram Integration:**
   - Strict Day Number integer indexing (`Day 1: Getting Started`). Gaps allowed; duplicate published day numbers strictly forbidden.
   - Manual Instagram URL entry with strict validation (`/p/`, `/reel/` on `instagram.com`), sanitized query parameters.
   - Official Instagram embed script deferral (injected at most once) and resilient fallback card ("Open on Instagram") for age-gated, private, or blocked embeds (AC-03, AC-04).
   - Homepage optimization: Lightweight preview cards only; never load every iframe embed on the homepage (AC-20).

3. **Human-in-the-Loop AI Summary Workflow:**
   - Input sources: Transcript / spoken text (preferred), Instagram caption, admin context notes.
   - URL-only safeguard: If no transcript or notes are provided, system refuses to hallucinate and displays a clear "insufficient source material" alert (AC-06).
   - Server-side AI generation: Output includes 80–150 word factual summary, 3–7 key takeaways, suggested tags, and SEO meta description.
   - Safe regeneration: Confirmation required if existing edited summary exists, preventing accidental erasure (AC-07).
   - Strict rule: AI outputs save as draft; never auto-publish (AC-05).

4. **Community Accounts & Moderation:**
   - Authentication via Supabase Auth.
   - Only signed-in, email-verified users can post comments (AC-09, AC-10).
   - First-time moderation rule: New users' first comments enter moderation queue before public display (AC-11).
   - Input sanitization & escaping to eliminate XSS/HTML injections (AC-12).
   - Member privacy: Display names only; emails and private auth details never exposed in page source or public APIs (AC-17).

5. **Owner-Managed Revenue Engine:**
   - Authoritative database math: Computed from database numbers, never client inputs.
   - Settings: Target amount (default ₹30,00,00,000 / ₹30 Cr), period (cumulative vs financial year), definition (recognised, invoiced, cash collected), GST treatment (included vs excluded).
   - Visibility states:
     - `public_detailed`: Full monthly target vs actual, charts, milestones, variance.
     - `public_summary`: Aggregated target, progress, remaining amount only.
     - `private`: Public page and APIs return zero financial figures (AC-15).
   - Edge cases tested: Zero revenue, below target, exactly at target, above target ("Target exceeded"), missing months ("Not entered") (AC-14).
   - Tamper-evident audit logs and CSV export.

6. **Admin Workspace & RBAC:**
   - Branded `/admin` suite: Dashboard, Episode Management, AI Summaries, Comments Queue, Revenue Dashboard, People/Companies, Member Roles, Site Settings, Audit Logs.
   - Strict server-side authorization: Roles (`administrator`, `editor`, `moderator`, `member`, `visitor`).
   - RLS policies on all database tables (AC-25).

---

## 3. Risk Identification & Mitigation Strategy

| Risk | Impact | Pre-Emptive Mitigation |
| :--- | :--- | :--- |
| **Missing Third-Party Credentials during development** | Build failures or blank screens if Supabase/AI/Email keys are missing | Implement robust provider abstraction with resilient offline/demo fallback mode for local development while ensuring strict production validation. |
| **Instagram Embed Blocking / CORS / CSP** | Blank spaces on episode pages | Resilient embed container with timeout detector and beautiful editorial fallback badge linking directly to the Instagram Reel. |
| **AI Hallucinations on Video URLs** | Inaccurate promises or fabricated business metrics | Enforce hard server validation requiring transcript/caption/notes input before calling LLM. |
| **Accidental Data Leak in Public APIs** | Privacy breach of emails, private revenue, drafts | Database RLS + server-side Next.js route handler sanitization stripping sensitive columns. |

---

## 4. Audit Sign-off

The repository is clean, the specification is fully digested, and the project is ready for structured phased implementation starting with requirement traceability and foundational design tokens.
