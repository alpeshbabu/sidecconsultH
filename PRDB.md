# PRD Revision — AI-Forward Positioning
## MedDevice Consulting Platform → AI in Injection Molding Manufacturing

**Revision:** v1.1 (positioning pivot)
**Supersedes (in [PRD.md](PRD.md) v1.0):** §1.1–1.3, §2, parts of §3.1.1 / §3.1.2 / §3.1.3 (FR-009) / §3.1.5 (FR-018), §7.1–7.3
**Implemented by:** [TASKSB.md](TASKSB.md) (which extends the original [Tasks.md](Tasks.md) v1.0 build)
**Date:** June 5, 2026

> This document contains rewritten copy for the sections affected by the pivot to AI-focused consulting. All technical sections (Tech Stack §4, DB Schema §4.2, Testing §8, Deployment §9) carry over unchanged except where noted.

---

## 1. Executive Summary (revised)

### 1.1 Project Overview
A professional consulting website positioning 25+ years of medical device injection molding expertise as the foundation for responsibly bringing **artificial intelligence and machine learning into injection molding manufacturing**. The platform serves as a marketing and lead-generation engine for AI-enablement consulting — spanning process optimization, quality and inspection, predictive maintenance, and (critically) the validation and governance of AI inside regulated manufacturing environments.

### 1.2 Business Objectives
- Establish a distinct position at the intersection of **injection molding domain expertise and applied AI** — not as a generic "AI consultant," but as the rare practitioner who can deploy AI *and* make it survive an FDA/ISO audit.
- Generate qualified leads for AI-enablement engagements (assessments, pilots, validation programs).
- Showcase that AI in molding is delivered through proven engineering method (DOE, scientific molding, process validation), not hype.
- Build thought leadership on the under-served question: *how do you validate and govern AI/ML in a regulated plant?*
- Serve both regulated (medical device — premium tier) and non-regulated (automotive, packaging, electronics) molders.

### 1.3 Target Audience
**Primary:**
- Medical device manufacturers exploring AI for process control, inspection, or uptime
- Quality / regulatory leaders who need AI deployed without breaking validation
- Plant, operations, and continuous-improvement leaders pursuing smart-factory / Industry 4.0 initiatives
- Molders (any sector) struggling with scrap, cycle time, energy, or unplanned downtime

**Secondary:**
- Digital transformation / data teams lacking molding domain context
- Equipment OEMs and integrators needing molding + AI subject-matter expertise
- Private equity / operating partners evaluating manufacturing modernization
- Startups developing injection-molded products who want data-driven scale-up

---

## 2. Core Service Areas (revised)

The four pillars below preserve deep molding credibility while making AI the through-line. A productized **AI Readiness Assessment** sits in front of them as the low-commitment entry point.

### 2.0 AI Readiness Assessment (entry offering — productized)
A fixed-scope, fixed-fee audit of a molding operation that answers: *Where would AI actually pay off, and where is it premature?* Deliverables: a data-maturity score, a prioritized opportunity map (effort vs. ROI), a sensor/data-infrastructure gap analysis, and a phased roadmap. Designed as a funnel into the engagements below.

### 2.1 AI-Augmented Process Development & Scientific Molding
- ML surrogate modeling of the process (predicting quality from parameters)
- Multi-objective optimization: cycle time, scrap, energy, and part quality simultaneously
- DOE accelerated and extended with machine learning
- Closed-loop / adaptive process control, including for variable materials (e.g., regrind, recycled resin)
- Parameter recommendation systems and digital process twins
- Tech-transfer and scale-up de-risking with data-driven methods

### 2.2 AI/ML Validation & Governance for Regulated Manufacturing *(key differentiator)*
- Validating ML-based process control and inspection under ISO 13485 and the new FDA QMSR (effective Feb 2, 2026)
- Computer Software Assurance (CSA) applied to AI-enabled manufacturing systems
- Model lifecycle governance: versioning, drift monitoring, retraining controls
- Change-control strategy for models that update over time (Predetermined Change Control thinking applied to process AI)
- Explainability (XAI) requirements so models are auditable, not black boxes
- Risk management (ISO 14971) extended to AI failure modes; audit-ready documentation

