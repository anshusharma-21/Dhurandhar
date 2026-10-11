# PROJECT DHURANDHAR — DESIGN SYSTEM & VISUAL SPECIFICATION
**Brand Identity:** Project Dhurandhar — Road to ₹30CR Revenue  
**Owner:** Dr. Ajay Kumar & AI Automation Labs LLP  
**Tone & Personality:** Candid, ambitious, transparent, founder-led, credible, documentary-grade.  

---

## 1. Design Principles & Anti-Patterns

### Core Principles
1. **Editorial Credibility:** Look like a high-end financial & documentary publication (e.g., Bloomberg/Stripe Press/Financial Times), not a disposable SaaS startup template.
2. **True Numbers & No Fake Data:** Highlight transparent calculations, clear disclaimers, and honest reporting. Never use placeholder stats or fake social proof.
3. **Content Hierarchy First:** The episode number, title, date, and takeaways are the heroes. Avoid gratuitous animations that delay reading.
4. **Performance & Data Economy:** Defer heavy video embeds; use lightweight poster cards in archives and feeds.
5. **Universal Accessibility (WCAG 2.1 AA/AAA):** High contrast typography, explicit visible focus indicators, and strict keyboard operability.

### Anti-Patterns Explicitly Prohibited
- ❌ No generic purple/indigo AI gradients or decorative cosmic glows.
- ❌ No cookie-cutter rounded card repetition across every section.
- ❌ No decorative charts with fake numbers.
- ❌ No stock founder photos or fabricated quotes.
- ❌ No auto-playing media or heavy iframe waterfalls on the homepage.

---

## 2. Color Palette & Semantic Design Tokens

### Foundational Palette
```css
:root {
  /* Deep Navy / Charcoal Foundation */
  --bg-primary: #0a0e17;        /* Ultra-deep obsidian navy */
  --bg-secondary: #111827;      /* Rich dark slate for cards & panels */
  --bg-tertiary: #1f2937;       /* Border / separator / hover backdrop */
  --bg-elevated: #1e293b;       /* Elevated dialogs, tooltips & modals */

  /* Content Surfaces (Light Editorial Blocks) */
  --surface-warm-white: #f8fafc; /* Editorial reading card background */
  --surface-warm-muted: #f1f5f9; /* Secondary reading background */

  /* Text & Typography */
  --text-primary: #f8fafc;      /* Crisp white for dark mode headings/body */
  --text-secondary: #94a3b8;    /* Muted slate for metadata and secondary text */
  --text-muted: #64748b;        /* Subtle slate for timestamps, tags, disclaimers */
  --text-dark-primary: #0f172a; /* Deep navy text for light surface cards */
  --text-dark-secondary: #334155;/* Readable body text for light surfaces */

  /* Brand Accents */
  --brand-cyan: #06b6d4;        /* Electric cyan action & status */
  --brand-sky: #0ea5e9;         /* Vibrant blue for links & focus rings */
  --brand-sky-hover: #0284c7;   /* Interactive hover state */
  --brand-gold: #f59e0b;        /* Restrained gold for ₹30Cr milestones */
  --brand-gold-dark: #d97706;   /* Deep gold for borders & pill accents */

  /* Semantic Feedback */
  --success: #10b981;           /* Emerald green for approved / verified */
  --warning: #f59e0b;           /* Amber for pending review / draft */
  --danger: #ef4444;            /* Red for rejected / delete / error */
  --info: #3b82f6;              /* Blue for system notices */
}
```

---

## 3. Typography Scale & Hierarchy

We employ modern sans-serif typography (Plus Jakarta Sans / Inter / system font fallback) with precise editorial line-heights:

| Token | Size / Line-Height | Weight | Application |
| :--- | :--- | :--- | :--- |
| `display-2xl` | 3.5rem (56px) / 1.1 | Bold (700) | Homepage Hero Display Heading |
| `display-xl` | 2.5rem (40px) / 1.15 | Bold (700) | Page Headers, Revenue Target Display |
| `display-lg` | 1.875rem (30px) / 1.2 | SemiBold (600) | Section Headers, Episode Detail Title |
| `display-md` | 1.25rem (20px) / 1.3 | SemiBold (600) | Card Headers, Milestone Labels |
| `body-lg` | 1.125rem (18px) / 1.6 | Regular (400) | Lead paragraphs, Episode Summary intro |
| `body-md` | 1.0rem (16px) / 1.6 | Regular (400) | Standard reading text (Min 16px on mobile) |
| `body-sm` | 0.875rem (14px) / 1.5 | Medium (500) | Metadata, tag labels, table cells |
| `body-xs` | 0.75rem (12px) / 1.4 | Medium (500) | Badges, footnotes, legal disclaimers |

---

## 4. Layout & Grid Architecture

- **Max Content Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1280px standard, responsive).
- **Editorial Reading Container:** `max-w-4xl mx-auto px-4` (896px for optimal line length: 65–75 characters per line).
- **Split Views:** 65% main editorial column + 35% sticky revenue/milestone progress sidebar on desktop.
- **Mobile First:** Single clean column layout on viewport `< 768px`. Touch targets strictly >= 44x44px.

---

## 5. UI Component Specifications

### 5.1 Episode Preview Card (Archive & Feed)
- **Top Badge:** High-contrast `Day N` badge in gold/navy pill.
- **Title:** Exact title as entered by editor.
- **Metadata Line:** Published date (`Asia/Kolkata` formatted, e.g. `11 Oct 2026`) • Comment count • Reading time.
- **Summary Excerpt:** 2–3 line clamped excerpt.
- **Action Link:** "Read summary & takeaways →" with clear hover arrow translation.
- **Performance Rule:** Renders clean thumbnail / poster or svg graphic; does NOT embed the heavy Instagram iframe.

### 5.2 Episode Detail View
- **Breadcrumb:** `Home > Episodes > Day N`.
- **Hero Title & Metadata:** Full title, date, author tag, topic tags.
- **Video Embed:** Constrained 16:9 or vertical 9:16 Instagram container with "Open on Instagram" fallback button.
- **AI Summary Block:** High-contrast editorial card labeled *"Episode Summary (AI-assisted, Human-approved)"*.
- **Takeaways List:** 3–7 bullet points with custom styled check/bullet icons.
- **Collapsed Transcript / Notes:** Accordion toggle for raw transcript text.
- **Discussion Section:** Sign-in gate, comment box, approved comment stream.

### 5.3 Revenue Progress Meter & Dashboard
- **Metric Tiles:**
  - Goal Target: `₹30,00,00,000` (`₹30.00 Cr`)
  - Current Progress: Authoritative sum of eligible months
  - Remaining to Goal: Target - Progress (or "Target Exceeded")
  - Percentage: Formatted to 1 decimal place with animated SVG progress ring/bar.
- **Mode Handling:**
  - `public_detailed`: Interactive chart (Recharts) + Monthly table + Milestones.
  - `public_summary`: Only aggregate progress numbers displayed; detailed monthly table suppressed.
  - `private`: Publicly hidden with polite message: *"Revenue dashboard is currently set to private by the administrator."*

### 5.4 Form Controls & Buttons
- **Primary Button:** Electric blue background (`bg-sky-500 hover:bg-sky-400 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-sky-400`).
- **Secondary Button:** Dark slate surface with subtle border (`bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-lg`).
- **Gold Accent Button:** For revenue / primary milestones (`bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg`).
- **Form Inputs:** Dark slate background with explicit focus state (`bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg p-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500`).
