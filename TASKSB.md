# TASKSB — AI-Forward Transformation Task List

**Source PRD:** [PRDB.md](PRDB.md) (v1.1 — AI-Forward Positioning)
**Relationship to prior docs:** Extends [Tasks.md](Tasks.md) v1.0 (the original medical-device build — now largely complete per git history). Where the original [PRD.md](PRD.md) v1.0 and PRDB.md disagree, **PRDB.md wins** for any user-facing copy, services, taxonomy, or SEO; PRD.md remains authoritative only for the unchanged technical/security/deployment sections (§4–§9). Note: PRD.md §4.2 shows pre-implementation field names (`company`, `notes`, `order`); the **live schema** uses `companyName`, `internalNotes`, `sortOrder` — tasks below reference the live names.
**Goal:** Transform SIDEC Consulting from a generic "medical device injection molding consultant" site into an **ultra-pro, AI-focused manufacturing consultancy** — positioned at the rare intersection of *injection molding domain expertise* and *applied AI that survives an FDA/ISO audit*. Beyond the PRDB copy pivot, this list adds the conversion, trust, and sales-enablement work needed to make the site genuinely **saleable and convincing to high-value clients**.
**Date:** June 5, 2026
**Stack (verified):** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma 7 + PostgreSQL · NextAuth 5 · Resend · AI SDK

---

## How to use this document

- Tasks are grouped into **8 phases**, roughly in dependency order. Phase 0–3 deliver the PRDB pivot; Phase 4–7 are the "make it sell" layer; Phase 8 is QA/launch.
- Each task lists **Files**, **What to do**, and **Acceptance criteria**.
- Priority: 🔴 **P0** (core pivot — site is incoherent without it) · 🟠 **P1** (high sales impact) · 🟡 **P2** (polish / nice-to-have).
- Most copy lives in data files, so a large share of the pivot is editing `lib/constants.ts`, `prisma/seed.ts`, and a handful of page files — not a rebuild.

---

## Phase 0 — Foundation: site config, metadata & SEO 🔴

The single source of truth for site identity. Get this right first; everything downstream inherits it.