### 2.3 AI-Driven Quality Systems & Inspection
- Automated/vision-based defect detection (short shots, sink marks, warpage, flash)
- Predictive defect models and early-warning systems on live production
- Build-vs-buy evaluation for inspection AI and integration with existing QMS
- AI-assisted complaint, CAPA, and nonconformance pattern analysis
- Supplier quality analytics and incoming-material risk scoring

### 2.4 Smart Factory, Data & Facility Transformation
- Predictive maintenance programs (sensor strategy, models, ROI realism)
- IIoT architecture and the data foundation required before any AI works
- OEE / scrap / energy analytics and dashboards
- Facility, utility, and cleanroom design informed by data and connectivity needs
- LLM-based operator assistants to capture and transfer tribal knowledge

---

## 3. Public Website Copy (revised)

### 3.1.1 Home Page

**Hero**
- **Headline:** Bring AI to Injection Molding — Without Breaking Validation
- **Subheadline:** 25+ years in medical device manufacturing. I help molders deploy AI for process optimization, quality, and uptime — validated, explainable, and audit-ready.
- **Primary CTA:** Schedule a Consultation
- **Secondary CTA:** Get an AI Readiness Assessment

**Stats / metrics (FR-002)**
- 25+ years in injection molding manufacturing
- Medical device & regulated-manufacturing depth (ISO 13485 / QMSR)
- Process, quality, facility & automation projects delivered
- Applied AI grounded in DOE & scientific molding

**Service overview cards (FR-003 — 2×2 grid)**
1. **AI-Augmented Process Development** — Turn scientific molding and DOE into ML-driven optimization that cuts cycle time, scrap, and energy while holding quality.
2. **AI Validation & Governance** — Deploy AI in regulated plants the right way: validated under ISO 13485/QMSR, explainable, and ready for audit.
3. **AI-Driven Quality & Inspection** — Catch defects before they happen with predictive models and automated vision, integrated into your existing QMS.
4. **Smart Factory & Data** — Predictive maintenance, IIoT, and the data foundation that has to exist before any AI can deliver.

**Featured band (above contact CTA):** "Not sure where AI fits in your operation? Start with an AI Readiness Assessment — a fixed-scope audit that maps where AI pays off and where it's premature."

### 3.1.2 Services Page (intro copy)
> Most "AI for manufacturing" advice comes from data scientists who've never validated a process. I come from the molding floor — scientific molding, DOE, process validation, ISO 13485 — and layer AI on top of that rigor. The result is AI you can actually deploy in production and defend in an audit. I serve medical device manufacturers as a premium tier and apply the same methods, minus the regulatory weight, to automotive, packaging, and electronics molders.

Each pillar from §2 expands into discovery → design → pilot → validation → handoff, with explicit deliverables and an honest assessment of where AI is *not* the answer.

### 3.1.3 Services Page — Industry Applications (FR-009, revised)
The original FR-009 framed applications solely as medical-device classes (Class I/II/III, combination products, IVD, packaging). With the AI pivot serving multiple sectors, this section is reframed as **sectors served**, with medical device positioned as the premium (regulated) tier:
- **Medical Device (premium tier)** — Class I/II/III, combination products, IVD — full AI validation & governance under ISO 13485 / QMSR.
- **Automotive** — high-volume process optimization, scrap & cycle-time reduction, predictive maintenance.
- **Packaging** — throughput, energy, and quality optimization at scale.
- **Electronics / Connectors** — precision-part defect prediction and vision inspection.

The medical-device-class detail is preserved (it remains real proof of regulated depth) but is now *one tier within* a multi-sector offering, not the whole scope.

### 3.1.5 Contact Page — Service Interest dropdown (FR-018, revised options)
- AI Readiness Assessment
- AI Process Development & Optimization
- AI Validation & Governance
- AI Quality & Inspection
- Smart Factory / Predictive Maintenance
- General Inquiry

---

## 7. Content Requirements (revised)

