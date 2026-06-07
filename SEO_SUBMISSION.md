# SEO & Search Engine Submission Runbook

This document covers (1) the technical SEO that is **implemented in code** and (2) the **manual steps you must perform** to verify ownership and submit the site to Google Search Console and Bing Webmaster Tools.

> **Why you (not the build) do the submission:** verifying a property and submitting a sitemap require logging into *your* Google and Microsoft accounts and proving you control the domain. That can't be automated from the codebase. Everything the search engines need on the site side is already built — you just paste two tokens and click "Verify" + "Submit."

---

## 1. What's implemented in code

| Item | Where | Notes |
|------|-------|-------|
| Dynamic XML sitemap | [app/sitemap.ts](app/sitemap.ts) → `/sitemap.xml` | All static pages + every published blog post + categories + case studies + checklist |
| robots.txt | [app/robots.ts](app/robots.ts) → `/robots.txt` | Allows crawl; disallows `/admin/`, `/api/`, `/portal/`; points to sitemap |
| Clean per-page meta tags | each `page.tsx` `metadata` export | Unique title/description + canonical on every public page |
| Open Graph + Twitter cards | [app/layout.tsx](app/layout.tsx) + per page | Share image generated in code → [app/opengraph-image.tsx](app/opengraph-image.tsx) |
| JSON-LD: Organization + WebSite | [app/layout.tsx](app/layout.tsx) (site-wide) | [lib/structured-data.ts](lib/structured-data.ts) |
| JSON-LD: Person + BreadcrumbList | `/about` | |
| JSON-LD: BreadcrumbList | `/services`, `/case-studies` | |
| JSON-LD: BlogPosting + BreadcrumbList | every blog post | |
| Favicon | [app/icon.tsx](app/icon.tsx) → `/icon` | Generated monogram |
| Web app manifest | [app/manifest.ts](app/manifest.ts) → `/manifest.webmanifest` | name, theme-color, icon |
| Viewport + theme-color | [app/layout.tsx](app/layout.tsx) `viewport` export | Mobile + light/dark theme color |
| Core Web Vitals reporting | `WebVitalsReporter` in layout | next/font (swap), next/image, priority hero |
| **Verification meta tags** | [app/layout.tsx](app/layout.tsx) `verification` | **Env-driven — see step 2** |

---

## 2. Prerequisites before submitting

1. **Deploy to the real production domain** (Vercel). Search engines verify and crawl the live HTTPS site, not localhost.

2. **Set the production URL env var** so sitemap, canonical, and OG URLs use the real domain. In Vercel → Project → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_APP_URL=https://YOUR-REAL-DOMAIN.com
   ```
   > ⚠️ Today the code defaults to `https://sidecconsult.com` and `SITE_CONFIG.url` says `sidecconsulting.com`. Set `NEXT_PUBLIC_APP_URL` to whichever domain is actually live so `/sitemap.xml` and canonicals are correct, then redeploy.

3. **(Optional but recommended) contact details** for richer structured data / footer:
   ```
   NEXT_PUBLIC_CONTACT_EMAIL=alpesh.patel@sidecllc.com
   NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/...
   ```

---

## 3. Google Search Console

1. Go to **https://search.google.com/search-console** and sign in.
2. **Add property.** Easiest path that this site supports: choose the **"URL prefix"** property and enter your full production URL (`https://YOUR-DOMAIN.com`).
   - *(Alternative, stronger: the "Domain" property via DNS TXT — do this if you control DNS; it covers all subdomains. If you pick this, skip the meta-tag step and add the TXT record Google gives you at your domain registrar.)*
3. For URL-prefix verification, choose the **"HTML tag"** method. Google shows a tag like:
   ```html
   <meta name="google-site-verification" content="ABC123..." />
   ```
   Copy **only the `content` value** (`ABC123...`).
4. In Vercel → Environment Variables, set:
   ```
   GOOGLE_SITE_VERIFICATION=ABC123...
   ```
   **Redeploy** so the tag renders in `<head>`. (Confirm with: view-source on the homepage → search for `google-site-verification`.)
5. Back in Search Console, click **Verify**.
6. Once verified: **Sitemaps** (left nav) → enter `sitemap.xml` → **Submit**.
7. Use **URL Inspection** on the homepage → **Request indexing** to nudge the first crawl.

---

## 4. Bing Webmaster Tools

Two options — the import path is fastest:

**Option A — Import from Google Search Console (recommended):**
1. Go to **https://www.bing.com/webmasters** and sign in.
2. Choose **Import from Google Search Console** and authorize. Bing pulls the verified property and the sitemap automatically. Done.

**Option B — Manual verification (HTML meta tag):**
1. In Bing Webmaster Tools, **Add a site**: enter `https://YOUR-DOMAIN.com`.
2. Choose the **HTML Meta Tag** option. Bing shows:
   ```html
   <meta name="msvalidate.01" content="XYZ789..." />
   ```
   Copy the `content` value.
3. In Vercel, set:
   ```
   BING_SITE_VERIFICATION=XYZ789...
   ```
   **Redeploy.**
4. Click **Verify** in Bing.
5. **Sitemaps** → submit `https://YOUR-DOMAIN.com/sitemap.xml`.

---

## 5. Validate the structured data & meta

After deploy, confirm everything is healthy:

- **Rich Results Test** — https://search.google.com/test/rich-results → enter your homepage and a blog post URL. Expect: *Organization*, *WebSite*, *BreadcrumbList*, *BlogPosting*.
- **Schema Markup Validator** — https://validator.schema.org → paste a URL.
- **Social preview** — paste a URL into the LinkedIn Post Inspector / Slack to confirm the generated OG image + title render.
- **Mobile-Friendly / PageSpeed** — https://pagespeed.web.dev → check Core Web Vitals on mobile + desktop.

---

## 6. Quick local sanity checks (optional)

```bash
npm run build && npm run start
# then in another shell:
curl -s localhost:3000/sitemap.xml | head
curl -s localhost:3000/robots.txt
curl -s localhost:3000/manifest.webmanifest
curl -s localhost:3000/ | grep -o 'application/ld+json'   # should appear (Org + WebSite)
```

---

## 7. Status checklist

- [ ] `NEXT_PUBLIC_APP_URL` set to the live domain in Vercel
- [ ] `GOOGLE_SITE_VERIFICATION` set → redeploy → verified in GSC
- [ ] Sitemap submitted in GSC
- [ ] Bing verified (imported from GSC, or `BING_SITE_VERIFICATION` set)
- [ ] Sitemap submitted in Bing
- [ ] Rich Results Test passes for homepage + a blog post
- [ ] PageSpeed/Core Web Vitals checked on mobile
