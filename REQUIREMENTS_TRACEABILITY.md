# PROJECT DHURANDHAR — REQUIREMENTS TRACEABILITY MATRIX (RTM)
**Document Version:** 1.0.0  
**Date:** 11 October 2026  
**Reference Document:** `Project_Dhurandhar_Road_to_30CR_Custom_Website_Developer_Specification.pdf`  
**Target Hostname:** `https://projectdhurandhar.automationlabs.online`

---

## 1. Traceability: Specification Sections (1 to 17)

| Section # | Specification Section | Key Requirements | Planned Implementation Location | Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sec 1** | Product Brief & Scope | Public journal, founder journey Dr. Ajay Kumar & AI Automation Labs LLP, mobile-first, manual IG entry, no scraping. | `src/app/(public)/page.tsx`, `src/app/(public)/about/page.tsx` | UI inspection, code audit | Planned |
| **Sec 2** | Information Architecture & URLs | Route definitions: `/`, `/episodes`, `/episodes/[slug]`, `/revenue`, `/about`, `/community-guidelines`, `/privacy`, `/terms`, `/sign-in`, `/register`, `/admin/*`. Subdomain isolation. | `src/app/*` (Next.js App Router hierarchy) | Route resolution & HTTP tests | Planned |
| **Sec 3** | Visual Direction & Homepage | Navy/charcoal base, warm white content, teal/electric blue actions, gold accent. 9-section ordered homepage flow. | `tailwind.config.ts`, `src/app/globals.css`, `src/components/home/*` | Visual verification, responsive audit | Planned |
| **Sec 4** | Episodes Model, Archive & Detail | Day N format, unique integer day_number, slug redirect support, Asia/Kolkata timezone, filters, pagination, related episodes. | `src/lib/types/episode.ts`, `src/app/(public)/episodes/*` | Archive filter tests, detail rendering | Planned |
| **Sec 5** | Instagram URL Entry & Embedding | Validate `instagram.com` (`/p/`, `/reel/`), clean tracking params, official embed deferral, fallback badge, error states. | `src/components/episode/InstagramEmbed.tsx`, `src/lib/utils/instagram.ts` | Embed test with valid/invalid URLs | Planned |
| **Sec 6** | AI-Generated Summary Workflow | Server-side LLM call, transcript/caption/notes input, 80-150 words summary, 3-7 takeaways, insufficient input guard, safe regeneration. | `src/app/api/ai/summarize/route.ts`, `src/components/admin/AISummaryEditor.tsx` | AI prompt test, insufficient input test | Planned |
| **Sec 7** | Search & Discovery Taxonomy | Postgres search across title, summary, tags, transcript. Managed taxonomy (12 core tags). XML sitemap, canonicals. | `src/lib/db/search.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` | Search query tests, sitemap XML validation | Planned |
| **Sec 8** | Accounts & Comments | Supabase Auth, email verification required to comment, first-time user moderation queue, XSS escaping, member display name only. | `src/components/episode/CommentsSection.tsx`, `src/app/api/comments/route.ts` | Auth flow test, moderation flow test, XSS test | Planned |
| **Sec 9** | Detailed Revenue Dashboard | ₹30Cr target, cumulative/FY, recognised/invoiced/cash, GST treatment, monthly actuals/targets, 3 visibility modes (detailed, summary, private). | `src/lib/revenue/calculator.ts`, `src/app/(public)/revenue/page.tsx`, `src/components/admin/RevenueManager.tsx` | Mathematical unit tests, visibility privacy test | Planned |
| **Sec 10** | People & Companies (Optional/Ready) | Lightweight profile tables, linked published episodes, draft/public visibility. | `src/app/(public)/people/*`, `src/lib/types/people.ts` | Profile route test, link audit | Planned |
| **Sec 11** | Admin Panel & Daily Operations | Branded `/admin` dashboard, publishing flow, autosave warning, duplicate as draft, version history, field-level errors. | `src/app/admin/*`, `src/components/admin/*` | Admin functional flow test | Planned |
| **Sec 12** | Architecture & Database Schema | Next.js App Router, Supabase Postgres, RLS policies, 13 versioned tables, migration SQL scripts, indexes. | `supabase/migrations/*`, `src/lib/supabase/*` | Schema migration check, RLS query test | Planned |
| **Sec 13** | Security, Privacy & Compliance | HTTPS, parameterised queries, rate limiting, no secrets in bundles, backup runbook, privacy & terms disclosures. | `src/middleware.ts`, `src/lib/security/*`, `src/app/(public)/privacy/page.tsx` | Security audit, bundle scan | Planned |
| **Sec 14** | SEO, Analytics & Measurement | Canonical tags, Open Graph, Article JSON-LD structured data, privacy-respecting analytics events, Search Console guide. | `src/components/seo/*`, `src/lib/analytics/events.ts` | Lighthouse SEO audit, structured data linter | Planned |
| **Sec 15** | Deployment & Release Plan | Subdomain deployment guide, DNS preservation rules for `automationlabs.online`, Vercel setup, rollback procedures. | `DEPLOYMENT_RUNBOOK.md`, `README.md` | DNS checklist verification | Planned |
| **Sec 16** | Acceptance Criteria AC-01 to AC-27 | Explicit automated and manual verification of all 27 acceptance criteria. | `tests/*`, `TEST_RESULTS.md` | Test execution suite | Planned |
| **Sec 17** | Handover Checklist & Config | Owner handover checklist, credential inventory, non-developer operational guide. | `OWNER_CONFIGURATION_CHECKLIST.md`, `HINGLISH_PROJECT_WALKTHROUGH.md` | Owner walkthrough verification | Planned |

