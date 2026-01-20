import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building,
  CheckCircle,
  ClipboardCheck,
  Cog,
  FlaskConical,
  FileCheck,
  Globe,
  Lightbulb,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wrench,
  Zap,
  Layers,
  Factory,
  Scale,
  Rocket,
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
import { CTASection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Comprehensive consulting services for medical device manufacturing: Manufacturing Engineering, Quality & Regulatory Compliance, Injection Molding Process Excellence, Facility Design, Supplier Development, and Strategic Advisory.",
  openGraph: {
    title: "Services | SIDEC Consulting",
    description:
      "Expert consulting services for medical device manufacturing, quality systems, injection molding, and regulatory compliance.",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | SIDEC Consulting",
    description:
      "Expert consulting services for medical device manufacturing, quality systems, injection molding, and regulatory compliance.",
  },
  alternates: {
    canonical: "/services",
  },
};

// Icon mapping for dynamic icon loading
const iconMap: Record<string, any> = {
  Factory,
  Scale,
  Layers,
  Rocket,
  Settings,
  Wrench,
  ShieldCheck,
  Cog,
  Building,
  Globe,
  Lightbulb,
  Sparkles,
  Target,
  Users,
  Shield,
  Zap,
};

// Fetch services from database
async function getServices() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/services`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.error("Failed to fetch services");
      return { serviceCategories: [] };
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    return { serviceCategories: [] };
  }
}

// Fallback hardcoded service categories (in case API fails)
const fallbackServiceCategories = [
  {
    id: "manufacturing-operations",
    name: "Manufacturing & Operations",
    description: "Build and optimize world-class manufacturing capabilities",
    icon: "Factory",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30",
    services: [
      {
        id: "manufacturing-engineering",
        icon: Settings,
        title: "Manufacturing Engineering & Operations",
        tagline: "Build World-Class Manufacturing Capabilities",
        description:
          "We help medical device companies build and optimize their manufacturing engineering organizations. From talent development to process optimization, we deliver sustainable improvements that drive quality and efficiency.",
        keyOfferings: [
          "Manufacturing engineering team development and organizational design",
          "Process optimization and continuous improvement programs",
          "Lean manufacturing and Six Sigma implementation",
          "Equipment selection, qualification, and optimization",
          "Manufacturing cost reduction strategies",
          "Production capacity planning and scaling",
        ],
        outcomes: [
          "Reduced manufacturing costs by 15-30%",
          "Improved first-pass yield rates",
          "Faster time-to-market for new products",
          "Sustainable internal capabilities",
        ],
      },
      {
        id: "equipment-maintenance",
        icon: Wrench,
        title: "Equipment & Mold Maintenance",
        tagline: "Maximize Equipment Uptime and Performance",
        description:
          "Effective maintenance programs are critical to manufacturing success. We help companies implement preventive and predictive maintenance strategies that maximize equipment availability and extend asset life.",
        keyOfferings: [
          "Preventive maintenance program development",
          "Mold maintenance standards and procedures",
          "CMMS (Computerized Maintenance Management System) selection and implementation",
          "Spare parts inventory optimization",
          "Equipment lifecycle management",
          "Maintenance team training and development",
          "TPM (Total Productive Maintenance) implementation",
          "Equipment reliability analysis",
        ],
        outcomes: [
          "Increased equipment uptime (OEE)",
          "Extended mold and equipment life",
          "Reduced unplanned downtime",
          "Optimized maintenance costs",
        ],
      },
    ],
  },
  {
    id: "quality-compliance",
    name: "Quality & Compliance",
    description: "Navigate regulatory requirements with confidence",
    icon: Scale,
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
    services: [
      {
        id: "quality-regulatory",
        icon: ShieldCheck,
        title: "Quality & Regulatory Compliance",
        tagline: "Navigate Regulatory Requirements with Confidence",
        description:
          "With director-level quality management experience, we help companies build robust quality systems that satisfy FDA, ISO, and global regulatory requirements while remaining practical and efficient to operate.",
        keyOfferings: [
          "ISO 13485 Quality Management System implementation",
          "FDA 21 CFR Part 820 compliance programs",
          "EU MDR (2017/745) transition and compliance",
          "MDSAP certification preparation",
          "510(k) submission support and strategy",
          "Design controls and risk management (ISO 14971)",
          "CAPA system optimization",
          "Audit preparation (FDA, Notified Bodies, customers)",
        ],
        outcomes: [
          "Successful regulatory submissions",
          "Clean audit results",
          "Efficient quality systems",
          "Reduced compliance burden",
        ],
      },
    ],
  },
  {
    id: "process-technical",
    name: "Process & Technical Excellence",
    description: "Master the science of manufacturing processes",
    icon: Layers,
    color: "from-violet-500/20 to-violet-600/10",
    borderColor: "border-violet-500/30",
    services: [
      {
        id: "injection-molding",
        icon: Cog,
        title: "Injection Molding Process Excellence",
        tagline: "Master the Science of Injection Molding",
        description:
          "As recognized internal molding subject matter experts, we bring deep technical expertise in scientific molding methodology, process development, and troubleshooting. We help companies achieve consistent, validated processes that deliver quality parts.",
        keyOfferings: [
          "Scientific molding methodology implementation",
          "Process development and optimization",
          "Design of Experiments (DOE) studies",
          "Process validation (IQ/OQ/PQ)",
          "Mold qualification and capability studies",
          "Process troubleshooting and root cause analysis",
          "Automation and robotics integration",
          "Material selection and qualification",
        ],
        outcomes: [
          "Robust, validated processes",
          "Reduced scrap and rework",
          "Improved cycle times",
          "Consistent part quality",
        ],
      },
      {
        id: "facility-design",
        icon: Building,
        title: "Facility Design & Infrastructure",
        tagline: "Design Facilities Built for Manufacturing Excellence",
        description:
          "We've built facilities from the ground up. From greenfield site selection to cleanroom design, we help companies create manufacturing environments that support quality, efficiency, and regulatory compliance.",
        keyOfferings: [
          "Greenfield and brownfield facility planning",
          "Cleanroom design and classification (ISO 7/8)",
          "Production floor layout optimization",
          "Utility systems design (compressed air, cooling, electrical)",
          "Material flow and logistics optimization",
          "Environmental monitoring systems",
          "EHS (Environmental Health & Safety) compliance",
          "Facility expansion and renovation planning",
        ],
        outcomes: [
          "Optimized production flow",
          "Regulatory-compliant facilities",
          "Efficient space utilization",
          "Scalable infrastructure",
        ],
      },
    ],
  },
  {
    id: "strategy-supply-chain",
    name: "Strategy & Supply Chain",
    description: "Build resilient operations and strategic advantage",
    icon: Rocket,
    color: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-500/30",
    services: [
      {
        id: "supplier-development",
        icon: Globe,
        title: "Supplier Development & Global Supply Chain",
        tagline: "Build a Resilient Global Supply Network",
        description:
          "With experience developing suppliers across six continents, we help companies build robust supply chains. From supplier qualification to ongoing development, we ensure your supply base meets quality and delivery requirements.",
        keyOfferings: [
          "Global supplier strategy development",
          "Supplier qualification and approval programs",
          "Supplier quality management systems",
          "Supplier audits and assessments",
          "Supply chain risk management",
          "Dual-sourcing and localization strategies",
          "Supplier performance management (scorecards, reviews)",
          "Contract manufacturing management",
        ],
        outcomes: [
          "Qualified, reliable supplier base",
          "Reduced supply chain risk",
          "Improved supplier quality",
          "Optimized total cost of ownership",
        ],
      },
      {
        id: "strategic-advisory",
        icon: Lightbulb,
        title: "Strategic Advisory & Expert Services",
        tagline: "Expert Guidance for Critical Decisions",
        description:
          "We provide strategic advisory services for complex situations requiring deep expertise. From technology transfer to M&A due diligence, we help companies navigate critical decisions with confidence.",
        keyOfferings: [
          "Technology transfer planning and execution",
          "Due diligence for mergers and acquisitions",
          "Expert witness services for litigation",
          "Custom training program development",
          "Manufacturing strategy consulting",
          "Make vs. buy analysis",
          "Competitive benchmarking",
          "Organizational capability assessments",
        ],
        outcomes: [
          "Informed strategic decisions",
          "Successful technology transfers",
          "Risk mitigation",
          "Knowledge transfer to your team",
        ],
      },
    ],
  },
];

// Why choose us items
const whyChooseUs = [
  {
    icon: Target,
    title: "Cross-Functional Expertise",
    description:
      "Experience spanning manufacturing, quality, design assurance, and R&D means we understand your challenges from every angle.",
  },
  {
    icon: Users,
    title: "Hands-On Approach",
    description:
      "We don't just advise—we work alongside your team, building internal capabilities that last long after our engagement ends.",
  },
  {
    icon: Shield,
    title: "Regulatory Confidence",
    description:
      "Director-level quality experience means we know what auditors look for and how to build systems that satisfy requirements.",
  },
  {
    icon: Zap,
    title: "Practical Solutions",
    description:
      "No ivory tower recommendations. Every solution is grounded in 25+ years of real-world manufacturing experience.",
  },
];

// Engagement models
const engagementModels = [
  {
    title: "Project-Based",
    description:
      "Defined scope engagements with clear deliverables and timelines",
    examples: ["Process validation", "Quality system implementation", "Facility design"],
  },
  {
    title: "Retainer",
    description:
      "Ongoing access to expertise for continuous support and guidance",
    examples: ["Monthly advisory hours", "On-call troubleshooting", "Audit preparation"],
  },
  {
    title: "Training",
    description: "Custom training programs to build your team's capabilities",
    examples: ["Scientific molding", "Quality systems", "Process validation"],
  },
];

export default async function ServicesPage() {
  // Fetch services from database
  const { serviceCategories: dbServiceCategories } = await getServices();
  
  // Category descriptions mapping
  const categoryDescriptions: Record<string, string> = {
    "manufacturing-operations": "Build and optimize world-class manufacturing capabilities",
    "quality-compliance": "Navigate regulatory requirements with confidence",
    "process-technical": "Master the science of manufacturing processes",
    "strategy-supply-chain": "Build resilient operations and strategic advantage",
  };

  // Use database services if available, otherwise use fallback
  const serviceCategories = dbServiceCategories.length > 0 
    ? dbServiceCategories.map((cat: any) => ({
        ...cat,
        description: categoryDescriptions[cat.slug] || "",
        icon: iconMap[cat.icon] || Factory,
        services: cat.services.map((service: any) => ({
          ...service,
          icon: iconMap[service.icon] || Settings,
        }))
      }))
    : fallbackServiceCategories;
  
  // Flatten all services for quick navigation
  const allServices = serviceCategories.flatMap((cat: any) => cat.services);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container-wide py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 border-primary/30 bg-primary/5"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
              Consulting Services
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Expert Solutions for{" "}
              <span className="text-gradient">Medical Device Manufacturing</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              From injection molding process development to quality system
              implementation, we bring 25+ years of hands-on experience to help
              your organization achieve manufacturing excellence.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/schedule">
                <Button size="lg" className="btn-glow">
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#categories">
                <Button size="lg" variant="outline">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Navigation */}
      <section className="border-y bg-muted/30 py-8" id="categories">
        <div className="container-wide">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((category: any) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.id} href={`#${category.id}`}>
                  <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${category.borderColor} bg-gradient-to-br ${category.color}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background/80 text-primary">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {category.services.length} service{category.services.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services by Category */}
      <div id="services">
        {serviceCategories.map((category: any, categoryIndex: number) => {
          const CategoryIcon = category.icon;
          
          return (
            <section
              key={category.id}
              id={category.id}
              className={`section-padding ${categoryIndex % 2 === 1 ? "bg-muted/30" : ""}`}
            >
              <div className="container-wide">
                {/* Category Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${category.color} border ${category.borderColor}`}>
                        <CategoryIcon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className={category.borderColor}>
                        {category.services.length} Service{category.services.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-muted-foreground max-w-2xl">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="space-y-8">
                  {category.services.map((service: any, serviceIndex: number) => {
                    const ServiceIcon = service.icon;
                    const isEven = serviceIndex % 2 === 0;

                    return (
                      <Card
                        key={service.id}
                        id={service.id}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-0 lg:grid-cols-2">
                          {/* Content Side */}
                          <div className={`p-6 md:p-8 ${isEven ? "" : "lg:order-2"}`}>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <ServiceIcon className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight">
                              {service.title}
                            </h3>
                            <p className="mt-1 text-lg font-medium text-primary">
                              {service.tagline}
                            </p>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                              {service.description}
                            </p>

                            {/* Outcomes */}
                            <div className="mt-6">
                              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Expected Outcomes
                              </h4>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {service.outcomes.map((outcome: string, outcomeIndex: number) => (
                                  <Badge
                                    key={outcomeIndex}
                                    variant="outline"
                                    className="text-sm"
                                  >
                                    {outcome}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="mt-6">
                              <Link href="/schedule">
                                <Button className="btn-glow">
                                  Discuss Your Needs
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Key Offerings Side */}
                          <div className={`bg-muted/30 p-6 md:p-8 ${isEven ? "" : "lg:order-1"}`}>
                            <div className="flex items-center gap-2 mb-4">
                              <ClipboardCheck className="h-5 w-5 text-primary" />
                              <h4 className="font-semibold">Key Offerings</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              What we deliver in this service area
                            </p>
                            <ul className="space-y-3">
                              {service.keyOfferings.map((offering: string, offeringIndex: number) => (
                                <li
                                  key={offeringIndex}
                                  className="flex items-start gap-3"
                                >
                                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                  <span className="text-sm">
                                    {offering}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Work With Us?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              What sets SIDEC Consulting apart from other consultants
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item: any, index: number) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm opacity-80">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Delivery Approach */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Our Approach
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A Proven Process for Success
            </h2>
            <p className="mt-4 text-muted-foreground">
              We follow a structured methodology that ensures your project
              delivers measurable, sustainable results
            </p>
          </div>

          <div className="mt-16 relative">
            {/* Connection Line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  phase: "01",
                  title: "Discovery & Assessment",
                  description:
                    "We begin with a comprehensive assessment of your current state, challenges, and objectives. This includes stakeholder interviews, process reviews, and gap analysis.",
                  deliverables: [
                    "Current state analysis",
                    "Gap identification",
                    "Stakeholder alignment",
                    "Project scope definition",
                  ],
                },
                {
                  phase: "02",
                  title: "Solution Design",
                  description:
                    "Based on our findings, we develop tailored strategies and detailed action plans aligned with your business goals and regulatory requirements.",
                  deliverables: [
                    "Strategic roadmap",
                    "Resource planning",
                    "Risk assessment",
                    "Timeline & milestones",
                  ],
                },
                {
                  phase: "03",
                  title: "Implementation",
                  description:
                    "We execute the plan with hands-on support, working alongside your team to implement solutions while building internal capabilities.",
                  deliverables: [
                    "Process implementation",
                    "Team training",
                    "Documentation",
                    "Progress tracking",
                  ],
                },
                {
                  phase: "04",
                  title: "Validation & Handoff",
                  description:
                    "We verify results against defined objectives, document outcomes, and ensure your team has the knowledge to maintain success independently.",
                  deliverables: [
                    "Results verification",
                    "Knowledge transfer",
                    "Final documentation",
                    "Sustainability plan",
                  ],
                },
              ].map((step: any, index: number) => (
                <Card key={index} className="relative card-hover">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                      {step.phase}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <div className="pt-4 border-t">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Key Deliverables
                      </p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {step.deliverables.map((item: string, i: number) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              How We Work
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Flexible Engagement Models
            </h2>
            <p className="mt-4 text-muted-foreground">
              We tailor our engagement approach to match your needs, timeline,
              and budget
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {engagementModels.map((model: any, index: number) => (
              <Card key={index} className="text-center card-hover">
                <CardHeader>
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                    {index + 1}
                  </div>
                  <CardTitle>{model.title}</CardTitle>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {model.examples.map((example: string, exIndex: number) => (
                      <Badge key={exIndex} variant="outline" className="mr-1">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries & Applications */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Industry Applications
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Medical Device Manufacturing Focus
            </h2>
            <p className="mt-4 text-muted-foreground">
              We specialize in medical device manufacturing across all risk
              classifications and product categories
            </p>
          </div>

          {/* Device Classifications */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-center mb-6">
              Device Classifications
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  classification: "Class I",
                  riskLevel: "Low Risk",
                  description:
                    "General controls, exempt from 510(k) in many cases",
                  examples: [
                    "Bandages",
                    "Examination gloves",
                    "Hand-held surgical instruments",
                  ],
                  color: "bg-green-500/10 text-green-600 border-green-500/30",
                },
                {
                  classification: "Class II",
                  riskLevel: "Moderate Risk",
                  description:
                    "General controls + special controls, 510(k) required",
                  examples: [
                    "Powered wheelchairs",
                    "Pregnancy test kits",
                    "Infusion pumps",
                  ],
                  color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
                },
                {
                  classification: "Class III",
                  riskLevel: "High Risk",
                  description:
                    "General controls + premarket approval (PMA) required",
                  examples: [
                    "Heart valves",
                    "Implantable defibrillators",
                    "Drug-eluting stents",
                  ],
                  color: "bg-red-500/10 text-red-600 border-red-500/30",
                },
              ].map((item: any, index: number) => (
                <Card key={index} className="card-hover overflow-hidden">
                  <div className={`p-4 ${item.color} border-b`}>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {item.classification}
                      </span>
                      <Badge variant="outline" className={item.color}>
                        {item.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Examples
                      </p>
                      <ul className="text-sm space-y-1">
                        {item.examples.map((example: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-primary" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Categories */}
          <div className="mt-16">
            <h3 className="text-lg font-semibold text-center mb-6">
              Product Categories We Support
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: FlaskConical,
                  name: "Drug Delivery Devices",
                  description: "Combination products, inhalers, injectors, pumps, and drug-device systems",
                },
                {
                  icon: Shield,
                  name: "In-Vitro Diagnostics",
                  description: "IVD consumables, test cartridges, reagent systems, and diagnostic instruments",
                },
                {
                  icon: Settings,
                  name: "Surgical & Therapeutic",
                  description: "Single-use instruments, reusable devices, and therapeutic equipment",
                },
                {
                  icon: FileCheck,
                  name: "Implantable Devices",
                  description: "Class III implants, active implants, and long-term contact devices",
                },
                {
                  icon: Cog,
                  name: "Respiratory & Sleep",
                  description: "CPAP/BiPAP devices, masks, humidifiers, and respiratory therapy equipment",
                },
                {
                  icon: Wrench,
                  name: "Packaging Components",
                  description: "Sterile barrier systems, primary packaging, and container closure systems",
                },
                {
                  icon: Building,
                  name: "Capital Equipment",
                  description: "Medical imaging, diagnostic equipment, and durable medical equipment",
                },
                {
                  icon: Globe,
                  name: "Combination Products",
                  description: "Drug-device combinations, biologic-device combinations, and prefilled systems",
                },
              ].map((category: any, index: number) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="card-hover">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold">{category.name}</h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started?"
        description="Every engagement begins with understanding your unique challenges and goals. Let's schedule a discovery call to explore how we can help."
        primaryButtonText="Schedule Discovery Call"
        primaryButtonHref="/contact"
        secondaryButtonText="Learn About Us"
        secondaryButtonHref="/about"
      />
    </MainLayout>
  );
}
