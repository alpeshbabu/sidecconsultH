// Site Configuration
export const SITE_CONFIG = {
  name: "MedDevice Consulting",
  title: "Medical Device Injection Molding Consultant",
  description:
    "25+ years of expertise in medical device manufacturing, ISO 13485 quality systems, injection molding process development, and facility design.",
  url: "https://meddeviceconsulting.com", // Update with actual domain
  author: "Alpesh",
  email: "", // To be provided
  phone: "", // To be provided
  linkedin: "", // To be provided
} as const;

// Navigation Links
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;

// Service Areas (from Skills.md)
export const SERVICE_AREAS = [
  {
    id: "manufacturing-engineering",
    title: "Manufacturing Engineering & Operations",
    shortTitle: "Manufacturing Engineering",
    description:
      "Hiring and developing manufacturing engineering talent, organizational strategy, process optimization, and continuous improvement programs.",
    icon: "Settings",
    href: "/services#manufacturing-engineering",
  },
  {
    id: "quality-regulatory",
    title: "Quality & Regulatory Compliance",
    shortTitle: "Quality & Regulatory",
    description:
      "ISO 13485, MDSAP compliance, 510(k) submissions, EU MDR technical files, design controls, and risk management.",
    icon: "ShieldCheck",
    href: "/services#quality-regulatory",
  },
  {
    id: "injection-molding",
    title: "Injection Molding Process Excellence",
    shortTitle: "Process Excellence",
    description:
      "Scientific molding, DOE studies, process validation (IQ/OQ/PQ), automation, and process troubleshooting.",
    icon: "Cog",
    href: "/services#injection-molding",
  },
  {
    id: "equipment-maintenance",
    title: "Equipment & Mold Maintenance",
    shortTitle: "Equipment Maintenance",
    description:
      "Preventive maintenance programs, mold maintenance, equipment lifecycle management, and CMMS implementation.",
    icon: "Wrench",
    href: "/services#equipment-maintenance",
  },
  {
    id: "facility-design",
    title: "Facility Design & Infrastructure",
    shortTitle: "Facility Design",
    description:
      "Greenfield site design, cleanroom development (ISO 7/8), utility systems, and layout optimization.",
    icon: "Building",
    href: "/services#facility-design",
  },
  {
    id: "supplier-development",
    title: "Supplier Development & Global Supply Chain",
    shortTitle: "Supplier Development",
    description:
      "Global supplier strategy, qualification programs, audits, and supply chain optimization.",
    icon: "Globe",
    href: "/services#supplier-development",
  },
  {
    id: "strategic-advisory",
    title: "Strategic Advisory & Expert Services",
    shortTitle: "Strategic Advisory",
    description:
      "Technology transfer, due diligence, M&A support, expert witness services, and custom training programs.",
    icon: "Lightbulb",
    href: "/services#strategic-advisory",
  },
] as const;

// Statistics/Metrics for Homepage
export const STATS = [
  { value: "25+", label: "Years Experience" },
  { value: "100+", label: "Projects Delivered" },
  { value: "50+", label: "Companies Served" },
  { value: "ISO 13485", label: "Expert Certified" },
] as const;

// Contact Form Options
export const SERVICE_INTEREST_OPTIONS = [
  { value: "manufacturing-engineering", label: "Manufacturing Engineering & Operations" },
  { value: "quality-regulatory", label: "Quality & Regulatory Compliance" },
  { value: "injection-molding", label: "Injection Molding Process Excellence" },
  { value: "equipment-maintenance", label: "Equipment & Mold Maintenance" },
  { value: "facility-design", label: "Facility Design & Infrastructure" },
  { value: "supplier-development", label: "Supplier Development & Supply Chain" },
  { value: "strategic-advisory", label: "Strategic Advisory & Expert Services" },
  { value: "general", label: "General Inquiry" },
] as const;

export const PROJECT_TIMELINE_OPTIONS = [
  { value: "immediate", label: "Immediate (ASAP)" },
  { value: "1-3-months", label: "1-3 Months" },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "6-plus-months", label: "6+ Months" },
  { value: "exploring", label: "Just Exploring" },
] as const;

// Blog Categories
export const BLOG_CATEGORIES = [
  { id: "manufacturing-engineering", name: "Manufacturing Engineering", slug: "manufacturing-engineering" },
  { id: "quality-systems", name: "Quality Systems & Compliance", slug: "quality-systems" },
  { id: "process-development", name: "Process Development", slug: "process-development" },
  { id: "facility-design", name: "Facility Design", slug: "facility-design" },
  { id: "equipment-maintenance", name: "Equipment & Mold Maintenance", slug: "equipment-maintenance" },
  { id: "industry-trends", name: "Industry Trends", slug: "industry-trends" },
  { id: "case-studies", name: "Case Studies", slug: "case-studies" },
] as const;

// Footer Links
export const FOOTER_LINKS = {
  services: [
    { label: "Manufacturing Engineering", href: "/services#manufacturing-engineering" },
    { label: "Quality & Regulatory", href: "/services#quality-regulatory" },
    { label: "Process Excellence", href: "/services#injection-molding" },
    { label: "Facility Design", href: "/services#facility-design" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

// Inquiry Status Options (for Admin)
export const INQUIRY_STATUS = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  RESPONDED: "RESPONDED",
  ARCHIVED: "ARCHIVED",
} as const;

// Post Status Options (for Admin)
export const POST_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
