// Site Configuration
export const SITE_CONFIG = {
  name: "SIDEC Consulting",
  title: "Medical Device Injection Molding & Quality Systems Consulting",
  description:
    "25+ years of expert consulting in medical device manufacturing, injection molding process excellence, ISO 13485 quality systems, and facility design — with smart manufacturing capabilities.",
  url: "https://sidecconsulting.com", // Update with actual domain
  author: "SIDEC Consulting",
  // Contact details are env-driven so they can be set without a code change.
  // Populate these in .env (see .env.example). When empty, the footer/contact
  // simply omit them rather than showing placeholders.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
} as const;

// Navigation Links
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;

// Core Consulting Services — injection molding & medical device manufacturing
// (the lead offering; 25+ years of hands-on expertise)
export const SERVICE_AREAS = [
  {
    id: "manufacturing-engineering",
    title: "Manufacturing Engineering & Operations",
    shortTitle: "Manufacturing Engineering",
    description:
      "Process optimization, continuous improvement, lean manufacturing, capacity planning, and building high-performing manufacturing engineering teams.",
    icon: "Settings",
    href: "/services#manufacturing-engineering",
  },
  {
    id: "quality-regulatory",
    title: "Quality & Regulatory Compliance",
    shortTitle: "Quality & Regulatory",
    description:
      "ISO 13485, FDA 21 CFR 820 / QMSR, MDSAP, 510(k) submissions, EU MDR technical files, design controls, and risk management (ISO 14971).",
    icon: "ShieldCheck",
    href: "/services#quality-regulatory",
  },
  {
    id: "injection-molding",
    title: "Injection Molding Excellence (Plastics & LSR)",
    shortTitle: "Molding Excellence",
    description:
      "Scientific molding, Design of Experiments (DOE), and process validation (IQ/OQ/PQ) for thermoplastics and Liquid Silicone Rubber (LSR) medical device manufacturing.",
    icon: "Cog",
    href: "/services#injection-molding",
  },
  {
    id: "equipment-maintenance",
    title: "Equipment & Mold Maintenance",
    shortTitle: "Equipment Maintenance",
    description:
      "Preventive and predictive maintenance programs, mold maintenance standards, equipment lifecycle management, and CMMS implementation.",
    icon: "Wrench",
    href: "/services#equipment-maintenance",
  },
  {
    id: "facility-design",
    title: "Facility Design & Infrastructure",
    shortTitle: "Facility Design",
    description:
      "Greenfield site design, cleanroom development (ISO 7/8), utility systems, material flow, and layout optimization.",
    icon: "Building",
    href: "/services#facility-design",
  },
  {
    id: "supplier-development",
    title: "Supplier Development & Supply Chain",
    shortTitle: "Supplier Development",
    description:
      "Global supplier strategy, qualification programs, audits, risk management, and supply chain optimization.",
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
  {
    id: "smart-manufacturing",
    title: "Smart Manufacturing & Process Analytics",
    shortTitle: "Smart Manufacturing",
    description:
      "Integrating IIoT connectivity, predictive maintenance, and data-driven process analytics on the molding floor to optimize cycle times, scrap, and quality validation.",
    icon: "Cpu",
    href: "/services#smart-manufacturing",
  },
] as const;

// Statistics/Metrics for Homepage
export const STATS = [
  { value: "25+", label: "Years Experience" },
  { value: "100+", label: "Projects Delivered" },
  { value: "50+", label: "Companies Served" },
  { value: "ISO 13485", label: "Quality Systems Expertise" },
] as const;

// Contact Form Options
export const SERVICE_INTEREST_OPTIONS = [
  { value: "manufacturing-engineering", label: "Manufacturing Engineering & Operations" },
  { value: "quality-regulatory", label: "Quality & Regulatory Compliance" },
  { value: "injection-molding", label: "Injection Molding Excellence (Plastics & LSR)" },
  { value: "equipment-maintenance", label: "Equipment & Mold Maintenance" },
  { value: "facility-design", label: "Facility Design & Infrastructure" },
  { value: "supplier-development", label: "Supplier Development & Supply Chain" },
  { value: "strategic-advisory", label: "Strategic Advisory & Expert Services" },
  { value: "smart-manufacturing", label: "Smart Manufacturing & Process Analytics" },
  { value: "general", label: "General Inquiry" },
] as const;

// Service-Specific Form Fields Configuration
// Maps each service to the additional fields shown on the contact form
export type ServiceFieldKey =
  | "supplierAddress"
  | "estimatedBudget"
  | "otherSites"
  | "otherSiteLocations"
  | "expectedDocuments"
  | "regulatoryStandards";

export interface ServiceFieldConfig {
  key: ServiceFieldKey;
  label: string;
  placeholder: string;
  type: "input" | "textarea";
  description?: string;
}

const FIELD_DEFINITIONS: Record<ServiceFieldKey, ServiceFieldConfig> = {
  estimatedBudget: {
    key: "estimatedBudget",
    label: "Estimated Budget Range",
    placeholder: "e.g., $50K–$100K, $100K–$500K, or TBD",
    type: "input",
  },
  regulatoryStandards: {
    key: "regulatoryStandards",
    label: "Applicable Regulatory Standards",
    placeholder: "e.g., ISO 13485, FDA 21 CFR 820, EU MDR, ISO 14971...",
    type: "textarea",
    description: "List all standards or regulations relevant to your project",
  },
  expectedDocuments: {
    key: "expectedDocuments",
    label: "Expected Deliverables / Documents",
    placeholder: "e.g., Design History File, Process Validation Protocols, FMEA, Control Plans...",
    type: "textarea",
    description: "What documentation or deliverables do you anticipate needing?",
  },
  supplierAddress: {
    key: "supplierAddress",
    label: "Supplier / Facility Address",
    placeholder: "Address of the supplier or facility to be assessed",
    type: "textarea",
    description: "If applicable, provide the location of the supplier or manufacturing facility",
  },
  otherSites: {
    key: "otherSites",
    label: "Other Manufacturing Sites",
    placeholder: "List any other manufacturing or production sites involved",
    type: "textarea",
    description: "Include any additional sites that may be part of this project scope",
  },
  otherSiteLocations: {
    key: "otherSiteLocations",
    label: "Site Locations / Regions",
    placeholder: "e.g., Tijuana MX, Shenzhen CN, Cork IE, Minneapolis MN...",
    type: "textarea",
    description: "Geographic locations of facilities or sites involved",
  },
};

// Keyed by SERVICE_INTEREST_OPTIONS values. Uses only existing field definitions.
export const SERVICE_SPECIFIC_FIELDS: Record<string, ServiceFieldConfig[]> = {
  // Core manufacturing & engineering services
  "manufacturing-engineering": [
    FIELD_DEFINITIONS.estimatedBudget,
    FIELD_DEFINITIONS.otherSites,
    FIELD_DEFINITIONS.otherSiteLocations,
  ],
  "quality-regulatory": [
    FIELD_DEFINITIONS.regulatoryStandards,
    FIELD_DEFINITIONS.expectedDocuments,
    FIELD_DEFINITIONS.estimatedBudget,
  ],
  "injection-molding": [
    FIELD_DEFINITIONS.estimatedBudget,
    FIELD_DEFINITIONS.otherSites,
  ],
  "equipment-maintenance": [
    FIELD_DEFINITIONS.estimatedBudget,
    FIELD_DEFINITIONS.otherSites,
    FIELD_DEFINITIONS.otherSiteLocations,
  ],
  "facility-design": [
    FIELD_DEFINITIONS.estimatedBudget,
    FIELD_DEFINITIONS.otherSites,
    FIELD_DEFINITIONS.otherSiteLocations,
  ],
  "supplier-development": [
    FIELD_DEFINITIONS.supplierAddress,
    FIELD_DEFINITIONS.estimatedBudget,
    FIELD_DEFINITIONS.otherSites,
  ],
  "strategic-advisory": [
    FIELD_DEFINITIONS.estimatedBudget,
    FIELD_DEFINITIONS.regulatoryStandards,
  ],
  "smart-manufacturing": [
    FIELD_DEFINITIONS.regulatoryStandards,
    FIELD_DEFINITIONS.expectedDocuments,
    FIELD_DEFINITIONS.estimatedBudget,
    FIELD_DEFINITIONS.otherSites,
  ],
  general: [],
};

export const PROJECT_TIMELINE_OPTIONS = [
  { value: "immediate", label: "Immediate (ASAP)" },
  { value: "1-3-months", label: "1-3 Months" },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "6-plus-months", label: "6+ Months" },
  { value: "exploring", label: "Just Exploring" },
] as const;

// Blog Categories (PRDB §7.2)
export const BLOG_CATEGORIES = [
  { id: "process-optimization", name: "Process Optimization & Technology", slug: "process-optimization" },
  { id: "validation-compliance", name: "Validation & Compliance", slug: "validation-compliance" },
  { id: "smart-factory-data", name: "Smart Factory & Data", slug: "smart-factory-data" },
  { id: "quality-inspection", name: "Quality Systems & Inspection", slug: "quality-inspection" },
  { id: "industry-trends", name: "Industry Trends", slug: "industry-trends" },
  { id: "case-studies", name: "Case Studies", slug: "case-studies" },
] as const;

// Footer Links
export const FOOTER_LINKS = {
  services: [
    { label: "Manufacturing Engineering", href: "/services#manufacturing-engineering" },
    { label: "Quality & Regulatory", href: "/services#quality-regulatory" },
    { label: "Molding Excellence (Plastics/LSR)", href: "/services#injection-molding" },
    { label: "Facility Design & Build", href: "/services#facility-design" },
    { label: "Smart Manufacturing", href: "/services#smart-manufacturing" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Smart Manufacturing Checklist", href: "/resources/ai-readiness-checklist" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
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
