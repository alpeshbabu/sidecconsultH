/**
 * AI blog migration — SAFE, idempotent, incremental.
 *
 * Unlike `prisma/seed.ts` (a full reset that also upserts the admin user and
 * resets its password), this script ONLY touches blog categories and posts:
 *   1. Upserts the 6 AI content categories (PRDB §7.2).
 *   2. Re-tags existing (medical) posts into the nearest AI category so none
 *      orphan — content is preserved, only the category changes.
 *   3. Retires the now-empty legacy categories.
 *   4. Creates the 3 flagship AI articles (PUBLISHED) and 9 drafts (DRAFT).
 *
 * It never creates or modifies users. Run with:  npx tsx prisma/seed-blog-ai.ts
 */
import "dotenv/config";
import { PostStatus, Role } from "../lib/generated/prisma";
import { createPrismaClient } from "../lib/prisma-factory";

const prisma = createPrismaClient();

// 6 AI content categories — slugs match lib/constants.ts BLOG_CATEGORIES.
const AI_CATEGORIES = [
  {
    name: "AI & Process Optimization",
    slug: "ai-process-optimization",
    description:
      "ML surrogate modeling, multi-objective optimization, and DOE extended with machine learning for injection molding.",
    sortOrder: 1,
  },
  {
    name: "AI Validation & Compliance",
    slug: "ai-validation-compliance",
    description:
      "Validating and governing AI/ML in regulated manufacturing — ISO 13485, the FDA QMSR, CSA, and explainability.",
    sortOrder: 2,
  },
  {
    name: "Smart Factory & Data",
    slug: "smart-factory-data",
    description:
      "Predictive maintenance, IIoT architecture, OEE/scrap/energy analytics, and the data foundation AI requires.",
    sortOrder: 3,
  },
  {
    name: "Quality Systems & Inspection",
    slug: "quality-inspection",
    description:
      "AI-driven defect detection, predictive quality models, vision inspection, and CAPA pattern analysis.",
    sortOrder: 4,
  },
  {
    name: "Industry Trends",
    slug: "industry-trends",
    description:
      "Developments at the intersection of AI, machine learning, and injection molding manufacturing.",
    sortOrder: 5,
  },
  {
    name: "Case Studies",
    slug: "case-studies",
    description:
      "Real-world examples of AI deployed in molding operations — problem, approach, and measured result.",
    sortOrder: 6,
  },
];

// Legacy category slug -> target AI category slug. Posts move; old cats retire.
const RETAG: Record<string, string> = {
  "manufacturing-engineering": "smart-factory-data",
  "quality-systems-compliance": "ai-validation-compliance",
  "process-development": "ai-process-optimization",
  "facility-design": "smart-factory-data",
  "equipment-mold-maintenance": "smart-factory-data",
};

