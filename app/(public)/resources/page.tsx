import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout";
import { CTASection } from "@/components/sections";
import { BlogPostCard } from "@/components/blog";
import { ResourcesContent } from "./ResourcesContent";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Expert insights, guides, and best practices for medical device manufacturing, ISO 13485 compliance, injection molding processes, and quality systems.",
  openGraph: {
    title: "Resources | SIDEC Consulting",
    description:
      "Expert insights and practical guides for medical device manufacturing excellence.",
    url: "/resources",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources | SIDEC Consulting",
    description:
      "Expert insights and practical guides for medical device manufacturing excellence.",
  },
  alternates: {
    canonical: "/resources",
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
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 border-primary/30 bg-primary/5"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
              Resources & Insights
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Expert Knowledge for{" "}
              <span className="text-gradient">Manufacturing Excellence</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Practical guides, industry insights, and best practices from 25+
              years of medical device manufacturing experience.
            </p>
          </div>
        </div>
      </section>

      {hasPublishedPosts ? (
        <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="border-b bg-muted/30 py-12">
              <div className="container-wide">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">
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
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  We&apos;re working on bringing you expert insights, practical
                  guides, and industry best practices for medical device
                  manufacturing. Check back soon!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/schedule">
                    <Button>
                      Get Notified
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline">Explore Services</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Categories Preview */}
            {categories.length > 0 && (
              <div className="mt-16">
                <h2 className="text-xl font-semibold text-center mb-8">
                  Topics We&apos;ll Cover
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="px-4 py-2 text-sm"
                    >
                      <FileText className="h-3.5 w-3.5 mr-2" />
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              Stay Updated
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Subscribe to Our Newsletter
            </h2>
            <p className="mt-4 text-muted-foreground">
              Get the latest insights on medical device manufacturing,
              regulatory updates, and industry best practices delivered to your
              inbox.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button className="shrink-0">Subscribe</Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Have a Manufacturing Challenge?"
        description="Our team is ready to help you navigate complex manufacturing, quality, and regulatory challenges."
        primaryButtonText="Schedule Consultation"
        primaryButtonHref="/contact"
        secondaryButtonText="View Services"
        secondaryButtonHref="/services"
      />
    </MainLayout>
  );
}
