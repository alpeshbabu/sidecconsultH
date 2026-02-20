import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Link href={`/resources/${slug}`} className="block group">
        <Card
          className={cn(
            "overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
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
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </div>
              )}
              {category && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {category.name}
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formattedDate}
                  </span>
                )}
                {readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readingTime} min read
                  </span>
                )}
              </div>
              <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </CardTitle>
              {tags && tags.length > 0 && (
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  {tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.slug} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
              {excerpt && (
                <CardDescription className="text-base line-clamp-3">
                  {excerpt}
                </CardDescription>
              )}
              {author?.name && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
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
      <Link href={`/resources/${slug}`} className="block group">
        <div
          className={cn(
            "flex gap-4 p-4 rounded-lg border transition-colors hover:bg-muted/50",
            className
          )}
        >
          {/* Small Image */}
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
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
    <Link href={`/resources/${slug}`} className="block group">
      <Card
        className={cn(
          "overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
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
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {category && (
              <Badge variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            )}
            {tags && tags.slice(0, 3).map((tag) => (
              <Badge key={tag.slug} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {readingTime && (
              <span className="text-xs text-muted-foreground">
                {readingTime} min read
              </span>
            )}
          </div>
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {excerpt && (
            <CardDescription className="line-clamp-2 mb-4">
              {excerpt}
            </CardDescription>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
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
