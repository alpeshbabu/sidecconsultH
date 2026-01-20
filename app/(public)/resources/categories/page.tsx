import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout";
import { CTASection } from "@/components/sections";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Categories | Resources",
  description:
    "Browse our resource categories covering medical device manufacturing, quality systems, regulatory compliance, and more.",
  openGraph: {
    title: "Categories | SIDEC Consulting Resources",
    description:
      "Browse expert insights by category: manufacturing, quality, compliance, and more.",
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
              Browse by Topic
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Resource Categories
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
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <FileText className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">
                          {category.postCount}{" "}
                          {category.postCount === 1 ? "article" : "articles"}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {category.description && (
                        <CardDescription className="mb-4">
                          {category.description}
                        </CardDescription>
                      )}
                      <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Browse articles
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-6">
                Categories will be available soon as we add more content.
              </p>
              <Link href="/resources">
                <Button>
                  View All Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Back to Resources */}
      <section className="border-t py-8">
        <div className="container-wide flex justify-center">
          <Link href="/resources">
            <Button variant="outline">
              ← Back to All Resources
            </Button>
          </Link>
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
