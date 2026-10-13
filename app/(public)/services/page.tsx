import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
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
  Target,
  Users,
  Shield,
  Zap,
  Sparkles,
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
    "Expert consulting for injection molding & medical device manufacturing — manufacturing engineering, quality & regulatory compliance, scientific molding, facility design, supplier development — with advanced smart manufacturing capabilities.",
  openGraph: {
    title: "Services | SIDEC Consulting",
    description:
      "Injection molding & medical device manufacturing consulting — quality, process, facility, supplier — with advanced smart manufacturing capabilities.",
    url: "/services",
  },
  alternates: { canonical: "/services" },
};

type ServiceItem = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  description: string;
  keyOfferings: string[];
  outcomes: string[];
  differentiator?: boolean;
};

// Core consulting services — injection molding & medical device manufacturing
const CORE_SERVICES: ServiceItem[] = [
  {
    id: "manufacturing-engineering",
    icon: Settings,
    title: "Manufacturing Engineering & Operations",
    tagline: "Build world-class manufacturing capabilities",
    description:
      "We help companies build and optimize their manufacturing engineering organizations — from talent and process to sustainable, repeatable improvement.",
    keyOfferings: [
      "Manufacturing engineering team development and organizational design",
      "Process optimization and continuous improvement programs",
      "Lean manufacturing and Six Sigma implementation",
      "Equipment selection, qualification, and optimization",
      "Manufacturing cost reduction strategies",
      "Production capacity planning and scaling",
    ],
    outcomes: [
      "15–30% manufacturing cost reduction",
      "Improved first-pass yield",
      "Faster time-to-market",
      "Sustainable internal capability",
    ],
  },
  {
    id: "quality-regulatory",
    icon: ShieldCheck,
    title: "Quality & Regulatory Compliance",
    tagline: "Navigate regulatory requirements with confidence",
    description:
      "With director-level quality experience, we build robust quality systems that satisfy FDA, ISO, and global requirements while staying practical to operate.",
    keyOfferings: [
      "ISO 13485 Quality Management System implementation",
      "FDA 21 CFR Part 820 / QMSR compliance programs",
      "EU MDR (2017/745) transition and compliance",
      "MDSAP certification preparation",
      "510(k) submission support and strategy",
      "Design controls and risk management (ISO 14971)",
      "CAPA system optimization",
      "Audit preparation (FDA, Notified Bodies, customers)",
    ],
    outcomes: [
      "Successful regulatory submissions",
      "Clean audit results",
      "Efficient quality systems",
      "Reduced compliance burden",
    ],
  },
  {
    id: "injection-molding",
    icon: Cog,
    title: "Injection Molding Excellence (Plastics & LSR)",
    tagline: "Thermoplastics & LSR molding for medical devices",
    description:
      "As recognized molding subject-matter experts, we bring deep expertise in scientific molding, process development, validation, and troubleshooting for both thermoplastics and Liquid Silicone Rubber (LSR) medical device components.",
    keyOfferings: [
      "Scientific molding methodology implementation",
      "Process development and optimization",
      "Design of Experiments (DOE) studies",
      "Process validation (IQ/OQ/PQ)",
      "Mold qualification and capability studies",
      "Process troubleshooting and root cause analysis",
      "Automation and robotics integration",
      "Material selection and qualification",
    ],
    outcomes: [
      "Robust, validated processes",
      "Reduced scrap and rework",
      "Improved cycle times",
      "Consistent part quality",
    ],
  },
  {
    id: "equipment-maintenance",
    icon: Wrench,
    title: "Equipment & Mold Maintenance",
    tagline: "Maximize equipment uptime and performance",
    description:
      "Effective maintenance is critical to manufacturing success. We implement preventive and predictive programs that maximize availability and extend asset life.",
    keyOfferings: [
      "Preventive maintenance program development",
      "Mold maintenance standards and procedures",
      "CMMS selection and implementation",
      "Spare parts inventory optimization",
      "Equipment lifecycle management",
      "Maintenance team training and development",
      "Total Productive Maintenance (TPM) implementation",
      "Equipment reliability analysis",
    ],
    outcomes: [
      "Increased equipment uptime (OEE)",
      "Extended mold and equipment life",
      "Reduced unplanned downtime",
      "Optimized maintenance costs",
    ],
  },
  {
    id: "facility-design",
    icon: Building,
    title: "Facility Design & Infrastructure",
    tagline: "Design facilities built for manufacturing excellence",
    description:
      "We've built facilities from the ground up — from greenfield site selection to cleanroom design — that support quality, efficiency, and compliance.",
    keyOfferings: [
      "Greenfield and brownfield facility planning",
      "Cleanroom design and classification (ISO 7/8)",
      "Production floor layout optimization",
      "Utility systems design (compressed air, cooling, electrical)",
      "Material flow and logistics optimization",
      "Environmental monitoring systems",
      "EHS (Environmental Health & Safety) compliance",
      "Facility expansion and renovation planning",
    ],
    outcomes: [
      "Optimized production flow",
      "Regulatory-compliant facilities",
      "Efficient space utilization",
      "Scalable infrastructure",
    ],
  },
  {
    id: "supplier-development",
    icon: Globe,
    title: "Supplier Development & Supply Chain",
    tagline: "Build a resilient global supply network",
    description:
      "With experience developing suppliers across six continents, we help build robust supply chains — from qualification to ongoing development.",
    keyOfferings: [
      "Global supplier strategy development",
      "Supplier qualification and approval programs",
      "Supplier quality management systems",
      "Supplier audits and assessments",
      "Supply chain risk management",
      "Dual-sourcing and localization strategies",
      "Supplier performance management (scorecards, reviews)",
      "Contract manufacturing management",
    ],
    outcomes: [
      "Qualified, reliable supplier base",
      "Reduced supply chain risk",
      "Improved supplier quality",
      "Optimized total cost of ownership",
    ],
  },
  {
    id: "strategic-advisory",
    icon: Lightbulb,
    title: "Strategic Advisory & Expert Services",
    tagline: "Expert guidance for critical decisions",
    description:
      "We provide strategic advisory for complex situations requiring deep expertise — from technology transfer to M&A due diligence.",
    keyOfferings: [
      "Technology transfer planning and execution",
      "Due diligence for mergers and acquisitions",
      "Expert witness services for litigation",
      "Custom training program development",
      "Manufacturing strategy consulting",
      "Make vs. buy analysis",
      "Competitive benchmarking",
      "Organizational capability assessments",
    ],
    outcomes: [
      "Informed strategic decisions",
      "Successful technology transfers",
      "Risk mitigation",
      "Knowledge transfer to your team",
    ],
  },
  {
    id: "smart-manufacturing",
    icon: Cpu,
    title: "Smart Manufacturing & Process Analytics",
    tagline: "Data-driven optimization for molding floors",
    description:
      "We integrate IIoT connectivity, predictive maintenance, and data-driven process analytics on the molding floor to optimize cycle times, scrap, and quality validation.",
    keyOfferings: [
      "Data-driven process development & optimization",
      "Validated process control & inspection systems (ISO 13485/FDA)",
      "Automated / vision-based defect detection & predictive quality",
      "IIoT architecture, predictive maintenance, and data foundations",
      "Digital knowledge management and operator work instructions",
    ],
    outcomes: [
      "Lower scrap rates",
      "Higher first-pass yield",
      "Validated, audit-ready data",
      "Reduced unplanned downtime & captured tribal knowledge",
    ],
  },
];