### T0.1 — Rewrite site identity 🔴
- **Files:** [lib/constants.ts:1-12](lib/constants.ts#L1-L12)
- **What to do:** Update `SITE_CONFIG`:
  - `title`: `"AI for Injection Molding — Validated, Explainable, Audit-Ready"` (was "Medical Device Injection Molding Consultant")
  - `description`: `"25+ years in medical device manufacturing, now bringing AI and machine learning to injection molding — process optimization, quality, predictive maintenance, and the validation/governance to deploy it in regulated plants."`
  - Confirm `email`, `phone`, `linkedin` are populated (currently empty `""` — **blocker for trust/contactability**; see T4.6).
- **Acceptance:** Site name still "SIDEC Consulting"; tagline/description now lead with AI + molding. No empty contact fields shipped to production.

### T0.2 — Rewrite root metadata, OG tags & keywords 🔴
- **Files:** [app/layout.tsx:30-92](app/layout.tsx#L30-L92)
- **What to do:**
  - Page `<title>`: `"SIDEC Consulting | AI for Injection Molding Manufacturing"`
  - Meta description: mirror T0.1.
  - Replace keyword array with PRDB §7.3 primary keywords: `AI injection molding consultant`, `machine learning injection molding`, `AI process optimization injection molding`, `AI validation medical device manufacturing`, `scientific molding AI consultant`.
  - Update OpenGraph + Twitter card title/description to match.
- **Acceptance:** View-source `<head>` reflects AI positioning; OG preview (LinkedIn/Slack unfurl) shows the new headline.

### T0.3 — Regenerate OG share image 🟠
- **Files:** `public/og-image.png` (1200×630), referenced in [app/layout.tsx](app/layout.tsx)
- **What to do:** Replace the OG image with one that signals AI + molding (optimization curve / dashboard over a molding-floor motif) and carries the new headline "Bring AI to Injection Molding — Without Breaking Validation."
- **Acceptance:** Social unfurl shows the new image, not the old medical-device one.

### T0.4 — Update JSON-LD / structured data 🟠
- **Files:** search `app/layout.tsx` and any `JsonLd`/schema component (grep `@type`, `application/ld+json`)
- **What to do:** Update `Organization`/`ProfessionalService` schema `description`, `knowsAbout`/`serviceType` to AI-in-manufacturing terms. Add `areaServed` and the productized service (AI Readiness Assessment) as an `OfferCatalog` if schema supports it.
- **Acceptance:** Rich-results test passes; `knowsAbout` lists AI/ML + molding topics.

### T0.5 — Sitemap & robots sanity 🟡
- **Files:** `app/sitemap.ts` / `app/robots.ts` if present (grep)
- **What to do:** Ensure new routes (AI Readiness Assessment page T2.1, case studies T4.2) are included once created.
- **Acceptance:** New pages appear in `/sitemap.xml`.

---

## Phase 1 — Core public copy pivot 🔴

This is the visible heart of the PRDB change. Most home-page copy is inline in `app/page.tsx`.

### T1.1 — Home hero 🔴
- **Files:** [app/page.tsx:154-165](app/page.tsx#L154-L165)
- **What to do (PRDB §3.1.1):**
  - **Headline:** `Bring AI to Injection Molding — Without Breaking Validation`
  - **Subheadline:** `25+ years in medical device manufacturing. I help molders deploy AI for process optimization, quality, and uptime — validated, explainable, and audit-ready.`
  - **Primary CTA:** `Schedule a Consultation` → `/schedule`
  - **Secondary CTA:** change from "Explore Services" to `Get an AI Readiness Assessment` → `/services/ai-readiness-assessment` (new page, T2.1) or `/contact?service=ai-readiness`.
- **Acceptance:** Hero matches PRDB verbatim; secondary CTA routes to the assessment funnel, not the generic services index.

### T1.2 — Home stats / metrics band 🔴
- **Files:** [lib/constants.ts:90-96](lib/constants.ts#L90-L96) (`STATS`), rendered via [components/sections/AnimatedStats.tsx](components/sections/AnimatedStats.tsx)
- **What to do (PRDB §3.1.1 stats):** Replace the four stats with AI-credible-but-honest framing:
  - `25+` — `Years in Injection Molding`
  - `ISO 13485 / QMSR` — `Regulated-Manufacturing Depth`
  - `100+` — `Process, Quality & Automation Projects`
  - `DOE + ML` — `AI Grounded in Scientific Molding`
- **Note:** Keep claims defensible — no invented "AI models deployed" numbers. If a real metric exists (scrap %, cycle-time %), prefer it (see T4.1).
- **Acceptance:** Stats reflect PRDB; `AnimatedStats` still animates non-numeric values gracefully (verify "ISO 13485 / QMSR" and "DOE + ML" don't break the count-up animation — may need a `display`-only flag).

### T1.3 — Service overview cards (2×2) 🔴
- **Files:** [lib/constants.ts:24-88](lib/constants.ts#L24-L88) (`SERVICE_AREAS`) + home render [app/page.tsx:314-365](app/page.tsx#L314-L365)
- **What to do:** Replace the 7 legacy service areas with the **4 AI pillars** from PRDB §2 / §3.1.1, plus a foregrounded AI Readiness Assessment. Suggested new `SERVICE_AREAS`:
  1. `ai-process-development` — **AI-Augmented Process Development** — icon `Cpu`/`TrendingUp` — "Turn scientific molding and DOE into ML-driven optimization that cuts cycle time, scrap, and energy while holding quality."
  2. `ai-validation-governance` — **AI Validation & Governance** — icon `ShieldCheck` — "Deploy AI in regulated plants the right way: validated under ISO 13485/QMSR, explainable, and ready for audit."
  3. `ai-quality-inspection` — **AI-Driven Quality & Inspection** — icon `ScanSearch`/`Eye` — "Catch defects before they happen with predictive models and automated vision, integrated into your existing QMS."
  4. `smart-factory-data` — **Smart Factory & Data** — icon `Network`/`Activity` — "Predictive maintenance, IIoT, and the data foundation that has to exist before any AI can deliver."
- **Downstream impact (must update together):** `href` anchors, `shortTitle`, and every consumer of `SERVICE_AREAS` — Header services dropdown, Footer (T1.7), Services page (T2.2). Icons must exist in `lucide-react`.
- **Acceptance:** Home shows a 2×2 AI pillar grid; all nav/footer/dropdown links resolve; no orphaned anchors to deleted `#manufacturing-engineering` etc.

### T1.4 — "Featured band" → AI Readiness Assessment funnel 🔴
- **Files:** [app/page.tsx](app/page.tsx) (insert above the contact CTA, near [app/page.tsx:452-487](app/page.tsx#L452-L487) process section or before final CTA)
- **What to do (PRDB §3.1.1):** Add a featured band: *"Not sure where AI fits in your operation? Start with an AI Readiness Assessment — a fixed-scope audit that maps where AI pays off and where it's premature."* with a CTA button to the assessment page (T2.1).
- **Acceptance:** Prominent, visually distinct band exists above the contact CTA; button converts to the assessment funnel.

### T1.5 — "Why SIDEC" pillars rewrite 🟠
- **Files:** [app/page.tsx:247-310](app/page.tsx#L247-L310)
- **What to do:** Reframe the 3 differentiators around the PRDB thesis ("AI deployed *and* audit-survivable"):
  1. **Molding-Floor Credibility** (`Scientific Molding`) — "AI advice from someone who's actually validated a process — DOE, scientific molding, IQ/OQ/PQ — not a data scientist who's never seen a press."
  2. **Audit-Survivable AI** (`ISO 13485 / QMSR`) — "Models that are validated, explainable, and documented to pass an FDA/ISO audit — the part most AI vendors ignore."
  3. **ROI Realism** (`Effort vs. ROI`) — "An honest map of where AI pays off and where it's premature — so you invest in sensors and models that return, not hype."
  - Keep the two guarantees (Confidentiality, 24–48h Response) — they're strong trust signals.
- **Acceptance:** Section headline + 3 pillars reflect the AI differentiator; guarantees retained.

### T1.6 — About preview + About page rewrite 🟠
- **Files:** [app/page.tsx:368-449](app/page.tsx#L368-L449) (home preview) and [app/(public)/about/page.tsx](app/(public)/about/page.tsx)
- **What to do:** Reposition the bio: 25+ years of molding/regulated-manufacturing expertise → *now applied to responsibly bringing AI/ML onto the molding floor*. Keep the credibility bullets (injection molding, ISO 13485/FDA, global supplier quality) and **add** AI-relevant ones (DOE→ML surrogate modeling, AI validation/CSA, smart-factory/IIoT). Frame the unique story: "the rare practitioner who can deploy AI *and* make it survive an audit."
- **Acceptance:** About narrative leads with the AI-through-line while preserving the deep-domain proof. No claim implies AI experience the practitioner doesn't have — frame as *applying proven method to AI*.

### T1.7 — Footer links 🟠
- **Files:** [lib/constants.ts:229-246](lib/constants.ts#L229-L246) (`FOOTER_LINKS.services`)
- **What to do:** Replace the 4 legacy service links with the 4 AI pillars (T1.3) + an "AI Readiness Assessment" link.
- **Acceptance:** Footer service column matches new pillars; all hrefs resolve.

### T1.8 — Header / nav consistency 🟡
- **Files:** [components/layout/Header.tsx](components/layout/Header.tsx), [lib/constants.ts:14-21](lib/constants.ts#L14-L21) (`NAV_LINKS`)
- **What to do:** The services dropdown renders from `SERVICE_AREAS`, so T1.3 propagates automatically — **verify** the dropdown labels/icons/links render correctly post-change. Optionally add a standout "AI Readiness Assessment" item (badged "Start Here") to the dropdown or nav.
- **Acceptance:** Dropdown shows 4 pillars + assessment; no broken icons; mobile menu verified.

---

## Phase 2 — Services & the productized AI Readiness Assessment 🔴

### T2.1 — Build the AI Readiness Assessment page (the funnel entry) 🔴
- **Files:** new `app/(public)/services/ai-readiness-assessment/page.tsx` (or a prominent anchored section on the services page)
- **What to do (PRDB §2.0):** Productize it as a fixed-scope, fixed-fee offering. Page should sell it like a packaged product:
  - **Hero:** "AI Readiness Assessment — Where would AI actually pay off, and where is it premature?"
  - **What you get (deliverables):** data-maturity score · prioritized opportunity map (effort vs. ROI) · sensor/data-infrastructure gap analysis · phased roadmap.
  - **Who it's for / what it costs / how long it takes** (fixed scope + fee = lowers buying friction → key conversion lever).
  - **Strong CTA** to book it; position as the low-commitment on-ramp to the four engagements.
  - Consider a downloadable one-page sample/checklist as a lead magnet (ties to T4.4).
- **Acceptance:** A standalone, conversion-optimized page exists; linked from hero secondary CTA (T1.1), featured band (T1.4), nav (T1.8), and services page.

### T2.2 — Services page intro + 4 pillar expansions 🔴
- **Files:** [app/(public)/services/page.tsx:382-411](app/(public)/services/page.tsx#L382-L411) (hero) + the body that renders services
- **What to do:**
  - **Hero headline:** `AI for injection molding — deployed by someone who's validated the process` (replace "Expert solutions for medical device manufacturing").
  - **Intro copy (PRDB §3.1.2, verbatim):** *"Most 'AI for manufacturing' advice comes from data scientists who've never validated a process. I come from the molding floor — scientific molding, DOE, process validation, ISO 13485 — and layer AI on top of that rigor. The result is AI you can actually deploy in production and defend in an audit. I serve medical device manufacturers as a premium tier and apply the same methods, minus the regulatory weight, to automotive, packaging, and electronics molders."*
  - **Each pillar** expands into the PRDB §2 detail (bulleted capabilities) following the arc **discovery → design → pilot → validation → handoff**, with explicit deliverables and an honest "where AI is *not* the answer" note.
  - Make `ai-validation-governance` visually the **key differentiator** (badge/callout) per PRDB §2.2.
- **Acceptance:** Services page reflects the 4 pillars with PRDB capability bullets; premium (medical) vs. standard (automotive/packaging/electronics) tiering is stated; differentiator pillar is highlighted.

### T2.4 — Services page "Industry Applications" → "Sectors Served" 🟠
- **Files:** [app/(public)/services/page.tsx](app/(public)/services/page.tsx) (the FR-009 industry-applications section)
- **What to do (PRDB §3.1.3):** The current section frames applications as medical-device classes only (Class I/II/III, combination products, IVD). Reframe as **Sectors Served** with medical device as the premium/regulated tier, adding automotive, packaging, and electronics/connectors — each with an AI-relevant value line (per PRDB §3.1.3). Preserve the medical-device-class detail as proof of regulated depth, nested under the medical tier.
- **Acceptance:** Services page presents a multi-sector offering with medical positioned as premium; no copy implies the practice is medical-only; sector cards reflect AI value per sector.

### T2.3 — Services data source (DB-backed `Service` model) 🟠
- **Files:** [prisma/seed.ts](prisma/seed.ts) (Service seeding), [prisma/schema.prisma](prisma/schema.prisma) (`Service` model ~L232-260), admin at `app/admin/services/`
- **What to do:** The services page loads `Service` records from the DB. Re-seed (or migrate) `Service` rows to the 4 AI pillars + the AI Readiness Assessment, populating `title`, `tagline`, `description`, `keyOfferings[]`, `outcomes[]`, `categoryIcon` for each from PRDB §2. Deactivate (`isActive=false`) or replace the 7 legacy services.
- **Acceptance:** `/admin/services` and the public services page show the AI pillars sourced from DB; legacy services no longer appear publicly. Existing inquiries referencing old `serviceInterest` values still render in admin (no FK break — field is a string).

---

## Phase 3 — Data layer: contact form, blog taxonomy, seed content 🔴

### T3.1 — Contact "Service Interest" dropdown 🔴
- **Files:** [lib/constants.ts:99-108](lib/constants.ts#L99-L108) (`SERVICE_INTEREST_OPTIONS`)
- **What to do (PRDB §3.1.5):** Replace options with:
  - `ai-readiness` — AI Readiness Assessment
  - `ai-process` — AI Process Development & Optimization
  - `ai-validation` — AI Validation & Governance
  - `ai-quality` — AI Quality & Inspection
  - `smart-factory` — Smart Factory / Predictive Maintenance
  - `general` — General Inquiry
- **Acceptance:** Contact dropdown shows the 6 AI options. PRDB §"Notes" confirms `ContactInquiry.serviceInterest` is a string — **no migration needed**.

### T3.2 — Service-specific conditional fields remap 🟠
- **Files:** [lib/constants.ts:172-207](lib/constants.ts#L172-L207) (`SERVICE_SPECIFIC_FIELDS`) and field defs [lib/constants.ts:128-170](lib/constants.ts#L128-L170)
- **What to do:** The keys in `SERVICE_SPECIFIC_FIELDS` reference the OLD service ids — after T3.1 they'll silently match nothing. Remap to the new ids and tailor fields to AI engagements. Suggested additions to `FIELD_DEFINITIONS`:
  - `dataMaturity` — "Current data/sensor maturity" (textarea): "What process data do you collect today? (machine sensors, SPC, MES, manual logs...)"
  - `primaryPainPoint` — "Primary pain point" (input): "e.g., scrap rate, cycle time, unplanned downtime, inspection cost"
  - `regulatoryStandards` (keep) — for `ai-validation`.
  - Map: `ai-readiness` → [dataMaturity, primaryPainPoint, estimatedBudget]; `ai-process` → [primaryPainPoint, dataMaturity, estimatedBudget]; `ai-validation` → [regulatoryStandards, expectedDocuments, estimatedBudget]; `ai-quality` → [primaryPainPoint, dataMaturity]; `smart-factory` → [dataMaturity, otherSites, estimatedBudget]; `general` → [].
- **Schema note:** new field keys (`dataMaturity`, `primaryPainPoint`) need columns on `ContactInquiry` **or** fold into the existing `message`/`internalNotes`. Decide: add nullable columns (small migration) vs. reuse existing optional fields. Update `ServiceFieldKey` type + Zod schema in `lib/validations` accordingly.
- **Acceptance:** Selecting each new service reveals relevant fields; form validates; submissions persist; no console errors from unmatched keys.

### T3.3 — Contact page hero/intro copy 🟡
- **Files:** [app/(public)/contact/page.tsx:205-213](app/(public)/contact/page.tsx#L205-L213)
- **What to do:** Light reframe toward AI engagements (e.g., headline "Let's find where AI pays off in your plant"). Keep the strong 6-step process visual.
- **Acceptance:** Contact hero references AI without breaking the existing layout.

### T3.4 — Blog categories taxonomy 🟠
- **Files:** [lib/constants.ts:218-226](lib/constants.ts#L218-L226) (`BLOG_CATEGORIES`) + [prisma/seed.ts:18-68](prisma/seed.ts#L18-L68) (Category seed)
- **What to do (PRDB §7.2):** Replace categories with: `AI & Process Optimization`, `AI Validation & Compliance`, `Smart Factory & Data`, `Quality Systems & Inspection`, `Industry Trends`, `Case Studies`. Update both the constant and the DB seed (and the `Category` records — PRDB §"Notes" suggests seeding to match). Migrate or re-tag existing posts' `categoryId` so none orphan.
- **Acceptance:** Resources page filters show the new categories; existing seeded posts re-mapped (e.g., "Scientific Molding…" → AI & Process Optimization) with no null category FKs.

### T3.5 — Seed/author the 12 AI blog topics 🟠
- **Files:** [prisma/seed.ts](prisma/seed.ts) (BlogPost seeding, ~L114-1560)
- **What to do (PRDB §7.2):** Add the 12 AI-forward articles (at minimum as well-formed drafts/published stubs with real `excerpt`, `metaTitle`, `metaDescription`, `featuredImage`, `readingTime`, correct category). Priority order for *full* articles — write the 3 highest-SEO-value first:
  1. *Validating AI/ML Process Control Under ISO 13485 and the New QMSR* (the flagship differentiator piece)
  2. *From DOE to ML Surrogate Models: The Next Evolution of Scientific Molding*
  3. *Predictive Maintenance for Injection Molding: Where the ROI Actually Is*
  - Remaining 9 titles per PRDB §7.2 as stubs to flesh out post-launch.
- **Old content:** Keep the legacy molding/quality posts (they still demonstrate domain depth) but re-categorize (T3.4); optionally light-edit intros to reference AI.
- **Acceptance:** ≥3 substantive AI articles published; all 12 titles present; resources page populated; RSS (`/feed.xml`) regenerates.

---

## Phase 4 — Sales enablement & conversion ("make it convincing") 🟠

The PRDB defines positioning; this phase is what actually *closes* high-value clients. None of this is optional for an "ultra-pro" site.

### T4.1 — Quantified outcome / results band 🟠
- **Files:** new section in [app/page.tsx](app/page.tsx) + reusable component (extend [components/sections](components/sections))
- **What to do:** Add a "Results" strip with concrete, defensible outcome ranges (e.g., "12–22% scrap reduction," "8–15% cycle-time gains," "downtime cut via predictive maintenance"). If specific client numbers aren't usable, frame as *typical engagement targets* with an honest qualifier. Buyers need numbers, not adjectives.
- **Acceptance:** Above-the-fold-ish band with 3–4 quantified outcomes; every number is defensible or clearly labeled as a target range.

### T4.2 — Case studies / proof system 🟠
- **Files:** new `app/(public)/case-studies/` route + `CaseStudy` model in [prisma/schema.prisma](prisma/schema.prisma) (or reuse the Project model) + seed + admin CRUD
- **What to do:** Build a case-study system: problem → approach (DOE/ML method) → result (quantified) → "how we kept it audit-ready." Even 2–3 anonymized/representative studies dramatically increase credibility. Link from home, services, and the assessment page. Use markdown rendering already in place (`react-markdown`).
- **Acceptance:** Case-studies index + detail pages live; ≥2 studies seeded; linked from primary pages; admin can add more.
- **Honesty gate:** If real, named client work can't be shown, label studies as "representative" / anonymized — never fabricate named clients or logos.

### T4.3 — Testimonials / social proof 🟠
- **Files:** [components/sections/TestimonialsCarousel.tsx](components/sections/TestimonialsCarousel.tsx) (already exists — wire it up), home + services pages
- **What to do:** Surface 3–5 testimonials (name, title, company or "Quality Director, Class II device manufacturer" if anonymized). Add a "trusted by / experience with" band of sectors served (medical, automotive, packaging, electronics) — use sector labels if client logos aren't permitted.
- **Acceptance:** Testimonials render on home + services; carousel works on mobile; no placeholder lorem.

### T4.4 — Lead magnet: AI-Readiness Checklist 🟠
- **Files:** new gated asset + form; reuse [components/sections/NewsletterForm.tsx](components/sections/NewsletterForm.tsx) and `Subscriber` model; PDF in `public/`
- **What to do (PRDB §10 / FUTURE-003):** Offer a downloadable "Is Your Plant AI-Ready? — 12-Point Checklist" in exchange for email. Captures leads at top-of-funnel and reinforces the assessment offer. Email delivery via Resend (already integrated).
- **Acceptance:** Email capture → checklist delivered/downloaded; subscriber saved; tracked as a conversion event (T6.3).

### T4.5 — Strengthen CTAs & booking flow 🟠
- **Files:** [components/sections/CTASection.tsx](components/sections/CTASection.tsx), `app/(public)/schedule/page.tsx`, `Appointment` flow
- **What to do:** Ensure every page ends with a clear next step. Differentiate two CTAs throughout: low-commitment ("Get an AI Readiness Assessment") vs. high-intent ("Schedule a Consultation"). Verify the schedule/booking flow's `serviceInterest` options match the new AI services.
- **Acceptance:** Consistent dual-CTA pattern site-wide; booking form reflects AI services; calendar flow tested end-to-end.

### T4.6 — Contact/trust details & credibility footer 🟠
- **Files:** [lib/constants.ts:1-12](lib/constants.ts#L1-L12), [components/layout/Footer.tsx](components/layout/Footer.tsx)
- **What to do:** Populate real `email`, `phone`, `linkedin` (empty today = looks unfinished/untrustworthy). Add LinkedIn link, response-time guarantee, and confidentiality note to the footer. Consider a short credibility line ("ISO 13485 / QMSR-fluent · DOE & scientific-molding practitioner").
- **Acceptance:** No empty contact fields in prod; footer carries clickable email/phone/LinkedIn + trust signals.

### T4.7 — Update the AI chatbot's knowledge/persona 🟡
- **Files:** `app/api/chat/route.ts`, [components/chatbot/](components/chatbot/)
- **What to do:** The site already has an AI chatbot — update its system prompt/persona to the AI-for-molding positioning so it answers questions about AI readiness, validation, the four pillars, and routes users to the assessment/booking. (Meta-win: an AI consultancy whose own site uses AI well is itself a proof point.)
- **Acceptance:** Chatbot answers on-message, recommends the AI Readiness Assessment, and can hand off to contact/schedule.

---

## Phase 5 — Visual & design polish ("ultra-pro" feel) 🟡

### T5.1 — AI/data imagery pass 🟡
- **Files:** home, services, about, blog featured images; `public/`
- **What to do (PRDB §6 Notes):** Introduce imagery that signals data/AI — optimization curves, sensor/IIoT dashboards, vision-inspection overlays — *alongside* cleanroom/molding photography (don't lose the manufacturing credibility). Replace generic Unsplash medical stock where it now reads off-message.
- **Acceptance:** Key pages mix molding + AI/data visuals; no jarring stock photos that contradict the positioning.

### T5.2 — Hero/data visualization motif 🟡
- **Files:** [app/page.tsx](app/page.tsx) hero, [app/globals.css](app/globals.css) (existing `.grid-blueprint`, `.grid-dots`, `.corner-marks` utilities)
- **What to do:** Add a subtle animated data-viz element to the hero (e.g., an optimization/convergence curve or live-looking metric tiles) using the existing technical design tokens. Reinforces "applied AI" instantly, above the fold.
- **Acceptance:** Hero has a tasteful AI/data motif; respects `prefers-reduced-motion`; no layout shift / CLS regression.

### T5.3 — Design-token / palette check 🟡
- **Files:** [app/globals.css:93-202](app/globals.css#L93-L202)
- **What to do:** Palette (medical blue + signal cyan) already works for an AI/tech feel — keep it. Just verify the new sections (results band, case studies, assessment page) use existing tokens (`--signal`, `surface-ink`, hairlines) consistently rather than introducing new ad-hoc colors.
- **Acceptance:** New sections visually consistent with existing technical aesthetic; dark mode verified.

---

## Phase 6 — SEO, content & analytics 🟠

### T6.1 — Keyword integration across pages 🟠
- **Files:** all rewritten pages + per-page metadata
- **What to do (PRDB §7.3):** Work primary/secondary/long-tail keywords naturally into H1/H2s, intro copy, and per-page `<title>`/meta. Each pillar page should target its cluster (e.g., validation page → "AI validation medical device manufacturing," "ISO 13485 AI manufacturing," "computer software assurance manufacturing").
- **Acceptance:** Each main page has a focused keyword target reflected in title/H1/meta; no keyword stuffing.

### T6.2 — Per-page metadata & canonical 🟠
- **Files:** each `page.tsx` `generateMetadata`/`metadata` export
- **What to do:** Ensure home, services, each pillar, assessment, about, contact, and blog posts export distinct, AI-targeted metadata + canonical URLs. Blog posts already have `metaTitle`/`metaDescription` fields — use them.
- **Acceptance:** No duplicate titles; every indexable page has unique meta + canonical.

### T6.3 — Analytics: track the new funnel 🟠
- **Files:** existing analytics layer (grep `track`, `components/shared/TrackedButton.tsx`, [ANALYTICS.md](ANALYTICS.md))
- **What to do:** Add events for the new conversion paths: assessment-page views, assessment-CTA clicks, checklist downloads (T4.4), case-study views, each `serviceInterest` selection. Update the admin conversion funnel ([components/admin/charts/ConversionFunnel.tsx](components/admin/charts/ConversionFunnel.tsx)) to reflect AI services.
- **Acceptance:** New events fire and appear in the admin dashboard; funnel reflects AI service mix.

### T6.4 — Internal linking & content cluster 🟡
- **Files:** blog posts, services pages
- **What to do:** Link the flagship validation article ↔ the validation pillar ↔ the assessment page (topic-cluster/hub-and-spoke) for SEO authority and to guide buyers toward conversion.
- **Acceptance:** Pillar pages link to relevant articles and vice-versa; assessment page is reachable within 1 click from every pillar.

---

## Phase 7 — Cleanup & consistency sweep 🟠

### T7.1 — Purge stale "medical-device-only" framing 🟠
- **Files:** grep the repo for `medical device`, `injection molding consultant`, legacy service ids (`manufacturing-engineering`, `quality-regulatory`, `strategic-advisory`, etc.)
- **What to do:** Find every lingering reference — legal pages, email templates (Resend), admin labels, alt text, breadcrumb labels, `Skills.md`-derived strings — and reconcile with the AI positioning (medical device should now read as *one premium tier*, not the whole identity).
- **Acceptance:** Grep shows no orphaned old positioning in user-facing surfaces; no broken anchor links to removed service ids.

### T7.2 — Email templates & notifications 🟠
- **Files:** Resend email templates (grep `resend`, `lib/email*`)
- **What to do:** Update inquiry auto-reply + admin notification copy to reference AI services and set expectations (24–48h, next step = assessment). Ensure the new `serviceInterest` values render with friendly labels in emails.
- **Acceptance:** Test submission for each service sends correctly-labeled emails.

### T7.3 — Validation schema & types 🟠
- **Files:** `lib/validations` (Zod `contactInquirySchema`), `ServiceFieldKey` type
- **What to do:** Align Zod enums/types with the new dropdown values and any new fields (T3.2). TypeScript must compile with no `as const` mismatches.
- **Acceptance:** `tsc` / build passes; submitting any new service value validates server-side.

### T7.4 — Brand-voice consistency sweep (lock to "we") 🟠
- **Decision (locked):** Site uses **first-person plural ("we") — the SIDEC Consulting firm voice.** PRDB drafts written in "I" are adapted to "we" on implementation.
- **Files:** every public copy surface — [app/page.tsx](app/page.tsx), [app/(public)/](app/\(public\)/) (services, about, contact, resources, legal), email templates, [components/chatbot/](components/chatbot/) system prompt, blog author bylines
- **What to do:** Apply the "we" voice everywhere; grep for stray first-person singular (`\bI\b`, `\bI'm\b`, `\bmy\b`, `\bme\b`) in user-facing copy and convert to "we"/"our". The firm still foregrounds 25+ years of individual expertise — it just speaks as a firm.
- **Acceptance:** No stray "I" voice in user-facing copy; chatbot and emails speak in the same "we" voice as the site.

---

## Phase 8 — QA, testing & launch 🔴

### T8.1 — Full-site click-through & link audit 🔴
- **What to do:** Manually walk every public route + every CTA/dropdown/footer link after the `SERVICE_AREAS` change (highest breakage risk). Verify anchors (`/services#...`) resolve to existing sections.
- **Acceptance:** Zero 404s / dead anchors; all CTAs route correctly.

### T8.2 — Forms & data round-trip 🔴
- **What to do:** Submit the contact form for each new service (conditional fields), book an appointment, subscribe/download the lead magnet. Confirm DB persistence, admin visibility, and emails.
- **Acceptance:** Each path persists + notifies correctly.

### T8.3 — Build, types, lint 🔴
- **What to do:** `npm run build`, typecheck, lint, Prisma migrate/seed on a clean DB.
- **Acceptance:** Clean build; seed produces the new categories/services/posts; no migration errors.

### T8.4 — Responsive, a11y & performance 🟠
- **What to do:** Mobile/tablet pass on hero, 2×2 pillar grid, assessment page, case studies; check Lighthouse (the repo has [PERFORMANCE.md](PERFORMANCE.md) + Web Vitals reporter) — guard against CLS from new hero motif (T5.2) and image weight (T5.1).
- **Acceptance:** No major a11y violations; Web Vitals not regressed vs. baseline; images optimized (`next/image`).

### T8.5 — Honesty & claims review (do before launch) 🔴
- **What to do:** Final pass over every quantified claim, testimonial, case study, logo, and credential. Anything not independently true must be labeled (target range / representative / anonymized) or removed. This is both an ethical and a legal/regulatory-credibility requirement for a consultancy that sells *audit-readiness*.
- **Acceptance:** Sign-off that no statistic, client name, logo, or testimonial is fabricated or misleading.

---

## Sequencing summary (suggested execution order)

| Order | Tasks | Why |
|------|-------|-----|
| 1 | T0.1, T1.1, T1.2, T1.3, T1.7, T3.1 | Edits to `constants.ts` + hero — the pivot's backbone; one file unblocks most surfaces |
| 2 | T1.4, T1.5, T1.6, T2.1, T2.2, T2.3, T2.4 | Services + the assessment funnel + sectors-served reframe (primary conversion path) |
| 3 | T3.2, T3.4, T3.5, T7.2, T7.3, T7.4 | Data layer: contact fields, blog taxonomy/content, emails, validation, **voice sweep** |
| 4 | T0.2–T0.5, T6.1–T6.4 | SEO + metadata + analytics once copy is stable |
| 5 | T4.1–T4.7 | Sales-enablement layer (results, case studies, testimonials, lead magnet) |
| 6 | T5.1–T5.3 | Visual polish |
| 7 | T7.1, T8.1–T8.5 | Cleanup sweep + QA + honesty gate → launch |

## Key risk callouts

- **`SERVICE_AREAS` is load-bearing.** It feeds home cards, header dropdown, footer, and (via ids) the contact form's conditional fields and anchor links. Change it and its consumers in one coordinated pass (T1.3 + T1.7 + T1.8 + T3.2 + T2.3) or links/fields silently break.
- **`SERVICE_SPECIFIC_FIELDS` keys must match new `serviceInterest` ids** (T3.1 ↔ T3.2), or conditional fields stop appearing with no error.
- **No migration needed for the dropdown change** (PRDB confirms `serviceInterest` is a free string), but **new conditional fields** (`dataMaturity`, `primaryPainPoint`) do need columns or a fold-into-existing-field decision (T3.2).
- **Honesty is a feature here.** This site sells audit-readiness and AI governance — fabricated metrics/logos/testimonials would undercut the exact value proposition. T8.5 is a hard gate, not a nicety.
- **Voice must be decided before copy work, not after.** PRDB is first-person singular; the live site is mixed. Settle the voice (T7.4) at the same time as the hero rewrite (T1.1) so you don't write copy twice — T7.4 is listed in Phase 7 only as the *final sweep*, but the decision belongs in step 1.
- **Two docs now disagree by design.** PRD.md/Tasks.md describe the medical-only build; PRDB.md/TASKSB.md describe the AI pivot. For anything user-facing, PRDB/TASKSB are authoritative — don't "fix" a page back toward PRD.md copy.
