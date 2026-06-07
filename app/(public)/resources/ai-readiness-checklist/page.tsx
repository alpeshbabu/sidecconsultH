import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Database, Gauge, ShieldCheck, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout";
import { LeadMagnetForm } from "@/components/sections";

export const metadata: Metadata = {
  title: "Is Your Plant AI-Ready? — 12-Point Checklist",
  description:
    "A free 12-point checklist to gauge whether your injection molding operation is ready for AI — covering data, sensors, process maturity, and governance.",
  openGraph: {
    title: "Is Your Plant AI-Ready? — 12-Point Checklist | SIDEC Consulting",
    description:
      "Gauge your molding operation's AI readiness across data, sensors, process maturity, and governance — free checklist.",
    url: "/resources/ai-readiness-checklist",
  },
  alternates: { canonical: "/resources/ai-readiness-checklist" },
};

const SECTIONS = [
  {
    icon: Database,
    title: "Data Foundation",
    items: [
      "You collect machine/process data automatically (not just manual logs) on key presses.",
      "Process data is stored, time-stamped, and retrievable — not trapped on the machine.",
      "You can link a part or batch back to the process conditions that produced it.",
    ],
  },
  {
    icon: Gauge,
    title: "Sensors & Process Maturity",
    items: [
      "Your processes are characterized with scientific molding / DOE, not just dialed in by feel.",
      "You have the sensing (pressure, temperature, etc.) that the decisions you want to automate depend on.",
      "Your process is stable enough that today's data reflects how it actually runs.",
    ],
  },
  {
    icon: Network,
    title: "Problem & ROI Clarity",
    items: [
      "You can name a specific, costly pain point (scrap, cycle time, downtime, inspection cost).",
      "You have a rough sense of what solving it would be worth per year.",
      "You're prepared to start where ROI is clearest, not everywhere at once.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Governance & Readiness",
    items: [
      "If you're regulated, you know AI touching the process must be validated and explainable.",
      "There's an owner who would maintain a model after it's deployed.",
      "Leadership expects an honest answer about where AI is premature — not just where it helps.",
    ],
  },
];

export default function AiReadinessChecklistPage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
        </div>
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-6 justify-center">Free Resource</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Is your plant{" "}
              <span className="text-signal">AI-ready?</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Twelve honest checks across data, sensors, process maturity, and
              governance. Score yourself before you spend a dollar on models or
              sensors.
            </p>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="container-wide pb-4">
        <div className="mx-auto max-w-3xl">
          <LeadMagnetForm
            eyebrow="Get the Checklist"
            title="Want a printable copy + AI insights?"
            description="Drop your email and we'll send the checklist along with practical guidance on AI for molding. The full list is right below — print or save it any time."
            buttonText="Send It to Me"
            source="ai-readiness-checklist"
          />
        </div>
      </section>

      {/* The checklist */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                The 12-Point Checklist
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                4 sections · 12 checks
              </span>
            </div>

            <div className="space-y-px border-y border-hairline bg-hairline">
              {SECTIONS.map((section, sIndex) => {
                const Icon = section.icon;
                return (
                  <div key={section.title} className="bg-background p-6 md:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center border border-hairline text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {String(sIndex + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-lg font-semibold">{section.title}</h3>
                      </div>
                    </div>
                    <ul className="mt-5 space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
                          <span className="text-sm leading-relaxed text-muted-foreground">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Scoring guide */}
            <div className="surface-ink relative mt-10 overflow-hidden border border-hairline p-8">
              <div className="grid-dots absolute inset-0 opacity-40" aria-hidden />
              <div className="relative">
                <p className="eyebrow-plain mb-4 text-signal">
                  How to Read Your Score
                </p>
                <ul className="space-y-3 text-ink-muted">
                  <li>
                    <strong className="text-ink-foreground">9–12 checked:</strong> You&rsquo;re AI-ready.
                    The opportunity is prioritizing the highest-ROI use case and deploying it validated.
                  </li>
                  <li>
                    <strong className="text-ink-foreground">5–8 checked:</strong> You&rsquo;re close.
                    A focused assessment will identify the few gaps to close before AI pays off.
                  </li>
                  <li>
                    <strong className="text-ink-foreground">0–4 checked:</strong> Start with the
                    data foundation. AI on top of weak data produces confident, wrong answers.
                  </li>
                </ul>
              </div>
            </div>

            {/* Next step */}
            <div className="mt-10 flex flex-col items-start gap-4 border border-hairline bg-muted/20 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Want the expert version?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  An AI Readiness Assessment turns this self-check into a scored,
                  prioritized roadmap for your specific operation.
                </p>
              </div>
              <Button asChild variant="technical" className="shrink-0">
                <Link href="/contact?service=ai-readiness">
                  Get an Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
