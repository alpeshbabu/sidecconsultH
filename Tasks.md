# MedDevice Consulting Platform - Development Tasks
**Generated from PRD.md and Skills.md**
**Last Updated:** January 11, 2026

---

## 📋 Task Overview

| Phase | Description | Estimated Hours | Status |
|-------|-------------|-----------------|--------|
| Phase 1 | Project Setup & Foundation | 8-12 hours | ✅ Complete |
| Phase 2 | Database & Authentication | 15-20 hours | ⬜ Not Started |
| Phase 3 | Public Pages - Core | 25-35 hours | ⬜ Not Started |
| Phase 4 | Public Pages - Content | 15-20 hours | ⬜ Not Started |
| Phase 5 | Admin Dashboard | 30-40 hours | ⬜ Not Started |
| Phase 6 | SEO & Analytics | 8-12 hours | ⬜ Not Started |
| Phase 7 | Testing & QA | 15-20 hours | ⬜ Not Started |
| Phase 8 | Deployment & Launch | 8-10 hours | ⬜ Not Started |

**Total Estimated Hours:** 124-169 hours

---

## Phase 1: Project Setup & Foundation

### 1.1 Development Environment Setup
- [x] **TASK-001:** Initialize Next.js 14+ project with App Router
- [x] **TASK-002:** Configure TypeScript with strict mode
- [x] **TASK-003:** Install and configure Tailwind CSS
- [x] **TASK-004:** Install and configure Shadcn UI components
- [x] **TASK-005:** Install Lucide React icons
- [x] **TASK-006:** Configure ESLint and Prettier
- [x] **TASK-007:** Set up Git repository and initial commit

### 1.2 Project Structure
- [x] **TASK-008:** Create folder structure for App Router
  ```
  app/
  ├── (public)/           # Public pages group
  │   ├── page.tsx        # Homepage
  │   ├── services/
  │   ├── about/
  │   ├── resources/
  │   ├── contact/
  │   ├── privacy/
  │   └── terms/
  ├── admin/              # Admin pages
  │   ├── login/
  │   ├── dashboard/
  │   ├── inquiries/
  │   ├── posts/
  │   └── categories/
  ├── api/                # API routes
  └── layout.tsx
  ```
- [x] **TASK-009:** Create shared UI components directory structure
- [x] **TASK-010:** Set up lib utilities (utils, constants, types)

### 1.3 Design System Foundation
- [x] **TASK-011:** Configure color palette in Tailwind (per UX-002)
  - Primary Blue: #0066CC
  - Secondary Blue: #004999
  - Accent Blue: #3399FF
  - Neutrals and status colors
- [x] **TASK-012:** Configure typography (Inter/Poppins) with responsive sizes
- [x] **TASK-013:** Create CSS variables for theme consistency
- [x] **TASK-014:** Set up global styles in `globals.css`

---

## Phase 2: Database & Authentication

### 2.1 Database Setup
- [ ] **TASK-015:** Install Prisma ORM
- [ ] **TASK-016:** Configure PostgreSQL connection (environment variables)
- [ ] **TASK-017:** Create Prisma schema with models:
  - [ ] User model (with Role enum)
  - [ ] ContactInquiry model (with InquiryStatus enum)
  - [ ] BlogPost model (with PostStatus enum)
  - [ ] Category model
- [ ] **TASK-018:** Run initial database migration
- [ ] **TASK-019:** Create seed script for initial data (categories, admin user)
- [ ] **TASK-020:** Create Prisma client singleton for production

### 2.2 Authentication System
- [ ] **TASK-021:** Install NextAuth v5 (Auth.js)
- [ ] **TASK-022:** Configure credentials provider for email/password
- [ ] **TASK-023:** Implement bcrypt password hashing (10 rounds minimum)
- [ ] **TASK-024:** Create auth configuration with session strategy
- [ ] **TASK-025:** Set up middleware for protected admin routes
- [ ] **TASK-026:** Create `/admin/login` page with form
- [ ] **TASK-027:** Implement login API route with rate limiting
- [ ] **TASK-028:** Implement logout functionality
- [ ] **TASK-029:** Create password reset flow (optional for MVP)

