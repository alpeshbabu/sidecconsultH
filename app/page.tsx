import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SERVICE_AREAS, STATS } from "@/lib/constants";

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

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Simplified for Phase 1 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-wide flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cog className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">MedDevice Consulting</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors">
              Resources
            </Link>
            <Link href="/contact">
              <Button>Contact</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-hero">
          <div className="container-wide py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6">
                25+ Years of Medical Device Expertise
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
                Expert{" "}
                <span className="text-gradient">Medical Device</span>{" "}
                Manufacturing Consulting
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto text-balance">
                ISO 13485 quality systems, injection molding process development, regulatory
                compliance, and facility design expertise for medical device companies worldwide.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="btn-glow w-full sm:w-auto">
                    Schedule Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-3xl" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/30">
          <div className="container-wide py-12">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Overview Section */}
        <section className="section-padding">
          <div className="container-wide">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Comprehensive Consulting Services
              </h2>
              <p className="mt-4 text-muted-foreground">
                End-to-end solutions for medical device manufacturing, from regulatory compliance
                to facility design.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {SERVICE_AREAS.slice(0, 4).map((service) => {
                const IconComponent = iconMap[service.icon];
                return (
                  <Card key={service.id} className="card-hover">
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {IconComponent && <IconComponent className="h-6 w-6" />}
                      </div>
                      <CardTitle className="text-xl">{service.shortTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {service.description}
                      </CardDescription>
                      <Link
                        href={service.href}
                        className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        Learn more
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_AREAS.slice(4).map((service) => {
                const IconComponent = iconMap[service.icon];
                return (
                  <Card key={service.id} className="card-hover">
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {IconComponent && <IconComponent className="h-6 w-6" />}
                      </div>
                      <CardTitle className="text-xl">{service.shortTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {service.description}
                      </CardDescription>
                      <Link
                        href={service.href}
                        className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        Learn more
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="mt-12 text-center">
              <Link href="/services">
                <Button variant="outline" size="lg">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Preview Section */}
        <section className="section-padding gradient-section">
          <div className="container-wide">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <Badge variant="outline" className="mb-4">
                  About the Consultant
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  25+ Years of Medical Device Manufacturing Excellence
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  With over two decades of experience in medical device manufacturing, I bring
                  deep expertise in injection molding processes, ISO 13485 quality systems,
                  regulatory compliance, and facility design. My background includes leadership
                  roles at Fortune 500 medical device companies.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "M.Sc. in Organic Chemistry with Polymer Specialization",
                    "PG Diploma in Plastics Engineering",
                    "ISO 13485, FDA 21 CFR 820, EU MDR Expert",
                    "Global Supplier Quality & Development Experience",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/about">
                    <Button variant="outline">
                      Learn More About Me
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="h-24 w-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <ShieldCheck className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-muted-foreground">Professional headshot placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-wide text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Elevate Your Manufacturing Operations?
            </h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
              Let&apos;s discuss how my expertise can help your medical device company achieve
              manufacturing excellence and regulatory compliance.
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="btn-glow">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Simplified for Phase 1 */}
      <footer className="border-t bg-muted/30">
        <div className="container-wide py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Cog className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">MedDevice Consulting</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground max-w-sm">
                Expert consulting services for medical device manufacturing, quality systems,
                and regulatory compliance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/services#manufacturing-engineering" className="hover:text-foreground transition-colors">
                    Manufacturing Engineering
                  </Link>
                </li>
                <li>
                  <Link href="/services#quality-regulatory" className="hover:text-foreground transition-colors">
                    Quality & Regulatory
                  </Link>
                </li>
                <li>
                  <Link href="/services#injection-molding" className="hover:text-foreground transition-colors">
                    Process Excellence
                  </Link>
                </li>
                <li>
                  <Link href="/services#facility-design" className="hover:text-foreground transition-colors">
                    Facility Design
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-foreground transition-colors">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MedDevice Consulting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
