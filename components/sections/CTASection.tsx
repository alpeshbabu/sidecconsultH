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
  variant = "default",
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "section-padding",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "gradient" &&
          "bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground",
        className
      )}
    >
      <div className="container-wide">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg opacity-90 md:text-xl">{description}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={primaryButtonHref}>
              <Button
                size="lg"
                variant="secondary"
                className="btn-glow w-full sm:w-auto"
              >
                {primaryButtonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {secondaryButtonText && secondaryButtonHref && (
              <Link href={secondaryButtonHref}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  {secondaryButtonText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
