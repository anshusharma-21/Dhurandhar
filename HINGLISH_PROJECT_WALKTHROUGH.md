# PROJECT DHURANDHAR — COMPLETE HINGLISH DEVELOPER WALKTHROUGH
**Namaste Dr. Ajay Kumar ji!**  
Yeh guide aapke liye likhi gayi hai taaki aap bina kisi confusion ke samajh sakein ki **Project Dhurandhar** ka poora code kaise kaam karta hai, har ek file ka kya role hai, aur aap is website ko akele independently kaise run, test aur scale kar sakte hain.

---

## 1. Project Ka Big Picture (Architecture Samjhein)

Yeh website koi simple WordPress blog ya static landing page nahi hai. Yeh ek modern **Full-Stack Next.js 14 Web Application** hai jo 3 main layers par bani hai:

1. **Frontend (User Interface):** React + Tailwind CSS (Jo users aur admin ko dikhta hai).
2. **Backend (Server & APIs):** Next.js App Router Server Components & API Route Handlers (Jo logic process karta hai, AI call karta hai, aur math calculate karta hai).
3. **Database (Data Storage):** PostgreSQL (Supabase) with Row Level Security (RLS) (Jahan saare episodes, comments, revenue records aur audit logs safely store hote hain).

```
[User ka Browser] 
       ↕ (HTTPS Requests)
[Next.js Server: Node.js / Vercel]
   ├── Public Pages (SSR - Google ke liye indexable)
   ├── Admin Dashboard (/admin)
   ├── AI Engine (/api/ai/summarize - Gemini / Local Synthesizer)
   └── Revenue Engine (Math calculations)
       ↕ (Service Role / RLS)
[Supabase PostgreSQL Database] (15 Tables)
```

---

## 2. Folder Structure Aur Important Files

Aapka poora codebase clean aur organized hai:

```
30_D/
├── src/
│   ├── app/                                 <- Next.js App Router (Routing Engine)
│   │   ├── (public)/                        <- Publicly accessible website
│   │   │   ├── page.tsx                     <- Homepage (9-step sequence)
│   │   │   ├── episodes/                    <- Episodes Archive (/episodes)
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx          <- Individual Episode Detail (/episodes/day-001...)
│   │   │   ├── revenue/page.tsx             <- Detailed Revenue Dashboard (/revenue)
│   │   │   ├── about/page.tsx               <- Founder journey & mission (/about)
│   │   │   ├── community-guidelines/page.tsx<- Comment rules
│   │   │   ├── privacy/page.tsx             <- Privacy policy
│   │   │   ├── terms/page.tsx               <- Terms & revenue disclaimer
│   │   │   └── people/page.tsx              <- People & partners directory
│   │   ├── (auth)/                          <- Authentication pages
│   │   │   ├── sign-in/page.tsx             <- Login screen
│   │   │   └── register/page.tsx            <- Registration screen
│   │   ├── admin/                           <- Secure Owner / Admin Console
│   │   │   ├── page.tsx                     <- Admin Dashboard Overview
│   │   │   ├── episodes/                    <- Episode catalog
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx             <- Add New Episode + AI Studio
│   │   │   │   └── [id]/page.tsx            <- Edit existing episode
│   │   │   ├── comments/page.tsx            <- Comments Moderation Queue
│   │   │   ├── revenue/page.tsx             <- Monthly Actuals & Settings Manager
│   │   │   ├── ai-summaries/page.tsx        <- AI Jobs Telemetry & Logs
│   │   │   ├── members/page.tsx             <- User list & role delegation
│   │   │   ├── roles/page.tsx               <- RBAC Permission matrix
│   │   │   ├── settings/page.tsx            <- System timezone & provider settings
│   │   │   ├── analytics/page.tsx           <- Privacy-preserving metrics
│   │   │   └── audit-logs/page.tsx          <- Immutable admin action log
│   │   ├── api/                             <- Backend Server API Routes
│   │   │   ├── episodes/route.ts            <- Episode search & creation API
│   │   │   ├── ai/summarize/route.ts        <- Server-side AI generation endpoint
│   │   │   ├── comments/route.ts            <- Comment submit & fetch API
│   │   │   ├── comments/[id]/moderate/route.ts <- Moderate action endpoint
│   │   │   └── revenue/route.ts             <- Revenue calculations & updates
│   │   │   └── revenue/export/route.ts      <- CSV download endpoint
│   │   ├── sitemap.ts                       <- Dynamic Google XML Sitemap
│   │   ├── robots.ts                        <- Search engine crawler directives
│   │   ├── feed.xml/route.ts                <- RSS Feed for episodes
│   │   └── layout.tsx                       <- Global root layout with SEO metadata
│   ├── components/                          <- Reusable UI Components
│   │   ├── layout/                          <- Navbar.tsx & Footer.tsx
│   │   ├── home/                            <- Hero, Snapshot, Feed, Milestones
│   │   ├── episode/                         <- InstagramEmbed, Card, CommentsSection
│   │   ├── revenue/                         <- RevenueDashboardView (Recharts)
│   │   └── admin/                           <- EpisodeForm, AISummaryEditor, Sidebar
│   └── lib/                                 <- Core Business Logic & Helpers
│       ├── types/                           <- TypeScript Data Models
│       ├── utils/                           <- formatters.ts, instagram.ts
│       ├── security/                        <- sanitize.ts (XSS Protection)
│       ├── revenue/                         <- calculator.ts (Mathematical engine)
│       ├── ai/                              <- service.ts (AI multi-provider engine)
│       ├── db/                              <- repository.ts (Database access layer)
│       └── supabase/                        <- client.ts & server.ts
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql           <- 15 Database Tables & RLS Policies
│   └── seed.sql                             <- Initial 12 tags & starting roadmap
└── tests/
    └── acceptance-suite.ts                  <- Automated test suite for AC-01 to AC-27
```

