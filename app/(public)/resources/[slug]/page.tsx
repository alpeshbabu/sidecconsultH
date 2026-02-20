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
  Tag,
  Twitter,
  User,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MainLayout, Breadcrumb } from "@/components/layout";
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
      {/* Hero Section with Featured Image */}
      <section className="relative">
        {/* Background Image */}
        {post.featuredImage && (
          <div className="absolute inset-0 h-[400px] md:h-[500px]">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
          </div>
        )}

        {/* Header Content */}
        <div className="relative container-wide pt-8 pb-16 md:pt-12 md:pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link
              href="/resources"
              className="hover:text-foreground transition-colors"
            >
              Resources
            </Link>
            <ChevronRight className="h-4 w-4" />
            {post.category && (
              <>
                <Link
                  href={`/resources?category=${post.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {post.category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-foreground truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          {/* Category & Meta */}
          <div className="max-w-4xl">
            {post.category && (
              <Link
                href={`/resources?category=${post.category.slug}`}
                className="inline-block mb-4"
              >
                <Badge className="px-3 py-1 text-xs font-medium bg-primary/90 hover:bg-primary text-primary-foreground">
                  {post.category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}

            {/* Author and Meta */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Author */}
              {post.author?.name && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-background">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">Author</p>
                  </div>
                </div>
              )}

              {/* Divider */}
              {post.author?.name && (formattedDate || post.readingTime) && (
                <Separator orientation="vertical" className="h-8" />
              )}

              {/* Date */}
              {formattedDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              )}

              {/* Reading Time */}
              {post.readingTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>
          </div>
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
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Category and Tags */}
              <div className="flex items-center gap-3 flex-wrap">
                {post.category && (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Filed under:
                    </span>
                    <Link href={`/resources?category=${post.category.slug}`}>
                      <Badge
                        variant="secondary"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Tag className="h-3 w-3 mr-1.5" />
                        {post.category.name}
                      </Badge>
                    </Link>
                  </>
                )}
                {post.tags && post.tags.length > 0 && (
                  <>
                    {post.category && (
                      <Separator orientation="vertical" className="h-5" />
                    )}
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    {post.tags.map((tag) => (
                      <Link key={tag.id} href={`/resources?tag=${tag.slug}`}>
                        <Badge
                          variant="outline"
                          className="hover:bg-primary/10 transition-colors"
                        >
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </>
                )}
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Share:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-colors"
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
                    className="h-9 w-9 rounded-full hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
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
                    className="h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
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
              <Link href="/resources">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to All Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wide">
                    Continue Reading
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Related Articles
                </h2>
              </div>
              <Link href={`/resources?category=${post.category?.slug || ""}`}>
                <Button variant="outline" className="hidden md:flex">
                  View All in {post.category?.name || "Category"}
                </Button>
              </Link>
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
              <Link href={`/resources?category=${post.category?.slug || ""}`}>
                <Button variant="outline">
                  View All in {post.category?.name || "Category"}
                </Button>
              </Link>
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
