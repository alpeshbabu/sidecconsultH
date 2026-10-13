/**
 * JSON-LD Structured Data Schemas
 * Following Schema.org standards for better SEO
 */
import { SITE_CONFIG } from "@/lib/constants";

// The site logo asset (note: filename contains a space → URL-encoded).
const LOGO_PATH = "/SIDEC%20Consulting.png";

export interface Organization {
  "@context": "https://schema.org";
  "@type": "Organization" | "ProfessionalService";
  name: string;
  url: string;
  logo?: string;
  description: string;
  slogan?: string;
  address?: {
    "@type": "PostalAddress";
    addressCountry: string;
    addressRegion?: string;
  };
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    email?: string;
    telephone?: string;
  };
  areaServed?: string[];
  knowsAbout?: string[];
  sameAs?: string[];
}

export interface WebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  publisher: {
    "@type": "Organization";
    name: string;
  };
}

export interface Person {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  worksFor?: {
    "@type": "Organization";
    name: string;
  };
  alumniOf?: Array<{
    "@type": "EducationalOrganization";
    name: string;
  }>;
  knowsAbout?: string[];
}

export interface Service {
  "@context": "https://schema.org";
  "@type": "Service";
  name: string;
  description: string;
  provider: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  areaServed?: string;
  serviceType?: string;
}

export interface BlogPosting {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  image?: string;
  author: {
    "@type": "Person" | "Organization";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
}

export interface BreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

// Helper function to create organization schema
export function createOrganizationSchema(baseUrl: string): Organization {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "SIDEC Consulting",
    url: baseUrl,
    logo: `${baseUrl}${LOGO_PATH}`,
    description:
      "Injection molding and quality consulting for regulated manufacturing — scientific molding, process optimization and validation, quality and regulatory compliance (ISO 13485 / FDA QMSR), predictive maintenance, and smart manufacturing, backed by 25+ years of manufacturing expertise.",
    slogan: "Optimize injection molding — without breaking validation.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressRegion: "CA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      ...(SITE_CONFIG.email && { email: SITE_CONFIG.email }),
      ...(SITE_CONFIG.phone && { telephone: SITE_CONFIG.phone }),
    },
    areaServed: ["United States", "Global"],
    knowsAbout: [
      "Injection Molding",
      "Process Optimization",
      "Process Validation",
      "ISO 13485",
      "FDA QMSR",
      "Computer Software Assurance",
      "Scientific Molding",
      "Design of Experiments",
      "Predictive Maintenance",
      "Smart Factory and IIoT",
      "Automated Vision Inspection",
    ],
    sameAs: SITE_CONFIG.linkedin ? [SITE_CONFIG.linkedin] : [],
  };
}

// Helper function to create the WebSite schema (entity + search hint)
export function createWebSiteSchema(baseUrl: string): WebSite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SIDEC Consulting",
    url: baseUrl,
    description:
      "Injection molding and quality consulting — validated, audit-ready, and built on 25+ years of manufacturing experience.",
    publisher: {
      "@type": "Organization",
      name: "SIDEC Consulting",
    },
  };
}

// Helper function to create person schema
export function createPersonSchema(baseUrl: string): Person {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alpesh Patel",
    jobTitle: "Injection Molding & Quality Consultant",
    description:
      "Consultant with 25+ years in medical device injection molding — scientific molding, DOE, and process validation under ISO 13485 — helping manufacturers optimize the molding floor, validated and audit-ready.",
    url: `${baseUrl}/about`,
    worksFor: {
      "@type": "Organization",
      name: "SIDEC Consulting",
    },
    knowsAbout: [
      "Injection Molding",
      "Quality Systems",
      "Scientific Molding",
      "Design of Experiments",
      "Process Validation",
      "ISO 13485",
      "FDA QMSR",
      "Predictive Maintenance",
      "Smart Factory and IIoT",
    ],
  };
}

// Helper function to create service schema
export function createServiceSchema(
  baseUrl: string,
  serviceName: string,
  serviceDescription: string
): Service {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: serviceDescription,
    provider: {
      "@type": "Organization",
      name: "SIDEC Consulting",
      url: baseUrl,
    },
    areaServed: "United States",
    serviceType: "Professional Consulting",
  };
}

// Helper function to create blog posting schema
export function createBlogPostingSchema(
  baseUrl: string,
  post: {
    title: string;
    excerpt: string;
    slug: string;
    featuredImage?: string | null;
    publishedAt: Date | string | null;
    updatedAt: Date | string;
    authorName?: string;
  }
): BlogPosting {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.updatedAt).toISOString();
  const modifiedDate = new Date(post.updatedAt).toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    ...(post.featuredImage && { image: post.featuredImage }),
    author: {
      "@type": post.authorName ? "Person" : "Organization",
      name: post.authorName || "SIDEC Consulting",
    },
    publisher: {
      "@type": "Organization",
      name: "SIDEC Consulting",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${LOGO_PATH}`,
      },
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/resources/${post.slug}`,
    },
  };
}

// Helper function to create breadcrumb schema
export function createBreadcrumbSchema(
  baseUrl: string,
  items: Array<{ name: string; url: string }>
): BreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

// Helper function to inject JSON-LD into page
export function getJsonLd(schema: object | object[]): string {
  return JSON.stringify(Array.isArray(schema) ? schema : [schema]);
}
