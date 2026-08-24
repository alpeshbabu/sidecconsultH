import Link from "next/link";
import type { Metadata } from "next";
import {
  Settings,
  ShieldCheck,
  Cog,
  Wrench,
  Building,
  Globe,
  Lightbulb,
  Cpu,
  BadgeCheck,
  ScanSearch,
  Network,
  ArrowRight,
  ArrowUpRight,
  Target,
  Shield,
  Clock,
  TrendingDown,
  Gauge,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout";
import { AnimatedStats, CTASection, NewsletterForm } from "@/components/sections";
import { SERVICE_AREAS, AI_SERVICES, STATS } from "@/lib/constants";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { BlogPostCard } from "@/components/blog";
import { createServiceSchema, getJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

// Icon name → component (covers both core services and AI services)
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  ShieldCheck,
  Cog,
  Wrench,
  Building,
  Globe,
  Lightbulb,
  Cpu,
  BadgeCheck,
  ScanSearch,
  Network,
};

const CERTS = ["ISO 13485", "FDA 21 CFR 820 / QMSR", "EU MDR", "ISO 14971"];

const DIFFERENTIATORS = [
  {
    icon: Target,
    title: "Deep Manufacturing Expertise",
    description:
      "25+ years on the molding floor — spanning manufacturing engineering, quality, design assurance, and R&D. We've done the work, not just advised on it.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory Confidence",
    description:
      "Director-level quality experience with ISO 13485, FDA, and EU MDR. We know what auditors look for and how to build systems that satisfy them.",
  },
  {
    icon: Cpu,
    title: "Smart Manufacturing",
    description:
      "We help integrate IIoT, connectivity, and data analytics to optimize process, quality, and uptime — providing clear operational visibility without the hype.",
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

const RESULTS = [
  { icon: TrendingDown, value: "15–30%", label: "Manufacturing Cost Reduction" },
  { icon: Gauge, value: "Higher", label: "First-Pass Yield" },
  { icon: BadgeCheck, value: "Clean", label: "Audit Outcomes" },
  { icon: Cpu, value: "Less", label: "Scrap & Downtime" },
];

const PROCESS = [
  { step: "01", title: "Discovery", description: "A thorough assessment of your current state, challenges, and objectives." },
  { step: "02", title: "Solution Design", description: "Tailored strategies and action plans aligned precisely with your goals and regulatory requirements." },
  { step: "03", title: "Implementation", description: "Execute the plan with hands-on support and expert engineering guidance alongside your team." },
  { step: "04", title: "Validation", description: "Verify results, document outcomes, and ensure sustainable, audit-ready success." },
];

export default async function HomePage() {
  // Fetch latest 3 published blog posts
  const latestPosts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: { select: { name: true, slug: true } },
      author: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  // Service schemas for JSON-LD (core + AI)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";
  const serviceSchemas = [...SERVICE_AREAS, ...AI_SERVICES].map((service) =>
    createServiceSchema(baseUrl, service.title, service.description)
  );

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: getJsonLd(serviceSchemas) }}
      />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute left-1/2 top-[-10%] h-[640px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container-wide py-20 md:py-28 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Left content */}
            <div className="reveal-up">
              <p className="eyebrow mb-6">Injection Molding & Medical Device Manufacturing</p>

              <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl md:text-6xl">
                Precision consulting for{" "}
                <span className="text-primary">injection molding & quality systems</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                25+ years of hands-on expertise in injection molding, ISO 13485
                quality systems, regulatory compliance, and facility design — with
                advanced smart manufacturing capabilities when you need them.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 w-full px-8 sm:w-auto">
                  <Link href="/schedule">
                    Schedule a Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 w-full px-8 sm:w-auto">
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>

              {/* Clean credentials row */}
              <div className="mt-12 border-t border-hairline pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.13em] text-muted-foreground">
                  Standards & Compliance
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CERTS.map((cert) => (
                    <span
                      key={cert}
                      className="rounded-md border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-foreground"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative reveal-up [animation-delay:120ms]">
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-2xl border border-hairline shadow-lg">
                <Image
                  src="/HomePageAssets/Hero1.png"
                  alt="Medical device injection molding manufacturing"
                  fill
                  sizes="(max-width: 1024px) 90vw, 28rem"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Clean floating stat */}
              <div className="absolute -bottom-5 -left-2 rounded-xl border border-hairline bg-card px-6 py-4 shadow-lg sm:left-4">
                <div className="font-display text-3xl font-bold text-foreground">25+</div>
                <div className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Years of Expertise
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <AnimatedStats stats={STATS} />

      {/* ============ CORE SERVICES ============ */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow mb-5">Consulting Services</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Comprehensive injection molding & medical device expertise
              </h2>
              <p className="mt-4 text-muted-foreground">
                From manufacturing engineering and quality systems to process
                validation and facility design — end-to-end support across your
                operation.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_AREAS.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className="card-technical group flex flex-col p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold transition-colors group-hover:text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <span className="mt-5 inline-flex items-center text-sm font-medium text-primary">
                    Learn more
                    <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SMART MANUFACTURING & ADVANCED CAPABILITIES ============ */}
      <section id="ai-services" className="section-padding surface-ink scroll-mt-20">
        <div className="container-wide">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow-plain mb-5 inline-flex items-center gap-2 text-signal">
                <Settings className="h-4 w-4" />
                Smart Manufacturing & Technology
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink-foreground sm:text-4xl text-balance">
                Smart manufacturing & advanced data analytics
              </h2>
              <p className="mt-4 text-ink-muted">
                We bring IIoT, connectivity, and data analytics to the floor where they
                deliver real value — ensuring your systems are validated, compliant,
                and audit-ready.
              </p>
            </div>
            <Button asChild variant="signal" className="h-11 shrink-0">
              <Link href="/services#ai-services">
                Explore Advanced Capabilities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {AI_SERVICES.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <Link key={service.id} href={service.href} className="group surface-ink p-7 transition-colors hover:bg-white/[0.03]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/15 text-signal transition-colors group-hover:border-signal/60">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <h3 className="mt-6 font-display text-base font-semibold text-ink-foreground">
                    {service.shortTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {service.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ WHY SIDEC ============ */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Why SIDEC</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              Manufacturing expertise you can build on
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Cross-functional experience across manufacturing, quality, design
              assurance, and R&D — with advanced smart manufacturing capabilities when you are ready to scale.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {DIFFERENTIATORS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="card-technical p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">{pillar.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{pillar.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {GUARANTEES.map((g) => {
              const Icon = g.icon;
              return (
                <div key={g.title} className="flex items-start gap-5 rounded-lg border border-hairline bg-muted/30 p-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{g.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{g.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ RESULTS ============ */}
      <section className="section-padding bg-muted/30 border-y border-hairline">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Results</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Outcomes you can measure and defend
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RESULTS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="rounded-lg border border-hairline bg-card p-7 text-center shadow-sm">
                  <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-3xl font-bold tracking-tight text-foreground">{m.value}</div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground/80">
            Typical engagement targets, not guarantees — actual results depend on
            your process, data, and starting point.
          </p>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-hairline shadow-lg">
                <Image
                  src="/HomePageAssets/AboutUs1.jpeg"
                  alt="SIDEC Consulting manufacturing engineering in the field"
                  fill
                  sizes="(max-width: 1024px) 90vw, 32rem"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 right-4 flex overflow-hidden rounded-xl border border-hairline bg-card shadow-lg md:right-8">
                <div className="px-5 py-3 text-center">
                  <div className="font-display text-2xl font-bold text-foreground">25+</div>
                  <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Years</div>
                </div>
                <div className="border-l border-hairline px-5 py-3 text-center">
                  <div className="font-display text-2xl font-bold text-foreground">100+</div>
                  <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Projects</div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="eyebrow mb-5">About SIDEC</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                25+ years of manufacturing excellence
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                With over two decades in medical device manufacturing, we bring
                deep, hands-on expertise across injection molding, ISO 13485
                quality systems, regulatory compliance, and facility design —
                including leadership roles at Fortune 500 medical device companies.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Scientific molding, DOE & process validation (IQ/OQ/PQ)",
                  "ISO 13485, FDA 21 CFR 820 / QMSR & EU MDR expertise",
                  "Global supplier quality, facility design & technology transfer",
                  "Smart manufacturing, process data & automated inspection",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button asChild variant="outline" size="lg">
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
      <section className="section-padding surface-ink">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow-plain mb-5 text-signal">Methodology</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-foreground sm:text-4xl">
              A proven process for measurable results
            </h2>
            <p className="mt-4 text-ink-muted">
              A structured, repeatable approach engineered to deliver outcomes
              you can document and defend.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((phase) => (
              <div key={phase.step} className="rounded-xl border border-white/10 bg-white/[0.03] p-7">
                <span className="font-display text-4xl font-bold text-signal/70">{phase.step}</span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-foreground">{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{phase.description}</p>
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
                Practical guidance on injection molding, quality systems, and operations
                for manufacturing professionals.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild className="shrink-0">
                <Link href="/resources/ai-readiness-checklist">
                  Free AI-Readiness Checklist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="shrink-0">
                <Link href="/resources">
                  View All Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {latestPosts.length > 0 && (
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
          )}

          <NewsletterForm />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <CTASection
        title="Ready to elevate your manufacturing operations?"
        description="Whether you need injection molding and quality expertise or want to explore where AI fits, let's discuss how we can help your organization succeed."
        primaryButtonText="Schedule a Consultation"
        primaryButtonHref="/schedule"
        secondaryButtonText="Explore Services"
        secondaryButtonHref="/services"
      />
    </MainLayout>
  );
}
