import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout";
import { CTASection } from "@/components/sections";
import { BlogPostCard } from "@/components/blog";
import { ResourcesContent } from "./ResourcesContent";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Practical insights and guides on AI, machine learning, and validation for injection molding manufacturing — process optimization, quality, predictive maintenance, and compliance.",
  openGraph: {
    title: "Resources | SIDEC Consulting",
    description:
      "Practical guidance on AI and machine learning for injection molding manufacturing.",
    url: "/resources",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources | SIDEC Consulting",
    description:
      "Practical guidance on AI and machine learning for injection molding manufacturing.",
  },
  alternates: {
    canonical: "/resources",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

// Fetch initial data on server
async function getInitialData() {
  const [categories, tags, featuredPosts, recentPosts, totalPosts] = await Promise.all([
    // Get categories with post counts
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            posts: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    }),
    // Get tags with post counts
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            posts: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    }),
    // Get featured/recent posts for hero
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 2,
    }),
    // Get recent posts
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 12,
    }),
    // Get total count
    prisma.blogPost.count({
      where: { status: "PUBLISHED" },
    }),
  ]);

  return {
    categories: categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      postCount: cat._count.posts,
    })),
    tags: tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      postCount: tag._count.posts,
    })),
    featuredPosts,
    recentPosts,
    totalPosts,
  };
}

export default async function ResourcesPage() {
  const { categories, tags, featuredPosts, recentPosts, totalPosts } =
    await getInitialData();

  const hasPublishedPosts = totalPosts > 0;

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
        </div>

        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-5 justify-center">Resources & Insights</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Practical Knowledge for{" "}
              <span className="text-signal">AI in Molding</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Guides and insights on AI, machine learning, and validation for
              injection molding — grounded in 25+ years of manufacturing
              experience.
            </p>
            <div className="mt-8">
              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link href="/feed.xml" target="_blank">
                  <Rss className="h-4 w-4 mr-2" />
                  RSS Feed
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {hasPublishedPosts ? (
        <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="hairline-t bg-muted/20 py-12">
              <div className="container-wide">
                <div className="mb-8">
                  <p className="eyebrow mb-5">Featured</p>
                  <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    Featured Articles
                  </h2>
                </div>

                {featuredPosts.length === 1 ? (
                  <BlogPostCard
                    slug={featuredPosts[0].slug}
                    title={featuredPosts[0].title}
                    excerpt={featuredPosts[0].excerpt}
                    featuredImage={featuredPosts[0].featuredImage}
                    category={featuredPosts[0].category}
                    tags={featuredPosts[0].tags}
                    author={featuredPosts[0].author}
                    publishedAt={featuredPosts[0].publishedAt}
                    readingTime={featuredPosts[0].readingTime}
                    variant="featured"
                  />
                ) : (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {featuredPosts.map((post) => (
                      <BlogPostCard
                        key={post.id}
                        slug={post.slug}
                        title={post.title}
                        excerpt={post.excerpt}
                        featuredImage={post.featuredImage}
                        category={post.category}
                        tags={post.tags}
                        author={post.author}
                        publishedAt={post.publishedAt}
                        readingTime={post.readingTime}
                        variant="featured"
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Main Content with Filters */}
          <Suspense
            fallback={
              <section className="section-padding">
                <div className="container-wide">
                  <div className="flex justify-center py-12">
                    <div className="animate-pulse text-muted-foreground">
                      Loading resources...
                    </div>
                  </div>
                </div>
              </section>
            }
          >
            <ResourcesContent
              initialPosts={recentPosts}
              categories={categories}
              tags={tags}
              totalPosts={totalPosts}
            />
          </Suspense>
        </>
      ) : (
        /* Empty State - No Published Posts */
        <section className="section-padding">
          <div className="container-wide">
            <div className="card-technical rounded-none mx-auto max-w-2xl p-8 text-center md:p-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-hairline text-signal">
                <BookOpen className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Coming Soon
              </h2>
              <p className="text-muted-foreground mt-4 mb-8">
                We&apos;re working on bringing you practical insights and guides
                on AI and machine learning for injection molding manufacturing.
                Check back soon!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="technical">
                  <Link href="/schedule">
                    Get Notified
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                >
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
            </div>

            {/* Categories Preview */}
            {categories.length > 0 && (
              <div className="mt-16">
                <p className="eyebrow mb-5 justify-center">Topics</p>
                <h2 className="font-display text-xl font-semibold text-center mb-8">
                  Topics We&apos;ll Cover
                </h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center gap-2 rounded-sm border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      <FileText className="h-3.5 w-3.5 text-signal" />
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="section-padding surface-ink relative overflow-hidden hairline-t">
        <div className="grid-dots absolute inset-0 opacity-50" aria-hidden />
        <div className="container-wide relative">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow-plain mb-5 text-signal">
              Stay Updated
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-foreground sm:text-3xl">
              Subscribe to Our Newsletter
            </h2>
            <p className="mt-4 text-ink-muted">
              Get practical insights on AI, machine learning, and validation for
              injection molding manufacturing delivered to your inbox.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-11 w-full rounded-sm border border-white/20 bg-white/5 px-4 py-2 text-sm text-ink-foreground placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
              />
              <Button variant="signal" className="h-11 shrink-0">Subscribe</Button>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Wondering where AI fits in your plant?"
        description="Start with a fixed-scope AI Readiness Assessment, or schedule a consultation to talk through your process and data."
        primaryButtonText="Get an AI Readiness Assessment"
        primaryButtonHref="/contact?service=ai-readiness"
        secondaryButtonText="Schedule a Consultation"
        secondaryButtonHref="/schedule"
      />
    </MainLayout>
  );
}
