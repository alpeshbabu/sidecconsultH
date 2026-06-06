import Link from "next/link";
import type { Metadata } from "next";
import {
  Cpu,
  ShieldCheck,
  ScanSearch,
  Network,
  Cog,
  TrendingUp,
  TrendingDown,
  Timer,
  Activity,
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  Shield,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MainLayout } from "@/components/layout";
import { AnimatedStats, CTASection, NewsletterForm } from "@/components/sections";
import { SERVICE_AREAS, STATS } from "@/lib/constants";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { BlogPostCard } from "@/components/blog";
import { createServiceSchema, getJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  ShieldCheck,
  ScanSearch,
  Network,
};

const CERTS = ["ISO 13485", "FDA QMSR", "EU MDR", "ISO 14971"];

const PILLARS = [
  {
    icon: Cog,
    title: "Molding-Floor Credibility",
    spec: "Scientific Molding",
    description:
      "AI advice from people who've actually validated a process — DOE, scientific molding, IQ/OQ/PQ — not data scientists who've never seen a press.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-Survivable AI",
    spec: "ISO 13485 / QMSR",
    description:
      "Models that are validated, explainable, and documented to pass an FDA/ISO audit — the part most AI vendors quietly ignore.",
  },
  {
    icon: TrendingUp,
    title: "ROI Realism",
    spec: "Effort vs. ROI",
    description:
      "An honest map of where AI pays off and where it's premature — so you invest in the sensors and models that return, not the hype.",
  },
];

const GUARANTEES = [
  {
    icon: Shield,
    title: "Complete Confidentiality",
    description:
      "Your intellectual property is protected at the highest level. All discussions and materials remain strictly confidential.",
  },
  {
    icon: Clock,
    title: "24–48 Hour Response",
    description:
      "Every inquiry receives a thoughtful response within 24–48 business hours, keeping your project on track.",
  },
];

const PROCESS = [
  { step: "01", title: "Discovery", description: "Comprehensive assessment of your current state, challenges, and objectives." },
  { step: "02", title: "Solution Design", description: "Tailored strategies and action plans aligned precisely with your goals." },
  { step: "03", title: "Implementation", description: "Execute the plan with hands-on support and expert engineering guidance." },
  { step: "04", title: "Validation", description: "Verify results, document outcomes, and ensure sustainable, audit-ready success." },
];

