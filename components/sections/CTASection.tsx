import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  variant?: "default" | "gradient";
  className?: string;
}

export function CTASection({
  title,
  description,
  primaryButtonText = "Schedule a Consultation",
  primaryButtonHref = "/schedule",
  secondaryButtonText,
  secondaryButtonHref,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "surface-ink relative overflow-hidden section-padding",
        className
      )}
    >
      {/* blueprint grid + glow */}
      <div className="grid-blueprint absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-120 w-120 rounded-full bg-signal/10 blur-3xl"
        aria-hidden
      />

      <div className="container-wide relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow-plain mb-6 text-signal">
            <span aria-hidden>// </span>Engagement Inquiry
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-foreground sm:text-4xl lg:text-5xl text-balance">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {description}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="signal" className="h-12 w-full px-8 sm:w-auto">
              <Link href={primaryButtonHref}>
                {primaryButtonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {secondaryButtonText && secondaryButtonHref && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-sm border-white/20 bg-transparent px-8 font-mono text-xs uppercase tracking-[0.12em] text-ink-foreground hover:bg-white/10 hover:text-ink-foreground sm:w-auto"
              >
                <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