const FLAGSHIP_POSTS = [
  {
    title: "Validating AI/ML Process Control Under ISO 13485 and the New QMSR",
    slug: "validating-ai-ml-process-control-iso-13485-qmsr",
    excerpt:
      "AI in a regulated plant lives or dies on validation. Here's how to deploy ML-based process control and inspection so it survives an FDA/ISO audit under the new QMSR.",
    categorySlug: "ai-validation-compliance",
    featuredImage:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200",
    readingTime: 13,
    metaTitle:
      "Validating AI/ML Process Control Under ISO 13485 & the FDA QMSR | SIDEC Consulting",
    metaDescription:
      "A practical guide to validating and governing ML-based process control and inspection in regulated injection molding — ISO 13485, FDA QMSR, CSA, and explainability.",
    content: `## The problem most AI vendors ignore

Deploying a machine-learning model that predicts defects or adjusts a molding process is the easy part. Making that model survive an FDA or notified-body audit is where most "AI for manufacturing" projects quietly fall apart. A model that can't be validated, explained, and governed has no business touching a regulated process — no matter how good its accuracy looks in a notebook.

With the FDA Quality Management System Regulation (QMSR) taking effect **February 2, 2026**, harmonizing 21 CFR Part 820 with ISO 13485:2016, the bar for software-driven manufacturing controls is explicit. This is a practical look at how to deploy ML so it holds up.

## Treat the model as a manufacturing process, not a science project

Under ISO 13485 §7.5.6, processes whose output cannot be fully verified by subsequent inspection must be **validated**. An ML model adjusting process parameters or flagging defects is exactly such a process. That means:

- **Defined intended use.** Document precisely what the model decides, its operating range, and what it must *not* be trusted to do.
- **Acceptance criteria up front.** Sensitivity, specificity, and false-negative tolerances defined *before* validation — not reverse-engineered from results.
- **IQ/OQ/PQ thinking applied to software.** Installation (environment, versions, data pipeline), operational (does it behave across the input range?), and performance (does it hold on real production data over time?).

## Computer Software Assurance (CSA), not box-checking

The FDA's CSA guidance shifts effort from exhaustive documentation toward **risk-based, critical-thinking** assurance. For a process-control model, the highest-risk failure modes — a missed critical defect, an unsafe parameter change — get the deepest testing and the strongest controls. Low-risk features get proportionate scrutiny. This is how you keep validation rigorous without drowning the program in paper.

## Explainability is a regulatory requirement, not a nicety

A black-box model that can't explain *why* it rejected a part or changed a setpoint is indefensible in an audit. Explainable AI (XAI) techniques — feature attribution, monotonicity constraints, surrogate decision rules — let a quality engineer and an auditor understand the model's reasoning. If you can't explain it, you can't validate it.

## Govern the model over its lifecycle

Models drift. Materials change, tools wear, and a model validated in March may be subtly wrong by September. Lifecycle governance is the part teams forget:

- **Versioning** every model, dataset, and training run, with traceability to the validated baseline.
- **Drift monitoring** on live inputs and outputs, with defined thresholds that trigger review.
- **Retraining controls** — who can retrain, on what data, and what re-validation is required before a new version goes live.

## Predetermined Change Control for models that retrain

Borrowing from the FDA's thinking on adaptive AI in devices, a **Predetermined Change Control Plan** defines, *in advance*, the envelope within which a model may update without a new submission or full re-validation: the data it may learn from, the performance bounds it must stay within, and the verification each update must pass. This is what makes a continuously-improving model compatible with a change-controlled quality system.

## Risk management (ISO 14971) extended to AI failure modes

Your risk management file should treat the model as a potential source of harm: what happens on a false negative, on silent drift, on bad input data, on an out-of-distribution part? Each AI-specific failure mode needs a control and a documented residual-risk justification.

## The bottom line

AI in a regulated molding plant is achievable today — but only if validation, explainability, and governance are designed in from the first line of code, not bolted on before the audit. The teams that get this right deploy models that cut scrap and downtime *and* pass inspection. The teams that don't end up with an impressive pilot that legal won't let them run.`,
  },
  {
    title: "From DOE to ML Surrogate Models: The Next Evolution of Scientific Molding",
    slug: "doe-to-ml-surrogate-models-scientific-molding",
    excerpt:
      "Design of Experiments built modern scientific molding. Machine-learning surrogate models are the natural next step — predicting quality from parameters and optimizing several objectives at once.",
    categorySlug: "ai-process-optimization",
    featuredImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    readingTime: 11,
    metaTitle:
      "From DOE to ML Surrogate Models: The Next Evolution of Scientific Molding | SIDEC Consulting",
    metaDescription:
      "How ML surrogate models extend DOE and scientific molding — predicting part quality from process parameters and optimizing cycle time, scrap, and energy simultaneously.",
    content: `## DOE got us here

Scientific molding made injection molding a data-driven discipline. Design of Experiments (DOE) let us map how process inputs — fill rate, pack pressure, melt and mold temperature, cooling — drive part quality, and find robust operating windows instead of guessing. It works. But classic DOE has limits: it scales poorly as factors multiply, it struggles with strong non-linear interactions, and each new question often means another study.

## What a surrogate model adds

A machine-learning **surrogate model** learns the relationship between process parameters and outcomes (dimensions, defects, mechanical properties) from data — DOE runs, production history, and sensor traces combined. Once trained, it predicts quality from a proposed parameter set *without* running the press. That changes what's possible:

- **Interpolate the whole process space**, not just the corners a DOE sampled.
- **Capture non-linear interactions** that a linear or quadratic DOE model misses.
- **Run thousands of virtual experiments** in seconds to find optimal settings.

Think of it as DOE's response surface, but richer, continuously improving, and able to ingest the data your plant already generates.

## Multi-objective optimization: the real win

Plants rarely optimize one thing. You want shorter cycle time **and** lower scrap **and** less energy **and** parts in spec — objectives that fight each other. A surrogate model paired with multi-objective optimization produces a **Pareto front**: the set of settings where you can't improve one objective without sacrificing another. Now the trade-off is an explicit business decision, not an operator's best guess.

## It still rests on scientific molding

This is not a replacement for molding fundamentals — it depends on them. The data has to come from a process that's already characterized and stable. Garbage in, garbage out applies brutally to surrogate models: bad sensor data or an uncharacterized process yields confident, wrong predictions. The teams who win here are the ones who already do scientific molding well and layer ML on top of that rigor.

## Variable materials and closed-loop control

Surrogate models shine where traditional fixed setpoints struggle — for example with **regrind or recycled resin**, where incoming material varies batch to batch. A model that maps material and process state to quality can drive **closed-loop, adaptive control**, nudging parameters in real time to hold quality as inputs drift.

## A pragmatic path

1. Consolidate the data you already have — DOE results, process monitoring, quality records.
2. Validate sensor quality and characterize the baseline process.
3. Train a surrogate on a well-understood part, and verify its predictions against held-out runs.
4. Use it first for *offline* optimization and parameter recommendation; move to closed-loop only once it's earned trust.
5. In regulated environments, validate and govern the model from the start.

## The bottom line

ML surrogate modeling is not hype layered on molding — it's the logical continuation of the scientific-molding journey that DOE started. The plants that already think in data are the ones positioned to capture it.`,
  },
  {
    title: "Predictive Maintenance for Injection Molding: Where the ROI Actually Is",
    slug: "predictive-maintenance-injection-molding-roi",
    excerpt:
      "Predictive maintenance is oversold and under-scoped. Here's an honest look at where it actually pays off in a molding operation — and where a simpler approach wins.",
    categorySlug: "smart-factory-data",
    featuredImage:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200",
    readingTime: 10,
    metaTitle:
      "Predictive Maintenance for Injection Molding: Where the ROI Actually Is | SIDEC Consulting",
    metaDescription:
      "A realistic guide to predictive maintenance in injection molding — which assets justify it, what data you need, and where reactive or preventive maintenance still wins.",
    content: `## The honest version

Predictive maintenance (PdM) is one of the most over-promised ideas in smart manufacturing. The pitch — sensors everywhere, AI predicting every failure — rarely survives contact with a real molding plant's budget or data reality. But under the hype there's genuine, bankable ROI, *if* you scope it to where it belongs.

## Match the strategy to the asset

Not every asset deserves PdM. Use a simple lens:

- **Reactive (run-to-failure)** is correct for cheap, redundant, low-consequence components. Predicting their failure costs more than the failure.
- **Preventive (time/cycle-based)** is correct where failure modes are well understood and wear is predictable — many mold-maintenance tasks live here.
- **Predictive (condition-based)** earns its keep on **high-consequence, hard-to-predict** assets: a press whose unplanned downtime stops a production line, a hot-runner system, a critical chiller or pump.

The ROI of PdM is concentrated in a small number of assets. Spread it everywhere and you've bought a science project.

## Where molding-specific ROI shows up

- **Unplanned press downtime** — the headline cost. Catching a developing hydraulic, heater, or drive issue before it stops the line is where PdM pays.
- **Hot runners and tooling** — early detection of clogging, heater drift, or wear that would otherwise produce scrap before anyone notices.
- **Auxiliary equipment** — chillers, dryers, and pumps whose quiet degradation drives energy waste and quality drift long before they fail outright.

## The data foundation has to exist first

This is the step vendors skip. A model can only predict what the data can see. Before PdM delivers, you usually need:

- Relevant sensing (vibration, temperature, pressure, motor current) on the *right* assets.
- A way to collect and store time-series data reliably (the IIoT plumbing).
- Enough history — including some failures — for a model to learn the signature of degradation.

If that foundation isn't there, the honest first project is building it, not buying an AI model.

## Start with ROI realism, not sensors

The right entry point is an assessment: which assets actually drive downtime and scrap cost, what would catching their failures early be worth, and what data exists today. Often the first move is a cheap win — better preventive intervals informed by existing data, or instrumenting two or three critical assets — not a plant-wide rollout.

## The bottom line

Predictive maintenance works. It just doesn't work *everywhere*, and it doesn't work without data. Target the few high-consequence assets where unplanned failure is expensive and hard to foresee, build the data foundation honestly, and PdM becomes one of the clearest ROI cases in the smart factory. Treat it as a magic box you sprinkle across the plant, and it becomes an expensive disappointment.`,
  },
];

