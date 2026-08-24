import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  ShieldCheck,
  ScanSearch,
  Network,
  AlertTriangle,
  Wrench,
  TrendingUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout";
import { CTASection } from "@/components/sections";
import { createBreadcrumbSchema, getJsonLd } from "@/lib/structured-data";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Representative examples of process optimization, quality systems, and manufacturing solutions delivered in injection molding operations — problem, approach, and measured result.",
  openGraph: {
    title: "Case Studies | SIDEC Consulting",
    description:
      "How process optimization, quality systems, and smart manufacturing cut scrap and downtime in molding.",
    url: "/case-studies",
  },
  alternates: { canonical: "/case-studies" },
};

const CASE_STUDIES = [
  {
    id: "scrap-reduction-ml-control",
    icon: Cpu,
    sector: "Medical Device (Class II)",
    pillar: "Process Optimization & Technology",
    title: "Cutting scrap on a high-cavitation tool with scientific molding & advanced process control",
    challenge:
      "A Class II molder ran a 32-cavity tool with persistent scrap from short shots and dimensional drift, especially when switching resin lots. Operators chased the process manually, and scrap spiked after every material change.",
    approach: [
      "Characterized the baseline with scientific molding and validated existing sensor data quality",
      "Trained a predictive model mapping process parameters and material state to part quality",
      "Used multi-objective optimization to balance scrap, cycle time, and dimensional capability",
      "Deployed parameter recommendations for lot-to-lot material adaptation",
    ],
    result: [
      "Scrap reduced in the high-teens %",
      "Reduced dimensional drift across lots",
      "Faster, calmer material changeovers",
    ],
    governance:
      "Model and acceptance criteria documented; changes managed under the site's process-validation framework.",
  },
  {
    id: "validated-vision-inspection",
    icon: ScanSearch,
    sector: "Medical Device (Class III)",
    pillar: "Quality & Inspection Automation",
    title: "Validated vision inspection for automated defect detection",
    challenge:
      "A manufacturer wanted automated vision inspection for cosmetic and dimensional defects on an implantable-device component, but prior attempts stalled because the model couldn't be validated or explained to auditors.",
    approach: [
      "Define sensitivity / false-negative limits up front",
      "Apply Computer Software Assurance (CSA) — deepest testing on the highest-risk failure modes",
      "Built explainable criteria into the inspection logic so rejections could be easily verified",
      "Produced IQ/OQ/PQ-style validation evidence and a model-governance plan",
    ],
    result: [
      "Inspection model validated and in production",
      "Clean notified-body audit of the system",
      "Lower manual inspection load",
    ],
    governance:
      "Full validation package, explainability evidence, and a Predetermined Change Control plan for future retraining.",
  },
  {
    id: "predictive-maintenance-uptime",
    icon: Network,
    sector: "Automotive",
    pillar: "Smart Factory & Data",
    title: "Targeted predictive maintenance on the assets that actually mattered",
    challenge:
      "An automotive molder lost expensive production time to unplanned press and auxiliary-equipment failures, and a prior 'sensors everywhere' pilot had produced data nobody used.",
    approach: [
      "Ranked assets by downtime cost and failure predictability — focused only on the high-consequence few",
      "Built the IIoT data foundation (reliable time-series collection) before any modeling",
      "Analyzed degradation signatures on critical presses and auxiliary equipment",
      "Set condition thresholds tied to maintenance workflows, not just dashboards",
    ],
    result: [
      "Fewer unplanned stoppages on targeted assets",
      "Higher OEE on the affected lines",
      "A data foundation reused for later AI work",
    ],
    governance:
      "Scoped honestly — assets where predictive maintenance didn't pay were left on preventive schedules.",
  },
];

const PILLAR_ICON_NOTE = [
  { icon: Cpu, label: "Process Development" },
  { icon: ShieldCheck, label: "Validation & Governance" },
  { icon: ScanSearch, label: "Quality & Inspection" },
  { icon: Network, label: "Smart Factory & Data" },
];

export default function CaseStudiesPage() {
  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getJsonLd(
            createBreadcrumbSchema(baseUrl, [
              { name: "Home", url: "/" },
              { name: "Case Studies", url: "/case-studies" },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
        </div>
        <div className="container-wide py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-6 justify-center">Case Studies</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Proven results delivered{" "}
              <span className="text-signal">on the floor</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Problem, approach, and measured result — and how we kept each one
              validated and audit-ready.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {PILLAR_ICON_NOTE.map((p) => {
                const Icon = p.icon;
                return (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    <Icon className="h-4 w-4 text-signal" />
                    {p.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Representative-work disclaimer */}
      <section className="hairline-t hairline-b bg-muted/20 py-5">
        <div className="container-wide">
          <div className="mx-auto flex max-w-3xl items-start gap-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
            <p>
              The case studies below are <strong>representative and anonymized</strong> to
              protect client confidentiality. They illustrate our typical
              approach and the kind of outcomes engagements target; figures are
              indicative ranges, not guarantees, and vary with each operation.
            </p>
          </div>
        </div>
      </section>

      {/* Case studies */}
      <div>
        {CASE_STUDIES.map((cs, index) => {
          const Icon = cs.icon;
          return (
            <section
              key={cs.id}
              id={cs.id}
              className={`section-padding hairline-t ${index % 2 === 1 ? "bg-muted/20" : ""}`}
            >
              <div className="container-wide">
                <div className="mx-auto max-w-4xl">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center border border-hairline text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-sm border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        {cs.sector}
                      </span>
                      <span className="rounded-sm border border-signal/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-signal">
                        {cs.pillar}
                      </span>
                    </div>
                  </div>

                  <h2 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl text-balance">
                    {cs.title}
                  </h2>

                  <div className="mt-8 grid gap-px hairline border border-hairline bg-hairline md:grid-cols-3">
                    {/* Challenge */}
                    <div className="bg-background p-6">
                      <div className="mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-signal" />
                        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Challenge
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {cs.challenge}
                      </p>
                    </div>

                    {/* Approach */}
                    <div className="bg-background p-6">
                      <div className="mb-3 flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-signal" />
                        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Approach
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {cs.approach.map((a) => (
                          <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Result */}
                    <div className="bg-background p-6">
                      <div className="mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-signal" />
                        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Result
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {cs.result.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm font-medium">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-signal" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Governance note */}
                  <div className="mt-px flex items-start gap-3 border border-t-0 border-hairline bg-background p-6">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
                    <div>
                      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Kept Audit-Ready
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{cs.governance}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Your operation next */}
      <section className="section-padding hairline-t">
        <div className="container-wide">
          <Card className="card-technical rounded-none">
            <CardContent className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Could your operation be the next one?
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Start with a fixed-scope Smart Manufacturing Assessment to map out where data-driven
                  improvements deliver the highest value.
                </p>
              </div>
              <Button asChild size="lg" variant="technical" className="shrink-0">
                <Link href="/contact">
                  Get an Operations Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Let's talk about your numbers"
        description="Every engagement starts with your process and your data. Schedule a consultation, or start with a fixed-scope assessment."
        primaryButtonText="Schedule a Consultation"
        primaryButtonHref="/schedule"
        secondaryButtonText="Explore Services"
        secondaryButtonHref="/services"
      />
    </MainLayout>
  );
}
