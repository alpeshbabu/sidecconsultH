import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout";
import { CTASection } from "@/components/sections";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Categories | Resources",
  description:
    "Browse our resource categories covering AI and process optimization, AI validation and compliance, smart factory and data, and quality systems.",
  openGraph: {
    title: "Categories | SIDEC Consulting Resources",
    description:
      "Browse insights by category: AI process optimization, validation, smart factory, and quality.",
  },
};

async function getCategories() {
  const categories = await prisma.category.findMany({
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
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    postCount: cat._count.posts,
  }));
}

export default async function CategoriesPage() {
  const categories = await getCategories();

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
            <p className="eyebrow mb-5 justify-center">Browse by Topic</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Resource <span className="text-signal">Categories</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Explore our expert insights organized by topic. From quality
              systems to injection molding, find the guidance you need.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {categories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/resources?category=${category.slug}`}
                  className="group"
                >
                  <div className="card-technical rounded-none flex h-full flex-col p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                        <FileText className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {category.postCount}{" "}
                        {category.postCount === 1 ? "article" : "articles"}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold transition-colors group-hover:text-signal">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors group-hover:text-signal">
                      Browse articles
                      <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-hairline px-6 py-16 text-center">
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Categories will be available soon as we add more content.
              </p>
              <Button asChild variant="technical">
                <Link href="/resources">
                  View All Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Back to Resources */}
      <section className="hairline-t py-8">
        <div className="container-wide flex justify-center">
          <Button
            asChild
            variant="outline"
          >
            <Link href="/resources">← Back to All Resources</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Can't Find What You're Looking For?"
        description="Contact us directly and we'll help you find the information you need or create custom content for your specific challenges."
        primaryButtonText="Contact Us"
        primaryButtonHref="/contact"
        secondaryButtonText="View Services"
        secondaryButtonHref="/services"
      />
    </MainLayout>
  );
}