const whyChooseUs = [
  { icon: Target, title: "Cross-Functional Expertise", description: "Experience spanning manufacturing, quality, design assurance, and R&D — we understand your challenge from every angle." },
  { icon: Users, title: "Hands-On Approach", description: "We don't just advise — we work alongside your team, building internal capability that lasts." },
  { icon: Shield, title: "Regulatory Confidence", description: "Director-level quality experience means we know what auditors look for and how to satisfy them." },
  { icon: Zap, title: "Practical Solutions", description: "No ivory-tower recommendations — every solution is grounded in 25+ years of real manufacturing." },
];

const engagementModels = [
  { title: "Project-Based", description: "Defined-scope engagements with clear deliverables and timelines", examples: ["Process validation", "Quality system implementation", "Facility design"] },
  { title: "Retainer", description: "Ongoing access to expertise for continuous support and guidance", examples: ["Monthly advisory hours", "On-call troubleshooting", "Audit preparation"] },
  { title: "Training", description: "Custom training programs to build your team's capability", examples: ["Scientific molding", "Quality systems", "Process validation"] },
];

const SECTORS = [
  { icon: Car, name: "Automotive", value: "High-volume process optimization, scrap and cycle-time reduction, and predictive maintenance." },
  { icon: Package, name: "Packaging", value: "Throughput, energy, and quality optimization at scale across high-cavitation tooling." },
  { icon: CircuitBoard, name: "Electronics & Connectors", value: "Precision-part defect prediction and automated vision inspection for tight tolerances." },
];