### 2.3 Form Validation Setup
- [ ] **TASK-030:** Install React Hook Form and Zod
- [ ] **TASK-031:** Create Zod schemas for:
  - [ ] Contact inquiry form
  - [ ] Login form
  - [ ] Blog post form
  - [ ] Category form

---

## Phase 3: Public Pages - Core

### 3.1 Layout Components
- [ ] **TASK-032:** Create responsive header component (FR-related)
  - Logo on left, navigation on right
  - Sticky header with blur effect on scroll
  - Mobile hamburger menu
  - Dropdown mega-menu for services (7 service areas)
- [ ] **TASK-033:** Create footer component
  - 3-column layout (About, Services, Contact)
  - Social links (LinkedIn)
  - Copyright and legal links
- [ ] **TASK-034:** Create main layout wrapper with header/footer
- [ ] **TASK-035:** Create breadcrumb component for detail pages

### 3.2 Homepage (FR-001 to FR-006)
- [ ] **TASK-036:** Create hero section
  - Value proposition headline
  - Subheadline: "25+ years experience, ISO 13485 expertise"
  - Primary CTA: "Schedule Consultation"
  - Secondary CTA: "View Services"
- [ ] **TASK-037:** Create statistics section (4 metrics)
  - Years of experience: 25+
  - Projects delivered
  - Industries served
  - Certifications
- [ ] **TASK-038:** Create service overview cards (7 service areas from Skills.md)
  - Manufacturing Engineering & Operations
  - Quality & Regulatory Compliance
  - Injection Molding Process Excellence
  - Equipment & Mold Maintenance
  - Facility Design & Infrastructure
  - Supplier Development & Global Supply Chain
  - Strategic Advisory & Expert Services
- [ ] **TASK-039:** Create about preview section (2-column: image + text)
- [ ] **TASK-040:** Create latest blog posts section (3 most recent)
- [ ] **TASK-041:** Create contact CTA section

### 3.3 Services Page (FR-007 to FR-009)
- [ ] **TASK-042:** Create services hero section
- [ ] **TASK-043:** Create service navigation (tabs or sticky sidebar)
- [ ] **TASK-044:** Create detailed service sections for each area:
  - [ ] Manufacturing Engineering & Operations Excellence
  - [ ] Quality & Regulatory Compliance (6 sub-areas)
  - [ ] Injection Molding Process Excellence (including maintenance)
  - [ ] Facility Design & Infrastructure
  - [ ] Supplier Development & Global Supply Chain
  - [ ] Strategic Advisory & Expert Services (4 sub-areas)
- [ ] **TASK-045:** Create service delivery approach section
  - Discovery/assessment phase
  - Solution design phase
  - Implementation/execution phase
  - Validation and handoff phase
- [ ] **TASK-046:** Create industry applications section
  - Class I, II, III medical devices
  - Combination products
  - In-vitro diagnostics
  - Packaging components
- [ ] **TASK-047:** Create contact CTA section

### 3.4 About Page (FR-010 to FR-013)
- [ ] **TASK-048:** Create about hero section with professional headshot placeholder
- [ ] **TASK-049:** Create professional background section
  - Career summary (25+ years)
  - Current role at ResMed
  - Education: M.Sc. Organic Chemistry (Polymer specialization), PG Diploma in Plastics Engineering
- [ ] **TASK-050:** Create expertise areas section (grid/tag cloud)
  - Technical expertise from Skills.md
  - Regulatory knowledge (FDA, EU MDR, ISO 13485, MDSAP)
- [ ] **TASK-051:** Create professional philosophy section
- [ ] **TASK-052:** Create credentials timeline
- [ ] **TASK-053:** Add LinkedIn profile link
- [ ] **TASK-054:** Create downloadable CV section (optional)
- [ ] **TASK-055:** Create contact CTA section

### 3.5 Contact Page (FR-018 to FR-020)
- [ ] **TASK-056:** Create contact page layout (2-column: form + info)
- [ ] **TASK-057:** Build contact form with validation:
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Company name (optional)
  - Service interest (dropdown - 7 service areas + General Inquiry)
  - Project timeline (dropdown)
  - Message (required, 500 char minimum)
  - Privacy policy checkbox
  - Submit button with loading state
