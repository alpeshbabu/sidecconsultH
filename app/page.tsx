import Link from "next/link";
import type { Metadata } from "next";
import {
  Settings,
  ShieldCheck,
  Cog,
  Wrench,
  Building,
  Globe,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles,
  Shield,
  Clock,
  FileCheck,
} from "lucide-react";
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
import { AnimatedStats, CTASection, NewsletterForm } from "@/components/sections";
import { SERVICE_AREAS, STATS } from "@/lib/constants";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { BlogPostCard } from "@/components/blog";
import { createServiceSchema, getJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  ShieldCheck,
  Cog,
  Wrench,
  Building,
  Globe,
  Lightbulb,
};

export default async function HomePage() {
  // Fetch latest 3 published blog posts
  const latestPosts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
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
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });

  // Generate service schemas for JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";
  const serviceSchemas = SERVICE_AREAS.map((service) =>
    createServiceSchema(baseUrl, service.title, service.description)
  );

  return (
    <MainLayout>
      {/* JSON-LD Structured Data for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: getJsonLd(serviceSchemas) }}
      />
      
      {/* Hero Section - Cytovale Inspired */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container-wide py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <Badge
                variant="outline"
                className="mb-6 px-4 py-1.5 border-primary/30 bg-primary/5"
              >
                <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                25+ Years of Medical Device Expertise
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Transform Your{" "}
                <span className="text-gradient">Medical Device</span>{" "}
                Manufacturing
              </h1>

              <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Expert consulting for ISO 13485 quality systems, injection
                molding process development, regulatory compliance, and facility
                design. Trusted by industry leaders worldwide.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/contact">
                  <Button size="lg" className="btn-glow w-full sm:w-auto h-12 px-8 text-base">
                    Schedule Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-12 px-8 text-base"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Explore Services
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                {["ISO 13485", "FDA 21 CFR 820", "EU MDR", "MDSAP"].map(
                  (cert) => (
                    <div
                      key={cert}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {cert}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Hero Image as Background */}
                <Image 
                  src="/HomePageAssets/Hero1.png" 
                  alt="SIDEC" 
                  fill
                  className="object-cover rounded-3xl"
                  priority
                />
                
                {/* Overlay for better card contrast */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/50 via-transparent to-accent/50" />

                {/* Floating Card - Top Left (half outside) */}
                <div className="absolute -top-10 left-8 p-6 rounded-2xl bg-card/80 backdrop-blur-sm shadow-xl border animate-in slide-in-from-left-5 duration-700">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Quality Systems Expert</p>
                      <p className="text-sm text-muted-foreground">
                        ISO 13485 & FDA Compliance
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Card - Bottom Right (half outside) */}
                <div className="absolute -bottom-10 right-8 p-6 rounded-2xl bg-card/80 backdrop-blur-sm shadow-xl border animate-in slide-in-from-right-5 duration-700 delay-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Cog className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Process Excellence</p>
                      <p className="text-sm text-muted-foreground">
                        Scientific Molding & Validation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Animated */}
      <AnimatedStats stats={STATS} />

      {/* Value Proposition Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Why Choose SIDEC
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              The New Standard for{" "}
              <span className="text-gradient">Medical Device Excellence</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We bring deep industry expertise to help medical device companies
              achieve manufacturing excellence and regulatory compliance.
            </p>
          </div>

          {/* Feature Grid - Cytovale Style */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <FileCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Regulatory Expertise
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Navigate FDA, EU MDR, and global regulatory requirements with
                confidence. Our experts guide you through 510(k) submissions,
                technical files, and quality system compliance.
              </p>
            </div>

            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Cog className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Process Mastery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deep expertise in injection molding, scientific molding
                principles, and process validation. Optimize your manufacturing
                for quality and efficiency.
              </p>
            </div>

            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Experience</h3>
              <p className="text-muted-foreground leading-relaxed">
                Extensive experience with global supplier networks, technology
                transfer, and international manufacturing operations across
                multiple continents.
              </p>
            </div>
          </div>

          {/* Trust Guarantees Row */}
          <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Complete Privacy Guaranteed
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your intellectual property is protected with the highest level
                of confidentiality. All discussions and materials remain
                strictly confidential.
              </p>
            </div>

            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Quick Response Guaranteed
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We value your time. Every inquiry receives a thoughtful response
                within 24-48 business hours, ensuring your project stays on
                track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="section-padding gradient-section">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <Badge variant="outline" className="mb-4">
                Our Services
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Comprehensive Consulting Solutions
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl">
                End-to-end solutions for medical device manufacturing, from
                regulatory compliance to facility design.
              </p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="shrink-0">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SERVICE_AREAS.map((service, index) => {
              const IconComponent = iconMap[service.icon];
              return (
                <Link key={service.id} href={service.href} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {IconComponent && (
                            <IconComponent className="h-5 w-5" />
                          )}
                        </div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {service.shortTitle}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">
                        {service.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Image/Visual Side */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center overflow-hidden">
                {/* Placeholder for professional headshot */}
                <div className="text-center p-8">
                <Image 
                  src="/HomePageAssets/AboutUs1.jpeg" 
                  alt="SIDEC" 
                  fill
                  className="object-cover rounded-3xl"
                  priority
                />
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-card shadow-xl border hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">25+</div>
                    <div className="text-xs text-muted-foreground">
                      Years Exp.
                    </div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">100+</div>
                    <div className="text-xs text-muted-foreground">
                      Projects
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="mb-4">
                About Us
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                25+ Years of Medical Device Manufacturing Excellence
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                With over two decades of experience in medical device
                manufacturing, we bring deep expertise in injection molding
                processes, ISO 13485 quality systems, regulatory compliance, and
                facility design. Our background includes leadership roles at
                Fortune 500 medical device companies.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Extensive injection molding & scientific molding expertise",
                  "ISO 13485, FDA 21 CFR 820, EU MDR Expert",
                  "Global Supplier Quality & Development Experience",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Cytovale Inspired */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Our Approach
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A Proven Process for Success
            </h2>
            <p className="mt-4 text-muted-foreground">
              We follow a structured approach to ensure your project delivers
              measurable results.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description:
                  "Comprehensive assessment of your current state, challenges, and objectives.",
              },
              {
                step: "02",
                title: "Solution Design",
                description:
                  "Develop tailored strategies and action plans aligned with your goals.",
              },
              {
                step: "03",
                title: "Implementation",
                description:
                  "Execute the plan with hands-on support and expert guidance.",
              },
              {
                step: "04",
                title: "Validation",
                description:
                  "Verify results, document outcomes, and ensure sustainable success.",
              },
            ].map((phase, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {phase.description}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="h-5 w-5 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Resources/Blog Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <Badge variant="outline" className="mb-4">
                Resources & Insights
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Latest from Our Blog
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl">
                Industry insights, best practices, and expert guidance for
                medical device manufacturing professionals.
              </p>
            </div>
            <Link href="/resources">
              <Button variant="outline" className="shrink-0">
                View All Resources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Blog Posts Grid - Dynamic Content */}
          {latestPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  featuredImage={post.featuredImage}
                  category={post.category}
                  author={post.author}
                  publishedAt={post.publishedAt}
                  readingTime={post.readingTime}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Placeholder cards when no posts exist */}
              {[
                {
                  title: "ISO 13485:2016 Implementation Guide",
                  excerpt: "A comprehensive guide to implementing ISO 13485 quality management systems for medical device manufacturers.",
                  category: "Quality Systems",
                },
                {
                  title: "Scientific Molding Best Practices",
                  excerpt: "Learn the fundamentals of scientific molding and how to optimize your injection molding processes for consistency.",
                  category: "Process Development",
                },
                {
                  title: "FDA 21 CFR 820 Compliance Checklist",
                  excerpt: "Essential checklist for ensuring your quality system meets FDA requirements for medical device manufacturing.",
                  category: "Regulatory Compliance",
                },
              ].map((post, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Coming Soon
                      </span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Newsletter CTA */}
          <NewsletterForm />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Elevate Your Manufacturing Operations?"
        description="Let's discuss how our expertise can help your medical device company achieve manufacturing excellence and regulatory compliance."
        primaryButtonText="Schedule a Consultation"
        primaryButtonHref="/contact"
        secondaryButtonText="View Services"
        secondaryButtonHref="/services"
      />
    </MainLayout>
  );
}
