import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Link href={href} className="group block">
        <Card
          className={cn(
            "h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50",
            className
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {shortTitle || title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed line-clamp-3">
              {description}
            </CardDescription>
            <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Learn more
              <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href} className="group block">
        <Card
          className={cn(
            "h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
            className
          )}
        >
          <div className="grid md:grid-cols-2">
            {/* Visual Side */}
            <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-8 flex flex-col justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6">
                <Icon className="h-10 w-10" />
              </div>
              {badge && (
                <Badge className="w-fit bg-primary text-primary-foreground">
                  {badge}
                </Badge>
              )}
            </div>

            {/* Content Side */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {description}
              </CardDescription>
              {outcomes && outcomes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {outcomes.slice(0, 3).map((outcome, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {outcome}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-6 flex items-center text-sm font-medium text-primary">
                Explore service
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={href} className="group block">
      <Card
        className={cn(
          "h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50",
          className
        )}
      >
        <CardHeader>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="h-7 w-7" />
          </div>
          {badge && (
            <Badge variant="secondary" className="w-fit mb-2">
              {badge}
            </Badge>
          )}
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="leading-relaxed">
            {description}
          </CardDescription>
          {outcomes && outcomes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {outcomes.slice(0, 4).map((outcome, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {outcome}
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Learn more
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ServiceCard;
