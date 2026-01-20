/**
 * Google Analytics 4 utilities
 * Provides type-safe event tracking and analytics functions
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// GA Measurement ID from environment
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Check if GA is enabled
export const isGAEnabled = (): boolean => {
  return !!GA_MEASUREMENT_ID && typeof window !== "undefined";
};

// Initialize GA pageview
export const pageview = (url: string): void => {
  if (!isGAEnabled()) return;

  window.gtag?.("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Event parameters types
interface EventParams {
  [key: string]: any;
}

// Generic event tracking
export const event = (action: string, params?: EventParams): void => {
  if (!isGAEnabled()) return;

  window.gtag?.("event", action, params);
};

// Specific event types for better type safety

// Form submission event
export const trackFormSubmission = (formName: string, formLocation: string): void => {
  event("form_submission", {
    event_category: "engagement",
    event_label: formName,
    form_location: formLocation,
  });
};

// Button/CTA click event
export const trackCTAClick = (ctaName: string, ctaLocation: string, ctaDestination?: string): void => {
  event("cta_click", {
    event_category: "engagement",
    event_label: ctaName,
    cta_location: ctaLocation,
    cta_destination: ctaDestination,
  });
};

// Download event
export const trackDownload = (fileName: string, fileType: string): void => {
  event("file_download", {
    event_category: "engagement",
    event_label: fileName,
    file_type: fileType,
  });
};

// Navigation event
export const trackNavigation = (destination: string, source: string): void => {
  event("navigation", {
    event_category: "navigation",
    event_label: destination,
    navigation_source: source,
  });
};

// Outbound link click
export const trackOutboundLink = (url: string, linkText: string): void => {
  event("outbound_link", {
    event_category: "outbound",
    event_label: linkText,
    link_url: url,
  });
};

// Search event
export const trackSearch = (searchTerm: string, resultsCount: number): void => {
  event("search", {
    event_category: "engagement",
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

// Video interaction
export const trackVideoPlay = (videoTitle: string, videoUrl: string): void => {
  event("video_play", {
    event_category: "engagement",
    event_label: videoTitle,
    video_url: videoUrl,
  });
};

// Scroll depth tracking
export const trackScrollDepth = (depth: number): void => {
  event("scroll", {
    event_category: "engagement",
    scroll_depth: depth,
  });
};

// Time on page (called on page leave)
export const trackTimeOnPage = (timeInSeconds: number, pagePath: string): void => {
  event("time_on_page", {
    event_category: "engagement",
    event_label: pagePath,
    time_seconds: timeInSeconds,
  });
};

// Error tracking
export const trackError = (errorMessage: string, errorLocation: string): void => {
  event("error", {
    event_category: "error",
    event_label: errorMessage,
    error_location: errorLocation,
  });
};

// Service interest tracking
export const trackServiceInterest = (serviceName: string, source: string): void => {
  event("service_interest", {
    event_category: "engagement",
    event_label: serviceName,
    interest_source: source,
  });
};

// Contact form specific tracking
export const trackContactFormStart = (): void => {
  event("contact_form_start", {
    event_category: "form",
  });
};

export const trackContactFormComplete = (serviceInterest: string): void => {
  event("contact_form_complete", {
    event_category: "form",
    event_label: serviceInterest,
  });
};

export const trackContactFormError = (errorField: string): void => {
  event("contact_form_error", {
    event_category: "form",
    event_label: errorField,
  });
};

// Blog post engagement
export const trackBlogPostView = (postTitle: string, postCategory: string): void => {
  event("blog_post_view", {
    event_category: "content",
    event_label: postTitle,
    post_category: postCategory,
  });
};

export const trackBlogPostShare = (postTitle: string, platform: string): void => {
  event("blog_post_share", {
    event_category: "social",
    event_label: postTitle,
    share_platform: platform,
  });
};

// E-commerce style events for consultations (if applicable)
export const trackConsultationRequest = (serviceType: string, value?: number): void => {
  event("consultation_request", {
    event_category: "conversion",
    event_label: serviceType,
    value: value,
  });
};

// User preferences
export const trackCookieConsent = (consentType: "accept" | "reject" | "customize"): void => {
  event("cookie_consent", {
    event_category: "privacy",
    event_label: consentType,
  });
};

// Helper to check if user has consented to analytics cookies
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const consent = localStorage.getItem("cookie_consent");
  if (!consent) return false;
  
  try {
    const { analytics } = JSON.parse(consent);
    return analytics === true;
  } catch {
    return false;
  }
};

// Initialize GA only if user has consented
export const initializeGA = (): void => {
  if (!isGAEnabled() || !hasAnalyticsConsent()) return;

  // GA is initialized via Script tag in layout
  console.log("[Analytics] Google Analytics initialized");
};
