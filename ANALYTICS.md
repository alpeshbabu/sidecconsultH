# Analytics & Tracking Guide

This document explains how to use the analytics and event tracking system in the SIDEC Consulting website.

## Table of Contents

1. [Google Analytics 4 Setup](#google-analytics-4-setup)
2. [Event Tracking](#event-tracking)
3. [Cookie Consent](#cookie-consent)
4. [Tracked Components](#tracked-components)
5. [Custom Events](#custom-events)
6. [Best Practices](#best-practices)

## Google Analytics 4 Setup

### 1. Create a GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Add to Environment Variables

Create or update `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 3. How It Works

- **GoogleAnalytics Component**: Automatically included in root layout
- **Consent Mode**: Respects user cookie preferences (GDPR compliant)
- **Page Views**: Automatically tracked on route changes
- **Web Vitals**: Integrated with performance monitoring

## Event Tracking

### Automatic Events

The following events are tracked automatically:

#### Page Views
```typescript
// Tracked automatically on route change
pageview("/about")
```

#### Form Submissions
```typescript
// Contact form
trackContactFormStart()        // When user focuses on form
trackContactFormComplete()     // On successful submission
trackContactFormError()        // On submission error
```

### Manual Event Tracking

Import from `@/lib/analytics`:

```typescript
import {
  trackCTAClick,
  trackDownload,
  trackServiceInterest,
  trackBlogPostView,
} from "@/lib/analytics";
```

#### CTA Button Clicks

```typescript
trackCTAClick(
  "Schedule Consultation",  // Button name
  "homepage_hero",           // Location on page
  "/contact"                 // Destination URL (optional)
);
```

#### File Downloads

```typescript
trackDownload(
  "Company_Brochure.pdf",    // File name
  "pdf"                      // File type
);
```

#### Service Interest

```typescript
trackServiceInterest(
  "Manufacturing Engineering",  // Service name
  "services_page"              // Source
);
```

#### Blog Engagement

```typescript
// View
trackBlogPostView(
  "ISO 13485 Guide",         // Post title
  "Quality & Compliance"     // Category
);

// Share
trackBlogPostShare(
  "ISO 13485 Guide",         // Post title
  "linkedin"                 // Platform: linkedin, twitter, email
);
```

#### Navigation

```typescript
trackNavigation(
  "/services",               // Destination
  "header_menu"             // Source
);
```

#### Outbound Links

```typescript
trackOutboundLink(
  "https://example.com",     // URL
  "Learn More"              // Link text
);
```

## Cookie Consent

### How It Works

1. **Banner Display**: Shown on first visit
2. **User Choice**: Accept All, Reject All, or Customize
3. **Consent Storage**: Saved in localStorage
4. **GA Integration**: Automatically updates consent mode

### Cookie Categories

- **Necessary**: Always active (required for site function)
- **Analytics**: Google Analytics tracking
- **Marketing**: Third-party advertising (if applicable)

### Checking Consent

```typescript
import { hasAnalyticsConsent } from "@/lib/analytics";

if (hasAnalyticsConsent()) {
  // Track event
  trackCTAClick("button_name", "location");
}
```

### Updating Consent

Users can change preferences:
- Footer link to `/cookies`
- Cookie policy page has "Manage Preferences" button (future enhancement)

## Tracked Components

### TrackedButton Component

Use `TrackedButton` for automatic click tracking:

```typescript
import { TrackedButton } from "@/components/shared";

<TrackedButton
  href="/contact"
  trackingName="Get Started"
  trackingLocation="homepage_hero"
  variant="default"
>
  Get Started
</TrackedButton>
```

**Benefits:**
- Automatic click tracking
- Navigation tracking
- Consistent tracking patterns
- Type-safe props

### Contact Form

The contact form automatically tracks:
- Form start (first field focus)
- Form completion with service interest
- Form errors

No additional code needed!

## Custom Events

### Creating Custom Events

Add to `lib/analytics.ts`:

```typescript
export const trackCustomEvent = (
  eventName: string,
  params?: EventParams
): void => {
  event(eventName, {
    event_category: "custom",
    ...params,
  });
};
```

### Usage

```typescript
import { trackCustomEvent } from "@/lib/analytics";

trackCustomEvent("video_watched", {
  video_title: "Product Demo",
  watch_duration: 120,
});
```

## Best Practices

### Naming Conventions

**Event Names**: Use snake_case
```typescript
"form_submission"
"cta_click"
"blog_post_view"
```

**Parameters**: Use descriptive snake_case
```typescript
{
  event_category: "engagement",
  event_label: "Homepage CTA",
  button_location: "hero_section"
}
```

### What to Track

✅ **Do Track:**
- Form submissions
- CTA clicks
- File downloads
- Outbound links
- Navigation patterns
- Content engagement
- Errors and issues
- Service interests
- Conversion funnel steps

❌ **Don't Track:**
- Personal information (PII)
- Sensitive data
- Authentication details
- API keys or tokens
- Full form contents

### Performance

- Events are sent asynchronously
- Uses `sendBeacon` for reliability
- Minimal impact on page performance
- Respects consent preferences

### Testing

#### Development

Events logged to console:
```bash
[Analytics] cta_click: {
  event_category: "engagement",
  event_label: "Get Started",
  cta_location: "homepage_hero"
}
```

#### Production

1. **Real-time Reports**: Google Analytics > Real-time
2. **DebugView**: Enable in GA4 for detailed event inspection
3. **Browser DevTools**: Network tab to see `gtag` requests

### Debugging

Enable debug mode:

```typescript
window.gtag('config', GA_MEASUREMENT_ID, {
  debug_mode: true
});
```

View debug info in browser console.

## Event Reference

### Common Events

| Event | When Triggered | Parameters |
|-------|----------------|------------|
| `page_view` | Route change | `page_path` |
| `cta_click` | Button click | `event_label`, `cta_location`, `cta_destination` |
| `form_submission` | Form submit | `event_label`, `form_location` |
| `file_download` | File download | `event_label`, `file_type` |
| `outbound_link` | External link click | `event_label`, `link_url` |
| `service_interest` | Service inquiry | `event_label`, `interest_source` |
| `blog_post_view` | Blog post view | `event_label`, `post_category` |
| `blog_post_share` | Social share | `event_label`, `share_platform` |
| `cookie_consent` | Consent action | `event_label` (accept/reject/customize) |

### Web Vitals Events

Automatically tracked:
- `LCP` - Largest Contentful Paint
- `FID` - First Input Delay
- `CLS` - Cumulative Layout Shift
- `FCP` - First Contentful Paint
- `TTFB` - Time to First Byte
- `INP` - Interaction to Next Paint

## Privacy & Compliance

### GDPR Compliance

- ✅ Cookie consent banner before tracking
- ✅ Consent mode integration
- ✅ Clear cookie policy
- ✅ User can reject/customize
- ✅ IP anonymization enabled
- ✅ No PII tracking

### Data Retention

Configure in Google Analytics:
- Recommended: 14 months
- Maximum: 50 months
- Set based on your needs and regulations

### User Rights

Users can:
- Reject analytics cookies
- Request data deletion
- Opt out via browser settings
- Clear cookies anytime

## Support

For questions or issues:
1. Check Google Analytics documentation
2. Review this guide
3. Check browser console for errors
4. Test with GA DebugView

## Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Events Reference](https://support.google.com/analytics/answer/9267735)
- [Consent Mode](https://support.google.com/analytics/answer/9976101)
- [DebugView](https://support.google.com/analytics/answer/7201382)
