import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface BlogPostCardProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  category?: {
    name: string;
    slug: string;
  } | null;
  tags?: {
    name: string;
    slug: string;
  }[];
  author?: {
    name: string | null;
  } | null;
  publishedAt?: Date | null;
  readingTime?: number | null;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

const monoMeta = "font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground";

export function BlogPostCard({
  slug,
  title,
  excerpt,
  featuredImage,
  category,
  tags,
  author,
  publishedAt,
  readingTime,
  variant = "default",
  className,
}: BlogPostCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  if (variant === "featured") {
    return (
      <Link href={`/resources/${slug}`} className="group block">
        <Card
          className={cn(
            "card-technical gap-0 overflow-hidden rounded-none py-0",
            className
          )}
        >
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-video md:aspect-auto">
              {featuredImage ? (
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid-blueprint absolute inset-0 flex items-center justify-center bg-muted/40">
                  <div className="flex h-16 w-16 items-center justify-center border border-hairline text-signal">
                    <Calendar className="h-7 w-7" />
                  </div>
                </div>
              )}
              {category && (
                <span className="absolute left-4 top-4 rounded-sm bg-ink/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-foreground">
                  {category.name}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 md:p-8">
              <div className={cn("mb-3 flex items-center gap-4", monoMeta)}>
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formattedDate}
                  </span>
                )}
                {readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {readingTime} min
                  </span>
                )}
              </div>
              <CardTitle className="mb-3 font-display text-2xl leading-snug transition-colors group-hover:text-signal line-clamp-2">
                {title}
              </CardTitle>
              {tags && tags.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  {tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.slug}
                      className="rounded-sm border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              {excerpt && (
                <p className="text-base leading-relaxed text-muted-foreground line-clamp-3">
                  {excerpt}
                </p>
              )}
              {author?.name && (
                <div className={cn("mt-4 flex items-center gap-2", monoMeta)}>
                  <User className="h-3.5 w-3.5" />
                  {author.name}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/resources/${slug}`} className="group block">
        <div
          className={cn(
            "flex gap-4 border border-hairline p-4 transition-colors hover:border-signal/50 hover:bg-muted/40",
            className
          )}
        >
          {/* Small Image */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-hairline">
            {featuredImage ? (
              <Image src={featuredImage} alt={title} fill className="object-cover" />
            ) : (
              <div className="grid-blueprint absolute inset-0 flex items-center justify-center bg-muted/40">
                <Calendar className="h-6 w-6 text-signal" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-semibold transition-colors line-clamp-2 group-hover:text-signal">
              {title}
            </h3>
            <div className={cn("mt-1 flex items-center gap-3", monoMeta)}>
              {category && <span>{category.name}</span>}
              {readingTime && <span>{readingTime} min</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/resources/${slug}`} className="group block h-full">
      <Card
        className={cn(
          "card-technical h-full gap-0 overflow-hidden rounded-none py-0",
          className
        )}
      >
        {/* Image */}
        <div className="relative aspect-video">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid-blueprint absolute inset-0 flex items-center justify-center bg-muted/40">
              <div className="flex h-12 w-12 items-center justify-center border border-hairline text-signal">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          )}
        </div>

        <CardHeader className="pt-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {category && (
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
                {category.name}
              </span>
            )}
            {readingTime && (
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {readingTime} min read
              </span>
            )}
          </div>
          <CardTitle className="font-display text-lg leading-snug transition-colors line-clamp-2 group-hover:text-signal">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-6">
          {excerpt && (
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {excerpt}
            </p>
          )}
          <div className={cn("flex items-center justify-between", monoMeta)}>
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
            )}
            {author?.name && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {author.name}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default BlogPostCard;