### 7.2 Blog Content Strategy — revised initial topics
1. Validating AI/ML Process Control Under ISO 13485 and the New QMSR
2. From DOE to ML Surrogate Models: The Next Evolution of Scientific Molding
3. Predicting Molding Defects Before They Happen: A Practical Guide to ML Quality Models
4. Predictive Maintenance for Injection Molding: Where the ROI Actually Is
5. Explainable AI on the Molding Floor: Why Black-Box Models Fail Audits
6. Building the Data Foundation: Why Most Plants Aren't AI-Ready (Yet)
7. Computer Software Assurance (CSA) for AI-Enabled Manufacturing Systems
8. Closed-Loop Process Control with Machine Learning for Variable Materials
9. AI Vision Inspection for Medical Device Components: Build vs. Buy
10. Predetermined Change Control: Governing Models That Retrain
11. Multi-Objective Optimization: Balancing Cycle Time, Scrap & Energy with AI
12. LLM Operator Assistants: Capturing Tribal Knowledge in Molding Operations

**Content categories (revised):**
- AI & Process Optimization
- AI Validation & Compliance
- Smart Factory & Data
- Quality Systems & Inspection
- Industry Trends
- Case Studies

### 7.3 SEO Keywords (revised)

**Primary:**
- AI injection molding consultant
- Machine learning injection molding
- AI process optimization injection molding
- AI validation medical device manufacturing
- Scientific molding AI consultant

**Secondary:**
- Predictive maintenance injection molding
- AI defect detection injection molding
- Smart factory injection molding consultant
- ISO 13485 AI manufacturing
- Computer software assurance manufacturing
- Injection molding cycle time optimization machine learning

**Long-tail:**
- How to validate AI/ML in medical device manufacturing
- Machine learning for injection molding process control
- AI readiness assessment for an injection molding plant
- Reducing scrap in injection molding with AI
- Governing AI models under the FDA QMSR

---

---

## Voice & Brand Decision (applies across all revised copy)

**Decision (locked):** All copy uses the **first-person plural ("we") — the SIDEC Consulting firm voice.** The PRDB drafts below were written in "I"; when implemented they are adapted to "we" (e.g., *"We help molders deploy AI…"*, *"We come from the molding floor…"*). The brand still trades on deep individual expertise (25+ years), but speaks as a firm.

**Consistency requirement:** The current site already mixes some "we" copy; the transformation must apply the "we" voice **everywhere** — hero, services, about, contact, blog author bylines, email templates, and the chatbot persona — with no stray "I". Mixed voice reads as unfinished and undercuts trust. (Tracked in [TASKSB.md](TASKSB.md) T7.4.)

---

## Notes on unchanged / realigned sections
- **§3.1.1 FR-003 (service cards):** The original PRD specified **4** service overview cards. The interim build expanded this to 7. Returning to **4 AI pillars** *realigns* with the original FR-003 intent — this is a correction, not a new divergence.
- **§4 Technical Requirements / §4.2 DB Schema:** No structural change for the core pivot. The `ContactInquiry.serviceInterest` field stores the revised dropdown values above (string field already supports this — no migration needed). **Caveat:** the new AI-engagement *conditional* fields (e.g., data/sensor maturity, primary pain point) may require small nullable columns or reuse of existing optional fields — see TASKSB T3.2. Seed `Category` records to match the revised content categories.
- **§6 UI/UX:** Color palette and component specs carry over. Add imagery that signals data/AI (dashboards, sensors, optimization curves) alongside cleanroom/molding photography.
- **FUTURE items elevated into core scope:** This pivot promotes two originally-deferred items into the launch build because they are now central to *being convincing*: **FUTURE-005 (Case Studies)** — proof of quantified results — and **FUTURE-003 (Resource Library)** — repurposed as a downloadable AI-Readiness Checklist lead magnet. (FUTURE-001 Client Portal, FUTURE-002 Booking, and FUTURE-004 Newsletter are already built.)
- **§8 Testing / §9 Deployment:** Process unchanged; test scope expands to cover the new services, conditional fields, assessment page, case studies, and lead magnet (TASKSB Phase 8).