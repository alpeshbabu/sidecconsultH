# Performance Optimization Guide

This document outlines the performance optimizations implemented in the SIDEC Consulting website.

## Table of Contents

1. [Image Optimization](#image-optimization)
2. [Lazy Loading](#lazy-loading)
3. [Code Splitting](#code-splitting)
4. [Bundle Analysis](#bundle-analysis)
5. [Web Vitals Monitoring](#web-vitals-monitoring)
6. [Best Practices](#best-practices)

## Image Optimization

### Next.js Image Component

All images use the Next.js `Image` component for automatic optimization:

```tsx
import Image from "next/image";

<Image
  src="/hero.png"
  alt="Description"
  width={1200}
  height={630}
  priority // For above-fold images
/>
```

### Configuration

Images are configured in `next.config.ts`:

- **Formats**: AVIF and WebP for modern browsers
- **Device Sizes**: Optimized for responsive breakpoints
- **Remote Patterns**: Configured for external image sources
- **Caching**: Aggressive caching with immutable headers (1 year)

### Best Practices

- Use `priority` prop for above-the-fold images
- Use `loading="lazy"` for below-the-fold images (default behavior)
- Specify explicit width and height to prevent layout shift
- Use appropriate image sizes to avoid over-fetching

## Lazy Loading

### Component Lazy Loading

Use the `LazyLoad` component for below-the-fold content:

```tsx
import { LazyLoad } from "@/components/shared";

<LazyLoad rootMargin="100px" threshold={0.01}>
  <HeavyComponent />
</LazyLoad>
```

### Dynamic Imports

For code splitting of heavy components:

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable SSR if not needed
});
```

### Benefits

- Reduces initial bundle size
- Improves Time to Interactive (TTI)
- Better Lighthouse scores
- Faster page loads

## Code Splitting

### Automatic Code Splitting

Next.js automatically code splits:

- Each page into separate bundles
- Shared components into common chunks
- Third-party libraries into vendor bundles

### Manual Optimization

Configure in `next.config.ts`:

```typescript
experimental: {
  optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
}
```

### Tree Shaking

Webpack is configured for aggressive tree shaking:

```typescript
optimization: {
  usedExports: true,
  sideEffects: true,
}
```

## Bundle Analysis

### Running Bundle Analyzer

Analyze your bundle size:

```bash
npm run build:analyze
```

This will:

1. Build the production bundle
2. Generate analysis reports in `.next/analyze/`
3. Open interactive visualizations in your browser

### What to Look For

- **Large Dependencies**: Consider alternatives or lazy loading
- **Duplicate Code**: May indicate misconfigured imports
- **Unused Code**: Verify tree shaking is working
- **Vendor Bundles**: Ensure code splitting is effective

### Optimization Targets

- **First Load JS**: < 100 KB (ideal)
- **Page Bundles**: < 50 KB per page
- **Shared Bundles**: < 150 KB total

## Web Vitals Monitoring

### Metrics Tracked

The app monitors all Core Web Vitals:

- **LCP** (Largest Contentful Paint): < 2.5s (good)
- **FID** (First Input Delay): < 100ms (good)
- **CLS** (Cumulative Layout Shift): < 0.1 (good)
- **TTFB** (Time to First Byte): < 600ms (good)
- **FCP** (First Contentful Paint): < 1.8s (good)
- **INP** (Interaction to Next Paint): < 200ms (good)

### Viewing Metrics

1. **Development**: Check browser console
2. **Production**: Metrics sent to `/api/analytics/vitals`
3. **Google Analytics**: Automatic integration if GA4 is configured

### API Endpoint

Web Vitals are collected at:

```
POST /api/analytics/vitals
```

You can extend this to:

- Store metrics in database
- Send alerts for poor performance
- Generate analytics dashboards
- Forward to external services (Vercel Analytics, etc.)

## Best Practices

### Images

- ✅ Use Next.js `Image` component
- ✅ Specify width and height
- ✅ Use `priority` for above-fold images
- ✅ Optimize image sizes before upload
- ❌ Don't use raw `<img>` tags
- ❌ Don't load large images for small displays

### Components

- ✅ Lazy load below-the-fold content
- ✅ Use dynamic imports for heavy components
- ✅ Implement loading states
- ✅ Avoid unnecessary re-renders
- ❌ Don't import entire libraries
- ❌ Don't bundle heavy dependencies in initial load

### JavaScript

- ✅ Enable production mode optimizations
- ✅ Remove console logs in production
- ✅ Use code splitting strategically
- ✅ Minimize third-party scripts
- ❌ Don't inline large scripts
- ❌ Don't use blocking scripts

### CSS

- ✅ Use Tailwind JIT mode
- ✅ Purge unused CSS
- ✅ Use CSS-in-JS sparingly
- ✅ Optimize font loading
- ❌ Don't import unused stylesheets
- ❌ Don't use large icon fonts

### Fonts

- ✅ Use `next/font` for optimization
- ✅ Preload critical fonts
- ✅ Use font-display: swap
- ✅ Subset fonts when possible
- ❌ Don't load unnecessary font weights
- ❌ Don't use font CDNs (use local fonts)

### Caching

- ✅ Set appropriate cache headers
- ✅ Use immutable for static assets
- ✅ Implement stale-while-revalidate
- ✅ Version static assets
- ❌ Don't cache dynamic content
- ❌ Don't use short cache durations for static assets

## Performance Checklist

Before deploying:

- [ ] Run Lighthouse audit (score > 90)
- [ ] Check bundle size with analyzer
- [ ] Test on slow 3G network
- [ ] Verify Core Web Vitals
- [ ] Test with JavaScript disabled (progressive enhancement)
- [ ] Check mobile performance
- [ ] Verify image optimization
- [ ] Test lazy loading behavior
- [ ] Check for layout shift (CLS)
- [ ] Verify font loading strategy

## Tools

- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: https://www.webpagetest.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Bundle Analyzer**: `npm run build:analyze`
- **Chrome DevTools**: Performance tab
- **React DevTools**: Profiler tab

## Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)

## Continuous Monitoring

Set up monitoring in production:

1. Configure Web Vitals endpoint to store metrics
2. Create dashboard for performance trends
3. Set up alerts for performance regressions
4. Monitor bundle size in CI/CD
5. Run Lighthouse in CI/CD pipeline

## Support

For performance issues or questions, check:

- Next.js documentation
- This repository's issues
- Web Vitals documentation