- [ ] **TASK-058:** Implement contact form submission API (`POST /api/contact`)
- [ ] **TASK-059:** Create success/error messaging
- [ ] **TASK-060:** Display alternative contact methods
- [ ] **TASK-061:** Add consultation scheduling link (Calendly placeholder)

---

## Phase 4: Public Pages - Content

### 4.1 Blog/Resources Pages (FR-014 to FR-017)
- [ ] **TASK-062:** Create blog listing page
  - Grid view of published articles
  - Category filter (horizontal tabs)
  - Search functionality
  - Pagination (10-15 posts per page)
- [ ] **TASK-063:** Create blog post card component
  - Featured image (16:9 ratio)
  - Category badge
  - Title, excerpt, read time, publish date
- [ ] **TASK-064:** Create individual blog post page (`[slug]`)
  - Featured image
  - Title, author, date, reading time
  - Share buttons (LinkedIn, Twitter, Email)
  - Article content (rich text rendering)
  - Related articles section
- [ ] **TASK-065:** Create blog categories page
- [ ] **TASK-066:** Implement blog API routes:
  - `GET /api/posts` (published, paginated, filtered)
  - `GET /api/posts/[slug]` (individual post)
  - `GET /api/categories`

### 4.2 Legal Pages (FR-021 to FR-022)
- [ ] **TASK-067:** Create privacy policy page
- [ ] **TASK-068:** Create terms of service page
- [ ] **TASK-069:** Create cookie policy page (optional)

### 4.3 Reusable Content Components
- [ ] **TASK-070:** Create CTA section component (reusable)
- [ ] **TASK-071:** Create testimonials carousel component (placeholder)
- [ ] **TASK-072:** Create service card component
- [ ] **TASK-073:** Create stat card component
- [ ] **TASK-074:** Create team/profile card component

---

## Phase 5: Admin Dashboard

### 5.1 Admin Layout
- [ ] **TASK-075:** Create admin layout wrapper
  - Sidebar navigation (collapsible on mobile)
  - Top bar with user profile
  - Protected route wrapper
- [ ] **TASK-076:** Create admin sidebar navigation component
  - Dashboard
  - Inquiries
  - Blog Posts
  - Categories
  - Settings (future)
- [ ] **TASK-077:** Create admin top bar with user info and logout

### 5.2 Dashboard Overview (FR-025 to FR-026)
- [ ] **TASK-078:** Create dashboard page
- [ ] **TASK-079:** Create analytics cards:
  - Total inquiries (all-time)
  - New inquiries (last 30 days)
  - Unread inquiries count
  - Published posts count
- [ ] **TASK-080:** Create recent activity feed
- [ ] **TASK-081:** Create top service interests chart (optional)
- [ ] **TASK-082:** Create quick action buttons

### 5.3 Inquiry Management (FR-027 to FR-030)
- [ ] **TASK-083:** Create inquiry list page
  - Sortable table: Date, Name, Email, Service Interest, Status
  - Filter by status: New, In Progress, Responded, Archived
  - Search by name, email, company
  - Pagination
- [ ] **TASK-084:** Create inquiry detail view/modal
  - Full inquiry information
  - Status change dropdown
  - Internal notes field
  - Mark as read/unread
- [ ] **TASK-085:** Implement inquiry API routes:
  - `GET /api/admin/inquiries` (paginated, filtered)
  - `GET /api/admin/inquiries/[id]`
  - `PUT /api/admin/inquiries/[id]` (update status, notes)
  - `DELETE /api/admin/inquiries/[id]`
- [ ] **TASK-086:** Implement inquiry actions:
  - Email response (open mail client)
  - Export to CSV
  - Archive functionality
- [ ] **TASK-087:** Create email notification system for new inquiries

### 5.4 Blog Management (FR-031 to FR-034)
- [ ] **TASK-088:** Create blog post list page
  - Table: Title, Status, Category, Publish Date
  - Filter by status: Draft, Published, Archived
  - Search by title
  - Sort by date, title
