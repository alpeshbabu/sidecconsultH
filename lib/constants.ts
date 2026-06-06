// Site Configuration
export const SITE_CONFIG = {
  name: "SIDEC Consulting",
  title: "AI for Injection Molding — Validated, Explainable, Audit-Ready",
  description:
    "25+ years in medical device manufacturing, now bringing AI and machine learning to injection molding — process optimization, quality, predictive maintenance, and the validation and governance to deploy it in regulated plants.",
  url: "https://sidecconsulting.com", // Update with actual domain
  author: "SIDEC Consulting",
  email: "", // To be provided
  phone: "", // To be provided
  linkedin: "", // To be provided
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

// Service Areas — the 4 AI pillars (PRDB §2 / §3.1.1)
export const SERVICE_AREAS = [
  {
    id: "ai-process",
    title: "AI-Augmented Process Development",
    shortTitle: "AI Process Development",
    description:
      "We turn scientific molding and DOE into ML-driven optimization that cuts cycle time, scrap, and energy while holding quality.",
    icon: "Cpu",
    href: "/services#ai-process",
  },
  {
    id: "ai-validation",
    title: "AI Validation & Governance",
    shortTitle: "AI Validation & Governance",
    description:
      "We deploy AI in regulated plants the right way: validated under ISO 13485/QMSR, explainable, and ready for audit.",
    icon: "ShieldCheck",
    href: "/services#ai-validation",
  },
  {
    id: "ai-quality",
    title: "AI-Driven Quality & Inspection",
    shortTitle: "AI Quality & Inspection",
    description:
      "We catch defects before they happen with predictive models and automated vision, integrated into your existing QMS.",
    icon: "ScanSearch",
    href: "/services#ai-quality",
  },
  {
    id: "smart-factory",
    title: "Smart Factory & Data",
    shortTitle: "Smart Factory & Data",
    description:
      "Predictive maintenance, IIoT, and the data foundation that has to exist before any AI can deliver.",
    icon: "Network",
    href: "/services#smart-factory",
  },
] as const;

// Statistics/Metrics for Homepage (PRDB §3.1.1)
export const STATS = [
  { value: "25+", label: "Years in Injection Molding" },
  { value: "ISO 13485 / QMSR", label: "Regulated-Manufacturing Depth" },
  { value: "100+", label: "Process, Quality & Automation Projects" },
  { value: "DOE + ML", label: "AI Grounded in Scientific Molding" },
] as const;

// Contact Form Options (PRDB §3.1.5)
export const SERVICE_INTEREST_OPTIONS = [
  { value: "ai-readiness", label: "AI Readiness Assessment" },
  { value: "ai-process", label: "AI Process Development & Optimization" },
  { value: "ai-validation", label: "AI Validation & Governance" },
  { value: "ai-quality", label: "AI Quality & Inspection" },
  { value: "smart-factory", label: "Smart Factory / Predictive Maintenance" },
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

// NOTE: keyed by SERVICE_INTEREST_OPTIONS values. Uses only existing field
// definitions for now; richer AI fields (data/sensor maturity, primary pain
// point) are deferred to TASKSB T3.2 (needs schema columns).
export const SERVICE_SPECIFIC_FIELDS: Record<string, ServiceFieldConfig[]> = {
  "ai-readiness": [
    FIELD_DEFINITIONS.otherSites,
    FIELD_DEFINITIONS.otherSiteLocations,
    FIELD_DEFINITIONS.estimatedBudget,
  ],
  "ai-process": [
    FIELD_DEFINITIONS.otherSites,
    FIELD_DEFINITIONS.estimatedBudget,
  ],
  "ai-validation": [
    FIELD_DEFINITIONS.regulatoryStandards,
    FIELD_DEFINITIONS.expectedDocuments,
    FIELD_DEFINITIONS.estimatedBudget,
  ],
  "ai-quality": [
    FIELD_DEFINITIONS.expectedDocuments,
    FIELD_DEFINITIONS.estimatedBudget,
  ],
  "smart-factory": [
    FIELD_DEFINITIONS.otherSites,
    FIELD_DEFINITIONS.otherSiteLocations,
    FIELD_DEFINITIONS.estimatedBudget,
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
  { id: "ai-process-optimization", name: "AI & Process Optimization", slug: "ai-process-optimization" },
  { id: "ai-validation-compliance", name: "AI Validation & Compliance", slug: "ai-validation-compliance" },
  { id: "smart-factory-data", name: "Smart Factory & Data", slug: "smart-factory-data" },
  { id: "quality-inspection", name: "Quality Systems & Inspection", slug: "quality-inspection" },
  { id: "industry-trends", name: "Industry Trends", slug: "industry-trends" },
  { id: "case-studies", name: "Case Studies", slug: "case-studies" },
] as const;

// Footer Links
export const FOOTER_LINKS = {
  services: [
    { label: "AI Readiness Assessment", href: "/services#ai-readiness" },
    { label: "AI Process Development", href: "/services#ai-process" },
    { label: "AI Validation & Governance", href: "/services#ai-validation" },
    { label: "Smart Factory & Data", href: "/services#smart-factory" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "AI Readiness Checklist", href: "/resources/ai-readiness-checklist" },
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
