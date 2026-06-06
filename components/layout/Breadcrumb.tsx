"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  /** Custom items to display instead of auto-generated */
  items?: BreadcrumbItem[];
  /** Whether to show home icon/link */
  showHome?: boolean;
  /** Custom label mappings for path segments */
  labelMap?: Record<string, string>;
  /** Additional CSS classes */
  className?: string;
}

// Default label mappings for common routes
const defaultLabelMap: Record<string, string> = {
  services: "Services",
  about: "About",
  contact: "Contact",
  resources: "Resources",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  admin: "Admin",
  dashboard: "Dashboard",
  posts: "Blog Posts",
  categories: "Categories",
  inquiries: "Inquiries",
  login: "Login",
  // AI service pillars
  "ai-readiness": "AI Readiness Assessment",
  "ai-process": "AI Process Development",
  "ai-validation": "AI Validation & Governance",
  "ai-quality": "AI Quality & Inspection",
  "smart-factory": "Smart Factory & Data",
  // Blog categories
  "ai-process-optimization": "AI & Process Optimization",
  "ai-validation-compliance": "AI Validation & Compliance",
  "smart-factory-data": "Smart Factory & Data",
  "quality-inspection": "Quality Systems & Inspection",
  "industry-trends": "Industry Trends",
  "case-studies": "Case Studies",
};

/**
 * Breadcrumb navigation component for detail pages
 * Auto-generates breadcrumbs from the current path or accepts custom items
 */
export function Breadcrumb({
  items,
  showHome = true,
  labelMap = {},
  className,
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Merge default and custom label mappings
  const labels = { ...defaultLabelMap, ...labelMap };

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems: BreadcrumbItem[] = items ?? generateBreadcrumbs(pathname, labels);

  // Don't show breadcrumbs on homepage
  if (pathname === "/" && !items) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("py-4", className)}>
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {/* Home link */}
        {showHome && (
          <>
            <li>
              <Link
                href="/"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            {breadcrumbItems.length > 0 && (
              <li>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </li>
            )}
          </>
        )}

        {/* Breadcrumb items */}
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.href} className="flex items-center">
              {isLast ? (
                <span
                  className="font-medium text-foreground truncate max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px]"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 mx-1" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Generate breadcrumb items from a pathname
 */
function generateBreadcrumbs(
  pathname: string,
  labels: Record<string, string>
): BreadcrumbItem[] {
  // Remove leading/trailing slashes and split
  const segments = pathname.replace(/^\/|\/$/g, "").split("/");

  // Filter out empty segments and route groups like (public)
  const filteredSegments = segments.filter(
    (segment) => segment && !segment.startsWith("(") && !segment.endsWith(")")
  );

  // Build breadcrumb items
  const items: BreadcrumbItem[] = [];
  let currentPath = "";

  for (const segment of filteredSegments) {
    currentPath += `/${segment}`;

    // Get label from mapping or format the segment
    const label = labels[segment] ?? formatSegment(segment);

    items.push({
      label,
      href: currentPath,
    });
  }

  return items;
}

/**
 * Format a URL segment into a readable label
 */
function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default Breadcrumb;