// 9 remaining PRDB §7.2 topics — created as DRAFT to flesh out post-launch.
const DRAFT_POSTS: Array<{
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: string;
}> = [
  {
    title: "Explainable AI on the Molding Floor: Why Black-Box Models Fail Audits",
    slug: "explainable-ai-molding-floor-black-box-models-fail-audits",
    excerpt:
      "If a quality engineer can't understand why a model rejected a part, neither can an auditor. Why explainability is a prerequisite for AI in regulated molding.",
    categorySlug: "ai-validation-compliance",
  },
  {
    title: "Building the Data Foundation: Why Most Plants Aren't AI-Ready (Yet)",
    slug: "building-data-foundation-most-plants-not-ai-ready",
    excerpt:
      "Before any model delivers, the data has to exist, be trustworthy, and be connected. A realistic look at what AI readiness actually requires.",
    categorySlug: "smart-factory-data",
  },
  {
    title: "Computer Software Assurance (CSA) for AI-Enabled Manufacturing Systems",
    slug: "computer-software-assurance-csa-ai-manufacturing-systems",
    excerpt:
      "How the FDA's risk-based CSA approach applies to AI-enabled process control and inspection — rigorous where it matters, proportionate everywhere else.",
    categorySlug: "ai-validation-compliance",
  },
  {
    title: "Closed-Loop Process Control with Machine Learning for Variable Materials",
    slug: "closed-loop-process-control-ml-variable-materials",
    excerpt:
      "Regrind and recycled resin make fixed setpoints fragile. How ML-driven adaptive control holds quality as incoming material varies.",
    categorySlug: "ai-process-optimization",
  },
  {
    title: "AI Vision Inspection for Medical Device Components: Build vs. Buy",
    slug: "ai-vision-inspection-medical-device-components-build-vs-buy",
    excerpt:
      "An honest framework for deciding whether to build vision-based defect detection in-house or buy it — and how to integrate either with your QMS.",
    categorySlug: "quality-inspection",
  },
  {
    title: "Predetermined Change Control: Governing Models That Retrain",
    slug: "predetermined-change-control-governing-models-that-retrain",
    excerpt:
      "How to define, in advance, the envelope in which a model may update without a full re-validation — keeping adaptive AI compatible with a quality system.",
    categorySlug: "ai-validation-compliance",
  },
  {
    title: "Multi-Objective Optimization: Balancing Cycle Time, Scrap & Energy with AI",
    slug: "multi-objective-optimization-cycle-time-scrap-energy-ai",
    excerpt:
      "Cycle time, scrap, energy, and quality fight each other. How ML and Pareto optimization make the trade-off an explicit decision instead of a guess.",
    categorySlug: "ai-process-optimization",
  },
  {
    title: "LLM Operator Assistants: Capturing Tribal Knowledge in Molding Operations",
    slug: "llm-operator-assistants-capturing-tribal-knowledge-molding",
    excerpt:
      "Decades of process know-how walk out the door at retirement. How LLM-based assistants capture and transfer that tribal knowledge on the floor.",
    categorySlug: "smart-factory-data",
  },
  {
    title: "Predicting Molding Defects Before They Happen: A Practical Guide to ML Quality Models",
    slug: "predicting-molding-defects-before-they-happen-ml-quality-models",
    excerpt:
      "A practical guide to predictive defect models and early-warning systems on live production — catching short shots, sink, warpage, and flash before they ship.",
    categorySlug: "quality-inspection",
  },
];