export default async function HomePage() {
  // Fetch latest 3 published blog posts
  const latestPosts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });

  // Generate service schemas for JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";
  const serviceSchemas = SERVICE_AREAS.map((service) =>
    createServiceSchema(baseUrl, service.title, service.description)
  );

  return (
    <MainLayout>
      {/* JSON-LD Structured Data for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: getJsonLd(serviceSchemas) }}
      />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Blueprint grid backdrop */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
          <div className="absolute left-1/2 top-0 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container-wide py-20 md:py-28 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Left content */}
            <div className="reveal-up">
              <p className="eyebrow mb-6">
                25+ Years · Molding × Applied AI
              </p>

              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                Bring AI to injection molding —{" "}
                <span className="relative whitespace-nowrap text-signal">
                  without breaking validation
                  <span className="absolute inset-x-0 -bottom-1 h-px bg-signal/50" />
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                25+ years in medical device manufacturing. We help molders
                deploy AI for process optimization, quality, and uptime —
                validated, explainable, and audit-ready.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="technical" className="h-12 w-full px-8 sm:w-auto">
                  <Link href="/schedule">
                    Schedule a Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-sm border-hairline px-8 font-mono text-xs uppercase tracking-[0.12em] sm:w-auto"
                >
                  <Link href="/services#ai-readiness">Get an AI Readiness Assessment</Link>
                </Button>
              </div>

              {/* Instrument-panel trust row */}
              <dl className="mt-14 grid grid-cols-2 hairline-t hairline-b sm:grid-cols-4">
                {CERTS.map((cert, i) => (
                  <div
                    key={cert}
                    className={`px-4 py-4 ${i !== 0 ? "hairline-l sm:hairline-l" : ""} ${i === 2 ? "max-sm:hairline-l" : ""}`}
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Std {String(i + 1).padStart(2, "0")}
                    </dt>
                    <dd className="mt-1 font-mono text-xs font-medium tracking-wide text-foreground">
                      {cert}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right visual — spec frame */}
            <div className="relative reveal-up [animation-delay:120ms]">
              <div className="corner-marks relative aspect-[4/5] w-full max-w-md mx-auto border border-hairline p-2">
                {/* corner annotation */}
                <span className="absolute -top-3 left-6 bg-background px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Fig. 01 — Clean-room Molding
                </span>
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src="/HomePageAssets/Hero1.png"
                    alt="Medical device injection molding"
                    fill
                    sizes="(max-width: 1024px) 90vw, 28rem"
                    className="object-cover"
                    priority
                  />
                  {/* subtle technical tint — keeps the photo clearly visible */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/15 via-transparent to-signal/10" />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
              </div>

              {/* Spec readout strip */}
              <div className="mt-3 grid grid-cols-3 max-w-md mx-auto border border-hairline bg-card font-mono text-[10px] uppercase tracking-[0.14em]">
                {[
                  ["Tolerance", "±0.001″"],
                  ["Cavities", "Multi"],
                  ["Class", "ISO 7/8"],
                ].map(([k, v], i) => (
                  <div key={k} className={`px-3 py-2.5 ${i !== 0 ? "hairline-l" : ""}`}>
                    <div className="text-muted-foreground">{k}</div>
                    <div className="mt-0.5 text-foreground">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <AnimatedStats stats={STATS} />

      {/* ============ OUTCOMES ============ */}
      <section className="section-padding hairline-t">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">Outcomes</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              What validated AI delivers
            </h2>
            <p className="mt-3 text-muted-foreground">
              The point of AI on the molding floor isn&rsquo;t a demo — it&rsquo;s
              measurable improvement you can defend.
            </p>
          </div>

          <div className="mt-12 grid gap-px hairline border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: TrendingDown, value: "12–22%", label: "Less Scrap" },
              { icon: Timer, value: "8–15%", label: "Faster Cycle Times" },
              { icon: Activity, value: "Fewer", label: "Unplanned Stoppages" },
              { icon: ShieldCheck, value: "Audit-Ready", label: "Validated Models" },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="group bg-background p-7">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-3xl font-bold tracking-tight text-foreground">
                    {m.value}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-xs text-muted-foreground/80">
            Ranges are typical engagement targets, not guarantees — actual
            results depend on your process, data, and starting point.
          </p>
        </div>
      </section>

      {/* ============ WHY / PILLARS ============ */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5">Why SIDEC</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              AI you can deploy in production — and defend in an audit
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Most &ldquo;AI for manufacturing&rdquo; advice comes from data
              scientists who&rsquo;ve never validated a process. We come from the
              molding floor — and layer AI on top of that rigor.
            </p>
          </div>

          {/* Pillars — numbered technical entries */}
          <div className="mt-14 grid gap-px hairline border border-hairline bg-hairline md:grid-cols-3">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group relative bg-background p-8 transition-colors duration-300 hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
                      {pillar.spec}
                    </span>
                  </div>
                  <div className="mt-8 flex h-12 w-12 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Guarantees */}
          <div className="mt-px grid gap-px hairline border border-t-0 border-hairline bg-hairline md:grid-cols-2">
            {GUARANTEES.map((g) => {
              const Icon = g.icon;
              return (
                <div key={g.title} className="flex items-start gap-5 bg-background p-8">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-hairline text-signal">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{g.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {g.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SERVICES — CAPABILITIES INDEX ============ */}
      <section className="section-padding bg-muted/20 hairline-t">
        <div className="container-wide">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow mb-5">Capabilities Index</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Four pillars for AI in molding
              </h2>
              <p className="mt-3 text-muted-foreground">
                From ML-driven process optimization to audit-ready validation —
                grounded in scientific molding, not hype.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]">
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Index rows */}
          <div className="mt-12 border-t border-hairline">
            {SERVICE_AREAS.map((service, index) => {
              const Icon = iconMap[service.icon];
              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className="index-row group border-b border-hairline px-2 md:px-4"
                >
                  <span className="mt-1 w-10 shrink-0 font-mono text-sm text-muted-foreground transition-colors group-hover:text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-signal md:text-xl">
                      {service.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FEATURED BAND — AI READINESS ASSESSMENT ============ */}
      <section className="section-padding surface-ink relative overflow-hidden">
        <div className="grid-dots absolute inset-0 opacity-40" aria-hidden />
        <div className="container-wide relative">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow-plain mb-4 text-signal">
                <span aria-hidden>{"// "}</span>Start Here
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink-foreground sm:text-3xl text-balance">
                Not sure where AI fits in your operation?
              </h2>
              <p className="mt-4 text-ink-muted">
                Start with an <span className="text-ink-foreground font-medium">AI Readiness Assessment</span> — a
                fixed-scope audit that maps where AI pays off and where it&rsquo;s premature. You get a
                data-maturity score, a prioritized opportunity map, a sensor/data gap analysis, and a phased roadmap.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="signal"
              className="h-12 shrink-0 px-8"
            >
              <Link href="/services#ai-readiness">
                Get an AI Readiness Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="corner-marks relative aspect-[4/3] border border-hairline p-2">
                <span className="absolute -top-3 left-6 bg-background px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Fig. 02 — Field Operations
                </span>
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src="/HomePageAssets/AboutUs1.jpeg"
                    alt="SIDEC consulting in the field"
                    fill
                    sizes="(max-width: 1024px) 90vw, 32rem"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/12 to-transparent" />
                </div>
              </div>

              {/* Mono stat readout */}
              <div className="absolute -bottom-px right-4 flex border border-hairline bg-card font-mono md:right-8">
                <div className="px-5 py-3 text-center">
                  <div className="text-2xl font-bold text-foreground">25+</div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Years
                  </div>
                </div>
                <div className="hairline-l px-5 py-3 text-center">
                  <div className="text-2xl font-bold text-foreground">100+</div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Projects
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="eyebrow mb-5">About SIDEC</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Domain expertise, now applied to AI
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                With over two decades in medical device manufacturing, we bring
                deep expertise in injection molding, scientific molding, and
                process validation under ISO 13485 — and we now use it to bring
                AI and machine learning onto the molding floor, responsibly.
              </p>

              <ul className="mt-8 space-y-px border-y border-hairline">
                {[
                  "Scientific molding & DOE — extended with ML surrogate models",
                  "AI validation & governance under ISO 13485 / QMSR",
                  "Smart-factory, IIoT & predictive-maintenance data foundations",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4 py-3">
                    <Plus className="h-4 w-4 shrink-0 text-signal" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
                >
                  <Link href="/about">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="section-padding surface-ink relative overflow-hidden">
        <div className="grid-dots absolute inset-0 opacity-50" aria-hidden />
        <div className="container-wide relative">
          <div className="max-w-2xl">
            <p className="eyebrow-plain mb-5 text-signal">
              <span aria-hidden>{"// "}</span>Methodology
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-foreground sm:text-4xl">
              A proven process for measurable results
            </h2>
            <p className="mt-4 text-ink-muted">
              A structured, repeatable approach engineered to deliver outcomes
              you can document and defend.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-white/10 border border-white/10 md:grid-cols-4">
            {PROCESS.map((phase) => (
              <div key={phase.step} className="group surface-ink p-7">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-px bg-signal" />
                  <span className="font-display text-4xl font-bold text-white/15 transition-colors group-hover:text-signal/70">
                    {phase.step}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-ink-foreground">
                  {phase.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RESOURCES / BLOG ============ */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow mb-5">Resources & Insights</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Latest from the field
              </h2>
              <p className="mt-3 text-muted-foreground">
                Practical guidance on AI, machine learning, and validation for
                injection molding manufacturing professionals.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild variant="technical" className="shrink-0">
                <Link href="/resources/ai-readiness-checklist">
                  Free AI-Readiness Checklist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="shrink-0 rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]">
                <Link href="/resources">
                  View All Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {latestPosts.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  featuredImage={post.featuredImage}
                  category={post.category}
                  author={post.author}
                  publishedAt={post.publishedAt}
                  readingTime={post.readingTime}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "ISO 13485:2016 Implementation Guide",
                  excerpt: "A comprehensive guide to implementing ISO 13485 quality management systems for medical device manufacturers.",
                  category: "Quality Systems",
                },
                {
                  title: "Scientific Molding Best Practices",
                  excerpt: "The fundamentals of scientific molding and how to optimize your injection molding processes for consistency.",
                  category: "Process Development",
                },
                {
                  title: "FDA 21 CFR 820 Compliance Checklist",
                  excerpt: "Essential checklist for ensuring your quality system meets FDA requirements for medical device manufacturing.",
                  category: "Regulatory Compliance",
                },
              ].map((post, index) => (
                <Card key={index} className="card-technical group gap-0 overflow-hidden rounded-none py-0">
                  <div className="grid-blueprint relative flex aspect-video items-center justify-center bg-muted/40">
                    <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")} / Draft
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center border border-hairline text-signal">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                  </div>
                  <CardHeader className="pt-5">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
                        {post.category}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        Coming Soon
                      </span>
                    </div>
                    <CardTitle className="font-display text-lg leading-snug transition-colors group-hover:text-signal line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <NewsletterForm />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <CTASection
        title="Ready to find where AI pays off in your plant?"
        description="Let's discuss how validated, audit-ready AI can cut scrap, cycle time, and downtime — without breaking your process validation."
        primaryButtonText="Schedule a Consultation"
        primaryButtonHref="/schedule"
        secondaryButtonText="Get an AI Readiness Assessment"
        secondaryButtonHref="/services#ai-readiness"
      />
    </MainLayout>
  );
}
