/**
 * JSON-LD Structured Data Schemas
 * Following Schema.org standards for better SEO
 */

export interface Organization {
  "@context": "https://schema.org";
  "@type": "Organization" | "ProfessionalService";
  name: string;
  url: string;
  logo?: string;
  description: string;
  address?: {
    "@type": "PostalAddress";
    addressCountry: string;
    addressRegion?: string;
  };
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
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
    logo: `${baseUrl}/logo.png`,
    description:
      "Medical device manufacturing and injection molding consulting services with 25+ years of expertise in ISO 13485, process validation, and facility design.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "contact@sidecconsult.com",
    },
    sameAs: [
      // Add social media links here when available
      // "https://www.linkedin.com/company/sidec-consulting",
    ],
  };
}

// Helper function to create person schema
export function createPersonSchema(baseUrl: string): Person {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alpesh Patel",
    jobTitle: "Medical Device Manufacturing Consultant",
    description:
      "Expert consultant with 25+ years of experience in medical device manufacturing, injection molding, ISO 13485 quality systems, and facility design.",
    url: `${baseUrl}/about`,
    worksFor: {
      "@type": "Organization",
      name: "SIDEC Consulting",
    },
    knowsAbout: [
      "Medical Device Manufacturing",
      "Injection Molding",
      "ISO 13485",
      "Process Validation",
      "Quality Management Systems",
      "Facility Design",
      "Regulatory Compliance",
      "Scientific Molding",
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
        url: `${baseUrl}/logo.png`,
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