async function main() {
  console.log("🌱 AI blog migration starting...");

  // 1. Upsert AI categories.
  const slugToId: Record<string, string> = {};
  for (const c of AI_CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    slugToId[c.slug] = created.id;
  }
  console.log(`✅ Upserted ${AI_CATEGORIES.length} AI categories`);

  // 2. Re-tag posts from legacy categories into AI categories, then retire the
  //    now-empty legacy category.
  for (const [oldSlug, newSlug] of Object.entries(RETAG)) {
    const oldCat = await prisma.category.findUnique({ where: { slug: oldSlug } });
    if (!oldCat) continue;
    const moved = await prisma.blogPost.updateMany({
      where: { categoryId: oldCat.id },
      data: { categoryId: slugToId[newSlug] },
    });
    await prisma.category.delete({ where: { id: oldCat.id } });
    console.log(`↪ ${oldSlug} → ${newSlug} (${moved.count} posts moved, old category removed)`);
  }

  // 3. Author = an existing admin (looked up, never created/modified).
  const admin = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  const authorId = admin?.id;
  if (!authorId) {
    console.warn("⚠️  No ADMIN user found — posts will be created without an author.");
  }

  // 4. Flagship articles (PUBLISHED).
  let published = 0;
  // Stable, deterministic publish dates (most recent first).
  const pubDates = ["2026-06-01", "2026-05-25", "2026-05-18"];
  for (let i = 0; i < FLAGSHIP_POSTS.length; i++) {
    const p = FLAGSHIP_POSTS[i];
    const categoryId = slugToId[p.categorySlug];
    const base = {
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      featuredImage: p.featuredImage,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(pubDates[i]),
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      readingTime: p.readingTime,
      categoryId,
      authorId,
    };
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: base,
      create: { ...base, slug: p.slug },
    });
    published++;
  }
  console.log(`✅ Upserted ${published} flagship articles (PUBLISHED)`);

  // 5. Remaining topics (DRAFT).
  let drafts = 0;
  for (const p of DRAFT_POSTS) {
    const categoryId = slugToId[p.categorySlug];
    const base = {
      title: p.title,
      excerpt: p.excerpt,
      content: `> Draft — outline below.\n\n## ${p.title}\n\n${p.excerpt}\n\n_Full article in progress._`,
      status: PostStatus.DRAFT,
      metaTitle: `${p.title} | SIDEC Consulting`,
      metaDescription: p.excerpt,
      readingTime: 8,
      categoryId,
      authorId,
    };
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: base,
      create: { ...base, slug: p.slug },
    });
    drafts++;
  }
  console.log(`✅ Upserted ${drafts} draft articles (DRAFT)`);

  console.log("\n🎉 AI blog migration complete.");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📁 AI categories: ${AI_CATEGORIES.length}`);
  console.log(`📝 Published flagships: ${published}`);
  console.log(`📝 Drafts: ${drafts}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Error in AI blog migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
