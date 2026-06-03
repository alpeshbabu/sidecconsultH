import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  title: string;
  shortTitle?: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  outcomes?: string[];
  variant?: "default" | "compact" | "featured";
  className?: string;
}

const techChip =
  "rounded-sm border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground";

export function ServiceCard({
  title,
  shortTitle,
  description,
  icon: Icon,
  href,
  badge,
  outcomes,
  variant = "default",
  className,
}: ServiceCardProps) {
  if (variant === "compact") {
    return (
      <Link href={href} className="group block h-full">
        <Card className={cn("card-technical h-full rounded-none", className)}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-base transition-colors group-hover:text-signal">
                {shortTitle || title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {description}
            </p>
            <div className="mt-4 flex items-center font-mono text-[11px] uppercase tracking-[0.12em] text-signal opacity-0 transition-opacity group-hover:opacity-100">
              Learn more
              <ArrowUpRight className="ml-1 h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href} className="group block h-full">
        <Card className={cn("card-technical h-full gap-0 overflow-hidden rounded-none py-0", className)}>
          <div className="grid md:grid-cols-2">
            {/* Visual Side */}
            <div className="surface-ink relative flex flex-col justify-center p-8">
              <div className="grid-blueprint absolute inset-0 opacity-50" aria-hidden />
              <div className="relative flex h-20 w-20 items-center justify-center border border-white/15 text-signal">
                <Icon className="h-10 w-10" />
              </div>
              {badge && <span className={cn("relative mt-6 w-fit", techChip, "border-white/20 text-ink-muted")}>{badge}</span>}
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-center p-6 md:p-8">
              <CardTitle className="mb-3 font-display text-2xl transition-colors group-hover:text-signal">
                {title}
              </CardTitle>
              <p className="text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
              {outcomes && outcomes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {outcomes.slice(0, 3).map((outcome, index) => (
                    <span key={index} className={techChip}>
                      {outcome}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-6 flex items-center font-mono text-[11px] uppercase tracking-[0.12em] text-signal">
                Explore service
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={href} className="group block h-full">
      <Card className={cn("card-technical h-full rounded-none", className)}>
        <CardHeader>
          <div className="mb-4 flex h-14 w-14 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
            <Icon className="h-7 w-7" />
          </div>
          {badge && <span className={cn("mb-2 w-fit", techChip, "text-signal")}>{badge}</span>}
          <CardTitle className="font-display text-xl transition-colors group-hover:text-signal">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">{description}</p>
          {outcomes && outcomes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {outcomes.slice(0, 4).map((outcome, index) => (
                <span key={index} className={techChip}>
                  {outcome}
                </span>
              ))}
            </div>
          )}
          <div className="mt-6 flex items-center font-mono text-[11px] uppercase tracking-[0.12em] text-signal opacity-0 transition-opacity group-hover:opacity-100">
            Learn more
            <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ServiceCard;