const APPROACH = [
  { phase: "01", title: "Discovery & Assessment", description: "A comprehensive assessment of your current state, challenges, and objectives — stakeholder interviews, process reviews, and gap analysis." },
  { phase: "02", title: "Solution Design", description: "Tailored strategies and detailed action plans aligned with your business goals and regulatory requirements." },
  { phase: "03", title: "Implementation", description: "We execute with hands-on support, working alongside your team while building internal capability." },
  { phase: "04", title: "Validation & Handoff", description: "We verify results, document outcomes, and ensure your team can sustain success independently." },
];

function ServiceCard({ s }: { s: ServiceItem }) {
  const Icon = s.icon;
  return (
    <div id={s.id} className="card-technical scroll-mt-24 flex flex-col p-7 md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        {s.differentiator && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
            Key Differentiator
          </span>
        )}
      </div>
      <h3 className="mt-5 font-display text-xl font-bold tracking-tight">{s.title}</h3>
      <p className="mt-1 font-medium text-primary">{s.tagline}</p>
      <p className="mt-3 leading-relaxed text-muted-foreground">{s.description}</p>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          What we deliver
        </p>
        <ul className="mt-3 space-y-2">
          {s.keyOfferings.map((o) => (
            <li key={o} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-hairline pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Typical outcomes
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {s.outcomes.map((o) => (
            <span key={o} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
              {o}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

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

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute left-1/2 top-[-10%] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container-wide py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-6 justify-center">Consulting Services</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Expert solutions for{" "}
              <span className="text-primary">injection molding & medical device manufacturing</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              From thermoplastics and LSR injection molding process development and quality systems to
              facility build design and supplier development — 25+ years of hands-on experience.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/schedule">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#core-services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core services */}
      <section id="core-services" className="section-padding scroll-mt-20">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Manufacturing & Engineering</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Our consulting services
            </h2>
            <p className="mt-4 text-muted-foreground">
              Deep, hands-on expertise across the full injection molding and
              medical device manufacturing lifecycle.
            </p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {CORE_SERVICES.map((s) => (
              <ServiceCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </section>


      {/* Why work with us */}
      <section className="section-padding bg-muted/30 border-y border-hairline">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Why SIDEC</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Why work with us
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-hairline bg-card p-7 text-center shadow-sm">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Our Approach</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              A proven process for success
            </h2>
            <p className="mt-4 text-muted-foreground">
              A structured methodology that delivers measurable, sustainable results.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((step) => (
              <div key={step.phase} className="rounded-xl border border-hairline bg-card p-7 shadow-sm">
                <span className="font-display text-4xl font-bold text-primary/20">{step.phase}</span>
                <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="section-padding bg-muted/30 border-y border-hairline">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">How We Work</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Flexible engagement models
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {engagementModels.map((model) => (
              <div key={model.title} className="rounded-xl border border-hairline bg-card p-7 text-center shadow-sm">
                <h3 className="font-display text-xl font-semibold">{model.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{model.description}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {model.examples.map((ex) => (
                    <span key={ex} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors served */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Sectors We Serve</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Medical device as the premium tier — and beyond
            </h2>
            <p className="mt-4 text-muted-foreground">
              Full quality and regulatory rigor for regulated medical device
              manufacturing, and the same engineering methods for other
              precision molders.
            </p>
          </div>

          <div className="mt-12">
            <div className="rounded-2xl border border-hairline bg-card p-7 shadow-sm md:p-9">
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                      Premium Tier
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">Medical Device</h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    Full quality and regulatory depth under ISO 13485, FDA, and
                    EU MDR across all device risk classes and combination products.
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Within the medical tier — all device classes
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { c: "Class I", r: "Low Risk" },
                      { c: "Class II", r: "Moderate Risk" },
                      { c: "Class III", r: "High Risk" },
                    ].map((d) => (
                      <div key={d.c} className="rounded-lg border border-hairline bg-card p-4">
                        <div className="font-display text-xl font-bold">{d.c}</div>
                        <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-primary">{d.r}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Including combination products, in-vitro diagnostics, drug-delivery
                    devices, and sterile packaging components.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {SECTORS.map((sector) => {
              const Icon = sector.icon;
              return (
                <div key={sector.name} className="card-technical p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-display font-semibold">{sector.name}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{sector.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to get started?"
        description="Every engagement begins with understanding your unique challenges and goals. Let's schedule a discovery call to explore how we can help."
        primaryButtonText="Schedule a Consultation"
        primaryButtonHref="/schedule"
        secondaryButtonText="Get a Smart Manufacturing Assessment"
        secondaryButtonHref="/contact?service=smart-manufacturing"
      />
    </MainLayout>
  );
}