---

## 2. Traceability: Acceptance Criteria Matrix (AC-01 to AC-27)

| Criterion ID | Priority | Test Description | Expected Result | Implementation Target | Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AC-01** | Must | Create Day 1 "Getting Started" with public Instagram URL | Saves as draft, shows title/slug, validates URL, hidden from public until published | `src/app/admin/episodes/new/page.tsx`, `src/app/api/episodes/route.ts` | Automated test `test-ac-01-draft-creation` | Planned |
| **AC-02** | Must | Publish Day 2 after Day 1 | Day 2 appears above Day 1 on homepage & archive; Day 1 remains at permanent URL | `src/app/(public)/page.tsx`, `src/app/(public)/episodes/page.tsx` | Automated test `test-ac-02-latest-first-order` | Planned |
| **AC-03** | Must | Open episode with valid public Instagram URL | Embed displays on supported browsers; fallback "Open on Instagram" link present | `src/components/episode/InstagramEmbed.tsx` | Automated component test & browser check | Planned |
| **AC-04** | Must | Use private, removed or invalid Instagram link | Friendly fallback state; invalid URL rejected before publish; no broken layout | `src/lib/utils/instagram.ts` | Test `test-ac-04-instagram-fallback` | Planned |
| **AC-05** | Must | Generate summary from supplied transcript | AI creates editable draft and takeaways; source type recorded; no auto-publish | `src/app/api/ai/summarize/route.ts` | Test `test-ac-05-ai-summary-transcript` | Planned |
| **AC-06** | Must | Attempt summary with URL only (no text/video source) | UI explains insufficient source input; no invented transcript or summary produced | `src/app/api/ai/summarize/route.ts` | Test `test-ac-06-ai-insufficient-input` | Planned |
| **AC-07** | Must | Regenerate summary after editing | System warns before replacing edited content and preserves existing copy until confirmed | `src/components/admin/AISummaryEditor.tsx` | Interactive UI test `test-ac-07-regeneration-warning` | Planned |
| **AC-08** | Must | Search "Day 2", title phrase, and tag | Relevant published episodes appear; drafts and private entries strictly omitted | `src/app/api/episodes/search/route.ts` | Test `test-ac-08-search-draft-privacy` | Planned |
| **AC-09** | Must | Open comment form while signed out | User prompted to sign in/register; cannot submit anonymously | `src/components/episode/CommentsSection.tsx` | Test `test-ac-09-comments-auth-gate` | Planned |
| **AC-10** | Must | Register new email and attempt to comment before verification | Posting blocked until email verified; verification email flow simulated/delivered | `src/app/api/comments/route.ts` | Test `test-ac-10-email-verification-gate` | Planned |
| **AC-11** | Must | Submit first comment from verified new user | Enters moderation queue; does not appear publicly until approved | `src/app/api/comments/route.ts`, `src/app/admin/comments/page.tsx` | Test `test-ac-11-first-comment-moderation` | Planned |
| **AC-12** | Must | Attempt XSS/HTML/script injection in comments and title fields | Input sanitised/escaped; no script executes; stored content remains safe | `src/lib/security/sanitize.ts` | Test `test-ac-12-xss-prevention` | Planned |
| **AC-13** | Must | Enter monthly revenue actual/target and save | Correct values appear in admin and public dashboard according to visibility setting | `src/app/api/revenue/route.ts` | Test `test-ac-13-revenue-entry-save` | Planned |
| **AC-14** | Must | Test dashboard at 0, below target, exactly target, above target, and missing month | Progress/gap/charts use documented definitions; missing data labeled "Not entered" | `src/lib/revenue/calculator.ts` | Test `test-ac-14-revenue-calculations` | Planned |
| **AC-15** | Must | Switch revenue dashboard to private | Public page and public API no longer expose figures or private monthly rows | `src/app/api/revenue/route.ts`, `src/app/(public)/revenue/page.tsx` | Test `test-ac-15-revenue-privacy-mode` | Planned |
| **AC-16** | Must | View on small mobile width (375px) and desktop (1440px) | No horizontal overflow; controls tappable; embed and charts scale cleanly | CSS layout + responsive testing | Responsive viewport automated audit | Planned |
| **AC-17** | Must | Inspect page source and network responses | No API secrets, passwords, private emails, unpublished content or private revenue exposed | Next.js SSR payload audit | Secret leakage scan | Planned |
| **AC-18** | Must | Open sitemap and published episode metadata | Episode indexable, canonical correct, title/desc present, staging marked noindex | `src/app/sitemap.ts`, metadata handlers | Sitemap & robots test | Planned |
| **AC-19** | Must | Supabase database backup/restore to isolated staging | Schema, migrations, seed scripts, RLS policies fully recoverable | `supabase/migrations/001_initial_schema.sql` | Migration reproducibility test | Planned |
| **AC-20** | Should | Load homepage with many episodes | Uses lightweight preview cards; does not load every Instagram iframe at once | `src/components/episode/EpisodeCard.tsx` | Homepage DOM iframe count test | Planned |
| **AC-21** | Should | Use keyboard only | Navigation, form controls, comments, dialogs reachable with visible focus rings | Accessible component library | Keyboard navigation audit | Planned |
| **AC-22** | Should | Edit published episode title without intending slug change | Title updates safely; URL permalink remains stable unless admin edits slug | `src/app/api/episodes/[id]/route.ts` | Permalinks regression test | Planned |
| **AC-23** | Should | Delete or deactivate a user | Sign-in disabled; retention policy followed; comment handling explicit | `src/app/admin/members/page.tsx` | User deactivation test | Planned |
| **AC-24** | Must | Deploy production hostname and inspect DNS | Subdomain configuration runbook preserves parent domain and mail DNS | `DEPLOYMENT_RUNBOOK.md` | DNS record validation check | Planned |
| **AC-25** | Must | Call public endpoints as anonymous and as regular member | RLS & server checks prevent unauthorized access to drafts, settings, audit logs | API authorization test suite | Planned |
| **AC-26** | Must | Inspect repository and production client bundle | Zero service-role keys, database secrets, or `.env` secrets present in client JS | Next.js bundle analyzer & secret scan | Planned |
| **AC-27** | Must | Open published episode without client JavaScript / inspect HTML | Title, summary, canonical metadata, and crawlable text are server-rendered | SSR HTML curl/render test | Planned |

---

## 3. Sign-off & Maintenance Rule

Any change to code or schema must maintain traceability against this document. Every acceptance criterion must be backed by an executed verification routine before final delivery.
