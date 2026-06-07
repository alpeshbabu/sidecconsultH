import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ClipboardCheck,
  Cpu,
  ShieldCheck,
  ScanSearch,
  Network,
  Target,
  Users,
  Shield,
  Zap,
  Gauge,
  Map,
  Database,
  Route,
  HeartPulse,
  Car,
  Package,
  CircuitBoard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout";
import { CTASection } from "@/components/sections";
import { createBreadcrumbSchema, getJsonLd } from "@/lib/structured-data";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI for injection molding, deployed by manufacturing experts: AI-augmented process development, AI validation & governance under ISO 13485/QMSR, AI-driven quality & inspection, and smart-factory data foundations.",
  openGraph: {
    title: "AI Services for Injection Molding | SIDEC Consulting",
    description:
      "AI process optimization, validation & governance, quality & inspection, and smart-factory data — grounded in scientific molding, not hype.",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Services for Injection Molding | SIDEC Consulting",
    description:
      "AI process optimization, validation & governance, quality & inspection, and smart-factory data — grounded in scientific molding, not hype.",
  },
  alternates: {
    canonical: "/services",
  },
};

// The four AI pillars (PRDB §2). Authoritative content rendered directly —
// the public services offering is a fixed editorial set.
const PILLARS = [
  {
    id: "ai-process",
    icon: Cpu,
    title: "AI-Augmented Process Development",
    tagline: "Scientific molding, extended with machine learning",
    differentiator: false,
    description:
      "We turn scientific molding and DOE into ML-driven optimization — predicting quality from parameters and balancing cycle time, scrap, and energy at once, without giving up part quality.",
    keyOfferings: [
      "ML surrogate modeling of the process (predicting quality from parameters)",
      "Multi-objective optimization: cycle time, scrap, energy, and quality simultaneously",
      "DOE accelerated and extended with machine learning",
      "Closed-loop / adaptive process control, including for variable materials (regrind, recycled resin)",
      "Parameter recommendation systems and digital process twins",
      "Tech-transfer and scale-up de-risking with data-driven methods",
    ],
    outcomes: [
      "Lower scrap (target 12–22%)",
      "Faster cycle times (target 8–15%)",
      "Reduced energy per part",
      "De-risked, faster scale-up",
    ],
  },
  {
    id: "ai-validation",
    icon: ShieldCheck,
    title: "AI Validation & Governance",
    tagline: "Deploy AI in regulated plants — and survive the audit",
    differentiator: true,
    description:
      "The part most AI vendors ignore. We validate ML-based process control and inspection under ISO 13485 and the new FDA QMSR, make models explainable, and produce documentation that holds up in an audit.",
    keyOfferings: [
      "Validating ML-based process control and inspection under ISO 13485 and the FDA QMSR (effective Feb 2, 2026)",
      "Computer Software Assurance (CSA) applied to AI-enabled manufacturing systems",
      "Model lifecycle governance: versioning, drift monitoring, retraining controls",
      "Change-control strategy for models that update over time (Predetermined Change Control thinking)",
      "Explainability (XAI) so models are auditable, not black boxes",
      "Risk management (ISO 14971) extended to AI failure modes; audit-ready documentation",
    ],
    outcomes: [
      "Audit-ready AI documentation",
      "Validated ML control & inspection",
      "Clean regulatory inspections",
      "Defensible model governance",
    ],
  },
  {
    id: "ai-quality",
    icon: ScanSearch,
    title: "AI-Driven Quality & Inspection",
    tagline: "Catch defects before they happen",
    differentiator: false,
    description:
      "We deploy predictive defect models and automated vision on live production, and integrate them into your existing QMS — with an honest build-vs-buy call instead of a sales pitch.",
    keyOfferings: [
      "Automated / vision-based defect detection (short shots, sink marks, warpage, flash)",
      "Predictive defect models and early-warning systems on live production",
      "Build-vs-buy evaluation for inspection AI and integration with existing QMS",
      "AI-assisted complaint, CAPA, and nonconformance pattern analysis",
      "Supplier quality analytics and incoming-material risk scoring",
    ],
    outcomes: [
      "Defects caught before they ship",
      "Lower inspection cost",
      "Faster CAPA root-cause",
      "Higher first-pass yield",
    ],
  },
  {
    id: "smart-factory",
    icon: Network,
    title: "Smart Factory & Data",
    tagline: "The data foundation AI actually needs",
    differentiator: false,
    description:
      "Predictive maintenance, IIoT architecture, and the OEE/scrap/energy data foundation that has to exist before any AI can deliver — plus LLM operator assistants that capture tribal knowledge before it walks out the door.",
    keyOfferings: [
      "Predictive maintenance programs (sensor strategy, models, ROI realism)",
      "IIoT architecture and the data foundation required before any AI works",
      "OEE / scrap / energy analytics and dashboards",
      "Facility, utility, and cleanroom design informed by data and connectivity needs",
      "LLM-based operator assistants to capture and transfer tribal knowledge",
    ],
    outcomes: [
      "Less unplanned downtime",
      "Higher OEE",
      "A real data foundation",
      "Captured tribal knowledge",
    ],
  },
];