- [ ] **TASK-089:** Install and configure rich text editor (Tiptap)
- [ ] **TASK-090:** Create blog post editor page (create/edit)
  - Title field (required)
  - Slug field (auto-generated, editable)
  - Category selection (dropdown)
  - Rich text editor for content
  - Excerpt field
  - Featured image upload
  - SEO meta title and description
  - Publish date picker
  - Save as draft / Publish buttons
- [ ] **TASK-091:** Implement file upload for images (Uploadthing or similar)
- [ ] **TASK-092:** Create blog post preview functionality
- [ ] **TASK-093:** Implement blog admin API routes:
  - `GET /api/admin/posts` (all statuses)
  - `POST /api/admin/posts`
  - `PUT /api/admin/posts/[id]`
  - `DELETE /api/admin/posts/[id]`
- [ ] **TASK-094:** Create category management page
  - Create new category
  - Edit category name/slug
  - Delete category
  - Reorder categories
- [ ] **TASK-095:** Implement category API routes:
  - `POST /api/admin/categories`
  - `PUT /api/admin/categories/[id]`
  - `DELETE /api/admin/categories/[id]`

### 5.5 Admin Analytics (FR-035 to FR-036)
- [ ] **TASK-096:** Create analytics API route (`GET /api/admin/analytics`)
- [ ] **TASK-097:** Implement dashboard data aggregation

---

## Phase 6: SEO & Analytics

### 6.1 SEO Implementation (FR-037)
- [ ] **TASK-098:** Create dynamic metadata generation for all pages
- [ ] **TASK-099:** Implement Open Graph tags for social sharing
- [ ] **TASK-100:** Create JSON-LD structured data:
  - Organization schema
  - Service schemas (7 service areas)
  - BlogPosting schema for articles
  - Person schema for about page
- [ ] **TASK-101:** Generate XML sitemap (`/sitemap.xml`)
- [ ] **TASK-102:** Configure robots.txt
- [ ] **TASK-103:** Implement canonical URLs

### 6.2 Performance Optimization (FR-038)
- [ ] **TASK-104:** Optimize images with Next.js Image component
- [ ] **TASK-105:** Implement lazy loading for below-fold content
- [ ] **TASK-106:** Configure code splitting
- [ ] **TASK-107:** Analyze and optimize bundle size
- [ ] **TASK-108:** Test Core Web Vitals and optimize

### 6.3 Analytics Integration (FR-039)
- [ ] **TASK-109:** Set up Google Analytics 4
- [ ] **TASK-110:** Implement event tracking:
  - Form submissions
  - Button clicks (CTAs)
  - Page navigation
- [ ] **TASK-111:** Implement cookie consent banner (GDPR compliant)

---

## Phase 7: Testing & QA

### 7.1 Functional Testing
- [ ] **TASK-112:** Test contact form submission (TEST-001)
  - Valid submission saves to database
  - Email notification sent
  - Success/error messages display
  - Validation errors show correctly
- [ ] **TASK-113:** Test blog post management (TEST-002)
  - CRUD operations work correctly
  - Draft posts not visible publicly
  - Rich text formatting preserved
  - Image uploads work
- [ ] **TASK-114:** Test authentication flow (TEST-003)
  - Login with valid credentials
  - Login with invalid credentials fails
  - Session persistence
  - Logout clears session
- [ ] **TASK-115:** Test admin dashboard functionality (TEST-004)
  - Inquiry counts accurate
  - Filters and search work
  - Status updates persist

### 7.2 UI/UX Testing
- [ ] **TASK-116:** Responsive design testing (TEST-005)
  - Desktop: 1920px, 1440px, 1280px
  - Tablet: 1024px, 768px
  - Mobile: 428px, 375px, 320px
- [ ] **TASK-117:** Cross-browser testing (TEST-006)
  - Chrome
  - Firefox
  - Safari
  - Edge
- [ ] **TASK-118:** Accessibility testing (TEST-007)
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast (WCAG 2.1 Level AA)
  - Focus indicators

### 7.3 Performance Testing
- [ ] **TASK-119:** Load time testing (TEST-008)
  - Homepage < 2 seconds
  - Blog post < 2.5 seconds
  - Admin dashboard < 3 seconds
- [ ] **TASK-120:** Core Web Vitals audit
  - FCP < 1.5s
  - LCP < 2.5s
  - TTI < 3.5s