---

## 3. Server Par Kya Chalta Hai Aur Browser Par Kya?

Next.js App Router ki sabse badi power ye hai ki kaunsi cheez kahan execute hoti hai:

1. **Server Components (`async function Page()`)**:
   - Yeh code **sirf server par chalta hai**.
   - Jaise `src/app/(public)/page.tsx` ya `src/app/(public)/episodes/[slug]/page.tsx`.
   - Fayda: Google aur web crawlers ko poora ready HTML milta hai (SEO Best Practice, AC-27). Secret API keys browser me kabhi leak nahi hoti (AC-26).
2. **Client Components (`"use client"` at the top)**:
   - Yeh code **user ke browser me run hota hai**.
   - Jaise `InstagramEmbed.tsx`, `CommentsSection.tsx`, `EpisodeArchiveClient.tsx`, `RevenueDashboardView.tsx`.
   - Jahan user click karta hai, type karta hai ya dynamic charts render hote hain, wahan client components use hote hain.

---

## 4. Database Tables Aur RLS Security Kaise Kaam Karti Hai?

Supabase PostgreSQL me humne 15 tables banaye hain (`supabase/migrations/001_initial_schema.sql`):

| Table Name | Kya Store Karta Hai? | Public Access Rule (RLS) |
| :--- | :--- | :--- |
| `profiles` | Users ki display name, avatar, aur role (member/admin). | Public sirf display name dekh sakti hai. **Email address kabhi public response me nahi aati (AC-17).** |
| `episodes` | Day number, title, slug, Instagram URL, summary, takeaways, status. | Public sirf `status = 'published'` wale records dekh sakti hai. Drafts sirf Admin ko dikhte hain. |
| `tags` | 12 core tags jaise Vision, Sales, Delivery, AI. | Sabhi log padh sakte hain. |
| `comments` | User comments episode par. | Public sirf `status = 'approved'` comments dekh sakti hai. |
| `revenue_settings` | Target amount (₹30Cr), period, definition, GST, visibility. | Agar visibility `'private'` hai, to public ko kuch nahi dikhta. |
| `revenue_months` | Har month ka Target amount aur verified Actual amount. | Publicly tabhi dikhta hai jab visibility `'public_detailed'` ho. |
| `revenue_milestones`| ₹1Cr, ₹5Cr, ₹15Cr, ₹30Cr milestones. | Public timeline par dikhta hai. |
| `audit_log` | Kis admin ne kab kaunsi financial value change ki. | **Strictly Admin Only**. Public ke liye completely invisible. |

---

## 5. Daily Episode Publish Karne Ka Poora Data Flow

Jab aap naya vlog banate hain, to steps ye hote hain:

```
1. Aap /admin/episodes/new open karte hain.
2. Form me "Day Number" (e.g. 3) aur "Title" daalte hain.
3. Instagram URL paste karte hain -> instagram.ts URL ko validate karta hai aur tracking query (utm_*) ko strip karta hai.
4. "Transcript / Spoken Text" box me jo aapne vlog me bola wo paste karte hain.
5. "Generate AI Summary" button click karte hain:
   -> /api/ai/summarize endpoint trigger hota hai.
   -> AI service check karti hai ki source text 25 chars se zyada hai ya nahi (AC-06 Guard).
   -> Factual 80-150 word summary aur 3-5 takeaways generate hote hain.
6. Aap AI draft ko review karte hain aur apni pasand ke hisab se edit karte hain.
7. "Publish Now" click karte hain:
   -> Status ban jata hai 'published' aur published_at set ho jata hai.
   -> Ye turant Homepage aur Archive par top par dikhne lagta hai (AC-02).
```