// AI Readiness Assessment — productized entry offering (PRDB §2.0)
const ASSESSMENT_DELIVERABLES = [
  {
    icon: Gauge,
    title: "Data-Maturity Score",
    description:
      "An honest read on where your sensors, SPC, and data infrastructure stand today.",
  },
  {
    icon: Map,
    title: "Opportunity Map",
    description:
      "Prioritized AI opportunities plotted on effort vs. ROI — what to do first, and what to skip.",
  },
  {
    icon: Database,
    title: "Sensor / Data Gap Analysis",
    description:
      "Exactly what data and instrumentation you need before any model can deliver.",
  },
  {
    icon: Route,
    title: "Phased Roadmap",
    description:
      "A staged plan from quick wins to validated, audit-ready deployment.",
  },
];

// Sectors served (PRDB §3.1.3) — medical as the premium/regulated tier
const SECTORS = [
  {
    icon: Car,
    name: "Automotive",
    value:
      "High-volume process optimization, scrap and cycle-time reduction, and predictive maintenance.",
  },
  {
    icon: Package,
    name: "Packaging",
    value:
      "Throughput, energy, and quality optimization at scale across high-cavitation tooling.",
  },
  {
    icon: CircuitBoard,
    name: "Electronics & Connectors",
    value:
      "Precision-part defect prediction and automated vision inspection for tight tolerances.",
  },
];

// Why work with us
const whyChooseUs = [
  {
    icon: Target,
    title: "Molding-Floor Credibility",
    description:
      "We've actually validated processes — scientific molding, DOE, IQ/OQ/PQ — so our AI fits how a plant really runs.",
  },
  {
    icon: Shield,
    title: "Audit-Survivable AI",
    description:
      "Director-level quality experience means we build models that are explainable, documented, and ready for an FDA/ISO audit.",
  },
  {
    icon: Zap,
    title: "ROI Realism",
    description:
      "We tell you where AI pays off and where it's premature — no hype, no models that never leave the pilot.",
  },
  {
    icon: Users,
    title: "Hands-On Handoff",
    description:
      "We work alongside your team and leave behind capability — not a black box only we can maintain.",
  },
];

const engagementModels = [
  {
    title: "AI Readiness Assessment",
    description:
      "Fixed-scope, fixed-fee audit that maps where AI pays off and where it's premature",
    examples: ["Data-maturity score", "Opportunity map", "Phased roadmap"],
  },
  {
    title: "Pilot & Build",
    description:
      "Defined-scope engagements that take a prioritized opportunity from data to validated model",
    examples: ["ML process optimization", "Vision inspection", "Predictive maintenance"],
  },
  {
    title: "Validation & Advisory",
    description:
      "Ongoing governance and validation support for AI running in regulated production",
    examples: ["CSA & model validation", "Drift & change control", "Audit preparation"],
  },
];

const APPROACH = [
  {
    phase: "01",
    title: "Discovery & Assessment",
    description:
      "We start with your data, processes, and goals — stakeholder interviews, a sensor/data gap analysis, and an honest read on where AI fits and where it doesn't.",
    deliverables: ["Data-maturity score", "Opportunity map", "Gap analysis", "Scope definition"],
  },
  {
    phase: "02",
    title: "Solution Design",
    description:
      "We design the model and the data pipeline around your process and regulatory reality — including the validation and explainability strategy from day one.",
    deliverables: ["Model approach", "Data pipeline plan", "Validation strategy", "Risk assessment"],
  },
  {
    phase: "03",
    title: "Pilot Deployment",
    description:
      "We build and pilot on real production data, working alongside your team — proving the model earns its place before it's trusted.",
    deliverables: ["Working pilot", "Performance results", "Team enablement", "Integration plan"],
  },
  {
    phase: "04",
    title: "Validation & Handoff",
    description:
      "We validate the model under your QMS, produce audit-ready documentation, and hand off governance so your team can run and defend it independently.",
    deliverables: ["Validation package", "Audit-ready docs", "Governance plan", "Knowledge transfer"],
  },
];

