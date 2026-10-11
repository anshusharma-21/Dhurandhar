# PROJECT DHURANDHAR — FEATURE FLOW MAP
**Application:** Project Dhurandhar — Road to ₹30CR Revenue  
**Target:** `https://projectdhurandhar.automationlabs.online`  
**Architecture:** Next.js 14 App Router + PostgreSQL (Supabase) + Server AI  

---

## 1. Episode Creation to Publication Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Dr. Ajay / Editor
    participant Form as Admin EpisodeForm
    participant AI as AISummary Studio
    participant API as /api/episodes
    participant DB as PostgreSQL (episodes)
    participant Public as Public Feed & Archive

    Admin->>Form: Enters Day N, Title, Instagram Reel URL
    Admin->>Form: Enters Spoken Transcript or Notes
    Admin->>AI: Clicks "Generate AI Summary"
    AI->>AI: Verifies source text >= 25 chars (AC-06 Guard)
    AI-->>Form: Returns 80-150 word summary + takeaways
    Admin->>Form: Reviews, edits copy, confirms tags
    alt Save Draft
        Admin->>API: Clicks "Save Draft"
        API->>DB: Stores status='draft' (Hidden from public)
    else Publish Live
        Admin->>API: Clicks "Publish Now"
        API->>DB: Stores status='published', published_at=NOW()
        DB-->>Public: Live on Homepage & Archive in latest-first order
    end
```

---

## 2. Community Comments & Moderation Queue Flow

```mermaid
flowchart TD
    A[Visitor views Episode Detail] --> B{Is Visitor Signed In?}
    B -- No --> C[Show Auth Prompt: Sign In / Register to Comment]
    B -- Yes --> D{Is Email Verified?}
    D -- No --> E[Block with Error: Email Verification Required]
    D -- Yes --> F[User submits comment body]
    F --> G[Sanitize text: Strip HTML/script tags - AC-12]
    G --> H{Does user have prior approved comments?}
    H -- No --> I[Status = 'pending' -> Send to Moderation Queue]
    H -- Yes --> J[Status = 'approved' -> Render immediately]
    I --> K[Admin / Moderator reviews in /admin/comments]
    K --> L{Decision}
    L -- Approve --> M[Status updated to 'approved' -> Becomes Public]
    L -- Reject --> N[Status updated to 'rejected']
    L -- Spam --> O[Status updated to 'spam']
```

---

## 3. Revenue Dashboard Calculation & Privacy Flow

```mermaid
flowchart TD
    A[Request to /revenue or /api/revenue] --> B[Fetch revenue_settings & revenue_months]
    B --> C{Check visibility setting}
    C -- 'private' --> D[Shield figures: return message & zero financial rows - AC-15]
    C -- 'public_summary' --> E[Calculate total & progress %; suppress individual months]
    C -- 'public_detailed' --> F[Calculate metrics with full monthly ledger & chart]
    
    subgraph Authoritative Math Engine
        F --> G[Sum eligible monthly actuals]
        G --> H[Percentage = Actual / Target * 100]
        H --> I{Actual > Target?}
        I -- Yes --> J[isTargetExceeded = true; Remaining = 0]
        I -- No --> K[Remaining = Target - Actual]
        K --> L[Render Recharts Trend & Variance Table]
    end
```

---

## 4. Search & Content Taxonomy Flow

```mermaid
flowchart LR
    User[Visitor Enters Search Query] --> Query[/api/episodes?q=...]
    Query --> Filter[Filter published episodes only]
    Filter --> Match[Match Day N, Title, Summary, or Tag]
    Match --> Sort[Sort by published_at DESC, day_number DESC]
    Sort --> UI[Display lightweight cards on Archive Page]
```