---

## 6. AI Summary Workflow (Zero Hallucination Guard)

Project Dhurandhar me ek strict rule hai: **AI ko mann-ghadant (hallucinated) batein bolne ki permission nahi hai.**
- Agar aap koi transcript ya notes nahi denge aur sirf video URL daalenge, to AI mana kar dega: *"Insufficient source input: A video URL alone is not a dependable transcript..."* (AC-06).
- AI summaries hamesha draft ke roop me aati hain; **yeh kabhi automatically publish nahi hoti** bina aapke approval ke (AC-05).
- Agar aapne pehle se kuch summary likhi hui hai, to regenerate karne par system aapse confirm karega taaki aapka kaam erase na ho (AC-07).

---

## 7. Comments Aur Moderation Queue Flow

1. **Sign-in Requirement (AC-09):** Koi bhi anonymous stranger comment nahi kar sakta. Unhe login ya register karna padega.
2. **Email Verification (AC-10):** Jab tak email verify nahi hoti, comment submit nahi hoga.
3. **First-Time Moderation (AC-11):** Jab koi naya user pehli baar comment karega, to uska comment turant public nahi hoga. Wo `/admin/comments` ki queue me jayega. Jab aap ya aapka moderator use **Approve** karenge, tabhi wo public episode par dikhega!
4. **XSS Protection (AC-12):** Agar koi hacker `<script>` ya malicious code likhega, to hamara `sanitize.ts` use turant strip kar dega.

---

## 8. Revenue Dashboard Ka Math Kaise Kaam Karta Hai?

Financial calculations `src/lib/revenue/calculator.ts` me authoritatively calculate hoti hain:
- **Target:** ₹30,00,00,000 (₹30.00 Cr).
- **Progress:** Saare verified months ka sum (e.g. Apr to Sep).
- **Remaining Gap:** `Target - Total Actual`. Agar actual target se zyada ho jaye, to negative number nahi dikhata, balki likhta hai *"Target Exceeded"* (AC-14).
- **Missing Month:** Agar kisi month ka data enter nahi kiya gaya, to use zero nahi maante, balki *"Not entered"* badge dikhate hain.
- **Privacy Modes (AC-15):**
  - `public_detailed`: Poora chart, monthly table aur milestones public ko dikhte hain.
  - `public_summary`: Sirf total target aur progress % dikhta hai, monthly table hide ho jati hai.
  - `private`: Public dashboard par sab hide ho jata hai aur polite notice dikhta hai.

---

## 9. Local Computer Par Run Aur Test Kaise Karein?

Apne laptop par terminal (PowerShell) me:

1. **Development Server Start Karein:**
   ```bash
   npm run dev
   ```
   Browser me `http://localhost:3000` open karein.
2. **All 27 Acceptance Tests Run Karein:**
   ```bash
   npm test
   ```
   Yeh command `tests/acceptance-suite.ts` ko execute karegi aur sabhi 27 ACs ko 100% check karegi.
3. **Production Build Validate Karein:**
   ```bash
   npm run build
   ```

---

## 10. Agar Koi Error Aaye To Kaise Debug Karein?

- **"Module not found":** `package.json` me check karein aur `npm install` chalayein.
- **"Database connection issue":** Agar Supabase credentials nahi hain, to repository automatically **built-in safe mock store** use karti hai, isliye code kabhi crash nahi hoga.
- **"Instagram Embed blank dikh raha hai":** Ad-blockers ya browser privacy settings Instagram scripts ko block kar sakti hain. Hamara player automatically fallback badge dikhata hai: *"Open on Instagram"*, isliye layout kabhi nahi tootta.

---

## 11. Beginner Ke Liye: Kaunsi Files Sabse Pehle Dekhein?

Agar aap code samajhna shuru kar rahe hain, to is order me files open kijiye:
1. `src/lib/types/episode.ts` - Samajhiye episode ka structure kaisa hai.
2. `src/app/(public)/page.tsx` - Dekhiye homepage components kaise assemble hote hain.
3. `src/components/admin/EpisodeForm.tsx` - Dekhiye admin kaise episode publish karta hai.
4. `src/lib/revenue/calculator.ts` - Dekhiye ₹30Cr ka math kaise compute hota hai.
5. `tests/acceptance-suite.ts` - Dekhiye test assertions kaise likhe gaye hain.
