import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Linkedin,
  Mail,
  Twitter,
  User,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout";
import { BlogPostCard } from "@/components/blog";
import { CTASection } from "@/components/sections";
import { prisma } from "@/lib/db";
import { createBlogPostingSchema, createBreadcrumbSchema, getJsonLd } from "@/lib/structured-data";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      excerpt: true,
      metaTitle: true,
      metaDescription: true,
      featuredImage: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      url: `/resources/${slug}`,
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: `/resources/${slug}`,
    },
  };
}

// Generate static params for known posts
export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Fetch the post
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Fetch related posts (same category or shared tags)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: post.id },
      OR: [
        ...(post.categoryId ? [{ categoryId: post.categoryId }] : []),
        ...(post.tags.length > 0
          ? [{ tags: { some: { id: { in: post.tags.map((t) => t.id) } } } }]
          : []),
      ],
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
      tags: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Share URLs
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";
  const shareUrl = `${baseUrl}/resources/${slug}`;
  const shareText = encodeURIComponent(post.title);

  // Generate JSON-LD schemas
  const blogPostingSchema = createBlogPostingSchema(baseUrl, {
    title: post.title,
    excerpt: post.excerpt || "",
    slug: post.slug,
    featuredImage: post.featuredImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.author?.name ?? undefined,
  });

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
  ];
  if (post.category) {
    breadcrumbItems.push({
      name: post.category.name,
      url: `/resources?category=${post.category.slug}`,
    });
  }
  breadcrumbItems.push({
    name: post.title,
    url: `/resources/${slug}`,
  });
  const breadcrumbSchema = createBreadcrumbSchema(baseUrl, breadcrumbItems);

  return (
    <MainLayout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getJsonLd([blogPostingSchema, breadcrumbSchema]),
        }}
      />
      {/* Article Header */}
      <section className="relative overflow-hidden">
        {/* Blueprint grid backdrop */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-60" />
        </div>

        {/* Header Content */}
        <div className="relative container-wide pt-8 pb-12 md:pt-12 md:pb-16">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <Link
              href="/resources"
              className="transition-colors hover:text-foreground"
            >
              Resources
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {post.category && (
              <>
                <Link
                  href={`/resources?category=${post.category.slug}`}
                  className="transition-colors hover:text-foreground"
                >
                  {post.category.name}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="max-w-[200px] truncate text-foreground">
              {post.title}
            </span>
          </nav>

          {/* Category & Meta */}
          <div className="max-w-4xl">
            {post.category && (
              <Link
                href={`/resources?category=${post.category.slug}`}
                className="mb-4 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-signal transition-colors hover:text-signal/80"
              >
                {post.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="mb-6 font-display text-3xl font-bold leading-tight tracking-tight text-balance md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {post.excerpt}
              </p>
            )}

            {/* Author and Meta — mono labels */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {/* Author */}
              {post.author?.name && (
                <span className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  {post.author.name}
                </span>
              )}

              {/* Date */}
              {formattedDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {formattedDate}
                </span>
              )}

              {/* Reading Time */}
              {post.readingTime && (
                <span className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} min read
                </span>
              )}
            </div>
          </div>

          {/* Featured Image — spec frame */}
          {post.featuredImage && (
            <div className="mt-10 max-w-4xl">
              <div className="corner-marks relative border border-hairline p-2">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 90vw, 56rem"
                    className="object-cover"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/12 to-transparent" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <article className="container-wide pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
            prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-foreground/90
            prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3 prose-h4:font-semibold
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base prose-p:md:text-lg
            prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:my-6 prose-ul:space-y-2
            prose-ol:my-6 prose-ol:space-y-2
            prose-li:text-muted-foreground prose-li:text-base prose-li:md:text-lg prose-li:leading-relaxed
            prose-li:marker:text-primary
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:my-8
            prose-blockquote:text-foreground/80
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
            prose-hr:border-border prose-hr:my-12
            prose-table:my-8 prose-table:w-full
            prose-th:bg-muted prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-foreground prose-th:border prose-th:border-border
            prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-border prose-td:text-muted-foreground
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags and Share Section */}
          <div className="mt-16 pt-8 hairline-t">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              {/* Category and Tags */}
              <div className="flex flex-wrap items-center gap-2">
                {post.category && (
                  <>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      Filed under
                    </span>
                    <Link
                      href={`/resources?category=${post.category.slug}`}
                      className="rounded-sm border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-signal/60 hover:text-signal"
                    >
                      {post.category.name}
                    </Link>
                  </>
                )}
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      Tags
                    </span>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/resources?tag=${tag.slug}`}
                        className="rounded-sm border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-signal/60 hover:text-signal"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </>
                )}
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Share
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-sm border-hairline transition-colors hover:border-signal/60 hover:text-signal"
                    asChild
                  >
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-sm border-hairline transition-colors hover:border-signal/60 hover:text-signal"
                    asChild
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-sm border-hairline transition-colors hover:border-signal/60 hover:text-signal"
                    asChild
                  >
                    <a
                      href={`mailto:?subject=${shareText}&body=Check out this article: ${shareUrl}`}
                      title="Share via Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8">
              <Button
                asChild
                variant="outline"
                className="gap-2 rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
              >
                <Link href="/resources">
                  <ArrowLeft className="h-4 w-4" />
                  Back to All Resources
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-muted/20 hairline-t">
          <div className="container-wide">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-4">Continue Reading</p>
                <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                  Related Articles
                </h2>
              </div>
              <Button
                asChild
                variant="outline"
                className="hidden shrink-0 rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em] md:flex"
              >
                <Link href={`/resources?category=${post.category?.slug || ""}`}>
                  View All in {post.category?.name || "Category"}
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogPostCard
                  key={relatedPost.id}
                  slug={relatedPost.slug}
                  title={relatedPost.title}
                  excerpt={relatedPost.excerpt}
                  featuredImage={relatedPost.featuredImage}
                  category={relatedPost.category}
                  tags={relatedPost.tags}
                  author={relatedPost.author}
                  publishedAt={relatedPost.publishedAt}
                  readingTime={relatedPost.readingTime}
                />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button
                asChild
                variant="outline"
                className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
              >
                <Link href={`/resources?category=${post.category?.slug || ""}`}>
                  View All in {post.category?.name || "Category"}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection
        title="Need Expert Guidance?"
        description="Our team is ready to help you navigate your medical device manufacturing challenges."
        primaryButtonText="Schedule Consultation"
        primaryButtonHref="/contact"
        secondaryButtonText="View Services"
        secondaryButtonHref="/services"
      />
    </MainLayout>
  );
}
