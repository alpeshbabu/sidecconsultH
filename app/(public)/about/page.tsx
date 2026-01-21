import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle,
  Factory,
  FlaskConical,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  Shield,
  Sparkles,
  Target,
  Users,
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
import { AnimatedStats, CTASection } from "@/components/sections";
import Image from "next/image";
import { createPersonSchema, getJsonLd } from "@/lib/structured-data";


export const metadata: Metadata = {
  title: "About",
  description:
    "25+ years of expertise in medical device manufacturing. Expert in ISO 13485, FDA regulations, injection molding processes, and global supplier development.",
  openGraph: {
    title: "About | SIDEC Consulting",
    description:
      "25+ years of expertise in medical device manufacturing, ISO 13485 quality systems, and injection molding process development.",
    url: "/about",
    images: [
      {
        url: "/AboutPageAssets/aboutus1.jpeg",
        width: 1200,
        height: 630,
        alt: "SIDEC Consulting - About",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | SIDEC Consulting",
    description:
      "25+ years of expertise in medical device manufacturing, ISO 13485 quality systems, and injection molding process development.",
    images: ["/AboutPageAssets/aboutus1.jpeg"],
  },
  alternates: {
    canonical: "/about",
  },
};

// Stats for the about page
const aboutStats = [
  { value: "25+", label: "Years Experience" },
  { value: "100+", label: "Projects Completed" },
  { value: "50+", label: "Companies Served" },
  { value: "6", label: "Continents Worked" },
] as const;

// Expertise areas with icons
const expertiseAreas = [
  {
    icon: Factory,
    title: "Injection Molding",
    items: [
      "Scientific Molding Methodology",
      "Process Development & Validation",
      "Design of Experiments (DOE)",
      "Automation & Robotics Integration",
      "Material Selection & Compatibility",
    ],
  },
  {
    icon: Shield,
    title: "Quality & Regulatory",
    items: [
      "ISO 13485 Quality Systems",
      "FDA 21 CFR Part 820",
      "EU MDR (2017/745)",
      "MDSAP Compliance",
      "510(k) Submissions",
    ],
  },
  {
    icon: FlaskConical,
    title: "Process Engineering",
    items: [
      "Process Validation (IQ/OQ/PQ)",
      "Risk Management (ISO 14971)",
      "Design Controls",
      "Statistical Process Control",
      "Root Cause Analysis",
    ],
  },
  {
    icon: Globe,
    title: "Global Operations",
    items: [
      "Supplier Quality Management",
      "Global Supply Chain Strategy",
      "Technology Transfer",
      "Due Diligence & M&A Support",
      "Facility Design & Build",
    ],
  },
];

// Career timeline
const careerTimeline = [
  {
    period: "Current",
    role: "Associate Director, Manufacturing Engineering",
    company: "USA Molding Operations",
    description:
      "Leading manufacturing engineering for domestic injection molding operations, overseeing process development, equipment qualification, and continuous improvement initiatives across multiple production facilities.",
  },
  {
    period: "Technical Expert",
    role: "Principal Engineer, Manufacturing Engineering",
    company: "Internal Molding Subject Matter Expert",
    description:
      "Served as the organization's go-to expert for injection molding challenges, providing technical guidance on scientific molding, process validation, tooling optimization, and troubleshooting complex manufacturing issues.",
  },
  {
    period: "Manufacturing Leadership",
    role: "Senior Manager, Manufacturing Engineering",
    company: "Manufacturing Engineering",
    description:
      "Managed cross-functional manufacturing engineering teams, led major process development projects, implemented lean manufacturing initiatives, and drove operational excellence across production lines.",
  },
  {
    period: "Quality Leadership",
    role: "Director, Quality",
    company: "Quality Management",
    description:
      "Directed quality management systems, led FDA and Notified Body audit preparations, managed CAPA programs, and ensured compliance with ISO 13485, FDA 21 CFR 820, and EU MDR requirements.",
  },
  {
    period: "Design Assurance",
    role: "Senior Manager & Principal Engineer",
    company: "Design Assurance Quality",
    description:
      "Led design assurance activities ensuring product designs met regulatory requirements and manufacturing feasibility. Managed design controls, risk management (ISO 14971), and design transfer processes.",
  },
  {
    period: "Foundation",
    role: "Engineering Manager → Project Engineer",
    company: "Career Foundation",
    description:
      "Built foundational expertise through progressive roles: Engineering Manager leading technical teams, Project Manager driving cross-functional initiatives, and Project Engineer developing hands-on manufacturing skills.",
  },
];

// Deep expertise areas
const deepExpertise = [
  {
    area: "Manufacturing Engineering Excellence",
    description:
      "From Associate Director to Project Engineer—deep hands-on expertise in injection molding, process development, and operational excellence",
    icon: Factory,
  },
  {
    area: "Quality & Regulatory Leadership",
    description:
      "Director-level experience building and managing quality systems that satisfy FDA, ISO, and EU MDR requirements",
    icon: Shield,
  },
  {
    area: "Design Assurance & R&D",
    description:
      "Principal Engineer and Director experience ensuring designs are manufacturable, compliant, and optimized for production",
    icon: FlaskConical,
  },
];

// Certifications
const certifications = [
  "ISO 13485:2016",
  "FDA 21 CFR Part 820",
  "EU MDR 2017/745",
  "MDSAP",
  "ISO 14971",
  "IEC 62366-1",
  "ISO 14644 (Cleanrooms)",
  "ISO 15223 (Symbols)",
];

// Education
const education = [
  {
    degree: "M.Sc. Organic Chemistry",
    specialization: "Polymer Specialization",
    description:
      "Advanced studies in organic chemistry with specialization in polymer science, providing deep understanding of material properties, polymer processing, and chemical interactions critical to medical device manufacturing.",
  },
  {
    degree: "PG Diploma in Plastics Engineering",
    specialization: "Plastics Processing & Engineering",
    description:
      "Comprehensive training in plastics processing technologies, mold design, material selection, and manufacturing engineering principles essential for injection molding excellence.",
  },
];

// Core values
const coreValues = [
  {
    icon: Target,
    title: "Quality First",
    description:
      "Unwavering commitment to quality and patient safety in every recommendation and implementation.",
  },
  {
    icon: Users,
    title: "Collaborative Approach",
    description:
      "Working alongside your team to transfer knowledge and build lasting internal capabilities.",
  },
  {
    icon: Award,
    title: "Results-Driven",
    description:
      "Focused on delivering measurable outcomes that improve operations and reduce costs.",
  },
  {
    icon: Briefcase,
    title: "Practical Solutions",
    description:
      "Real-world, implementable solutions based on decades of hands-on manufacturing experience.",
  },
];

export default function AboutPage() {
  // Generate Person schema for JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";
  const personSchema = createPersonSchema(baseUrl);

  return (
    <MainLayout>
      {/* JSON-LD Structured Data for Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: getJsonLd(personSchema) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container-wide py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div>
              <Badge
                variant="outline"
                className="mb-6 px-4 py-1.5 border-primary/30 bg-primary/5"
              >
                <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                About Us
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your Manufacturing Excellence Partner
              </h1>
              <p className="mt-2 text-xl text-muted-foreground">
                Medical Device Manufacturing Experts | 25+ Years Experience
              </p>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                SIDEC Consulting brings over{" "}
                <span className="font-semibold text-foreground">25 years</span>{" "}
                of hands-on experience in medical device manufacturing. Our
                founder has held leadership positions from Project Engineer to
                Associate Director, building deep expertise across manufacturing
                engineering, quality systems, design assurance, and R&D.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                This unique cross-functional experience—spanning injection
                molding operations, quality management, design controls, and
                product development—enables us to understand your challenges
                from multiple perspectives and deliver comprehensive solutions
                that work.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/schedule">
                  <Button size="lg" className="btn-glow">
                    Schedule Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <a
                    href="https://linkedin.com/in/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    Connect on LinkedIn
                  </a>
                </Button>
              </div>
            </div>

            {/* Profile Image Placeholder */}
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 shadow-2xl">
                <div className="flex h-full flex-col items-center justify-center p-8">
                  <Image src="/AboutPageAssets/aboutus2.png" alt="SIDEC" fill className="object-cover rounded-3xl" priority />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-primary/10 blur-2xl" />
              <div className="absolute -right-4 -top-4 h-32 w-32 rounded-xl bg-accent/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedStats stats={aboutStats} />

      {/* Expertise Areas Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Areas of Expertise
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Deep Technical Knowledge
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our expertise comes from real-world experience—not textbooks. From
              running injection molding operations to leading quality
              organizations to directing R&D teams, we&apos;ve done the work and
              know what it takes to succeed.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {expertiseAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <Card key={index} className="relative overflow-hidden card-hover">
                  <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/5" />
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {area.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Career Journey Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Career Journey
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Professional Background
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our founder&apos;s career spans 6 progressive roles across
              manufacturing engineering, quality, design assurance, and
              R&D—providing the cross-functional expertise that sets SIDEC
              Consulting apart.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-40px)] before:w-0.5 before:bg-border md:before:left-1/2 md:before:-translate-x-px">
              {careerTimeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col gap-4 md:flex-row ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground md:left-1/2 md:-translate-x-1/2">
                    <Briefcase className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-16 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                    }`}
                  >
                    <Card className="card-hover">
                      <CardHeader className="pb-2">
                        <Badge variant="outline" className="w-fit">
                          {item.period}
                        </Badge>
                        <CardTitle className="text-lg">{item.role}</CardTitle>
                        <CardDescription className="font-medium text-primary">
                          {item.company}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education & Credentials Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Education */}
            <div>
              <Badge variant="outline" className="mb-4">
                Education
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Academic Foundation
              </h2>
              <p className="mt-4 text-muted-foreground">
                Strong academic credentials in chemistry and plastics engineering
                provide the scientific foundation for our technical expertise.
              </p>
              <div className="mt-8 space-y-6">
                {education.map((edu, index) => (
                  <Card key={index} className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-sm text-primary font-medium">
                            {edu.specialization}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {edu.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CV Download / Connect */}
            <div>
              <Badge variant="outline" className="mb-4">
                Connect
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Learn More About Us
              </h2>
              <p className="mt-4 text-muted-foreground">
                Interested in learning more about our background and
                qualifications? Schedule a consultation to discuss how we can
                help your organization.
              </p>

              <div className="mt-8 space-y-4">
                {/* Email Card */}
                <Card className="card-hover overflow-hidden">
                  <CardContent className="p-0">
                    <Link
                      href="/schedule"
                      className="flex items-center gap-4 p-6 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Get in Touch</h3>
                        <p className="text-sm text-muted-foreground">
                          Schedule a consultation or ask questions
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Expertise & Certifications Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Deep Expertise */}
            <div>
              <Badge variant="outline" className="mb-4">
                What Sets Us Apart
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Cross-Functional Expertise
              </h2>
              <p className="mt-4 text-muted-foreground">
                Unlike consultants who specialize in just one area, our
                founder&apos;s career spans manufacturing, quality, design
                assurance, and R&D—enabling us to see the full picture and
                deliver solutions that work across your organization.
              </p>
              <div className="mt-8 space-y-4">
                {deepExpertise.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={index} className="card-hover">
                      <CardContent className="flex items-start gap-4 p-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.area}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Regulatory Expertise */}
            <div>
              <Badge variant="outline" className="mb-4">
                Regulatory Expertise
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Standards & Certifications
              </h2>
              <p className="mt-4 text-muted-foreground">
                Deep knowledge of global regulatory requirements for medical
                device manufacturing and quality management systems.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-semibold">
                    Regulatory Experience Includes:
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "510(k) submission preparation and support",
                      "EU MDR Technical File development",
                      "FDA and Notified Body audit preparation",
                      "Quality system gap assessments",
                      "CAPA and complaint handling systems",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Philosophy
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Consulting Approach
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every engagement is guided by core principles that ensure lasting
              value for your organization.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center card-hover">
                  <CardHeader>
                    <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quote */}
          <div className="mx-auto mt-16 max-w-3xl">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8 text-center">
                <blockquote className="text-xl font-medium italic text-foreground">
                  &ldquo;Our goal is not just to solve your immediate
                  challenges, but to build capabilities within your organization
                  that drive continuous improvement long after our engagement
                  ends.&rdquo;
                </blockquote>
                <p className="mt-4 font-semibold text-primary">
                  — SIDEC Consulting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Let's Work Together"
        description="Whether you're facing a specific manufacturing challenge or looking to elevate your entire operation, we're here to help you succeed."
        primaryButtonText="Schedule a Consultation"
        primaryButtonHref="/contact"
      />
    </MainLayout>
  );
}
