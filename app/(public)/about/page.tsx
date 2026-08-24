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
import { MainLayout } from "@/components/layout";
import { AnimatedStats, CTASection } from "@/components/sections";
import Image from "next/image";
import { createPersonSchema, createBreadcrumbSchema, getJsonLd } from "@/lib/structured-data";


export const metadata: Metadata = {
  title: "About",
  description:
    "25+ years in medical device injection molding — scientific molding, DOE, and process validation under ISO 13485, facility design, and quality systems compliance.",
  openGraph: {
    title: "About | SIDEC Consulting",
    description:
      "Deep injection molding and regulated-manufacturing expertise: manufacturing engineering, quality and compliance, process excellence, and facility design.",
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
      "Deep injection molding and regulated-manufacturing expertise: manufacturing engineering, quality and compliance, process excellence, and facility design.",
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

// Expertise areas with icons — domain depth
const expertiseAreas = [
  {
    icon: Factory,
    title: "Injection Molding Process Excellence",
    items: [
      "Scientific Molding Methodology",
      "Design of Experiments (DOE) studies",
      "Process validation (IQ/OQ/PQ)",
      "Equipment & mold qualification",
      "Surrogate modeling & process optimization",
    ],
  },
  {
    icon: Shield,
    title: "Quality Systems & Regulatory Compliance",
    items: [
      "ISO 13485 Quality Management System implementation",
      "FDA 21 CFR Part 820 / QMSR compliance programs",
      "Design controls & risk management (ISO 14971)",
      "Computer Software Assurance (CSA) implementation",
      "Audit preparation (FDA, Notified Bodies)",
    ],
  },
  {
    icon: FlaskConical,
    title: "Manufacturing Engineering & Operations",
    items: [
      "Process optimization & continuous improvement",
      "Lean manufacturing & Six Sigma programs",
      "Manufacturing cost reduction strategies",
      "Production capacity planning & scaling",
      "Defect analysis & root-cause investigations",
    ],
  },
  {
    icon: Globe,
    title: "Facility Design & Smart Factory Integration",
    items: [
      "Greenfield & brownfield facility planning",
      "Cleanroom design & classification (ISO 7/8)",
      "Global supplier quality & supply chain strategy",
      "IIoT data foundation & connectivity",
      "Preventive & predictive maintenance programs",
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
    area: "Molding-Floor Credibility",
    description:
      "From Associate Director to Project Engineer—we've actually run operations, so our advice is grounded in scientific molding and DOE, not theory",
    icon: Factory,
  },
  {
    area: "Regulatory Compliance",
    description:
      "Director-level quality experience means we build quality systems that satisfy FDA, ISO, and EU MDR auditors, keeping you compliant and audit-ready",
    icon: Shield,
  },
  {
    area: "Operational ROI",
    description:
      "We map where improvements pay off and focus on actions that return real value, not just chasing technology trends",
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
      "Advanced studies in organic chemistry with specialization in polymer science, providing deep understanding of material properties, polymer processing, and chemical interactions critical to injection molding manufacturing.",
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
  // Generate Person + Breadcrumb schemas for JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";
  const personSchema = createPersonSchema(baseUrl);
  const breadcrumbSchema = createBreadcrumbSchema(baseUrl, [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);

  return (
    <MainLayout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: getJsonLd([personSchema, breadcrumbSchema]) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
        </div>

        <div className="container-wide py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div>
              <p className="eyebrow mb-5">About Us</p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Expert engineering & quality systems{" "}
                <span className="text-signal">for medical molding</span>
              </h1>
              <p className="mt-2 text-xl text-muted-foreground">
                Injection Molding, Quality Systems & Operations | 25+ Years Experience
              </p>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                SIDEC Consulting brings over{" "}
                <span className="font-semibold text-foreground">25 years</span>{" "}
                of hands-on experience in medical device injection molding —
                scientific molding, DOE, process validation, and ISO 13485
                quality systems, across leadership roles from Project Engineer to
                Associate Director.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                We provide end-to-end support across manufacturing engineering,
                quality systems compliance, process excellence, and facility design —
                including advanced smart manufacturing and data analytics capabilities
                when your operation is ready to scale.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/schedule">
                    Schedule a Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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

            {/* Profile Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-hairline shadow-lg">
                <Image
                  src="/AboutPageAssets/aboutus2.png"
                  alt="SIDEC Consulting founder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                  priority
                />
              </div>
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
            <p className="eyebrow mb-5 justify-center">Areas of Expertise</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Core Technical & Regulatory Expertise
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our consulting comes from real-world manufacturing experience — not just
              theory. Because we&apos;ve run injection molding operations, led quality
              organizations, and validated processes, our advice fits how a regulated
              plant actually works.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {expertiseAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <Card key={index} className="card-technical group rounded-none">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-display text-xl">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {area.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
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
      <section className="section-padding bg-muted/20 hairline-t">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Career Journey</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
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
            <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-40px)] before:w-px before:bg-hairline md:before:left-1/2 md:before:-translate-x-px">
              {careerTimeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col gap-4 md:flex-row ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 z-10 flex h-10 w-10 items-center justify-center border border-hairline bg-background text-signal md:left-1/2 md:-translate-x-1/2">
                    <Briefcase className="h-4 w-4" />
                  </div>

                  {/* Content — pad the center-facing side so the card never
                      overlaps the centered timeline dot. */}
                  <div
                    className={`ml-16 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pl-16" : "md:pr-16"
                    }`}
                  >
                    <Card className="card-technical rounded-none">
                      <CardHeader className="pb-2">
                        <span className="w-fit rounded-sm border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                          {item.period}
                        </span>
                        <CardTitle className="font-display text-lg">{item.role}</CardTitle>
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
              <p className="eyebrow mb-5">Education</p>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Academic Foundation
              </h2>
              <p className="mt-4 text-muted-foreground">
                Strong academic credentials in chemistry and plastics engineering
                provide the scientific foundation for our technical expertise.
              </p>
              <div className="mt-8 space-y-6">
                {education.map((edu, index) => (
                  <Card key={index} className="card-technical group rounded-none">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold">{edu.degree}</h3>
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
              <p className="eyebrow mb-5">Connect</p>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Learn More About Us
              </h2>
              <p className="mt-4 text-muted-foreground">
                Interested in learning more about our background and
                qualifications? Schedule a consultation to discuss how we can
                help your organization.
              </p>

              <div className="mt-8 space-y-4">
                {/* Email Card */}
                <Card className="card-technical group overflow-hidden rounded-none">
                  <CardContent className="p-0">
                    <Link
                      href="/schedule"
                      className="flex items-center gap-4 p-6 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                        <Mail className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold">Get in Touch</h3>
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
      <section className="section-padding bg-muted/20 hairline-t">
        <div className="container-wide">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Deep Expertise */}
            <div>
              <p className="eyebrow mb-5">What Sets Us Apart</p>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
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
                    <Card key={index} className="card-technical group rounded-none">
                      <CardContent className="flex items-start gap-4 p-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold">{item.area}</h3>
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
              <p className="eyebrow mb-5">Regulatory Expertise</p>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Standards & Certifications
              </h2>
              <p className="mt-4 text-muted-foreground">
                Deep knowledge of global regulatory requirements for medical
                device manufacturing — and how to validate software and systems
                under the new FDA QMSR.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="rounded-sm border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {cert}
                  </span>
                ))}
              </div>
              <Card className="card-technical mt-6 rounded-none">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-display font-semibold">
                    Regulatory Experience Includes:
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Process validation & automated inspection under QMSR",
                      "Computer Software Assurance (CSA) for manufacturing systems",
                      "FDA and Notified Body audit preparation",
                      "Predetermined Change Control for models that retrain",
                      "510(k) support, EU MDR technical files & CAPA systems",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
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
      <section className="section-padding hairline-t">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-5 justify-center">Philosophy</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
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
                <Card key={index} className="card-technical group rounded-none text-center">
                  <CardHeader>
                    <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <CardTitle className="font-display text-lg">{value.title}</CardTitle>
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
            <div className="surface-ink relative overflow-hidden rounded-none">
              <div className="grid-dots absolute inset-0 opacity-50" aria-hidden />
              <div className="relative p-8 text-center">
                <blockquote className="text-xl font-medium italic text-ink-foreground">
                  &ldquo;Our goal is not just to solve your immediate
                  challenges, but to build capabilities within your organization
                  that drive continuous improvement long after our engagement
                  ends.&rdquo;
                </blockquote>
                <p className="mt-4 font-semibold text-signal">
                  — SIDEC Consulting
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Let's Work Together"
        description="Whether you are expanding operations, building a quality system, or optimizing your molding process, we bring the hands-on manufacturing experience to make it work."
        primaryButtonText="Schedule a Consultation"
        primaryButtonHref="/schedule"
        secondaryButtonText="Explore Services"
        secondaryButtonHref="/services"
      />
    </MainLayout>
  );
}