export default function ServicesPage() {
  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getJsonLd(
            createBreadcrumbSchema(baseUrl, [
              { name: "Home", url: "/" },
              { name: "Services", url: "/services" },
            ])
          ),
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
        </div>

        <div className="container-wide py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-6 justify-center">Consulting Services</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              AI for injection molding,{" "}
              <span className="text-signal">deployed the right way</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Most &ldquo;AI for manufacturing&rdquo; advice comes from data
              scientists who&rsquo;ve never validated a process. We come from the
              molding floor — scientific molding, DOE, process validation, ISO
              13485 — and layer AI on top of that rigor. The result is AI you can
              actually deploy in production and defend in an audit. We serve
              medical device manufacturers as a premium tier and apply the same
              methods, minus the regulatory weight, to automotive, packaging, and
              electronics molders.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="technical">
                <Link href="/schedule">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
              >
                <Link href="#ai-readiness">Start With an Assessment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Readiness Assessment — productized entry offering */}
      <section
        id="ai-readiness"
        className="section-padding surface-ink relative overflow-hidden scroll-mt-24"
      >
        <div className="grid-dots absolute inset-0 opacity-40" aria-hidden />
        <div className="container-wide relative">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="eyebrow-plain mb-4 text-signal">
                <span aria-hidden>{"// "}</span>Start Here
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink-foreground sm:text-4xl text-balance">
                AI Readiness Assessment
              </h2>
              <p className="mt-4 text-lg text-ink-muted">
                Where would AI actually pay off — and where is it premature?
              </p>
              <p className="mt-4 text-ink-muted leading-relaxed">
                A fixed-scope, fixed-fee audit of your molding operation. It&rsquo;s
                the low-commitment way to find the real opportunities before you
                invest in sensors, models, or vendors — and it&rsquo;s the on-ramp to
                every engagement below.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="signal" className="h-12 px-8">
                  <Link href="/contact?service=ai-readiness">
                    Get an AI Readiness Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                Fixed scope · Fixed fee · Phased roadmap
              </p>
            </div>

            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
              {ASSESSMENT_DELIVERABLES.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="surface-ink p-7">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center border border-white/15 text-signal">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-ink-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pillar Quick Navigation */}
      <section className="hairline-t hairline-b bg-muted/20 py-8" id="pillars">
        <div className="container-wide">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Link key={pillar.id} href={`#${pillar.id}`} className="group">
                  <Card className="card-technical h-full rounded-none">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-semibold leading-snug transition-colors group-hover:text-signal">
                          {pillar.title}
                        </h3>
                        {pillar.differentiator && (
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-signal">
                            Key Differentiator
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pillars Detail */}
      <div id="services">
        {PILLARS.map((pillar, index) => {
          const ServiceIcon = pillar.icon;
          const isEven = index % 2 === 0;
          return (
            <section
              key={pillar.id}
              id={pillar.id}
              className={`section-padding hairline-t scroll-mt-24 ${index % 2 === 1 ? "bg-muted/20" : ""}`}
            >
              <div className="container-wide">
                <Card className="card-technical gap-0 overflow-hidden rounded-none py-0">
                  <div className="grid gap-0 lg:grid-cols-2">
                    {/* Content Side */}
                    <div className={`p-6 md:p-8 ${isEven ? "" : "lg:order-2"}`}>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center border border-hairline text-primary">
                          <ServiceIcon className="h-7 w-7" />
                        </div>
                        {pillar.differentiator && (
                          <span className="rounded-sm border border-signal/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-signal">
                            Key Differentiator
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-2xl font-bold tracking-tight">
                        {pillar.title}
                      </h2>
                      <p className="mt-1 text-lg font-medium text-signal">
                        {pillar.tagline}
                      </p>
                      <p className="mt-4 leading-relaxed text-muted-foreground">
                        {pillar.description}
                      </p>

                      {/* Outcomes */}
                      <div className="mt-6">
                        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Typical Outcomes
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {pillar.outcomes.map((outcome) => (
                            <span
                              key={outcome}
                              className="rounded-sm border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                            >
                              {outcome}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground/80">
                          Outcome ranges are typical engagement targets, not
                          guarantees — actual results depend on your process and data.
                        </p>
                      </div>

                      <div className="mt-6">
                        <Button asChild variant="technical">
                          <Link href="/contact?service=ai-readiness">
                            Discuss Your Operation
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Key Offerings Side */}
                    <div className={`bg-muted/20 p-6 md:p-8 ${isEven ? "lg:hairline-l" : "lg:order-1 lg:hairline-r"}`}>
                      <div className="mb-4 flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-signal" />
                        <h3 className="font-display font-semibold">What We Deliver</h3>
                      </div>
                      <ul className="space-y-px border-y border-hairline">
                        {pillar.keyOfferings.map((offering) => (
                          <li key={offering} className="flex items-start gap-3 py-2.5">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                            <span className="text-sm">{offering}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          );
        })}
      </div>

      {/* Why Work With Us */}
      <section className="section-padding surface-ink relative overflow-hidden">
        <div className="grid-dots absolute inset-0 opacity-50" aria-hidden />
        <div className="container-wide relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow-plain mb-5 flex justify-center text-signal">
              <span aria-hidden>{"// "}</span>Why SIDEC
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-foreground sm:text-4xl">
              AI you can deploy — and defend
            </h2>
            <p className="mt-4 text-lg text-ink-muted">
              What sets us apart from data scientists who&rsquo;ve never seen a press
            </p>
          </div>

          <div className="mt-16 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group surface-ink p-7 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-white/15 text-signal transition-colors group-hover:border-signal/60">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Delivery Approach */}
      <section className="section-padding hairline-t">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Our Approach</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Discovery → Design → Pilot → Validation → Handoff
            </h2>
            <p className="mt-4 text-muted-foreground">
              A structured method that proves a model earns its place — and leaves
              it validated, documented, and yours to run.
            </p>
          </div>

          <div className="relative mt-16">
            <div className="grid gap-px hairline border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-4">
              {APPROACH.map((step) => (
                <div key={step.phase} className="group relative bg-background p-7">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-px bg-signal" />
                    <span className="font-display text-4xl font-bold text-primary/15 transition-colors group-hover:text-signal/70">
                      {step.phase}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  <div className="mt-5 border-t border-hairline pt-4">
                    <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Key Deliverables
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((item) => (
                        <span
                          key={item}
                          className="rounded-sm border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="section-padding hairline-t bg-muted/20">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">How We Work</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Flexible Engagement Models
            </h2>
            <p className="mt-4 text-muted-foreground">
              Start small with an assessment, then scale to pilots and ongoing
              validation as the ROI proves out
            </p>
          </div>

          <div className="mt-16 grid gap-px hairline border border-hairline bg-hairline md:grid-cols-3">
            {engagementModels.map((model, index) => (
              <div key={model.title} className="group bg-background p-7 text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className="h-3 w-px bg-signal" />
                  <span className="font-display text-4xl font-bold text-primary/15 transition-colors group-hover:text-signal/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">
                  {model.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {model.description}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {model.examples.map((example) => (
                    <span
                      key={example}
                      className="rounded-sm border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Served */}
      <section className="section-padding hairline-t">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Sectors We Serve</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Medical device as the premium tier — and beyond
            </h2>
            <p className="mt-4 text-muted-foreground">
              We bring full AI validation and governance to regulated medical
              device manufacturing, and apply the same methods — minus the
              regulatory weight — to other precision molders.
            </p>
          </div>

          {/* Premium tier — Medical */}
          <div className="mt-12">
            <Card className="card-technical gap-0 overflow-hidden rounded-none py-0">
              <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center border border-hairline text-primary">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <span className="rounded-sm border border-signal/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-signal">
                      Premium Tier
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    Medical Device
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    AI deployed under ISO 13485 and the FDA QMSR — validated,
                    explainable, and audit-ready across all device risk classes
                    and combination products.
                  </p>
                </div>
                <div className="bg-muted/20 p-6 md:p-8 lg:hairline-l">
                  <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Within the medical tier — all device classes
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { c: "Class I", r: "Low Risk" },
                      { c: "Class II", r: "Moderate Risk" },
                      { c: "Class III", r: "High Risk" },
                    ].map((d) => (
                      <div key={d.c} className="border border-hairline p-4">
                        <div className="font-display text-xl font-bold">{d.c}</div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-signal">
                          {d.r}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Including combination products, in-vitro diagnostics, drug-delivery
                    devices, and sterile packaging components.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Other sectors */}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {SECTORS.map((sector) => {
              const Icon = sector.icon;
              return (
                <Card key={sector.name} className="card-technical group h-full rounded-none">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-display font-semibold">{sector.name}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {sector.value}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Not sure where AI fits in your operation?"
        description="Every engagement starts with understanding your process and data. Start with a fixed-scope AI Readiness Assessment, or schedule a consultation to talk it through."
        primaryButtonText="Get an AI Readiness Assessment"
        primaryButtonHref="/contact?service=ai-readiness"
        secondaryButtonText="Schedule a Consultation"
        secondaryButtonHref="/schedule"
      />
    </MainLayout>
  );
}