### 7.4 Security Testing
- [ ] **TASK-121:** Input validation testing (TEST-010)
  - SQL injection prevention
  - XSS prevention
- [ ] **TASK-122:** Authentication security testing (TEST-011)
  - Rate limiting on login
  - Session expiration
  - Protected route access

---

## Phase 8: Deployment & Launch

### 8.1 Pre-Deployment Setup
- [ ] **TASK-123:** Set up Vercel project
- [ ] **TASK-124:** Configure production environment variables
- [ ] **TASK-125:** Provision PostgreSQL database (Vercel Postgres or Railway)
- [ ] **TASK-126:** Run production database migration
- [ ] **TASK-127:** Create initial admin user in production
- [ ] **TASK-128:** Configure email service (SendGrid, Resend, etc.)

### 8.2 Domain & SSL
- [ ] **TASK-129:** Configure custom domain in Vercel
- [ ] **TASK-130:** Verify SSL certificate is active
- [ ] **TASK-131:** Set up www to non-www redirect (or vice versa)

### 8.3 Content Setup
- [ ] **TASK-132:** Seed initial blog categories:
  - Manufacturing Engineering
  - Quality Systems & Compliance
  - Process Development
  - Facility Design
  - Equipment & Mold Maintenance
  - Industry Trends
  - Case Studies
- [ ] **TASK-133:** Create 3-5 initial blog posts (from Skills.md topics)
- [ ] **TASK-134:** Review and finalize all service descriptions
- [ ] **TASK-135:** Review and finalize privacy policy and terms

### 8.4 Final QA
- [ ] **TASK-136:** Complete pre-launch checklist (DEPLOY-001 to DEPLOY-004)
- [ ] **TASK-137:** Test all forms in production
- [ ] **TASK-138:** Verify email notifications work
- [ ] **TASK-139:** Test analytics tracking
- [ ] **TASK-140:** Final mobile responsiveness check

### 8.5 Launch
- [ ] **TASK-141:** Deploy to production
- [ ] **TASK-142:** Submit sitemap to Google Search Console
- [ ] **TASK-143:** Verify Google Analytics data collection
- [ ] **TASK-144:** Announce on LinkedIn
- [ ] **TASK-145:** Monitor error logs for first 48 hours

---

## 🔮 Future Enhancements (Phase 2+)

### Backlog Items (Not for MVP)
- [ ] **FUTURE-001:** Client portal with secure login
- [ ] **FUTURE-002:** Calendly integration for online booking
- [ ] **FUTURE-003:** Downloadable resource library (templates, white papers)
- [ ] **FUTURE-004:** Newsletter subscription system
- [ ] **FUTURE-005:** Detailed case studies section
- [ ] **FUTURE-006:** Webinar hosting platform
- [ ] **FUTURE-007:** Advanced analytics (A/B testing, heat mapping)
- [ ] **FUTURE-008:** Multi-language support
- [ ] **FUTURE-009:** E-commerce for paid resources/courses
- [ ] **FUTURE-010:** Community forum

---

## 📝 Notes

### Service Areas to Highlight (from Skills.md)
1. **510(k) Submission Support** - High value, common need
2. **ISO 13485 Quality System Setup** - Foundation service
3. **Process Development & Validation** - Core expertise
4. **Equipment & Mold Maintenance** - Differentiator, recurring revenue
5. **Supplier Development** - Current ResMed focus

### Key SEO Keywords to Target
**Primary:**
- Medical device injection molding consultant
- ISO 13485 consultant
- Medical device manufacturing expert
- 510(k) submission preparation
- Injection molding process validation

**Secondary:**
- Cleanroom injection molding
- Scientific molding consultant
- Medical device facility design
- Mold maintenance programs medical device
- Equipment lifecycle management

### Design Reference
- Color Palette: Blues (#0066CC, #004999, #3399FF) with neutral grays
- Typography: Inter or Poppins (headings), Open Sans (body)
- Style: Professional, trustworthy, clean, modern

---

**Document Version:** 1.0  
**Created:** January 11, 2026  
**Based on:** PRD.md v1.0, Skills.md (Final Comprehensive)
